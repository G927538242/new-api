package controller

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// certUploadDir 认证证件图片本地存储目录（相对服务运行目录）
const certUploadDir = "uploads/certification"

// maxCertFileSize 证件图片大小上限（5MB）
const maxCertFileSize = 5 << 20

// allowedCertExts 允许的证件图片扩展名
var allowedCertExts = map[string]bool{
	".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".gif": true,
}

// certTypeAllowed 校验认证类型
func certTypeAllowed(certType string) bool {
	return certType == model.CertTypePersonal || certType == model.CertTypeEnterprise
}

// UploadCertificationFile 上传认证证件图片（身份证正反面/营业执照），返回可访问 URL
func UploadCertificationFile(c *gin.Context) {
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

	if header.Size > maxCertFileSize {
		common.ApiErrorMsg(c, "文件大小不能超过 5MB")
		return
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if !allowedCertExts[ext] {
		common.ApiErrorMsg(c, "仅支持 jpg/jpeg/png/webp/gif 格式的图片")
		return
	}

	// 存储 key：{userId}/{uuid}{ext}
	objectKey := filepath.Join(strconv.Itoa(userId), uuid.New().String()+ext)
	fullPath := filepath.Join(certUploadDir, objectKey)
	if err := os.MkdirAll(filepath.Dir(fullPath), 0755); err != nil {
		common.ApiErrorMsg(c, "创建上传目录失败")
		return
	}
	f, err := os.Create(fullPath)
	if err != nil {
		common.ApiErrorMsg(c, "保存文件失败")
		return
	}
	defer f.Close()
	if _, err := f.ReadFrom(file); err != nil {
		common.ApiErrorMsg(c, "保存文件失败")
		return
	}

	common.ApiSuccess(c, gin.H{
		"url": "/api/certification/file/" + objectKey,
		"key": objectKey,
	})
}

// SubmitCertificationRequest 提交认证请求体
type SubmitCertificationRequest struct {
	Type            string `json:"type"`
	RealName        string `json:"real_name"`
	IdCardNo        string `json:"id_card_no"`
	IdCardFront     string `json:"id_card_front"`
	IdCardBack      string `json:"id_card_back"`
	BusinessLicense string `json:"business_license"`
	ContactName     string `json:"contact_name"`
	ContactPhone    string `json:"contact_phone"`
	ContactIdFront  string `json:"contact_id_front"`
	ContactIdBack   string `json:"contact_id_back"`
}

// SubmitCertification 提交个人/企业认证申请
func SubmitCertification(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	var req SubmitCertificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiErrorMsg(c, "无效的请求参数")
		return
	}

	req.Type = strings.TrimSpace(req.Type)
	req.RealName = strings.TrimSpace(req.RealName)
	req.IdCardNo = strings.TrimSpace(req.IdCardNo)
	req.IdCardFront = strings.TrimSpace(req.IdCardFront)
	req.IdCardBack = strings.TrimSpace(req.IdCardBack)
	req.BusinessLicense = strings.TrimSpace(req.BusinessLicense)
	req.ContactName = strings.TrimSpace(req.ContactName)
	req.ContactPhone = strings.TrimSpace(req.ContactPhone)
	req.ContactIdFront = strings.TrimSpace(req.ContactIdFront)
	req.ContactIdBack = strings.TrimSpace(req.ContactIdBack)

	if !certTypeAllowed(req.Type) {
		common.ApiErrorMsg(c, "认证类型无效")
		return
	}

	// 校验必填字段
	if req.RealName == "" || req.IdCardNo == "" {
		common.ApiErrorMsg(c, "请填写姓名/企业名称和证件号码")
		return
	}
	if req.Type == model.CertTypePersonal {
		if req.IdCardFront == "" || req.IdCardBack == "" {
			common.ApiErrorMsg(c, "请上传身份证正面和反面照片")
			return
		}
	} else {
		if req.BusinessLicense == "" {
			common.ApiErrorMsg(c, "请上传营业执照")
			return
		}
		if req.ContactName == "" {
			common.ApiErrorMsg(c, "请填写联系人姓名")
			return
		}
		if req.ContactIdFront == "" || req.ContactIdBack == "" {
			common.ApiErrorMsg(c, "请上传经办人身份证正面和反面照片")
			return
		}
	}

	// 当前认证状态校验
	user, err := model.GetUserById(userId, false)
	if err != nil {
		common.ApiError(c, err)
		return
	}
	// 企业子账户不允许变更/提交企业认证，仅支持个人认证
	if user.IsSubAccount() && req.Type == model.CertTypeEnterprise {
		common.ApiErrorMsg(c, "企业子账户仅支持个人认证，无法提交企业认证")
		return
	}
	// 待审核状态不可重复提交
	if user.CertStatus == model.CertStatusPending {
		common.ApiErrorMsg(c, "您的认证正在审核中，请耐心等待")
		return
	}
	// 已认证用户允许变更为另一种认证类型（个人→企业 / 企业→个人）
	if user.CertStatus == model.CertStatusApproved {
		// 检查是否与当前认证类型相同
		latestCert, _ := model.GetLatestCertificationByUserId(userId)
		if latestCert != nil && latestCert.Type == req.Type {
			common.ApiErrorMsg(c, "您已完成该类型认证，无需重复提交")
			return
		}
	}

	cert := &model.UserCertification{
		UserId:          userId,
		Type:            req.Type,
		Status:          0, // 待审核
		RealName:        req.RealName,
		IdCardNo:        req.IdCardNo,
		IdCardFront:     req.IdCardFront,
		IdCardBack:      req.IdCardBack,
		BusinessLicense: req.BusinessLicense,
		ContactName:     req.ContactName,
		ContactPhone:    req.ContactPhone,
		ContactIdFront:  req.ContactIdFront,
		ContactIdBack:   req.ContactIdBack,
		RejectReason:    "",
	}

	if err := model.InsertCertification(cert); err != nil {
		common.ApiError(c, err)
		return
	}
	if err := model.UpdateUserCertStatus(userId, model.CertStatusPending); err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, cert)
}

