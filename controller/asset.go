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

	// 解析素材分组 ID（必填：素材必须放入素材分组）
	groupIdStr := c.PostForm("group_id")
	groupId, _ := strconv.Atoi(groupIdStr)

	// 解析关联模型（必填：素材必须归属对应模型）
	modelName := strings.TrimSpace(c.PostForm("model"))

	// 解析所属渠道
	channelIdStr := c.PostForm("channel_id")
	channelId, _ := strconv.Atoi(channelIdStr)

	// 素材必须放在素材分组和对应模型里面
	if groupId <= 0 {
		common.ApiErrorMsg(c, "group_id is required, asset must belong to an asset group")
		return
	}
	if modelName == "" {
		common.ApiErrorMsg(c, "model is required, asset must belong to a model")
		return
	}

	// 校验分组归属：分组必须属于当前渠道 + 模型
	group, gErr := model.GetAssetGroupByIdAndUserId(groupId, userId)
	if gErr != nil {
		common.ApiErrorMsg(c, "asset group not found or no permission")
		return
	}
	if channelId <= 0 {
		channelId = group.ChannelId
	}
	if channelId <= 0 {
		common.ApiErrorMsg(c, "channel_id is required, asset group has no channel binding")
		return
	}
	if group.ChannelId != channelId || group.Model != modelName {
		common.ApiErrorMsg(c, "asset group does not belong to the given channel or model")
		return
	}
	if err := validateChannelModel(channelId, modelName); err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}

	// 生成存储 key：{type}/{uuid}.{ext}
	ext := filepath.Ext(header.Filename)
	objectKey := filepath.Join(assetType, uuid.New().String()+ext)

	storage, err := service.GetAssetStorage()
	if err != nil {
		common.ApiError(c, err)
		return
	}

	url, err := storage.Upload(c.Request.Context(), file, header.Size, objectKey, mimeType)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	asset := &model.Asset{
		UserId:      userId,
		ChannelId:   channelId,
		GroupId:     groupId,
		Model:       modelName,
		Type:        assetType,
		Name:        header.Filename,
		StorageKey:  objectKey,
		URL:         url,
		Size:        header.Size,
		MimeType:    mimeType,
		Status:      "pending",
		CreatedTime: common.GetTimestamp(),
	}

	// 从分组获取上游 Group ID
	asset.UpstreamGroupId = group.UpstreamGroupId

	if err := asset.Insert(); err != nil {
		_ = storage.Delete(c.Request.Context(), objectKey)
		common.ApiError(c, err)
		return
	}

	// 异步同步到上游素材库（按渠道凭证）
	go syncAssetToArk(asset, channelId)

	common.ApiSuccess(c, asset)
}

// syncAssetToArk 异步将素材同步到上游素材库（按渠道 AK/SK）
func syncAssetToArk(asset *model.Asset, channelId int) {
	// 使用渠道凭证；渠道不可用时回退全局配置
	var ak, sk string
	var err error
	if channelId > 0 {
		var channel *model.AssetChannel
		channel, err = model.GetAssetChannelById(channelId)
		if err == nil && channel.HasCredentials() && channel.Type == model.AssetChannelTypeVolcArk {
			ak, sk = channel.AccessKey, channel.SecretKey
		}
	}
	if ak == "" || sk == "" {
		if !asset_setting.IsVolcConfigured() {
			_ = model.UpdateAssetStatus(asset.Id, "local")
			return
		}
		ak, sk = asset_setting.GetVolcCredentials()
	}

	// 上游 CreateAsset 要求公网可访问 URL，本地存储的相对路径不可用
	if !strings.HasPrefix(asset.URL, "http") {
		_ = model.UpdateAssetStatus(asset.Id, "local")
		return
	}

	// 需要有关联的上游 Group ID
	if asset.UpstreamGroupId == "" {
		_ = model.UpdateAssetStatus(asset.Id, "local")
		return
	}

	client := service.NewArkAssetClient(ak, sk)

	// 上游 AssetType 首字母大写：Image / Video / Audio
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
	channelIdStr := c.Query("channel_id")
	groupIdStr := c.Query("group_id")
	statusParam := c.Query("status")
	pageInfo := common.GetPageQuery(c)

	filter := &model.AssetFilter{
		AssetType: assetType,
		Model:     modelParam,
		Status:    statusParam,
	}

	if channelIdStr != "" {
		if parsedChannelId, err := strconv.Atoi(channelIdStr); err == nil {
			filter.ChannelId = parsedChannelId
		}
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
	channelIdStr := c.Query("channel_id")
	groupIdStr := c.Query("group_id")
	statusParam := c.Query("status")
	pageInfo := common.GetPageQuery(c)

	filter := &model.AssetFilter{
		AssetType: assetType,
		Model:     modelParam,
		Status:    statusParam,
	}

	if channelIdStr != "" {
		if parsedChannelId, err := strconv.Atoi(channelIdStr); err == nil {
			filter.ChannelId = parsedChannelId
		}
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
	userRole := c.GetInt("role")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}
	id, err := parseAssetId(c)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	var asset *model.Asset
	if userRole >= common.RoleAdminUser {
		asset, err = model.GetAssetById(id)
	} else {
		asset, err = model.GetAssetByIdAndUserId(id, userId)
	}
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, asset)
}

