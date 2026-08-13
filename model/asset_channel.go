package model

import (
	"errors"
	"strings"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

// 素材上游渠道类型
const (
	AssetChannelTypeVolcArk = "volcark" // 字节官方（火山引擎方舟）
	AssetChannelTypeMoma    = "moma"    // 移动 MOMA 平台（预留）
)

// AssetChannel 素材上游渠道，素材库按渠道隔离管理（如字节官方、移动MOMA平台）。
// 每个渠道持有独立的 AK/SK 凭证与支持的模型列表，
// 素材分组与素材均归属到「渠道 + 模型」下。
type AssetChannel struct {
	Id          int            `json:"id"`
	Name        string         `json:"name" gorm:"type:varchar(64);index"`   // 渠道名称，如 字节官方
	Type        string         `json:"type" gorm:"type:varchar(32)"`         // 渠道类型：volcark / moma
	AccessKey   string         `json:"-" gorm:"type:varchar(255)"`           // 渠道 AK，不返回前端
	SecretKey   string         `json:"-" gorm:"type:varchar(255)"`           // 渠道 SK，不返回前端
	Models      string         `json:"models" gorm:"type:varchar(255)"`      // 支持的模型列表，逗号分隔
	Enabled     bool           `json:"enabled" gorm:"default:true"`          // 是否启用
	Description string         `json:"description" gorm:"type:varchar(300)"` // 渠道说明
	CreatedTime int64          `json:"created_time" gorm:"bigint"`
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}

// ModelList 返回渠道支持的模型列表
func (c *AssetChannel) ModelList() []string {
	var models []string
	for _, m := range strings.Split(c.Models, ",") {
		m = strings.TrimSpace(m)
		if m != "" {
			models = append(models, m)
		}
	}
	return models
}

// HasCredentials 渠道是否已配置上游凭证
func (c *AssetChannel) HasCredentials() bool {
	return c.AccessKey != "" && c.SecretKey != ""
}

// GetAllAssetChannels 查询全部素材渠道（管理端用）
func GetAllAssetChannels() ([]*AssetChannel, error) {
	var channels []*AssetChannel
	err := DB.Order("id asc").Find(&channels).Error
	return channels, err
}

// GetEnabledAssetChannels 查询已启用的素材渠道
func GetEnabledAssetChannels() ([]*AssetChannel, error) {
	var channels []*AssetChannel
	err := DB.Where("enabled = ?", true).Order("id asc").Find(&channels).Error
	return channels, err
}

// GetAssetChannelById 按 ID 查询素材渠道
func GetAssetChannelById(id int) (*AssetChannel, error) {
	var channel AssetChannel
	err := DB.First(&channel, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("asset channel not found")
		}
		return nil, err
	}
	return &channel, nil
}

// GetAssetChannelIdByModel 根据模型名找到归属渠道 ID（-1 表示未找到）
func GetAssetChannelIdByModel(modelName string) (int, error) {
	channels, err := GetEnabledAssetChannels()
	if err != nil {
		return -1, err
	}
	for _, ch := range channels {
		for _, m := range ch.ModelList() {
			if m == modelName {
				return ch.Id, nil
			}
		}
	}
	return -1, nil
}

// Insert 插入一条素材渠道记录
func (c *AssetChannel) Insert() error {
	if c.CreatedTime == 0 {
		c.CreatedTime = common.GetTimestamp()
	}
	return DB.Create(c).Error
}

// Update 更新素材渠道信息（空字符串的 AK/SK 表示保持不变，由控制器处理）
func (c *AssetChannel) Update() error {
	return DB.Model(c).Updates(map[string]interface{}{
		"name":        c.Name,
		"type":        c.Type,
		"access_key":  c.AccessKey,
		"secret_key":  c.SecretKey,
		"models":      c.Models,
		"enabled":     c.Enabled,
		"description": c.Description,
	}).Error
}

// DeleteAssetChannel 删除素材渠道（软删除）
func DeleteAssetChannel(id int) error {
	result := DB.Delete(&AssetChannel{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("asset channel not found")
	}
	return nil
}
