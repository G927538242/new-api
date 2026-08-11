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

// CreateAssetGroup 创建素材资产组合
func CreateAssetGroup(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	var req struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "invalid request: "+err.Error())
		return
	}

	client, err := getArkAssetClient()
	if err != nil {
		common.ApiError(c, err)
		return
	}

	groupId, err := client.CreateAssetGroup(&service.CreateAssetGroupReq{
		Name:        req.Name,
		Description: req.Description,
	})
	if err != nil {
		common.ApiErrorMsg(c, "create asset group on ark failed: "+err.Error())
		return
	}

	group := &model.AssetGroup{
		UserId:          userId,
		UpstreamGroupId: groupId,
		Name:            req.Name,
		Description:     req.Description,
		GroupType:       "AIGC",
		ProjectName:     "default",
	}
	if err := group.Insert(); err != nil {
		// 方舟已创建成功但本地入库失败，尝试清理方舟资源
		_ = client.DeleteAssetGroup(groupId)
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, group)
}

// ListAssetGroups 查询素材资产组合列表
func ListAssetGroups(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	keyword := c.Query("keyword")
	pageInfo := common.GetPageQuery(c)

	groups, total, err := model.GetAssetGroupsByUserId(userId, keyword, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
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

	// 同步更新到方舟
	client, err := getArkAssetClient()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if err := client.UpdateAssetGroup(group.UpstreamGroupId, req.Name, req.Description); err != nil {
		common.ApiErrorMsg(c, "update asset group on ark failed: "+err.Error())
		return
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

	// 同步删除方舟资源
	client, err := getArkAssetClient()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if err := client.DeleteAssetGroup(group.UpstreamGroupId); err != nil {
		common.ApiErrorMsg(c, "delete asset group on ark failed: "+err.Error())
		return
	}

	// 删除本地记录
	if err := model.DeleteAssetGroupByIdAndUserId(id, userId); err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, "deleted")
}
