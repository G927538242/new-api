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

export const docCategoriesEn = [
  'Getting Started',
  'Integration Guide',
  'API Reference',
  'Platform',
] as const

export const docPagesEn: DocPage[] = [
  {
    id: 'introduction',
    title: 'Product Introduction',
    category: 'Getting Started',
    content: `# Product Introduction

LingyiYun (零一云) is a domestic model gateway platform compatible with mainstream AI API standards.

**What problems does it solve?**

| Pain Point | LingyiYun's Solution |
|---|---|
| Unstable access to overseas AI services from China | Direct access via domestic nodes, stable and reliable |
| Different models require different APIs | One unified address with a standard API format; no code changes needed |
| Overseas models are expensive | Access domestic models like DeepSeek / Qwen at a fraction of the cost |
| Managing multiple models is cumbersome | One key for all models, with unified quota management in the console |
| Data compliance risk when crossing borders | Data stays on domestic channels, compliant and controllable |

**Core Capabilities**

**Standard API Compatibility**: Compatible with mainstream AI API formats; just change \`base_url\`, zero code changes

**Full-Category Model Coverage**: Chat / Embedding / Image / Audio / Video / Moderation / Rerank, 11 interfaces

**Domestic Models First**: Mainstream domestic models such as DeepSeek, Qwen, and GLM work out of the box with great cost-effectiveness

**Multi-Key Management**: Create multiple tokens in the console to independently control quota, permissions, and model access scope

**Pay-As-You-Go**: Fine-grained Token-level billing; pay only for what you use, with no minimum spend

**One-Line Integration**

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)
\`\`\`

**Supported Tools:** Cursor, Windsurf, Continue, JetBrains AI, VS Code Copilot, ChatBox, LobeChat, NextChat, Open WebUI, and any other tool that supports standard AI APIs.`,
  },
  {
    id: 'quick-start',
    title: 'Quick Start',
    category: 'Getting Started',
    content: `# Quick Start

This guide helps you get connected within 5 minutes.

## Step 1: Get an API Key

All integration methods require an API Key for authentication.

1. Visit / log in to the **LingyiYun Admin Console** (/dashboard)
2. Create and copy your API Key on the **Token Management** (or "API Key") page
3. Keep it safe and do not share it with others

The API Key is the required credential for all integration methods and will be used multiple times in the configuration below. It is recommended to get your Key first before continuing with the next steps.

## Step 2: Choose an Integration Method

LingyiYun supports integration with various clients and tools. Choose the one that fits your usage habits:

| Integration Method | Target Users | Difficulty |
|---|---|---|
| **CC Switch** (Recommended) | Those managing multiple AI tools (Claude Code / Codex / Claude Desktop, etc.) who prefer a GUI for one-click switching | Easy |
| Claude Code Client | Users of the Claude desktop app / terminal version | Easy |
| Codex CLI | Developers who prefer terminal workflows and use OpenAI Codex | Easy |
| Direct API Calls | Developers who write their own code | Medium |
| AI Coding Tools (Cursor / Windsurf, etc.) | Users who use AI-assisted coding in their IDE | Easy |

---

## Method 1: CC Switch (Recommended)

CC Switch is an open-source GUI tool that centrally manages the provider configurations of multiple AI tools such as Claude Code, Claude Desktop, and Codex, with one-click switching for maximum convenience.

### Install CC Switch (version v3.16.5 or later)

**macOS users (Homebrew recommended):**

\`\`\`bash
brew install --cask cc-switch
\`\`\`

**Other systems:** Visit [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) and download the installer for your platform:

- macOS: \`.dmg\` / \`.zip\`
- Windows: \`.msi\` installer / Portable \`.zip\` standalone
- Linux: \`.deb\` / \`.rpm\` / \`.AppImage\`

> If macOS Gatekeeper blocks the first launch, go to "System Settings → Privacy & Security" and click "Open Anyway".

### Configure LingyiYun as a Provider

#### Connect Claude Desktop

1. Open CC Switch and switch to the **Claude Desktop** tab at the top of the main window.
2. Click the "orange plus" button in the top-right corner to open the "Add New Provider" dialog.
3. Select "Custom Configuration" under "Preset Providers".
4. Fill in the following information:
   - **Provider Name**: e.g. \`LingyiYun\`
   - **API Request URL**: \`{{BASE_URL}}\`
   - **API Key**: Paste the Key you obtained from the console
   - **Select Model**: e.g. \`deepseek-v3\` / \`qwen-max\` / \`glm-4\`, etc.
5. Click "+ Add" to save.
6. Click "Enable" on the provider card.
7. Fully restart the Claude Desktop app and it will be ready to use.

#### Connect Codex

1. Open CC Switch and switch to the **Codex** tab at the top of the main window.
2. Click "Add Provider" in the top-right corner and select "Custom Configuration".
3. Fill in:
   - **API Request URL**: \`{{BASE_URL}}\`
   - **API Key**: The Key obtained from the console
   - **Select Model**: Recommended: \`deepseek-r1\`, \`glm-4\`
4. Click "+ Add" → enable the provider.
5. Restart the Codex terminal process you are running for the changes to take effect (Codex does not support hot-switching).

---

## Method 2: Claude Code Client

Claude Code is Claude's official terminal AI coding assistant. It is recommended to manage it via CC Switch (see Method 1); manual configuration is also possible.

### Install the Claude Code Client

Visit the [Claude official website](https://claude.ai/code/family) to download and install the version for your system.

### Connect via CC Switch (Recommended)

Follow the "Connect Claude Desktop" steps in Method 1, but operate on the **Claude Code** tab.

> **Windows users:** If you encounter the \`Virtual Machine Platform not available\` error, enable the "Virtual Machine Platform":
> 1. Press \`Win + R\`, type \`optionalfeatures\`, and press Enter
> 2. Check "Virtual Machine Platform" → OK
> 3. Restart your computer and then open the Claude client

---

## Method 3: Codex CLI

Codex is OpenAI's official terminal AI coding assistant.

### Install Codex

- It is recommended to install [Node.js](https://nodejs.org/zh-cn/download/) 22+ first
- macOS users can also run directly: \`brew install codex\`
- Or install via npm:

\`\`\`bash
npm install -g @openai/codex
codex --version  # 显示版本号即安装成功
\`\`\`

### Configure the Provider (from scratch)

**macOS / Linux users:** Open a terminal and run:

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

**Windows users (PowerShell):**

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

### Set the API Key Environment Variable

Replace \`<your-api-key>\` with the Key copied from the console:

**macOS:**

\`\`\`bash
echo 'export OPENAI_API_KEY="<你的-API-key>"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

**Linux:**

\`\`\`bash
echo 'export OPENAI_API_KEY="<你的-API-key>"' >> ~/.bashrc
source ~/.bashrc
\`\`\`

**Windows PowerShell:**

\`\`\`powershell
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "<你的-API-key>", "User")
\`\`\`
> After running, close and reopen PowerShell for the changes to take effect.

After that, running \`codex\` in the terminal will route requests through LingyiYun.

### Codex Already Installed, Modify the Configuration

The configuration file and environment variables are the same as in "Configure from Scratch"; simply overwrite them.

---

## Method 4: Direct API Calls

If you write your own code, you only need to change one line of \`base_url\`:

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

For the complete API documentation, see the "API Reference" section below.

---

## Method 5: AI Coding Tools

For configuring tools such as Cursor, Windsurf, Continue, and JetBrains AI, refer to the next chapter "Use in AI Coding Tools".

---

## FAQ

| Question | Solution |
|---|---|
| Where do I get an API Key? | Log in to the console → Token Management → Create a token |
| Configuration not taking effect? | Check that you restarted the client / reopened the terminal / refreshed the page |
| How do I switch between different models? | Use CC Switch for one-click switching; or modify the \`model\` field in the config file / code |
| Getting "Insufficient Quota" (402)? | Recharge or switch to a Key with remaining quota |
| Getting "Rate Limit Exceeded" (429)? | Retry later, or contact the admin to raise your limit |

For more help, contact the technical support team.

---

## 1. Model List and Selection Guide

### Query Available Models

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`
In the response, \`data[].id\` gives the available model parameter values.

### Chat Models

| Model | Context | Features | Use Cases |
|---|---|---|---|
| \`deepseek-v3\` | 64K | Great value, strong Chinese capability | Daily conversation, content generation |
| \`deepseek-r1\` | 64K | Reasoning-chain model with a visible thinking process | Math, logical reasoning, code debugging |
| \`gpt-4o\` | 128K | Multimodal, strong overall capability | Complex tasks, image-text understanding |
| \`gpt-4o-mini\` | 128K | Fast and low cost | High-concurrency scenarios, simple conversations |
| \`gpt-4.1\` | 1M | Ultra-long context | Long-document processing, codebase analysis |
| \`gpt-4.1-mini\` | 1M | Long context + low cost | Long-document summarization |
| \`gpt-4.1-nano\` | 1M | Fastest and cheapest | Lightweight tasks such as classification and extraction |
| \`o3\` | 200K | Enhanced reasoning | Complex reasoning, scientific questions |
| \`o4-mini\` | 200K | Reasoning + low cost | Everyday reasoning tasks |
| \`claude-sonnet-4-20250514\` | 200K | Strong at coding and reasoning | Code generation, analysis |
| \`qwen-max\` | 32K | Optimized for Chinese | Chinese business scenarios |
| \`qwen-plus\` | 128K | Great value | General Chinese tasks |
| \`glm-4\` | 128K | Good Chinese understanding | Chinese conversation, writing |
| \`gemini-2.5-pro\` | 1M | Ultra-long context + multimodal | Long documents, multimodal analysis |

### Embedding Models

| Model | Dimensions | Notes |
|---|---|---|
| \`text-embedding-3-large\` | 3072 (reducible) | High precision; recommended for production |
| \`text-embedding-3-small\` | 1536 (reducible) | Fast and low cost |
| \`text-embedding-ada-002\` | 1536 | Legacy compatibility |

### Image Models

| Model | Max Size | Features |
|---|---|---|
| \`gpt-image-1\` | 1536x1024 | Transparent backgrounds, moderation level control |
| \`dall-e-3\` | 1792x1024 | High resolution, style selection |
| \`dall-e-2\` | 1024x1024 | Basic generation, multiple image output |

### Audio Models

| Model | Use Case | Notes |
|---|---|---|
| \`tts-1\` | Text-to-speech | Standard quality |
| \`tts-1-hd\` | Text-to-speech | HD audio quality |
| \`gpt-4o-mini-tts\` | Text-to-speech | Supports style instructions |
| \`whisper-1\` | Speech-to-text / translation | Multi-language support |

### Video Models

| Model | Notes |
|---|---|
| \`kling-v2\` | Kuaishou Kling, text-to-video / image-to-video |
| \`veo-2\` | Google video generation |
| \`cerve\` | Video generation |

### Rerank Models

| Model | Notes |
|---|---|
| \`cohere-rerank-v3\` | Cohere reranking, recommended for RAG scenarios |

### Moderation Models

| Model | Notes |
|---|---|
| \`omni-moderation-latest\` | Multimodal moderation, supports text + images |

**Note**: The actual available models are determined by the \`GET /v1/models\` response; the platform continuously adds new models.

## 2. Quota and Billing

### Billing Model

LingyiYun bills based on **Token usage**; different models have different prices.

**Input Tokens** (prompt_tokens): the content you send to the model

**Output Tokens** (completion_tokens): the content generated by the model

In general, output tokens cost more per unit than input tokens

### What Is a Token

A token is the basic unit of text processing for models. Rough conversion:

| Language | 1 Token ≈ |
|---|---|
| English | 4 characters / 0.75 words |
| Chinese | 1~2 Chinese characters |

### Model Multipliers

Different models have different prices, converted via multipliers. Using GPT-4o-mini as the baseline (multiplier 1x):

| Model | Input Multiplier | Output Multiplier | Notes |
|---|---|---|---|
| gpt-4o-mini | 1x | 1x | Baseline |
| deepseek-v3 | 0.5x | 0.5x | Cheaper |
| gpt-4o | 5x | 15x | Stronger capability, higher price |
| gpt-4.1 | 10x | 30x | Long context |
| claude-sonnet-4 | 6x | 30x | Strong at coding |

The multipliers are for reference only; the actual configuration in the console takes precedence. Admins can adjust them in **Operation Settings → Model Pricing**.

### Checking Quota

Log in to the admin console and view the used and remaining quota of a Key in **Token Management**

or get the consumption of each call in real time via the \`usage\` field in the API response

### Quota Exhausted

When a Key's quota runs out, the request returns:

\`\`\`json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
\`\`\`
The HTTP status code is \`402\`. In this case, recharge or switch to a Key with remaining quota.

### Billing by Interface

| Interface | Billing Basis |
|---|---|
| Chat / Responses | Input + output tokens |
| Embeddings | Input tokens |
| Images | Billed per image and model, not per token |
| Audio TTS | Billed by input character count |
| Audio STT / Translation | Billed by audio duration |
| Video | Billed per request |
| Moderation | Input tokens (usually very small) |
| Rerank | Input tokens |

## 3. Rate Limits

### Limitation Dimensions

| Dimension | Meaning |
|---|---|
| RPM | Requests Per Minute, the number of requests per minute |
| TPM | Tokens Per Minute, the number of tokens per minute |

### Limitation Rules

Limits are enforced per **API Key**; different Keys are calculated independently

Admins can set different limits for different token groups in the console

Default limits vary by deployment configuration; contact the admin for the exact values

### Limit Exceeded Response

\`\`\`json
{
  "error": {
    "message": "Rate limit reached for default",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
\`\`\`
The HTTP status code is \`429\`.

### Response Headers

Rate limit information is returned via HTTP response headers:

| Header | Meaning |
|---|---|
| \`X-RateLimit-Limit\` | Total limit for the current period |
| \`X-RateLimit-Remaining\` | Remaining requests for the current period |
| \`X-RateLimit-Reset\` | When the limit resets (Unix timestamp) |

### Mitigation Strategies

1. **Read the response headers**: check \`X-RateLimit-Remaining\` after each request to anticipate limits in advance
2. **Throttle before sending**: implement client-side rate limiting; don't wait for a 429 to slow down
3. **Exponential backoff**: after a 429, wait 1s → 2s → 4s → 8s before retrying
4. **Rotate multiple Keys**: configure several Keys and use them in turn to increase total throughput
5. **Reduce wasted tokens**: trim your prompts and avoid repeating context

#### Batch Calls

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["人工智能", "机器学习", "深度学习"]
)
for item in response.data:
    print(f"索引 {item.index}: {len(item.embedding)} 维")
\`\`\`

#### Reducing Dimensions

The \`text-embedding-3\` family supports specifying the output dimensions to reduce storage costs:

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="人工智能改变世界",
    dimensions=512  # 默认3072维降到512维
)
\`\`\`
Reducing dimensions loses some precision; it is recommended to start with higher dimensions and lower them gradually based on the results.

| Parameter | Recommendation |
|---|---|
| \`model\` | Default \`cohere-rerank-v3\`, currently the most versatile |
| \`top_n\` | Usually set to 3~5; no need to return too many |
| \`return_documents\` | Set to \`true\` to avoid looking up the original text by index |`,
  },
  {
    id: 'ai-tools',
    title: 'Use in AI Coding Tools',
    category: 'Getting Started',
    content: `# Using LingyiYun in AI Coding Tools

This document explains how to connect LingyiYun in mainstream AI coding tools such as Cursor, Windsurf, and Continue, so that these tools use your own models and quota.

## 1. Using LingyiYun in Cursor

Cursor is one of the most popular AI coding tools and supports custom compatible APIs. LingyiYun is fully compatible with the standard API format, so it works right after configuration.

### 1.1 Add Models

1. Open Cursor and go to **Settings → Models**
2. In the input box at the bottom of **Models Names**, enter the model name you want to use and click \`Add model\`

Recommended models:

| Use Case | Model | Notes |
|---|---|---|
| Everyday coding | \`deepseek-v3\` | Best value, good Chinese understanding, strong coding capability |
| Complex reasoning | \`deepseek-r1\` | Reasoning-chain model, great for debugging, math, logic |
| General conversation | \`qwen-max\` | Alibaba Tongyi, excellent in Chinese scenarios |
| Long text | \`qwen-plus\` | 128K context, great value |
| Chinese writing | \`glm-4\` | Zhipu, strong Chinese understanding and generation |

3. After adding, **enable the toggle** for the corresponding model in the list

### 1.2 Configure API Key and Base URL

On the same Settings → Models page, find the API Key configuration area:

| Setting | Value |
|---|---|
| **API Key** | \`sk-your-key\` (your LingyiYun token) |
| **Base URL** | \`{{BASE_URL}}/v1\` |

After filling in the values, click \`Verify\`; when it reports success, the configuration is complete.

### 1.3 Using Models in Cursor

After configuration:

1. Open Cursor's Chat panel (shortcut \`Cmd+L\` / \`Ctrl+L\`)
2. In the model selection dropdown, select the model you just added
3. Chat normally; all requests will go through LingyiYun

### 1.4 Configure @Docs Document Context

Cursor's \`@Docs\` feature can inject external documents into the conversation as context, allowing the model to answer questions based on your API documentation.

Configuration steps:

1. Open Cursor Settings → Features → Docs
2. Click \`Add new doc\`
3. Fill in the configuration:

| Setting | Value |
|---|---|
| **Name** | \`LingyiYun Docs\` |
| **URL** | Your documentation site URL |
| **Start URL** (optional) | The documentation homepage URL |

4. Click \`Save\` to save

### 1.5 Using @Docs to Reference Documents

In Cursor Chat:

1. Type \`@Docs\` and select \`LingyiYun Docs\`
2. Then type your question, for example:

\`\`\`
@零一云 Docs 如何使用 Function Calling？
\`\`\`

Cursor will automatically fetch the document content as context, and the model will give accurate answers based on the document.

## 2. Using LingyiYun in Windsurf

Windsurf (formerly Codeium) also supports standard compatible APIs.

### Configuration Steps

1. Open Windsurf Settings → AI Provider
2. Select **OpenAI Compatible** or **Custom Provider**
3. Fill in the configuration:

| Setting | Value |
|---|---|
| **API Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` or another available model |

4. After saving, you can use it in Cascade and Chat

### Windsurf Config File Method

You can also directly edit the config file \`~/.windsurf/settings.json\`:

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

## 3. Using LingyiYun in Continue

Continue is an open-source AI coding assistant that supports VS Code and JetBrains.

### Configuration Steps

Edit the Continue config file \`~/.continue/config.json\`:

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

### Configuration Notes

| Field | Description |
|---|---|
| \`models\` | List of conversation models shown in Continue's model selection dropdown |
| \`tabAutocompleteModel\` | Code completion model; a fast model is recommended (deepseek-v3) |
| \`embeddingsProvider\` | Embedding model for codebase indexing |

After configuration, restart VS Code / JetBrains and you can select LingyiYun models in the Continue panel.

## 4. Using LingyiYun in VS Code Copilot

GitHub Copilot supports connecting to third-party APIs through Copilot Chat's custom model feature.

### Configuration Steps

1. Install the **GitHub Copilot** and **GitHub Copilot Chat** extensions
2. Open VS Code Settings → search for \`github.copilot.chat\`
3. Configure the custom endpoint (requires VS Code 1.90+ and Copilot custom model support)

### Configuration via Environment Variables

Set the environment variables in the terminal, then launch VS Code:

\`\`\`bash
export OPENAI_API_KEY=sk-your-key
export OPENAI_BASE_URL={{BASE_URL}}/v1
code .
\`\`\`

**Note**: Copilot's support for custom models is continuously evolving, and the exact configuration may change between versions. If custom models are not supported, consider using Cursor or Continue instead.

## 5. Using LingyiYun in JetBrains AI

JetBrains IDEs (IntelliJ IDEA / PyCharm / WebStorm, etc.) support custom endpoints in their AI Assistant.

### Configuration Steps

1. Open **Settings → Tools → AI Assistant → Providers**
2. Select **OpenAI Compatible** or **Custom Provider**
3. Fill in:

| Setting | Value |
|---|---|
| **Server URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` or another |

4. Click \`Test Connection\` to verify
5. After saving, you can use it in the AI Assistant

## 6. Using in Chat Tools

If you only want to use LingyiYun models in a chat interface (rather than coding tools), you can do so in the following ways:

### Using Third-Party Clients

Any client that supports custom APIs works:

| Client | Platform | Configuration |
|---|---|---|
| ChatBox | Desktop | Settings → API Base URL + Key |
| NextChat | Web | Settings → API Base URL + Key |
| LobeChat | Web/Desktop | Settings → Model Service → Proxy URL + Key |
| Open WebUI | Web | Settings → API URL + Key |
| Cherry Studio | Desktop | Settings → API URL + Key |

Common configuration:

| Setting | Value |
|---|---|
| API Base URL | \`{{BASE_URL}}/v1\` |
| API Key | \`sk-your-key\` |

## 7. FAQ

### Q: What if Verify fails in Cursor?

Check the following:

| Check | Correct Value |
|---|---|
| Base URL | \`{{BASE_URL}}/v1\` (must end with \`/v1\`) |
| API Key | Starts with \`sk-\`, no extra spaces |
| Model name | Must be an id returned by \`GET /v1/models\`; mind the case |
| Network connectivity | \`curl {{BASE_URL}}/v1/models\` returns normally |

### Q: The model doesn't show up in Cursor?

- Make sure the model toggle is on
- Quit and reopen Cursor
- Check the model name spelling (all lowercase, e.g. \`deepseek-v3\`, not \`DeepSeek-V3\`)

### Q: Code completion is slow?

Code completion is latency-sensitive. Recommendations:

- Use a fast model: \`deepseek-v3\`
- Avoid using reasoning models (\`deepseek-r1\`) for completion
- Continue users can configure a fast model separately in \`tabAutocompleteModel\`

### Q: The model returns \`model_not_found\` in chat?

The model is not enabled on your LingyiYun account. Contact the admin to enable it, or switch to an available model.

### Q: Can multiple tools share the same Key?

Yes, but keep in mind:

- All tools share the Key's quota; watch your usage
- Concurrent requests share the Key's rate limits
- It is recommended to use separate Keys for different tools for easier management and monitoring

### Q: Can I configure other services and LingyiYun at the same time?

**Cursor**: Does not support configuring two endpoints simultaneously; the later configuration overrides the previous one. If you need both, consider managing them via Continue or other tools.

**Continue**: Yes. Add configurations with different \`apiBase\` values in the \`models\` array.

### Q: @Docs can't reference content after configuration?

- Make sure the documentation URL is publicly accessible
- Try opening the configured URL in a browser to confirm the page works
- If it is an internal documentation site, Cursor may not be able to crawl it

### Q: Continue's Embedding index reports an error?

Make sure the \`embeddingsProvider\` configuration is correct:

\`\`\`json
{
  "provider": "openai",
  "model": "text-embedding-3-large",
  "apiBase": "{{BASE_URL}}/v1",
  "apiKey": "sk-your-key"
}
\`\`\`
If it still fails, check that the Key has permission for the Embedding interface.

## Quick Configuration Reference

The core configuration for all tools is just two items:

| Setting | Value |
|---|---|
| **Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |

Configuration entry points for each tool:

| Tool | Entry Point | Notes |
|---|---|---|
| Cursor | Settings → Models → API Key | Fill in Base URL + Key |
| Windsurf | Settings → AI Provider | Select Compatible |
| Continue | \`~/.continue/config.json\` | Edit the config file |
| JetBrains | Settings → Tools → AI Assistant | Select Custom Provider |
| ChatBox | Settings → API | Fill in URL + Key |
| LobeChat | Settings → Model Service | Fill in proxy URL + Key |
| NextChat | Settings → API | Fill in URL + Key |
| Open WebUI | Settings → API | Fill in API URL + Key |`,
  },
  {
    id: 'api-quick-start',
    title: 'Quick Start',
    category: 'Integration Guide',
    content: `# Quick Start

Minimal example (cURL):

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}]
  }'
\`\`\`

**Key point**: only change \`base_url\` and \`api_key\`; everything else is identical to the official OpenAI SDK.

### Supported Interfaces Overview

| Interface | Method | Path | Description |
|---|---|---|---|
| List models | GET | \`/v1/models\` | View available models |
| Chat completions | POST | \`/v1/chat/completions\` | Chat interface, supports streaming |
| Responses | POST | \`/v1/responses\` | OpenAI Responses API, supports streaming |
| Embeddings | POST | \`/v1/embeddings\` | Embedding interface |
| Image generation | POST | \`/v1/images/generations\` | Text-to-image |
| Text-to-speech | POST | \`/v1/audio/speech\` | TTS, returns an audio stream |
| Speech-to-text | POST | \`/v1/audio/transcriptions\` | STT, upload an audio file |
| Speech translation | POST | \`/v1/audio/translations\` | Translates audio into English |
| Video generation | POST | \`/v1/video/generations\` | Text-to-video / image-to-video |
| Content moderation | POST | \`/v1/moderations\` | Text/image-text safety moderation |
| Rerank | POST | \`/v1/rerank\` | Document relevance ranking |`,
  },
  {
    id: 'get-api-key',
    title: 'Get an API Key',
    category: 'Integration Guide',
    content: `# Get an API Key

1. Log in to the LingyiYun admin console
2. Go to the API Key page
3. Click "Create API Key" and fill in the name and quota
4. After creation, copy the key that starts with \`sk-\`

**Note**: The Key is only displayed once at creation time, so save it immediately. If you lose it, you will need to delete it and create a new one.

### Key Format

\`\`\`
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`
It starts with \`sk-\` followed by a string of random characters. When calling, put it in the \`Authorization\` field of the HTTP header.`,
  },
  {
    id: 'auth',
    title: 'Authentication',
    category: 'Integration Guide',
    content: `# Authentication

LingyiYun uses **Bearer Token** authentication; all interfaces require it.

### Header Format

\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

### cURL Example

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### SDK Configuration

\`\`\`python
# Python
client = OpenAI(api_key="sk-your-api-key", base_url="{{BASE_URL}}/v1")
\`\`\`

\`\`\`javascript
// Node.js
const client = new OpenAI({ apiKey: "sk-your-api-key", baseURL: "{{BASE_URL}}/v1" });
\`\`\`

### What an Authentication Failure Looks Like

Returns HTTP status code \`401\`

Response body:

\`\`\`json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

Common causes:

- The Key is misspelled or missing the \`sk-\` prefix
- The Key has been deleted or disabled
- The header format is wrong (there should be only one space between \`Bearer\` and \`sk-\`)`,
  },
  {
    id: 'request-url',
    title: 'Request URL',
    category: 'Integration Guide',
    content: `# Request URL

### Base URL

\`\`\`
{{BASE_URL}}
\`\`\`

### Full URL Rule

\`\`\`
{Base URL}{接口路径}
\`\`\`

Examples:

| Interface | Full URL |
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

### Setting the Base URL in an SDK

Just set \`base_url\` to \`{{BASE_URL}}/v1\` (make sure it ends with \`/v1\`); the SDK will append the rest of the path automatically.`,
  },
  {
    id: 'error-codes',
    title: 'Error Codes',
    category: 'Integration Guide',
    content: `# Error Codes

### HTTP Status Codes

| Status Code | Meaning | Recommended Action |
|---|---|---|
| 200 | Success | Process the response normally |
| 400 | Invalid request parameters | Check the request body format and required parameters |
| 401 | Authentication failed | Check whether the API Key is correct |
| 402 | Insufficient quota | Recharge or switch to a Key with remaining quota |
| 403 | No permission | The Key is not allowed to access this model or interface |
| 404 | Interface not found | Check whether the request path is correct |
| 429 | Request rate exceeded | Lower the request rate, or contact the admin to raise the limit |
| 500 | Internal server error | Retry later; contact operations if it persists |
| 502 | Bad gateway | Upstream service error; retry later |
| 503 | Service unavailable | The service is temporarily overloaded; retry later |

### Error Response Format

All errors follow a unified format:

\`\`\`json
{
  "error": {
    "message": "具体错误描述",
    "type": "错误类型",
    "code": "错误码"
  }
}
\`\`\`

### Common Error Codes

| code | Meaning | Trigger Scenario |
|---|---|---|
| \`invalid_api_key\` | Invalid API Key | The Key is misspelled, deleted, or disabled |
| \`insufficient_quota\` | Insufficient quota | The Key's balance is used up |
| \`model_not_found\` | Model not found | A nonexistent model parameter was passed |
| \`context_length_exceeded\` | Input too long | The total length of messages exceeds the model's context window |
| \`rate_limit_exceeded\` | Rate limit exceeded | Too many requests in a short period |
| \`invalid_request_error\` | Invalid request format | Missing required parameters, wrong types, etc. |
| \`server_error\` | Server error | Internal exception; usually recoverable by retrying |

### Retry Recommendations

**429 / 500 / 502 / 503**: Retryable; exponential backoff is recommended (1s → 2s → 4s → 8s)

**400 / 401 / 402 / 403 / 404**: Do not retry; fix the request first

Retry the same request at most 3 times`,
  },
  {
    id: 'streaming',
    title: 'Streaming',
    category: 'Integration Guide',
    content: `# Streaming

Streaming is used by the Chat and Responses interfaces to return content chunk by chunk for a better user experience (no need to wait for the full generation before displaying).

### Enabling Streaming

Set \`stream: true\` in the request body:

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "写一首诗"}],
  "stream": true
}
\`\`\`

### Response Format (SSE)

Streaming responses use the **Server-Sent Events (SSE)** protocol, with Content-Type \`text/event-stream\`.

Each data chunk has the following format:

\`\`\`
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

**Key points:**

- Each piece of data starts with \`data: \` followed by JSON
- The last one is \`data: [DONE]\`, which marks the end of the stream
- Each chunk's \`delta.content\` is the newly added text fragment; concatenating them gives the full reply
- A \`finish_reason\` of \`stop\` means normal completion

### Streaming via cURL

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

### Streaming with the Python SDK

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

### Streaming with the Node.js SDK

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

### Usage Information in Streaming

Streaming responses do **not include** usage (token usage) by default. If you need it, set \`stream_options\`:

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true,
  "stream_options": {"include_usage": true}
}
\`\`\`

After that, the final chunk will include the full usage field:

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
\`\`\`

### Streaming for the Responses Interface

The Responses API also supports \`stream: true\`; the format is similar to Chat, also using the SSE protocol and ending with \`data: [DONE]\`.

### Notes for Parsing SSE Yourself

If you parse the SSE stream yourself instead of using an SDK, note the following:

1. **Read line by line**: each piece of data takes one line and starts with \`data: \`
2. **Skip blank lines**: blank lines are event separators in the SSE protocol and do not affect the data
3. **Detect the end**: stop reading when you see \`data: [DONE]\`
4. **Handle disconnects**: you can retry after a network interruption, but the stream cannot be resumed from where it left off; you need to start a new request
5. **Set a timeout**: it is recommended to set the HTTP client timeout to 60 seconds or more, as long-text generation can take a while

### Streaming vs Non-Streaming Comparison

| Dimension | Non-Streaming (\`stream: false\`) | Streaming (\`stream: true\`) |
|---|---|---|
| Response | Returns the full result at once | Returns text fragments chunk by chunk |
| User perception | Longer wait | Text appears word by word, feels faster |
| Response format | \`chat.completion\` | \`chat.completion.chunk\` |
| Usage | Included by default | Requires \`stream_options\` |
| Use cases | Backend batch processing, API chaining | Frontend chat, real-time interaction |
| Parsing difficulty | Simple, read the JSON directly | Requires SSE parsing |`,
  },
  {
    id: 'chat-completions',
    title: 'Chat Completions',
    category: 'API Reference',
    content: `# Chat Completions

> **POST** \`/v1/chat/completions\`

Creates a chat completion. Supports both streaming (SSE) and non-streaming modes.

- Non-streaming: set \`stream: false\` (default), returns the full response
- Streaming: set \`stream: true\`, returns ChatCompletionChunk chunks via SSE

## Request Parameters

### Header Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`Authorization\` | string | Yes | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | No | Unique request identifier for tracing |
| \`X-Tenant-Id\` | string | No | Tenant identifier for isolation in multi-tenant scenarios |
| \`X-Channel\` | enum | No | Calling channel identifier (web/app/api/miniapp), defaults to api |

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | Yes | Model ID, e.g. \`deepseek-v3\` |
| \`messages\` | array | Yes | List of conversation messages |
| \`temperature\` | number | No | Sampling temperature, 0~2, default 0.7 |
| \`top_p\` | number | No | Nucleus sampling probability, 0~1, default 1 |
| \`max_tokens\` | integer | No | Maximum number of tokens to generate |
| \`stream\` | boolean | No | Whether to stream output, default false |
| \`stream_options\` | object | No | Streaming options, e.g. \`{"include_usage": true}\` |
| \`tools\` | array | No | List of callable tools |
| \`tool_choice\` | string/object | No | Tool selection strategy (none/auto/required) |
| \`response_format\` | object | No | Response format, e.g. \`{"type": "json_object"}\` |
| \`stop\` | string/array | No | Stop sequences |
| \`presence_penalty\` | number | No | Presence penalty, default 0 |
| \`frequency_penalty\` | number | No | Frequency penalty, default 0 |
| \`n\` | integer | No | Number of candidates to generate, default 1 |
| \`user\` | string | No | User identifier |

### Request Example

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

### cURL Example

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

## Response

### 200 Success

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

### 401 Authentication Failed`,
  },
  {
    id: 'models',
    title: 'List Available Models',
    category: 'API Reference',
    content: `# List Available Models

> **GET** \`/v1/models\`

Returns the list of currently available models

## Request Parameters

### Header Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`Authorization\` | string | Yes | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | No | Unique request identifier |
| \`X-Tenant-Id\` | string | No | Tenant identifier |
| \`X-Channel\` | enum | No | Calling channel identifier, defaults to api |

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/models' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Response

### 200 Success

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
    category: 'API Reference',
    content: `# Responses API

> **POST** \`/v1/responses\`

The OpenAI Responses API. Supports text input and message arrays, and returns a structured Response object containing output messages and usage.

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | Yes | Model ID, e.g. \`qwen-plus\` |
| \`input\` | string/array | Yes | Input content; accepts a string or an array of messages |
| \`instructions\` | string | No | System instructions |
| \`temperature\` | number | No | Sampling temperature |
| \`max_output_tokens\` | integer | No | Maximum number of output tokens |
| \`stream\` | boolean | No | Whether to stream output, default false |
| \`tools\` | array | No | List of callable tools |
| \`user\` | string | No | User identifier |

### Request Example

\`\`\`json
{
    "model": "qwen-plus",
    "input": "介绍北京"
}
\`\`\`

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/responses' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "qwen-plus",
    "input": "介绍北京"
}'
\`\`\`

## Response

### 200 Success

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
    title: 'Embeddings',
    category: 'API Reference',
    content: `# Embeddings

> **POST** \`/v1/embeddings\`

Converts text into vector representations; supports batch input

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | Yes | Model ID, e.g. \`text-embedding-3-large\` |
| \`input\` | string/array | Yes | Input text; accepts a single string or an array |
| \`encoding_format\` | enum | No | Encoding format (float/base64), default float |
| \`dimensions\` | integer | No | Vector dimensions (only supported by the text-embedding-3 family) |

### Request Example

\`\`\`json
{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}
\`\`\`

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/embeddings' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}'
\`\`\`

## Response

### 200 Success

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
    title: 'Generate Images',
    category: 'API Reference',
    content: `# Generate Images

> **POST** \`/v1/images/generations\`

Generates an image based on a text prompt.

**Size reference:**

| Model | Supported Sizes |
|---|---|
| wanx-v2 | 1024x1024 / 720x1280 / 1280x720 / auto |
| cogview-4 | 1024x1024 / 768x1344 / 1344x768 |
| cogview-3-plus | 1024x1024 / 768x1344 / 1344x768 |

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | Yes | Image generation model (wanx-v2 / cogview-4 / cogview-3-plus) |
| \`prompt\` | string | Yes | Text describing the image |
| \`n\` | integer | No | Number of images to generate (1~10; cogview-3-plus only supports 1) |
| \`size\` | string | No | Image size |
| \`quality\` | enum | No | Image quality (low/medium/high/auto) |
| \`background\` | enum | No | Background transparency (transparent/opaque/auto), wanx-v2 only |
| \`moderation\` | enum | No | Content moderation level (low/auto), wanx-v2 only |
| \`response_format\` | enum | No | Return format (url/b64_json), default url |
| \`style\` | enum | No | Image style (vivid/natural), cogview-3-plus only |
| \`user\` | string | No | User identifier |

### Request Example

\`\`\`json
{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}
\`\`\`

### cURL Example

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

## Response

### 200 Success

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
    title: 'Text-to-Speech (TTS)',
    category: 'API Reference',
    content: `# Text-to-Speech (TTS)

> **POST** \`/v1/audio/speech\`

Synthesizes text into speech and returns an audio stream

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | Yes | TTS model ID, e.g. \`cosyvoice-v2\` |
| \`voice\` | enum | Yes | Voice timbre |
| \`input\` | string | Yes | Text to synthesize |
| \`response_format\` | enum | No | Output audio format (mp3/opus/aac/flac/wav/pcm), default mp3 |
| \`speed\` | number | No | Speech rate (0.25~4), default 1 |
| \`instructions\` | string | No | Voice style instructions (cosyvoice-v2 only) |

### Request Example

\`\`\`json
{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}
\`\`\`

### cURL Example

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

## Response

### 200 Success

Returns an audio stream (binary), Content-Type: audio/mpeg`,
  },
  {
    id: 'stt',
    title: 'Speech-to-Text (STT)',
    category: 'API Reference',
    content: `# Speech-to-Text (STT)

> **POST** \`/v1/audio/transcriptions\`

Transcribes an audio file into text

## Request Parameters

### Body Parameters (multipart/form-data)

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`file\` | file | Yes | Audio file |
| \`model\` | string | Yes | Speech recognition model, e.g. \`sensevoice-v1\` |
| \`language\` | string | No | Audio language (ISO 639-1, e.g. zh, en) |
| \`response_format\` | enum | No | Output format (json/text/srt/verbose_json/vtt), default json |
| \`temperature\` | number | No | Sampling temperature |

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/transcriptions' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'language="zh"' \\
--form 'response_format="json"'
\`\`\`

## Response

### 200 Success

\`\`\`json
{
    "text": "你好，欢迎使用语音识别服务。"
}
\`\`\``,
  },
  {
    id: 'translation',
    title: 'Speech Translation',
    category: 'API Reference',
    content: `# Speech Translation

> **POST** \`/v1/audio/translations\`

Translates an audio file into English text

## Request Parameters

### Body Parameters (multipart/form-data)

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`file\` | file | Yes | Audio file |
| \`model\` | string | Yes | Speech translation model, e.g. \`sensevoice-v1\` |
| \`response_format\` | enum | No | Output format (json/text/srt/verbose_json/vtt), default json |
| \`temperature\` | number | No | Sampling temperature |

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/translations' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'response_format="json"'
\`\`\`

## Response

### 200 Success

\`\`\`json
{
    "text": "Hello, welcome to the speech translation service."
}
\`\`\``,
  },
  {
    id: 'video',
    title: 'Generate Video',
    category: 'API Reference',
    content: `# Generate Video

> **POST** \`/v1/video/generations\`

Generates videos based on text prompts. Supports both pure text-to-video and image-to-video modes, and is compatible with the Doubao Seedance (Sendance) video generation protocol.

- Text-to-video: provide only the prompt
- Image-to-video: provide prompt + image_url (Seedance supports multiple images: first_frame / last_frame / reference_image)

## Supported Models

### Seedance Series

| Model | Description |
|---|---|
| \`doubao-seedance-1-0-pro-250528\` | 1.0 Pro, high-quality video generation |
| \`doubao-seedance-1-0-lite-t2v\` | 1.0 Lite, text-to-video |
| \`doubao-seedance-1-0-lite-i2v\` | 1.0 Lite, image-to-video |
| \`doubao-seedance-1-5-pro-251215\` | 1.5 Pro, enhanced performance |
| \`doubao-seedance-2-0-260128\` | 2.0 standard |
| \`doubao-seedance-2-0-fast-260128\` | 2.0 fast, low latency |
| \`doubao-seedance-2-0-mini-260615\` | 2.0 Mini, lightweight and low cost |
| \`doubao-seedance-2-5-260628\` | 2.5 latest, up to 30s, 21:9, multimodal refs (30 images + 10 videos + 10 audio) |

### Other Models

\`kling-v1\` / \`kling-v2\` / \`cogvideox-2\` / \`vidu-1\` / \`jimeng\` / \`sora\`

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | Yes | Video generation model (Seedance series recommended) |
| \`prompt\` | string | Yes | Video description text |
| \`image_url\` | string | No | Reference image URL (image-to-video mode) |
| \`images\` | array | No | Multiple image inputs (Seedance image-to-video; mapped in order to first_frame / last_frame / reference_image) |
| \`resolution\` | string | No | Output resolution (Seedance: 480p / 720p / 1080p / 4k) |
| \`ratio\` | string | No | Aspect ratio (Seedance 2.5: 21:9 / 16:9 / 4:3 / 1:1 / 3:4 / 9:16; others: 16:9 / 9:16 / 1:1) |
| \`size\` | string | No | Video size, e.g. 1280x720 |
| \`duration\` | integer | No | Video duration (seconds). Seedance 2.5: 4–30, 2.0 series: 4–15, 1.5: 4–12, 1.0: 2–12 |
| \`n\` | integer | No | Number of videos to generate, default 1 |
| \`metadata\` | object | No | Extended parameters; supports multimodal input (video_url / audio_url) and negative_prompt, style, watermark, etc. |

### Request Example (Text-to-Video)

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "Astronaut walking on the moon",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}
\`\`\`

### Request Example (Image-to-Video)

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "Add fireworks on top of the first frame",
    "images": [
        "https://example.com/first-frame.jpg",
        "https://example.com/last-frame.jpg"
    ]
}
\`\`\`

### Request Example (Video Continuation / Multimodal)

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "Make the person in the video turn to look at the camera",
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

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/video/generations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "Astronaut walking on the moon",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}'
\`\`\`

## Response

### 200 Success (Task Submitted)

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

## Query Task Status

> **GET** \`/v1/video/generations/{task_id}\`

After submitting a task, poll this endpoint to get generation progress and the final result.

### Task Status

| Status | Description |
|---|---|
| \`QUEUED\` | Queued, waiting to start |
| \`IN_PROGRESS\` | Generating; progress shows current progress |
| \`SUCCESS\` | Completed; result_url is the video URL |
| \`FAILURE\` | Failed; fail_reason indicates the cause |

### Response Example (Completed)

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

> **Note**: Seedance 2.0 / 2.5 supports multimodal input (video + audio + images), which can be passed via \`metadata.content\`; Seedance 2.5 supports up to 30 images, 10 videos, and 10 audio references per task, with single-pass generation up to 30 seconds and multi-round extensions. After submitting a task, poll the task status via \`GET /v1/video/generations/{task_id}\`.`,
  },
  {
    id: 'asset-library',
    title: 'Asset Library',
    category: 'API Reference',
    content: `# Asset Library

The Asset Library is used to manage the multimodal assets required for video generation. Customers can upload image / video / audio assets via the external API, and then reference these assets by URL as multimodal input for Seedance (Sendance) when calling the video generation interface (\`/v1/video/generations\`).

## Interface List

| Method | Path | Description |
|---|---|---|
| \`POST\` | \`/api/asset\` | Upload an asset |
| \`GET\` | \`/api/asset\` | Get the asset list (paginated) |
| \`GET\` | \`/api/asset/search\` | Search assets |
| \`GET\` | \`/api/asset/{id}\` | Get asset details |
| \`DELETE\` | \`/api/asset/{id}\` | Delete an asset |

All Asset Library interfaces require \`Authorization: Bearer <token>\` (platform user token). Regular users can only access their own assets; admins can view / manage all assets.

## Upload an Asset

> **POST** \`/api/asset\`

Uploads an asset file using \`multipart/form-data\`.

### Request Parameters

| Field | Type | Required | Description |
|---|---|---|---|
| \`file\` | file | Yes | Asset file |
| \`group_id\` | integer | Yes | Asset group ID (asset must belong to a group) |
| \`model\` | string | Yes | Generation model identifier, e.g. \`sendance-2.0\` / \`sendance-2.5\` |
| \`channel_id\` | integer | No | Upstream channel ID (defaults to the group's channel) |

### File Size Limits (aligned with Volcano Engine Seedance)

| Type | Size Limit |
|---|---|
| Image | 30MB |
| Video | 200MB |
| Audio | 15MB |

The asset type is automatically detected from the file's MIME type: \`image/*\` → image, \`video/*\` → video, \`audio/*\` → audio; other types are rejected.

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@/path/to/video.mp4' \\
--form 'group_id=1' \\
--form 'model=sendance-2.0'
\`\`\`

### Example Response

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

> The \`url\` field returned after a successful upload is the asset access URL and can be used directly in the video generation interface.

## Get the Asset List

> **GET** \`/api/asset\`

Gets the asset list with pagination; supports filtering by type and model.

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| \`type\` | string | Asset type (image / video / audio) |
| \`model\` | string | Generation model identifier (e.g. \`sendance-2.0\`) |
| \`page\` | integer | Page number, default 0 |
| \`page_size\` | integer | Items per page, default 10 |
| \`user_id\` | integer | User ID (admins only) |
| \`tenant_id\` | integer | Tenant ID (admins only) |

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset?type=video&model=sendance-2.0&page=0&page_size=20' \\
--header 'Authorization: Bearer <token>'
\`\`\`

### Example Response

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

## Search Assets

> **GET** \`/api/asset/search\`

Searches assets by keyword. The parameters are the same as for getting the asset list, with the addition of:

| Parameter | Type | Description |
|---|---|---|
| \`keyword\` | string | Search keyword (matches asset names) |

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/search?keyword=开场' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Get Asset Details

> **GET** \`/api/asset/{id}\`

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Delete an Asset

> **DELETE** \`/api/asset/{id}\`

Only the asset owner or an admin can delete an asset.

\`\`\`bash
curl --location --request DELETE '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Using Assets for Seedance Video Generation

After uploading assets, use the returned \`url\` as multimodal input for the video generation interface:

> **Note**: When submitting a video generation task, the platform automatically reads **image** assets from the Asset Library and converts them to Base64 encoding (\`data:image/...;base64,...\`) before submitting them to upstream Volcano Ark, so you do not need to prepare publicly accessible static URLs in advance. Public URLs hosted by customers that do not exist in the Asset Library, Base64 encodings, and \`asset://\` asset IDs are passed through as-is. **Video/audio** assets only support public URL input; please use public URLs outside the Asset Library (e.g. image hosting services, object storage CDN). A single image should be no larger than 25MB.

### Image-to-Video (Reference Image)

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

### Video Continuation / Audio Input

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

> **Tip**: \`metadata.content\` supports four types: \`text\` / \`image_url\` / \`video_url\` / \`audio_url\`. For \`image_url\`, the \`role\` field can specify \`first_frame\` / \`last_frame\` / \`reference_image\`.`,
  },
  {
    id: 'moderation',
    title: 'Content Moderation',
    category: 'API Reference',
    content: `# Content Moderation

> **POST** \`/v1/moderations\`

Detects whether text or image-text content violates safety policies

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | No | Moderation model, e.g. \`content-moderation-latest\` |
| \`input\` | string/array | Yes | Content to moderate (text, or an array of text + images) |

### Request Example

\`\`\`json
{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}
\`\`\`

### cURL Example

\`\`\`bash
curl --location '{{BASE_URL}}/v1/moderations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}'
\`\`\`

## Response

### 200 Success

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
    title: 'Rerank',
    category: 'API Reference',
    content: `# Rerank

> **POST** \`/v1/rerank\`

Reranks a list of documents by relevance to the query text

## Request Parameters

### Body Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| \`model\` | string | No | Rerank model, e.g. \`bge-rerank-v3\` |
| \`query\` | string | Yes | Query text |
| \`documents\` | array | Yes | List of documents to rerank |
| \`top_n\` | integer | No | Return the top N results |
| \`return_documents\` | boolean | No | Whether to return the original documents, default true |

### Request Example

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

### cURL Example

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

## Response

### 200 Success

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
    title: 'FAQ',
    category: 'Platform',
    content: `# FAQ

### General Questions

**Q: What's the difference between LingyiYun and the official OpenAI?**

A: LingyiYun is a gateway compatible with the OpenAI format, with additional support for domestic models (DeepSeek/Qwen/GLM, etc.) and more flexible pricing. The API format is fully compatible, so the OpenAI SDK works directly.

**Q: Which programming languages are supported?**

A: Any language that supports HTTP can call the API. Python and Node.js have official SDKs for the most convenience; other languages (Go/Java/PHP/Rust) can use HTTP clients to make requests directly.

**Q: Can I try it for free?**

A: Contact the admin to get a test Key, which usually comes with an initial quota.

### Calling Issues

**Q: What should I do when I get \`context_length_exceeded\`?**

A: The input is too long. Trim the messages, or switch to a model with a larger context window (e.g. gpt-4.1 supports 1M).

**Q: What should I do when I get \`model_not_found\`?**

A: The model parameter is incorrect. Call \`GET /v1/models\` to view the list of available models; mind the case.

**Q: What should I do if the stream is interrupted?**

A: A network issue caused the SSE connection to drop; it cannot be resumed, so you need to start a new request. It is recommended to implement concatenation logic in the client and re-request after the stream breaks.

**Q: Why is the reply truncated?**

A: \`max_tokens\` may be set too low, or the model output reached its limit. Check \`finish_reason\`; if it is \`length\`, the output was truncated, so increase \`max_tokens\`.

**Q: What if the quality of Chinese replies is poor?**

A: Try explicitly asking "answer in Chinese" in the system message, or use a model with stronger Chinese capability (DeepSeek/Qwen/GLM).

### Billing Questions

**Q: How many tokens does one request consume?**

A: Check the \`usage\` field in the response. The total of input + output tokens is the amount consumed.

**Q: How is token usage counted for streaming requests?**

A: Set \`stream_options: {"include_usage": true}\` and the last chunk will include usage. Non-streaming requests return usage by default.

**Q: Is billing the same as the official OpenAI?**

A: The billing logic is the same (per token), but the multipliers differ; LingyiYun's domestic models are cheaper. See the console configuration for the exact multipliers.

### Feature Questions

**Q: Is Function Calling supported?**

A: Yes. Models such as DeepSeek / GPT / Claude all support it, and the usage is identical to OpenAI.

**Q: Is image input (Vision) supported?**

A: Yes. Use multimodal models such as gpt-4o / claude-sonnet-4 and pass image URLs or Base64 in content.

**Q: Is JSON output supported?**

A: Yes. Set \`response_format: {"type": "json_object"}\`.

**Q: Can I fine-tune models?**

A: Not yet. You can directly use the pre-trained models provided by the platform and achieve customization through prompt engineering and few-shot.

**Q: How long does video generation take?**

A: Usually 30 seconds to a few minutes, depending on the model and video length.

### Deployment Questions

**Q: How do I configure cross-origin (CORS)?**

A: Calling the API directly from the frontend can cause cross-origin issues. It is recommended to go through a backend proxy, or contact the admin to configure the CORS allowlist.

**Q: Can I call the API from an internal network?**

A: LingyiYun is deployed on the public internet, so the internal network needs outbound access. If it is fully isolated, a private deployment is required.

**Q: Is private deployment supported?**

A: Contact sales; private deployment to a customer's data center is supported.

**Q: How do I view API call logs?**

A: Admin console → Logs page; you can filter by Key / model / time.`,
  },
  {
    id: 'terms',
    title: 'Platform Agreement',
    category: 'Platform',
    content: `# Platform Agreement

This is an agreement ("Agreement") between you ("an individual or organization that has registered as a user on the Platform and uses our services, and undertakes to comply with our various agreements, privacy policy and other terms of service") and Beijing Chuangshi Huacai Technology Co., Ltd. and its affiliates ("**Huacai**" or "we").

You acknowledge that, before using or purchasing our LingyiYun products or services, you have fully read, understood and accepted all the terms of this Agreement. Once you actually start using the services on this Platform or complete the purchase process, you are deemed to have read and agreed to comply with this Agreement. We have the right to amend the terms of this Agreement when necessary, and you can view the latest version of the Agreement on this page. If you continue to use the services on this Platform after the terms of this Agreement are amended, you will be deemed to have accepted the amended Agreement. **For details on the data and personal information collection and use policies of this Platform, please refer to the Privacy Policy.**

You warrant that you have full legal capacity as prescribed by law, that you are a natural person capable of independently bearing civil liability, or a person with full capacity authorized by a legal entity to act on its behalf; if you are under the age of eighteen, you will not be able to complete real-name verification or use the services of this Platform even if you have registered. You undertake and confirm that the content of this Agreement does not violate the laws of the country or region in which you are located.

## 1. Account Management

### 1.1 Account and Real-Name Verification

1.1.1. After you fill in the relevant information as required by this Platform and confirm your agreement to comply with this Agreement and all the terms of the "Privacy Policy", we will create an account for you. You acknowledge and agree that some or all of the features of this Platform can only be activated after your account passes real-name verification, and we have the right to modify and maintain the services and features of this Platform from time to time based on our own judgment and business development.

1.1.2. If you access and use this Platform on behalf of an enterprise, legal person, unincorporated organization or other entity, you must complete enterprise verification for the account. The verified enterprise shall be responsible for all usage, recharge, information provision and other activities conducted through the account and its associated users, and may not refuse to bear responsibility on grounds such as account lending or employee departure.

1.1.3. If you connect to or access this Service through a third party, you acknowledge and permit that third-party service to use or store your user information, access tokens, related account information and authentication credentials, and other data.

1.1.4. You are responsible for protecting the accounts you create, join or manage, as well as your user identity, and you must not disclose any login credentials you use to log in to anyone. This Platform shall not be liable if an account is lost because you voluntarily disclosed it or because you were attacked or defrauded by others.

1.1.5. The account name and user nickname you set must not violate national laws and regulations, public order, good customs or social morality, and must not cause confusion between your identity and that of this Platform.

1.1.6. The same user may create only one personal account. Your personal account is for your own use only. Unless otherwise agreed by both parties, you may not gift, lend, rent, transfer, sell or otherwise allow any third party to use your personal account in any form.

1.1.7. The same user may create multiple organization accounts. If you allow other users to use your organization account jointly, you will bear full responsibility for the consequences and liabilities of all activities conducted by the corresponding users under that organization account.

### 1.2 Changes, Suspension and Termination

We may change, suspend or terminate the services provided to you, or impose restrictions on the use of the services, without any liability, provided that we have made our best efforts to notify you in advance through one or more of the following methods: SMS, email, or announcements on this Platform. We may deactivate your account at any time. Even if your account is terminated for any reason, you remain bound by this Agreement.

## 2. Service Access and Service Restrictions

### 2.1 Access to the Service

Subject to your compliance with this Agreement, we hereby grant you a non-exclusive and non-transferable right, solely for your personal use or for the internal business purposes of the enterprise or other entity you represent.

### 2.2 Service Restrictions

You must not:
- Disassemble, reverse engineer, decode or decompile any part of the Service
- Purchase, sell or transfer API keys without our prior written consent
- Copy, rent, sell, lend, transfer, license, or attempt to sublicense, resell, distribute or modify any part of the Service
- Take any action that may place an excessive burden on our servers, infrastructure, etc.
- Use the Service for illegal, infringing, fraudulent or other prohibited purposes
- Circumvent any measures we may take to block or restrict access to the Service
- Attempt to interfere with or disrupt the system integrity or security of the servers running the Service
- Use this Service to send spam, chain letters or other unsolicited emails
- Transmit illegal data, viruses or other malware through this Service
- Impersonate another person or entity, or misrepresent your relationship with another person or entity
- Collect or obtain any personal information from this Service

## 3. Interaction Data

3.1 This Service may allow users to input, provide feedback on, modify, process, store, upload, download and distribute related data through large models and third-party websites, software, applications or services while using the Platform services.

3.2 If interaction data is found to violate any law, regulation or the provisions of this Agreement, we have the right to delete such interaction data or stop providing technical services.

3.3 As an independent technical support provider, this Platform does not hold any intellectual property rights in any interaction data generated by your use of the Platform services. You shall bear all interaction data, obligations and liabilities arising from your use of the Platform services.

3.4 Disclaimer: We are not responsible for any interaction data. You are solely responsible for the interaction data you input, provide feedback on, correct, process, store, upload, download and distribute in the Platform services.

3.5 We will add corresponding identifiers to synthetic content generated by artificial intelligence in accordance with relevant laws and regulations. You must not maliciously delete, tamper with, forge or conceal such identifiers.

## 4. Intellectual Property

### 4.1 LingyiYun's Intellectual Property

All intellectual property rights in the content we provide in the Platform services belong to us from the outset. You must not access, sell, license, rent, modify, distribute, copy, transmit, display, publish, adapt or create derivative works of any such intellectual property.

### 4.2 Outputs

Provided that you comply with the relevant regulations and applicable laws, you may use the results generated by the Platform services in the manner required by law.

### 4.3 User Usage Data

We may collect information related to diagnostics, technology and usage to improve our products and services.

### 4.4 Feedback

If you provide us with any suggestions or feedback regarding this Service, you hereby assign to us all rights and interests in such feedback.

## 5. Confidential Information

This Service may contain non-public, proprietary or confidential information of LingyiYun and other users. You will protect the privacy of all confidential information, and will not use it for any purpose other than exercising your rights under this Agreement, nor disclose it to any individual or entity.

## 6. Billing Policy and Taxes

6.1 Certain services provided by this Platform may require payment of usage fees. By choosing to use this Service, you agree to the pricing and payment terms applicable to you as described on this Platform.

6.2 Due to the special nature of "service first, billing later", our products and services usually operate on a "pay after use" model. Please ensure that your account has sufficient balance; otherwise, arrears may be incurred.

6.3 The pricing, billing and payment terms for all products and services on this Platform are incorporated into this Agreement by reference.

6.4 If any government-imposed taxes apply, you shall be responsible for paying all taxes related to your use/activation of the Service.

## 7. Export Controls and Sanctions

You undertake to comply with the export control and sanctions laws and regulations of the People's Republic of China. You undertake not to use the products or services provided by this Platform for military or weapons of mass destruction-related purposes.

## 8. Privacy and Data Security

### 8.1 Privacy

We will always comply with the Personal Information Protection Law of the People's Republic of China and other applicable laws.

### 8.2 Data Security

We attach great importance to the integrity and security of your personal information. However, we cannot guarantee that unauthorized third parties will never be able to breach our security protections.

## 9. Use of Third-Party Services

This Service may contain links to third-party websites, materials and services that are not owned or controlled by us. We do not endorse any third-party services and assume no responsibility for them.

## 10. Indemnification

You shall defend, indemnify and hold harmless us and our affiliates and their respective agents, suppliers, licensors, employees, contractors, officers and directors from and against any claims, damages, obligations, losses, liabilities, costs and expenses arising from your access to and use of this Service, your breach of this Agreement, or your infringement of any third-party rights.`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    category: 'Platform',
    content: `# Privacy Policy

Welcome to the high-value GenAI open platform of Beijing Chuangshi Huacai Technology Co., Ltd. and its affiliates (hereinafter referred to as "Huacai" or "we"). We attach great importance to the protection of user (hereinafter referred to as "you") information. When you register, log in and use this Platform, we will collect and store the necessary user information required for your registration and normal use of the Platform's features. We will not collect or store interaction data between you and open-source models, third-party websites, software, applications or services while using this Platform.

## Overview

This Privacy Policy will help you understand:

1. How we collect and use your user information
2. How we use cookies and similar technologies
3. How we store your user information
4. How we share, transfer and publicly disclose your information
5. How we protect the security of your information
6. How we manage your user information
7. Terms for minors
8. Revision and notification of the Privacy Policy
9. Scope of application

## 1. How We Collect and Use Your User Information

### 1.1 We Actively Collect Your User Information

To ensure your normal use of our Platform, we will collect the user information you actively provide when using our services, including but not limited to:

**1.1.1** When you register, verify and log in to your Platform account, you can create an account using your mobile phone number. We will verify your identity by sending an SMS verification code.

**1.1.2** When you subscribe to or activate services, we are required by laws and regulations to perform real-name verification on you.

- For individual users: you may be required to provide your real identity information, including your full name, ID card number, etc.
- For enterprise users: you may be required to provide information about your organization, including its name, unified social credit code, etc.

**1.1.3** When you use this Service, we will collect necessary information to maintain the safe and stable operation of the products and services, including device information, network log information, etc.

### 1.2 We May Obtain User Information from Third Parties

In order to provide you with better, more efficient and more personalized services, our affiliates and partners may share your information with us in accordance with laws and regulations, agreements signed with you, or with your consent.

### 1.3 Business and Customer Data

Data generated or processed through the services provided by this Platform constitutes your business and customer data ("interaction data"). You have full ownership of the interaction data. As a neutral technical service provider, this Platform will not access, use or disclose your interaction data unless otherwise provided by laws and regulations.

## 2. Use of Cookies and Similar Technologies

Cookies and similar technologies are commonly used on the Internet. When you use this Platform, we may use such technologies to send cookies to your device in order to collect and store your account information, search history and login status. You can refuse or manage cookies through your browser settings.

## 3. How We Store Your User Information

### 3.1 Where Information Is Stored

We will store user information collected and generated in the course of operating this website and related services within the territory of the People's Republic of China.

### 3.2 How Long Information Is Stored

We retain your user information only for the period necessary to provide this Platform and related services. After the necessary period expires, we will delete or anonymize your information.

## 4. How We Share, Transfer and Disclose Your Information

### 4.1 Partners Involved in Data Processing

Data processing activities involving partners must have a legitimate purpose and be limited to the scope necessary to achieve that purpose. We will conduct a comprehensive assessment of partners' security capabilities and require them to comply with cooperative legal agreements.

### 4.2 Joint Processing or Entrusted Processing of User Information

Certain specific modules or features of this Platform and related services are provided by partners. We only provide them with your user information to the minimum extent necessary for providing the services, in accordance with the principles of legality, fairness, necessity and security.

### 4.3 Transfer of User Information

We will not transfer your user information to any other third party except with your explicit consent, as required by laws and regulations, or in the event of changes/mergers/acquisitions/bankruptcy liquidation of the Platform's operations.

### 4.4 Disclosure of User Information

In principle, we will not publicly disclose your user information unless we obtain your explicit consent or are required to do so by national laws and regulations.

## 5. How We Protect the Security of Your Information

We attach great importance to the security of user information and take reasonable security measures to protect your information from unauthorized access, use or disclosure.

## 6. How We Manage Your User Information

You have the right to access, correct and delete your user information. You can manage your personal information through the settings page of this Platform, or contact us for assistance.

## 7. Terms for Minors

We do not allow minors (under the age of 18) to use the Platform services. If you are a minor, please stop using our services immediately.

## 8. Revision and Notification of the Privacy Policy

We may revise this Privacy Policy from time to time. The revised Privacy Policy will be published on this page and will take effect from the date of publication.

## 9. Scope of Application

This Privacy Policy applies to all scenarios in which you use the Platform services. If you use this Platform through third-party services, you must also comply with the third parties' privacy policies.`,
  },
]
