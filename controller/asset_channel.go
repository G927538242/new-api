package controller

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"

	"github.com/gin-gonic/gin"
)

// getChannelArkClient 根据渠道 ID 获取方舟素材 API 客户端（仅 volcark 类型渠道）。
// 渠道未配置凭证或类型不支持时返回错误。
func getChannelArkClient(channelId int) (*service.ArkAssetClient, error) {
	channel, err := model.GetAssetChannelById(channelId)
	if err != nil {
		return nil, err
	}
	if !channel.HasCredentials() {
		return nil, errors.New("channel credentials not configured")
	}
	if channel.Type != model.AssetChannelTypeVolcArk {
		return nil, fmt.Errorf("unsupported channel type: %s", channel.Type)
	}
	return service.NewArkAssetClient(channel.AccessKey, channel.SecretKey), nil
}


// AssetChannelResponse 素材渠道响应结构，隐藏 AK/SK 凭证。
type AssetChannelResponse struct {
	Id             int    `json:"id"`
	Name           string `json:"name"`
	Type           string `json:"type"`
	Models         string `json:"models"`
	Enabled        bool   `json:"enabled"`
	Description    string `json:"description"`
	HasCredentials bool   `json:"has_credentials"`
	CreatedTime    int64  `json:"created_time"`
}

func toAssetChannelResponse(c *model.AssetChannel) *AssetChannelResponse {
	return &AssetChannelResponse{
		Id:             c.Id,
		Name:           c.Name,
		Type:           c.Type,
		Models:         c.Models,
		Enabled:        c.Enabled,
		Description:    c.Description,
		HasCredentials: c.HasCredentials(),
		CreatedTime:    c.CreatedTime,
	}
}

func toAssetChannelResponseList(channels []*model.AssetChannel) []*AssetChannelResponse {
	resp := make([]*AssetChannelResponse, 0, len(channels))
	for _, ch := range channels {
		resp = append(resp, toAssetChannelResponse(ch))
	}
	return resp
}

// ListAssetChannels 查询素材渠道列表（登录用户可用，素材库页面据此展示模型→渠道映射）
func ListAssetChannels(c *gin.Context) {
	channels, err := model.GetAllAssetChannels()
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, toAssetChannelResponseList(channels))
}

// GetAssetChannel 获取单个素材渠道详情
func GetAssetChannel(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		common.ApiErrorMsg(c, "invalid asset channel id")
		return
	}
	channel, err := model.GetAssetChannelById(id)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, toAssetChannelResponse(channel))
}

// assetChannelUpsertReq 创建/更新素材渠道请求
type assetChannelUpsertReq struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	AccessKey   string `json:"access_key"`
	SecretKey   string `json:"secret_key"`
	Models      string `json:"models"`
	Enabled     *bool  `json:"enabled"`
	Description string `json:"description"`
}

// CreateAssetChannel 创建素材渠道（管理端）
func CreateAssetChannel(c *gin.Context) {
	var req assetChannelUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "invalid request: "+err.Error())
		return
	}
	if req.Name == "" {
		common.ApiErrorMsg(c, "channel name is required")
		return
	}
	if req.Type == "" {
		req.Type = model.AssetChannelTypeVolcArk
	}
	enabled := true
	if req.Enabled != nil {
		enabled = *req.Enabled
	}

	channel := &model.AssetChannel{
		Name:        req.Name,
		Type:        req.Type,
		AccessKey:   req.AccessKey,
		SecretKey:   req.SecretKey,
		Models:      req.Models,
		Enabled:     enabled,
		Description: req.Description,
	}
	if err := channel.Insert(); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, toAssetChannelResponse(channel))
}

// UpdateAssetChannel 更新素材渠道（管理端，AK/SK 留空表示保持不变）
func UpdateAssetChannel(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		common.ApiErrorMsg(c, "invalid asset channel id")
		return
	}

	var req assetChannelUpsertReq
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "invalid request: "+err.Error())
		return
	}

	channel, err := model.GetAssetChannelById(id)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	if req.Name != "" {
		channel.Name = req.Name
	}
	if req.Type != "" {
		channel.Type = req.Type
	}
	if req.AccessKey != "" {
		channel.AccessKey = req.AccessKey
	}
	if req.SecretKey != "" {
		channel.SecretKey = req.SecretKey
	}
	if req.Models != "" {
		channel.Models = req.Models
	}
	if req.Enabled != nil {
		channel.Enabled = *req.Enabled
	}
	channel.Description = req.Description

	if err := channel.Update(); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, toAssetChannelResponse(channel))
}

// DeleteAssetChannel 删除素材渠道（管理端）
func DeleteAssetChannel(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id <= 0 {
		common.ApiErrorMsg(c, "invalid asset channel id")
		return
	}
	if err := model.DeleteAssetChannel(id); err != nil {
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, "deleted")
}
