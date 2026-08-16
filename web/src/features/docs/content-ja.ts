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

export const docCategoriesJa = [
  'はじめに',
  '導入ガイド',
  'API リファレンス',
  'プラットフォーム',
] as const

export const docPagesJa: DocPage[] = [
  {
    id: 'introduction',
    title: '製品概要',
    category: 'はじめに',
    content: `# 製品概要

LingyiYun（零一云）は、主流の AI インターフェース規格に対応した国産モデルゲートウェイプラットフォームです。

**何を解決するのか？**

| 課題 | LingyiYun の解決策 |
|---|---|
| 海外の AI サービスの国内アクセスが不安定 | 国内ノードで直接アクセス、安定・信頼性が高い |
| モデルごとに異なる API に接続する必要がある | 統一された 1 つのアドレス、標準インターフェース形式、コード変更不要 |
| 海外モデルの価格が高い | DeepSeek / Qwen などの国産モデルに対応、コストを数分の一に削減 |
| 複数モデルの管理が面倒 | 1 つの Key で全モデルを呼び出し、バックエンドでクォータを一元管理 |
| データ国外持ち出しのコンプライアンスリスク | データは国内ルートで送信、コンプライアンスを確保 |

**中核となる機能**

**標準インターフェース互換**：主流の AI インターフェース形式に対応、\`base_url\` を変更するだけでコード変更ゼロ

**全カテゴリのモデルをカバー**：Chat / Embedding / 画像 / 音声 / 動画 / 審査 / Rerank、11 インターフェース

**国産モデル優先**：DeepSeek、Qwen、GLM など主流の国産モデルをすぐに利用可能、コストパフォーマンスが高い

**複数 Key 管理**：バックエンドで複数の API キーを作成し、それぞれクォータ・権限・モデルアクセス範囲を制御

**従量課金**：Token 単位の詳細な課金、使用した分だけ課金され、最低消費額なし

**一行で接続**

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)
\`\`\`

**対応ツール：** Cursor、Windsurf、Continue、JetBrains AI、VS Code Copilot、ChatBox、LobeChat、NextChat、Open WebUI など、標準 AI API をサポートするすべてのツール。`,
  },
  {
    id: 'quick-start',
    title: 'クイックスタート',
    category: 'はじめに',
    content: `# クイックスタート

このガイドで 5 分以内に接続を完了できます。

## ステップ 1：API キーの取得

すべての接続方法で認証に API キーが必要です。

1. **LingyiYun 管理コンソール**（/dashboard）にアクセス / ログイン
2. **APIキー管理**（または「API キー」）ページで API キーを作成してコピー
3. 大切に保管し、他人に漏らさない

API キーはすべての接続方法に必要な認証情報であり、以降の設定で何度も使用します。先にキーを取得してから次の手順に進むことをおすすめします。

## ステップ 2：接続方法の選択

LingyiYun は複数のクライアントやツールでの接続に対応しています。使用習慣に合わせて適切な方法を選択してください：

| 接続方法 | 対象ユーザー | 難易度 |
|---|---|---|
| **CC Switch**（推奨） | 複数の AI ツール（Claude Code / Codex / Claude Desktop など）を管理する必要があり、GUI でのワンクリック切り替えを好む方 | 簡単 |
| Claude Code クライアント | Claude デスクトップアプリ / ターミナル版を使用するユーザー | 簡単 |
| Codex コマンドライン | ターミナル操作が好きで、OpenAI Codex を使用する開発者 | 簡単 |
| API 直接呼び出し | 自分でコードを書いて接続する開発者 | 中級 |
| AI プログラミングツール（Cursor / Windsurf など） | IDE で AI 支援プログラミングを利用するユーザー | 簡単 |

---

## 方法 1：CC Switch（推奨）

CC Switch はオープンソースの GUI ツールで、Claude Code、Claude Desktop、Codex など複数の AI ツールのプロバイダー設定を一元管理し、ワンクリックで切り替えられる最も便利な方法です。

### CC Switch のインストール（バージョン v3.16.5 以降）

**macOS ユーザー（Homebrew 推奨）：**

\`\`\`bash
brew install --cask cc-switch
\`\`\`

**その他の OS：** [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) にアクセスして対応プラットフォームのインストールパッケージをダウンロード：

- macOS：\`.dmg\` / \`.zip\`
- Windows：\`.msi\` インストール版 / Portable \`.zip\` ポータブル版
- Linux：\`.deb\` / \`.rpm\` / \`.AppImage\`

> 初回起動時に macOS の Gatekeeper にブロックされた場合は、「システム設定 → プライバシーとセキュリティ」で「それでも開く」をクリックしてください。

### LingyiYun をプロバイダーとして設定

#### Claude Desktop への接続

1. CC Switch を開き、メイン画面の上部で **Claude Desktop** タブに切り替える。
2. 右上の「オレンジのプラス」ボタンをクリックし、「新しいプロバイダーを追加」ダイアログを表示する。
3. 「プリセットプロバイダー」で「カスタム設定」を選択する。
4. 以下の情報を入力する：
   - **プロバイダー名**：例 \`LingyiYun\`
   - **API リクエスト URL**：\`{{BASE_URL}}\`
   - **API キー**：コンソールで取得したキーを貼り付ける
   - **モデル選択**：例 \`deepseek-v3\` / \`qwen-max\` / \`glm-4\` など
5. 「+ 追加」をクリックして保存する。
6. プロバイダーカードで「有効化」をクリックする。
7. Claude Desktop アプリを完全に再起動すると利用できます。

#### Codex への接続

1. CC Switch を開き、メイン画面の上部で **Codex** タブに切り替える。
2. 右上の「プロバイダーを追加」をクリックし、「カスタム設定」を選択する。
3. 入力する：
   - **API リクエスト URL**：\`{{BASE_URL}}\`
   - **API キー**：コンソールで取得したキー
   - **モデル選択**：\`deepseek-r1\`、\`glm-4\` を推奨
4. 「+ 追加」→ そのプロバイダーを有効化する。
5. 実行中の Codex ターミナルプロセスを再起動して反映させる（Codex はホットスイッチ非対応）。

---

## 方法 2：Claude Code クライアント

Claude Code は Claude 公式のターミナル AI プログラミングアシスタントです。CC Switch での管理（方法 1 参照）を推奨しますが、手動での接続も可能です。

### Claude Code クライアントのインストール

[Claude 公式サイト](https://claude.ai/code/family) にアクセスして対応 OS のバージョンをダウンロードし、インストールします。

### CC Switch での接続（推奨）

方法 1 の「Claude Desktop への接続」の手順を参考に、**Claude Code** タブで操作してください。

> **Windows ユーザーへの注意：** \`Virtual Machine Platform not available\` エラーが発生した場合は、「仮想マシンプラットフォーム」を有効にする必要があります：
> 1. \`Win + R\` で \`optionalfeatures\` を入力して Enter
> 2. 「仮想マシンプラットフォーム（Virtual Machine Platform）」にチェックを入れる → 確定
> 3. PC を再起動してから Claude クライアントを開く

---

## 方法 3：Codex コマンドライン

Codex は OpenAI 公式が提供するターミナル AI プログラミングアシスタントです。

### Codex のインストール

- まず [Node.js](https://nodejs.org/zh-cn/download/) 22+ のインストールを推奨
- macOS ユーザーは直接：\`brew install codex\` も可能
- または npm でインストール：

\`\`\`bash
npm install -g @openai/codex
codex --version  # 显示版本号即安装成功
\`\`\`

### Provider の設定（ゼロからの設定）

**macOS / Linux ユーザー：** ターミナルを開いて実行：

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

**Windows ユーザー（PowerShell）：**

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

### API キーの環境変数設定

\`<你的-API-key>\` をコンソールでコピーしたキーに置き換えます：

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
> 実行後、現在の PowerShell を閉じて開き直すと反映されます。

完了後、ターミナルで \`codex\` を実行すると LingyiYun 経由でルーティングされます。

### Codex をインストール済みの場合、設定を変更

設定ファイルと環境変数は「ゼロからの設定」と同じで、直接上書きして書き込むだけです。

---

## 方法 4：API 直接呼び出し

自分でコードを書いて接続する場合は、\`base_url\` を 1 行変更するだけです：

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

完全なインターフェース説明は後述の「API リファレンス」の章を参照してください。

---

## 方法 5：AI プログラミングツール

Cursor、Windsurf、Continue、JetBrains AI などのツールの設定は、次の章「AI プログラミングツールでの利用」を参照してください。

---

## よくある質問

| 問題 | 解決方法 |
|---|---|
| API キーはどこで取得できますか？ | コンソールにログイン → APIキー管理 → API キーを作成 |
| 設定しても反映されない？ | クライアントを正しく再起動したか / ターミナルを開き直したか / ページを更新したかを確認 |
| 異なるモデルを切り替えるには？ | CC Switch でワンクリック切り替え；または設定ファイル / コード内の \`model\` フィールドを変更 |
| クォータ不足（402）の表示？ | チャージするか、クォータのあるキーに交換 |
| レート制限超過（429）の表示？ | 後で再試行するか、管理者にクォータ引き上げを依頼 |

さらにサポートが必要な場合は、テクニカルサポートチームにご連絡ください。

---

## 1. モデル一覧と選択ガイド

### 利用可能なモデルの確認

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`
返却結果の \`data[].id\` が利用可能な model パラメータの値です。

### Chat モデル

| モデル | コンテキスト | 特徴 | 適用シーン |
|---|---|---|---|
| \`deepseek-v3\` | 64K | コストパフォーマンスが高く、中国語能力が強い | 日常会話、コンテンツ生成 |
| \`deepseek-r1\` | 64K | 推論チェーンモデル、思考プロセスが見える | 数学、論理的推論、コードデバッグ |
| \`gpt-4o\` | 128K | マルチモーダル、総合能力が高い | 複雑なタスク、画像・テキスト理解 |
| \`gpt-4o-mini\` | 128K | 高速・低コスト | 高並行シーン、簡単な会話 |
| \`gpt-4.1\` | 1M | 超長コンテキスト | 長文書処理、コードベース解析 |
| \`gpt-4.1-mini\` | 1M | 長コンテキスト + 低コスト | 長文書の要約 |
| \`gpt-4.1-nano\` | 1M | 最速・最安 | 分類、抽出などの軽量タスク |
| \`o3\` | 200K | 推論強化 | 複雑な推論、科学問題 |
| \`o4-mini\` | 200K | 推論 + 低コスト | 日常の推論タスク |
| \`claude-sonnet-4-20250514\` | 200K | コーディングと推論に強い | コード生成、分析 |
| \`qwen-max\` | 32K | 中国語に最適化 | 中国語ビジネスシーン |
| \`qwen-plus\` | 128K | コストパフォーマンスが高い | 汎用中国語タスク |
| \`glm-4\` | 128K | 中国語理解が得意 | 中国語の会話、文章作成 |
| \`gemini-2.5-pro\` | 1M | 超長コンテキスト + マルチモーダル | 長文書、マルチモーダル分析 |

### Embedding モデル

| モデル | 次元数 | 説明 |
|---|---|---|
| \`text-embedding-3-large\` | 3072（次元削減可） | 高精度、本番利用を推奨 |
| \`text-embedding-3-small\` | 1536（次元削減可） | 高速・低コスト |
| \`text-embedding-ada-002\` | 1536 | 旧バージョン互換 |

### 画像モデル

| モデル | 最大サイズ | 特徴的な機能 |
|---|---|---|
| \`gpt-image-1\` | 1536x1024 | 背景透過、モデレーションレベル制御 |
| \`dall-e-3\` | 1792x1024 | 高解像度、スタイル選択 |
| \`dall-e-2\` | 1024x1024 | 基本生成、複数画像出力 |

### 音声モデル

| モデル | 用途 | 説明 |
|---|---|---|
| \`tts-1\` | テキスト読み上げ | 標準品質 |
| \`tts-1-hd\` | テキスト読み上げ | 高音質 |
| \`gpt-4o-mini-tts\` | テキスト読み上げ | スタイル指示に対応 |
| \`whisper-1\` | 音声認識 / 翻訳 | 多言語対応 |

### 動画モデル

| モデル | 説明 |
|---|---|
| \`kling-v2\` | 快手の可灵、テキスト/画像から動画生成 |
| \`veo-2\` | Google の動画生成 |
| \`cerve\` | 動画生成 |

### Rerank モデル

| モデル | 説明 |
|---|---|
| \`cohere-rerank-v3\` | Cohere の再ランキング、RAG シーンで推奨 |

### Moderation モデル

| モデル | 説明 |
|---|---|
| \`omni-moderation-latest\` | マルチモーダルモデレーション、テキスト+画像に対応 |

**ヒント**：実際に利用できるモデルは \`GET /v1/models\` の返却値が基準です。プラットフォームは随時モデルを追加します。

## 2. クォータと課金の説明

### 課金方式

LingyiYun は **Token 使用量** で課金され、モデルごとに料金が異なります。

**入力 Token**（prompt_tokens）：モデルに送信する内容

**出力 Token**（completion_tokens）：モデルが生成した内容

一般的に、出力 Token の単価は入力 Token より高い

### Token とは

Token はモデルがテキストを処理する基本単位です。おおよその換算：

| 言語 | 1 Token ≈ |
|---|---|
| 英語 | 4 文字 / 0.75 語 |
| 中国語 | 1〜2 文字 |

### モデル倍率

モデルごとに料金が異なり、倍率で換算します。GPT-4o-mini を基準（倍率 1x）とします：

| モデル | 入力倍率 | 出力倍率 | 説明 |
|---|---|---|---|
| gpt-4o-mini | 1x | 1x | 基準 |
| deepseek-v3 | 0.5x | 0.5x | より安い |
| gpt-4o | 5x | 15x | 能力が高く、料金も高い |
| gpt-4.1 | 10x | 30x | 長コンテキスト |
| claude-sonnet-4 | 6x | 30x | コーディングに強い |

倍率は参考値であり、実際の設定はバックエンドの構成に従います。管理者は **運用設定 → モデル料金** で調整できます。

### クォータの確認

管理バックエンドにログインし、**APIキー管理** でキーの使用済みクォータと残クォータを確認できます

または API レスポンスの \`usage\` フィールドで今回の消費量をリアルタイムに取得できます

### クォータ枯渇

キーのクォータを使い切ると、リクエストは以下を返します：

\`\`\`json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
\`\`\`
HTTP ステータスコードは \`402\` です。この場合はチャージするか、クォータのあるキーに交換する必要があります。

### 各インターフェースの課金

| インターフェース | 課金基準 |
|---|---|
| Chat / Responses | 入力 + 出力 Token |
| Embeddings | 入力 Token |
| Images | 枚数とモデルで課金、Token 課金ではない |
| Audio TTS | 入力文字数で課金 |
| Audio STT / Translation | 音声の長さで課金 |
| Video | 回数で課金 |
| Moderation | 入力 Token（通常は少量） |
| Rerank | 入力 Token |

## 3. レート制限の説明

### 制限の次元

| 次元 | 意味 |
|---|---|
| RPM | Requests Per Minute、1 分あたりのリクエスト数 |
| TPM | Tokens Per Minute、1 分あたりの Token 数 |

### 制限ルール

制限は **API キー** 単位で適用され、キーごとに独立して計算されます

管理者はバックエンドでトークングループごとに異なる上限を設定できます

デフォルトの制限はデプロイ構成によって異なり、具体的な数値は管理者に確認してください

### 超過時のレスポンス

\`\`\`json
{
  "error": {
    "message": "Rate limit reached for default",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
\`\`\`
HTTP ステータスコード \`429\`。

### レスポンスヘッダー

レート制限情報は HTTP レスポンスヘッダーで返されます：

| ヘッダー | 意味 |
|---|---|
| \`X-RateLimit-Limit\` | 現在の期間内の総上限 |
| \`X-RateLimit-Remaining\` | 現在の期間内の残り回数 |
| \`X-RateLimit-Reset\` | 上限リセット時刻（Unix タイムスタンプ） |

### 対処戦略

1. **レスポンスヘッダーの確認**：リクエストごとに \`X-RateLimit-Remaining\` を確認し、事前に予測する
2. **リクエスト前のレート制限**：クライアント側でローカル制限を行い、429 を待ってから速度を落とさない
3. **指数バックオフ**：429 を受信したら、1 秒 → 2 秒 → 4 秒 → 8 秒待ってから再試行する
4. **複数キーのローテーション**：複数のキーを設定して交互に使用し、全体のスループットを向上させる
5. **無駄な Token の削減**：プロンプトを簡潔にし、重複コンテキストを避ける

#### バッチ呼び出し

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["人工智能", "机器学习", "深度学习"]
)
for item in response.data:
    print(f"索引 {item.index}: {len(item.embedding)} 维")
\`\`\`

#### 次元削減

\`text-embedding-3\` シリーズは出力次元数の指定に対応しており、ストレージコストを削減できます：

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="人工智能改变世界",
    dimensions=512  # 默认3072维降到512维
)
\`\`\`
次元削減は精度を犠牲にするため、高次元から始めて効果を見ながら段階的に下げることをおすすめします。

| パラメータ | 推奨 |
|---|---|
| \`model\` | デフォルトは \`cohere-rerank-v3\`、現時点で最も汎用的 |
| \`top_n\` | 通常 3〜5、多く返す必要はない |
| \`return_documents\` | \`true\` に設定、インデックスで原文を再取得する手間を省く |`,
  },
  {
    id: 'ai-tools',
    title: 'AI プログラミングツールでの利用',
    category: 'はじめに',
    content: `# AI プログラミングツールで LingyiYun を利用

このドキュメントでは、Cursor、Windsurf、Continue などの主要な AI プログラミングツールに LingyiYun を接続し、これらのツールで自分のモデルとクォータを使用する方法を説明します。

## 1. Cursor で LingyiYun を利用

Cursor は現在最も人気のある AI プログラミングツールの 1 つで、カスタム互換 API に対応しています。LingyiYun は標準インターフェース形式と完全に互換しており、設定後すぐに利用できます。

### 1.1 モデルの追加

1. Cursor を開き、**Settings → Models** に入る
2. **Models Names** 下部の入力欄に使用するモデル名を入力し、\`Add model\` をクリックする

追加を推奨するモデル：

| 用途 | モデル名 | 説明 |
|---|---|---|
| 日常コーディング | \`deepseek-v3\` | コストパフォーマンス最強、中国語理解が良く、コーディング能力が高い |
| 複雑な推論 | \`deepseek-r1\` | 推論チェーンモデル、デバッグ・数学・論理に適している |
| 汎用会話 | \`qwen-max\` | アリババの通義、中国語シーンでの性能が優秀 |
| 長文テキスト | \`qwen-plus\` | 128K コンテキスト、コストパフォーマンスが高い |
| 中国語の文章作成 | \`glm-4\` | 智譜、中国語の理解と生成に優れる |

3. 追加後、リストで**対応するモデルのスイッチをオン**にする

### 1.2 API キーと Base URL の設定

同じ Settings → Models ページで、API キー設定エリアを見つけます：

| 設定項目 | 入力内容 |
|---|---|
| **API Key** | \`sk-your-key\`（あなたの LingyiYun API キー） |
| **Base URL** | \`{{BASE_URL}}/v1\` |

入力後 \`Verify\` をクリックし、成功と表示されれば設定完了です。

### 1.3 Cursor でモデルを使用

設定完了後：

1. Cursor の Chat パネルを開く（ショートカットキー \`Cmd+L\` / \`Ctrl+L\`）
2. モデル選択ドロップダウンで、追加したばかりのモデルを選択する
3. 通常どおり会話するだけで、すべてのリクエストが LingyiYun を経由します

### 1.4 @Docs ドキュメントコンテキストの設定

Cursor の \`@Docs\` 機能は、外部ドキュメントをコンテキストとして会話に注入し、モデルがあなたの API ドキュメントに基づいて回答できるようにします。

設定手順：

1. Cursor Settings → Features → Docs を開く
2. \`Add new doc\` をクリックする
3. 設定を入力する：

| 設定項目 | 値 |
|---|---|
| **Name** | \`LingyiYun Docs\` |
| **URL** | あなたのドキュメントサイトの URL |
| **Start URL** （任意） | ドキュメントのトップページ URL |

4. \`Save\` をクリックして保存する

### 1.5 @Docs でドキュメントを参照

Cursor Chat で：

1. \`@Docs\` と入力し、\`LingyiYun Docs\` を選択する
2. 次に質問を入力します。例：

\`\`\`
@零一云 Docs 如何使用 Function Calling？
\`\`\`

Cursor は自動的にドキュメントの内容をコンテキストとして取得し、モデルはドキュメントに基づいて正確な回答を行います。

## 2. Windsurf で LingyiYun を利用

Windsurf（旧 Codeium）も標準互換 API に対応しています。

### 設定手順

1. Windsurf Settings → AI Provider を開く
2. **OpenAI Compatible** または **Custom Provider** を選択する
3. 設定を入力する：

| 設定項目 | 値 |
|---|---|
| **API Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` またはその他の利用可能なモデル |

4. 保存後、Cascade と Chat で利用できます

### Windsurf 設定ファイルでの設定

設定ファイル \`~/.windsurf/settings.json\` を直接編集することもできます：

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

## 3. Continue で LingyiYun を利用

Continue はオープンソースの AI プログラミングアシスタントで、VS Code と JetBrains に対応しています。

### 設定手順

Continue の設定ファイル \`~/.continue/config.json\` を編集します：

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

### 設定の説明

| フィールド | 説明 |
|---|---|
| \`models\` | 会話モデルのリスト、Continue のモデル選択ドロップダウンに表示される |
| \`tabAutocompleteModel\` | コード補完モデル、高速モデル（deepseek-v3）を推奨 |
| \`embeddingsProvider\` | コードベース索引用の Embedding モデル |

設定完了後、VS Code / JetBrains を再起動すると、Continue パネルで LingyiYun モデルを選択できます。

## 4. VS Code Copilot で LingyiYun を利用

GitHub Copilot は Copilot Chat のカスタムモデル機能を通じてサードパーティ API に接続できます。

### 設定手順

1. **GitHub Copilot** と **GitHub Copilot Chat** 拡張機能をインストールする
2. VS Code Settings を開き、\`github.copilot.chat\` を検索する
3. カスタムエンドポイントを設定する（VS Code 1.90+ と Copilot のカスタムモデルサポートが必要）

### 環境変数による設定

ターミナルで環境変数を設定してから VS Code を起動します：

\`\`\`bash
export OPENAI_API_KEY=sk-your-key
export OPENAI_BASE_URL={{BASE_URL}}/v1
code .
\`\`\`

**注意**：Copilot のカスタムモデルサポートは継続的に更新されており、具体的な設定方法はバージョンによって変わる可能性があります。カスタムモデルに対応していない場合は、代替として Cursor または Continue の使用を推奨します。

## 5. JetBrains AI で LingyiYun を利用

JetBrains IDE（IntelliJ IDEA / PyCharm / WebStorm など）の AI Assistant はカスタムエンドポイントに対応しています。

### 設定手順

1. **Settings → Tools → AI Assistant → Providers** を開く
2. **OpenAI Compatible** または **Custom Provider** を選択する
3. 入力する：

| 設定項目 | 値 |
|---|---|
| **Server URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` またはその他 |

4. \`Test Connection\` をクリックして検証する
5. 保存後、AI Assistant で利用できます

## 6. 対話ツールでの利用

プログラミングツールではなく、対話インターフェースで LingyiYun のモデルだけを使いたい場合は、以下の方法で利用できます：

### サードパーティクライアントの利用

カスタム API に対応したクライアントであれば使用できます：

| クライアント | プラットフォーム | 設定方法 |
|---|---|---|
| ChatBox | デスクトップ | 設定 → API Base URL + キー |
| NextChat | Web | 設定 → インターフェース URL + キー |
| LobeChat | Web/デスクトップ | 設定 → モデルサービス → プロキシ URL + キー |
| Open WebUI | Web | 設定 → API URL + キー |
| Cherry Studio | デスクトップ | 設定 → API URL + キー |

共通設定：

| 設定項目 | 値 |
|---|---|
| API Base URL | \`{{BASE_URL}}/v1\` |
| API Key | \`sk-your-key\` |

## 7. よくある質問

### Q：Cursor で Verify が失敗する場合は？

以下の点を確認してください：

| 確認項目 | 正しい値 |
|---|---|
| Base URL | \`{{BASE_URL}}/v1\`（末尾に \`/v1\` を含める） |
| API Key | \`sk-\` で始まり、余分な空白がないこと |
| モデル名 | \`GET /v1/models\` が返す id であること、大文字小文字に注意 |
| ネットワーク接続 | \`curl {{BASE_URL}}/v1/models\` が正常に返ること |

### Q：Cursor にモデルが表示されない場合は？

- モデルのスイッチがオンになっているか確認する
- Cursor を終了して再度開く
- モデル名のスペルが正しいか確認する（すべて小文字。例：\`deepseek-v3\` であり \`DeepSeek-V3\` ではない）

### Q：コード補完が遅い場合は？

コード補完はレイテンシーに敏感なため、以下を推奨します：

- 高速モデルを使用する：\`deepseek-v3\`
- 推論モデル（\`deepseek-r1\`）を補完に使わない
- Continue ユーザーは \`tabAutocompleteModel\` で高速モデルを個別に設定できる

### Q：会話中に \`model_not_found\` エラーが発生する場合は？

そのモデルはあなたの LingyiYun アカウントで有効化されていません。管理者に連絡して有効化するか、利用可能な別のモデルに変更してください。

### Q：複数のツールで同じキーを共有できますか？

可能ですが、以下に注意してください：

- すべてのツールがキーのクォータを共有するため、使用量に注意する
- 同時リクエストはキーのレート制限を共有する
- ツールごとに異なるキーを使うことを推奨、管理と監視が容易

### Q：他のサービスと LingyiYun を同時に設定できますか？

**Cursor**：2 つのエンドポイントを同時に設定することはできず、後から設定した方が上書きされます。同時に使用する必要がある場合は、Continue や他のツールで分担することを推奨します。

**Continue**：対応しています。\`models\` 配列に異なる \`apiBase\` の設定を追加するだけです。

### Q：@Docs を設定しても内容を参照できない場合は？

- ドキュメント URL がパブリックにアクセス可能か確認する
- ブラウザで設定した URL を開き、ページが正常に表示されるか確認する
- 社内ドキュメントサイトの場合、Cursor がクロールできない可能性がある

### Q：Continue の Embedding インデックスでエラーが発生する場合は？

\`embeddingsProvider\` の設定が正しいか確認してください：

\`\`\`json
{
  "provider": "openai",
  "model": "text-embedding-3-large",
  "apiBase": "{{BASE_URL}}/v1",
  "apiKey": "sk-your-key"
}
\`\`\`
それでもエラーが発生する場合は、キーに Embedding インターフェースの権限があるか確認してください。

## 設定クイックリファレンス

すべてのツールの中核設定は 2 つだけです：

| 設定項目 | 値 |
|---|---|
| **Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |

各ツールの設定場所：

| ツール | 設定場所 | 説明 |
|---|---|---|
| Cursor | Settings → Models → API Key | Base URL + キーを入力 |
| Windsurf | Settings → AI Provider | Compatible を選択 |
| Continue | \`~/.continue/config.json\` | 設定ファイルを編集 |
| JetBrains | Settings → Tools → AI Assistant | Custom Provider を選択 |
| ChatBox | 設定 → API | URL + キーを入力 |
| LobeChat | 設定 → モデルサービス | プロキシ URL + キーを入力 |
| NextChat | 設定 → インターフェース | URL + キーを入力 |
| Open WebUI | 設定 → API | API URL + キーを入力 |`,
  },
  {
    id: 'api-quick-start',
    title: 'API クイックスタート',
    category: '導入ガイド',
    content: `# クイックスタート

最もシンプルな呼び出し（cURL）：

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}]
  }'
\`\`\`

**ポイント**：\`base_url\` と \`api_key\` を変更するだけで、その他のコードは OpenAI 公式と完全に同じです。

### 対応インターフェース一覧

| インターフェース | メソッド | パス | 説明 |
|---|---|---|---|
| モデル一覧 | GET | \`/v1/models\` | 利用可能なモデルの確認 |
| チャット補完 | POST | \`/v1/chat/completions\` | Chat インターフェース、ストリーミング対応 |
| Responses | POST | \`/v1/responses\` | OpenAI Responses API、ストリーミング対応 |
| テキストのベクトル化 | POST | \`/v1/embeddings\` | Embedding インターフェース |
| 画像生成 | POST | \`/v1/images/generations\` | テキストから画像生成 |
| テキスト読み上げ | POST | \`/v1/audio/speech\` | TTS、音声ストリームを返す |
| 音声認識 | POST | \`/v1/audio/transcriptions\` | STT、音声ファイルをアップロード |
| 音声翻訳 | POST | \`/v1/audio/translations\` | 音声を英語に翻訳 |
| 動画生成 | POST | \`/v1/video/generations\` | テキスト/画像から動画生成 |
| コンテンツモデレーション | POST | \`/v1/moderations\` | テキスト/画像の安全審査 |
| 再ランキング | POST | \`/v1/rerank\` | ドキュメントの関連性順位付け |`,
  },
  {
    id: 'get-api-key',
    title: 'API キーの取得',
    category: '導入ガイド',
    content: `# API キーの取得

1. LingyiYun 管理バックエンドにログインする
2. API キーページに入る
3. 「新しい API キー」をクリックし、名前とクォータを入力する
4. 作成後、\`sk-\` で始まるキーをコピーする

**注意**：キーは作成時に一度だけ表示されます。すぐに保存してください。忘れた場合は、削除して再作成する必要があります。

### キーの形式

\`\`\`
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`
\`sk-\` で始まり、その後にランダムな文字列が続きます。呼び出し時は HTTP ヘッダーの \`Authorization\` フィールドに設定します。`,
  },
  {
    id: 'auth',
    title: '認証方式',
    category: '導入ガイド',
    content: `# 認証方式

LingyiYun は **Bearer Token** 認証を使用し、すべてのインターフェースで必須です。

### ヘッダー形式

\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

### cURL 例

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### SDK での設定

\`\`\`python
# Python
client = OpenAI(api_key="sk-your-api-key", base_url="{{BASE_URL}}/v1")
\`\`\`

\`\`\`javascript
// Node.js
const client = new OpenAI({ apiKey: "sk-your-api-key", baseURL: "{{BASE_URL}}/v1" });
\`\`\`

### 認証失敗時の挙動

HTTP ステータスコード \`401\` を返します

レスポンスボディ：

\`\`\`json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

よくある原因：

- キーの入力ミス、または \`sk-\` プレフィックスの欠落
- キーが削除または無効化されている
- ヘッダー形式が正しくない（\`Bearer\` と \`sk-\` の間にスペースが 1 つだけ必要）`,
  },
  {
    id: 'request-url',
    title: 'リクエスト URL',
    category: '導入ガイド',
    content: `# リクエスト URL

### Base URL

\`\`\`
{{BASE_URL}}
\`\`\`

### 完全な URL のルール

\`\`\`
{Base URL}{接口路径}
\`\`\`

例：

| インターフェース | 完全な URL |
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

### SDK で Base URL を設定

\`base_url\` を \`{{BASE_URL}}/v1\` に設定するだけです（末尾に \`/v1\` を含める点に注意）。SDK が以降のパスを自動的に結合します。`,
  },
  {
    id: 'error-codes',
    title: 'エラーコードの説明',
    category: '導入ガイド',
    content: `# エラーコードの説明

### HTTP ステータスコード

| ステータスコード | 意味 | 対処方法 |
|---|---|---|
| 200 | 成功 | 通常どおりレスポンスを処理 |
| 400 | リクエストパラメータのエラー | リクエストボディの形式と必須パラメータを確認 |
| 401 | 認証失敗 | API キーが正しいか確認 |
| 402 | クォータ不足 | チャージするか、クォータのあるキーに交換 |
| 403 | 権限なし | このキーはモデルまたはインターフェースにアクセスする権限がない |
| 404 | インターフェースが存在しない | リクエストパスが正しいか確認 |
| 429 | リクエスト頻度の上限超過 | リクエスト頻度を下げるか、管理者に上限引き上げを依頼 |
| 500 | サーバー内部エラー | 後で再試行；継続する場合は運用担当に連絡 |
| 502 | ゲートウェイエラー | 上流サービスの異常、後で再試行 |
| 503 | サービス利用不可 | サービスが一時的に過負荷、後で再試行 |

### エラーレスポンスの形式

すべてのエラーは統一された形式に従います：

\`\`\`json
{
  "error": {
    "message": "具体错误描述",
    "type": "错误类型",
    "code": "错误码"
  }
}
\`\`\`

### よくあるエラーコード

| code | 意味 | 発生シーン |
|---|---|---|
| \`invalid_api_key\` | API キーが無効 | キーの入力ミス、削除済み、無効化済み |
| \`insufficient_quota\` | クォータ不足 | キーの残高を使い切った |
| \`model_not_found\` | モデルが存在しない | 存在しない model パラメータを渡した |
| \`context_length_exceeded\` | 入力が長すぎる | messages の合計長がモデルのコンテキストウィンドウを超過 |
| \`rate_limit_exceeded\` | 頻度上限超過 | 短時間にリクエストが多すぎる |
| \`invalid_request_error\` | リクエスト形式エラー | 必須パラメータの欠落、型の不一致など |
| \`server_error\` | サーバーエラー | 内部異常、通常は再試行で回復可能 |

### 再試行の推奨

**429 / 500 / 502 / 503**：再試行可能、指数バックオフを推奨（1 秒 → 2 秒 → 4 秒 → 8 秒）

**400 / 401 / 402 / 403 / 404**：再試行せず、先にリクエストを修正

同じリクエストの再試行は最大 3 回`,
  },
  {
    id: 'streaming',
    title: 'ストリーミング出力の説明',
    category: '導入ガイド',
    content: `# ストリーミング出力の説明

ストリーミング出力は Chat と Responses インターフェースで使用され、コンテンツをチャンク単位で返すため、ユーザー体験が向上します（すべて生成されるまで待つ必要がありません）。

### 有効化方法

リクエストボディに \`stream: true\` を設定：

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "写一首诗"}],
  "stream": true
}
\`\`\`

### レスポンス形式（SSE）

ストリーミングレスポンスは **Server-Sent Events (SSE)** プロトコルを使用し、Content-Type は \`text/event-stream\` です。

各データチャンクの形式：

\`\`\`
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

**重要なポイント：**

- 各データは \`data: \` で始まり、その後に JSON が続く
- 最後は \`data: [DONE]\` で、ストリームの終了を表す
- 各チャンクの \`delta.content\` は今回追加されたテキスト断片で、つなげると完全な返信になる
- \`finish_reason\` が \`stop\` なら正常終了を表す

### cURL でのストリーミング呼び出し

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

### Python SDK でのストリーミング呼び出し

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

### Node.js SDK でのストリーミング呼び出し

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

### ストリーミング出力の Usage 情報

デフォルトのストリーミングレスポンスには usage（Token 使用量）は**含まれません**。必要な場合は \`stream_options\` を設定します：

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true,
  "stream_options": {"include_usage": true}
}
\`\`\`

設定すると、最後のチャンクに完全な usage フィールドが含まれます：

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
\`\`\`

### Responses インターフェースのストリーミング出力

Responses API も \`stream: true\` に対応しており、形式は Chat と同様で、SSE プロトコルを使用し、最後は \`data: [DONE]\` で終了します。

### SSE を自分で解析する際の注意点

SDK を使わずに SSE ストリームを自分で解析する場合は、以下の点に注意してください：

1. **1 行ずつ読み取る**：各データは 1 行で、\`data: \` で始まる
2. **空行をスキップ**：SSE プロトコルでは空行はイベント区切りであり、データに影響しない
3. **終了の検出**：\`data: [DONE]\` に遭遇したら読み取りを停止
4. **切断への対処**：ネットワーク中断時は再試行可能だが、中断点からの再開はできず、リクエストを再発行する必要がある
5. **タイムアウト設定**：HTTP クライアントのタイムアウトは 60 秒以上に設定することを推奨、長文生成は時間がかかる場合がある

### ストリーミング vs 非ストリーミングの比較

| 次元 | 非ストリーミング (\`stream: false\`) | ストリーミング (\`stream: true\`) |
|---|---|---|
| レスポンス方式 | 完全な結果を一度に返す | テキスト断片をチャンク単位で返す |
| ユーザーの体感 | 待ち時間が長い | 文字が逐次表示され、体感が速い |
| レスポンス形式 | \`chat.completion\` | \`chat.completion.chunk\` |
| Usage | デフォルトで含まれる | \`stream_options\` の設定が必要 |
| 適用シーン | バックエンドのバッチ処理、API 連携 | フロントエンドの会話、リアルタイム対話 |
| 解析の難易度 | 簡単、JSON を直接読む | SSE の解析が必要 |`,
  },
  {
    id: 'chat-completions',
    title: 'チャット補完',
    category: 'API リファレンス',
    content: `# チャット補完

> **POST** \`/v1/chat/completions\`

チャット補完を作成します。ストリーミング（SSE）と非ストリーミングの 2 つのモードに対応しています。

- 非ストリーミング：\`stream: false\`（デフォルト）を設定、完全なレスポンスを返す
- ストリーミング：\`stream: true\` を設定、SSE で ChatCompletionChunk をチャンク単位で返す

## リクエストパラメータ

### ヘッダーパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`Authorization\` | string | はい | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | いいえ | リクエストの一意な識別子、トレースに使用 |
| \`X-Tenant-Id\` | string | いいえ | テナント識別子、マルチテナント環境での分離に使用 |
| \`X-Channel\` | enum | いいえ | 呼び出しチャネル識別子（web/app/api/miniapp）、デフォルトは api |

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | はい | モデル ID、例 \`deepseek-v3\` |
| \`messages\` | array | はい | 会話メッセージのリスト |
| \`temperature\` | number | いいえ | サンプリング温度、0〜2、デフォルト 0.7 |
| \`top_p\` | number | いいえ | 核サンプリング確率、0〜1、デフォルト 1 |
| \`max_tokens\` | integer | いいえ | 最大生成 Token 数 |
| \`stream\` | boolean | いいえ | ストリーミング出力かどうか、デフォルト false |
| \`stream_options\` | object | いいえ | ストリーミングオプション、例 \`{"include_usage": true}\` |
| \`tools\` | array | いいえ | 呼び出し可能なツールのリスト |
| \`tool_choice\` | string/object | いいえ | ツール選択戦略（none/auto/required） |
| \`response_format\` | object | いいえ | レスポンス形式、例 \`{"type": "json_object"}\` |
| \`stop\` | string/array | いいえ | 停止シーケンス |
| \`presence_penalty\` | number | いいえ | 存在ペナルティ、デフォルト 0 |
| \`frequency_penalty\` | number | いいえ | 頻度ペナルティ、デフォルト 0 |
| \`n\` | integer | いいえ | 生成候補数、デフォルト 1 |
| \`user\` | string | いいえ | ユーザー識別子 |

### リクエスト例

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

### cURL 例

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

## レスポンス

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

### 401 認証失敗`,
  },
  {
    id: 'models',
    title: '利用可能なモデルの一覧',
    category: 'API リファレンス',
    content: `# 利用可能なモデルの一覧

> **GET** \`/v1/models\`

現在利用可能なモデルのリストを返します

## リクエストパラメータ

### ヘッダーパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`Authorization\` | string | はい | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | いいえ | リクエストの一意な識別子 |
| \`X-Tenant-Id\` | string | いいえ | テナント識別子 |
| \`X-Channel\` | enum | いいえ | 呼び出しチャネル識別子、デフォルトは api |

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/models' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## レスポンス

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
    category: 'API リファレンス',
    content: `# Responses API

> **POST** \`/v1/responses\`

OpenAI Responses API。テキスト入力とメッセージ配列に対応し、output メッセージと usage を含む構造化された Response オブジェクトを返します。

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | はい | モデル ID、例 \`qwen-plus\` |
| \`input\` | string/array | はい | 入力内容、文字列またはメッセージ配列に対応 |
| \`instructions\` | string | いいえ | システム指示 |
| \`temperature\` | number | いいえ | サンプリング温度 |
| \`max_output_tokens\` | integer | いいえ | 最大出力 Token 数 |
| \`stream\` | boolean | いいえ | ストリーミング出力かどうか、デフォルト false |
| \`tools\` | array | いいえ | 呼び出し可能なツールのリスト |
| \`user\` | string | いいえ | ユーザー識別子 |

### リクエスト例

\`\`\`json
{
    "model": "qwen-plus",
    "input": "介绍北京"
}
\`\`\`

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/responses' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "qwen-plus",
    "input": "介绍北京"
}'
\`\`\`

## レスポンス

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
    title: 'テキストのベクトル化',
    category: 'API リファレンス',
    content: `# テキストのベクトル化

> **POST** \`/v1/embeddings\`

テキストをベクトル表現に変換します。バッチ入力に対応

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | はい | モデル ID、例 \`text-embedding-3-large\` |
| \`input\` | string/array | はい | 入力テキスト、単一または配列に対応 |
| \`encoding_format\` | enum | いいえ | エンコード形式（float/base64）、デフォルトは float |
| \`dimensions\` | integer | いいえ | ベクトル次元数（text-embedding-3 シリーズのみ対応） |

### リクエスト例

\`\`\`json
{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}
\`\`\`

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/embeddings' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}'
\`\`\`

## レスポンス

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
    title: '画像生成',
    category: 'API リファレンス',
    content: `# 画像生成

> **POST** \`/v1/images/generations\`

テキストプロンプトに基づいて画像を生成します。

**サイズ対応表：**

| モデル | 対応サイズ |
|---|---|
| wanx-v2 | 1024x1024 / 720x1280 / 1280x720 / auto |
| cogview-4 | 1024x1024 / 768x1344 / 1344x768 |
| cogview-3-plus | 1024x1024 / 768x1344 / 1344x768 |

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | はい | 画像生成モデル（wanx-v2 / cogview-4 / cogview-3-plus） |
| \`prompt\` | string | はい | 画像の説明テキスト |
| \`n\` | integer | いいえ | 生成枚数（1〜10、cogview-3-plus は 1 のみ） |
| \`size\` | string | いいえ | 画像サイズ |
| \`quality\` | enum | いいえ | 画像品質（low/medium/high/auto） |
| \`background\` | enum | いいえ | 背景の透明度（transparent/opaque/auto）、wanx-v2 のみ |
| \`moderation\` | enum | いいえ | コンテンツモデレーションレベル（low/auto）、wanx-v2 のみ |
| \`response_format\` | enum | いいえ | 返却形式（url/b64_json）、デフォルトは url |
| \`style\` | enum | いいえ | 画像スタイル（vivid/natural）、cogview-3-plus のみ |
| \`user\` | string | いいえ | ユーザー識別子 |

### リクエスト例

\`\`\`json
{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}
\`\`\`

### cURL 例

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

## レスポンス

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
    title: 'テキスト読み上げ（TTS）',
    category: 'API リファレンス',
    content: `# テキスト読み上げ（TTS）

> **POST** \`/v1/audio/speech\`

テキストを音声に合成し、音声ストリームを返します

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | はい | TTS モデル ID、例 \`cosyvoice-v2\` |
| \`voice\` | enum | はい | 音声の声色 |
| \`input\` | string | はい | 合成するテキスト |
| \`response_format\` | enum | いいえ | 出力音声形式（mp3/opus/aac/flac/wav/pcm）、デフォルトは mp3 |
| \`speed\` | number | いいえ | 話速（0.25〜4）、デフォルト 1 |
| \`instructions\` | string | いいえ | 音声スタイル指示（cosyvoice-v2 のみ） |

### リクエスト例

\`\`\`json
{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}
\`\`\`

### cURL 例

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

## レスポンス

### 200 成功

音声ストリーム（バイナリ）を返します。Content-Type: audio/mpeg`,
  },
  {
    id: 'stt',
    title: '音声認識（STT）',
    category: 'API リファレンス',
    content: `# 音声認識（STT）

> **POST** \`/v1/audio/transcriptions\`

音声ファイルをテキストに書き起こします

## リクエストパラメータ

### ボディパラメータ（multipart/form-data）

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`file\` | file | はい | 音声ファイル |
| \`model\` | string | はい | 音声認識モデル、例 \`sensevoice-v1\` |
| \`language\` | string | いいえ | 音声の言語（ISO 639-1、例：zh、en） |
| \`response_format\` | enum | いいえ | 出力形式（json/text/srt/verbose_json/vtt）、デフォルトは json |
| \`temperature\` | number | いいえ | サンプリング温度 |

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/transcriptions' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'language="zh"' \\
--form 'response_format="json"'
\`\`\`

## レスポンス

### 200 成功

\`\`\`json
{
    "text": "你好，欢迎使用语音识别服务。"
}
\`\`\``,
  },
  {
    id: 'translation',
    title: '音声翻訳',
    category: 'API リファレンス',
    content: `# 音声翻訳

> **POST** \`/v1/audio/translations\`

音声ファイルを英語のテキストに翻訳します

## リクエストパラメータ

### ボディパラメータ（multipart/form-data）

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`file\` | file | はい | 音声ファイル |
| \`model\` | string | はい | 音声翻訳モデル、例 \`sensevoice-v1\` |
| \`response_format\` | enum | いいえ | 出力形式（json/text/srt/verbose_json/vtt）、デフォルトは json |
| \`temperature\` | number | いいえ | サンプリング温度 |

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/translations' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'response_format="json"'
\`\`\`

## レスポンス

### 200 成功

\`\`\`json
{
    "text": "Hello, welcome to the speech translation service."
}
\`\`\``,
  },
  {
    id: 'video',
    title: '動画生成',
    category: 'API リファレンス',
    content: `# 動画生成

> **POST** \`/v1/video/generations\`

テキストプロンプトに基づいて動画を生成します。テキストのみからの動画生成と画像からの動画生成の 2 つのモードに対応し、豆包 Seedance (Sendance) 動画生成プロトコルと互換性があります。

- テキストから動画：prompt のみを提供
- 画像から動画：prompt + image_url を提供（Seedance は複数画像に対応：first_frame / last_frame / reference_image）

## 対応モデル

### Seedance シリーズ

| モデル | 説明 |
|---|---|
| \`doubao-seedance-1-0-pro-250528\` | 1.0 Pro、高品質な動画生成 |
| \`doubao-seedance-1-0-lite-t2v\` | 1.0 Lite、テキストから動画 |
| \`doubao-seedance-1-0-lite-i2v\` | 1.0 Lite、画像から動画 |
| \`doubao-seedance-1-5-pro-251215\` | 1.5 Pro、性能強化 |
| \`doubao-seedance-2-0-260128\` | 2.0 標準版 |
| \`doubao-seedance-2-0-fast-260128\` | 2.0 高速版、低レイテンシー |
| \`doubao-seedance-2-0-mini-260615\` | 2.0 Mini、軽量・低コスト |
| \`doubao-seedance-2-5-260628\` | 2.5 最新版 |

### その他のモデル

\`kling-v1\` / \`kling-v2\` / \`cogvideox-2\` / \`vidu-1\` / \`jimeng\` / \`sora\`

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | はい | 動画生成モデル（Seedance シリーズを推奨） |
| \`prompt\` | string | はい | 動画の説明テキスト |
| \`image_url\` | string | いいえ | 参考画像 URL（画像から動画モード） |
| \`images\` | array | いいえ | 複数画像入力（Seedance 画像から動画、順番に first_frame / last_frame / reference_image へマッピング） |
| \`resolution\` | string | いいえ | 出力解像度（Seedance：480p / 720p / 1080p / 4k） |
| \`ratio\` | string | いいえ | 画面比率（Seedance：16:9 / 9:16 / 1:1） |
| \`size\` | string | いいえ | 動画サイズ、例 1280x720 |
| \`duration\` | integer | いいえ | 動画の長さ（秒） |
| \`n\` | integer | いいえ | 生成数、デフォルト 1 |
| \`metadata\` | object | いいえ | 拡張パラメータ、マルチモーダル入力（video_url / audio_url）および negative_prompt、style、watermark などに対応 |

### リクエスト例（テキストから動画）

\`\`\`json
{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9"
}
\`\`\`

### リクエスト例（画像から動画）

\`\`\`json
{
    "model": "doubao-seedance-1-0-lite-i2v",
    "prompt": "在首帧基础上添加烟花效果",
    "images": [
        "https://example.com/first-frame.jpg",
        "https://example.com/last-frame.jpg"
    ]
}
\`\`\`

### リクエスト例（動画の続き / マルチモーダル）

\`\`\`json
{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "让视频中的人物转身看向镜头",
    "metadata": {
        "content": [
            {
                "type": "video_url",
                "video_url": {
                    "url": "https://example.com/input.mp4"
                }
            }
        ]
    }
}
\`\`\`

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/video/generations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9"
}'
\`\`\`

## レスポンス

### 200 成功

\`\`\`json
{
    "id": "video-abc123",
    "object": "video.generation",
    "created": 1713833628,
    "model": "doubao-seedance-2-0-260128",
    "data": [
        {
            "url": "https://cdn.example.com/video-001.mp4",
            "status": "completed"
        }
    ],
    "usage": {
        "prompt_tokens": 20,
        "completion_tokens": 0,
        "total_tokens": 20
    }
}
\`\`\`

> **注意**：Seedance 2.0 / 2.5 はマルチモーダル入力（動画 + 音声 + 画像）に対応しており、\`metadata.content\` で渡せます。タスク送信後は \`GET /v1/video/generations/{task_id}\` でタスクの状態をポーリングする必要があります。`,
  },
  {
    id: 'asset-library',
    title: '素材ライブラリ',
    category: 'API リファレンス',
    content: `# 素材ライブラリ

素材ライブラリは、動画生成に必要なマルチモーダル素材を管理するためのものです。お客様は外部インターフェースで画像 / 動画 / 音声素材をアップロードし、動画生成インターフェース（\`/v1/video/generations\`）を呼び出す際に、これらの素材を URL 形式で参照して Seedance (Sendance) のマルチモーダル入力として使用できます。

## インターフェース一覧

| メソッド | パス | 説明 |
|---|---|---|
| \`POST\` | \`/api/asset\` | 素材のアップロード |
| \`GET\` | \`/api/asset\` | 素材リストの取得（ページング） |
| \`GET\` | \`/api/asset/search\` | 素材の検索 |
| \`GET\` | \`/api/asset/{id}\` | 素材の詳細取得 |
| \`DELETE\` | \`/api/asset/{id}\` | 素材の削除 |

すべての素材ライブラリインターフェースで \`Authorization: Bearer <token>\`（プラットフォームユーザーのトークン）が必要です。一般ユーザーは自分の素材のみアクセスでき、管理者はすべての素材を閲覧 / 管理できます。

## 素材のアップロード

> **POST** \`/api/asset\`

\`multipart/form-data\` で素材ファイルをアップロードします。

### リクエストパラメータ

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| \`file\` | file | はい | 素材ファイル |
| \`group_id\` | integer | はい | 素材グループ ID（素材はグループに属している必要があります） |
| \`model\` | string | はい | 生成モデル識別子、例 \`sendance-2.0\` / \`sendance-2.5\` |
| \`channel_id\` | integer | いいえ | アップストリームチャネル ID（未指定時はグループのチャネル） |

### ファイルサイズ制限（火山エンジン Seedance に準拠）

| タイプ | サイズ制限 |
|---|---|
| 画像 (image) | 30MB |
| 動画 (video) | 200MB |
| 音声 (audio) | 15MB |

素材タイプはファイルの MIME タイプから自動的に識別されます：\`image/*\` → image、\`video/*\` → video、\`audio/*\` → audio、その他のタイプは拒否されます。

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@/path/to/video.mp4' \\
--form 'group_id=1' \\
--form 'model=sendance-2.0'
\`\`\`

### レスポンス例

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

> アップロード成功後に返される \`url\` フィールドが素材のアクセス URL であり、動画生成インターフェースで直接使用できます。

## 素材リストの取得

> **GET** \`/api/asset\`

ページングで素材リストを取得します。タイプとモデルでの絞り込みに対応。

### クエリパラメータ

| パラメータ | 型 | 説明 |
|---|---|---|
| \`type\` | string | 素材タイプ（image / video / audio） |
| \`model\` | string | 生成モデル識別子（例 \`sendance-2.0\`） |
| \`page\` | integer | ページ番号、デフォルト 0 |
| \`page_size\` | integer | 1 ページあたりの件数、デフォルト 10 |
| \`user_id\` | integer | ユーザー ID（管理者のみ） |
| \`tenant_id\` | integer | テナント ID（管理者のみ） |

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset?type=video&model=sendance-2.0&page=0&page_size=20' \\
--header 'Authorization: Bearer <token>'
\`\`\`

### レスポンス例

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

## 素材の検索

> **GET** \`/api/asset/search\`

キーワードで素材を検索します。パラメータは素材リストの取得と同じで、追加で以下に対応：

| パラメータ | 型 | 説明 |
|---|---|---|
| \`keyword\` | string | 検索キーワード（素材名と一致） |

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/search?keyword=开场' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 素材の詳細取得

> **GET** \`/api/asset/{id}\`

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 素材の削除

> **DELETE** \`/api/asset/{id}\`

素材の所有者または管理者のみ削除できます。

\`\`\`bash
curl --location --request DELETE '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## 素材を Seedance 動画生成に使用

素材をアップロードしたら、返された \`url\` を動画生成インターフェースのマルチモーダル入力として使用します：

> **説明**：プラットフォームは動画生成タスクを送信する際、素材ライブラリ内の**画像**素材を自動的に読み取り、Base64 エンコード（\`data:image/...;base64,...\`）に変換して上流の火山方舟（Volcano Ark）に送信するため、公的にアクセス可能な静的 URL を追加で用意する必要はありません。お客様が自社ホスティングし、素材ライブラリに存在しない公開 URL、Base64 エンコード、\`asset://\` 素材 ID はそのまま透過的に渡されます。**動画/音声**素材は公開 URL 入力のみ対応しており、素材ライブラリ外の公開 URL（画像ホスティング、オブジェクトストレージ CDN など）を使用してください。単一画像は 25MB 以下を推奨します。

### 画像から動画（参考画像）

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

### 動画の続き / 音声入力

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

> **ヒント**：\`metadata.content\` は \`text\` / \`image_url\` / \`video_url\` / \`audio_url\` の 4 種類に対応しており、\`image_url\` は \`role\` で \`first_frame\` / \`last_frame\` / \`reference_image\` を指定できます。`,
  },
  {
    id: 'moderation',
    title: 'コンテンツモデレーション',
    category: 'API リファレンス',
    content: `# コンテンツモデレーション

> **POST** \`/v1/moderations\`

テキストまたは画像・テキストの内容が安全ポリシーに違反しているかを検出します

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | いいえ | モデレーションモデル、例 \`content-moderation-latest\` |
| \`input\` | string/array | はい | 審査対象の内容（テキストまたはテキスト+画像の配列） |

### リクエスト例

\`\`\`json
{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}
\`\`\`

### cURL 例

\`\`\`bash
curl --location '{{BASE_URL}}/v1/moderations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}'
\`\`\`

## レスポンス

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
    title: '再ランキング',
    category: 'API リファレンス',
    content: `# 再ランキング

> **POST** \`/v1/rerank\`

クエリテキストに基づいてドキュメントリストを関連性で再ランキングします

## リクエストパラメータ

### ボディパラメータ

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| \`model\` | string | いいえ | 再ランキングモデル、例 \`bge-rerank-v3\` |
| \`query\` | string | はい | クエリテキスト |
| \`documents\` | array | はい | 並べ替え対象のドキュメントリスト |
| \`top_n\` | integer | いいえ | 上位 N 件の結果を返す |
| \`return_documents\` | boolean | いいえ | ドキュメントの原文を返すかどうか、デフォルト true |

### リクエスト例

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

### cURL 例

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

## レスポンス

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
    title: 'よくある質問',
    category: 'プラットフォーム',
    content: `# よくある質問

### 一般的な質問

**Q：LingyiYun と OpenAI 公式の違いは何ですか？**

A：LingyiYun は OpenAI 形式と互換性のあるゲートウェイで、国産モデルのサポート（DeepSeek/Qwen/GLM など）が追加されており、料金もより柔軟です。インターフェース形式は完全互換で、OpenAI SDK をそのまま使用できます。

**Q：対応しているプログラミング言語は？**

A：HTTP に対応している言語であればどの言語でも呼び出せます。Python と Node.js は公式 SDK があり最も便利で、他の言語（Go/Java/PHP/Rust）は HTTP クライアントで直接リクエストできます。

**Q：無料トライアルはできますか？**

A：管理者に連絡してテスト用のキーを取得してください。通常、初期クォータが付与されます。

### 呼び出しに関する質問

**Q：\`context_length_exceeded\` が返る場合は？**

A：入力が長すぎます。messages の内容を簡潔にするか、より長いコンテキストのモデル（例：gpt-4.1 は 1M 対応）に変更してください。

**Q：\`model_not_found\` が返る場合は？**

A：model パラメータが間違っています。\`GET /v1/models\` を呼び出して利用可能なモデルリストを確認し、大文字小文字に注意してください。

**Q：ストリーミング出力が中断された場合は？**

A：ネットワークの問題で SSE が切断され、再開はできません。リクエストを再発行する必要があります。クライアント側で連結ロジックを実装し、切断後は再リクエストすることを推奨します。

**Q：返信内容が途中で切れるのはなぜ？**

A：\`max_tokens\` が小さすぎるか、モデルの出力が上限に達した可能性があります。\`finish_reason\` を確認し、\`length\` なら途中で切れているので、\`max_tokens\` を増やしてください。

**Q：中国語の返信の品質が良くない場合は？**

A：system メッセージで「中国語で回答してください」と明示するか、中国語能力がより高いモデル（DeepSeek/Qwen/GLM）を使用してみてください。

### 課金に関する質問

**Q：1 回のリクエストでどれくらいの Token を消費しますか？**

A：レスポンスの \`usage\` フィールドを確認してください。入力 + 出力の Token の合計が消費量です。

**Q：ストリーミングリクエストの Token はどう統計されますか？**

A：\`stream_options: {"include_usage": true}\` を設定すると、最後のチャンクに usage が含まれます。非ストリーミングリクエストはデフォルトで usage を返します。

**Q：課金は OpenAI 公式と同じですか？**

A：課金ロジックは同じ（Token 単位）ですが、倍率が異なり、LingyiYun の国産モデルの方が安価です。具体的な倍率はバックエンドの設定を参照してください。

### 機能に関する質問

**Q：Function Calling に対応していますか？**

A：対応しています。DeepSeek / GPT / Claude などのモデルが対応しており、使い方は OpenAI と完全に同じです。

**Q：画像入力（Vision）に対応していますか？**

A：対応しています。gpt-4o / claude-sonnet-4 などのマルチモーダルモデルを使用し、content に画像 URL または Base64 を渡します。

**Q：JSON 出力に対応していますか？**

A：対応しています。\`response_format: {"type": "json_object"}\` を設定します。

**Q：モデルのファインチューニングはできますか？**

A：現在は対応していません。プラットフォームが提供する事前学習モデルを直接使用し、プロンプトエンジニアリングと few-shot でカスタマイズ効果を実現できます。

**Q：動画生成にはどのくらい時間がかかりますか？**

A：通常 30 秒から数分で、モデルと動画の長さによって異なります。

### デプロイに関する質問

**Q：クロスオリジン（CORS）はどう設定しますか？**

A：フロントエンドから直接 API を呼び出すとクロスオリジンの問題が発生します。バックエンドプロキシを経由するか、管理者に連絡して CORS ホワイトリストを設定することを推奨します。

**Q：社内ネットワークから API を呼び出せますか？**

A：LingyiYun は公開ネットワークにデプロイされているため、社内ネットワークからは外部ネットワークへのアクセスが必要です。完全に分離されている場合は、プライベートデプロイが必要です。

**Q：プライベートデプロイに対応していますか？**

A：営業担当に連絡してください。お客様のデータセンターへのプライベートデプロイに対応しています。

**Q：API 呼び出しログはどう確認しますか？**

A：管理バックエンド → ログページで、キー / モデル / 時間で絞り込めます。`,
  },
  {
    id: 'terms',
    title: 'プラットフォーム利用規約',
    category: 'プラットフォーム',
    content: `# プラットフォーム利用規約

本規約は、お客様（「プラットフォームにユーザーとして登録し、当社のサービスを利用する個人または組織であり、当社の各種規約、プライバシーポリシーおよびその他の利用条件を遵守することに同意する者」）と、北京創世華彩科技有限公司およびその関連会社（「**華彩**」または「当社」）との間の契約（「本規約」）です。

お客様は、LingyiYun の製品またはサービスを使用または購入する前に、本規約のすべての条項を完全に読み、理解し、受け入れたことを確認します。実際に本プラットフォームのサービスの利用を開始した時点、または購入プロセスを完了した時点で、本規約を読み、これに同意したものとみなされます。当社は必要に応じて本規約の条項を変更する権利を有し、お客様はこのページで規約の最新版を確認できます。本規約の条項が変更された後も、お客様が引き続き本プラットフォームのサービスを利用する場合、変更後の規約を受け入れたものとみなされます。**本プラットフォームのデータおよび個人情報の収集・利用方針の詳細については、プライバシーポリシーをご参照ください。**

お客様は、法律に定める完全な民事行為能力を有し、民事責任を独立して負担できる自然人であるか、法人から授権されて法人を代表して行動する完全な民事行為能力者であることを保証します。18 歳未満の場合、登録したとしても、実名認証を完了することも、本プラットフォームのサービスを利用することもできません。お客様は、本規約の内容がお客様の所在する国または地域の法律に違反しないことを表明し、確認します。

## 1. アカウント管理

### 1.1 アカウントと実名認証

1.1.1. お客様が本プラットフォームの要求に従って関連情報を入力し、本規約および「プライバシーポリシー」のすべての条項に同意することを確認した後、当社はお客様のアカウントを作成します。お客様は、本プラットフォームの一部またはすべての機能が、お客様のアカウントの実名認証後にのみアクティベートされることを理解し、同意します。また、当社は自らの判断および事業の発展状況に応じて、本プラットフォームのサービスと機能を随時変更・維持する権利を有します。

1.1.2. お客様が企業、法人、非法人組織またはその他の団体を代表して本プラットフォームにアクセス・利用する場合、アカウントの企業認証を完了する必要があります。認証済みの企業は、当該アカウントおよびその関連ユーザーのすべての利用、チャージ、情報提供などの行為について責任を負うものとし、アカウントの貸与や担当者の退職などを理由に責任の負担を拒否することはできません。

1.1.3. お客様が第三者経由で本サービスに接続またはアクセスする場合、当該第三者のサービスがお客様のユーザー情報、アクセストークン、関連するアカウント情報、認証資格情報およびその他のデータを使用または保存することを承認し、許可したものとみなされます。

1.1.4. お客様は、ご自身が作成、参加、または管理するアカウントおよびユーザー資格情報を保護する責任を負い、ログインに使用するログイン資格情報をいかなる者にも開示してはなりません。お客様の自発的な漏えい、または第三者による攻撃や詐欺によってアカウントを失った場合、本プラットフォームは一切責任を負いません。

1.1.5. お客様が設定するアカウント名およびユーザーニックネームは、国の法令、公序良俗、社会道徳に違反してはならず、また、お客様本人と本プラットフォームの身元を混同させるものであってはなりません。

1.1.6. 同一ユーザーは個人アカウントを 1 つだけ作成できます。お客様の個人アカウントは、お客様本人のみが使用できます。双方で別途合意がある場合を除き、お客様は、いかなる形式であれ、個人アカウントを贈与、貸与、賃貸、譲渡、売却、またはその他の方法で第三者に使用させてはなりません。

1.1.7. 同一ユーザーは複数の組織アカウントを作成できます。お客様が他のユーザーに組織アカウントの共同使用を許可した場合、お客様は当該組織アカウントにおける相応のユーザーのすべての行為の結果と責任について全責任を負います。

### 1.2 変更、一時停止、終了

当社は、お客様に提供するサービスを変更、一時停止、終了したり、サービスの利用に制限を設けたりすることができ、その場合も責任を負いません。ただし、当社が SMS、電子メール、本プラットフォームのお知らせなど、1 つ以上の方法で事前に最大限の努力をもってお客様に通知した場合に限ります。当社はいつでもお客様のアカウントを無効化できます。アカウントが何らかの理由で終了した場合でも、お客様は引き続き本規約に拘束されます。

## 2. サービスのアクセスと利用制限

### 2.1 サービスの利用権

お客様が本規約を遵守することを条件として、当社は、お客様個人の使用またはお客様が代表する企業その他の団体の社内業務目的に限り、非独占的かつ譲渡不可の権利をお客様に付与します。

### 2.2 利用制限

お客様は、以下の行為を行ってはなりません：
- 本サービスの一部に対して、逆アセンブル、リバースエンジニアリング、デコード、または逆コンパイルを行うこと
- 当社の事前の書面による同意なしに、API キーを購入、売却、または譲渡すること
- 本サービスの一部を複製、賃貸、売却、貸与、譲渡、ライセンス供与、再ライセンスの試行、転売、配布、または改変すること
- 当社のサーバー、インフラストラクチャなどに過度な負担をかける可能性のある行為を行うこと
- 本サービスを違法、権利侵害、詐欺などの目的に使用すること
- 当社が講じる可能性のある、サービスへのアクセスを阻止または制限する措置を回避すること
- 本サービスを実行するサーバーのシステムの完全性または安全性を妨害または破壊しようとすること
- 本サービスを使用してスパムメール、チェーンレター、その他の未承諾メールを送信すること
- 本サービスを通じて不正なデータ、ウイルス、その他の悪意のあるソフトウェアを送信すること
- 他人または団体になりすまし、お客様と他人または団体との関係を虚偽に表明すること
- 本サービスから個人情報を収集または取得すること

## 3. 対話データ

3.1 本サービスは、ユーザーがプラットフォームサービスを利用する際に、大規模モデル、第三者のウェブサイト、ソフトウェア、アプリケーションまたはサービスとの関連データの入力、フィードバック、修正、処理、保存、アップロード、ダウンロード、配布などの操作を許可する場合があります。

3.2 対話データが法律、法令、または本規約の規定に違反していることを発見した場合、当社は当該対話データを削除し、または技術サービスの提供を停止する権利を有します。

3.3 独立した技術サポート提供者として、本プラットフォームは、お客様が本プラットフォームのサービスを利用して生じたいかなる対話データについても知的財産権を享有しません。お客様が本プラットフォームのサービスを利用して生じたすべての対話データ、義務および責任は、お客様自身が負担します。

3.4 免責事項：当社は、いかなる対話データについても責任を負いません。お客様は、本プラットフォームのサービスにおいて入力、フィードバック提供、訂正、処理、保存、アップロード、ダウンロード、配布した対話データについて、すべての責任を負うものとします。

3.5 当社は、関連する法律・法令に基づき、人工知能が生成した合成コンテンツに相応の標識を付与します。お客様は、上記の標識を悪意的に削除、改ざん、偽造、または隠蔽してはなりません。

## 4. 知的財産権

### 4.1 LingyiYun の知的財産権

本プラットフォームのサービスにおいて当社が提供するすべてのコンテンツの知的財産権は、当初から当社に帰属します。お客様は、かかる知的財産権にアクセス、売却、ライセンス供与、賃貸、改変、配布、複製、送信、表示、公開、翻案することも、その派生作品を作成することもできません。

### 4.2 出力

お客様が関連規定を遵守し、関連する法律・法令に適合する限り、本プラットフォームのサービスで生成した結果を法律が要求する方法で使用できます。

### 4.3 ユーザー利用データ

当社は、診断、技術、利用状況に関連する情報を収集し、製品とサービスの改善に使用する場合があります。

### 4.4 フィードバック

お客様が本サービスについて当社に何らかの提案またはフィードバックを提供した場合、お客様は本フィードバックにおけるすべての権利および利益を当社に譲渡します。

## 5. 秘密情報

本サービスには、LingyiYun および他のユーザーの非公開、専有、または機密情報が含まれる場合があります。お客様は、すべての機密情報のプライバシーを保護し、本規約に基づく権利を行使する目的以外のいかなる目的にも使用せず、いかなる個人または団体にも開示しないものとします。

## 6. 課金ポリシーと税金

6.1 本プラットフォームが提供する一部のサービスには、利用料金が必要な場合があります。本サービスの利用を選択した時点で、本プラットフォームに記載されているお客様に適用される価格および支払い条件に同意したものとみなされます。

6.2 「先サービス・後課金」という特殊性により、当社の製品とサービスは通常「使用後払い」方式を採用しています。アカウントに十分な残高があることを確認してください。残高が不足すると、未払金が発生する場合があります。

6.3 本プラットフォームのすべての製品とサービスの価格、課金、支払い条件は、参照により本規約に組み込まれます。

6.4 政府が規定する税金がある場合、お客様はサービスの利用・アクティベーションに関連するすべての税金を支払う責任を負います。

## 7. 輸出管理と制裁

お客様は、中華人民共和国の輸出管理および制裁に関する法律・法令を遵守することを約束します。お客様は、本プラットフォームが提供する製品またはサービスを、軍事、大量破壊兵器関連の用途に使用しないことを約束します。

## 8. プライバシーとデータセキュリティ

### 8.1 プライバシー

当社は、常に「中華人民共和国個人情報保護法」およびその他の関連する適用法律を遵守します。

### 8.2 データセキュリティ

当社は、お客様の個人情報の完全性と安全性を非常に重視しています。ただし、権限のない第三者が当社の安全保護措置を永遠に突破できないことを保証することはできません。

## 9. 第三者サービスの利用

本サービスには、第三者のウェブサイト、資料、サービスへのリンクが含まれる場合がありますが、これらの第三者のサービスは当社が所有または管理するものではありません。当社は、いかなる第三者のサービスについても承認せず、いかなる責任も負いません。

## 10. 補償

お客様は、本サービスへのアクセスおよび利用、本規約への違反、または第三者の権利の侵害に起因するあらゆる請求、損害、義務、損失、負債、コストおよび費用について、当社および当社の関連会社、ならびにそれぞれの代理人、供給者、ライセンサー、従業員、請負業者、役員、取締役を弁護し、補償し、損害を与えないようにするものとします。`,
  },
  {
    id: 'privacy',
    title: 'プライバシーポリシー',
    category: 'プラットフォーム',
    content: `# プライバシーポリシー

北京創世華彩科技有限公司およびその関連会社（以下「華彩」または「当社」といいます）の高価値 GenAI オープンプラットフォームへようこそ。当社は、ユーザー（以下「お客様」といいます）の情報保護を非常に重視しています。お客様が本プラットフォームに登録、ログインし、利用する際、当社は、お客様の登録および本プラットフォーム機能の正常な利用に必要なユーザー情報を収集し、保存します。当社は、お客様が本プラットフォームを利用する間に、オープンソースモデル、第三者のウェブサイト、ソフトウェア、アプリケーションまたはサービスとの対話データを収集または保存しません。

## 概要

本プライバシーポリシーは、以下の点を理解するのに役立ちます：

1. 当社がお客様のユーザー情報をどのように収集・利用するか
2. 当社が Cookie および類似技術を使用する方法
3. 当社がお客様のユーザー情報をどのように保存するか
4. 当社がお客様の情報をどのように共有、移転、公開開示するか
5. 当社がお客様の情報の安全をどのように保護するか
6. 当社がお客様のユーザー情報をどのように管理するか
7. 未成年者の利用条件
8. プライバシーポリシーの改訂と通知
9. 適用範囲

## 1. 当社がお客様のユーザー情報をどのように収集・利用するか

### 1.1 当社が自発的に収集するユーザー情報

お客様が当社のプラットフォームを正常に利用できるようにするため、当社は、お客様が当社のサービスを利用する際に自発的に提供するユーザー情報を収集します。これには以下が含まれますが、これらに限りません：

**1.1.1** お客様がプラットフォームのアカウントに登録、検証、ログインする際、携帯電話番号を使用してアカウントを作成できます。当社は、SMS 認証コードを送信して本人確認を行います。

**1.1.2** お客様がサービスを契約またはアクティベートする際、法律・法令に基づき、当社はお客様の実名認証を行う必要があります。

- 個人ユーザーの場合：氏名、身分証明書番号などの実際の身元情報の提供が必要になる場合があります。
- 企業ユーザーの場合：事業者名、統一社会信用コードなどの関連情報の提供が必要になる場合があります。

**1.1.3** お客様が本サービスを利用する際、当社は、製品とサービスの安全かつ安定した運用を維持するために必要な情報（デバイス情報、ネットワークログ情報など）を収集します。

### 1.2 当社が第三者からユーザー情報を取得する場合

お客様により質の高い、より効率的で、よりパーソナライズされたサービスを提供するため、当社の関連会社およびパートナーは、法律・法令、お客様と締結した契約、またはお客様の同意に基づき、お客様の情報を当社と共有する場合があります。

### 1.3 業務データおよび顧客データ

本プラットフォームが提供するサービスを通じて生成または処理されたデータは、お客様の業務データおよび顧客データ（「対話データ」）に属します。お客様は、対話データの完全な所有権を有します。中立的な技術サービス提供者として、本プラットフォームは、法律・法令に別段の定めがある場合を除き、お客様の対話データにアクセス、使用、または開示しません。

## 2. Cookie および類似技術の使用

Cookie および類似技術は、インターネット上で一般的に使用される技術です。お客様が本プラットフォームを利用する際、当社は関連技術を使用してお客様のデバイスに Cookie を送信し、アカウント情報、検索履歴、ログイン状態の情報を収集・保存する場合があります。お客様は、ブラウザの設定で Cookie を拒否または管理できます。

## 3. 当社がお客様のユーザー情報をどのように保存するか

### 3.1 情報の保存場所

当社は、本ウェブサイトおよび関連サービスの運営過程で収集・生成されたユーザー情報を、中華人民共和国国内に保存します。

### 3.2 情報の保存期間

当社は、本プラットフォームおよび関連サービスの提供に必要な期間のみ、お客様のユーザー情報を保持します。必要な期間が終了した後、当社はお客様の情報を削除または匿名化します。

## 4. 当社がお客様の情報をどのように共有、移転、開示するか

### 4.1 データ利用に参加するパートナー

パートナーが関与するデータ利用活動は、合法的な目的を有し、その目的の達成に必要な範囲に限定されなければなりません。当社は、パートナーのセキュリティ能力を全面的に評価し、協力に関する法的契約の遵守を要求します。

### 4.2 ユーザー情報の共同処理または委託処理

本プラットフォームおよび関連サービスの特定のモジュールまたは機能は、パートナーによって提供されます。当社は、合法、公正、必要、安全の原則に基づき、サービスの提供に必要な最小限の範囲でのみ、お客様のユーザー情報をパートナーに提供します。

### 4.3 ユーザー情報の移転

お客様の明示的な同意、法律・法令の要求、またはプラットフォーム運営の変更・合併・買収・破産清算が発生した場合を除き、当社はお客様のユーザー情報を他の第三者に移転しません。

### 4.4 ユーザー情報の開示

原則として、お客様の明示的な同意または国の法律・法令の要求がない限り、当社はお客様のユーザー情報を公開開示しません。

## 5. 当社がお客様の情報の安全をどのように保護するか

当社はユーザー情報の安全を非常に重視し、お客様の情報が権限のないアクセス、使用、または開示から保護されるよう、合理的なセキュリティ対策を講じています。

## 6. 当社がお客様のユーザー情報をどのように管理するか

お客様は、ご自身のユーザー情報にアクセスし、訂正し、削除する権利を有します。お客様は、本プラットフォームの設定ページで個人情報を管理するか、当社に連絡して処理を依頼できます。

## 7. 未成年者の利用条件

当社は、未成年者（18 歳未満）による本プラットフォームサービスの利用を許可していません。お客様が未成年者の場合は、直ちに当社のサービスの利用を停止してください。

## 8. プライバシーポリシーの改訂と通知

当社は、本プライバシーポリシーを随時改訂する場合があります。改訂後のプライバシーポリシーは、このページで公開され、公開日から効力を生じます。

## 9. 適用範囲

本プライバシーポリシーは、お客様が本プラットフォームのサービスを利用するすべての場面に適用されます。お客様が第三者のサービスを通じて本プラットフォームを利用する場合、第三者のプライバシーポリシーも遵守する必要があります。`,
  },
]
