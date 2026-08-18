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
export interface DocPage {
  id: string
  title: string
  category: string
  content: string
}

export const docCategories = [
  '开始使用',
  '接口调用说明',
  'API 接口',
  '平台相关',
] as const

export const docPages: DocPage[] = [
  {
    id: 'introduction',
    title: '产品简介',
    category: '开始使用',
    content: `# 产品简介

零一云是一个兼容主流 AI 接口标准的国产模型网关平台。

**它解决什么问题？**

| 痛点 | 零一云的解法 |
|---|---|
| 国外 AI 服务国内访问不稳定 | 国内节点直接访问，稳定可靠 |
| 不同模型要对接不同 API | 统一一个地址，标准接口格式，不用改代码 |
| 国外模型价格贵 | 接入 DeepSeek / Qwen 等国产模型，成本低数倍 |
| 多模型管理麻烦 | 一个 Key 调用所有模型，后台统一管理额度 |
| 数据出境合规风险 | 数据走国内通道，合规可控 |

**核心能力**

**标准接口兼容**：兼容主流 AI 接口格式，只需改 \`base_url\`，代码零改动

**全品类模型覆盖**：Chat / Embedding / 图像 / 语音 / 视频 / 审核 / Rerank，11 个接口

**国产模型优先**：DeepSeek、Qwen、GLM 等主流国产模型开箱即用，性价比高

**多 Key 管理**：后台创建多个令牌，分别控制额度、权限、模型访问范围

**按量计费**：Token 级别的精细计费，用多少扣多少，无最低消费

**一句话接入**

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)
\`\`\`

**支持的工具：** Cursor、Windsurf、Continue、JetBrains AI、VS Code Copilot、ChatBox、LobeChat、NextChat、Open WebUI 等所有支持标准 AI API 的工具。`,
  },
  {
    id: 'quick-start',
    title: '快速入门',
    category: '开始使用',
    content: `# 快速入门

本指南帮助你在 5 分钟内完成接入。

## 第一步：获取 API Key

所有接入方式都需要 API Key 进行认证。

1. 访问 / 登录 **零一云管理控制台**（/dashboard）
2. 在 **令牌管理**（或「API 密钥」）页面创建并复制你的 API Key
3. 妥善保管，不要泄露给他人

API Key 是所有接入方式的必要凭证，后续配置中会多次用到。建议先获取 Key 再继续后续步骤。

## 第二步：选择接入方式

零一云支持多种客户端和工具的接入，根据你的使用习惯选择合适的方式：

| 接入方式 | 适用人群 | 难度 |
|---|---|---|
| **CC Switch**（推荐） | 需要管理多个 AI 工具（Claude Code / Codex / Claude Desktop 等），偏好图形界面一键切换 | 简单 |
| Claude Code 客户端 | 使用 Claude 桌面应用 / 终端版的用户 | 简单 |
| Codex 命令行 | 喜欢终端操作、使用 OpenAI Codex 的开发者 | 简单 |
| API 直接调用 | 自己写代码对接的开发者 | 中等 |
| AI 编程工具（Cursor / Windsurf 等） | 在 IDE 中使用 AI 辅助编程的用户 | 简单 |

---

## 方式一：CC Switch（推荐）

CC Switch 是一个开源的图形界面工具，可以统一管理 Claude Code、Claude Desktop、Codex 等多个 AI 工具的供应商配置，一键切换，最为方便。

### 安装 CC Switch（版本 v3.16.5 及以上）

**macOS 用户（推荐 Homebrew）：**

\`\`\`bash
brew install --cask cc-switch
\`\`\`

**其他系统：** 访问 [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) 下载对应平台安装包：

- macOS：\`.dmg\` / \`.zip\`
- Windows：\`.msi\` 安装版 / Portable \`.zip\` 绿色版
- Linux：\`.deb\` / \`.rpm\` / \`.AppImage\`

> 首次打开如被 macOS Gatekeeper 拦截，到「系统设置 → 隐私与安全性」点「仍要打开」。

### 配置零一云为供应商

#### 接入 Claude Desktop

1. 打开 CC Switch，主界面顶部切到 **Claude Desktop** tab。
2. 点击右上角「橙色加号」按钮，弹出「添加新供应商」对话框。
3. 在「预设供应商」中选择「自定义配置」。
4. 填写以下信息：
   - **供应商名称**：如 \`零一云\`
   - **API 请求地址**：\`{{BASE_URL}}\`
   - **API Key**：粘贴你在控制台获取的 Key
   - **选择模型**：如 \`deepseek-v3\` / \`qwen-max\` / \`glm-4\` 等
5. 点击「+ 添加」保存。
6. 在供应商卡片上点「启用」。
7. 完整重启 Claude Desktop 应用，即可使用。

#### 接入 Codex

1. 打开 CC Switch，主界面顶部切到 **Codex** tab。
2. 点击右上角「添加供应商」，选择「自定义配置」。
3. 填写：
   - **API 请求地址**：\`{{BASE_URL}}\`
   - **API Key**：控制台获取的 Key
   - **选择模型**：推荐 \`deepseek-r1\`、\`glm-4\`
4. 点「+ 添加」→ 启用该供应商。
5. 重启你正在运行的 Codex 终端进程生效（Codex 不支持热切换）。

---

## 方式二：Claude Code 客户端

Claude Code 是 Claude 官方的终端 AI 编程助手。推荐通过 CC Switch 管理（见方式一），也可手动接入。

### 安装 Claude Code 客户端

访问 [Claude 官网](https://claude.ai/code/family) 下载对应系统版本并安装。

### 使用 CC Switch 接入（推荐）

参考方式一「接入 Claude Desktop」步骤，选择 **Claude Code** 标签页操作即可。

> **Windows 用户注意：** 如遇 \`Virtual Machine Platform not available\` 报错，需启用「虚拟机平台」：
> 1. \`Win + R\` 输入 \`optionalfeatures\` 回车
> 2. 勾选「虚拟机平台（Virtual Machine Platform）」→ 确定
> 3. 重启电脑后再打开 Claude 客户端

---

## 方式三：Codex 命令行

Codex 是 OpenAI 官方推出的终端 AI 编程助手。

### 安装 Codex

- 推荐先安装 [Node.js](https://nodejs.org/zh-cn/download/) 22+
- macOS 用户也可直接：\`brew install codex\`
- 或使用 npm 安装：

\`\`\`bash
npm install -g @openai/codex
codex --version  # 显示版本号即安装成功
\`\`\`

### 配置 Provider（从零配置）

**macOS / Linux 用户：** 打开终端执行：

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

**Windows 用户（PowerShell）：**

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

### 设置 API Key 环境变量

把 \`<你的-API-key>\` 替换为控制台复制的 Key：

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
> 执行后关闭当前 PowerShell 重新打开生效。

完成后终端执行 \`codex\` 即会走零一云路由。

### 已安装 Codex，修改配置

配置文件和环境变量与「从零配置」相同，直接覆盖写入即可。

---

## 方式四：API 直接调用

如果你自己写代码对接，只需要改一行 \`base_url\`：

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

完整接口说明见后面「API 接口」章节。

---

## 方式五：AI 编程工具

Cursor、Windsurf、Continue、JetBrains AI 等工具的配置，参考下一章「在 AI 编程工具中使用」。

---

## 常见问题

| 问题 | 解决方案 |
|---|---|
| API Key 在哪里获取？ | 登录控制台 → 令牌管理 → 创建令牌 |
| 配置后不生效？ | 检查是否正确重启了客户端 / 重新打开终端 / 刷新页面 |
| 如何切换不同模型？ | 使用 CC Switch 一键切换；或修改配置文件 / 代码中 \`model\` 字段 |
| 提示额度不足（402）？ | 充值或更换有额度的 Key |
| 提示速率超限（429）？ | 稍后重试，或联系管理员提升额度 |

如需更多帮助，联系技术支持团队。

---

## 1. 模型列表与选择指南

### 查询可用模型

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`
返回结果中 \`data[].id\` 就是可用的 model 参数值。

### Chat 模型

| 模型 | 上下文 | 特点 | 适用场景 |
|---|---|---|---|
| \`deepseek-v3\` | 64K | 性价比高，中文能力强 | 日常对话、内容生成 |
| \`deepseek-r1\` | 64K | 推理链模型，思维过程可见 | 数学、逻辑推理、代码调试 |
| \`gpt-4o\` | 128K | 多模态，综合能力强 | 复杂任务、图文理解 |
| \`gpt-4o-mini\` | 128K | 速度快、成本低 | 高并发场景、简单对话 |
| \`gpt-4.1\` | 1M | 超长上下文 | 长文档处理、代码库分析 |
| \`gpt-4.1-mini\` | 1M | 长上下文 + 低成本 | 长文档摘要 |
| \`gpt-4.1-nano\` | 1M | 最快最便宜 | 分类、提取等轻量任务 |
| \`o3\` | 200K | 推理增强 | 复杂推理、科学问题 |
| \`o4-mini\` | 200K | 推理 + 低成本 | 日常推理任务 |
| \`claude-sonnet-4-20250514\` | 200K | 编程和推理强 | 代码生成、分析 |
| \`qwen-max\` | 32K | 中文优化 | 中文业务场景 |
| \`qwen-plus\` | 128K | 性价比高 | 通用中文任务 |
| \`glm-4\` | 128K | 中文理解好 | 中文对话、写作 |
| \`gemini-2.5-pro\` | 1M | 超长上下文 + 多模态 | 长文档、多模态分析 |

### Embedding 模型

| 模型 | 维度 | 说明 |
|---|---|---|
| \`text-embedding-3-large\` | 3072（可降维） | 高精度，推荐生产使用 |
| \`text-embedding-3-small\` | 1536（可降维） | 速度快，成本低 |
| \`text-embedding-ada-002\` | 1536 | 兼容旧版 |

### 图像模型

| 模型 | 最大尺寸 | 特色功能 |
|---|---|---|
| \`gpt-image-1\` | 1536x1024 | 背景透明、审核级别控制 |
| \`dall-e-3\` | 1792x1024 | 高分辨率、风格选择 |
| \`dall-e-2\` | 1024x1024 | 基础生成、多图输出 |

### 语音模型

| 模型 | 用途 | 说明 |
|---|---|---|
| \`tts-1\` | 文本转语音 | 标准质量 |
| \`tts-1-hd\` | 文本转语音 | 高清音质 |
| \`gpt-4o-mini-tts\` | 文本转语音 | 支持风格指令 |
| \`whisper-1\` | 语音转文本 / 翻译 | 多语言支持 |

### 视频模型

| 模型 | 说明 |
|---|---|
| \`kling-v2\` | 快手可灵，文生/图生视频 |
| \`veo-2\` | Google 视频生成 |
| \`cerve\` | 视频生成 |

### Rerank 模型

| 模型 | 说明 |
|---|---|
| \`cohere-rerank-v3\` | Cohere 重排序，RAG 场景推荐 |

### Moderation 模型

| 模型 | 说明 |
|---|---|
| \`omni-moderation-latest\` | 多模态审核，支持文本+图片 |

**提示**：实际可用模型以 \`GET /v1/models\` 返回为准，平台会持续新增模型。

## 2. 额度与计费说明

### 计费方式

零一云按 **Token 用量** 计费，不同模型价格不同。

**输入 Token**（prompt_tokens）：你发给模型的内容

**输出 Token**（completion_tokens）：模型生成的内容

一般情况下，输出 Token 单价高于输入 Token

### Token 是什么

Token 是模型处理文本的基本单位。粗略换算：

| 语言 | 1 Token ≈ |
|---|---|
| 英文 | 4 个字符 / 0.75 个单词 |
| 中文 | 1~2 个汉字 |

### 模型倍率

不同模型价格不同，通过倍率换算。以 GPT-4o-mini 为基准（倍率 1x）：

| 模型 | 输入倍率 | 输出倍率 | 说明 |
|---|---|---|---|
| gpt-4o-mini | 1x | 1x | 基准 |
| deepseek-v3 | 0.5x | 0.5x | 更便宜 |
| gpt-4o | 5x | 15x | 能力强，价格高 |
| gpt-4.1 | 10x | 30x | 长上下文 |
| claude-sonnet-4 | 6x | 30x | 编程强 |

倍率仅供参考，实际以后台配置为准。管理员可在 **运营设置 → 模型价格** 中调整。

### 额度查询

登录管理后台，在 **令牌管理** 中查看 Key 的已用额度和剩余额度

或通过接口响应中的 \`usage\` 字段实时获取本次消耗

### 额度耗尽

Key 额度用完后，请求会返回：

\`\`\`json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
\`\`\`
HTTP 状态码为 \`402\`。此时需要充值或更换有额度的 Key。

### 不同接口的计费

| 接口 | 计费依据 |
|---|---|
| Chat / Responses | 输入 + 输出 Token |
| Embeddings | 输入 Token |
| Images | 按张数和模型计费，非 Token 计费 |
| Audio TTS | 按输入字符数计费 |
| Audio STT / Translation | 按音频时长计费 |
| Video | 按次计费 |
| Moderation | 输入 Token（通常量很小） |
| Rerank | 输入 Token |

## 3. 速率限制说明

### 限制维度

| 维度 | 含义 |
|---|---|
| RPM | Requests Per Minute，每分钟请求数 |
| TPM | Tokens Per Minute，每分钟 Token 数 |

### 限制规则

限制基于 **API Key** 维度，不同 Key 独立计算

管理员可在后台为不同令牌组设置不同限额

默认限制因部署配置而异，具体数值联系管理员确认

### 超限响应

\`\`\`json
{
  "error": {
    "message": "Rate limit reached for default",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
\`\`\`
HTTP 状态码 \`429\`。

### 响应头

速率限制信息会通过 HTTP 响应头返回：

| Header | 含义 |
|---|---|
| \`X-RateLimit-Limit\` | 当前周期内的总限额 |
| \`X-RateLimit-Remaining\` | 当前周期内的剩余次数 |
| \`X-RateLimit-Reset\` | 限额重置时间（Unix 时间戳） |

### 应对策略

1. **读取响应头**：每次请求后检查 \`X-RateLimit-Remaining\`，提前预判
2. **请求前限流**：客户端做本地限流，不要等 429 才降速
3. **指数退避**：收到 429 后，等 1s → 2s → 4s → 8s 再重试
4. **多 Key 轮换**：配置多个 Key，轮流使用，提升总吞吐
5. **减少无效 Token**：精简 prompt，避免重复上下文

#### 批量调用

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["人工智能", "机器学习", "深度学习"]
)
for item in response.data:
    print(f"索引 {item.index}: {len(item.embedding)} 维")
\`\`\`

#### 降维

\`text-embedding-3\` 系列支持指定输出维度，降低存储成本：

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="人工智能改变世界",
    dimensions=512  # 默认3072维降到512维
)
\`\`\`
降维会损失精度，建议从高维开始，根据效果逐步降低。

| 参数 | 建议 |
|---|---|
| \`model\` | 默认 \`cohere-rerank-v3\`，目前最通用 |
| \`top_n\` | 通常设 3~5，不需要返回太多 |
| \`return_documents\` | 设 \`true\`，省得再按索引查原文 |`,
  },
  {
    id: 'ai-tools',
    title: '在 AI 编程工具中使用',
    category: '开始使用',
    content: `# 在 AI 编程工具中使用零一云

本文档介绍如何在 Cursor、Windsurf、Continue 等主流 AI 编程工具中接入零一云，让这些工具使用你自己的模型和额度。

## 1. 在 Cursor 中使用零一云

Cursor 是目前最流行的 AI 编程工具之一，支持自定义兼容 API。零一云完全兼容标准接口格式，配置后即可使用。

### 1.1 添加模型

1. 打开 Cursor，进入 **Settings → Models**
2. 在 **Models Names** 底部输入框填写你要用的模型名称，点击 \`Add model\`

推荐添加的模型：

| 用途 | 模型名 | 说明 |
|---|---|---|
| 日常编码 | \`deepseek-v3\` | 性价比最高，中文理解好，编码能力强 |
| 复杂推理 | \`deepseek-r1\` | 推理链模型，适合调试、数学、逻辑 |
| 通用对话 | \`qwen-max\` | 阿里通义，中文场景表现优秀 |
| 长文本 | \`qwen-plus\` | 128K 上下文，性价比高 |
| 中文写作 | \`glm-4\` | 智谱，中文理解和生成好 |

3. 添加后，在列表中**打开对应模型的开关**

### 1.2 配置 API Key 和 Base URL

在同一个 Settings → Models 页面中，找到 API Key 配置区域：

| 配置项 | 填写内容 |
|---|---|
| **API Key** | \`sk-your-key\`（你的零一云令牌） |
| **Base URL** | \`{{BASE_URL}}/v1\` |

填写完成后点击 \`Verify\`，显示成功即配置完成。

### 1.3 在 Cursor 中使用模型

配置完成后：

1. 打开 Cursor 的 Chat 面板（快捷键 \`Cmd+L\` / \`Ctrl+L\`）
2. 在模型选择下拉框中，选择你刚添加的模型
3. 正常对话即可，所有请求会走零一云

### 1.4 配置 @Docs 文档上下文

Cursor 的 \`@Docs\` 功能可以把外部文档作为上下文注入对话，让模型基于你的 API 文档回答问题。

配置步骤：

1. 打开 Cursor Settings → Features → Docs
2. 点击 \`Add new doc\`
3. 填写配置：

| 配置项 | 值 |
|---|---|
| **Name** | \`零一云 Docs\` |
| **URL** | 你的文档站点地址 |
| **Start URL** （可选） | 文档首页地址 |

4. 点击 \`Save\` 保存

### 1.5 使用 @Docs 引用文档

在 Cursor Chat 中：

1. 输入 \`@Docs\`，选择 \`零一云 Docs\`
2. 然后输入你的问题，例如：

\`\`\`
@零一云 Docs 如何使用 Function Calling？
\`\`\`

Cursor 会自动拉取文档内容作为上下文，模型基于文档给出准确回答。

## 2. 在 Windsurf 中使用零一云

Windsurf（原 Codeium）同样支持标准兼容 API。

### 配置步骤

1. 打开 Windsurf Settings → AI Provider
2. 选择 **OpenAI Compatible** 或 **Custom Provider**
3. 填写配置：

| 配置项 | 值 |
|---|---|
| **API Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` 或其他可用模型 |

4. 保存后即可在 Cascade 和 Chat 中使用

### Windsurf 配置文件方式

也可以直接编辑配置文件 \`~/.windsurf/settings.json\`：

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

## 3. 在 Continue 中使用零一云

Continue 是开源的 AI 编程助手，支持 VS Code 和 JetBrains。

### 配置步骤

编辑 Continue 配置文件 \`~/.continue/config.json\`：

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

### 配置说明

| 字段 | 说明 |
|---|---|
| \`models\` | 对话模型列表，会出现在 Continue 的模型选择下拉框中 |
| \`tabAutocompleteModel\` | 代码补全模型，建议用快模型（deepseek-v3） |
| \`embeddingsProvider\` | 代码库索引的 Embedding 模型 |

配置完成后重启 VS Code / JetBrains，在 Continue 面板中即可选择零一云模型。

## 4. 在 VS Code Copilot 中使用零一云

GitHub Copilot 支持通过 Copilot Chat 的自定义模型功能接入第三方 API。

### 配置步骤

1. 安装 **GitHub Copilot** 和 **GitHub Copilot Chat** 扩展
2. 打开 VS Code Settings → 搜索 \`github.copilot.chat\`
3. 配置自定义端点（需要 VS Code 1.90+ 和 Copilot 自定义模型支持）

### 通过环境变量配置

在终端中设置环境变量后启动 VS Code：

\`\`\`bash
export OPENAI_API_KEY=sk-your-key
export OPENAI_BASE_URL={{BASE_URL}}/v1
code .
\`\`\`

**注意**：Copilot 对自定义模型的支持在持续迭代，具体配置方式可能随版本变化。如不支持自定义模型，建议使用 Cursor 或 Continue 作为替代。

## 5. 在 JetBrains AI 中使用零一云

JetBrains IDE（IntelliJ IDEA / PyCharm / WebStorm 等）的 AI Assistant 支持自定义端点。

### 配置步骤

1. 打开 **Settings → Tools → AI Assistant → Providers**
2. 选择 **OpenAI Compatible** 或 **Custom Provider**
3. 填写：

| 配置项 | 值 |
|---|---|
| **Server URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` 或其他 |

4. 点击 \`Test Connection\` 验证
5. 保存后即可在 AI Assistant 中使用

## 6. 在对话工具中使用

如果你只想在对话界面中使用零一云的模型（而非编程工具），可以通过以下方式：

### 使用第三方客户端

支持自定义 API 的客户端都可以用：

| 客户端 | 平台 | 配置方式 |
|---|---|---|
| ChatBox | 桌面端 | 设置 → API Base URL + Key |
| NextChat | Web | 设置 → 接口地址 + Key |
| LobeChat | Web/桌面 | 设置 → 模型服务 → 代理地址 + Key |
| Open WebUI | Web | 设置 → API URL + Key |
| Cherry Studio | 桌面端 | 设置 → API 地址 + Key |

通用配置：

| 配置项 | 值 |
|---|---|
| API Base URL | \`{{BASE_URL}}/v1\` |
| API Key | \`sk-your-key\` |

## 7. 常见问题

### Q：Cursor 中 Verify 失败怎么办？

检查以下几点：

| 检查项 | 正确值 |
|---|---|
| Base URL | \`{{BASE_URL}}/v1\`（末尾带 \`/v1\`） |
| API Key | \`sk-\` 开头，无多余空格 |
| 模型名 | 必须是 \`GET /v1/models\` 返回的 id，注意大小写 |
| 网络连通 | 能 \`curl {{BASE_URL}}/v1/models\` 正常返回 |

### Q：Cursor 中模型没有出现？

- 确认模型开关已打开
- 退出 Cursor 重新打开
- 检查模型名是否拼写正确（全小写，如 \`deepseek-v3\` 不是 \`DeepSeek-V3\`）

### Q：代码补全很慢？

代码补全对延迟敏感，建议：

- 用快速模型：\`deepseek-v3\`
- 避免用推理模型（\`deepseek-r1\`）做补全
- Continue 用户可在 \`tabAutocompleteModel\` 中单独配置快速模型

### Q：对话中模型报错 \`model_not_found\`？

该模型在你的零一云账户下未启用。联系管理员开通，或换一个可用模型。

### Q：多工具能否共用同一个 Key？

可以，但要注意：

- 所有工具共享 Key 的额度，注意用量
- 并发请求共享 Key 的速率限制
- 建议不同工具用不同 Key，方便管理和监控

### Q：能否同时配置其他服务和零一云？

**Cursor**：不支持同时配置两个端点，后配置的会覆盖。如需同时使用，建议通过 Continue 或其他工具分管。

**Continue**：支持，在 \`models\` 数组中添加不同 \`apiBase\` 的配置即可。

### Q：@Docs 配置后引用不到内容？

- 确认文档 URL 可公网访问
- 尝试在浏览器打开配置的 URL 确认页面正常
- 如果是内部文档站点，Cursor 可能无法爬取

### Q：Continue 的 Embedding 索引报错？

确认 \`embeddingsProvider\` 配置正确：

\`\`\`json
{
  "provider": "openai",
  "model": "text-embedding-3-large",
  "apiBase": "{{BASE_URL}}/v1",
  "apiKey": "sk-your-key"
}
\`\`\`
如果仍然报错，检查 Key 是否有 Embedding 接口权限。

## 配置速查表

所有工具的核心配置只有两个：

| 配置项 | 值 |
|---|---|
| **Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |

各工具的配置入口：

| 工具 | 配置入口 | 说明 |
|---|---|---|
| Cursor | Settings → Models → API Key | 填 Base URL + Key |
| Windsurf | Settings → AI Provider | 选 Compatible |
| Continue | \`~/.continue/config.json\` | 编辑配置文件 |
| JetBrains | Settings → Tools → AI Assistant | 选 Custom Provider |
| ChatBox | 设置 → API | 填地址 + Key |
| LobeChat | 设置 → 模型服务 | 填代理地址 + Key |
| NextChat | 设置 → 接口 | 填地址 + Key |
| Open WebUI | 设置 → API | 填 API URL + Key |`,
  },
  {
    id: 'api-quick-start',
    title: '快速开始',
    category: '接口调用说明',
    content: `# 快速开始

最简调用（cURL）：

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}]
  }'
\`\`\`

**核心点**：只需改 \`base_url\` 和 \`api_key\`，其余代码和 OpenAI 官方完全一致。

### 支持的接口一览

| 接口 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 模型列表 | GET | \`/v1/models\` | 查看可用模型 |
| 对话补全 | POST | \`/v1/chat/completions\` | Chat 接口，支持流式 |
| Responses | POST | \`/v1/responses\` | OpenAI Responses API，支持流式 |
| 文本向量化 | POST | \`/v1/embeddings\` | Embedding 接口 |
| 图像生成 | POST | \`/v1/images/generations\` | 文生图 |
| 文本转语音 | POST | \`/v1/audio/speech\` | TTS，返回音频流 |
| 语音转文本 | POST | \`/v1/audio/transcriptions\` | STT，上传音频文件 |
| 语音翻译 | POST | \`/v1/audio/translations\` | 音频翻译为英文 |
| 视频生成 | POST | \`/v1/video/generations\` | 文生视频 / 图生视频 |
| 内容审核 | POST | \`/v1/moderations\` | 文本/图文安全审核 |
| 重排序 | POST | \`/v1/rerank\` | 文档相关性排序 |`,
  },
  {
    id: 'get-api-key',
    title: '获取 API Key',
    category: '接口调用说明',
    content: `# 获取 API Key

1. 登录零一云管理后台
2. 进入 API 密钥页面
3. 点击【新建 API 密钥】填写名称和额度
4. 创建成功后复制 \`sk-\` 开头的密钥

**注意**：Key 只在创建时显示一次，请立即保存。如果遗忘，需要删除后重新创建。

### Key 的格式

\`\`\`
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`
以 \`sk-\` 开头，后面是一串随机字符。调用时放在 HTTP Header 的 \`Authorization\` 字段中。`,
  },
  {
    id: 'auth',
    title: '鉴权方式',
    category: '接口调用说明',
    content: `# 鉴权方式

零一云使用 **Bearer Token** 鉴权，所有接口均需携带。

### Header 格式

\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

### cURL 示例

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### SDK 中配置

\`\`\`python
# Python
client = OpenAI(api_key="sk-your-api-key", base_url="{{BASE_URL}}/v1")
\`\`\`

\`\`\`javascript
// Node.js
const client = new OpenAI({ apiKey: "sk-your-api-key", baseURL: "{{BASE_URL}}/v1" });
\`\`\`

### 鉴权失败的表现

返回 HTTP 状态码 \`401\`

响应体：

\`\`\`json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

常见原因：

- Key 写错或漏了 \`sk-\` 前缀
- Key 已被删除或禁用
- Header 格式不对（\`Bearer\` 和 \`sk-\` 之间只有一个空格）`,
  },
  {
    id: 'request-url',
    title: '请求地址',
    category: '接口调用说明',
    content: `# 请求地址

### Base URL

\`\`\`
{{BASE_URL}}
\`\`\`

### 完整地址规则

\`\`\`
{Base URL}{接口路径}
\`\`\`

示例：

| 接口 | 完整地址 |
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

### SDK 中设置 Base URL

只需设置 \`base_url\` 为 \`{{BASE_URL}}/v1\`（注意末尾带 \`/v1\`），SDK 会自动拼接后续路径。`,
  },
  {
    id: 'error-codes',
    title: '错误码说明',
    category: '接口调用说明',
    content: `# 错误码说明

### HTTP 状态码

| 状态码 | 含义 | 处理建议 |
|---|---|---|
| 200 | 成功 | 正常处理响应 |
| 400 | 请求参数错误 | 检查请求体格式和必填参数 |
| 401 | 鉴权失败 | 检查 API Key 是否正确 |
| 402 | 额度不足 | 充值或更换有额度的 Key |
| 403 | 无权限 | 该 Key 无权访问此模型或接口 |
| 404 | 接口不存在 | 检查请求路径是否正确 |
| 429 | 请求频率超限 | 降低请求频率，或联系管理员提额 |
| 500 | 服务端内部错误 | 稍后重试；持续出现则联系运维 |
| 502 | 网关错误 | 上游服务异常，稍后重试 |
| 503 | 服务不可用 | 服务暂时过载，稍后重试 |

### 错误响应格式

所有错误都遵循统一格式：

\`\`\`json
{
  "error": {
    "message": "具体错误描述",
    "type": "错误类型",
    "code": "错误码"
  }
}
\`\`\`

### 常见错误码

| code | 含义 | 触发场景 |
|---|---|---|
| \`invalid_api_key\` | API Key 无效 | Key 写错、已删除、已禁用 |
| \`insufficient_quota\` | 额度不足 | Key 余额用完 |
| \`model_not_found\` | 模型不存在 | 传了不存在的 model 参数 |
| \`context_length_exceeded\` | 输入超长 | messages 总长度超过模型上下文窗口 |
| \`rate_limit_exceeded\` | 频率超限 | 短时间请求过多 |
| \`invalid_request_error\` | 请求格式错误 | 缺少必填参数、类型不对等 |
| \`server_error\` | 服务端错误 | 内部异常，一般重试可恢复 |

### 重试建议

**429 / 500 / 502 / 503**：可重试，建议指数退避（1s → 2s → 4s → 8s）

**400 / 401 / 402 / 403 / 404**：不要重试，先修正请求

同一请求最多重试 3 次`,
  },
  {
    id: 'streaming',
    title: '流式输出说明',
    category: '接口调用说明',
    content: `# 流式输出说明

流式输出用于 Chat 和 Responses 接口，逐块返回内容，用户体验更好（不用等全部生成完才显示）。

### 开启方式

请求体中设置 \`stream: true\`：

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "写一首诗"}],
  "stream": true
}
\`\`\`

### 响应格式（SSE）

流式响应使用 **Server-Sent Events (SSE)** 协议，Content-Type 为 \`text/event-stream\`。

每个数据块格式：

\`\`\`
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

**关键点：**

- 每条数据以 \`data: \` 开头，后面是 JSON
- 最后一条是 \`data: [DONE]\`，表示流结束
- 每个 chunk 的 \`delta.content\` 是本次新增的文本片段，拼起来就是完整回复
- \`finish_reason\` 为 \`stop\` 表示正常结束

### cURL 流式调用

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

### Python SDK 流式调用

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

### Node.js SDK 流式调用

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

### 流式输出中的 Usage 信息

默认流式响应**不包含** usage（Token 用量）。如果需要，设置 \`stream_options\`：

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true,
  "stream_options": {"include_usage": true}
}
\`\`\`

设置后，最后一个 chunk 会包含完整的 usage 字段：

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
\`\`\`

### Responses 接口的流式输出

Responses API 同样支持 \`stream: true\`，格式与 Chat 类似，也是 SSE 协议，最后以 \`data: [DONE]\` 结束。

### 自行解析 SSE 的注意事项

如果你不用 SDK，自己解析 SSE 流，注意以下几点：

1. **按行读取**：每条数据占一行，以 \`data: \` 开头
2. **跳过空行**：SSE 协议中空行是事件分隔符，不影响数据
3. **检测结束**：遇到 \`data: [DONE]\` 就停止读取
4. **处理断连**：网络中断时可以重试，但无法从断点续传，需要重新发起请求
5. **超时设置**：建议 HTTP 客户端超时设为 60 秒以上，长文本生成可能耗时较久

### 流式 vs 非流式对比

| 维度 | 非流式 (\`stream: false\`) | 流式 (\`stream: true\`) |
|---|---|---|
| 响应方式 | 一次性返回完整结果 | 逐块返回文本片段 |
| 用户感知 | 等待时间较长 | 逐字出现，体感更快 |
| 响应格式 | \`chat.completion\` | \`chat.completion.chunk\` |
| Usage | 默认包含 | 需设置 \`stream_options\` |
| 适用场景 | 后端批处理、API 串联 | 前端对话、实时交互 |
| 解析难度 | 简单，直接读 JSON | 需要 SSE 解析 |`,
  },
  {
    id: 'chat-completions',
    title: '对话补全',
    category: 'API 接口',
    content: `# 对话补全

> **POST** \`/v1/chat/completions\`

创建对话补全。支持流式（SSE）和非流式两种模式。

- 非流式：设置 \`stream: false\`（默认），返回完整响应
- 流式：设置 \`stream: true\`，以 SSE 逐块返回 ChatCompletionChunk

## 请求参数

### Header 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`Authorization\` | string | 是 | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | 否 | 请求唯一标识，用于链路追踪 |
| \`X-Tenant-Id\` | string | 否 | 租户标识，多租户场景下用于隔离 |
| \`X-Channel\` | enum | 否 | 调用渠道标识（web/app/api/miniapp），默认 api |

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 是 | 模型 ID，如 \`deepseek-v3\` |
| \`messages\` | array | 是 | 对话消息列表 |
| \`temperature\` | number | 否 | 采样温度，0~2，默认 0.7 |
| \`top_p\` | number | 否 | 核采样概率，0~1，默认 1 |
| \`max_tokens\` | integer | 否 | 最大生成 Token 数 |
| \`stream\` | boolean | 否 | 是否流式输出，默认 false |
| \`stream_options\` | object | 否 | 流式选项，如 \`{"include_usage": true}\` |
| \`tools\` | array | 否 | 可调用的工具列表 |
| \`tool_choice\` | string/object | 否 | 工具选择策略（none/auto/required） |
| \`response_format\` | object | 否 | 响应格式，如 \`{"type": "json_object"}\` |
| \`stop\` | string/array | 否 | 停止序列 |
| \`presence_penalty\` | number | 否 | 存在惩罚，默认 0 |
| \`frequency_penalty\` | number | 否 | 频率惩罚，默认 0 |
| \`n\` | integer | 否 | 生成候选数，默认 1 |
| \`user\` | string | 否 | 用户标识 |

### 请求示例

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

### cURL 示例

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

## 返回响应

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

### 401 鉴权失败`,
  },
  {
    id: 'models',
    title: '列出可用模型',
    category: 'API 接口',
    content: `# 列出可用模型

> **GET** \`/v1/models\`

返回当前可用的模型列表

## 请求参数

### Header 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`Authorization\` | string | 是 | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | 否 | 请求唯一标识 |
| \`X-Tenant-Id\` | string | 否 | 租户标识 |
| \`X-Channel\` | enum | 否 | 调用渠道标识，默认 api |

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/models' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 返回响应

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
    category: 'API 接口',
    content: `# Responses API

> **POST** \`/v1/responses\`

OpenAI Responses API。支持文本输入和消息数组，返回结构化 Response 对象，包含 output 消息和 usage。

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 是 | 模型 ID，如 \`qwen-plus\` |
| \`input\` | string/array | 是 | 输入内容，支持字符串或消息数组 |
| \`instructions\` | string | 否 | 系统指令 |
| \`temperature\` | number | 否 | 采样温度 |
| \`max_output_tokens\` | integer | 否 | 最大输出 Token 数 |
| \`stream\` | boolean | 否 | 是否流式输出，默认 false |
| \`tools\` | array | 否 | 可调用的工具列表 |
| \`user\` | string | 否 | 用户标识 |

### 请求示例

\`\`\`json
{
    "model": "qwen-plus",
    "input": "介绍北京"
}
\`\`\`

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/responses' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "qwen-plus",
    "input": "介绍北京"
}'
\`\`\`

## 返回响应

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
    title: '文本向量化',
    category: 'API 接口',
    content: `# 文本向量化

> **POST** \`/v1/embeddings\`

将文本转换为向量表示，支持批量输入

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 是 | 模型 ID，如 \`text-embedding-3-large\` |
| \`input\` | string/array | 是 | 输入文本，支持单条或数组 |
| \`encoding_format\` | enum | 否 | 编码格式（float/base64），默认 float |
| \`dimensions\` | integer | 否 | 向量维度（仅 text-embedding-3 系列支持） |

### 请求示例

\`\`\`json
{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}
\`\`\`

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/embeddings' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}'
\`\`\`

## 返回响应

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
    title: '生成图像',
    category: 'API 接口',
    content: `# 生成图像

> **POST** \`/v1/images/generations\`

根据文本提示生成图像。

**尺寸对照：**

| 模型 | 支持尺寸 |
|---|---|
| wanx-v2 | 1024x1024 / 720x1280 / 1280x720 / auto |
| cogview-4 | 1024x1024 / 768x1344 / 1344x768 |
| cogview-3-plus | 1024x1024 / 768x1344 / 1344x768 |

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 是 | 图像生成模型（wanx-v2 / cogview-4 / cogview-3-plus） |
| \`prompt\` | string | 是 | 图像描述文本 |
| \`n\` | integer | 否 | 生成数量（1~10，cogview-3-plus 仅支持 1） |
| \`size\` | string | 否 | 图像尺寸 |
| \`quality\` | enum | 否 | 图像质量（low/medium/high/auto） |
| \`background\` | enum | 否 | 背景透明度（transparent/opaque/auto），仅 wanx-v2 |
| \`moderation\` | enum | 否 | 内容审核级别（low/auto），仅 wanx-v2 |
| \`response_format\` | enum | 否 | 返回格式（url/b64_json），默认 url |
| \`style\` | enum | 否 | 图像风格（vivid/natural），仅 cogview-3-plus |
| \`user\` | string | 否 | 用户标识 |

### 请求示例

\`\`\`json
{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}
\`\`\`

### cURL 示例

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

## 返回响应

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
    title: '文本转语音（TTS）',
    category: 'API 接口',
    content: `# 文本转语音（TTS）

> **POST** \`/v1/audio/speech\`

将文本合成为语音，返回音频流

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 是 | TTS 模型 ID，如 \`cosyvoice-v2\` |
| \`voice\` | enum | 是 | 语音音色 |
| \`input\` | string | 是 | 待合成文本 |
| \`response_format\` | enum | 否 | 输出音频格式（mp3/opus/aac/flac/wav/pcm），默认 mp3 |
| \`speed\` | number | 否 | 语速（0.25~4），默认 1 |
| \`instructions\` | string | 否 | 语音风格指令（仅 cosyvoice-v2） |

### 请求示例

\`\`\`json
{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}
\`\`\`

### cURL 示例

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

## 返回响应

### 200 成功

返回音频流（binary），Content-Type: audio/mpeg`,
  },
  {
    id: 'stt',
    title: '语音转文本（STT）',
    category: 'API 接口',
    content: `# 语音转文本（STT）

> **POST** \`/v1/audio/transcriptions\`

将音频文件转录为文本

## 请求参数

### Body 参数（multipart/form-data）

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`file\` | file | 是 | 音频文件 |
| \`model\` | string | 是 | 语音识别模型，如 \`sensevoice-v1\` |
| \`language\` | string | 否 | 音频语言（ISO 639-1，如 zh、en） |
| \`response_format\` | enum | 否 | 输出格式（json/text/srt/verbose_json/vtt），默认 json |
| \`temperature\` | number | 否 | 采样温度 |

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/transcriptions' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'language="zh"' \\
--form 'response_format="json"'
\`\`\`

## 返回响应

### 200 成功

\`\`\`json
{
    "text": "你好，欢迎使用语音识别服务。"
}
\`\`\``,
  },
  {
    id: 'translation',
    title: '语音翻译',
    category: 'API 接口',
    content: `# 语音翻译

> **POST** \`/v1/audio/translations\`

将音频文件翻译为英文文本

## 请求参数

### Body 参数（multipart/form-data）

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`file\` | file | 是 | 音频文件 |
| \`model\` | string | 是 | 语音翻译模型，如 \`sensevoice-v1\` |
| \`response_format\` | enum | 否 | 输出格式（json/text/srt/verbose_json/vtt），默认 json |
| \`temperature\` | number | 否 | 采样温度 |

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/translations' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'response_format="json"'
\`\`\`

## 返回响应

### 200 成功

\`\`\`json
{
    "text": "Hello, welcome to the speech translation service."
}
\`\`\``,
  },
  {
    id: 'video',
    title: '生成视频',
    category: 'API 接口',
    content: `# 生成视频

> **POST** \`/v1/video/generations\`

根据文本提示生成视频，支持纯文生视频和图生视频两种模式，兼容豆包 Seedance (Sendance) 视频生成协议。

- 文生视频：仅提供 prompt
- 图生视频：提供 prompt + image_url（Seedance 支持多图：first_frame / last_frame / reference_image）

## 支持的模型

### Seedance 系列

| 模型 | 说明 |
|---|---|
| \`doubao-seedance-1-0-pro-250528\` | 1.0 Pro，高质量视频生成 |
| \`doubao-seedance-1-0-lite-t2v\` | 1.0 Lite，文生视频 |
| \`doubao-seedance-1-0-lite-i2v\` | 1.0 Lite，图生视频 |
| \`doubao-seedance-1-5-pro-251215\` | 1.5 Pro，性能增强 |
| \`doubao-seedance-2-0-260128\` | 2.0 标准版 |
| \`doubao-seedance-2-0-fast-260128\` | 2.0 快速版，低延迟 |
| \`doubao-seedance-2-0-mini-260615\` | 2.0 Mini，轻量低成本 |
| \`doubao-seedance-2-5-260628\` | 2.5 最新版，最长 30 秒，支持 21:9 与多模态参考（30 图 + 10 视频 + 10 音频） |

### 其他模型

\`kling-v1\` / \`kling-v2\` / \`cogvideox-2\` / \`vidu-1\` / \`jimeng\` / \`sora\`

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 是 | 视频生成模型（推荐 Seedance 系列） |
| \`prompt\` | string | 是 | 视频描述文本 |
| \`image_url\` | string | 否 | 参考图片 URL（图生视频模式） |
| \`images\` | array | 否 | 多图输入（Seedance 图生视频，按顺序映射 first_frame / last_frame / reference_image） |
| \`resolution\` | string | 否 | 输出分辨率（Seedance：480p / 720p / 1080p / 4k） |
| \`ratio\` | string | 否 | 画面比例（Seedance 2.5：21:9 / 16:9 / 4:3 / 1:1 / 3:4 / 9:16；其余：16:9 / 9:16 / 1:1） |
| \`size\` | string | 否 | 视频尺寸，如 1280x720 |
| \`duration\` | integer | 否 | 视频时长（秒）。Seedance 2.5 支持 4–30，2.0 系列 4–15，1.5 4–12，1.0 2–12 |
| \`n\` | integer | 否 | 生成数量，默认 1 |
| \`metadata\` | object | 否 | 扩展参数，支持多模态输入（video_url / audio_url）及 negative_prompt、style、watermark 等 |

### 请求示例（文生视频）

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}
\`\`\`

### 请求示例（图生视频）

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

### 请求示例（视频续写 / 多模态）

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

### cURL 示例

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

## 返回响应

### 200 成功（任务已提交）

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

## 查询任务状态

> **GET** \`/v1/video/generations/{task_id}\`

提交任务后，通过轮询该接口获取生成进度与结果。

### 任务状态

| 状态 | 说明 |
|---|---|
| \`QUEUED\` | 排队中，等待开始生成 |
| \`IN_PROGRESS\` | 生成中，progress 为当前进度 |
| \`SUCCESS\` | 已完成，result_url 为视频地址 |
| \`FAILURE\` | 生成失败，fail_reason 为失败原因 |

### 响应示例（已完成）

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

> **注意**：Seedance 2.0 / 2.5 支持多模态输入（视频 + 音频 + 图片），可通过 \`metadata.content\` 传入；其中 2.5 单次最多支持 30 张图片、10 段视频、10 段音频参考，并支持最长 30 秒的单段生成与多轮续写。任务提交后需通过 \`GET /v1/video/generations/{task_id}\` 轮询任务状态。`,
  },
  {
    id: 'asset-library',
    title: '素材库',
    category: 'API 接口',
    content: `# 素材库

素材库用于管理视频生成所需的多模态素材。客户可通过外部接口上传图片 / 视频 / 音频素材，然后在调用视频生成接口（\`/v1/video/generations\`）时，以 URL 形式引用这些素材作为 Seedance (Sendance) 的多模态输入。

## 接口列表

| 方法 | 路径 | 说明 |
|---|---|---|
| \`POST\` | \`/api/asset\` | 上传素材 |
| \`GET\` | \`/api/asset\` | 获取素材列表（分页） |
| \`GET\` | \`/api/asset/search\` | 搜索素材 |
| \`GET\` | \`/api/asset/{id}\` | 获取素材详情 |
| \`DELETE\` | \`/api/asset/{id}\` | 删除素材 |

所有素材库接口均需携带 \`Authorization: Bearer <token>\`（平台用户令牌），普通用户只能访问自己的素材，管理员可查看 / 管理所有素材。

## 上传素材

> **POST** \`/api/asset\`

使用 \`multipart/form-data\` 上传素材文件。

### 请求参数

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`file\` | file | 是 | 素材文件 |
| \`group_id\` | integer | 是 | 素材分组 ID（素材必须归属分组） |
| \`model\` | string | 是 | 生成模型标识，如 \`sendance-2.0\` / \`sendance-2.5\` |
| \`channel_id\` | integer | 否 | 上游渠道 ID（不传则取分组所属渠道） |

### 文件大小限制（与火山引擎 Seedance 对齐）

| 类型 | 大小限制 |
|---|---|
| 图片 (image) | 30MB |
| 视频 (video) | 200MB |
| 音频 (audio) | 15MB |

素材类型根据文件的 MIME 类型自动识别：\`image/*\` → image、\`video/*\` → video、\`audio/*\` → audio，其他类型将被拒绝。

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@/path/to/video.mp4' \\
--form 'group_id=1' \\
--form 'model=sendance-2.0'
\`\`\`

### 返回示例

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

> 上传成功后返回的 \`url\` 字段即为素材访问地址，可直接用于视频生成接口。

## 获取素材列表

> **GET** \`/api/asset\`

分页获取素材列表，支持按类型和模型筛选。

### 查询参数

| 参数 | 类型 | 说明 |
|---|---|---|
| \`type\` | string | 素材类型 (image / video / audio) |
| \`model\` | string | 生成模型标识（如 \`sendance-2.0\`） |
| \`page\` | integer | 页码，默认 0 |
| \`page_size\` | integer | 每页数量，默认 10 |
| \`user_id\` | integer | 用户 ID（仅管理员） |
| \`tenant_id\` | integer | 租户 ID（仅管理员） |

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset?type=video&model=sendance-2.0&page=0&page_size=20' \\
--header 'Authorization: Bearer <token>'
\`\`\`

### 返回示例

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

## 搜索素材

> **GET** \`/api/asset/search\`

按关键词搜索素材，参数与获取素材列表相同，额外支持：

| 参数 | 类型 | 说明 |
|---|---|---|
| \`keyword\` | string | 搜索关键词（匹配素材名称） |

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/search?keyword=开场' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 获取素材详情

> **GET** \`/api/asset/{id}\`

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 删除素材

> **DELETE** \`/api/asset/{id}\`

仅素材所有者或管理员可删除。

\`\`\`bash
curl --location --request DELETE '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 素材用于 Seedance 视频生成

上传素材后，将返回的 \`url\` 作为视频生成接口的多模态输入：

> **说明**：平台在提交视频生成任务时，会自动将素材库中的**图片**素材读取并转换为 Base64 编码（\`data:image/...;base64,...\`）提交给上游火山方舟，您无需额外准备公网可访问的静态地址；客户自托管且素材库中不存在的公网 URL、Base64 编码、\`asset://\` 素材 ID 则原样透传。**视频/音频**素材仅支持公网 URL 输入，请使用素材库外的公网地址（如图床、对象存储 CDN），单张图片建议不超过 25MB。

### 图生视频（参考图）

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

### 视频续写 / 音频输入

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

> **提示**：\`metadata.content\` 支持 \`text\` / \`image_url\` / \`video_url\` / \`audio_url\` 四种类型，\`image_url\` 可通过 \`role\` 指定 \`first_frame\` / \`last_frame\` / \`reference_image\`。`,
  },
  {
    id: 'moderation',
    title: '内容审核',
    category: 'API 接口',
    content: `# 内容审核

> **POST** \`/v1/moderations\`

检测文本或图文内容是否违反安全策略

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 否 | 审核模型，如 \`content-moderation-latest\` |
| \`input\` | string/array | 是 | 待审核内容（文本或文本+图片数组） |

### 请求示例

\`\`\`json
{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}
\`\`\`

### cURL 示例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/moderations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}'
\`\`\`

## 返回响应

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
    title: '重排序',
    category: 'API 接口',
    content: `# 重排序

> **POST** \`/v1/rerank\`

根据查询文本对文档列表进行相关性重排序

## 请求参数

### Body 参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| \`model\` | string | 否 | 重排序模型，如 \`bge-rerank-v3\` |
| \`query\` | string | 是 | 查询文本 |
| \`documents\` | array | 是 | 待排序文档列表 |
| \`top_n\` | integer | 否 | 返回前 N 个结果 |
| \`return_documents\` | boolean | 否 | 是否返回文档原文，默认 true |

### 请求示例

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

### cURL 示例

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

## 返回响应

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
    title: '常见问题',
    category: '平台相关',
    content: `# 常见问题

### 通用问题

**Q：零一云和 OpenAI 官方有什么区别？**

A：零一云是兼容 OpenAI 格式的网关，多了国产模型支持（DeepSeek/Qwen/GLM等），价格更灵活。接口格式完全兼容，OpenAI SDK 直接用。

**Q：支持哪些编程语言？**

A：任何支持 HTTP 的语言都能调。Python 和 Node.js 有官方 SDK 最方便，其他语言（Go/Java/PHP/Rust）用 HTTP 客户端直接请求即可。

**Q：可以免费试用吗？**

A：联系管理员获取测试 Key，一般会有初始额度。

### 调用问题

**Q：返回 \`context_length_exceeded\` 怎么办？**

A：输入太长了。精简 messages 内容，或换上下文更长的模型（如 gpt-4.1 支持 1M）。

**Q：返回 \`model_not_found\` 怎么办？**

A：model 参数写错了。调用 \`GET /v1/models\` 查看可用模型列表，注意大小写。

**Q：流式输出中断了怎么办？**

A：网络问题导致 SSE 断连，无法续传，需要重新发起请求。建议客户端做拼接逻辑，断流后重新请求。

**Q：为什么回复内容被截断？**

A：可能是 \`max_tokens\` 设太小，或模型输出达到上限。检查 \`finish_reason\`，如果是 \`length\` 说明被截断了，加大 \`max_tokens\`。

**Q：中文回复质量不好怎么办？**

A：试试在 system 消息中明确要求"用中文回答"，或使用中文能力更强的模型（DeepSeek/Qwen/GLM）。

### 计费问题

**Q：一次请求消耗多少 Token？**

A：看响应中的 \`usage\` 字段。输入 + 输出的 Token 总数就是消耗量。

**Q：流式请求怎么统计 Token？**

A：设置 \`stream_options: {"include_usage": true}\`，最后一个 chunk 会包含 usage。非流式请求默认返回 usage。

**Q：计费和 OpenAI 官方一样吗？**

A：计费逻辑相同（按 Token），但倍率不同，零一云的国产模型更便宜。具体倍率见后台配置。

### 功能问题

**Q：支持 Function Calling 吗？**

A：支持。DeepSeek / GPT / Claude 等模型都支持，用法和 OpenAI 完全一致。

**Q：支持图片输入（Vision）吗？**

A：支持。用 gpt-4o / claude-sonnet-4 等多模态模型，在 content 中传图片 URL 或 Base64。

**Q：支持 JSON 输出吗？**

A：支持。设置 \`response_format: {"type": "json_object"}\`。

**Q：可以微调模型吗？**

A：暂不支持。可以直接使用平台提供的预训练模型，通过 prompt 工程和 few-shot 达到定制效果。

**Q：视频生成要等多久？**

A：通常 30 秒到数分钟，取决于模型和视频长度。

### 部署问题

**Q：跨域（CORS）怎么配置？**

A：如果前端直接调 API 会遇到跨域问题。建议走后端代理，或联系管理员配置 CORS 白名单。

**Q：内网能调 API 吗？**

A：零一云部署在公网，内网需要能访问外网。如果完全隔离，需要私有化部署。

**Q：支持私有化部署吗？**

A：联系商务，支持私有化部署到客户机房。

**Q：怎么查看 API 调用日志？**

A：管理后台 → 日志页面，可按 Key / 模型 / 时间筛选。`,
  },
  {
    id: 'terms',
    title: '平台协议',
    category: '平台相关',
    content: `# 平台协议

这是您（"即在平台上注册为用户并使用我们服务的个人或组织，并承诺遵守我们的各项协议、隐私政策和其他服务条款"）与北京创世华彩科技有限公司及其关联公司（"**华彩**"或"我们"）之间的协议（"协议"）。

您确认，在使用或购买我们零一云产品或服务之前，您已完整阅读、理解并接受本协议的所有条款。一旦您实际开始使用本平台上的服务或完成购买流程，即表示您已阅读并同意遵守本协议。我们有权在必要时修改本协议的条款，您可以在此页面查看协议的最新版本。本协议条款变更后，如果您继续使用本平台上的服务，则视为您已接受变更后的协议。**有关本平台的数据和个人信息收集及使用政策的详细说明，请参阅隐私政策。**

您保证您具备法律规定的完全民事行为能力，是能够独立承担民事责任的自然人，或是经法人授权代表其行事的完全民事行为能力人；如果您未满十八周岁，即使您已注册，也无法完成实名认证或使用本平台的服务。您承诺并确认，本协议的内容不违反您所在国家或地区的法律。

## 1. 账户管理

### 1.1 账户和真实姓名认证

1.1.1. 您按照本平台要求填写相关信息，并确认同意遵守本协议及"隐私政策"的所有条款后，我们将为您创建账户。您知悉并同意，本平台的部分或全部功能需要您的账户进行实名认证后方可激活，且我们有权根据自身判断及业务发展变化，不时修改和维护本平台的服务和功能。

1.1.2. 如果您代表企业、法人、非法人组织或其他实体访问和使用本平台，则必须完成账户的企业认证。已认证的企业应对该账户及其关联用户的所有使用、充值、信息提供等行为负责，不得以账户借用、人员离职等为由拒绝承担责任。

1.1.3. 如果您通过第三方连接或访问此服务，则表示您承认并允许该第三方服务使用或存储您的用户信息、访问令牌、相关帐户信息和身份验证凭据以及其他数据。

1.1.4. 您有责任保护您创建、加入或管理的账户以及您的用户身份，不得向任何人透露您用于登录的任何登录凭证。如果账户因您主动泄露或您受到他人攻击或欺诈而丢失，本平台概不负责。

1.1.5. 您设置的账号名称和用户昵称不得违反国家法律法规、公共秩序和良好风俗、社会道德，也不得造成您本人与本平台身份混淆。

1.1.6. 同一用户仅可创建一个个人账户。您的个人账户仅供您本人使用。除非双方另有约定，您不得以任何形式赠与、出借、出租、转让、出售或以其他方式允许任何第三方使用您的个人账户。

1.1.7. 同一用户可以创建多个组织账号。如果您允许其他用户共同使用您的组织账号，您将对相应用户在该组织账号下的所有行为的后果和责任承担全部责任。

### 1.2 变更、暂停和终止

我们可能会更改、暂停或终止向您提供的服务，或对服务的使用设置限制，且无需承担任何责任，前提是我们已尽最大努力通过短信、电子邮件或本平台公告等一种或多种方式提前通知您。我们可以随时停用您的帐户。即使您的帐户因任何原因被终止，您仍受本协议约束。

## 2. 服务访问和服务限制

### 2.1 服务获取

在您遵守本协议的前提下，我们特此授予您非独占且不可转让的权利，仅供您个人使用或用于您所代表的企业或其他实体的内部业务用途。

### 2.2 服务限制

您不得：
- 对服务的任何部分进行反汇编、逆向工程、解码或反编译
- 未经我们事先书面同意，不得购买、出售或转让 API 密钥
- 复制、出租、出售、出借、转让、许可或试图再许可、转售、分发或修改本服务的任何部分
- 采取任何可能对我们的服务器、基础设施等造成过重负担的行动
- 将服务用于违法、侵权、欺诈等用途
- 规避我们可能采取的阻止或限制访问服务的措施
- 试图干扰或破坏运行该服务的服务器的系统完整性或安全性
- 使用此服务发送垃圾邮件、连锁信或其他未经请求的电子邮件
- 通过本服务传输非法数据、病毒或其他恶意软件
- 冒充他人或实体，虚假陈述您与他人或实体的关系
- 从本服务收集或获取任何个人信息

## 3. 交互数据

3.1 本服务可能允许用户在使用平台服务期间，通过与大型模型、第三方网站、软件、应用程序或服务进行相关数据的输入、反馈、修改、处理、存储、上传、下载和分发等操作。

3.2 如果发现交互数据违反任何法律、法规或本协议的规定，我们有权删除该交互数据或停止提供技术服务。

3.3 作为独立的技术支持方，本平台对您使用本平台服务所产生的任何交互数据均不享有任何知识产权。您使用本平台服务所产生的所有交互数据、义务和责任均由您自行承担。

3.4 免责声明：我们不对任何互动数据负责。您应全权负责您在本平台服务中输入、提供反馈、更正、处理、存储、上传、下载和分发的互动数据。

3.5 我们将根据相关法律法规为人工智能生成的合成内容添加相应的标识。您不得恶意删除、篡改、伪造或隐瞒上述标识。

## 4. 知识产权

### 4.1 零一云的知识产权

本平台服务中我们提供的所有内容的知识产权自始归我方所有。您不得访问、出售、许可、出租、修改、分发、复制、传输、展示、发布、改编或创作任何此类知识产权的衍生作品。

### 4.2 输出

在您遵守相关规定并符合相关法律法规的前提下，您可以按照法律要求的方式使用本平台服务生成的结果。

### 4.3 用户使用数据

我们可能会收集与诊断、技术和使用情况相关的信息，用于改进我们的产品和服务。

### 4.4 反馈

如果您就本服务向我们提供任何建议或反馈，则您在此将反馈中的所有权利和权益转让给我们。

## 5. 机密信息

本服务可能包含零一云及其他用户的非公开、专有或机密信息。您将保护所有机密信息的隐私，不得将其用于除行使本协议项下权利之外的任何其他目的，也不得向任何个人或实体披露。

## 6. 计费政策和税费

6.1 本平台提供的某些服务可能需要支付使用费。选择使用本服务即表示您同意本平台上所述的适用于您的定价和付款条款。

6.2 由于"先服务后计费"的特殊性，我们的产品和服务通常采用"使用后付费"模式。请确保您的账户中有足够的余额，否则可能会产生欠款。

6.3 本平台所有产品和服务的定价、计费、付款条款均通过引用并入本协议。

6.4 如有任何政府规定的税费，您应负责支付与您使用/激活服务相关的所有税费。

## 7. 出口管制和制裁

您承诺遵守中华人民共和国的出口管制和制裁法律法规。您承诺不将本平台提供的产品或服务用于军事、大规模杀伤性武器相关用途。

## 8. 隐私和数据安全

### 8.1 隐私

我们将始终遵守《中华人民共和国个人信息保护法》及其他相关适用法律。

### 8.2 数据安全

我们非常重视您个人信息的完整性和安全性。但是，我们无法保证未经授权的第三方永远无法突破我们的安全保护措施。

## 9. 第三方服务的使用

本服务可能包含指向第三方网站、资料和服务的链接，这些第三方服务并非由我们所有或控制。我们不对任何第三方服务进行认可，也不承担任何责任。

## 10. 赔偿

您应为我们及我们的关联公司及其各自的代理人、供应商、许可人、员工、承包商、高级职员和董事进行辩护、赔偿并使其免受损害，使其免于承担因您对本服务的访问和使用、您违反本协议、或您侵犯任何第三方权利而引起的任何索赔、损害、义务、损失、负债、成本和费用。`,
  },
  {
    id: 'privacy',
    title: '隐私政策',
    category: '平台相关',
    content: `# 隐私政策

欢迎使用北京创世华彩科技有限公司及其关联方（以下简称"华彩"或"我们"）的高价值GenAI开放平台。我们高度重视用户（以下简称"您"）的信息保护。当您注册、登录并使用本平台时，我们会收集并存储您注册及正常使用本平台功能所需的必要用户信息。我们不会收集或存储您在使用本平台期间与开源模型、第三方网站、软件、应用程序或服务之间的交互数据。

## 概述

本隐私政策将帮助您了解：

1. 我们如何收集和使用您的用户信息
2. 我们使用 Cookie 和类似技术
3. 我们如何存储您的用户信息
4. 我们如何共享、传输和公开披露您的信息
5. 我们如何保护您的信息安全
6. 我们如何管理您的用户信息
7. 未成年人使用条款
8. 隐私政策的修订和通知
9. 适用范围

## 1. 我们如何收集和使用您的用户信息

### 1.1 我们会主动收集您的用户信息

为确保您正常使用我们的平台，我们将收集您在使用我们服务时主动提供的用户信息，包括但不限于：

**1.1.1** 当您注册、验证和登录平台账号时，您可以使用手机号码创建账号。我们将通过发送短信验证码来验证您的身份。

**1.1.2** 当您订阅或激活服务时，根据法律法规，我们需要对您进行实名认证。

- 对于个人用户：您可能需要提供您的真实身份信息，包括您的全名、身份证号码等。
- 对于企业用户：您可能需要提供贵单位的相关信息，包括单位名称、统一社会信用代码等。

**1.1.3** 当您使用本服务时，我们会收集必要的信息以维护产品和服务的安全稳定运行，包括设备信息、网络日志信息等。

### 1.2 我们可能会从第三方获取用户信息

为了向您提供更优质、更高效、更个性化的服务，我们的关联公司和合作伙伴可能会根据法律法规与您签订的协议或您的同意，与我们共享您的信息。

### 1.3 业务和客户数据

通过本平台提供的服务生成或处理的数据属于您的业务和客户数据（"交互数据"）。您拥有交互数据的完全所有权。作为中立的技术服务提供商，本平台不会访问、使用或披露您的交互数据，除非法律法规另有规定。

## 2. Cookie 和类似技术的使用

Cookie 和类似技术是互联网上常用的技术。当您使用本平台时，我们可能会使用相关技术向您的设备发送 Cookie，以收集和存储您的帐户信息、搜索历史记录和登录状态信息。您可以通过浏览器设置拒绝或管理 Cookie。

## 3. 我们如何存储您的用户信息

### 3.1 信息存储位置

我们将把在运营本网站及相关服务过程中收集和生成的用户信息存储在中华人民共和国境内。

### 3.2 信息存储期限

我们仅在提供本平台及相关服务所必需的期限内保留您的用户信息。必要期限届满后，我们将删除或匿名化您的信息。

## 4. 我们如何共享、传输和披露您的信息

### 4.1 参与数据使用的合作伙伴

涉及合作伙伴的数据使用活动必须具有合法目的，且应限于实现该目的所必需的范围。我们将对合作伙伴的安全能力进行全面评估，并要求其遵守合作法律协议。

### 4.2 用户信息的联合处理或委托处理

本平台及相关服务中的某些特定模块或功能由合作伙伴提供。我们仅根据合法、公正、必要和安全原则，在提供服务所需的最小范围内向其提供您的用户信息。

### 4.3 用户信息转移

除经您明确同意、根据法律法规要求、或平台运营发生变更/合并/收购/破产清算外，我们不会将您的用户信息转移给任何其他第三方。

### 4.4 用户信息的披露

原则上，除非获得您的明确同意或国家法律法规要求，否则我们不会公开披露您的用户信息。

## 5. 我们如何保护您的信息安全

我们高度重视用户信息安全，采取合理的安全措施来保护您的信息不被未经授权的访问、使用或披露。

## 6. 我们如何管理您的用户信息

您有权访问、更正和删除您的用户信息。您可以通过本平台的设置页面管理您的个人信息，或联系我们协助处理。

## 7. 未成年人使用条款

我们不允许未成年人（未满18周岁）使用本平台服务。如果您是未成年人，请立即停止使用我们的服务。

## 8. 隐私政策的修订和通知

我们可能会不时修订本隐私政策。修订后的隐私政策将在本页面发布，并自发布之日起生效。

## 9. 适用范围

本隐私政策适用于您使用本平台服务的全部场景。如果您通过第三方服务使用本平台，还需遵守第三方的隐私政策。`,
  },
]
