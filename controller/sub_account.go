package controller

import (
	"errors"
	"strconv"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SubAccountCreateRequest 创建子账户请求
type SubAccountCreateRequest struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	DisplayName string `json:"display_name"`
	Quota       int    `json:"quota"`
	Remark      string `json:"remark"`
}

// SubAccountUpdateRequest 更新子账户请求
type SubAccountUpdateRequest struct {
	DisplayName string `json:"display_name"`
	Remark      string `json:"remark"`
	Group       string `json:"group"`
}

// SubAccountManageRequest 管理子账户请求
type SubAccountManageRequest struct {
	Action string `json:"action"` // enable / disable / delete / add_quota / subtract_quota / override_quota / reset_password
	Quota  int    `json:"quota"`
	Value  string `json:"value"` // reset_password 时的新密码
}

// requireEnterpriseAdmin 校验当前登录用户是否为企业管理员：
//  1. 非子账户（parent_user_id == 0）
//  2. 已完成实名认证（cert_status == Approved）
//  3. 最新认证记录为企业认证（type == enterprise）
func requireEnterpriseAdmin(c *gin.Context) (*model.User, error) {
	userId := c.GetInt("id")
	if userId == 0 {
		return nil, errors.New("未登录")
	}
	user, err := model.GetUserById(userId, false)
	if err != nil {
		return nil, errors.New("用户不存在")
	}
	if user.IsSubAccount() {
		return nil, errors.New("子账户无权开通子账户")
	}
	if user.CertStatus != model.CertStatusApproved {
		return nil, errors.New("仅限已认证的企业客户开通子账户")
	}
	cert, err := model.GetLatestCertificationByUserId(userId)
	if err != nil {
		return nil, errors.New("认证信息读取失败")
	}
	if cert == nil || cert.Type != model.CertTypeEnterprise {
		return nil, errors.New("仅限企业认证客户开通子账户")
	}
	return user, nil
}

// ListSubAccounts 企业管理员查看子账户列表
func ListSubAccounts(c *gin.Context) {
	if _, err := requireEnterpriseAdmin(c); err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}
	parentUserId := c.GetInt("id")
	keyword := strings.TrimSpace(c.Query("keyword"))
	pageInfo := common.GetPageQuery(c)

	total, err := model.CountSubAccounts(parentUserId, keyword)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	users, err := model.ListSubAccounts(parentUserId, keyword, pageInfo.GetStartIdx(), pageInfo.GetPageSize())
	if err != nil {
		common.ApiError(c, err)
		return
	}

	pageInfo.SetTotal(int(total))
	pageInfo.SetItems(users)
	common.ApiSuccess(c, pageInfo)
}

// GetSubAccount 企业管理员查看子账户详情
func GetSubAccount(c *gin.Context) {
	if _, err := requireEnterpriseAdmin(c); err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiErrorMsg(c, "无效的子账户 ID")
		return
	}
	subAccount, err := model.GetSubAccountById(c.GetInt("id"), id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			common.ApiErrorMsg(c, "子账户不存在")
			return
		}
		common.ApiError(c, err)
		return
	}
	common.ApiSuccess(c, subAccount)
}

// CreateSubAccount 企业管理员创建子账户
func CreateSubAccount(c *gin.Context) {
	parent, err := requireEnterpriseAdmin(c)
	if err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}

	var req SubAccountCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "无效的请求参数")
		return
	}
	req.Username = strings.TrimSpace(req.Username)
	req.Password = strings.TrimSpace(req.Password)
	req.DisplayName = strings.TrimSpace(req.DisplayName)
	req.Remark = strings.TrimSpace(req.Remark)

	if req.Username == "" || req.Password == "" {
		common.ApiErrorMsg(c, "用户名和密码不能为空")
		return
	}
	if len(req.Username) > model.UserNameMaxLength {
		common.ApiErrorMsg(c, "用户名长度不能超过 20 个字符")
		return
	}
	if len(req.Password) < 8 || len(req.Password) > 20 {
		common.ApiErrorMsg(c, "密码长度需为 8-20 个字符")
		return
	}
	if req.Quota < 0 {
		common.ApiErrorMsg(c, "划拨额度不能为负数")
		return
	}

	exist, err := model.CheckUserExistOrDeleted(req.Username, "")
	if err != nil {
		common.ApiError(c, err)
		return
	}
	if exist {
		common.ApiErrorMsg(c, "用户名已存在")
		return
	}

	displayName := req.DisplayName
	if displayName == "" {
		displayName = req.Username
	}

	subUser := model.User{
		Username:      req.Username,
		Password:      req.Password,
		DisplayName:   displayName,
		Role:          common.RoleCommonUser,
		Status:        common.UserStatusEnabled,
		ParentUserId:  parent.Id,
		Group:         parent.Group,                 // 继承企业管理员的分组，保证模型可用
		CertStatus:    model.CertStatusNone,         // 子账户需自行完成个人认证后才能使用 API
		Remark:        req.Remark,
	}
	if err := subUser.Insert(0); err != nil {
		common.ApiErrorMsg(c, "创建子账户失败: "+err.Error())
		return
	}

	// 初始额度从企业管理员账户划拨
	if req.Quota > 0 {
		if err := model.TransferQuotaToSubAccount(parent.Id, subUser.Id, req.Quota); err != nil {
			common.ApiErrorMsg(c, "子账户已创建，但额度划拨失败: "+err.Error())
			return
		}
	}

	model.RecordSubAccountLog(parent.Id, subUser.Id, "创建子账户: "+req.Username+" 划拨额度: "+strconv.Itoa(req.Quota))
	c.JSON(200, gin.H{
		"success": true,
		"message": "",
		"data":    subUser.Id,
	})
}

