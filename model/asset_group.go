package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

// AssetGroup 素材资产组合，代理方舟 Asset Group，
// 用于按项目/人物分组管理素材。
// 分组归属「渠道 + 模型」：不同上游渠道、不同模型下各自维护独立分组列表。
type AssetGroup struct {
	Id               int            `json:"id"`
	UserId           int            `json:"user_id" gorm:"index"`
	UserName         string         `json:"user_name" gorm:"type:varchar(255)"`
	ChannelId        int            `json:"channel_id" gorm:"index"`              // 所属素材渠道（AssetChannel.Id），0 表示未绑定渠道
	Model            string         `json:"model" gorm:"type:varchar(64);index"`  // 所属模型
	UpstreamGroupId  string         `json:"upstream_group_id" gorm:"type:varchar(128);index"` // 方舟 Group ID
	Name             string         `json:"name" gorm:"type:varchar(64)"`
	Description      string         `json:"description" gorm:"type:varchar(300)"`
	GroupType        string         `json:"group_type" gorm:"type:varchar(32)"` // AIGC
	ProjectName      string         `json:"project_name" gorm:"type:varchar(64)"`
	CreatedTime      int64          `json:"created_time" gorm:"bigint"`
	DeletedAt        gorm.DeletedAt `gorm:"index"`
}

// GetAssetGroupsByUserId 分页查询某用户的素材资产组合列表
func GetAssetGroupsByUserId(userId int, keyword string, startIdx int, num int) (groups []*AssetGroup, total int64, err error) {
	return GetAssetGroupsByUserIdAndChannel(userId, 0, "", keyword, startIdx, num)
}

// GetAssetGroupsByUserIdAndChannel 分页查询某用户在某渠道+模型下的素材资产组合列表
func GetAssetGroupsByUserIdAndChannel(userId int, channelId int, modelName string, keyword string, startIdx int, num int) (groups []*AssetGroup, total int64, err error) {
	tx := DB.Begin()
	if tx.Error != nil {
		return nil, 0, tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	query := tx.Model(&AssetGroup{}).Where("user_id = ?", userId)
	if channelId > 0 {
		query = query.Where("channel_id = ?", channelId)
	}
	if modelName != "" {
		query = query.Where("model = ?", modelName)
	}
	if keyword != "" {
		query = query.Where("name LIKE ?", "%"+keyword+"%")
	}

	err = query.Count(&total).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	err = query.Order("id desc").Limit(num).Offset(startIdx).Find(&groups).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	if err = tx.Commit().Error; err != nil {
		return nil, 0, err
	}
	return groups, total, nil
}

// GetAssetGroupByIdAndUserId 按 ID + 用户 ID 查询（权限校验）
func GetAssetGroupByIdAndUserId(id int, userId int) (*AssetGroup, error) {
	var group AssetGroup
	err := DB.Where("id = ? AND user_id = ?", id, userId).First(&group).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("asset group not found or no permission")
		}
		return nil, err
	}
	return &group, nil
}

// GetAssetGroupByUpstreamId 按 UpstreamGroupId 查询
func GetAssetGroupByUpstreamId(upstreamId string) (*AssetGroup, error) {
	var group AssetGroup
	err := DB.Where("upstream_group_id = ?", upstreamId).First(&group).Error
	if err != nil {
		return nil, err
	}
	return &group, nil
}

// Insert 插入一条素材资产组合记录
func (g *AssetGroup) Insert() error {
	if g.CreatedTime == 0 {
		g.CreatedTime = common.GetTimestamp()
	}
	return DB.Create(g).Error
}

// Update 更新素材资产组合信息
func (g *AssetGroup) Update() error {
	return DB.Model(g).Updates(map[string]interface{}{
		"name":        g.Name,
		"description": g.Description,
	}).Error
}

// DeleteAssetGroupByIdAndUserId 删除指定用户的素材资产组合（权限校验）
func DeleteAssetGroupByIdAndUserId(id int, userId int) error {
	result := DB.Where("id = ? AND user_id = ?", id, userId).Delete(&AssetGroup{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("asset group not found or no permission")
	}
	return nil
}
