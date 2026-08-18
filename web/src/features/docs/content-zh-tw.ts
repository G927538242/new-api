/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import type { DocPage } from './content'

export const docCategoriesZhTw = [
  '開始使用',
  '介面呼叫說明',
  'API 介面',
  '平台相關',
] as const

export const docPagesZhTw: DocPage[] = [
  {
    id: 'introduction',
    title: '產品簡介',
    category: '開始使用',
    content: `# 產品簡介

零一雲是一個相容主流 AI 介面標準的國產模型閘道平台。

**它解決什麼問題？**

| 痛點 | 零一雲的解法 |
|---|---|
| 國外 AI 服務國內存取不穩定 | 國內節點直接存取，穩定可靠 |
| 不同模型要對接不同 API | 統一一個位址，標準介面格式，不用改程式碼 |
| 國外模型價格貴 | 接入 DeepSeek / Qwen 等國產模型，成本低數倍 |
| 多模型管理麻煩 | 一個 Key 呼叫所有模型，後台統一管理額度 |
| 資料出境合規風險 | 資料走國內通道，合規可控 |

**核心能力**

**標準介面相容**：相容主流 AI 介面格式，只需改 \`base_url\`，程式碼零改動

**全品類模型覆蓋**：Chat / Embedding / 圖片 / 語音 / 影片 / 審核 / Rerank，11 個介面

**國產模型優先**：DeepSeek、Qwen、GLM 等主流國產模型開箱即用，性價比高

**多 Key 管理**：後台建立多個令牌，分別控制額度、權限、模型存取範圍

**按量計費**：Token 等級的精細計費，用多少扣多少，無最低消費

**一句話接入**

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)
\`\`\`

**支援的工具：** Cursor、Windsurf、Continue、JetBrains AI、VS Code Copilot、ChatBox、LobeChat、NextChat、Open WebUI 等所有支援標準 AI API 的工具。`,
  },
  {
    id: 'quick-start',
    title: '快速入門',
    category: '開始使用',
    content: `# 快速入門

本指南幫助你在 5 分鐘內完成接入。

## 第一步：取得 API Key

所有接入方式都需要 API Key 進行認證。

1. 存取 / 登入 **零一雲管理控制台**（/dashboard）
2. 在 **令牌管理**（或「API 金鑰」）頁面建立並複製你的 API Key
3. 妥善保管，不要洩露給他人

API Key 是所有接入方式的必要憑證，後續設定中會多次用到。建議先取得 Key 再繼續後續步驟。

## 第二步：選擇接入方式

零一雲支援多種用戶端和工具的接入，根據你的使用習慣選擇合適的方式：

| 接入方式 | 適用人群 | 難度 |
|---|---|---|
| **CC Switch**（推薦） | 需要管理多個 AI 工具（Claude Code / Codex / Claude Desktop 等），偏好圖形介面一鍵切換 | 簡單 |
| Claude Code 用戶端 | 使用 Claude 桌面應用程式 / 終端版的用戶 | 簡單 |
| Codex 命令列 | 喜歡終端操作、使用 OpenAI Codex 的開發者 | 簡單 |
| API 直接呼叫 | 自己寫程式碼對接的開發者 | 中等 |
| AI 程式開發工具（Cursor / Windsurf 等） | 在 IDE 中使用 AI 輔助程式設計的用戶 | 簡單 |

---

## 方式一：CC Switch（推薦）

CC Switch 是一個開源的圖形介面工具，可以統一管理 Claude Code、Claude Desktop、Codex 等多個 AI 工具的供應商設定，一鍵切換，最為方便。

### 安裝 CC Switch（版本 v3.16.5 及以上）

**macOS 用戶（推薦 Homebrew）：**

\`\`\`bash
brew install --cask cc-switch
\`\`\`

**其他系統：** 存取 [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) 下載對應平台安裝包：

- macOS：\`.dmg\` / \`.zip\`
- Windows：\`.msi\` 安裝版 / Portable \`.zip\` 綠色版
- Linux：\`.deb\` / \`.rpm\` / \`.AppImage\`

> 首次開啟如被 macOS Gatekeeper 攔截，到「系統設定 → 隱私與安全性」點「仍要開啟」。

### 設定零一雲為供應商

#### 接入 Claude Desktop

1. 開啟 CC Switch，主介面頂部切到 **Claude Desktop** 頁籤。
2. 點擊右上角「橘色加號」按鈕，彈出「新增供應商」對話框。
3. 在「預設供應商」中選擇「自訂設定」。
4. 填寫以下資訊：
   - **供應商名稱**：如 \`零一云\`
   - **API 請求位址**：\`{{BASE_URL}}\`
   - **API Key**：貼上你在控制台取得的 Key
   - **選擇模型**：如 \`deepseek-v3\` / \`qwen-max\` / \`glm-4\` 等
5. 點擊「+ 新增」儲存。
6. 在供應商卡片上點「啟用」。
7. 完整重新啟動 Claude Desktop 應用程式，即可使用。

#### 接入 Codex

1. 開啟 CC Switch，主介面頂部切到 **Codex** 頁籤。
2. 點擊右上角「新增供應商」，選擇「自訂設定」。
3. 填寫：
   - **API 請求位址**：\`{{BASE_URL}}\`
   - **API Key**：控制台取得的 Key
   - **選擇模型**：推薦 \`deepseek-r1\`、\`glm-4\`
4. 點「+ 新增」→ 啟用該供應商。
5. 重新啟動你正在執行的 Codex 終端程序生效（Codex 不支援熱切換）。

---

## 方式二：Claude Code 用戶端

Claude Code 是 Claude 官方的終端 AI 程式設計助手。推薦透過 CC Switch 管理（見方式一），也可手動接入。

### 安裝 Claude Code 用戶端

存取 [Claude 官網](https://claude.ai/code/family) 下載對應系統版本並安裝。

### 使用 CC Switch 接入（推薦）

參考方式一「接入 Claude Desktop」步驟，選擇 **Claude Code** 標籤頁操作即可。

> **Windows 用戶注意：** 如遇 \`Virtual Machine Platform not available\` 報錯，需啟用「虛擬機器平台」：
> 1. \`Win + R\` 輸入 \`optionalfeatures\` 後按 Enter
> 2. 勾選「虛擬機器平台（Virtual Machine Platform）」→ 確定
> 3. 重新啟動電腦後再開啟 Claude 用戶端

---

## 方式三：Codex 命令列

Codex 是 OpenAI 官方推出的終端 AI 程式設計助手。

### 安裝 Codex

- 推薦先安裝 [Node.js](https://nodejs.org/zh-cn/download/) 22+
- macOS 用戶也可直接：\`brew install codex\`
- 或使用 npm 安裝：

\`\`\`bash
npm install -g @openai/codex
codex --version  # 显示版本号即安装成功
\`\`\`

### 設定 Provider（從零設定）

**macOS / Linux 用戶：** 開啟終端執行：

\`\`\`bash
mkdir -p ~/.codex && cat > ~/.codex/config.toml <<'EOF'
model_provider = "lingyiyun"
model = "deepseek-r1"
model_reasoning_effort = "high"
[model_providers.lingyiyun]
name = "零一云"
base_url = "{{BASE_URL}}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"
EOF
\`\`\`

**Windows 用戶（PowerShell）：**

\`\`\`powershell
New-Item -ItemType Directory -Force -Path "$HOME\.codex" | Out-Null
@'
model_provider = "lingyiyun"
model = "deepseek-r1"
model_reasoning_effort = "high"
[model_providers.lingyiyun]
name = "零一云"
base_url = "{{BASE_URL}}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"
'@ | Set-Content -Path "$HOME\.codex\config.toml" -Encoding UTF8
\`\`\`

### 設定 API Key 環境變數

把 \`<你的-API-key>\` 替換為控制台複製的 Key：

**macOS：**

\`\`\`bash
echo 'export OPENAI_API_KEY="<你的-API-key>"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

**Linux：**

\`\`\`bash
echo 'export OPENAI_API_KEY="<你的-API-key>"' >> ~/.bashrc
source ~/.bashrc
\`\`\`

**Windows PowerShell：**

\`\`\`powershell
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "<你的-API-key>", "User")
\`\`\`
> 執行後關閉目前 PowerShell 重新開啟生效。

完成後終端執行 \`codex\` 即會走零一雲路由。

### 已安裝 Codex，修改設定

設定檔和環境變數與「從零設定」相同，直接覆蓋寫入即可。

---

## 方式四：API 直接呼叫

如果你自己寫程式碼對接，只需要改一行 \`base_url\`：

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)

resp = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "你好"}]
)
print(resp.choices[0].message.content)
\`\`\`

完整介面說明見後面「API 介面」章節。

---

## 方式五：AI 程式開發工具

Cursor、Windsurf、Continue、JetBrains AI 等工具的設定，參考下一章「在 AI 程式開發工具中使用」。

---

## 常見問題

| 問題 | 解決方案 |
|---|---|
| API Key 在哪裡取得？ | 登入控制台 → 令牌管理 → 建立令牌 |
| 設定後不生效？ | 檢查是否正確重新啟動了用戶端 / 重新開啟終端 / 重新整理頁面 |
| 如何切換不同模型？ | 使用 CC Switch 一鍵切換；或修改設定檔 / 程式碼中 \`model\` 欄位 |
| 提示額度不足（402）？ | 儲值或更換有額度的 Key |
| 提示速率超限（429）？ | 稍後重試，或聯絡管理員提升額度 |

如需更多幫助，聯絡技術支援團隊。

---

## 1. 模型列表與選擇指南

### 查詢可用模型

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`
回傳結果中 \`data[].id\` 就是可用的 model 參數值。

### Chat 模型

| 模型 | 上下文 | 特點 | 適用情境 |
|---|---|---|---|
| \`deepseek-v3\` | 64K | 性價比高，中文能力強 | 日常對話、內容生成 |
| \`deepseek-r1\` | 64K | 推理鏈模型，思考過程可見 | 數學、邏輯推理、程式碼除錯 |
| \`gpt-4o\` | 128K | 多模態，綜合能力強 | 複雜任務、圖文理解 |
| \`gpt-4o-mini\` | 128K | 速度快、成本低 | 高並發情境、簡單對話 |
| \`gpt-4.1\` | 1M | 超長上下文 | 長文件處理、程式碼庫分析 |
| \`gpt-4.1-mini\` | 1M | 長上下文 + 低成本 | 長文件摘要 |
| \`gpt-4.1-nano\` | 1M | 最快最便宜 | 分類、提取等輕量任務 |
| \`o3\` | 200K | 推理增強 | 複雜推理、科學問題 |
| \`o4-mini\` | 200K | 推理 + 低成本 | 日常推理任務 |
| \`claude-sonnet-4-20250514\` | 200K | 程式設計和推理強 | 程式碼生成、分析 |
| \`qwen-max\` | 32K | 中文最佳化 | 中文業務情境 |
| \`qwen-plus\` | 128K | 性價比高 | 通用中文任務 |
| \`glm-4\` | 128K | 中文理解好 | 中文對話、寫作 |
| \`gemini-2.5-pro\` | 1M | 超長上下文 + 多模態 | 長文件、多模態分析 |

### Embedding 模型

| 模型 | 維度 | 說明 |
|---|---|---|
| \`text-embedding-3-large\` | 3072（可降維） | 高精度，建議生產使用 |
| \`text-embedding-3-small\` | 1536（可降維） | 速度快，成本低 |
| \`text-embedding-ada-002\` | 1536 | 相容舊版 |

### 圖片模型

| 模型 | 最大尺寸 | 特色功能 |
|---|---|---|
| \`gpt-image-1\` | 1536x1024 | 背景透明、審核等級控制 |
| \`dall-e-3\` | 1792x1024 | 高解析度、風格選擇 |
| \`dall-e-2\` | 1024x1024 | 基礎生成、多圖輸出 |

### 語音模型

| 模型 | 用途 | 說明 |
|---|---|---|
| \`tts-1\` | 文字轉語音 | 標準品質 |
| \`tts-1-hd\` | 文字轉語音 | 高解析音質 |
| \`gpt-4o-mini-tts\` | 文字轉語音 | 支援風格指令 |
| \`whisper-1\` | 語音轉文字 / 翻譯 | 多語言支援 |

### 影片模型

| 模型 | 說明 |
|---|---|
| \`kling-v2\` | 快手可靈，文生/圖生影片 |
| \`veo-2\` | Google 影片生成 |
| \`cerve\` | 影片生成 |

### Rerank 模型

| 模型 | 說明 |
|---|---|
| \`cohere-rerank-v3\` | Cohere 重新排序，RAG 情境推薦 |

### Moderation 模型

| 模型 | 說明 |
|---|---|
| \`omni-moderation-latest\` | 多模態審核，支援文字+圖片 |

**提示**：實際可用模型以 \`GET /v1/models\` 回傳為準，平台會持續新增模型。

## 2. 額度與計費說明

### 計費方式

零一雲按 **Token 用量** 計費，不同模型價格不同。

**輸入 Token**（prompt_tokens）：您發送給模型的內容

**輸出 Token**（completion_tokens）：模型生成的內容

一般情況下，輸出 Token 單價高於輸入 Token

### Token 是什麼

Token 是模型處理文字的基本單位。粗略換算：

| 語言 | 1 Token ≈ |
|---|---|
| 英文 | 4 個字元 / 0.75 個單字 |
| 中文 | 1~2 個漢字 |

### 模型倍率

不同模型價格不同，透過倍率換算。以 GPT-4o-mini 為基準（倍率 1x）：

| 模型 | 輸入倍率 | 輸出倍率 | 說明 |
|---|---|---|---|
| gpt-4o-mini | 1x | 1x | 基準 |
| deepseek-v3 | 0.5x | 0.5x | 更便宜 |
| gpt-4o | 5x | 15x | 能力強，價格高 |
| gpt-4.1 | 10x | 30x | 長上下文 |
| claude-sonnet-4 | 6x | 30x | 程式設計強 |

倍率僅供參考，實際以平台後台設定為準。管理員可在 **營運設定 → 模型價格** 中調整。

### 額度查詢

登入管理後台，在 **令牌管理** 中查看 Key 的已用額度和剩餘額度

或透過介面回應中的 \`usage\` 欄位即時取得本次消耗

### 額度耗盡

Key 額度用完後，請求會回傳：

\`\`\`json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
\`\`\`
HTTP 狀態碼為 \`402\`。此時需要儲值或更換有額度的 Key。

### 不同介面的計費

| 介面 | 計費依據 |
|---|---|
| Chat / Responses | 輸入 + 輸出 Token |
| Embeddings | 輸入 Token |
| Images | 按張數和模型計費，非 Token 計費 |
| Audio TTS | 按輸入字元數計費 |
| Audio STT / Translation | 按音訊時長計費 |
| Video | 按次計費 |
| Moderation | 輸入 Token（通常量很小） |
| Rerank | 輸入 Token |

## 3. 速率限制說明

### 限制維度

| 維度 | 含義 |
|---|---|
| RPM | Requests Per Minute，每分鐘請求數 |
| TPM | Tokens Per Minute，每分鐘 Token 數 |

### 限制規則

限制基於 **API Key** 維度，不同 Key 獨立計算

管理員可在後台為不同令牌組設定不同限額

預設限制因部署設定而異，具體數值聯絡管理員確認

### 超限回應

\`\`\`json
{
  "error": {
    "message": "Rate limit reached for default",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
\`\`\`
HTTP 狀態碼 \`429\`。

### 回應標頭

速率限制資訊會透過 HTTP 回應標頭回傳：

| Header | 含義 |
|---|---|
| \`X-RateLimit-Limit\` | 目前週期內的總限額 |
| \`X-RateLimit-Remaining\` | 目前週期內的剩餘次數 |
| \`X-RateLimit-Reset\` | 限額重置時間（Unix 時間戳記） |

### 應對策略

1. **讀取回應標頭**：每次請求後檢查 \`X-RateLimit-Remaining\`，提前預判
2. **請求前限流**：用戶端做本機限流，不要等 429 才降速
3. **指數退避**：收到 429 後，等 1s → 2s → 4s → 8s 再重試
4. **多 Key 輪換**：設定多個 Key，輪流使用，提升總吞吐量
5. **減少無效 Token**：精簡 prompt，避免重複上下文

#### 批量呼叫

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["人工智能", "机器学习", "深度学习"]
)
for item in response.data:
    print(f"索引 {item.index}: {len(item.embedding)} 维")
\`\`\`

#### 降維

\`text-embedding-3\` 系列支援指定輸出維度，降低儲存成本：

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="人工智能改变世界",
    dimensions=512  # 默认3072维降到512维
)
\`\`\`
降維會損失精度，建議從高維開始，根據效果逐步降低。

| 參數 | 建議 |
|---|---|
| \`model\` | 預設 \`cohere-rerank-v3\`，目前最通用 |
| \`top_n\` | 通常設 3~5，不需要回傳太多 |
| \`return_documents\` | 設 \`true\`，省得再按索引查原文 |`,
  },
  {
    id: 'ai-tools',
    title: '在 AI 程式開發工具中使用',
    category: '開始使用',
    content: `# 在 AI 程式開發工具中使用零一雲

本文檔介紹如何在 Cursor、Windsurf、Continue 等主流 AI 程式開發工具中接入零一雲，讓這些工具使用你自己的模型和額度。

## 1. 在 Cursor 中使用零一雲

Cursor 是目前最受歡迎的 AI 程式開發工具之一，支援自訂相容 API。零一雲完全相容標準介面格式，設定後即可使用。

### 1.1 新增模型

1. 開啟 Cursor，進入 **Settings → Models**
2. 在 **Models Names** 底部輸入框填寫你要用的模型名稱，點擊 \`Add model\`

推薦新增的模型：

| 用途 | 模型名 | 說明 |
|---|---|---|
| 日常編碼 | \`deepseek-v3\` | 性價比最高，中文理解好，編碼能力強 |
| 複雜推理 | \`deepseek-r1\` | 推理鏈模型，適合除錯、數學、邏輯 |
| 通用對話 | \`qwen-max\` | 阿里通義，中文情境表現優秀 |
| 長文字 | \`qwen-plus\` | 128K 上下文，性價比高 |
| 中文寫作 | \`glm-4\` | 智譜，中文理解和生成好 |

3. 新增後，在列表中**開啟對應模型的開關**

### 1.2 設定 API Key 和 Base URL

在同一個 Settings → Models 頁面中，找到 API Key 設定區域：

| 設定項目 | 填寫內容 |
|---|---|
| **API Key** | \`sk-your-key\`（你的零一雲令牌） |
| **Base URL** | \`{{BASE_URL}}/v1\` |

填寫完成後點擊 \`Verify\`，顯示成功即設定完成。

### 1.3 在 Cursor 中使用模型

設定完成後：

1. 開啟 Cursor 的 Chat 面板（快捷鍵 \`Cmd+L\` / \`Ctrl+L\`）
2. 在模型選擇下拉框中，選擇你剛新增的模型
3. 正常對話即可，所有請求會走零一雲

### 1.4 設定 @Docs 文件上下文

Cursor 的 \`@Docs\` 功能可以把外部文件作為上下文注入對話，讓模型基於你的 API 文件回答問題。

設定步驟：

1. 開啟 Cursor Settings → Features → Docs
2. 點擊 \`Add new doc\`
3. 填寫設定：

| 設定項目 | 值 |
|---|---|
| **Name** | \`零一云 Docs\` |
| **URL** | 你的文件網站位址 |
| **Start URL**（可選） | 文件首頁位址 |

4. 點擊 \`Save\` 儲存

### 1.5 使用 @Docs 引用文件

在 Cursor Chat 中：

1. 輸入 \`@Docs\`，選擇 \`零一云 Docs\`
2. 然後輸入你的問題，例如：

\`\`\`
@零一云 Docs 如何使用 Function Calling？
\`\`\`

Cursor 會自動拉取文件內容作為上下文，模型基於文件給出準確回答。

## 2. 在 Windsurf 中使用零一雲

Windsurf（原 Codeium）同樣支援標準相容 API。

### 設定步驟

1. 開啟 Windsurf Settings → AI Provider
2. 選擇 **OpenAI Compatible** 或 **Custom Provider**
3. 填寫設定：

| 設定項目 | 值 |
|---|---|
| **API Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` 或其他可用模型 |

4. 儲存後即可在 Cascade 和 Chat 中使用

### Windsurf 設定檔方式

也可以直接編輯設定檔 \`~/.windsurf/settings.json\`：

\`\`\`json
{
  "aiProvider": "openai-compatible",
  "openaiCompatible": {
    "baseUrl": "{{BASE_URL}}/v1",
    "apiKey": "sk-your-key",
    "models": [
      { "id": "deepseek-v3", "name": "DeepSeek V3" },
      { "id": "deepseek-r1", "name": "DeepSeek R1" },
      { "id": "qwen-max", "name": "Qwen Max" },
      { "id": "glm-4", "name": "GLM-4" }
    ]
  }
}
\`\`\`

## 3. 在 Continue 中使用零一雲

Continue 是開源的 AI 程式設計助手，支援 VS Code 和 JetBrains。

### 設定步驟

編輯 Continue 設定檔 \`~/.continue/config.json\`：

\`\`\`json
{
  "models": [
    {
      "title": "零一云 DeepSeek V3",
      "provider": "openai",
      "model": "deepseek-v3",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    },
    {
      "title": "零一云 DeepSeek R1",
      "provider": "openai",
      "model": "deepseek-r1",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    },
    {
      "title": "零一云 Qwen Max",
      "provider": "openai",
      "model": "qwen-max",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    },
    {
      "title": "零一云 GLM-4",
      "provider": "openai",
      "model": "glm-4",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    }
  ],
  "tabAutocompleteModel": {
    "title": "零一云 Autocomplete",
    "provider": "openai",
    "model": "deepseek-v3",
    "apiBase": "{{BASE_URL}}/v1",
    "apiKey": "sk-your-key"
  },
  "embeddingsProvider": {
    "provider": "openai",
    "model": "text-embedding-3-large",
    "apiBase": "{{BASE_URL}}/v1",
    "apiKey": "sk-your-key"
  }
}
\`\`\`

### 設定說明

| 欄位 | 說明 |
|---|---|
| \`models\` | 對話模型列表，會出現在 Continue 的模型選擇下拉框中 |
| \`tabAutocompleteModel\` | 程式碼補全模型，建議用快模型（deepseek-v3） |
| \`embeddingsProvider\` | 程式碼庫索引的 Embedding 模型 |

設定完成後重新啟動 VS Code / JetBrains，在 Continue 面板中即可選擇零一雲模型。

## 4. 在 VS Code Copilot 中使用零一雲

GitHub Copilot 支援透過 Copilot Chat 的自訂模型功能接入第三方 API。

### 設定步驟

1. 安裝 **GitHub Copilot** 和 **GitHub Copilot Chat** 擴充功能
2. 開啟 VS Code Settings → 搜尋 \`github.copilot.chat\`
3. 設定自訂端點（需要 VS Code 1.90+ 和 Copilot 自訂模型支援）

### 透過環境變數設定

在終端中設定環境變數後啟動 VS Code：

\`\`\`bash
export OPENAI_API_KEY=sk-your-key
export OPENAI_BASE_URL={{BASE_URL}}/v1
code .
\`\`\`

**注意**：Copilot 對自訂模型的支援在持續迭代，具體設定方式可能隨版本變化。如不支援自訂模型，建議使用 Cursor 或 Continue 作為替代。

## 5. 在 JetBrains AI 中使用零一雲

JetBrains IDE（IntelliJ IDEA / PyCharm / WebStorm 等）的 AI Assistant 支援自訂端點。

### 設定步驟

1. 開啟 **Settings → Tools → AI Assistant → Providers**
2. 選擇 **OpenAI Compatible** 或 **Custom Provider**
3. 填寫：

| 設定項目 | 值 |
|---|---|
| **Server URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` 或其他 |

4. 點擊 \`Test Connection\` 驗證
5. 儲存後即可在 AI Assistant 中使用

## 6. 在對話工具中使用

如果你只想在對話介面中使用零一雲的模型（而非程式開發工具），可以透過以下方式：

### 使用第三方用戶端

支援自訂 API 的用戶端都可以用：

| 用戶端 | 平台 | 設定方式 |
|---|---|---|
| ChatBox | 桌面端 | 設定 → API Base URL + Key |
| NextChat | Web | 設定 → 介面位址 + Key |
| LobeChat | Web/桌面 | 設定 → 模型服務 → 代理位址 + Key |
| Open WebUI | Web | 設定 → API URL + Key |
| Cherry Studio | 桌面端 | 設定 → API 位址 + Key |

通用設定：

| 設定項目 | 值 |
|---|---|
| API Base URL | \`{{BASE_URL}}/v1\` |
| API Key | \`sk-your-key\` |

## 7. 常見問題

### Q：Cursor 中 Verify 失敗怎麼辦？

檢查以下幾點：

| 檢查項目 | 正確值 |
|---|---|
| Base URL | \`{{BASE_URL}}/v1\`（結尾帶 \`/v1\`） |
| API Key | \`sk-\` 開頭，無多餘空格 |
| 模型名 | 必須是 \`GET /v1/models\` 回傳的 id，注意大小寫 |
| 網路連通 | 能 \`curl {{BASE_URL}}/v1/models\` 正常回傳 |

### Q：Cursor 中模型沒有出現？

- 確認模型開關已開啟
- 結束 Cursor 重新開啟
- 檢查模型名是否拼寫正確（全小寫，如 \`deepseek-v3\` 不是 \`DeepSeek-V3\`）

### Q：程式碼補全很慢？

程式碼補全對延遲敏感，建議：

- 用快速模型：\`deepseek-v3\`
- 避免用推理模型（\`deepseek-r1\`）做補全
- Continue 用戶可在 \`tabAutocompleteModel\` 中單獨設定快速模型

### Q：對話中模型報錯 \`model_not_found\`？

該模型在你的零一雲帳戶下未啟用。聯絡管理員開通，或換一個可用模型。

### Q：多工具能否共用同一個 Key？

可以，但要注意：

- 所有工具共享 Key 的額度，注意用量
- 並發請求共享 Key 的速率限制
- 建議不同工具用不同 Key，方便管理和監控

### Q：能否同時設定其他服務和零一雲？

**Cursor**：不支援同時設定兩個端點，後設定的會覆蓋。如需同時使用，建議透過 Continue 或其他工具分管。

**Continue**：支援，在 \`models\` 陣列中新增不同 \`apiBase\` 的設定即可。

### Q：@Docs 設定後引用不到內容？

- 確認文件 URL 可公網存取
- 嘗試在瀏覽器開啟設定的 URL 確認頁面正常
- 如果是內部文件網站，Cursor 可能無法爬取

### Q：Continue 的 Embedding 索引報錯？

確認 \`embeddingsProvider\` 設定正確：

\`\`\`json
{
  "provider": "openai",
  "model": "text-embedding-3-large",
  "apiBase": "{{BASE_URL}}/v1",
  "apiKey": "sk-your-key"
}
\`\`\`
如果仍然報錯，檢查 Key 是否有 Embedding 介面權限。

## 設定速查表

所有工具的核心設定只有兩個：

| 設定項目 | 值 |
|---|---|
| **Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |

各工具的設定入口：

| 工具 | 設定入口 | 說明 |
|---|---|---|
| Cursor | Settings → Models → API Key | 填 Base URL + Key |
| Windsurf | Settings → AI Provider | 選 Compatible |
| Continue | \`~/.continue/config.json\` | 編輯設定檔 |
| JetBrains | Settings → Tools → AI Assistant | 選 Custom Provider |
| ChatBox | 設定 → API | 填位址 + Key |
| LobeChat | 設定 → 模型服務 | 填代理位址 + Key |
| NextChat | 設定 → 介面 | 填位址 + Key |
| Open WebUI | 設定 → API | 填 API URL + Key |`,
  },
  {
    id: 'api-quick-start',
    title: '快速開始',
    category: '介面呼叫說明',
    content: `# 快速開始

最簡呼叫（cURL）：

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}]
  }'
\`\`\`

**核心點**：只需改 \`base_url\` 和 \`api_key\`，其餘程式碼和 OpenAI 官方完全一致。

### 支援的介面一覽

| 介面 | 方法 | 路徑 | 說明 |
|---|---|---|---|
| 模型列表 | GET | \`/v1/models\` | 查看可用模型 |
| 對話補全 | POST | \`/v1/chat/completions\` | Chat 介面，支援串流 |
| Responses | POST | \`/v1/responses\` | OpenAI Responses API，支援串流 |
| 文字向量化 | POST | \`/v1/embeddings\` | Embedding 介面 |
| 圖片生成 | POST | \`/v1/images/generations\` | 文生圖 |
| 文字轉語音 | POST | \`/v1/audio/speech\` | TTS，回傳音訊串流 |
| 語音轉文字 | POST | \`/v1/audio/transcriptions\` | STT，上傳音訊檔案 |
| 語音翻譯 | POST | \`/v1/audio/translations\` | 音訊翻譯為英文 |
| 影片生成 | POST | \`/v1/video/generations\` | 文生影片 / 圖生影片 |
| 內容審核 | POST | \`/v1/moderations\` | 文字/圖文安全審核 |
| 重新排序 | POST | \`/v1/rerank\` | 文件相關性排序 |`,
  },
  {
    id: 'get-api-key',
    title: '取得 API Key',
    category: '介面呼叫說明',
    content: `# 取得 API Key

1. 登入零一雲管理後台
2. 進入 API 金鑰頁面
3. 點擊【新增 API 金鑰】填寫名稱和額度
4. 建立成功後複製 \`sk-\` 開頭的金鑰

**注意**：Key 只在建立時顯示一次，請立即儲存。如果遺忘，需要刪除後重新建立。

### Key 的格式

\`\`\`
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`
以 \`sk-\` 開頭，後面是一串隨機字元。呼叫時放在 HTTP Header 的 \`Authorization\` 欄位中。`,
  },
  {
    id: 'auth',
    title: '鑑權方式',
    category: '介面呼叫說明',
    content: `# 鑑權方式

零一雲使用 **Bearer Token** 鑑權，所有介面均需攜帶。

### Header 格式

\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

### cURL 範例

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### SDK 中設定

\`\`\`python
# Python
client = OpenAI(api_key="sk-your-api-key", base_url="{{BASE_URL}}/v1")
\`\`\`

\`\`\`javascript
// Node.js
const client = new OpenAI({ apiKey: "sk-your-api-key", baseURL: "{{BASE_URL}}/v1" });
\`\`\`

### 鑑權失敗的表現

回傳 HTTP 狀態碼 \`401\`

回應內容：

\`\`\`json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

常見原因：

- Key 寫錯或漏了 \`sk-\` 前綴
- Key 已被刪除或停用
- Header 格式不對（\`Bearer\` 和 \`sk-\` 之間只有一個空格）`,
  },
  {
    id: 'request-url',
    title: '請求位址',
    category: '介面呼叫說明',
    content: `# 請求位址

### Base URL

\`\`\`
{{BASE_URL}}
\`\`\`

### 完整位址規則

\`\`\`
{Base URL}{接口路径}
\`\`\`

範例：

| 介面 | 完整位址 |
|---|---|
| Chat | \`{{BASE_URL}}/v1/chat/completions\` |
| Responses | \`{{BASE_URL}}/v1/responses\` |
| Embeddings | \`{{BASE_URL}}/v1/embeddings\` |
| Images | \`{{BASE_URL}}/v1/images/generations\` |
| TTS | \`{{BASE_URL}}/v1/audio/speech\` |
| STT | \`{{BASE_URL}}/v1/audio/transcriptions\` |
| Translation | \`{{BASE_URL}}/v1/audio/translations\` |
| Video | \`{{BASE_URL}}/v1/video/generations\` |
| Moderation | \`{{BASE_URL}}/v1/moderations\` |
| Rerank | \`{{BASE_URL}}/v1/rerank\` |
| Models | \`{{BASE_URL}}/v1/models\` |

### SDK 中設定 Base URL

只需設定 \`base_url\` 為 \`{{BASE_URL}}/v1\`（注意結尾帶 \`/v1\`），SDK 會自動拼接後續路徑。`,
  },
  {
    id: 'error-codes',
    title: '錯誤碼說明',
    category: '介面呼叫說明',
    content: `# 錯誤碼說明

### HTTP 狀態碼

| 狀態碼 | 含義 | 處理建議 |
|---|---|---|
| 200 | 成功 | 正常處理回應 |
| 400 | 請求參數錯誤 | 檢查請求內容格式和必填參數 |
| 401 | 鑑權失敗 | 檢查 API Key 是否正確 |
| 402 | 額度不足 | 儲值或更換有額度的 Key |
| 403 | 無權限 | 該 Key 無權存取此模型或介面 |
| 404 | 介面不存在 | 檢查請求路徑是否正確 |
| 429 | 請求頻率超限 | 降低請求頻率，或聯絡管理員提高額度 |
| 500 | 伺服器內部錯誤 | 稍後重試；持續出現則聯絡維運 |
| 502 | 閘道錯誤 | 上游服務異常，稍後重試 |
| 503 | 服務不可用 | 服務暫時過載，稍後重試 |

### 錯誤回應格式

所有錯誤都遵循統一格式：

\`\`\`json
{
  "error": {
    "message": "具体错误描述",
    "type": "错误类型",
    "code": "错误码"
  }
}
\`\`\`

### 常見錯誤碼

| code | 含義 | 觸發情境 |
|---|---|---|
| \`invalid_api_key\` | API Key 無效 | Key 寫錯、已刪除、已停用 |
| \`insufficient_quota\` | 額度不足 | Key 餘額用完 |
| \`model_not_found\` | 模型不存在 | 傳了不存在的 model 參數 |
| \`context_length_exceeded\` | 輸入超長 | messages 總長度超過模型上下文視窗 |
| \`rate_limit_exceeded\` | 頻率超限 | 短時間請求過多 |
| \`invalid_request_error\` | 請求格式錯誤 | 缺少必填參數、型別不對等 |
| \`server_error\` | 伺服器錯誤 | 內部異常，一般重試可恢復 |

### 重試建議

**429 / 500 / 502 / 503**：可重試，建議指數退避（1s → 2s → 4s → 8s）

**400 / 401 / 402 / 403 / 404**：不要重試，先修正請求

同一請求最多重試 3 次`,
  },
  {
    id: 'streaming',
    title: '串流輸出說明',
    category: '介面呼叫說明',
    content: `# 串流輸出說明

串流輸出用於 Chat 和 Responses 介面，逐塊回傳內容，使用者體驗更好（不用等全部生成完才顯示）。

### 開啟方式

請求內容中設定 \`stream: true\`：

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "写一首诗"}],
  "stream": true
}
\`\`\`

### 回應格式（SSE）

串流回應使用 **Server-Sent Events (SSE)** 協定，Content-Type 為 \`text/event-stream\`。

每個資料區塊格式：

\`\`\`
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

**關鍵點：**

- 每條資料以 \`data: \` 開頭，後面是 JSON
- 最後一條是 \`data: [DONE]\`，表示串流結束
- 每個 chunk 的 \`delta.content\` 是本次新增的文字片段，拼起來就是完整回覆
- \`finish_reason\` 為 \`stop\` 表示正常結束

### cURL 串流呼叫

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": true
  }'
\`\`\`

### Python SDK 串流呼叫

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="{{BASE_URL}}/v1"
)

stream = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
# 输出：逐字打印的完整回复
\`\`\`

### Node.js SDK 串流呼叫

\`\`\`javascript
const stream = await client.chat.completions.create({
    model: "deepseek-v3",
    messages: [{ role: "user", content: "写一首诗" }],
    stream: true,
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
}
\`\`\`

### 串流輸出中的 Usage 資訊

預設串流回應**不包含** usage（Token 用量）。如果需要，設定 \`stream_options\`：

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true,
  "stream_options": {"include_usage": true}
}
\`\`\`

設定後，最後一個 chunk 會包含完整的 usage 欄位：

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
\`\`\`

### Responses 介面的串流輸出

Responses API 同樣支援 \`stream: true\`，格式與 Chat 類似，也是 SSE 協定，最後以 \`data: [DONE]\` 結束。

### 自行解析 SSE 的注意事項

如果您不使用 SDK，自行解析 SSE 串流，請注意以下幾點：

1. **按行讀取**：每條資料佔一行，以 \`data: \` 開頭
2. **跳過空行**：SSE 協定中空行是事件分隔符號，不影響資料
3. **偵測結束**：遇到 \`data: [DONE]\` 就停止讀取
4. **處理斷線**：網路中斷時可以重試，但無法從斷點續傳，需要重新發起請求
5. **逾時設定**：建議 HTTP 用戶端逾時設為 60 秒以上，長文字生成可能耗時較久

### 串流 vs 非串流比較

| 維度 | 非串流 (\`stream: false\`) | 串流 (\`stream: true\`) |
|---|---|---|
| 回應方式 | 一次性回傳完整結果 | 逐塊回傳文字片段 |
| 使用者感受 | 等待時間較長 | 逐字出現，體感更快 |
| 回應格式 | \`chat.completion\` | \`chat.completion.chunk\` |
| Usage | 預設包含 | 需設定 \`stream_options\` |
| 適用情境 | 後端批次處理、API 串接 | 前端對話、即時互動 |
| 解析難度 | 簡單，直接讀取 JSON | 需要 SSE 解析 |`,
  },
  {
    id: 'chat-completions',
    title: '對話補全',
    category: 'API 介面',
    content: `# 對話補全

> **POST** \`/v1/chat/completions\`

建立對話補全。支援串流（SSE）和非串流兩種模式。

- 非串流：設定 \`stream: false\`（預設），回傳完整回應
- 串流：設定 \`stream: true\`，以 SSE 逐塊回傳 ChatCompletionChunk

## 請求參數

### Header 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`Authorization\` | string | 是 | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | 否 | 請求唯一識別碼，用於鏈路追蹤 |
| \`X-Tenant-Id\` | string | 否 | 租戶識別碼，多租戶情境下用於隔離 |
| \`X-Channel\` | enum | 否 | 呼叫管道識別碼（web/app/api/miniapp），預設 api |

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 是 | 模型 ID，如 \`deepseek-v3\` |
| \`messages\` | array | 是 | 對話訊息列表 |
| \`temperature\` | number | 否 | 取樣溫度，0~2，預設 0.7 |
| \`top_p\` | number | 否 | 核取樣機率，0~1，預設 1 |
| \`max_tokens\` | integer | 否 | 最大生成 Token 數 |
| \`stream\` | boolean | 否 | 是否串流輸出，預設 false |
| \`stream_options\` | object | 否 | 串流選項，如 \`{"include_usage": true}\` |
| \`tools\` | array | 否 | 可呼叫的工具列表 |
| \`tool_choice\` | string/object | 否 | 工具選擇策略（none/auto/required） |
| \`response_format\` | object | 否 | 回應格式，如 \`{"type": "json_object"}\` |
| \`stop\` | string/array | 否 | 停止序列 |
| \`presence_penalty\` | number | 否 | 存在懲罰，預設 0 |
| \`frequency_penalty\` | number | 否 | 頻率懲罰，預設 0 |
| \`n\` | integer | 否 | 生成候選數，預設 1 |
| \`user\` | string | 否 | 使用者識別碼 |

### 請求範例

\`\`\`json
{
    "model": "deepseek-v3",
    "messages": [
        {
            "role": "system",
            "content": "你是一个有帮助的助手"
        },
        {
            "role": "user",
            "content": "你好"
        }
    ],
    "stream": false,
    "temperature": 0.7
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/chat/completions' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "deepseek-v3",
    "messages": [
        {
            "role": "system",
            "content": "你是一个有帮助的助手"
        },
        {
            "role": "user",
            "content": "你好"
        }
    ],
    "stream": false,
    "temperature": 0.7
}'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1713833628,
    "model": "deepseek-v3",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "你好！有什么可以帮你的吗？"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 15,
        "completion_tokens": 8,
        "total_tokens": 23
    }
}
\`\`\`

### 401 鑑權失敗`,
  },
  {
    id: 'models',
    title: '列出可用模型',
    category: 'API 介面',
    content: `# 列出可用模型

> **GET** \`/v1/models\`

回傳目前可用的模型列表

## 請求參數

### Header 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`Authorization\` | string | 是 | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | 否 | 請求唯一識別碼 |
| \`X-Tenant-Id\` | string | 否 | 租戶識別碼 |
| \`X-Channel\` | enum | 否 | 呼叫管道識別碼，預設 api |

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/models' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "object": "list",
    "data": [
        {
            "id": "deepseek-v3",
            "object": "model",
            "created": 1700000000,
            "owned_by": "零一云"
        },
        {
            "id": "qwen-plus",
            "object": "model",
            "created": 1700000000,
            "owned_by": "零一云"
        }
    ]
}
\`\`\``,
  },
  {
    id: 'responses',
    title: 'Responses API',
    category: 'API 介面',
    content: `# Responses API

> **POST** \`/v1/responses\`

OpenAI Responses API。支援文字輸入和訊息陣列，回傳結構化 Response 物件，包含 output 訊息和 usage。

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 是 | 模型 ID，如 \`qwen-plus\` |
| \`input\` | string/array | 是 | 輸入內容，支援字串或訊息陣列 |
| \`instructions\` | string | 否 | 系統指令 |
| \`temperature\` | number | 否 | 取樣溫度 |
| \`max_output_tokens\` | integer | 否 | 最大輸出 Token 數 |
| \`stream\` | boolean | 否 | 是否串流輸出，預設 false |
| \`tools\` | array | 否 | 可呼叫的工具列表 |
| \`user\` | string | 否 | 使用者識別碼 |

### 請求範例

\`\`\`json
{
    "model": "qwen-plus",
    "input": "介绍北京"
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/responses' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "qwen-plus",
    "input": "介绍北京"
}'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "id": "resp-abc123",
    "object": "response",
    "created_at": 1713833628,
    "model": "qwen-plus",
    "status": "completed",
    "output": [
        {
            "type": "message",
            "id": "msg-001",
            "role": "assistant",
            "content": [
                {
                    "type": "output_text",
                    "text": "北京是中国的首都，拥有超过3000年的建城史和800余年的建都史……"
                }
            ]
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 50,
        "total_tokens": 60
    }
}
\`\`\``,
  },
  {
    id: 'embeddings',
    title: '文字向量化',
    category: 'API 介面',
    content: `# 文字向量化

> **POST** \`/v1/embeddings\`

將文字轉換為向量表示，支援批次輸入

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 是 | 模型 ID，如 \`text-embedding-3-large\` |
| \`input\` | string/array | 是 | 輸入文字，支援單條或陣列 |
| \`encoding_format\` | enum | 否 | 編碼格式（float/base64），預設 float |
| \`dimensions\` | integer | 否 | 向量維度（僅 text-embedding-3 系列支援） |

### 請求範例

\`\`\`json
{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/embeddings' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "object": "list",
    "data": [
        {
            "object": "embedding",
            "index": 0,
            "embedding": [0.0023, -0.0094, 0.0151]
        }
    ],
    "model": "text-embedding-3-large",
    "usage": {
        "prompt_tokens": 4,
        "total_tokens": 4
    }
}
\`\`\``,
  },
  {
    id: 'images',
    title: '生成圖片',
    category: 'API 介面',
    content: `# 生成圖片

> **POST** \`/v1/images/generations\`

根據文字提示生成圖片。

**尺寸對照：**

| 模型 | 支援尺寸 |
|---|---|
| wanx-v2 | 1024x1024 / 720x1280 / 1280x720 / auto |
| cogview-4 | 1024x1024 / 768x1344 / 1344x768 |
| cogview-3-plus | 1024x1024 / 768x1344 / 1344x768 |

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 是 | 圖片生成模型（wanx-v2 / cogview-4 / cogview-3-plus） |
| \`prompt\` | string | 是 | 圖片描述文字 |
| \`n\` | integer | 否 | 生成數量（1~10，cogview-3-plus 僅支援 1） |
| \`size\` | string | 否 | 圖片尺寸 |
| \`quality\` | enum | 否 | 圖片品質（low/medium/high/auto） |
| \`background\` | enum | 否 | 背景透明度（transparent/opaque/auto），僅 wanx-v2 |
| \`moderation\` | enum | 否 | 內容審核等級（low/auto），僅 wanx-v2 |
| \`response_format\` | enum | 否 | 回傳格式（url/b64_json），預設 url |
| \`style\` | enum | 否 | 圖片風格（vivid/natural），僅 cogview-3-plus |
| \`user\` | string | 否 | 使用者識別碼 |

### 請求範例

\`\`\`json
{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/images/generations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "created": 1713833628,
    "data": [
        {
            "url": "https://cdn.example.com/img-001.png"
        }
    ],
    "usage": {
        "total_tokens": 100,
        "input_tokens": 50,
        "output_tokens": 50
    }
}
\`\`\``,
  },
  {
    id: 'tts',
    title: '文字轉語音（TTS）',
    category: 'API 介面',
    content: `# 文字轉語音（TTS）

> **POST** \`/v1/audio/speech\`

將文字合成為語音，回傳音訊串流

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 是 | TTS 模型 ID，如 \`cosyvoice-v2\` |
| \`voice\` | enum | 是 | 語音音色 |
| \`input\` | string | 是 | 待合成文字 |
| \`response_format\` | enum | 否 | 輸出音訊格式（mp3/opus/aac/flac/wav/pcm），預設 mp3 |
| \`speed\` | number | 否 | 語速（0.25~4），預設 1 |
| \`instructions\` | string | 否 | 語音風格指令（僅 cosyvoice-v2） |

### 請求範例

\`\`\`json
{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/speech' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}'
\`\`\`

## 回傳回應

### 200 成功

回傳音訊串流（binary），Content-Type: audio/mpeg`,
  },
  {
    id: 'stt',
    title: '語音轉文字（STT）',
    category: 'API 介面',
    content: `# 語音轉文字（STT）

> **POST** \`/v1/audio/transcriptions\`

將音訊檔案轉錄為文字

## 請求參數

### Body 參數（multipart/form-data）

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`file\` | file | 是 | 音訊檔案 |
| \`model\` | string | 是 | 語音辨識模型，如 \`sensevoice-v1\` |
| \`language\` | string | 否 | 音訊語言（ISO 639-1，如 zh、en） |
| \`response_format\` | enum | 否 | 輸出格式（json/text/srt/verbose_json/vtt），預設 json |
| \`temperature\` | number | 否 | 取樣溫度 |

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/transcriptions' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'language="zh"' \\
--form 'response_format="json"'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "text": "你好，欢迎使用语音识别服务。"
}
\`\`\``,
  },
  {
    id: 'translation',
    title: '語音翻譯',
    category: 'API 介面',
    content: `# 語音翻譯

> **POST** \`/v1/audio/translations\`

將音訊檔案翻譯為英文文字

## 請求參數

### Body 參數（multipart/form-data）

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`file\` | file | 是 | 音訊檔案 |
| \`model\` | string | 是 | 語音翻譯模型，如 \`sensevoice-v1\` |
| \`response_format\` | enum | 否 | 輸出格式（json/text/srt/verbose_json/vtt），預設 json |
| \`temperature\` | number | 否 | 取樣溫度 |

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/translations' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'response_format="json"'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "text": "Hello, welcome to the speech translation service."
}
\`\`\``,
  },
  {
    id: 'video',
    title: '生成影片',
    category: 'API 介面',
    content: `# 生成影片

> **POST** \`/v1/video/generations\`

根據文字提示生成影片，支援純文生影片和圖生影片兩種模式，相容豆包 Seedance (Sendance) 影片生成協定。

- 文生影片：僅提供 prompt
- 圖生影片：提供 prompt + image_url（Seedance 支援多圖：first_frame / last_frame / reference_image）

## 支援的模型

### Seedance 系列

| 模型 | 說明 |
|---|---|
| \`doubao-seedance-1-0-pro-250528\` | 1.0 Pro，高品質影片生成 |
| \`doubao-seedance-1-0-lite-t2v\` | 1.0 Lite，文生影片 |
| \`doubao-seedance-1-0-lite-i2v\` | 1.0 Lite，圖生影片 |
| \`doubao-seedance-1-5-pro-251215\` | 1.5 Pro，效能增強 |
| \`doubao-seedance-2-0-260128\` | 2.0 標準版 |
| \`doubao-seedance-2-0-fast-260128\` | 2.0 快速版，低延遲 |
| \`doubao-seedance-2-0-mini-260615\` | 2.0 Mini，輕量低成本 |
| \`doubao-seedance-2-5-260628\` | 2.5 最新版，最長 30 秒，支援 21:9 與多模態參考（30 圖 + 10 影片 + 10 音訊） |

### 其他模型

\`kling-v1\` / \`kling-v2\` / \`cogvideox-2\` / \`vidu-1\` / \`jimeng\` / \`sora\`

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 是 | 影片生成模型（建議 Seedance 系列） |
| \`prompt\` | string | 是 | 影片描述文字 |
| \`image_url\` | string | 否 | 參考圖片 URL（圖生影片模式） |
| \`images\` | array | 否 | 多圖輸入（Seedance 圖生影片，依順序對應 first_frame / last_frame / reference_image） |
| \`resolution\` | string | 否 | 輸出解析度（Seedance：480p / 720p / 1080p / 4k） |
| \`ratio\` | string | 否 | 畫面比例（Seedance 2.5：21:9 / 16:9 / 4:3 / 1:1 / 3:4 / 9:16；其餘：16:9 / 9:16 / 1:1） |
| \`size\` | string | 否 | 影片尺寸，如 1280x720 |
| \`duration\` | integer | 否 | 影片時長（秒）。Seedance 2.5 支援 4–30，2.0 系列 4–15，1.5 4–12，1.0 2–12 |
| \`n\` | integer | 否 | 生成數量，預設 1 |
| \`metadata\` | object | 否 | 擴充參數，支援多模態輸入（video_url / audio_url）及 negative_prompt、style、watermark 等 |

### 請求範例（文生影片）

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}
\`\`\`

### 請求範例（圖生影片）

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "在首帧基础上添加烟花效果",
    "images": [
        "https://example.com/first-frame.jpg",
        "https://example.com/last-frame.jpg"
    ]
}
\`\`\`

### 請求範例（影片續寫 / 多模態）

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "让视频中的人物转身看向镜头",
    "metadata": {
        "content": [
            {
                "type": "video_url",
                "video_url": {
                    "url": "https://example.com/input.mp4"
                }
            },
            {
                "type": "audio_url",
                "audio_url": {
                    "url": "https://example.com/bgm.mp3"
                }
            }
        ]
    }
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/video/generations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}'
\`\`\`

## 回傳回應

### 200 成功（任務已提交）

\`\`\`json
{
    "id": "task_xxxxxxxx",
    "task_id": "task_xxxxxxxx",
    "object": "video",
    "model": "doubao-seedance-2-5-260628",
    "status": "queued",
    "progress": 0,
    "created_at": 1713833628
}
\`\`\`

## 查詢任務狀態

> **GET** \`/v1/video/generations/{task_id}\`

提交任務後，透過輪詢該介面取得生成進度與結果。

### 任務狀態

| 狀態 | 說明 |
|---|---|
| \`QUEUED\` | 排隊中，等待開始生成 |
| \`IN_PROGRESS\` | 生成中，progress 為目前進度 |
| \`SUCCESS\` | 已完成，result_url 為影片位址 |
| \`FAILURE\` | 生成失敗，fail_reason 為失敗原因 |

### 回應範例（已完成）

\`\`\`json
{
    "code": "success",
    "message": "",
    "data": {
        "id": 123,
        "task_id": "task_xxxxxxxx",
        "status": "SUCCESS",
        "progress": "100%",
        "result_url": "https://example.com/video.mp4",
        "model": "doubao-seedance-2-5-260628",
        "fail_reason": ""
    }
}
\`\`\`

> **注意**：Seedance 2.0 / 2.5 支援多模態輸入（影片 + 音訊 + 圖片），可透過 \`metadata.content\` 傳入；其中 2.5 單次最多支援 30 張圖片、10 段影片、10 段音訊參考，並支援最長 30 秒的單段生成與多輪續寫。任務提交後需透過 \`GET /v1/video/generations/{task_id}\` 輪詢任務狀態。`,
  },
  {
    id: 'asset-library',
    title: '素材庫',
    category: 'API 介面',
    content: `# 素材庫

素材庫用於管理影片生成所需的多模態素材。客戶可透過外部介面上傳圖片 / 影片 / 音訊素材，然後在呼叫影片生成介面（\`/v1/video/generations\`）時，以 URL 形式引用這些素材作為 Seedance (Sendance) 的多模態輸入。

## 介面列表

| 方法 | 路徑 | 說明 |
|---|---|---|
| \`POST\` | \`/api/asset\` | 上傳素材 |
| \`GET\` | \`/api/asset\` | 取得素材列表（分頁） |
| \`GET\` | \`/api/asset/search\` | 搜尋素材 |
| \`GET\` | \`/api/asset/{id}\` | 取得素材詳情 |
| \`DELETE\` | \`/api/asset/{id}\` | 刪除素材 |

所有素材庫介面均需攜帶 \`Authorization: Bearer <token>\`（平台使用者令牌），一般使用者只能存取自己的素材，管理員可查看 / 管理所有素材。

## 上傳素材

> **POST** \`/api/asset\`

使用 \`multipart/form-data\` 上傳素材檔案。

### 請求參數

| 欄位 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`file\` | file | 是 | 素材檔案 |
| \`group_id\` | integer | 是 | 素材分組 ID（素材必須歸屬分組） |
| \`model\` | string | 是 | 生成模型識別碼，如 \`sendance-2.0\` / \`sendance-2.5\` |
| \`channel_id\` | integer | 否 | 上游渠道 ID（不傳則取分組所屬渠道） |

### 檔案大小限制（與火山引擎 Seedance 對齊）

| 類型 | 大小限制 |
|---|---|
| 圖片 (image) | 30MB |
| 影片 (video) | 200MB |
| 音訊 (audio) | 15MB |

素材類型根據檔案的 MIME 類型自動辨識：\`image/*\` → image、\`video/*\` → video、\`audio/*\` → audio，其他類型將被拒絕。

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@/path/to/video.mp4' \\
--form 'group_id=1' \\
--form 'model=sendance-2.0'
\`\`\`

### 回傳範例

\`\`\`json
{
    "success": true,
    "message": "",
    "data": {
        "id": 1,
        "user_id": 3,
        "user_name": "user01",
        "tenant_id": null,
        "model": "sendance-2.0",
        "type": "video",
        "name": "开场视频.mp4",
        "storage_key": "video/uuid.mp4",
        "url": "https://storage.example.com/video/uuid.mp4",
        "size": 10485760,
        "mime_type": "video/mp4",
        "duration": null,
        "width": null,
        "height": null,
        "created_time": 1713833628
    }
}
\`\`\`

> 上傳成功後回傳的 \`url\` 欄位即為素材存取位址，可直接用於影片生成介面。

## 取得素材列表

> **GET** \`/api/asset\`

分頁取得素材列表，支援依類型和模型篩選。

### 查詢參數

| 參數 | 類型 | 說明 |
|---|---|---|
| \`type\` | string | 素材類型 (image / video / audio) |
| \`model\` | string | 生成模型識別碼（如 \`sendance-2.0\`） |
| \`page\` | integer | 頁碼，預設 0 |
| \`page_size\` | integer | 每頁數量，預設 10 |
| \`user_id\` | integer | 使用者 ID（僅管理員） |
| \`tenant_id\` | integer | 租戶 ID（僅管理員） |

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset?type=video&model=sendance-2.0&page=0&page_size=20' \\
--header 'Authorization: Bearer <token>'
\`\`\`

### 回傳範例

\`\`\`json
{
    "success": true,
    "message": "",
    "data": [
        {
            "id": 1,
            "user_id": 3,
            "type": "video",
            "name": "开场视频.mp4",
            "url": "https://storage.example.com/video/uuid.mp4",
            "model": "sendance-2.0",
            "size": 10485760,
            "created_time": 1713833628
        }
    ],
    "total": 1
}
\`\`\`

## 搜尋素材

> **GET** \`/api/asset/search\`

依關鍵字搜尋素材，參數與取得素材列表相同，額外支援：

| 參數 | 類型 | 說明 |
|---|---|---|
| \`keyword\` | string | 搜尋關鍵字（比對素材名稱） |

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/search?keyword=开场' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 取得素材詳情

> **GET** \`/api/asset/{id}\`

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 刪除素材

> **DELETE** \`/api/asset/{id}\`

僅素材所有者或管理員可刪除。

\`\`\`bash
curl --location --request DELETE '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 素材用於 Seedance 影片生成

上傳素材後，將回傳的 \`url\` 作為影片生成介面的多模態輸入：

> **說明**：平台在提交影片生成任務時，會自動將素材庫中的**圖片**素材讀取並轉換為 Base64 編碼（\`data:image/...;base64,...\`）提交給上游火山方舟，您無需額外準備公網可存取的靜態位址；客戶自架且素材庫中不存在的公網 URL、Base64 編碼、\`asset://\` 素材 ID 則原樣透傳。**影片/音訊**素材僅支援公網 URL 輸入，請使用素材庫外的公網位址（如圖床、物件儲存 CDN），單張圖片建議不超過 25MB。

### 圖生影片（參考圖）

\`\`\`json
{
    "model": "doubao-seedance-1-0-lite-i2v",
    "prompt": "将第一帧作为起始画面",
    "metadata": {
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": "/api/asset/file/image/uuid.jpg"
                },
                "role": "first_frame"
            }
        ]
    }
}
\`\`\`

### 影片續寫 / 音訊輸入

\`\`\`json
{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "让视频中的人物转身看向镜头",
    "metadata": {
        "content": [
            {
                "type": "video_url",
                "video_url": {
                    "url": "/api/asset/file/video/uuid.mp4"
                }
            },
            {
                "type": "audio_url",
                "audio_url": {
                    "url": "/api/asset/file/audio/music.mp3"
                }
            }
        ]
    }
}
\`\`\`

> **提示**：\`metadata.content\` 支援 \`text\` / \`image_url\` / \`video_url\` / \`audio_url\` 四種類型，\`image_url\` 可透過 \`role\` 指定 \`first_frame\` / \`last_frame\` / \`reference_image\`。`,
  },
  {
    id: 'moderation',
    title: '內容審核',
    category: 'API 介面',
    content: `# 內容審核

> **POST** \`/v1/moderations\`

偵測文字或圖文內容是否違反安全策略

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 否 | 審核模型，如 \`content-moderation-latest\` |
| \`input\` | string/array | 是 | 待審核內容（文字或文字+圖片陣列） |

### 請求範例

\`\`\`json
{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/moderations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "id": "modr-abc123",
    "model": "content-moderation-latest",
    "results": [
        {
            "flagged": false,
            "categories": {
                "violence": false,
                "hate": false,
                "sexual": false
            },
            "category_scores": {
                "violence": 0.001,
                "hate": 0.0001,
                "sexual": 0.0002
            }
        }
    ]
}
\`\`\``,
  },
  {
    id: 'rerank',
    title: '重新排序',
    category: 'API 介面',
    content: `# 重新排序

> **POST** \`/v1/rerank\`

根據查詢文字對文件列表進行相關性重新排序

## 請求參數

### Body 參數

| 參數 | 類型 | 必填 | 說明 |
|---|---|---|---|
| \`model\` | string | 否 | 重新排序模型，如 \`bge-rerank-v3\` |
| \`query\` | string | 是 | 查詢文字 |
| \`documents\` | array | 是 | 待排序文件列表 |
| \`top_n\` | integer | 否 | 回傳前 N 個結果 |
| \`return_documents\` | boolean | 否 | 是否回傳文件原文，預設 true |

### 請求範例

\`\`\`json
{
    "model": "bge-rerank-v3",
    "query": "零一云是什么",
    "documents": [
        "零一云是一个企业级AI网关平台",
        "今天天气不错",
        "零一云支持多种AI模型的统一接入"
    ],
    "top_n": 3,
    "return_documents": true
}
\`\`\`

### cURL 範例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/rerank' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "bge-rerank-v3",
    "query": "零一云是什么",
    "documents": [
        "零一云是一个企业级AI网关平台",
        "今天天气不错",
        "零一云支持多种AI模型的统一接入"
    ],
    "top_n": 3,
    "return_documents": true
}'
\`\`\`

## 回傳回應

### 200 成功

\`\`\`json
{
    "id": "rerank-abc123",
    "model": "bge-rerank-v3",
    "results": [
        {
            "index": 0,
            "relevance_score": 0.95,
            "document": {
                "text": "零一云是一个企业级AI网关平台"
            }
        },
        {
            "index": 2,
            "relevance_score": 0.88,
            "document": {
                "text": "零一云支持多种AI模型的统一接入"
            }
        },
        {
            "index": 1,
            "relevance_score": 0.12,
            "document": {
                "text": "今天天气不错"
            }
        }
    ],
    "usage": {
        "prompt_tokens": 30,
        "total_tokens": 30
    }
}
\`\`\``,
  },
  {
    id: 'faq',
    title: '常見問題',
    category: '平台相關',
    content: `# 常見問題

### 一般問題

**Q：零一雲和 OpenAI 官方有什麼區別？**

A：零一雲是相容 OpenAI 格式的閘道，多了國產模型支援（DeepSeek/Qwen/GLM等），價格更靈活。介面格式完全相容，OpenAI SDK 直接用。

**Q：支援哪些程式語言？**

A：任何支援 HTTP 的語言都能呼叫。Python 和 Node.js 有官方 SDK 最方便，其他語言（Go/Java/PHP/Rust）用 HTTP 用戶端直接請求即可。

**Q：可以免費試用嗎？**

A：聯絡管理員取得測試 Key，一般會有初始額度。

### 呼叫問題

**Q：回傳 \`context_length_exceeded\` 怎麼辦？**

A：輸入太長了。精簡 messages 內容，或換上下文更長的模型（如 gpt-4.1 支援 1M）。

**Q：回傳 \`model_not_found\` 怎麼辦？**

A：model 參數寫錯了。呼叫 \`GET /v1/models\` 查看可用模型列表，注意大小寫。

**Q：串流輸出中斷了怎麼辦？**

A：網路問題導致 SSE 斷線，無法續傳，需要重新發起請求。建議用戶端做拼接邏輯，斷流後重新請求。

**Q：為什麼回覆內容被截斷？**

A：可能是 \`max_tokens\` 設太小，或模型輸出達到上限。檢查 \`finish_reason\`，如果是 \`length\` 表示被截斷了，加大 \`max_tokens\`。

**Q：中文回覆品質不好怎麼辦？**

A：試試在 system 訊息中明確要求「用中文回答」，或使用中文能力更強的模型（DeepSeek/Qwen/GLM）。

### 計費問題

**Q：一次請求消耗多少 Token？**

A：看回應中的 \`usage\` 欄位。輸入 + 輸出的 Token 總數就是消耗量。

**Q：串流請求怎麼統計 Token？**

A：設定 \`stream_options: {"include_usage": true}\`，最後一個 chunk 會包含 usage。非串流請求預設回傳 usage。

**Q：計費和 OpenAI 官方一樣嗎？**

A：計費邏輯相同（按 Token），但倍率不同，零一雲的國產模型更便宜。具體倍率見後台設定。

### 功能問題

**Q：支援 Function Calling 嗎？**

A：支援。DeepSeek / GPT / Claude 等模型都支援，用法和 OpenAI 完全一致。

**Q：支援圖片輸入（Vision）嗎？**

A：支援。用 gpt-4o / claude-sonnet-4 等多模態模型，在 content 中傳圖片 URL 或 Base64。

**Q：支援 JSON 輸出嗎？**

A：支援。設定 \`response_format: {"type": "json_object"}\`。

**Q：可以微調模型嗎？**

A：暫不支援。可以直接使用平台提供的預訓練模型，透過 prompt 工程和 few-shot 達到客製化效果。

**Q：影片生成要等多久？**

A：通常 30 秒到數分鐘，取決於模型和影片長度。

### 部署問題

**Q：跨網域（CORS）怎麼設定？**

A：如果前端直接呼叫 API 會遇到跨網域問題。建議走後端代理，或聯絡管理員設定 CORS 白名單。

**Q：內網能呼叫 API 嗎？**

A：零一雲部署在公網，內網需要能存取外網。如果完全隔離，需要私有化部署。

**Q：支援私有化部署嗎？**

A：聯絡商務，支援私有化部署到客戶機房。

**Q：怎麼查看 API 呼叫日誌？**

A：管理後台 → 日誌頁面，可按 Key / 模型 / 時間篩選。`,
  },
  {
    id: 'terms',
    title: '平台協議',
    category: '平台相關',
    content: `# 平台協議

這是您（"即在平台上註冊為使用者並使用我們服務的個人或組織，並承諾遵守我們的各項協議、隱私政策和其他服務條款"）與北京創世華彩科技有限公司及其關聯公司（"**華彩**"或"我們"）之間的協議（"協議"）。

您確認，在使用或購買我們零一雲產品或服務之前，您已完整閱讀、理解並接受本協議的所有條款。一旦您實際開始使用本平台上的服務或完成購買流程，即表示您已閱讀並同意遵守本協議。我們有權在必要時修改本協議的條款，您可以在此頁面查看協議的最新版本。本協議條款變更後，如果您繼續使用本平台上的服務，則視為您已接受變更後的協議。**有關本平台的資料和個人資訊收集及使用政策的詳細說明，請參閱隱私政策。**

您保證您具備法律規定的完全民事行為能力，是能夠獨立承擔民事責任的自然人，或是經法人授權代表其行事的完全民事行為能力人；如果您未滿十八歲，即使您已註冊，也無法完成實名認證或使用本平台的服務。您承諾並確認，本協議的內容不違反您所在國家或地區的法律。

## 1. 帳戶管理

### 1.1 帳戶和真實姓名認證

1.1.1. 您按照本平台要求填寫相關資訊，並確認同意遵守本協議及"隱私政策"的所有條款後，我們將為您建立帳戶。您知悉並同意，本平台的部分或全部功能需要您的帳戶進行實名認證後方可啟用，且我們有權根據自身判斷及業務發展變化，不時修改和維護本平台的服務和功能。

1.1.2. 如果您代表企業、法人、非法人組織或其他實體存取和使用本平台，則必須完成帳戶的企業認證。已認證的企業應對該帳戶及其關聯使用者的所有使用、儲值、資訊提供等行為負責，不得以帳戶借用、人員離職等為由拒絕承擔責任。

1.1.3. 如果您透過第三方連接或存取此服務，則表示您承認並允許該第三方服務使用或儲存您的使用者資訊、存取權杖、相關帳戶資訊和身分驗證憑證以及其他資料。

1.1.4. 您有責任保護您建立、加入或管理的帳戶以及您的使用者身分，不得向任何人透露您用於登入的任何登入憑證。如果帳戶因您主動洩露或您受到他人攻擊或詐欺而丟失，本平台概不負責。

1.1.5. 您設定的帳號名稱和使用者暱稱不得違反國家法律法規、公共秩序和善良風俗、社會道德，也不得造成您本人與本平台身分混淆。

1.1.6. 同一使用者僅可建立一個個人帳戶。您的個人帳戶僅供您本人使用。除非雙方另有約定，您不得以任何形式贈與、出借、出租、轉讓、出售或以其他方式允許任何第三方使用您的個人帳戶。

1.1.7. 同一使用者可以建立多個組織帳號。如果您允許其他使用者共同使用您的組織帳號，您將對相應使用者在該組織帳號下的所有行為的後果和責任承擔全部責任。

### 1.2 變更、暫停和終止

我們可能會更改、暫停或終止向您提供的服務，或對服務的使用設定限制，且無需承擔任何責任，前提是我們已盡最大努力透過簡訊、電子郵件或本平台公告等一種或多種方式提前通知您。我們可以隨時停用您的帳戶。即使您的帳戶因任何原因被終止，您仍受本協議約束。

## 2. 服務存取和服務限制

### 2.1 服務取得

在您遵守本協議的前提下，我們特此授予您非獨占且不可轉讓的權利，僅供您個人使用或用於您所代表的企業或其他實體的內部業務用途。

### 2.2 服務限制

您不得：
- 對服務的任何部分進行反組譯、逆向工程、解碼或反編譯
- 未經我們事先書面同意，不得購買、出售或轉讓 API 金鑰
- 複製、出租、出售、出借、轉讓、授權或試圖再授權、轉售、散布或修改本服務的任何部分
- 採取任何可能對我們的伺服器、基礎設施等造成過重負擔的行動
- 將服務用於違法、侵權、詐欺等用途
- 規避我們可能採取的阻止或限制存取服務的措施
- 試圖干擾或破壞執行該服務的伺服器的系統完整性或安全性
- 使用此服務發送垃圾郵件、連鎖信或其他未經請求的電子郵件
- 透過本服務傳輸非法資料、病毒或其他惡意軟體
- 冒充他人或實體，虛偽陳述您與他人或實體的關係
- 從本服務收集或取得任何個人資訊

## 3. 互動資料

3.1 本服務可能允許使用者在使用平台服務期間，透過與大型模型、第三方網站、軟體、應用程式或服務進行相關資料的輸入、回饋、修改、處理、儲存、上傳、下載和散布等操作。

3.2 如果發現互動資料違反任何法律、法規或本協議的規定，我們有權刪除該互動資料或停止提供技術服務。

3.3 作為獨立的技術支援方，本平台對您使用本平台服務所產生的任何互動資料均不享有任何智慧財產權。您使用本平台服務所產生的所有互動資料、義務和責任均由您自行承擔。

3.4 免責聲明：我們不對任何互動資料負責。您應全權負責您在本平台服務中輸入、提供回饋、更正、處理、儲存、上傳、下載和散布的互動資料。

3.5 我們將根據相關法律法規為人工智慧生成的合成內容新增相應的標識。您不得惡意刪除、竄改、偽造或隱瞞上述標識。

## 4. 智慧財產權

### 4.1 零一雲的智慧財產權

本平台服務中我們提供的所有內容的智慧財產權自始歸我方所有。您不得存取、出售、授權、出租、修改、散布、複製、傳輸、展示、發布、改編或創作任何此類智慧財產權的衍生作品。

### 4.2 輸出

在您遵守相關規定並符合相關法律法規的前提下，您可以按照法律要求的方式使用本平台服務生成的結果。

### 4.3 使用者使用資料

我們可能會收集與診斷、技術和使用情況相關的資訊，用於改進我們的產品和服務。

### 4.4 回饋

如果您就本服務向我們提供任何建議或回饋，則您在此將回饋中的所有權利和權益轉讓給我們。

## 5. 機密資訊

本服務可能包含零一雲及其他使用者的非公開、專有或機密資訊。您將保護所有機密資訊的隱私，不得將其用於除行使本協議項下權利之外的任何其他目的，也不得向任何個人或實體揭露。

## 6. 計費政策和稅費

6.1 本平台提供的某些服務可能需要支付使用費。選擇使用本服務即表示您同意本平台上所述的適用於您的定價和付款條款。

6.2 由於"先服務後計費"的特殊性，我們的產品和服務通常採用"使用後付費"模式。請確保您的帳戶中有足夠的餘額，否則可能會產生欠款。

6.3 本平台所有產品和服務的定價、計費、付款條款均透過引用併入本協議。

6.4 如有任何政府規定的稅費，您應負責支付與您使用/啟用服務相關的所有稅費。

## 7. 出口管制和制裁

您承諾遵守中華人民共和國的出口管制和制裁法律法規。您承諾不將本平台提供的產品或服務用於軍事、大規模毀滅性武器相關用途。

## 8. 隱私和資料安全

### 8.1 隱私

我們將始終遵守《中華人民共和國個人資訊保護法》及其他相關適用法律。

### 8.2 資料安全

我們非常重視您個人資訊的完整性和安全性。但是，我們無法保證未經授權的第三方永遠無法突破我們的安全保護措施。

## 9. 第三方服務的使用

本服務可能包含指向第三方網站、資料和服務的連結，這些第三方服務並非由我們所有或控制。我們不對任何第三方服務進行認可，也不承擔任何責任。

## 10. 賠償

您應為我們及我們的關聯公司及其各自的代理人、供應商、授權人、員工、承包商、高級職員和董事進行辯護、賠償並使其免受損害，使其免於承擔因您對本服務的存取和使用、您違反本協議、或您侵犯任何第三方權利而引起的任何索賠、損害、義務、損失、負債、成本和費用。`,
  },
  {
    id: 'privacy',
    title: '隱私政策',
    category: '平台相關',
    content: `# 隱私政策

歡迎使用北京創世華彩科技有限公司及其關聯方（以下簡稱"華彩"或"我們"）的高價值 GenAI 開放平台。我們高度重視使用者（以下簡稱"您"）的資訊保護。當您註冊、登入並使用本平台時，我們會收集並儲存您註冊及正常使用本平台功能所需的必要使用者資訊。我們不會收集或儲存您在使用本平台期間與開源模型、第三方網站、軟體、應用程式或服務之間的互動資料。

## 概述

本隱私政策將幫助您了解：

1. 我們如何收集和使用您的使用者資訊
2. 我們使用 Cookie 和類似技術
3. 我們如何儲存您的使用者資訊
4. 我們如何共享、傳輸和公開揭露您的資訊
5. 我們如何保護您的資訊安全
6. 我們如何管理您的使用者資訊
7. 未成年人使用條款
8. 隱私政策的修訂和通知
9. 適用範圍

## 1. 我們如何收集和使用您的使用者資訊

### 1.1 我們會主動收集您的使用者資訊

為確保您正常使用我們的平台，我們將收集您在使用我們服務時主動提供的使用者資訊，包括但不限於：

**1.1.1** 當您註冊、驗證和登入平台帳號時，您可以使用手機號碼建立帳號。我們將透過發送簡訊驗證碼來驗證您的身分。

**1.1.2** 當您訂閱或啟用服務時，根據法律法規，我們需要對您進行實名認證。

- 對於個人使用者：您可能需要提供您的真實身分資訊，包括您的全名、身分證號碼等。
- 對於企業使用者：您可能需要提供貴單位的相關資訊，包括單位名稱、統一社會信用代碼等。

**1.1.3** 當您使用本服務時，我們會收集必要的資訊以維護產品和服務的安全穩定執行，包括裝置資訊、網路日誌資訊等。

### 1.2 我們可能會從第三方取得使用者資訊

為了向您提供更優質、更高效、更個人化的服務，我們的關聯公司和合作夥伴可能會根據法律法規與您簽訂的協議或您的同意，與我們共享您的資訊。

### 1.3 業務和客戶資料

透過本平台提供的服務生成或處理的資料屬於您的業務和客戶資料（"互動資料"）。您擁有互動資料的完全所有權。作為中立的技術服務提供者，本平台不會存取、使用或揭露您的互動資料，除非法律法規另有規定。

## 2. Cookie 和類似技術的使用

Cookie 和類似技術是網際網路上常用的技術。當您使用本平台時，我們可能會使用相關技術向您的裝置傳送 Cookie，以收集和儲存您的帳戶資訊、搜尋歷史記錄和登入狀態資訊。您可以透過瀏覽器設定拒絕或管理 Cookie。

## 3. 我們如何儲存您的使用者資訊

### 3.1 資訊儲存位置

我們將把在營運本網站及相關服務過程中收集和生成的使用者資訊儲存在中華人民共和國境內。

### 3.2 資訊儲存期限

我們僅在提供本平台及相關服務所必需的期限內保留您的使用者資訊。必要期限屆滿後，我們將刪除或匿名化您的資訊。

## 4. 我們如何共享、傳輸和揭露您的資訊

### 4.1 參與資料使用的合作夥伴

涉及合作夥伴的資料使用活動必須具有合法目的，且應限於實現該目的所必需的範圍。我們將對合作夥伴的安全能力進行全面評估，並要求其遵守合作法律協議。

### 4.2 使用者資訊的聯合處理或委託處理

本平台及相關服務中的某些特定模組或功能由合作夥伴提供。我們僅根據合法、公正、必要和安全原則，在提供服務所需的最小範圍內向其提供您的使用者資訊。

### 4.3 使用者資訊轉移

除經您明確同意、根據法律法規要求、或平台營運發生變更/合併/收購/破產清算外，我們不會將您的使用者資訊轉移給任何其他第三方。

### 4.4 使用者資訊的揭露

原則上，除非獲得您的明確同意或國家法律法規要求，否則我們不會公開揭露您的使用者資訊。

## 5. 我們如何保護您的資訊安全

我們高度重視使用者資訊安全，採取合理的安全措施來保護您的資訊不被未經授權的存取、使用或揭露。

## 6. 我們如何管理您的使用者資訊

您有權存取、更正和刪除您的使用者資訊。您可以透過本平台的設定頁面管理您的個人資訊，或聯絡我們協助處理。

## 7. 未成年人使用條款

我們不允許未成年人（未滿 18 歲）使用本平台服務。如果您是未成年人，請立即停止使用我們的服務。

## 8. 隱私政策的修訂和通知

我們可能會不時修訂本隱私政策。修訂後的隱私政策將在本頁面發布，並自發布之日起生效。

## 9. 適用範圍

本隱私政策適用於您使用本平台服務的全部情境。如果您透過第三方服務使用本平台，還需遵守第三方的隱私政策。`,
  },
]