// GetMyCertification 查询当前用户的认证状态与最新记录
func GetMyCertification(c *gin.Context) {
	userId := c.GetInt("id")
	if userId == 0 {
		common.ApiErrorMsg(c, "user not found")
		return
	}

	user, err := model.GetUserById(userId, false)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	cert, err := model.GetLatestCertificationByUserId(userId)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	common.ApiSuccess(c, gin.H{
		"cert_status": user.CertStatus,
		"record":      cert,
	})
}

// AdminListCertifications 管理员分页查询认证记录
func AdminListCertifications(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}
	status, _ := strconv.Atoi(c.DefaultQuery("status", "-1"))
	keyword := strings.TrimSpace(c.Query("keyword"))

	certs, total, err := model.ListCertifications(page, pageSize, status, keyword)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 关联查询用户名
	userIdSet := make(map[int]bool)
	for _, cert := range certs {
		userIdSet[cert.UserId] = true
	}
	userNames := make(map[int]string)
	userEmails := make(map[int]string)
	if len(userIdSet) > 0 {
		ids := make([]int, 0, len(userIdSet))
		for id := range userIdSet {
			ids = append(ids, id)
		}
		var users []*model.User
		if err := model.DB.Select("id", "username", "email", "display_name").Where("id IN (?)", ids).Find(&users).Error; err == nil {
			for _, u := range users {
				userNames[u.Id] = u.Username
				userEmails[u.Id] = u.Email
			}
		}
	}

	type certView struct {
		*model.UserCertification
		Username string `json:"username"`
		Email    string `json:"email"`
	}
	items := make([]certView, 0, len(certs))
	for _, cert := range certs {
		items = append(items, certView{
			UserCertification: cert,
			Username:          userNames[cert.UserId],
			Email:             userEmails[cert.UserId],
		})
	}

	common.ApiSuccess(c, gin.H{
		"items": items,
		"total": total,
	})
}

// AdminGetCertification 管理员查询认证记录详情（含用户信息）
func AdminGetCertification(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id == 0 {
		common.ApiErrorMsg(c, "无效的认证记录 ID")
		return
	}
	cert, err := model.GetCertificationById(id)
	if err != nil {
		common.ApiErrorMsg(c, "认证记录不存在")
		return
	}
	user, err := model.GetUserById(cert.UserId, false)
	if err != nil {
		common.ApiError(c, err)
		return
	}

	// 补全所属企业名称（子账户时）
	var parentEnterpriseName string
	if user.ParentUserId > 0 {
		// 优先取父用户的企业认证名称
		if parentCert, cerr := model.GetLatestCertificationByUserId(user.ParentUserId); cerr == nil &&
			parentCert != nil && parentCert.Type == model.CertTypeEnterprise && parentCert.RealName != "" {
			parentEnterpriseName = parentCert.RealName
		} else if parent, perr := model.GetUserById(user.ParentUserId, false); perr == nil {
			if parent.DisplayName != "" {
				parentEnterpriseName = parent.DisplayName
			} else {
				parentEnterpriseName = parent.Username
			}
		}
	}

	common.ApiSuccess(c, gin.H{
		"record":                 cert,
		"username":               user.Username,
		"email":                  user.Email,
		"parent_user_id":         user.ParentUserId,
		"parent_enterprise_name": parentEnterpriseName,
	})
}

