package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const arkAPIHost = "ark.cn-beijing.volcengineapi.com"
const arkAPIBaseURL = "https://" + arkAPIHost

// ArkAssetClient 方舟素材 API 客户端，使用火山引擎 AK/SK 鉴权代理全部 Asset Group/Asset 接口。
type ArkAssetClient struct {
	Signer *VolcSigner
	http   *http.Client
}

// NewArkAssetClient 根据火山引擎 AK/SK 创建方舟素材 API 客户端。
func NewArkAssetClient(accessKey, secretKey string) *ArkAssetClient {
	return &ArkAssetClient{
		Signer: &VolcSigner{
			AccessKey: accessKey,
			SecretKey: secretKey,
			Region:    "cn-beijing",
			Service:   "ark",
		},
		http: &http.Client{Timeout: 30 * time.Second},
	}
}

// arkResponse 方舟 API 统一响应包装
type arkResponse struct {
	ResponseMetadata struct {
		RequestId string `json:"RequestId"`
		Action    string `json:"Action"`
		Error     *struct {
			Code    string `json:"Code"`
			Message string `json:"Message"`
		} `json:"Error"`
	} `json:"ResponseMetadata"`
	Result json.RawMessage `json:"Result"`
}

// doRequest 发送签名请求到方舟 API，返回 Result 字段。
func (c *ArkAssetClient) doRequest(action string, body interface{}) (json.RawMessage, error) {
	bodyBytes, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshal request body: %w", err)
	}

	reqURL := fmt.Sprintf("%s/?Action=%s&Version=2024-01-01", arkAPIBaseURL, action)
	req, err := http.NewRequest("POST", reqURL, bytes.NewReader(bodyBytes))
	if err != nil {
		return nil, fmt.Errorf("create request: %w", err)
	}
	req.Host = arkAPIHost

	c.Signer.Sign(req, bodyBytes)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	var arkResp arkResponse
	if err := json.Unmarshal(respBody, &arkResp); err != nil {
		return nil, fmt.Errorf("unmarshal response (status=%d, body=%s): %w", resp.StatusCode, string(respBody), err)
	}

	if arkResp.ResponseMetadata.Error != nil {
		return nil, fmt.Errorf("ark API error: %s - %s",
			arkResp.ResponseMetadata.Error.Code, arkResp.ResponseMetadata.Error.Message)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("ark API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return arkResp.Result, nil
}

// ---- Asset Group API ----

// CreateAssetGroupReq 创建素材资产组合请求
type CreateAssetGroupReq struct {
	Name        string `json:"Name"`
	Description string `json:"Description,omitempty"`
	GroupType   string `json:"GroupType,omitempty"` // 默认 AIGC
	ProjectName string `json:"ProjectName,omitempty"`
}

// CreateAssetGroup 创建素材资产组合，返回 Group ID。
func (c *ArkAssetClient) CreateAssetGroup(req *CreateAssetGroupReq) (string, error) {
	if req.GroupType == "" {
		req.GroupType = "AIGC"
	}
	if req.ProjectName == "" {
		req.ProjectName = "default"
	}
	result, err := c.doRequest("CreateAssetGroup", req)
	if err != nil {
		return "", err
	}
	var resp struct {
		Id string `json:"Id"`
	}
	if err := json.Unmarshal(result, &resp); err != nil {
		return "", fmt.Errorf("unmarshal CreateAssetGroup result: %w", err)
	}
	return resp.Id, nil
}

// AssetGroupInfo 素材资产组合信息
type AssetGroupInfo struct {
	Id          string `json:"Id"`
	Name        string `json:"Name"`
	Description string `json:"Description"`
	GroupType   string `json:"GroupType"`
	ProjectName string `json:"ProjectName"`
	CreateTime  string `json:"CreateTime"`
	UpdateTime  string `json:"UpdateTime"`
}

// ListAssetGroupsReq 查询素材资产组合列表请求
type ListAssetGroupsReq struct {
	Filter struct {
		GroupIds  []string `json:"GroupIds,omitempty"`
		GroupType string   `json:"GroupType,omitempty"`
		Name      string   `json:"Name,omitempty"`
	} `json:"Filter"`
	PageNumber  int    `json:"PageNumber"`
	PageSize    int    `json:"PageSize"`
	SortBy      string `json:"SortBy,omitempty"`
	SortOrder   string `json:"SortOrder,omitempty"`
	ProjectName string `json:"ProjectName,omitempty"`
}

// ListAssetGroups 查询素材资产组合列表
func (c *ArkAssetClient) ListAssetGroups(req *ListAssetGroupsReq) ([]AssetGroupInfo, int64, error) {
	if req.Filter.GroupType == "" {
		req.Filter.GroupType = "AIGC"
	}
	if req.ProjectName == "" {
		req.ProjectName = "default"
	}
	if req.PageNumber == 0 {
		req.PageNumber = 1
	}
	if req.PageSize == 0 {
		req.PageSize = 20
	}
	result, err := c.doRequest("ListAssetGroups", req)
	if err != nil {
		return nil, 0, err
	}
	var resp struct {
		TotalCount int64            `json:"TotalCount"`
		Items      []AssetGroupInfo `json:"Items"`
	}
	if err := json.Unmarshal(result, &resp); err != nil {
		return nil, 0, fmt.Errorf("unmarshal ListAssetGroups result: %w", err)
	}
	return resp.Items, resp.TotalCount, nil
}

// GetAssetGroup 查询单个素材资产组合信息
func (c *ArkAssetClient) GetAssetGroup(groupId string) (*AssetGroupInfo, error) {
	body := map[string]string{
		"Id":          groupId,
		"ProjectName": "default",
	}
	result, err := c.doRequest("GetAssetGroup", body)
	if err != nil {
		return nil, err
	}
	var resp AssetGroupInfo
	if err := json.Unmarshal(result, &resp); err != nil {
		return nil, fmt.Errorf("unmarshal GetAssetGroup result: %w", err)
	}
	return &resp, nil
}

// UpdateAssetGroup 更新素材资产组合信息
func (c *ArkAssetClient) UpdateAssetGroup(groupId, name, description string) error {
	body := map[string]string{
		"Id":          groupId,
		"ProjectName": "default",
	}
	if name != "" {
		body["Name"] = name
	}
	if description != "" {
		body["Description"] = description
	}
	_, err := c.doRequest("UpdateAssetGroup", body)
	return err
}

// DeleteAssetGroup 删除素材资产组合
func (c *ArkAssetClient) DeleteAssetGroup(groupId string) error {
	body := map[string]string{
		"Id":          groupId,
		"ProjectName": "default",
	}
	_, err := c.doRequest("DeleteAssetGroup", body)
	return err
}

// ---- Asset API ----

// CreateAssetReq 创建素材资产请求
type CreateAssetReq struct {
	AssetType   string `json:"AssetType"` // Image / Video / Audio
	GroupId     string `json:"GroupId"`
	Name        string `json:"Name"`
	URL         string `json:"URL"` // 公网可访问 URL
	ProjectName string `json:"ProjectName,omitempty"`
}

// CreateAsset 在指定素材资产组合内创建素材资产，返回 Asset ID。
func (c *ArkAssetClient) CreateAsset(req *CreateAssetReq) (string, error) {
	if req.ProjectName == "" {
		req.ProjectName = "default"
	}
	result, err := c.doRequest("CreateAsset", req)
	if err != nil {
		return "", err
	}
	var resp struct {
		Id string `json:"Id"`
	}
	if err := json.Unmarshal(result, &resp); err != nil {
		return "", fmt.Errorf("unmarshal CreateAsset result: %w", err)
	}
	return resp.Id, nil
}

// AssetInfo 素材资产信息
type AssetInfo struct {
	Id        string `json:"Id"`
	Name      string `json:"Name"`
	URL       string `json:"URL"`
	GroupId   string `json:"GroupId"`
	AssetType string `json:"AssetType"`
	Status    string `json:"Status"` // Active / Processing / Failed
	Error     *struct {
		Code    string `json:"Code"`
		Message string `json:"Message"`
	} `json:"Error"`
	CreateTime string `json:"CreateTime"`
	UpdateTime string `json:"UpdateTime"`
}

// GetAsset 查询单个素材资产信息
func (c *ArkAssetClient) GetAsset(assetId string) (*AssetInfo, error) {
	body := map[string]string{
		"Id":          assetId,
		"ProjectName": "default",
	}
	result, err := c.doRequest("GetAsset", body)
	if err != nil {
		return nil, err
	}
	var resp AssetInfo
	if err := json.Unmarshal(result, &resp); err != nil {
		return nil, fmt.Errorf("unmarshal GetAsset result: %w", err)
	}
	return &resp, nil
}

// ListAssetsReq 查询素材资产列表请求
type ListAssetsReq struct {
	Filter struct {
		GroupIds  []string `json:"GroupIds,omitempty"`
		GroupType string   `json:"GroupType,omitempty"`
		Statuses  []string `json:"Statuses,omitempty"`
		Name      string   `json:"Name,omitempty"`
	} `json:"Filter"`
	PageNumber  int    `json:"PageNumber"`
	PageSize    int    `json:"PageSize"`
	SortBy      string `json:"SortBy,omitempty"`
	SortOrder   string `json:"SortOrder,omitempty"`
	ProjectName string `json:"ProjectName,omitempty"`
}

// ListAssets 查询素材资产列表
func (c *ArkAssetClient) ListAssets(req *ListAssetsReq) ([]AssetInfo, int64, error) {
	if req.Filter.GroupType == "" {
		req.Filter.GroupType = "AIGC"
	}
	if req.ProjectName == "" {
		req.ProjectName = "default"
	}
	if req.PageNumber == 0 {
		req.PageNumber = 1
	}
	if req.PageSize == 0 {
		req.PageSize = 20
	}
	result, err := c.doRequest("ListAssets", req)
	if err != nil {
		return nil, 0, err
	}
	var resp struct {
		TotalCount int64       `json:"TotalCount"`
		Items      []AssetInfo `json:"Items"`
	}
	if err := json.Unmarshal(result, &resp); err != nil {
		return nil, 0, fmt.Errorf("unmarshal ListAssets result: %w", err)
	}
	return resp.Items, resp.TotalCount, nil
}

// UpdateAsset 更新素材资产信息
func (c *ArkAssetClient) UpdateAsset(assetId, name string) error {
	body := map[string]string{
		"Id":          assetId,
		"ProjectName": "default",
	}
	if name != "" {
		body["Name"] = name
	}
	_, err := c.doRequest("UpdateAsset", body)
	return err
}

// DeleteAsset 删除素材资产
func (c *ArkAssetClient) DeleteAsset(assetId string) error {
	body := map[string]string{
		"Id":          assetId,
		"ProjectName": "default",
	}
	_, err := c.doRequest("DeleteAsset", body)
	return err
}
