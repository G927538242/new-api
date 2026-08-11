package controller

import (
	"errors"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/asset_setting"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// 素材类型与大小限制（与火山引擎 Seedance 限制对齐）
const (
	assetTypeImage = "image"
	assetTypeVideo = "video"
	assetTypeAudio = "audio"

	maxImageSize = 30 * 1024 * 1024  // 30MB
	maxVideoSize = 200 * 1024 * 1024 // 200MB
	maxAudioSize = 15 * 1024 * 1024  // 15MB
)

// classifyAssetType 根据 MIME 类型判断素材类型
func classifyAssetType(mimeType string) string {
	mt := strings.ToLower(mimeType)
	switch {
	case strings.HasPrefix(mt, "image/"):
		return assetTypeImage
	case strings.HasPrefix(mt, "video/"):
		return assetTypeVideo
	case strings.HasPrefix(mt, "audio/"):
		return assetTypeAudio
	default:
		return ""
	}
}

// maxSizeForType 返回指定类型的最大文件大小
func maxSizeForType(assetType string) int64 {
	switch assetType {
	case assetTypeImage:
		return maxImageSize
	case assetTypeVideo:
		return maxVideoSize
	case assetTypeAudio:
		return maxAudioSize
	default:
		return 0
	}
}

// UploadAsset 上传素材文件，同步到方舟素材库（如已配置 AK/SK）
func UploadAsset(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		common.ApiErrorMsg(c, "no file uploaded: "+err.Error())
		return
	}
	defer file.Close()

	mimeType := header.Header.Get("Content-Type")
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}
	assetType := classifyAssetType(mimeType)
	if assetType == "" {
		common.ApiErrorMsg(c, "unsupported file type: "+mimeType)
		return
	}

	maxSize := maxSizeForType(assetType)
	if header.Size > maxSize {
		common.ApiErrorMsg(c, "file size exceeds limit for "+assetType)
		return
	}

	// 解析素材分组 ID（可选）
	groupIdStr := c.PostForm("group_id")
	groupId, _ := strconv.Atoi(groupIdStr)

	// 生成存储 key：{type}/{uuid}.{ext}
	ext := filepath.Ext(header.Filename)
	objectKey := filepath.Join(assetType, uuid.New().String()+ext)

	storage, err := service.GetAssetStorage()
	if err != nil {
		common.ApiError(c, err)
		return
	}

	url, err := storage.Upload(c.Request.Context(), file, objectKey, mimeType)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	asset := &model.Asset{
		UserId:      userId,
		GroupId:     groupId,
		Type:        assetType,
		Name:        header.Filename,
		StorageKey:  objectKey,
		URL:         url,
		Size:        header.Size,
		MimeType:    mimeType,
		Status:      "pending",
		CreatedTime: common.GetTimestamp(),
	}

	// 查找素材分组，获取方舟 Group ID
	if groupId > 0 {
		group, gErr := model.GetAssetGroupByIdAndUserId(groupId, userId)
		if gErr == nil {
			asset.UpstreamGroupId = group.UpstreamGroupId
		}
	}

	if err := asset.Insert(); err != nil {
		_ = storage.Delete(c.Request.Context(), objectKey)
		common.ApiError(c, err)
		return
	}

	// 异步同步到方舟素材库（如果配置了 AK/SK 且素材 URL 是公网可访问的）
	go syncAssetToArk(asset)

	common.ApiSuccess(c, asset)
}

// syncAssetToArk 异步将素材同步到方舟素材库
func syncAssetToArk(asset *model.Asset) {
	if !asset_setting.IsVolcConfigured() {
		_ = model.UpdateAssetStatus(asset.Id, "local")
		return
	}

	// 方舟 CreateAsset 要求公网可访问 URL，本地存储的相对路径不可用
	if !strings.HasPrefix(asset.URL, "http") {
		_ = model.UpdateAssetStatus(asset.Id, "local")
		return
	}

	// 需要有关联的方舟 Group ID
	if asset.UpstreamGroupId == "" {
		_ = model.UpdateAssetStatus(asset.Id, "local")
		return
	}

	ak, sk := asset_setting.GetVolcCredentials()
	client := service.NewArkAssetClient(ak, sk)

	// 方舟 AssetType 首字母大写：Image / Video / Audio
	arkAssetType := strings.Title(asset.Type)

	assetId, err := client.CreateAsset(&service.CreateAssetReq{
		AssetType: arkAssetType,
		GroupId:   asset.UpstreamGroupId,
		Name:      asset.Name,
		URL:       asset.URL,
	})
	if err != nil {
		_ = model.UpdateAssetStatus(asset.Id, "failed")
		return
	}

	_ = asset.UpdateUpstreamInfo(assetId, "processing")
}