// UpdateSubAccount 企业管理员更新子账户信息
func UpdateSubAccount(c *gin.Context) {
	if _, err := requireEnterpriseAdmin(c); err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiErrorMsg(c, "无效的子账户 ID")
		return
	}
	subAccount, err := model.GetSubAccountByIdWithSecret(c.GetInt("id"), id)
	if err != nil {
		common.ApiErrorMsg(c, "子账户不存在")
		return
	}

	var req SubAccountUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "无效的请求参数")
		return
	}
	req.DisplayName = strings.TrimSpace(req.DisplayName)
	req.Remark = strings.TrimSpace(req.Remark)

	if req.DisplayName != "" {
		subAccount.DisplayName = req.DisplayName
	}
	subAccount.Remark = req.Remark
	if req.Group != "" {
		subAccount.Group = req.Group
	}
	if err := subAccount.Update(false); err != nil {
		common.ApiError(c, err)
		return
	}
	model.RecordSubAccountLog(c.GetInt("id"), subAccount.Id, "更新子账户信息")
	c.JSON(200, gin.H{
		"success": true,
		"message": "",
	})
}

// ManageSubAccount 企业管理员管理子账户（启用/禁用/删除/额度/重置密码）
func ManageSubAccount(c *gin.Context) {
	parent, err := requireEnterpriseAdmin(c)
	if err != nil {
		common.ApiErrorMsg(c, err.Error())
		return
	}
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		common.ApiErrorMsg(c, "无效的子账户 ID")
		return
	}
	subAccount, err := model.GetSubAccountByIdWithSecret(parent.Id, id)
	if err != nil {
		common.ApiErrorMsg(c, "子账户不存在")
		return
	}

	var req SubAccountManageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "无效的请求参数")
		return
	}

	switch req.Action {
	case "enable":
		if subAccount.Status == common.UserStatusEnabled {
			common.ApiErrorMsg(c, "子账户已是启用状态")
			return
		}
		subAccount.Status = common.UserStatusEnabled
		if err := subAccount.Update(false); err != nil {
			common.ApiError(c, err)
			return
		}
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "启用子账户: "+subAccount.Username)
	case "disable":
		if subAccount.Status == common.UserStatusDisabled {
			common.ApiErrorMsg(c, "子账户已是禁用状态")
			return
		}
		subAccount.Status = common.UserStatusDisabled
		if err := subAccount.Update(false); err != nil {
			common.ApiError(c, err)
			return
		}
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "禁用子账户: "+subAccount.Username)
	case "delete":
		if err := model.RefundSubAccountQuota(parent.Id, subAccount.Id); err != nil {
			common.ApiError(c, err)
			return
		}
		if err := subAccount.Delete(); err != nil {
			common.ApiError(c, err)
			return
		}
		model.InvalidateUserTokensCache(subAccount.Id)
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "删除子账户: "+subAccount.Username)
	case "add_quota":
		if req.Quota <= 0 {
			common.ApiErrorMsg(c, "划拨额度必须大于 0")
			return
		}
		if err := model.TransferQuotaToSubAccount(parent.Id, subAccount.Id, req.Quota); err != nil {
			common.ApiErrorMsg(c, err.Error())
			return
		}
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "划拨额度: "+strconv.Itoa(req.Quota))
	case "subtract_quota":
		if req.Quota <= 0 {
			common.ApiErrorMsg(c, "扣减额度必须大于 0")
			return
		}
		if err := model.TransferQuotaFromSubAccount(parent.Id, subAccount.Id, req.Quota); err != nil {
			common.ApiErrorMsg(c, err.Error())
			return
		}
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "扣减额度: "+strconv.Itoa(req.Quota))
	case "override_quota":
		if req.Quota < 0 {
			common.ApiErrorMsg(c, "额度不能为负数")
			return
		}
		delta := req.Quota - subAccount.Quota
		if delta > 0 {
			if err := model.TransferQuotaToSubAccount(parent.Id, subAccount.Id, delta); err != nil {
				common.ApiErrorMsg(c, err.Error())
				return
			}
		} else if delta < 0 {
			if err := model.TransferQuotaFromSubAccount(parent.Id, subAccount.Id, -delta); err != nil {
				common.ApiErrorMsg(c, err.Error())
				return
			}
		}
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "调整额度为: "+strconv.Itoa(req.Quota))
	case "reset_password":
		newPassword := strings.TrimSpace(req.Value)
		if len(newPassword) < 8 || len(newPassword) > 20 {
			common.ApiErrorMsg(c, "密码长度需为 8-20 个字符")
			return
		}
		subAccount.Password = newPassword
		if err := subAccount.Update(true); err != nil {
			common.ApiError(c, err)
			return
		}
		model.RecordSubAccountLog(parent.Id, subAccount.Id, "重置密码: "+subAccount.Username)
	default:
		common.ApiErrorMsg(c, "无效的操作类型")
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"message": "",
	})
}
