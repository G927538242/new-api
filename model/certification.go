package model

import (
	"errors"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

// 用户实名认证状态（users.cert_status）
const (
	CertStatusNone     = 0 // 未认证
	CertStatusPending  = 1 // 待审核
	CertStatusApproved = 2 // 已认证
	CertStatusRejected = 3 // 已驳回
)

// 认证类型
const (
	CertTypePersonal   = "personal"
	CertTypeEnterprise = "enterprise"
)

// UserCertification 用户实名认证申请表（支持个人/企业认证）
type UserCertification struct {
	Id              int    `json:"id"`
	UserId          int    `json:"user_id" gorm:"index"`
	Type            string `json:"type" gorm:"type:varchar(16)"`                       // personal / enterprise
	Status          int    `json:"status" gorm:"type:int;default:0"`                   // 0 待审核 / 1 已通过 / 2 已驳回
	RealName        string `json:"real_name" gorm:"type:varchar(64)"`                  // 个人姓名 或 企业名称
	IdCardNo        string `json:"id_card_no" gorm:"type:varchar(64)"`                 // 个人身份证号 或 企业统一社会信用代码
	IdCardFront     string `json:"id_card_front" gorm:"type:varchar(255)"`             // 身份证正面图片 URL（个人）
	IdCardBack      string `json:"id_card_back" gorm:"type:varchar(255)"`              // 身份证反面图片 URL（个人）
	BusinessLicense string `json:"business_license" gorm:"type:varchar(255)"`          // 营业执照图片 URL（企业）
	ContactName     string `json:"contact_name" gorm:"type:varchar(64)"`               // 联系人姓名（企业）
	ContactPhone    string `json:"contact_phone" gorm:"type:varchar(32)"`              // 联系电话
	ContactIdFront  string `json:"contact_id_front" gorm:"type:varchar(255)"`          // 经办人身份证正面图片 URL（企业）
	ContactIdBack   string `json:"contact_id_back" gorm:"type:varchar(255)"`           // 经办人身份证反面图片 URL（企业）
	RejectReason    string `json:"reject_reason" gorm:"type:varchar(255)"`             // 驳回原因
	CreatedAt       int64  `json:"created_at" gorm:"autoCreateTime;column:created_at"` // 创建时间
	UpdatedAt       int64  `json:"updated_at" gorm:"autoUpdateTime;column:updated_at"` // 更新时间

	ParentUserId       int    `json:"parent_user_id" gorm:"-"`        // 计算字段：父用户ID（子账户）
	ParentEnterpriseName string  `json:"parent_enterprise_name" gorm:"-"` // 计算字段：所属企业名称（子账户时填充）
	Username           string `json:"username" gorm:"-"`              // 计算字段：认证用户的用户名
}

func (UserCertification) TableName() string {
	return "user_certifications"
}

// GetLatestCertificationByUserId 获取用户最新的认证记录
func GetLatestCertificationByUserId(userId int) (*UserCertification, error) {
	if userId == 0 {
		return nil, errors.New("user id 为空！")
	}
	cert := UserCertification{}
	err := DB.Where("user_id = ?", userId).Order("id desc").First(&cert).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &cert, nil
}

// InsertCertification 创建认证记录
func InsertCertification(cert *UserCertification) error {
	if cert.UserId == 0 {
		return errors.New("user id 为空！")
	}
	cert.CreatedAt = common.GetTimestamp()
	cert.UpdatedAt = cert.CreatedAt
	return DB.Create(cert).Error
}

// UpdateCertification 更新认证记录
func UpdateCertification(cert *UserCertification) error {
	if cert.Id == 0 {
		return errors.New("certification id 为空！")
	}
	cert.UpdatedAt = common.GetTimestamp()
	return DB.Model(cert).Omit("created_at").Updates(cert).Error
}

// GetCertificationById 按 ID 查询认证记录
func GetCertificationById(id int) (*UserCertification, error) {
	if id == 0 {
		return nil, errors.New("certification id 为空！")
	}
	cert := UserCertification{}
	err := DB.First(&cert, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &cert, nil
}

// ListCertifications 管理员分页查询认证记录（可按状态筛选、按用户名/邮箱/企业名称/姓名/证件号搜索）
func ListCertifications(page int, pageSize int, status int, keyword string) ([]*UserCertification, int64, error) {
	query := DB.Model(&UserCertification{})
	if status >= 0 {
		query = query.Where("status = ?", status)
	}
	if keyword != "" {
		like := "%" + strings.TrimSpace(keyword) + "%"
		// 通过 user_id 关联用户名/邮箱，或直接匹配认证记录的姓名/企业名称/证件号
		sub := DB.Model(&User{}).
			Select("id").
			Where("username LIKE ? OR email LIKE ? OR display_name LIKE ?", like, like, like)
		query = query.Where("(user_id IN (?) OR real_name LIKE ? OR id_card_no LIKE ?)", sub, like, like)
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var certs []*UserCertification
	err := query.Order("id desc").
		Limit(pageSize).
		Offset((page - 1) * pageSize).
		Find(&certs).Error
	if err != nil {
		return nil, 0, err
	}

	// 批量补全所属企业名称（子账户时）
	if len(certs) > 0 {
		// 收集所有认证用户的 ID
		userIds := make([]int, 0, len(certs))
		for _, c := range certs {
			userIds = append(userIds, c.UserId)
		}

		// 批量查询用户基本信息（含 parent_user_id）
		var users []User
		if err := DB.Select("id, username, display_name, parent_user_id").
			Where("id IN (?)", userIds).
			Find(&users).Error; err == nil {
			userMap := make(map[int]*User, len(users))
			parentIds := make([]int, 0)
			for i := range users {
				u := &users[i]
				userMap[u.Id] = u
				if u.ParentUserId > 0 {
					parentIds = append(parentIds, u.ParentUserId)
				}
			}

			// 为每条认证记录填充用户名和父用户ID
			for _, c := range certs {
				if u, ok := userMap[c.UserId]; ok {
					c.Username = u.Username
					c.ParentUserId = u.ParentUserId
				}
			}

			// 批量查询父用户的企业认证名称（优先取父用户最新的企业认证 real_name，否则取用户名/display_name）
			if len(parentIds) > 0 {
				// 去重
				seen := make(map[int]struct{}, len(parentIds))
				uniqParents := make([]int, 0, len(parentIds))
				for _, pid := range parentIds {
					if _, ok := seen[pid]; !ok {
						seen[pid] = struct{}{}
						uniqParents = append(uniqParents, pid)
					}
				}

				// 1) 查询父用户信息
				var parents []User
				parentMap := make(map[int]*User)
				if err := DB.Select("id, username, display_name").
					Where("id IN (?)", uniqParents).
					Find(&parents).Error; err == nil {
					for i := range parents {
						p := &parents[i]
						parentMap[p.Id] = p
					}
				}

				// 2) 查询父用户的企业认证记录（最新一条）
				parentNameByCert := make(map[int]string)
				var parentCerts []UserCertification
				if err := DB.Where("user_id IN (?) AND type = ?", uniqParents, CertTypeEnterprise).
					Order("user_id, id desc").
					Find(&parentCerts).Error; err == nil {
					// 每个用户取最新的一条（按 ID 倒序，第一条即最新）
					added := make(map[int]struct{})
					for _, pc := range parentCerts {
						if _, ok := added[pc.UserId]; ok {
							continue
						}
						if pc.RealName != "" {
							parentNameByCert[pc.UserId] = pc.RealName
						}
						added[pc.UserId] = struct{}{}
					}
				}

				// 3) 为子用户的认证记录填充所属企业名称
				for _, c := range certs {
					if c.ParentUserId <= 0 {
						continue
					}
					if name, ok := parentNameByCert[c.ParentUserId]; ok && name != "" {
						c.ParentEnterpriseName = name
						continue
					}
					if p, ok := parentMap[c.ParentUserId]; ok {
						if p.DisplayName != "" {
							c.ParentEnterpriseName = p.DisplayName
						} else {
							c.ParentEnterpriseName = p.Username
						}
					}
				}
			}
		}
	}

	return certs, total, nil
}

// UpdateUserCertStatus 更新用户认证状态并刷新缓存
func UpdateUserCertStatus(userId int, status int) error {
	if userId == 0 {
		return errors.New("user id 为空！")
	}
	if err := DB.Model(&User{}).Where("id = ?", userId).Update("cert_status", status).Error; err != nil {
		return err
	}
	return invalidateUserCache(userId)
}

// GetParentEnterpriseName 获取父用户（企业管理员）的企业名称。
// 优先取企业认证记录中的 real_name，其次取父用户的 display_name，最后取 username。
// parentUserId == 0 时返回空字符串。
func GetParentEnterpriseName(parentUserId int) string {
	if parentUserId == 0 {
		return ""
	}
	// 查询父用户信息作为兜底
	var parent User
	if err := DB.Select("id, username, display_name").First(&parent, parentUserId).Error; err != nil {
		return ""
	}
	// 查询父用户最新的企业认证记录
	var cert UserCertification
	err := DB.Where("user_id = ? AND type = ?", parentUserId, CertTypeEnterprise).
		Order("id desc").First(&cert).Error
	if err == nil && cert.RealName != "" {
		return cert.RealName
	}
	// 兜底取 display_name 或 username
	if parent.DisplayName != "" {
		return parent.DisplayName
	}
	return parent.Username
}
