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

// UploadAsset 上传素材文件
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

	// 生成存储 key：{userId}/{uuid}.{ext}
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
		Type:        assetType,
		Name:        header.Filename,
		StorageKey:  objectKey,
		URL:         url,
		Size:        header.Size,
		MimeType:    mimeType,
		CreatedTime: common.GetTimestamp(),
	}
	if err := asset.Insert(); err != nil {
		// 上传成功但入库失败，尝试清理已上传文件
		_ = storage.Delete(c.Request.Context(), objectKey)
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, asset)
}

// GetAllAssets 分页查询素材列表（支持按类型、模型、用户、租户筛选）
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
	pageInfo := common.GetPageQuery(c)

	filter := &model.AssetFilter{
		AssetType: assetType,
		Model:     modelParam,
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
		// 普通用户只能查看自己的素材
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

// SearchAssets 搜索素材（支持按类型、模型、用户、租户筛选）
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
	pageInfo := common.GetPageQuery(c)

	filter := &model.AssetFilter{
		AssetType: assetType,
		Model:     modelParam,
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
		// 普通用户只能查看自己的素材
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

// DeleteAsset 删除素材
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

	// 先删除存储文件，再删除数据库记录
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