// GetAllAssets 分页查询素材列表（支持按类型、模型、用户、租户、分组、状态筛选）
func GetAllAssets(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	userRole := c.GetInt("role")
	assetType := c.Query("type")
	modelParam := c.Query("model")
	tenantIdStr := c.Query("tenant_id")
	groupIdStr := c.Query("group_id")
	statusParam := c.Query("status")
	pageInfo := common.GetPageQuery(c)

	filter := &model.AssetFilter{
		AssetType: assetType,
		Model:     modelParam,
		Status:    statusParam,
	}

	if groupIdStr != "" {
		if parsedGroupId, err := strconv.Atoi(groupIdStr); err == nil {
			filter.GroupId = parsedGroupId
		}
	}

	// 管理员可按用户和租户筛选
	if userRole >= common.RoleAdminUser {
		if userIdStr := c.Query("user_id"); userIdStr != "" {
			if parsedUserId, err := strconv.Atoi(userIdStr); err == nil {
				filter.UserId = parsedUserId
			}
		}
		if tenantIdStr != "" {
			if parsedTenantId, err := strconv.Atoi(tenantIdStr); err == nil {
				filter.TenantId = parsedTenantId
			}
		}
	} else {
		filter.UserId = userId
	}

	assets, total, err := model.GetAssets(filter, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(assets)
	common.ApiSuccess(c, pageInfo)
}

// SearchAssets 搜索素材（支持按类型、模型、用户、租户、分组、状态筛选）
func SearchAssets(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	userRole := c.GetInt("role")
	keyword := c.Query("keyword")
	assetType := c.Query("type")
	modelParam := c.Query("model")
	tenantIdStr := c.Query("tenant_id")
	groupIdStr := c.Query("group_id")
	statusParam := c.Query("status")
	pageInfo := common.GetPageQuery(c)

	filter := &model.AssetFilter{
		AssetType: assetType,
		Model:     modelParam,
		Status:    statusParam,
	}

	if groupIdStr != "" {
		if parsedGroupId, err := strconv.Atoi(groupIdStr); err == nil {
			filter.GroupId = parsedGroupId
		}
	}

	if userRole >= common.RoleAdminUser {
		if userIdStr := c.Query("user_id"); userIdStr != "" {
			if parsedUserId, err := strconv.Atoi(userIdStr); err == nil {
				filter.UserId = parsedUserId
			}
		}
		if tenantIdStr != "" {
			if parsedTenantId, err := strconv.Atoi(tenantIdStr); err == nil {
				filter.TenantId = parsedTenantId
			}
		}
	} else {
		filter.UserId = userId
	}

	assets, total, err := model.SearchAssets(filter, keyword, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(assets)
	common.ApiSuccess(c, pageInfo)
}

// GetAsset 获取单个素材详情
func GetAsset(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}
	id, err := parseAssetId(c)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	asset, err := model.GetAssetByIdAndUserId(id, userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, asset)
}

// DeleteAsset 删除素材（同步删除方舟 Asset 和本地存储文件）
func DeleteAsset(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}
	id, err := parseAssetId(c)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	asset, err := model.GetAssetByIdAndUserId(id, userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 同步删除方舟素材（如有 UpstreamAssetId）
	if asset.UpstreamAssetId != "" && asset_setting.IsVolcConfigured() {
		ak, sk := asset_setting.GetVolcCredentials()
		client := service.NewArkAssetClient(ak, sk)
		_ = client.DeleteAsset(asset.UpstreamAssetId)
	}

	// 删除本地存储文件
	storage, stErr := service.GetAssetStorage()
	if stErr == nil {
		_ = storage.Delete(c.Request.Context(), asset.StorageKey)
	}

	if err := model.DeleteAssetByIdAndUserId(id, userId); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, "deleted")
}

// SyncAssetStatus 同步方舟素材状态（前端轮询用）
func SyncAssetStatus(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}
	id, err := parseAssetId(c)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	asset, err := model.GetAssetByIdAndUserId(id, userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 如果没有 UpstreamAssetId 或状态已是 active/failed/local，直接返回
	if asset.UpstreamAssetId == "" || asset.Status == "active" || asset.Status == "failed" || asset.Status == "local" {
		common.ApiSuccess(c, asset)
		return
	}

	// 查询方舟素材状态
	if !asset_setting.IsVolcConfigured() {
		common.ApiSuccess(c, asset)
		return
	}
	ak, sk := asset_setting.GetVolcCredentials()
	client := service.NewArkAssetClient(ak, sk)
	info, err := client.GetAsset(asset.UpstreamAssetId)
	if err != nil {
		common.ApiErrorMsg(c, "sync asset status from ark failed: "+err.Error())
		return
	}

	// 更新本地状态
	if info.Status != asset.Status {
		_ = model.UpdateAssetStatus(asset.Id, info.Status)
		asset.Status = info.Status
	}

	common.ApiSuccess(c, asset)
}

// ServeAssetFile 提供本地存储素材的文件访问（仅 local 模式有效）。
func ServeAssetFile(c *gin.Context) {
	key := c.Param("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "invalid key"})
		return
	}
	// 仅 local 模式提供文件服务；S3 模式下文件通过对象存储 URL 直接访问
	if asset_setting.IsConfigured() {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "use object storage URL instead"})
		return
	}
	filePath := service.LocalAssetPath(key)
	if filePath == "" {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "file not found"})
		return
	}
	c.File(filePath)
}

// parseAssetId 从路径参数解析素材 ID
func parseAssetId(c *gin.Context) (int, error) {
	idStr := c.Param("id")
	if idStr == "" {
		return 0, errors.New("invalid asset id")
	}
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		return 0, errors.New("invalid asset id")
	}
	return id, nil
}
