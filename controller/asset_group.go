package controller

import (
	"errors"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/asset_setting"

	"github.com/gin-gonic/gin"
)

// getArkAssetClient 获取方舟素材 API 客户端，未配置 AK/SK 时返回错误
func getArkAssetClient() (*service.ArkAssetClient, error) {
	if !asset_setting.IsVolcConfigured() {
		return nil, errors.New("volc engine AK/SK not configured for asset library")
	}
	ak, sk := asset_setting.GetVolcCredentials()
	return service.NewArkAssetClient(ak, sk), nil
}

// CreateAssetGroup 创建素材资产组合，归属「渠道 + 模型」
func CreateAssetGroup(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
		ChannelId   int    `json:"channel_id"`
		Model       string `json:"model"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "invalid request: "+err.Error())
		return
	}
	if req.ChannelId <= 0 {
		common.ApiErrorMsg(c, "channel_id is required")
		return
	}
	if req.Model == "" {
		common.ApiErrorMsg(c, "model is required")
		return
	}

	// 校验渠道归属：模型必须在该渠道支持范围内
	if err := validateChannelModel(req.ChannelId, req.Model); err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}

	// 创建上游分组（如渠道接入上游且凭证可用）；否则仅本地创建分组
	group := &model.AssetGroup{
		UserId:          userId,
		ChannelId:       req.ChannelId,
		Model:           req.Model,
		Name:            req.Name,
		Description:     req.Description,
		GroupType:       "AIGC",
		ProjectName:     "default",
	}
	if client, err := getChannelArkClient(req.ChannelId); err == nil {
		groupId, err := client.CreateAssetGroup(&service.CreateAssetGroupReq{
			Name:        req.Name,
			Description: req.Description,
		})
		if err != nil {
			common.ApiErrorMsg(c, "create asset group on ark failed: "+err.Error())
			return
		}
		group.UpstreamGroupId = groupId
	}

	if err := group.Insert(); err != nil {
		// 本地入库失败，尝试清理已创建的上游资源
		if group.UpstreamGroupId != "" {
			if client, cErr := getChannelArkClient(req.ChannelId); cErr == nil {
				_ = client.DeleteAssetGroup(group.UpstreamGroupId)
			}
		}
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, group)
}

// validateChannelModel 校验模型是否属于指定渠道
func validateChannelModel(channelId int, modelName string) error {
	channel, err := model.GetAssetChannelById(channelId)
	if err != nil {
		return err
	}
	if !channel.Enabled {
		return errors.New("asset channel is disabled")
	}
	for _, m := range channel.ModelList() {
		if m == modelName {
			return nil
		}
	}
	return errors.New("model not supported by this asset channel")
}

// ListAssetGroups 查询素材资产组合列表（支持按渠道、模型、关键字过滤）
func ListAssetGroups(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	keyword := c.Query("keyword")
	channelIdStr := c.Query("channel_id")
	modelName := c.Query("model")
	pageInfo := common.GetPageQuery(c)

	channelId := 0
	if channelIdStr != "" {
		channelId, _ = strconv.Atoi(channelIdStr)
	}

	groups, total, err := model.GetAssetGroupsByUserIdAndChannel(userId, channelId, modelName, keyword, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}
	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(groups)
	common.ApiSuccess(c, pageInfo)
}

// GetAssetGroup 获取单个素材资产组合详情
func GetAssetGroup(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		common.ApiErrorMsg(c, "invalid asset group id")
		return
	}

	group, err := model.GetAssetGroupByIdAndUserId(id, userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, group)
}

// UpdateAssetGroup 更新素材资产组合
func UpdateAssetGroup(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		common.ApiErrorMsg(c, "invalid asset group id")
		return
	}

	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "invalid request: "+err.Error())
		return
	}

	group, err := model.GetAssetGroupByIdAndUserId(id, userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 同步更新到方舟（使用分组所属渠道的凭证；未接上游或凭证不可用时跳过）
	if group.UpstreamGroupId != "" {
		if client, err := getChannelArkClient(group.ChannelId); err == nil {
			if err := client.UpdateAssetGroup(group.UpstreamGroupId, req.Name, req.Description); err != nil {
				common.ApiErrorMsg(c, "update asset group on ark failed: "+err.Error())
				return
			}
		}
	}

	// 更新本地记录
	group.Name = req.Name
	group.Description = req.Description
	if err := group.Update(); err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, group)
}

// DeleteAssetGroup 删除素材资产组合
func DeleteAssetGroup(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		common.ApiErrorMsg(c, "invalid asset group id")
		return
	}

	group, err := model.GetAssetGroupByIdAndUserId(id, userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 同步删除方舟资源（使用分组所属渠道的凭证；未接上游或凭证不可用时跳过）
	if group.UpstreamGroupId != "" {
		if client, err := getChannelArkClient(group.ChannelId); err == nil {
			if err := client.DeleteAssetGroup(group.UpstreamGroupId); err != nil {
				common.ApiErrorMsg(c, "delete asset group on ark failed: "+err.Error())
				return
			}
		}
	}

	// 删除本地记录
	if err := model.DeleteAssetGroupByIdAndUserId(id, userId); err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, "deleted")
}