// DeleteAsset 删除素材（同步删除方舟 Asset 和本地存储文件）
func DeleteAsset(c *gin.Context) {
	userId := c.GetInt("id")
	userRole := c.GetInt("role")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}
	id, err := parseAssetId(c)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 管理员可以删除任意素材，普通用户只能删除自己的素材
	var asset *model.Asset
	if userRole >= common.RoleAdminUser {
		asset, err = model.GetAssetById(id)
	} else {
		asset, err = model.GetAssetByIdAndUserId(id, userId)
	}
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 同步删除上游素材（如有 UpstreamAssetId，优先使用渠道凭证）
	if asset.UpstreamAssetId != "" {
		if ak, sk, ok := getAssetUpstreamCredentials(asset); ok {
			client := service.NewArkAssetClient(ak, sk)
			_ = client.DeleteAsset(asset.UpstreamAssetId)
		} else if asset_setting.IsVolcConfigured() {
			ak, sk := asset_setting.GetVolcCredentials()
			client := service.NewArkAssetClient(ak, sk)
			_ = client.DeleteAsset(asset.UpstreamAssetId)
		}
	}

	// 删除本地存储文件
	storage, stErr := service.GetAssetStorage()
	if stErr == nil {
		_ = storage.Delete(c.Request.Context(), asset.StorageKey)
	}

	// 删除数据库记录（管理员绕过用户权限校验直接删）
	if userRole >= common.RoleAdminUser {
		var a model.Asset
		a.Id = id
		if err := a.Delete(); err != nil {
			common.ApiError(c, err)
			return
		}
	} else {
		if err := model.DeleteAssetByIdAndUserId(id, userId); err != nil {
			common.ApiError(c, err)
			return
		}
	}
	common.ApiSuccess(c, "deleted")
}

// SyncAssetStatus 同步方舟素材状态（前端轮询用）
func SyncAssetStatus(c *gin.Context) {
	userId := c.GetInt("id")
	userRole := c.GetInt("role")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}
	id, err := parseAssetId(c)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	var asset *model.Asset
	if userRole >= common.RoleAdminUser {
		asset, err = model.GetAssetById(id)
	} else {
		asset, err = model.GetAssetByIdAndUserId(id, userId)
	}
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 如果没有 UpstreamAssetId 或状态已是 active/failed/local，直接返回
	if asset.UpstreamAssetId == "" || asset.Status == "active" || asset.Status == "failed" || asset.Status == "local" {
		common.ApiSuccess(c, asset)
		return
	}

	// 查询上游素材状态
	ak, sk, ok := getAssetUpstreamCredentials(asset)
	if !ok {
		if !asset_setting.IsVolcConfigured() {
			common.ApiSuccess(c, asset)
			return
		}
		ak, sk = asset_setting.GetVolcCredentials()
	}
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

// getAssetUpstreamCredentials 获取素材所属渠道的上游凭证（仅 volcark 类型）
func getAssetUpstreamCredentials(asset *model.Asset) (string, string, bool) {
	if asset.ChannelId <= 0 {
		return "", "", false
	}
	channel, err := model.GetAssetChannelById(asset.ChannelId)
	if err != nil {
		return "", "", false
	}
	if !channel.HasCredentials() || channel.Type != model.AssetChannelTypeVolcArk {
		return "", "", false
	}
	return channel.AccessKey, channel.SecretKey, true
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
