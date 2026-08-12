package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/service"
	"github.com/QuantumNous/new-api/setting/operation_setting"
	"github.com/QuantumNous/new-api/setting/ratio_setting"

	"github.com/gin-gonic/gin"
)

func filterPricingByUsableGroups(pricing []model.Pricing, usableGroup map[string]string) []model.Pricing {
	if len(pricing) == 0 {
		return pricing
	}
	if len(usableGroup) == 0 {
		return []model.Pricing{}
	}

	filtered := make([]model.Pricing, 0, len(pricing))
	for _, item := range pricing {
		if common.StringsContains(item.EnableGroup, "all") {
			filtered = append(filtered, item)
			continue
		}
		for _, group := range item.EnableGroup {
			if _, ok := usableGroup[group]; ok {
				filtered = append(filtered, item)
				break
			}
		}
	}
	return filtered
}

func GetPricing(c *gin.Context) {
	pricing := model.GetPricing()
	userId, exists := c.Get("id")
	usableGroup := map[string]string{}
	groupRatio := map[string]float64{}
	for s, f := range ratio_setting.GetGroupRatioCopy() {
		groupRatio[s] = f
	}
	var group string
	if exists {
		user, err := model.GetUserCache(userId.(int))
		if err == nil {
			group = user.Group
			for g := range groupRatio {
				ratio, ok := ratio_setting.GetGroupGroupRatio(group, g)
				if ok {
					groupRatio[g] = ratio
				}
			}
		}
	}

	usableGroup = service.GetUserUsableGroups(group)
	pricing = filterPricingByUsableGroups(pricing, usableGroup)
	// check groupRatio contains usableGroup
	for group := range ratio_setting.GetGroupRatioCopy() {
		if _, ok := usableGroup[group]; !ok {
			delete(groupRatio, group)
		}
	}

	c.JSON(200, gin.H{
		"success":            true,
		"data":               pricing,
		"vendors":            model.GetVendors(),
		"group_ratio":        groupRatio,
		"usable_group":       usableGroup,
		"supported_endpoint": model.GetSupportedEndpointMap(),
		"auto_groups":        service.GetUserAutoGroup(group),
		"pricing_version":    "a42d372ccf0b5dd13ecf71203521f9d2",
	})
}

// HomePricingModel is the pricing row returned by the public home pricing endpoint.
// Prices are pre-computed in display currency per-million tokens so the marketing
// table can render without touching authenticated pricing state.
type HomePricingModel struct {
	Model    string  `json:"model"`
	Modality string  `json:"modality"`
	Input    float64 `json:"input_per_million"`
	Output   float64 `json:"output_per_million"`
	Cache    float64 `json:"cache_per_million"`
	Context  string  `json:"context_window"`
}

// endpointTypeHasImage reports whether any of the given endpoint types is
// known to support image / vision modalities. Falls back to false when the
// endpoint type list is empty; the caller also inspects model tags to refine.
func endpointTypeHasImage(ets []constant.EndpointType) bool {
	for _, et := range ets {
		switch et {
		case constant.EndpointTypeGemini,
			constant.EndpointTypeImageGeneration,
			constant.EndpointTypeOpenAIVideo:
			return true
		}
	}
	return false
}

func modalityLabel(hasImage bool) string {
	if hasImage {
		return "text+image"
	}
	return "text"
}

// homePricingCurrencyScale returns (symbol, displayRate, perMillionScale) used by
// GetHomePricing to render per-million-token prices in the admin-configured
// display currency. displayRate = (usd -> currency exchange) * recharge markup
// (operation_setting.Price) so prices reflect the user-facing cost of tokens.
// perMillionScale is always 1 because the caller already multiplies by 1_000_000
// on the raw per-token USD value.
func homePricingCurrencyScale() (symbol string, displayRate float64, perMillionScale float64) {
	usdToCny := operation_setting.USDExchangeRate
	if usdToCny <= 0 {
		usdToCny = 7.3
	}
	priceRatio := operation_setting.Price
	if priceRatio <= 0 {
		priceRatio = 1
	}

	currencySymbol := operation_setting.GetCurrencySymbol()
	if currencySymbol == "" {
		currencySymbol = "$"
	}
	exchangeRate := operation_setting.GetUsdToCurrencyRate(usdToCny)
	if exchangeRate <= 0 {
		exchangeRate = 1
	}
	// displayRate: convert base USD price -> user-facing local-currency price
	// (includes recharge markup so "how much do users actually pay per 1M tokens"
	// lines up with their balance display).
	displayRate = exchangeRate * priceRatio
	return currencySymbol, displayRate, 1
}

