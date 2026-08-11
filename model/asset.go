package model

import (
	"errors"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

// Asset 素材库条目，用户私有的图片/视频/音频素材，
// 用于 Seedance 等视频生成渠道的多模态输入引用。
// 素材上传后会同步到方舟素材库（CreateAsset），获得 UpstreamAssetId，
// 视频生成时通过 asset://<UpstreamAssetId> 引用。
type Asset struct {
	Id               int            `json:"id"`
	UserId           int            `json:"user_id" gorm:"index"`
	UserName         string         `json:"user_name" gorm:"type:varchar(255)"`
	TenantId         int            `json:"tenant_id" gorm:"index"`
	TenantName       string         `json:"tenant_name" gorm:"type:varchar(255)"`
	GroupId          int            `json:"group_id" gorm:"index"`                       // 所属素材分组（本平台 AssetGroup.Id）
	UpstreamGroupId  string         `json:"upstream_group_id" gorm:"type:varchar(128)"`  // 方舟 Group ID
	UpstreamAssetId  string         `json:"upstream_asset_id" gorm:"type:varchar(128);index"` // 方舟 Asset ID，用于 asset:// 引用
	Status           string         `json:"status" gorm:"type:varchar(16);index"`        // pending / active / failed
	Model            string         `json:"model" gorm:"type:varchar(64);index"`         // sendance-2.0 / sendance-2.5
	Type             string         `json:"type" gorm:"type:varchar(16);index"`          // image / video / audio
	Name             string         `json:"name" gorm:"type:varchar(255)"`               // 原始文件名
	StorageKey       string         `json:"storage_key" gorm:"type:varchar(512)"`        // 对象存储 key
	URL              string         `json:"url" gorm:"type:varchar(1024)"`               // 可访问 URL（需公网可达，供方舟下载）
	Size             int64          `json:"size" gorm:"bigint"`                          // 文件大小（字节）
	MimeType         string         `json:"mime_type" gorm:"type:varchar(128)"`
	Duration         float64        `json:"duration"`     // 时长（秒），仅视频/音频
	Width            int            `json:"width"`        // 宽度（px），仅图片/视频
	Height           int            `json:"height"`       // 高度（px），仅图片/视频
	CreatedTime      int64          `json:"created_time" gorm:"bigint"`
	DeletedAt        gorm.DeletedAt `gorm:"index"`
}

// AssetFilter 素材查询筛选参数
type AssetFilter struct {
	UserId     int
	AssetType  string
	Model      string
	TenantId   int
	GroupId    int    // 按素材分组筛选
	Status     string // 按素材状态筛选（pending/active/failed）
}

// GetAssetsByUserId 分页查询某用户的素材列表
func GetAssetsByUserId(userId int, assetType string, startIdx int, num int) (assets []*Asset, total int64, err error) {
	filter := &AssetFilter{
		UserId:    userId,
		AssetType: assetType,
	}
	return GetAssets(filter, startIdx, num)
}

// GetAssets 分页查询素材列表（支持多条件筛选）
func GetAssets(filter *AssetFilter, startIdx int, num int) (assets []*Asset, total int64, err error) {
	tx := DB.Begin()
	if tx.Error != nil {
		return nil, 0, tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	query := tx.Model(&Asset{})
	if filter.UserId > 0 {
		query = query.Where("user_id = ?", filter.UserId)
	}
	if filter.AssetType != "" {
		query = query.Where("type = ?", filter.AssetType)
	}
	if filter.Model != "" {
		query = query.Where("model = ?", filter.Model)
	}
	if filter.TenantId > 0 {
		query = query.Where("tenant_id = ?", filter.TenantId)
	}
	if filter.GroupId > 0 {
		query = query.Where("group_id = ?", filter.GroupId)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	err = query.Count(&total).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	err = query.Order("id desc").Limit(num).Offset(startIdx).Find(&assets).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	if err = tx.Commit().Error; err != nil {
		return nil, 0, err
	}
	return assets, total, nil
}

// SearchAssetsByUserId 按关键词搜索某用户的素材
func SearchAssetsByUserId(userId int, keyword string, assetType string, startIdx int, num int) (assets []*Asset, total int64, err error) {
	filter := &AssetFilter{
		UserId:    userId,
		AssetType: assetType,
	}
	return SearchAssets(filter, keyword, startIdx, num)
}

// SearchAssets 按关键词搜索素材（支持多条件筛选）
func SearchAssets(filter *AssetFilter, keyword string, startIdx int, num int) (assets []*Asset, total int64, err error) {
	tx := DB.Begin()
	if tx.Error != nil {
		return nil, 0, tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	query := tx.Model(&Asset{})
	if filter.UserId > 0 {
		query = query.Where("user_id = ?", filter.UserId)
	}
	if filter.AssetType != "" {
		query = query.Where("type = ?", filter.AssetType)
	}
	if filter.Model != "" {
		query = query.Where("model = ?", filter.Model)
	}
	if filter.TenantId > 0 {
		query = query.Where("tenant_id = ?", filter.TenantId)
	}
	if filter.GroupId > 0 {
		query = query.Where("group_id = ?", filter.GroupId)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if keyword != "" {
		query = query.Where("name LIKE ?", "%"+keyword+"%")
	}

	err = query.Count(&total).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	err = query.Order("id desc").Limit(num).Offset(startIdx).Find(&assets).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	if err = tx.Commit().Error; err != nil {
		return nil, 0, err
	}
	return assets, total, nil
}

// GetAssetById 按 ID 查询素材
func GetAssetById(id int) (*Asset, error) {
	var asset Asset
	err := DB.First(&asset, id).Error
	return &asset, err
}

// GetAssetByURL 按 URL 精确匹配查询素材，用于将素材转存到上游前定位存储 key。
func GetAssetByURL(url string) (*Asset, error) {
	var asset Asset
	err := DB.Where("url = ?", url).First(&asset).Error
	if err != nil {
		return nil, err
	}
	return &asset, nil
}

// GetAssetByIdAndUserId 按 ID + 用户 ID 查询（权限校验，确保用户只能访问自己的素材）
func GetAssetByIdAndUserId(id int, userId int) (*Asset, error) {
	var asset Asset
	err := DB.Where("id = ? AND user_id = ?", id, userId).First(&asset).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("asset not found or no permission")
		}
		return nil, err
	}
	return &asset, nil
}

// Insert 插入一条素材记录
func (a *Asset) Insert() error {
	if a.CreatedTime == 0 {
		a.CreatedTime = common.GetTimestamp()
	}
	return DB.Create(a).Error
}

// UpdateUpstreamInfo 更新素材的上游 Asset ID 和状态
func (a *Asset) UpdateUpstreamInfo(upstreamAssetId, status string) error {
	return DB.Model(a).Updates(map[string]interface{}{
		"upstream_asset_id": upstreamAssetId,
		"status":             status,
	}).Error
}

// UpdateStatus 更新素材状态
func UpdateAssetStatus(id int, status string) error {
	return DB.Model(&Asset{}).Where("id = ?", id).Update("status", status).Error
}

// GetAssetsByUpstreamAssetId 按上游 Asset ID 查询（用于 asset:// 引用解析）
func GetAssetByUpstreamAssetId(upstreamAssetId string) (*Asset, error) {
	var asset Asset
	err := DB.Where("upstream_asset_id = ?", upstreamAssetId).First(&asset).Error
	if err != nil {
		return nil, err
	}
	return &asset, nil
}

// Delete 删除一条素材记录（软删除）
func (a *Asset) Delete() error {
	return DB.Delete(a).Error
}

// DeleteAssetByIdAndUserId 删除指定用户的素材（权限校验）
func DeleteAssetByIdAndUserId(id int, userId int) error {
	result := DB.Where("id = ? AND user_id = ?", id, userId).Delete(&Asset{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("asset not found or no permission")
	}
	return nil
}
