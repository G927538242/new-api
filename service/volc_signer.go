package service

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"time"
)

// VolcSigner 火山引擎 V4 签名器，用于方舟素材 API 的 AK/SK 鉴权。
type VolcSigner struct {
	AccessKey string
	SecretKey string
	Region    string // 固定 cn-beijing
	Service   string // 固定 ark
}

// Sign 对 HTTP 请求进行火山引擎 V4 签名，设置 X-Date、X-Content-Sha256、Authorization 头。
func (s *VolcSigner) Sign(req *http.Request, body []byte) {
	now := time.Now().UTC()
	xDate := now.Format("20060102T150405Z")
	shortDate := now.Format("20060102")

	bodyHash := sha256.Sum256(body)
	xContentSha256 := hex.EncodeToString(bodyHash[:])

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Date", xDate)
	req.Header.Set("X-Content-Sha256", xContentSha256)

	signedHeaderNames := []string{"content-type", "host", "x-content-sha256", "x-date"}
	sort.Strings(signedHeaderNames)

	canonHeaders := s.canonicalHeaders(req, signedHeaderNames)
	signedHeaders := strings.Join(signedHeaderNames, ";")
	canonQuery := s.canonicalQueryString(req.URL.Query())
	canonURI := req.URL.Path
	if canonURI == "" {
		canonURI = "/"
	}

	canonRequest := strings.Join([]string{
		req.Method,
		canonURI,
		canonQuery,
		canonHeaders,
		signedHeaders,
		xContentSha256,
	}, "\n")

	credentialScope := fmt.Sprintf("%s/%s/%s/request", shortDate, s.Region, s.Service)
	stringToSign := strings.Join([]string{
		"HMAC-SHA256",
		xDate,
		credentialScope,
		s.sha256Hex(canonRequest),
	}, "\n")

	kDate := s.hmacSHA256([]byte("HMAC-SHA256"+s.SecretKey), shortDate)
	kRegion := s.hmacSHA256(kDate, s.Region)
	kService := s.hmacSHA256(kRegion, s.Service)
	kSigning := s.hmacSHA256(kService, "request")

	signature := hex.EncodeToString(s.hmacSHA256(kSigning, stringToSign))

	authorization := fmt.Sprintf("HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s",
		s.AccessKey, credentialScope, signedHeaders, signature)
	req.Header.Set("Authorization", authorization)
}

func (s *VolcSigner) canonicalHeaders(req *http.Request, names []string) string {
	var b strings.Builder
	for _, name := range names {
		var val string
		switch name {
		case "content-type":
			val = req.Header.Get("Content-Type")
		case "host":
			val = req.Host
		case "x-content-sha256":
			val = req.Header.Get("X-Content-Sha256")
		case "x-date":
			val = req.Header.Get("X-Date")
		}
		b.WriteString(name)
		b.WriteString(":")
		b.WriteString(strings.TrimSpace(val))
		b.WriteString("\n")
	}
	return b.String()
}

func (s *VolcSigner) canonicalQueryString(values url.Values) string {
	keys := make([]string, 0, len(values))
	for k := range values {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	var parts []string
	for _, k := range keys {
		vals := values[k]
		sort.Strings(vals)
		for _, v := range vals {
			parts = append(parts, s.uriEncode(k)+"="+s.uriEncode(v))
		}
	}
	return strings.Join(parts, "&")
}

func (s *VolcSigner) uriEncode(str string) string {
	var b strings.Builder
	for i := 0; i < len(str); i++ {
		c := str[i]
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') ||
			c == '-' || c == '_' || c == '.' || c == '~' {
			b.WriteByte(c)
		} else {
			fmt.Fprintf(&b, "%%%02X", c)
		}
	}
	return b.String()
}

func (s *VolcSigner) sha256Hex(data string) string {
	h := sha256.Sum256([]byte(data))
	return hex.EncodeToString(h[:])
}

func (s *VolcSigner) hmacSHA256(key []byte, data string) []byte {
	h := hmac.New(sha256.New, key)
	h.Write([]byte(data))
	return h.Sum(nil)
}