// GetHomePricing returns a compact, publicly accessible pricing table suitable
// for the marketing homepage. It renders the default "all" group pricing using
// the configured price/currency unit = per-million-tokens, skipping per-user
// state and the full vendor/endpoint metadata carried by GetPricing.
func GetHomePricing(c *gin.Context) {
	pricing := model.GetPricing()
	// Public view: only models visible to the default group ("all")
	usableGroup := map[string]string{"all": "all"}
	pricing = filterPricingByUsableGroups(pricing, usableGroup)

	currencySymbol, displayRate, perMillionScale := homePricingCurrencyScale()
	groupRatio := ratio_setting.GetGroupRatioCopy()
	baseRatio := 1.0
	if r, ok := groupRatio["all"]; ok {
		baseRatio = r
	}

	rows := make([]HomePricingModel, 0, len(pricing))
	for _, p := range pricing {
		// Skip pay-per-request models on the home pricing table
		if p.QuotaType != 0 {
			continue
		}

		// base USD per 1M tokens = model_ratio * 2 * ratio (ratio=1 ↔ $2/1M)
		inputUSD := p.ModelRatio * 2 * baseRatio
		outputUSD := inputUSD * p.CompletionRatio
		cacheUSD := 0.0
		if p.CacheRatio != nil {
			cacheUSD = inputUSD * *p.CacheRatio
		}

		// Convert USD to configured display currency (account for recharge markup).
		// perMillionScale is already scaled for 1M tokens: 1 means keep
		// priceRate*rate*(USD per 1M) directly.
		inputDisplay := inputUSD * displayRate * perMillionScale
		outputDisplay := outputUSD * displayRate * perMillionScale
		cacheDisplay := cacheUSD * displayRate * perMillionScale

		// For pay-per-model (fixed) tokens we could render "-", but those were
		// already filtered above (QuotaType != 0).

		hasImage := endpointTypeHasImage(p.SupportedEndpointTypes)
		// Prefer explicit metadata tags for modality if vendor has set them.
		modalityRaw := strings.ToLower(p.Tags)
		if strings.Contains(modalityRaw, "image") || strings.Contains(modalityRaw, "vision") {
			hasImage = true
		}

		rows = append(rows, HomePricingModel{
			Model:    p.ModelName,
			Modality: modalityLabel(hasImage),
			Input:    mathRound2(inputDisplay),
			Output:   mathRound2(outputDisplay),
			Cache:    mathRound2(cacheDisplay),
			Context:  contextWindowLabel(p.Tags, p.ModelName),
		})
	}

	// When backend has no models configured, return an empty array so the
	// frontend can fall back to its built-in sample rows.
	c.JSON(http.StatusOK, gin.H{
		"success":         true,
		"message":         "",
		"data":            rows,
		"currency_symbol": currencySymbol,
	})
}

// mathRound2 rounds to 2 decimal places, used for display prices.
func mathRound2(v float64) float64 {
	if v == 0 {
		return 0
	}
	// For tiny values keep at least 1 significant digit instead of collapsing to 0
	absV := v
	if absV < 0 {
		absV = -absV
	}
	if absV < 0.005 && absV > 0 {
		return v // let caller show raw value
	}
	return float64(int64(v*100+0.5)) / 100
}

// contextWindowLabel infers the context window label for the home pricing
// table. Parses the model tags JSON for known "context_length"/
// "context_window" keys, otherwise falls back to matching common patterns in
// the model name. Returns an empty string when unknown.
func contextWindowLabel(tags, modelName string) string {
	if strings.TrimSpace(tags) != "" {
		var raw map[string]interface{}
		if err := json.Unmarshal([]byte(tags), &raw); err == nil {
			for _, k := range []string{"context_length", "context_window", "max_context", "context"} {
				if v, ok := raw[k]; ok {
					switch val := v.(type) {
					case float64:
						return formatContext(val)
					case string:
						if val != "" {
							return val
						}
					}
				}
			}
		}
	}
	// Model-name heuristic (e.g. "...-64k", "...128k", "...-200k")
	upper := strings.ToUpper(modelName)
	for _, suffix := range []string{"1M", "512K", "256K", "200K", "128K", "64K", "32K", "16K", "8K", "4K"} {
		if strings.Contains(upper, suffix) {
			return suffix
		}
	}
	return ""
}

func formatContext(tokens float64) string {
	if tokens <= 0 {
		return ""
	}
	if tokens >= 1_000_000 {
		return fmt.Sprintf("%.0fM", tokens/1_000_000)
	}
	if tokens >= 1000 {
		k := tokens / 1000
		if k == float64(int64(k)) {
			return fmt.Sprintf("%dK", int64(k))
		}
		return fmt.Sprintf("%.0fK", k)
	}
	return fmt.Sprintf("%d", int64(tokens))
}

func ResetModelRatio(c *gin.Context) {
	defaultStr := ratio_setting.DefaultModelRatio2JSONString()
	err := model.UpdateOption("ModelRatio", defaultStr)
	if err != nil {
		c.JSON(200, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	err = ratio_setting.UpdateModelRatioByJSONString(defaultStr)
	if err != nil {
		c.JSON(200, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"message": "重置模型倍率成功",
	})
}
