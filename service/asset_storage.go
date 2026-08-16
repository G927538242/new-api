package service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/QuantumNous/new-api/setting/asset_setting"

	"github.com/aws/aws-sdk-go-v2/aws"
	awscfg "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// AssetStorage 素材存储抽象，支持本地磁盘与 S3 兼容对象存储。
type AssetStorage interface {
	// Upload 上传文件，返回可访问 URL。size 为文件字节数（对象存储据此设置 Content-Length，
	// 避免 aws-sdk-go-v2 使用阿里云 OSS 等不支持的 chunked 编码）。
	Upload(ctx context.Context, reader io.Reader, size int64, key string, mimeType string) (string, error)
	// Delete 删除文件。
	Delete(ctx context.Context, key string) error
	// Open 打开已存储的文件用于读取（供转存上游等场景使用）。
	Open(ctx context.Context, key string) (io.ReadCloser, error)
}

var assetStorage AssetStorage

// GetAssetStorage 获取已初始化的素材存储实例（惰性初始化）。
func GetAssetStorage() (AssetStorage, error) {
	if assetStorage != nil {
		return assetStorage, nil
	}
	s := asset_setting.GetSetting()
	switch s.Type {
	case "", "local":
		assetStorage = newLocalStorage()
	case "s3", "minio", "oss", "tos":
		st, err := newS3Storage()
		if err != nil {
			return nil, err
		}
		assetStorage = st
	default:
		return nil, fmt.Errorf("unsupported asset storage type: %s", s.Type)
	}
	return assetStorage, nil
}

// ResetAssetStorage 重置缓存的单例（配置变更后调用）。
func ResetAssetStorage() {
	assetStorage = nil
}

// ── 本地磁盘存储 ──────────────────────────────────────────────

// localAssetDir 本地素材存储目录（相对于服务运行目录）。
const localAssetDir = "uploads/assets"

type localStorage struct {
	dir string
}

func newLocalStorage() *localStorage {
	dir := localAssetDir
	_ = os.MkdirAll(dir, 0755)
	return &localStorage{dir: dir}
}

func (l *localStorage) Upload(ctx context.Context, reader io.Reader, size int64, key string, mimeType string) (string, error) {
	safeKey := sanitizeKey(key)
	fullPath := filepath.Join(l.dir, safeKey)
	if err := os.MkdirAll(filepath.Dir(fullPath), 0755); err != nil {
		return "", err
	}
	f, err := os.Create(fullPath)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := io.Copy(f, reader); err != nil {
		return "", err
	}
	// 本地文件通过 /api/asset/file/{key} 路由提供访问
	return "/api/asset/file/" + safeKey, nil
}

func (l *localStorage) Delete(ctx context.Context, key string) error {
	safeKey := sanitizeKey(key)
	fullPath := filepath.Join(l.dir, safeKey)
	if err := os.Remove(fullPath); err != nil && !os.IsNotExist(err) {
		return err
	}
	return nil
}

func (l *localStorage) Open(ctx context.Context, key string) (io.ReadCloser, error) {
	safeKey := sanitizeKey(key)
	fullPath := filepath.Join(l.dir, safeKey)
	return os.Open(fullPath)
}

// LocalAssetPath 返回本地存储文件的路径（供 controller 读取文件用）。
func LocalAssetPath(key string) string {
	safeKey := sanitizeKey(key)
	return filepath.Join(localAssetDir, safeKey)
}

// ── S3 兼容对象存储 ────────────────────────────────────────────

type s3Storage struct {
	client *s3.Client
	bucket string
	prefix string
	customDomain string
	endpoint     string
}

func newS3Storage() (*s3Storage, error) {
	s := asset_setting.GetSetting()
	if s.Endpoint == "" || s.Bucket == "" || s.AccessKey == "" || s.SecretKey == "" {
		return nil, errors.New("S3 storage is not fully configured")
	}
	region := s.Region
	if region == "" {
		region = "us-east-1"
	}
	cfg, err := awscfg.LoadDefaultConfig(context.Background(),
		awscfg.WithRegion(region),
		awscfg.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(s.AccessKey, s.SecretKey, "")),
	)
	if err != nil {
		return nil, fmt.Errorf("load aws config failed: %w", err)
	}
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		if s.Endpoint != "" {
			o.BaseEndpoint = aws.String(s.Endpoint)
		}
		o.UsePathStyle = s.ForcePathStyle
		// 禁用请求校验和（SDK 默认对 S3 PutObject 使用 aws-chunked + trailer 编码，
		// 阿里云 OSS 等 S3 兼容服务不支持该编码，会返回 NotImplemented）
		o.RequestChecksumCalculation = aws.RequestChecksumCalculationWhenRequired
	})
	prefix := s.PathPrefix
	if prefix != "" && !strings.HasSuffix(prefix, "/") {
		prefix += "/"
	}
	return &s3Storage{
		client:       client,
		bucket:       s.Bucket,
		prefix:       prefix,
		customDomain: s.CustomDomain,
		endpoint:     s.Endpoint,
	}, nil
}

func (s *s3Storage) Upload(ctx context.Context, reader io.Reader, size int64, key string, mimeType string) (string, error) {
	objectKey := s.prefix + sanitizeKey(key)
	contentType := mimeType
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:        aws.String(s.bucket),
		Key:           aws.String(objectKey),
		Body:          reader,
		ContentType:   aws.String(contentType),
		ContentLength: aws.Int64(size),
	})
	if err != nil {
		return "", fmt.Errorf("s3 put object failed: %w", err)
	}
	return s.publicURL(objectKey), nil
}

func (s *s3Storage) Delete(ctx context.Context, key string) error {
	objectKey := s.prefix + sanitizeKey(key)
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(objectKey),
	})
	return err
}

func (s *s3Storage) Open(ctx context.Context, key string) (io.ReadCloser, error) {
	objectKey := s.prefix + sanitizeKey(key)
	out, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(objectKey),
	})
	if err != nil {
		return nil, fmt.Errorf("s3 get object failed: %w", err)
	}
	return out.Body, nil
}

func (s *s3Storage) publicURL(objectKey string) string {
	if s.customDomain != "" {
		base := strings.TrimRight(s.customDomain, "/")
		return base + "/" + objectKey
	}
	// 默认用 endpoint + bucket + key 拼接
	base := strings.TrimRight(s.endpoint, "/")
	return fmt.Sprintf("%s/%s/%s", base, s.bucket, objectKey)
}

// ── 工具函数 ──────────────────────────────────────────────────

// sanitizeKey 防止路径穿越，仅允许字母数字/下划线/连字符/斜杠/点。
func sanitizeKey(key string) string {
	key = strings.TrimLeft(key, "/")
	// 替换可能的 .. 路径穿越
	parts := strings.Split(key, "/")
	clean := make([]string, 0, len(parts))
	for _, p := range parts {
		if p == "" || p == "." || p == ".." {
			continue
		}
		clean = append(clean, p)
	}
	return strings.Join(clean, "/")
}
