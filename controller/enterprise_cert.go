package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// WeWorkWebhookURL 企业微信 webhook 地址
const WeWorkWebhookURL = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e792438c-2f9b-42d0-bb12-4a05be2326b9"

// EnterpriseCertRequest 企业认证申请请求
type EnterpriseCertRequest struct {
	CompanyName   string `json:"company_name" binding:"required"`
	ContactName   string `json:"contact_name" binding:"required"`
	ContactPhone  string `json:"contact_phone" binding:"required"`
	ContactEmail  string `json:"contact_email"`
	LicenseNumber string `json:"license_number"`
	BusinessScope string `json:"business_scope"`
	Remark        string `json:"remark"`
}

// EnterpriseCertNotify 企业认证申请 webhook 通知
func EnterpriseCertNotify(c *gin.Context) {
	var req EnterpriseCertRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("[企业认证] 请求参数解析失败: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("[企业认证] 收到申请: 公司=%s, 联系人=%s, 电话=%s", req.CompanyName, req.ContactName, req.ContactPhone)

	// 构建企业微信 markdown 消息
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	content := fmt.Sprintf(
		"## 🏢 新的企业认证申请\n"+
			"> **申请时间**: %s\n\n"+
			"**公司名称**: %s\n"+
			"**联系人**: %s\n"+
			"**联系电话**: %s\n"+
			"**联系邮箱**: %s\n"+
			"**统一社会信用代码**: %s\n"+
			"**经营范围**: %s\n"+
			"**备注**: %s\n",
		timeStr,
		req.CompanyName,
		req.ContactName,
		req.ContactPhone,
		req.ContactEmail,
		req.LicenseNumber,
		req.BusinessScope,
		req.Remark,
	)

	payload := map[string]interface{}{
		"msgtype": "markdown",
		"markdown": map[string]string{
			"content": content,
		},
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		log.Printf("[企业认证] 序列化消息失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "序列化消息失败"})
		return
	}

	log.Printf("[企业认证] 准备发送 webhook, payload长度=%d", len(payloadBytes))

	// 异步发送到企业微信 webhook
	go sendWeWorkWebhook(payloadBytes)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "企业认证申请已提交，通知已发送",
	})
}

// sendWeWorkWebhook 异步发送企业微信 webhook（带日志输出）
func sendWeWorkWebhook(payloadBytes []byte) {
	log.Printf("[Webhook] 开始发送到企业微信: %s", WeWorkWebhookURL)
	
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Post(WeWorkWebhookURL, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.Printf("[Webhook] 发送失败: %v", err)
		return
	}
	defer resp.Body.Close()
	
	body, _ := io.ReadAll(resp.Body)
	log.Printf("[Webhook] 响应状态码: %d, 响应内容: %s", resp.StatusCode, string(body))
}
