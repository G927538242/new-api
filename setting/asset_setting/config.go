package asset_setting

import "github.com/QuantumNous/new-api/setting/config"

// AssetStorageSetting 素材库对象存储配置。
// 兼容 S3 / MinIO / 阿里云 OSS / 火山引擎 TOS 等 S3 兼容协议。
type AssetStorageSetting struct {
	Type           string `json:"type"`            // 存储类型：s3 / minio / oss / tos / local
	Endpoint       string `json:"endpoint"`        // S3 兼容端点，如 https://tos-cn-beijing.volces.com
	Region         string `json:"region"`          // 区域，如 cn-beijing
	Bucket         string `json:"bucket"`          // 桶名
	AccessKey      string `json:"access_key"`      // 访问密钥 ID（S3 用）
	SecretKey      string `json:"secret_key"`      // 访问密钥（S3 用）
	PathPrefix     string `json:"path_prefix"`     // 对象 key 前缀，如 assets/
	CustomDomain   string `json:"custom_domain"`   // 自定义访问域名（CDN），为空时用 endpoint 拼接
	ForcePathStyle bool   `json:"force_path_style"` // MinIO 等需开启 path-style

	// 火山引擎方舟素材库 AK/SK（用于 CreateAssetGroup/CreateAsset 等 API 的 V4 签名鉴权）
	// 与 S3 的 AccessKey/SecretKey 不同，这是火山引擎 IAM 的 AK/SK。
	VolcAccessKey string `json:"volc_access_key"` // 火山引擎 Access Key
	VolcSecretKey string `json:"volc_secret_key"` // 火山引擎 Secret Key
}

var assetStorageSetting = AssetStorageSetting{
	Type:       "local",
	PathPrefix: "assets/",
}

func init() {
	config.GlobalConfig.Register("asset_setting", &assetStorageSetting)
}

func GetSetting() AssetStorageSetting {
	return assetStorageSetting
}

// IsConfigured 是否已配置可用的对象存储（非 local 模式）
func IsConfigured() bool {
	s := assetStorageSetting
	return s.Type != "" && s.Type != "local" && s.Endpoint != "" && s.Bucket != "" && s.AccessKey != "" && s.SecretKey != ""
}

// IsVolcConfigured 是否已配置火山引擎方舟素材库 AK/SK
func IsVolcConfigured() bool {
	s := assetStorageSetting
	return s.VolcAccessKey != "" && s.VolcSecretKey != ""
}

// GetVolcCredentials 获取火山引擎 AK/SK
func GetVolcCredentials() (string, string) {
	return assetStorageSetting.VolcAccessKey, assetStorageSetting.VolcSecretKey
}