// AdminReviewCertificationRequest 审核请求体
type AdminReviewCertificationRequest struct {
	Id     int    `json:"id"`
	Action string `json:"action"` // approve / reject
	Reason string `json:"reason"` // 驳回原因（reject 时必填）
}

// AdminReviewCertification 管理员审核认证申请（通过/驳回）
func AdminReviewCertification(c *gin.Context) {
	var req AdminReviewCertificationRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Id == 0 {
		common.ApiErrorMsg(c, "无效的请求参数")
		return
	}

	cert, err := model.GetCertificationById(req.Id)
	if err != nil {
		common.ApiErrorMsg(c, "认证记录不存在")
		return
	}
	if cert.Status != 0 {
		common.ApiErrorMsg(c, "该认证记录已处理")
		return
	}

	action := strings.ToLower(strings.TrimSpace(req.Action))
	switch action {
	case "approve":
		cert.Status = 1
		cert.RejectReason = ""
		if err := model.UpdateCertification(cert); err != nil {
			common.ApiError(c, err)
			return
		}
		if err := model.UpdateUserCertStatus(cert.UserId, model.CertStatusApproved); err != nil {
			common.ApiError(c, err)
			return
		}
		model.RecordLog(cert.UserId, model.LogTypeSystem, "实名认证已通过")
		logger.LogInfo(c, fmt.Sprintf("certification approved: user=%d cert=%d", cert.UserId, cert.Id))
	case "reject":
		reason := strings.TrimSpace(req.Reason)
		if reason == "" {
			common.ApiErrorMsg(c, "请填写驳回原因")
			return
		}
		cert.Status = 2
		cert.RejectReason = reason
		if err := model.UpdateCertification(cert); err != nil {
			common.ApiError(c, err)
			return
		}
		if err := model.UpdateUserCertStatus(cert.UserId, model.CertStatusRejected); err != nil {
			common.ApiError(c, err)
			return
		}
		model.RecordLog(cert.UserId, model.LogTypeSystem, "实名认证被驳回："+reason)
		logger.LogInfo(c, fmt.Sprintf("certification rejected: user=%d cert=%d reason=%s", cert.UserId, cert.Id, reason))
	default:
		common.ApiErrorMsg(c, "无效的审核操作")
		return
	}

	common.ApiSuccess(c, cert)
}

// ServeCertificationFile 查看认证证件图片（仅本人或管理员可访问）
func ServeCertificationFile(c *gin.Context) {
	key := c.Param("key")
	if key == "" {
		c.Status(http.StatusNotFound)
		return
	}
	key = strings.TrimPrefix(key, "/")

	// 权限校验：key 首段为 user_id
	segments := strings.SplitN(key, "/", 2)
	if len(segments) != 2 {
		c.Status(http.StatusForbidden)
		return
	}
	ownerId, err := strconv.Atoi(segments[0])
	if err != nil {
		c.Status(http.StatusForbidden)
		return
	}
	userId := c.GetInt("id")
	role := c.GetInt("role")
	if userId != ownerId && role < common.RoleAdminUser {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "无权访问该文件"})
		return
	}

	// 防路径穿越：确保解析后的路径仍位于证书目录内
	fullPath := filepath.Join(certUploadDir, key)
	cleanPath := filepath.Clean(fullPath)
	absDir, err := filepath.Abs(certUploadDir)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	absPath, err := filepath.Abs(cleanPath)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}
	if !strings.HasPrefix(absPath, absDir+string(os.PathSeparator)) {
		c.Status(http.StatusForbidden)
		return
	}

	info, err := os.Stat(cleanPath)
	if err != nil || info.IsDir() {
		c.Status(http.StatusNotFound)
		return
	}

	c.File(cleanPath)
}
