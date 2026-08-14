package router

import (
	"embed"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// WebAssets holds the embedded dashboard frontend assets.
type WebAssets struct {
	BuildFS   embed.FS
	IndexPage []byte
}

func SetWebRouter(router *gin.Engine, assets WebAssets) {
	frontendFS := common.EmbedFolder(assets.BuildFS, "web/dist")

	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	router.Use(static.Serve("/", frontendFS))
	router.NoRoute(func(c *gin.Context) {
		c.Set(middleware.RouteTagKey, "web")
		// RedirectTrailingSlash 已禁用，前端部分 API 请求与后端路由尾斜杠不一致
		// （如 /api/channel 无斜杠 vs /api/channel/；/api/user/2/ 有斜杠 vs /api/user/:id），
		// 这里在 404 时尝试补斜杠/去斜杠后重新分发，保持请求方法不变，避免 HTTP 重定向导致方法变化。
		// 注意：重试前需移除 Accept-Encoding，否则 gzip 中间件会对已包装的 writer 再次压缩，
		// 导致响应被双重 gzip，客户端解压一次后仍为 gzip 数据而解析失败。
		if strings.HasPrefix(c.Request.URL.Path, "/api") && c.GetHeader("X-Trailing-Slash-Retry") != "1" {
			path := c.Request.URL.Path
			if !strings.HasSuffix(path, "/") {
				c.Request.Header.Set("X-Trailing-Slash-Retry", "1")
				c.Request.Header.Del("Accept-Encoding")
				c.Request.URL.Path = path + "/"
				router.ServeHTTP(c.Writer, c.Request)
				return
			}
			// /api/ 本身不去斜杠，避免重复重试
			if len(path) > len("/api/") {
				c.Request.Header.Set("X-Trailing-Slash-Retry", "1")
				c.Request.Header.Del("Accept-Encoding")
				c.Request.URL.Path = strings.TrimSuffix(path, "/")
				router.ServeHTTP(c.Writer, c.Request)
				return
			}
		}
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", assets.IndexPage)
	})
}
