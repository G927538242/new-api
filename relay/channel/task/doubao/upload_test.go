package doubao

import (
	"bytes"
	"context"
	"encoding/base64"
	"os"
	"testing"

	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"

	"github.com/glebarez/sqlite"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// setupUploadTest 为 uploadLocalMediaToArk 准备内存 SQLite 与本地素材存储。
func setupUploadTest(t *testing.T) {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	sqlDB, err := db.DB()
	require.NoError(t, err)
	sqlDB.SetMaxOpenConns(1)
	require.NoError(t, db.AutoMigrate(&model.Asset{}))
	model.DB = db

	service.ResetAssetStorage()
	_, err = service.GetAssetStorage()
	require.NoError(t, err)
	t.Cleanup(func() {
		service.ResetAssetStorage()
		_ = os.RemoveAll("uploads")
	})
}

// insertRawAsset 直接写入素材记录（不落盘），用于测试文件读取前的错误分支。
func insertRawAsset(t *testing.T, asset *model.Asset) *model.Asset {
	t.Helper()
	require.NoError(t, asset.Insert())
	return asset
}

// uploadRealImage 上传真实文件到本地存储并登记素材记录。
func uploadRealImage(t *testing.T, owner int, mimeType string, data []byte) *model.Asset {
	t.Helper()
	storage, err := service.GetAssetStorage()
	require.NoError(t, err)
	key := "image/" + uuid.NewString() + ".bin"
	url, err := storage.Upload(context.Background(), bytes.NewReader(data), key, mimeType)
	require.NoError(t, err)
	return insertRawAsset(t, &model.Asset{
		UserId:     owner,
		Type:       "image",
		Name:       "test-image.bin",
		StorageKey: key,
		URL:        url,
		Size:       int64(len(data)),
		MimeType:   mimeType,
	})
}

func TestUploadLocalMediaToArk_PassthroughNonPlatformURLs(t *testing.T) {
	setupUploadTest(t)
	content := []ContentItem{
		{Type: "image_url", ImageURL: &MediaURL{URL: "https://customer.example.com/refs/bg.jpg"}},
		{Type: "image_url", ImageURL: &MediaURL{URL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg=="}},
		{Type: "image_url", ImageURL: &MediaURL{URL: "asset://42"}},
		{Type: "video_url", VideoURL: &MediaURL{URL: "https://cdn.example.com/clip.mp4"}},
		{Type: "audio_url", AudioURL: &MediaURL{URL: "https://cdn.example.com/voice.wav"}},
	}
	err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
	require.NoError(t, err)
	assert.Equal(t, "https://customer.example.com/refs/bg.jpg", content[0].ImageURL.URL)
	assert.Equal(t, "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==", content[1].ImageURL.URL)
	assert.Equal(t, "asset://42", content[2].ImageURL.URL)
	assert.Equal(t, "https://cdn.example.com/clip.mp4", content[3].VideoURL.URL)
	assert.Equal(t, "https://cdn.example.com/voice.wav", content[4].AudioURL.URL)
}

func TestUploadLocalMediaToArk_ConvertsOwnedImageToDataURL(t *testing.T) {
	setupUploadTest(t)
	data := []byte("fake-image-bytes-for-base64-conversion")
	asset := uploadRealImage(t, 1, "image/png", data)
	content := []ContentItem{{Type: "image_url", ImageURL: &MediaURL{URL: asset.URL}}}
	err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
	require.NoError(t, err)
	want := "data:image/png;base64," + base64.StdEncoding.EncodeToString(data)
	assert.Equal(t, want, content[0].ImageURL.URL)
}

func TestUploadLocalMediaToArk_DeduplicatesRepeatedURL(t *testing.T) {
	setupUploadTest(t)
	data := []byte("dedup-image")
	asset := uploadRealImage(t, 1, "image/png", data)
	content := []ContentItem{
		{Type: "image_url", ImageURL: &MediaURL{URL: asset.URL}},
		{Type: "image_url", ImageURL: &MediaURL{URL: asset.URL}},
	}
	err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
	require.NoError(t, err)
	want := "data:image/png;base64," + base64.StdEncoding.EncodeToString(data)
	assert.Equal(t, want, content[0].ImageURL.URL)
	assert.Equal(t, want, content[1].ImageURL.URL)
}

func TestUploadLocalMediaToArk_AcceptsImageAtExactSizeLimit(t *testing.T) {
	setupUploadTest(t)
	data := make([]byte, maxBase64AssetSize)
	asset := uploadRealImage(t, 1, "image/png", data)
	content := []ContentItem{{Type: "image_url", ImageURL: &MediaURL{URL: asset.URL}}}
	err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
	require.NoError(t, err)
	assert.Equal(t, "data:image/png;base64,"+base64.StdEncoding.EncodeToString(data), content[0].ImageURL.URL)
}

func TestUploadLocalMediaToArk_RejectsOversizedImage(t *testing.T) {
	setupUploadTest(t)
	asset := insertRawAsset(t, &model.Asset{
		UserId: 1, Type: "image", Name: "big.png",
		StorageKey: "image/big.png", URL: "https://internal.example.com/big.png",
		Size: maxBase64AssetSize + 1, MimeType: "image/png",
	})
	content := []ContentItem{{Type: "image_url", ImageURL: &MediaURL{URL: asset.URL}}}
	err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
	require.Error(t, err)
	assert.Contains(t, err.Error(), "too large")
	assert.Contains(t, err.Error(), "26214401")
}

func TestUploadLocalMediaToArk_RejectsVideoAndAudioInline(t *testing.T) {
	setupUploadTest(t)
	cases := []struct {
		name      string
		assetType string
		mimeType  string
		content   func(url string) []ContentItem
	}{
		{
			name: "video", assetType: "video", mimeType: "video/mp4",
			content: func(url string) []ContentItem {
				return []ContentItem{{Type: "video_url", VideoURL: &MediaURL{URL: url}}}
			},
		},
		{
			name: "audio", assetType: "audio", mimeType: "audio/wav",
			content: func(url string) []ContentItem {
				return []ContentItem{{Type: "audio_url", AudioURL: &MediaURL{URL: url}}}
			},
		},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			asset := insertRawAsset(t, &model.Asset{
				UserId: 1, Type: tc.assetType, Name: "a." + tc.assetType,
				StorageKey: tc.assetType + "/a.bin", URL: "https://internal.example.com/" + tc.assetType,
				Size: 1024, MimeType: tc.mimeType,
			})
			content := tc.content(asset.URL)
			err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
			require.Error(t, err)
			assert.Contains(t, err.Error(), "use a public URL instead")
		})
	}
}

func TestUploadLocalMediaToArk_PassthroughAssetsOfOtherUsers(t *testing.T) {
	setupUploadTest(t)
	data := []byte("secret-image")
	asset := uploadRealImage(t, 999, "image/png", data)
	content := []ContentItem{{Type: "image_url", ImageURL: &MediaURL{URL: asset.URL}}}
	err := uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, content)
	require.NoError(t, err)
	assert.Equal(t, asset.URL, content[0].ImageURL.URL)
	assert.NotContains(t, content[0].ImageURL.URL, "data:")
}

func TestUploadLocalMediaToArk_NoopWhenEmptyOrNoAPIKey(t *testing.T) {
	setupUploadTest(t)
	require.NoError(t, uploadLocalMediaToArk(context.Background(), "", "test-api-key", "", 1, nil))
	content := []ContentItem{{Type: "image_url", ImageURL: &MediaURL{URL: "https://x.com/a.png"}}}
	require.NoError(t, uploadLocalMediaToArk(context.Background(), "", "", "", 1, content))
	assert.Equal(t, "https://x.com/a.png", content[0].ImageURL.URL)
}
