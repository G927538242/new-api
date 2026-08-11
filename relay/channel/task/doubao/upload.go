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

// maxBase64AssetSize 单个素材允许内嵌的最大字节数（fallback base64 模式）。
// 方舟限制单张图片 < 30MB 且请求体 ≤ 64MB，Base64 会膨胀约 1/3，这里留出余量。
const maxBase64AssetSize int64 = 25 * 1024 * 1024

// uploadLocalMediaToArk 将 content 中引用本平台素材库的媒体 URL 转换为上游可用的
// 引用格式。优先使用方舟素材库的 asset://<AssetID> 引用（需素材已同步到方舟且状态
// 为 Active），如果素材未同步到方舟则 fallback 到 base64 data URL（仅图片）。
// 非本平台素材库的 URL（客户自托管公网 URL、base64、asset:// 等）原样透传。
func uploadLocalMediaToArk(ctx context.Context, _ string, _ string, _ string, userId int, content []ContentItem) error {
	if len(content) == 0 {
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
		if !shouldProcessUrl(u) {
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
		replaced, err := resolveAssetURL(ctx, asset)
		if err != nil {
			return errors.Wrapf(err, "resolve local asset failed (url=%s, asset_id=%d)", u, asset.Id)
		}
		media.URL = replaced
		converted[u] = replaced
	}
	return nil
}

// shouldProcessUrl 快速过滤：跳过空、base64 编码与方舟素材 ID（asset://）引用。
func shouldProcessUrl(u string) bool {
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

// resolveAssetURL 将本平台素材解析为方舟可用的引用格式。
// 优先使用 asset://<UpstreamAssetId>（素材已同步到方舟且状态为 Active），
// 否则 fallback 到 base64 data URL（仅图片，且有大小限制）。
func resolveAssetURL(ctx context.Context, asset *model.Asset) (string, error) {
	// 优先使用方舟素材库引用
	if asset.UpstreamAssetId != "" && asset.Status == "active" {
		return "asset://" + asset.UpstreamAssetId, nil
	}

	// Fallback: 图片素材转 base64 data URL
	if asset.Type == "image" {
		return assetToDataURL(ctx, asset)
	}

	// 视频/音频素材无法 fallback 到 base64
	if asset.UpstreamAssetId != "" && asset.Status == "processing" {
		return "", fmt.Errorf("asset is still processing on ark, please wait (asset id=%d)", asset.Id)
	}
	if asset.UpstreamAssetId != "" && asset.Status == "failed" {
		return "", fmt.Errorf("asset processing failed on ark (asset id=%d)", asset.Id)
	}
	return "", fmt.Errorf("video/audio asset not synced to ark, cannot use (asset id=%d, status=%s)", asset.Id, asset.Status)
}

// assetToDataURL 读取本平台素材文件并转换为 Base64 data URL（fallback 模式）。
func assetToDataURL(ctx context.Context, asset *model.Asset) (string, error) {
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
