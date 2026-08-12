package model

import (
	"errors"
	"strconv"
	"strings"

	"github.com/QuantumNous/new-api/common"

	"gorm.io/gorm"
)

// IsSubAccount 判断用户是否为企业子账户（parent_user_id > 0）
func (user *User) IsSubAccount() bool {
	return user != nil && user.ParentUserId > 0
}

// IsEnterpriseAdmin 判断用户是否为企业管理员（企业认证已通过且非子账户）
func IsEnterpriseAdmin(userId int) bool {
	if userId == 0 {
		return false
	}
	user, err := GetUserById(userId, false)
	if err != nil || user == nil {
		return false
	}
	if user.IsSubAccount() || user.CertStatus != CertStatusApproved {
		return false
	}
	cert, err := GetLatestCertificationByUserId(userId)
	if err != nil || cert == nil {
		return false
	}
	return cert.Type == CertTypeEnterprise
}

// CountSubAccounts 统计企业管理员名下的子账户数量
func CountSubAccounts(parentUserId int, keyword string) (int64, error) {
	if parentUserId == 0 {
		return 0, errors.New("parent user id 为空！")
	}
	query := DB.Model(&User{}).Where("parent_user_id = ?", parentUserId)
	if keyword = strings.TrimSpace(keyword); keyword != "" {
		like := "%" + keyword + "%"
		query = query.Where("(username LIKE ? OR display_name LIKE ? OR email LIKE ? OR id = ?)", like, like, like, safeKeywordInt(keyword))
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

// safeKeywordInt 尝试将关键字转为 int，失败返回 0（避免干扰 id 查询）
func safeKeywordInt(keyword string) int {
	if n, err := strconv.Atoi(keyword); err == nil {
		return n
	}
	return 0
}

// ListSubAccounts 分页查询企业管理员名下的子账户（不返回密码/access_token）
func ListSubAccounts(parentUserId int, keyword string, startIdx int, num int) ([]*User, error) {
	if parentUserId == 0 {
		return nil, errors.New("parent user id 为空！")
	}
	query := DB.Model(&User{}).Where("parent_user_id = ?", parentUserId)
	if keyword = strings.TrimSpace(keyword); keyword != "" {
		like := "%" + keyword + "%"
		query = query.Where("(username LIKE ? OR display_name LIKE ? OR email LIKE ? OR id = ?)", like, like, like, safeKeywordInt(keyword))
	}
	var users []*User
	if err := query.Omit("password", "access_token").
		Order("id desc").
		Limit(num).
		Offset(startIdx).
		Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetSubAccountById 获取子账户（校验其父账户归属）
func GetSubAccountById(parentUserId int, id int) (*User, error) {
	if id == 0 {
		return nil, errors.New("sub account id 为空！")
	}
	user := User{}
	if err := DB.Omit("password", "access_token").First(&user, "id = ? AND parent_user_id = ?", id, parentUserId).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// GetSubAccountByIdWithSecret 获取子账户（含密码哈希，供重置密码等管理操作使用）
func GetSubAccountByIdWithSecret(parentUserId int, id int) (*User, error) {
	if id == 0 {
		return nil, errors.New("sub account id 为空！")
	}
	user := User{}
	if err := DB.First(&user, "id = ? AND parent_user_id = ?", id, parentUserId).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// TransferQuotaToSubAccount 从企业管理员账户划拨额度给子账户。
// 父账户额度不足时返回错误，整体原子完成。
func TransferQuotaToSubAccount(parentUserId int, subAccountId int, quota int) error {
	if quota <= 0 {
		return errors.New("划拨额度必须大于 0")
	}
	if err := DB.Transaction(func(tx *gorm.DB) error {
		var parent User
		if err := lockForUpdate(tx).First(&parent, parentUserId).Error; err != nil {
			return err
		}
		if parent.Quota < quota {
			return errors.New("企业管理员账户额度不足")
		}
		if err := tx.Model(&User{}).Where("id = ?", parentUserId).Update("quota", gorm.Expr("quota - ?", quota)).Error; err != nil {
			return err
		}
		if err := tx.Model(&User{}).Where("id = ?", subAccountId).Update("quota", gorm.Expr("quota + ?", quota)).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

// TransferQuotaFromSubAccount 将子账户额度退回企业管理员账户（原子操作，子账户额度不足时拒绝）。
func TransferQuotaFromSubAccount(parentUserId int, subAccountId int, quota int) error {
	if quota <= 0 {
		return errors.New("额度必须大于 0")
	}
	if err := DB.Transaction(func(tx *gorm.DB) error {
		var sub User
		if err := lockForUpdate(tx).First(&sub, subAccountId).Error; err != nil {
			return err
		}
		if sub.Quota < quota {
			return errors.New("子账户额度不足")
		}
		if err := tx.Model(&User{}).Where("id = ?", subAccountId).Update("quota", gorm.Expr("quota - ?", quota)).Error; err != nil {
			return err
		}
		if err := tx.Model(&User{}).Where("id = ?", parentUserId).Update("quota", gorm.Expr("quota + ?", quota)).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

// RefundSubAccountQuota 删除子账户时将其剩余额度退回企业管理员。
func RefundSubAccountQuota(parentUserId int, subAccountId int) error {
	if err := DB.Transaction(func(tx *gorm.DB) error {
		var sub User
		if err := lockForUpdate(tx).First(&sub, subAccountId).Error; err != nil {
			return err
		}
		if sub.Quota <= 0 {
			return nil
		}
		if err := tx.Model(&User{}).Where("id = ?", subAccountId).Update("quota", 0).Error; err != nil {
			return err
		}
		if err := tx.Model(&User{}).Where("id = ?", parentUserId).Update("quota", gorm.Expr("quota + ?", sub.Quota)).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

// CountUserSubAccounts 统计用户拥有的子账户数量
func CountUserSubAccounts(userId int) (int64, error) {
	var total int64
	if err := DB.Model(&User{}).Where("parent_user_id = ?", userId).Count(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

// RecordSubAccountLog 记录子账户操作日志（写父账户日志，便于企业管理员审计）
func RecordSubAccountLog(parentUserId int, subAccountId int, content string) {
	RecordLog(parentUserId, LogTypeSystem, content)
	common.SysLog("sub_account op: parent=" + strconv.Itoa(parentUserId) + " sub=" + strconv.Itoa(subAccountId) + " " + content)
}
