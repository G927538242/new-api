package middleware

import (
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/relaykit/types"

	"github.com/gin-gonic/gin"
)

// RequireCertification 强制实名认证中间件。
// 所有用户必须先完成实名认证（个人/企业）才能使用系统调用 API；
// 管理员（含超级管理员）豁免。需在 TokenAuth/UserAuth 之后挂载。
func RequireCertification() func(c *gin.Context) {
	return func(c *gin.Context) {
		userId := c.GetInt("id")
		if userId == 0 {
			c.Next()
			return
		}

		user, err := model.GetUserCache(userId)
		if err != nil {
			common.SysLog("RequireCertification GetUserCache error: " + err.Error())
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "用户信息读取失败",
			})
			return
		}

		// 管理员豁免
		if user.Role >= common.RoleAdminUser {
			c.Next()
			return
		}

		// 已通过认证的用户正常放行
		if user.CertStatus == model.CertStatusApproved {
			c.Next()
			return
		}

		// 未认证 / 待审核 / 已驳回：拒绝使用
		msg := "请先完成实名认证后再使用系统"
		if user.CertStatus == model.CertStatusPending {
			msg = "您的实名认证正在审核中，请耐心等待"
		} else if user.CertStatus == model.CertStatusRejected {
			msg = "您的实名认证未通过，请修改后重新提交"
		}

		if strings.HasPrefix(c.Request.URL.Path, "/v1") ||
			strings.HasPrefix(c.Request.URL.Path, "/v1beta") ||
			strings.HasPrefix(c.Request.URL.Path, "/pg") {
			abortWithOpenAiMessage(c, http.StatusForbidden, msg, types.ErrorCode("CERTIFICATION_REQUIRED"))
			return
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"success": false,
			"code":    "USER_CERTIFICATION_REQUIRED",
			"message": msg,
		})
	}
}
