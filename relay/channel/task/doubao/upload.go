package doubao

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"mime"
	"path/filepath"
	"strings"

	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"

	"github.com/pkg/errors"
)

// maxBase64AssetSize 单个素材允许内嵌的最大字节数。
// 方舟限制单张图片 < 30MB 且请求体 ≤ 64MB，Base64 会膨胀约 1/3，这里留出余量。
const maxBase64AssetSize int64 = 25 * 1024 * 1024

// uploadLocalMediaToArk 将 content 中引用本平台素材库的媒体 URL 转换为上游可用的
// data URL（Base64）后替换原 URL。方舟视频生成接口对本地图片素材支持 Base64 编码
// （data:<mime>;base64,...），但视频/音频仅支持公网 URL，本平台存储的视频/音频素材
// 无法直接转存，返回错误提示改用公网 URL。非本平台素材库的 URL（客户自托管公网
// URL、base64、asset:// 素材 ID 等）原样透传。
func uploadLocalMediaToArk(ctx context.Context, _ string, apiKey string, _ string, userId int, content []ContentItem) error {
	if len(content) == 0 || apiKey == "" {
		return nil
	}
	converted := make(map[string]string)
	for i := range content {
		item := &content[i]
		var media *MediaURL
		switch item.Type {
		case "image_url":
			media = item.ImageURL
		case "video_url":
			media = item.VideoURL
		case "audio_url":
			media = item.AudioURL
		}
		if media == nil || media.URL == "" {
			continue
		}
		u := strings.TrimSpace(media.URL)
		if !shouldUploadToArk(u) {
			continue
		}
		if replaced, ok := converted[u]; ok {
			media.URL = replaced
			continue
		}
		asset, err := model.GetAssetByURL(u)
		if err != nil || asset.UserId != userId {
			// 匹配不到素材记录或不属于当前用户，视为非本平台素材，透传原 URL。
			continue
		}
		dataURL, err := assetToDataURL(ctx, asset)
		if err != nil {
			return errors.Wrapf(err, "convert local asset to data url failed (url=%s)", u)
		}
		media.URL = dataURL
		converted[u] = dataURL
	}
	return nil
}

// shouldUploadToArk 快速过滤：跳过空、base64 编码与方舟素材 ID（asset://）
// 引用，其余 URL 统一交给素材库记录精确匹配判定。
func shouldUploadToArk(u string) bool {
	if u == "" {
		return false
	}
	if strings.HasPrefix(u, "data:") {
		return false
	}
	if strings.HasPrefix(u, "asset://") {
		return false
	}
	return true
}

// assetToDataURL 读取本平台素材文件并转换为 Base64 data URL 用于提交上游。
// 方舟仅支持图片 Base64 编码，视频/音频素材必须使用公网 URL，这里直接报错提示。
func assetToDataURL(ctx context.Context, asset *model.Asset) (string, error) {
	if asset.Type != "image" {
		return "", fmt.Errorf("video/audio asset cannot be inlined, use a public URL instead (asset id=%d)", asset.Id)
	}
	if asset.Size > maxBase64AssetSize {
		return "", fmt.Errorf("asset too large (%d bytes, max %d)", asset.Size, maxBase64AssetSize)
	}
	storage, err := service.GetAssetStorage()
	if err != nil {
		return "", err
	}
	reader, err := storage.Open(ctx, asset.StorageKey)
	if err != nil {
		return "", errors.Wrap(err, "open asset file failed")
	}
	defer reader.Close()
	data, err := io.ReadAll(reader)
	if err != nil {
		return "", errors.Wrap(err, "read asset file failed")
	}
	mimeType := asset.MimeType
	if mimeType == "" {
		mimeType = mime.TypeByExtension(filepath.Ext(asset.Name))
	}
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}
	return "data:" + mimeType + ";base64," + base64.StdEncoding.EncodeToString(data), nil
}
