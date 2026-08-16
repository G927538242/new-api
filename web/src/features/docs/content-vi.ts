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

export const docCategoriesVi = [
  'Bắt đầu',
  'Hướng dẫn tích hợp',
  'Tài liệu tham khảo API',
  'Nền tảng',
] as const

export const docPagesVi: DocPage[] = [
  {
    id: 'introduction',
    title: 'Giới thiệu sản phẩm',
    category: 'Bắt đầu',
    content: `# Giới thiệu sản phẩm

LingyiYun (零一云) là nền tảng cổng (gateway) mô hình nội địa tương thích với tiêu chuẩn API AI phổ biến.

**Nền tảng này giải quyết vấn đề gì?**

| Vấn đề | Giải pháp của LingyiYun |
|---|---|
| Dịch vụ AI nước ngoài truy cập không ổn định trong nước | Truy cập trực tiếp qua node nội địa, ổn định và đáng tin cậy |
| Các mô hình khác nhau phải tích hợp với các API khác nhau | Một địa chỉ duy nhất, định dạng giao diện chuẩn, không cần sửa code |
| Mô hình nước ngoài giá đắt | Kết nối các mô hình nội địa như DeepSeek / Qwen, chi phí thấp hơn nhiều lần |
| Quản lý nhiều mô hình phức tạp | Một Key gọi được tất cả các mô hình, quản lý hạn mức tập trung ở backend |
| Rủi ro tuân thủ khi dữ liệu chuyển ra nước ngoài | Dữ liệu đi qua kênh nội địa, tuân thủ và kiểm soát được |

**Năng lực cốt lõi**

**Tương thích giao diện chuẩn**: Tương thích định dạng API AI phổ biến, chỉ cần đổi \`base_url\`, code không cần thay đổi

**Bao phủ đầy đủ các loại mô hình**: Chat / Embedding / Hình ảnh / Giọng nói / Video / Kiểm duyệt / Rerank, 11 giao diện

**Ưu tiên mô hình nội địa**: DeepSeek, Qwen, GLM và các mô hình nội địa phổ biến khác dùng ngay, hiệu quả chi phí cao

**Quản lý đa Key**: Tạo nhiều token ở backend, kiểm soát riêng biệt hạn mức, quyền hạn, phạm vi truy cập mô hình

**Tính phí theo mức sử dụng**: Tính phí chi tiết ở mức Token, dùng bao nhiêu trừ bấy nhiêu, không có mức tiêu dùng tối thiểu

**Tích hợp trong một câu lệnh**

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)
\`\`\`

**Công cụ được hỗ trợ:** Cursor, Windsurf, Continue, JetBrains AI, VS Code Copilot, ChatBox, LobeChat, NextChat, Open WebUI và tất cả các công cụ hỗ trợ API AI chuẩn.`,
  },
  {
    id: 'quick-start',
    title: 'Bắt đầu nhanh',
    category: 'Bắt đầu',
    content: `# Bắt đầu nhanh

Hướng dẫn này giúp bạn hoàn tất việc tích hợp trong vòng 5 phút.

## Bước 1: Lấy API Key

Tất cả các cách tích hợp đều cần API Key để xác thực.

1. Truy cập / đăng nhập **Bảng điều khiển quản trị LingyiYun** (/dashboard)
2. Tại trang **Quản lý API Key** (hoặc "API Key") tạo và sao chép API Key của bạn
3. Bảo quản cẩn thận, không tiết lộ cho người khác

API Key là thông tin xác thực bắt buộc cho mọi cách tích hợp và sẽ được sử dụng nhiều lần trong các bước cấu hình sau. Nên lấy Key trước rồi tiếp tục các bước tiếp theo.

## Bước 2: Chọn cách tích hợp

LingyiYun hỗ trợ tích hợp nhiều loại client và công cụ, hãy chọn cách phù hợp với thói quen sử dụng của bạn:

| Cách tích hợp | Đối tượng phù hợp | Độ khó |
|---|---|---|
| **CC Switch** (Khuyến nghị) | Người cần quản lý nhiều công cụ AI (Claude Code / Codex / Claude Desktop...), thích giao diện đồ họa chuyển đổi một chạm | Dễ |
| Client Claude Code | Người dùng ứng dụng desktop / phiên bản terminal của Claude | Dễ |
| Dòng lệnh Codex | Nhà phát triển thích thao tác terminal, sử dụng OpenAI Codex | Dễ |
| Gọi API trực tiếp | Nhà phát triển tự viết code tích hợp | Trung bình |
| Công cụ lập trình AI (Cursor / Windsurf...) | Người dùng sử dụng hỗ trợ lập trình AI trong IDE | Dễ |

---

## Cách 1: CC Switch (Khuyến nghị)

CC Switch là công cụ giao diện đồ họa mã nguồn mở, quản lý tập trung cấu hình nhà cung cấp của nhiều công cụ AI như Claude Code, Claude Desktop, Codex, chuyển đổi một chạm, tiện lợi nhất.

### Cài đặt CC Switch (phiên bản v3.16.5 trở lên)

**Người dùng macOS (khuyến nghị Homebrew):**

\`\`\`bash
brew install --cask cc-switch
\`\`\`

**Hệ điều hành khác:** Truy cập [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) tải gói cài đặt tương ứng với nền tảng:

- macOS: Bản \`.dmg\` / \`.zip\`
- Windows: Bản cài đặt \`.msi\` / Bản portable \`.zip\`
- Linux: \`.deb\` / \`.rpm\` / \`.AppImage\`

> Nếu bị macOS Gatekeeper chặn khi mở lần đầu, vào "Cài đặt hệ thống → Quyền riêng tư & Bảo mật" và nhấp "Vẫn mở".

### Cấu hình LingyiYun làm nhà cung cấp

#### Tích hợp Claude Desktop

1. Mở CC Switch, ở đầu giao diện chính chuyển sang tab **Claude Desktop**.
2. Nhấp nút "Dấu cộng màu cam" ở góc trên bên phải, hiện hộp thoại "Thêm nhà cung cấp mới".
3. Trong "Nhà cung cấp cài sẵn" chọn "Cấu hình tùy chỉnh".
4. Điền các thông tin sau:
   - **Tên nhà cung cấp**: Ví dụ \`LingyiYun\`
   - **Địa chỉ yêu cầu API**: \`{{BASE_URL}}\`
   - **API Key**: Dán Key bạn lấy được từ bảng điều khiển
   - **Chọn mô hình**: Ví dụ \`deepseek-v3\` / \`qwen-max\` / \`glm-4\`...
5. Nhấp "+ Thêm" để lưu.
6. Nhấp "Bật" trên thẻ nhà cung cấp.
7. Khởi động lại hoàn toàn ứng dụng Claude Desktop là có thể sử dụng.

#### Tích hợp Codex

1. Mở CC Switch, ở đầu giao diện chính chuyển sang tab **Codex**.
2. Nhấp "Thêm nhà cung cấp" ở góc trên bên phải, chọn "Cấu hình tùy chỉnh".
3. Điền:
   - **Địa chỉ yêu cầu API**: \`{{BASE_URL}}\`
   - **API Key**: Key lấy từ bảng điều khiển
   - **Chọn mô hình**: Khuyến nghị \`deepseek-r1\`, \`glm-4\`
4. Nhấp "+ Thêm" → Bật nhà cung cấp đó.
5. Khởi động lại tiến trình Codex đang chạy để có hiệu lực (Codex không hỗ trợ chuyển đổi nóng).

---

## Cách 2: Client Claude Code

Claude Code là trợ lý lập trình AI trên terminal chính thức của Claude. Khuyến nghị quản lý qua CC Switch (xem Cách 1), cũng có thể tích hợp thủ công.

### Cài đặt client Claude Code

Truy cập [Trang chủ Claude](https://claude.ai/code/family) tải và cài đặt phiên bản tương ứng với hệ điều hành.

### Tích hợp bằng CC Switch (Khuyến nghị)

Tham khảo các bước "Tích hợp Claude Desktop" ở Cách 1, chọn tab **Claude Code** và thao tác tương tự.

> **Lưu ý người dùng Windows:** Nếu gặp lỗi \`Virtual Machine Platform not available\`, cần bật "Nền tảng máy ảo":
> 1. \`Win + R\` nhập \`optionalfeatures\` rồi Enter
> 2. Tích chọn "Nền tảng máy ảo (Virtual Machine Platform)" → OK
> 3. Khởi động lại máy rồi mở client Claude

---

## Cách 3: Dòng lệnh Codex

Codex là trợ lý lập trình AI trên terminal do OpenAI chính thức phát hành.

### Cài đặt Codex

- Khuyến nghị cài [Node.js](https://nodejs.org/zh-cn/download/) 22+
- Người dùng macOS cũng có thể trực tiếp: \`brew install codex\`
- Hoặc cài bằng npm:

\`\`\`bash
npm install -g @openai/codex
codex --version  # 显示版本号即安装成功
\`\`\`

### Cấu hình Provider (cấu hình từ đầu)

**Người dùng macOS / Linux:** Mở terminal và thực hiện:

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

**Người dùng Windows (PowerShell):**

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

### Thiết lập biến môi trường API Key

Thay \`<你的-API-key>\` bằng Key đã sao chép từ bảng điều khiển:

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
> Sau khi thực hiện, đóng cửa sổ PowerShell hiện tại và mở lại để có hiệu lực.

Sau khi hoàn tất, chạy \`codex\` trong terminal sẽ đi qua route của LingyiYun.

### Đã cài Codex, sửa cấu hình

Tệp cấu hình và biến môi trường giống với "cấu hình từ đầu", ghi đè trực tiếp là được.

---

## Cách 4: Gọi API trực tiếp

Nếu bạn tự viết code tích hợp, chỉ cần sửa một dòng \`base_url\`:

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

Hướng dẫn giao diện đầy đủ xem chương "Tài liệu tham khảo API" phía sau.

---

## Cách 5: Công cụ lập trình AI

Cấu hình của Cursor, Windsurf, Continue, JetBrains AI và các công cụ khác, tham khảo chương tiếp theo "Sử dụng trong các công cụ lập trình AI".

---

## Câu hỏi thường gặp

| Vấn đề | Giải pháp |
|---|---|
| Lấy API Key ở đâu? | Đăng nhập bảng điều khiển → Quản lý API Key → Tạo API Key |
| Cấu hình xong không có hiệu lực? | Kiểm tra đã khởi động lại client / mở lại terminal / làm mới trang chưa |
| Làm sao chuyển đổi mô hình khác? | Dùng CC Switch chuyển một chạm; hoặc sửa trường \`model\` trong tệp cấu hình / code |
| Báo hạn mức không đủ (402)? | Nạp tiền hoặc đổi Key có hạn mức |
| Báo vượt giới hạn tốc độ (429)? | Thử lại sau, hoặc liên hệ quản trị viên tăng hạn mức |

Nếu cần thêm trợ giúp, liên hệ đội ngũ hỗ trợ kỹ thuật.

---

## 1. Danh sách mô hình và hướng dẫn lựa chọn

### Truy vấn mô hình khả dụng

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`
\`data[].id\` trong kết quả trả về chính là giá trị tham số model khả dụng.

### Mô hình Chat

| Mô hình | Ngữ cảnh | Đặc điểm | Trường hợp sử dụng |
|---|---|---|---|
| \`deepseek-v3\` | 64K | Hiệu quả chi phí cao, khả năng tiếng Trung mạnh | Hội thoại hàng ngày, tạo nội dung |
| \`deepseek-r1\` | 64K | Mô hình chuỗi suy luận, quá trình tư duy hiển thị được | Toán học, suy luận logic, gỡ lỗi code |
| \`gpt-4o\` | 128K | Đa phương thức, năng lực tổng hợp mạnh | Tác vụ phức tạp, hiểu văn bản + hình ảnh |
| \`gpt-4o-mini\` | 128K | Tốc độ nhanh, chi phí thấp | Kịch bản đồng thời cao, hội thoại đơn giản |
| \`gpt-4.1\` | 1M | Ngữ cảnh siêu dài | Xử lý tài liệu dài, phân tích codebase |
| \`gpt-4.1-mini\` | 1M | Ngữ cảnh dài + chi phí thấp | Tóm tắt tài liệu dài |
| \`gpt-4.1-nano\` | 1M | Nhanh nhất và rẻ nhất | Tác vụ nhẹ như phân loại, trích xuất |
| \`o3\` | 200K | Tăng cường suy luận | Suy luận phức tạp, vấn đề khoa học |
| \`o4-mini\` | 200K | Suy luận + chi phí thấp | Tác vụ suy luận hàng ngày |
| \`claude-sonnet-4-20250514\` | 200K | Mạnh về lập trình và suy luận | Tạo code, phân tích |
| \`qwen-max\` | 32K | Tối ưu tiếng Trung | Kịch bản kinh doanh tiếng Trung |
| \`qwen-plus\` | 128K | Hiệu quả chi phí cao | Tác vụ tiếng Trung thông dụng |
| \`glm-4\` | 128K | Hiểu tiếng Trung tốt | Hội thoại, viết lách tiếng Trung |
| \`gemini-2.5-pro\` | 1M | Ngữ cảnh siêu dài + đa phương thức | Tài liệu dài, phân tích đa phương thức |

### Mô hình Embedding

| Mô hình | Chiều | Ghi chú |
|---|---|---|
| \`text-embedding-3-large\` | 3072 (có thể giảm chiều) | Độ chính xác cao, khuyến nghị dùng cho sản xuất |
| \`text-embedding-3-small\` | 1536 (có thể giảm chiều) | Tốc độ nhanh, chi phí thấp |
| \`text-embedding-ada-002\` | 1536 | Tương thích phiên bản cũ |

### Mô hình hình ảnh

| Mô hình | Kích thước tối đa | Tính năng đặc trưng |
|---|---|---|
| \`gpt-image-1\` | 1536x1024 | Nền trong suốt, kiểm soát mức kiểm duyệt |
| \`dall-e-3\` | 1792x1024 | Độ phân giải cao, chọn phong cách |
| \`dall-e-2\` | 1024x1024 | Tạo cơ bản, xuất nhiều ảnh |

### Mô hình giọng nói

| Mô hình | Mục đích | Ghi chú |
|---|---|---|
| \`tts-1\` | Chuyển văn bản thành giọng nói | Chất lượng chuẩn |
| \`tts-1-hd\` | Chuyển văn bản thành giọng nói | Âm thanh HD |
| \`gpt-4o-mini-tts\` | Chuyển văn bản thành giọng nói | Hỗ trợ chỉ dẫn phong cách |
| \`whisper-1\` | Giọng nói thành văn bản / dịch | Hỗ trợ đa ngôn ngữ |

### Mô hình video

| Mô hình | Ghi chú |
|---|---|
| \`kling-v2\` | Kuaishou Kling, văn bản thành video / hình ảnh thành video |
| \`veo-2\` | Tạo video của Google |
| \`cerve\` | Tạo video |

### Mô hình Rerank

| Mô hình | Ghi chú |
|---|---|
| \`cohere-rerank-v3\` | Cohere tái xếp hạng, khuyến nghị cho kịch bản RAG |

### Mô hình Moderation

| Mô hình | Ghi chú |
|---|---|
| \`omni-moderation-latest\` | Kiểm duyệt đa phương thức, hỗ trợ văn bản + hình ảnh |

**Gợi ý**: Mô hình thực tế khả dụng lấy theo kết quả trả về của \`GET /v1/models\`, nền tảng sẽ liên tục bổ sung mô hình mới.

## 2. Giải thích hạn mức và tính phí

### Cách tính phí

LingyiYun tính phí theo **mức sử dụng Token**, mỗi mô hình có giá khác nhau.

**Token đầu vào** (prompt_tokens): Nội dung bạn gửi cho mô hình

**Token đầu ra** (completion_tokens): Nội dung mô hình tạo ra

Thông thường, đơn giá Token đầu ra cao hơn Token đầu vào

### Token là gì

Token là đơn vị cơ bản để mô hình xử lý văn bản. Quy đổi gần đúng:

| Ngôn ngữ | 1 Token ≈ |
|---|---|
| Tiếng Anh | 4 ký tự / 0.75 từ |
| Tiếng Trung | 1~2 chữ Hán |

### Hệ số mô hình

Mỗi mô hình có giá khác nhau, quy đổi qua hệ số. Lấy GPT-4o-mini làm chuẩn (hệ số 1x):

| Mô hình | Hệ số đầu vào | Hệ số đầu ra | Ghi chú |
|---|---|---|---|
| gpt-4o-mini | 1x | 1x | Chuẩn |
| deepseek-v3 | 0.5x | 0.5x | Rẻ hơn |
| gpt-4o | 5x | 15x | Năng lực mạnh, giá cao |
| gpt-4.1 | 10x | 30x | Ngữ cảnh dài |
| claude-sonnet-4 | 6x | 30x | Mạnh về lập trình |

Hệ số chỉ mang tính tham khảo, lấy cấu hình backend làm chuẩn. Quản trị viên có thể điều chỉnh tại **Cài đặt vận hành → Bảng giá mô hình**.

### Truy vấn hạn mức

Đăng nhập backend quản trị, xem hạn mức đã dùng và hạn mức còn lại của Key tại **Quản lý API Key**

Hoặc lấy mức tiêu thụ lần này theo thời gian thực qua trường \`usage\` trong phản hồi

### Hết hạn mức

Khi Key dùng hết hạn mức, yêu cầu sẽ trả về:

\`\`\`json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
\`\`\`
Mã trạng thái HTTP là \`402\`. Lúc này cần nạp tiền hoặc đổi Key có hạn mức.

### Tính phí của các giao diện khác nhau

| Giao diện | Căn cứ tính phí |
|---|---|
| Chat / Responses | Token đầu vào + đầu ra |
| Embeddings | Token đầu vào |
| Images | Tính theo số ảnh và mô hình, không tính theo Token |
| Audio TTS | Tính theo số ký tự đầu vào |
| Audio STT / Translation | Tính theo thời lượng âm thanh |
| Video | Tính theo số lần |
| Moderation | Token đầu vào (thường rất nhỏ) |
| Rerank | Token đầu vào |

## 3. Giải thích giới hạn tốc độ

### Các chiều giới hạn

| Chiều | Ý nghĩa |
|---|---|
| RPM | Requests Per Minute, số yêu cầu mỗi phút |
| TPM | Tokens Per Minute, số Token mỗi phút |

### Quy tắc giới hạn

Giới hạn dựa trên chiều **API Key**, các Key khác nhau tính độc lập

Quản trị viên có thể đặt giới hạn khác nhau cho từng nhóm token ở backend

Giới hạn mặc định tùy thuộc cấu hình triển khai, giá trị cụ thể liên hệ quản trị viên để xác nhận

### Phản hồi vượt giới hạn

\`\`\`json
{
  "error": {
    "message": "Rate limit reached for default",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
\`\`\`
Mã trạng thái HTTP \`429\`.

### Header phản hồi

Thông tin giới hạn tốc độ được trả về qua HTTP response headers:

| Header | Ý nghĩa |
|---|---|
| \`X-RateLimit-Limit\` | Tổng giới hạn trong chu kỳ hiện tại |
| \`X-RateLimit-Remaining\` | Số lần còn lại trong chu kỳ hiện tại |
| \`X-RateLimit-Reset\` | Thời điểm reset giới hạn (Unix timestamp) |

### Chiến lược ứng phó

1. **Đọc response header**: Sau mỗi yêu cầu kiểm tra \`X-RateLimit-Remaining\`, dự đoán trước
2. **Giới hạn tốc độ trước khi gửi**: Client tự giới hạn cục bộ, đừng đợi đến 429 mới giảm tốc
3. **Backoff theo cấp số nhân**: Nhận 429 sau đó chờ 1s → 2s → 4s → 8s rồi thử lại
4. **Luân phiên nhiều Key**: Cấu hình nhiều Key, dùng luân phiên, tăng tổng thông lượng
5. **Giảm Token không cần thiết**: Rút gọn prompt, tránh lặp lại ngữ cảnh

#### Gọi batch

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["人工智能", "机器学习", "深度学习"]
)
for item in response.data:
    print(f"索引 {item.index}: {len(item.embedding)} 维")
\`\`\`

#### Giảm chiều

Dòng \`text-embedding-3\` hỗ trợ chỉ định chiều đầu ra, giảm chi phí lưu trữ:

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="人工智能改变世界",
    dimensions=512  # 默认3072维降到512维
)
\`\`\`
Giảm chiều sẽ làm giảm độ chính xác, khuyến nghị bắt đầu từ chiều cao, giảm dần theo hiệu quả.

| Tham số | Khuyến nghị |
|---|---|
| \`model\` | Mặc định \`cohere-rerank-v3\`, hiện phổ biến nhất |
| \`top_n\` | Thường đặt 3~5, không cần trả về quá nhiều |
| \`return_documents\` | Đặt \`true\`, khỏi cần tra nguyên văn theo index |`,
  },
  {
    id: 'ai-tools',
    title: 'Sử dụng trong các công cụ lập trình AI',
    category: 'Bắt đầu',
    content: `# Sử dụng LingyiYun trong các công cụ lập trình AI

Tài liệu này hướng dẫn cách tích hợp LingyiYun vào các công cụ lập trình AI phổ biến như Cursor, Windsurf, Continue, để các công cụ này sử dụng mô hình và hạn mức của riêng bạn.

## 1. Sử dụng LingyiYun trong Cursor

Cursor là một trong những công cụ lập trình AI phổ biến nhất hiện nay, hỗ trợ API tương thích tùy chỉnh. LingyiYun hoàn toàn tương thích định dạng giao diện chuẩn, cấu hình xong là dùng được.

### 1.1 Thêm mô hình

1. Mở Cursor, vào **Settings → Models**
2. Ở ô nhập phía dưới **Models Names** điền tên mô hình bạn muốn dùng, nhấp \`Add model\`

Các mô hình khuyến nghị thêm:

| Mục đích | Tên mô hình | Ghi chú |
|---|---|---|
| Lập trình hàng ngày | \`deepseek-v3\` | Hiệu quả chi phí tốt nhất, hiểu tiếng Trung tốt, khả năng lập trình mạnh |
| Suy luận phức tạp | \`deepseek-r1\` | Mô hình chuỗi suy luận, phù hợp gỡ lỗi, toán học, logic |
| Hội thoại thông dụng | \`qwen-max\` | Alibaba Tongyi, thể hiện xuất sắc trong kịch bản tiếng Trung |
| Văn bản dài | \`qwen-plus\` | Ngữ cảnh 128K, hiệu quả chi phí cao |
| Viết lách tiếng Trung | \`glm-4\` | Zhipu, hiểu và sinh tiếng Trung tốt |

3. Sau khi thêm, **bật công tắc** của mô hình tương ứng trong danh sách

### 1.2 Cấu hình API Key và Base URL

Trong cùng trang Settings → Models, tìm khu vực cấu hình API Key:

| Mục cấu hình | Nội dung điền |
|---|---|
| **API Key** | \`sk-your-key\` (token LingyiYun của bạn) |
| **Base URL** | \`{{BASE_URL}}/v1\` |

Sau khi điền xong nhấp \`Verify\`, hiển thị thành công là cấu hình hoàn tất.

### 1.3 Sử dụng mô hình trong Cursor

Sau khi cấu hình hoàn tất:

1. Mở bảng Chat của Cursor (phím tắt \`Cmd+L\` / \`Ctrl+L\`)
2. Trong hộp chọn thả xuống mô hình, chọn mô hình vừa thêm
3. Hội thoại bình thường là được, mọi yêu cầu sẽ đi qua LingyiYun

### 1.4 Cấu hình ngữ cảnh tài liệu @Docs

Tính năng \`@Docs\` của Cursor có thể đưa tài liệu bên ngoài vào hội thoại làm ngữ cảnh, giúp mô hình trả lời dựa trên tài liệu API của bạn.

Các bước cấu hình:

1. Mở Cursor Settings → Features → Docs
2. Nhấp \`Add new doc\`
3. Điền cấu hình:

| Mục cấu hình | Giá trị |
|---|---|
| **Name** | \`LingyiYun Docs\` |
| **URL** | Địa chỉ trang tài liệu của bạn |
| **Start URL** (Tùy chọn) | Địa chỉ trang chủ tài liệu |

4. Nhấp \`Save\` để lưu

### 1.5 Sử dụng @Docs để tham chiếu tài liệu

Trong Cursor Chat:

1. Nhập \`@Docs\`, chọn \`LingyiYun Docs\`
2. Sau đó nhập câu hỏi của bạn, ví dụ:

\`\`\`
@零一云 Docs 如何使用 Function Calling？
\`\`\`

Cursor sẽ tự động kéo nội dung tài liệu làm ngữ cảnh, mô hình trả lời chính xác dựa trên tài liệu.

## 2. Sử dụng LingyiYun trong Windsurf

Windsurf (trước đây là Codeium) cũng hỗ trợ API tương thích chuẩn.

### Các bước cấu hình

1. Mở Windsurf Settings → AI Provider
2. Chọn **OpenAI Compatible** hoặc **Custom Provider**
3. Điền cấu hình:

| Mục cấu hình | Giá trị |
|---|---|
| **API Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` hoặc mô hình khả dụng khác |

4. Lưu xong là có thể sử dụng trong Cascade và Chat

### Cách cấu hình qua tệp của Windsurf

Cũng có thể trực tiếp sửa tệp cấu hình \`~/.windsurf/settings.json\`:

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

## 3. Sử dụng LingyiYun trong Continue

Continue là trợ lý lập trình AI mã nguồn mở, hỗ trợ VS Code và JetBrains.

### Các bước cấu hình

Sửa tệp cấu hình Continue \`~/.continue/config.json\`:

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

### Giải thích cấu hình

| Trường | Ghi chú |
|---|---|
| \`models\` | Danh sách mô hình hội thoại, sẽ xuất hiện trong hộp chọn mô hình của Continue |
| \`tabAutocompleteModel\` | Mô hình hoàn thiện code, khuyến nghị dùng mô hình nhanh (deepseek-v3) |
| \`embeddingsProvider\` | Mô hình Embedding lập chỉ mục codebase |

Sau khi cấu hình xong khởi động lại VS Code / JetBrains, trong bảng Continue có thể chọn mô hình LingyiYun.

## 4. Sử dụng LingyiYun trong VS Code Copilot

GitHub Copilot hỗ trợ tích hợp API bên thứ ba qua tính năng mô hình tùy chỉnh của Copilot Chat.

### Các bước cấu hình

1. Cài đặt extension **GitHub Copilot** và **GitHub Copilot Chat**
2. Mở VS Code Settings → tìm kiếm \`github.copilot.chat\`
3. Cấu hình endpoint tùy chỉnh (cần VS Code 1.90+ và hỗ trợ mô hình tùy chỉnh của Copilot)

### Cấu hình qua biến môi trường

Đặt biến môi trường trong terminal rồi khởi động VS Code:

\`\`\`bash
export OPENAI_API_KEY=sk-your-key
export OPENAI_BASE_URL={{BASE_URL}}/v1
code .
\`\`\`

**Lưu ý**: Hỗ trợ mô hình tùy chỉnh của Copilot đang được phát triển liên tục, cách cấu hình cụ thể có thể thay đổi theo phiên bản. Nếu không hỗ trợ mô hình tùy chỉnh, khuyến nghị dùng Cursor hoặc Continue thay thế.

## 5. Sử dụng LingyiYun trong JetBrains AI

AI Assistant của IDE JetBrains (IntelliJ IDEA / PyCharm / WebStorm...) hỗ trợ endpoint tùy chỉnh.

### Các bước cấu hình

1. Mở **Settings → Tools → AI Assistant → Providers**
2. Chọn **OpenAI Compatible** hoặc **Custom Provider**
3. Điền:

| Mục cấu hình | Giá trị |
|---|---|
| **Server URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` hoặc mô hình khác |

4. Nhấp \`Test Connection\` để kiểm tra
5. Lưu xong là có thể sử dụng trong AI Assistant

## 6. Sử dụng trong công cụ hội thoại

Nếu bạn chỉ muốn dùng mô hình LingyiYun trong giao diện hội thoại (không phải công cụ lập trình), có thể qua các cách sau:

### Sử dụng client bên thứ ba

Client hỗ trợ API tùy chỉnh đều dùng được:

| Client | Nền tảng | Cách cấu hình |
|---|---|---|
| ChatBox | Desktop | Cài đặt → API Base URL + Key |
| NextChat | Web | Cài đặt → Địa chỉ giao diện + Key |
| LobeChat | Web/Desktop | Cài đặt → Dịch vụ mô hình → Địa chỉ proxy + Key |
| Open WebUI | Web | Cài đặt → API URL + Key |
| Cherry Studio | Desktop | Cài đặt → Địa chỉ API + Key |

Cấu hình chung:

| Mục cấu hình | Giá trị |
|---|---|
| API Base URL | \`{{BASE_URL}}/v1\` |
| API Key | \`sk-your-key\` |

## 7. Câu hỏi thường gặp

### Q: Verify trong Cursor thất bại thì làm sao?

Kiểm tra các điểm sau:

| Mục kiểm tra | Giá trị đúng |
|---|---|
| Base URL | \`{{BASE_URL}}/v1\` (cuối có \`/v1\`) |
| API Key | Bắt đầu bằng \`sk-\`, không có khoảng trắng thừa |
| Tên mô hình | Phải là id trả về từ \`GET /v1/models\`, chú ý phân biệt hoa thường |
| Kết nối mạng | \`curl {{BASE_URL}}/v1/models\` trả về bình thường |

### Q: Mô hình không xuất hiện trong Cursor?

- Xác nhận đã bật công tắc mô hình
- Thoát Cursor rồi mở lại
- Kiểm tra tên mô hình viết đúng chưa (viết thường toàn bộ, ví dụ \`deepseek-v3\` không phải \`DeepSeek-V3\`)

### Q: Hoàn thiện code rất chậm?

Hoàn thiện code nhạy cảm với độ trễ, khuyến nghị:

- Dùng mô hình nhanh: \`deepseek-v3\`
- Tránh dùng mô hình suy luận (\`deepseek-r1\`) để hoàn thiện code
- Người dùng Continue có thể cấu hình riêng mô hình nhanh trong \`tabAutocompleteModel\`

### Q: Hội thoại báo lỗi \`model_not_found\`?

Mô hình đó chưa được bật trong tài khoản LingyiYun của bạn. Liên hệ quản trị viên mở quyền, hoặc đổi sang mô hình khả dụng khác.

### Q: Nhiều công cụ có thể dùng chung một Key không?

Được, nhưng cần lưu ý:

- Mọi công cụ dùng chung hạn mức của Key, chú ý mức sử dụng
- Yêu cầu đồng thời dùng chung giới hạn tốc độ của Key
- Khuyến nghị mỗi công cụ dùng Key riêng, tiện quản lý và giám sát

### Q: Có thể cấu hình đồng thời dịch vụ khác và LingyiYun không?

**Cursor**: Không hỗ trợ cấu hình hai endpoint cùng lúc, endpoint cấu hình sau sẽ ghi đè. Nếu cần dùng đồng thời, khuyến nghị dùng Continue hoặc công cụ khác phân quyền.

**Continue**: Hỗ trợ, chỉ cần thêm cấu hình \`apiBase\` khác nhau vào mảng \`models\`.

### Q: Cấu hình @Docs xong không tham chiếu được nội dung?

- Xác nhận URL tài liệu truy cập được qua mạng công cộng
- Thử mở URL đã cấu hình trong trình duyệt để xác nhận trang hoạt động bình thường
- Nếu là trang tài liệu nội bộ, Cursor có thể không thu thập được

### Q: Lập chỉ mục Embedding của Continue báo lỗi?

Xác nhận cấu hình \`embeddingsProvider\` đúng:

\`\`\`json
{
  "provider": "openai",
  "model": "text-embedding-3-large",
  "apiBase": "{{BASE_URL}}/v1",
  "apiKey": "sk-your-key"
}
\`\`\`
Nếu vẫn báo lỗi, kiểm tra Key có quyền gọi giao diện Embedding không.

## Bảng tra cứu nhanh cấu hình

Cấu hình cốt lõi của mọi công cụ chỉ có hai mục:

| Mục cấu hình | Giá trị |
|---|---|
| **Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |

Vị trí cấu hình của từng công cụ:

| Công cụ | Vị trí cấu hình | Ghi chú |
|---|---|---|
| Cursor | Settings → Models → API Key | Điền Base URL + Key |
| Windsurf | Settings → AI Provider | Chọn Compatible |
| Continue | \`~/.continue/config.json\` | Sửa tệp cấu hình |
| JetBrains | Settings → Tools → AI Assistant | Chọn Custom Provider |
| ChatBox | Cài đặt → API | Điền địa chỉ + Key |
| LobeChat | Cài đặt → Dịch vụ mô hình | Điền địa chỉ proxy + Key |
| NextChat | Cài đặt → Giao diện | Điền địa chỉ + Key |
| Open WebUI | Cài đặt → API | Điền API URL + Key |`,
  },
  {
    id: 'api-quick-start',
    title: 'Khởi động nhanh',
    category: 'Hướng dẫn tích hợp',
    content: `# Khởi động nhanh

Cách gọi tối giản (cURL):

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}]
  }'
\`\`\`

**Điểm cốt lõi**: Chỉ cần đổi \`base_url\` và \`api_key\`, phần còn lại của code hoàn toàn giống OpenAI chính thức.

### Danh sách giao diện được hỗ trợ

| Giao diện | Phương thức | Đường dẫn | Ghi chú |
|---|---|---|---|
| Danh sách mô hình | GET | \`/v1/models\` | Xem mô hình khả dụng |
| Hoàn tất hội thoại | POST | \`/v1/chat/completions\` | Giao diện Chat, hỗ trợ streaming |
| Responses | POST | \`/v1/responses\` | OpenAI Responses API, hỗ trợ streaming |
| Vector hóa văn bản | POST | \`/v1/embeddings\` | Giao diện Embedding |
| Tạo hình ảnh | POST | \`/v1/images/generations\` | Văn bản thành hình ảnh |
| Chuyển văn bản thành giọng nói | POST | \`/v1/audio/speech\` | TTS, trả về luồng âm thanh |
| Chuyển giọng nói thành văn bản | POST | \`/v1/audio/transcriptions\` | STT, tải lên tệp âm thanh |
| Dịch giọng nói | POST | \`/v1/audio/translations\` | Dịch âm thanh sang tiếng Anh |
| Tạo video | POST | \`/v1/video/generations\` | Văn bản thành video / hình ảnh thành video |
| Kiểm duyệt nội dung | POST | \`/v1/moderations\` | Kiểm duyệt an toàn văn bản/hình ảnh |
| Tái xếp hạng | POST | \`/v1/rerank\` | Sắp xếp mức độ liên quan của tài liệu |`,
  },
  {
    id: 'get-api-key',
    title: 'Lấy API Key',
    category: 'Hướng dẫn tích hợp',
    content: `# Lấy API Key

1. Đăng nhập backend quản trị LingyiYun
2. Vào trang API Key
3. Nhấp【Tạo API Key mới】điền tên và hạn mức
4. Sau khi tạo thành công, sao chép key bắt đầu bằng \`sk-\`

**Lưu ý**: Key chỉ hiển thị một lần khi tạo, hãy lưu ngay. Nếu quên, cần xóa và tạo lại.

### Định dạng Key

\`\`\`
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`
Bắt đầu bằng \`sk-\`, theo sau là chuỗi ký tự ngẫu nhiên. Khi gọi API đặt vào trường \`Authorization\` trong HTTP Header.`,
  },
  {
    id: 'auth',
    title: 'Phương thức xác thực',
    category: 'Hướng dẫn tích hợp',
    content: `# Phương thức xác thực

LingyiYun sử dụng xác thực **Bearer Token**, mọi giao diện đều cần mang theo.

### Định dạng Header

\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

### Ví dụ cURL

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### Cấu hình trong SDK

\`\`\`python
# Python
client = OpenAI(api_key="sk-your-api-key", base_url="{{BASE_URL}}/v1")
\`\`\`

\`\`\`javascript
// Node.js
const client = new OpenAI({ apiKey: "sk-your-api-key", baseURL: "{{BASE_URL}}/v1" });
\`\`\`

### Biểu hiện khi xác thực thất bại

Trả về mã trạng thái HTTP \`401\`

Nội dung phản hồi:

\`\`\`json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

Nguyên nhân thường gặp:

- Key viết sai hoặc thiếu tiền tố \`sk-\`
- Key đã bị xóa hoặc bị vô hiệu hóa
- Định dạng Header sai (giữa \`Bearer\` và \`sk-\` chỉ có một khoảng trắng)`,
  },
  {
    id: 'request-url',
    title: 'Địa chỉ yêu cầu',
    category: 'Hướng dẫn tích hợp',
    content: `# Địa chỉ yêu cầu

### Base URL

\`\`\`
{{BASE_URL}}
\`\`\`

### Quy tắc địa chỉ đầy đủ

\`\`\`
{Base URL}{接口路径}
\`\`\`

Ví dụ:

| Giao diện | Địa chỉ đầy đủ |
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

### Thiết lập Base URL trong SDK

Chỉ cần đặt \`base_url\` thành \`{{BASE_URL}}/v1\` (chú ý cuối có \`/v1\`), SDK sẽ tự động nối các đường dẫn tiếp theo.`,
  },
  {
    id: 'error-codes',
    title: 'Giải thích mã lỗi',
    category: 'Hướng dẫn tích hợp',
    content: `# Giải thích mã lỗi

### Mã trạng thái HTTP

| Mã trạng thái | Ý nghĩa | Khuyến nghị xử lý |
|---|---|---|
| 200 | Thành công | Xử lý phản hồi bình thường |
| 400 | Lỗi tham số yêu cầu | Kiểm tra định dạng request body và tham số bắt buộc |
| 401 | Xác thực thất bại | Kiểm tra API Key có đúng không |
| 402 | Hạn mức không đủ | Nạp tiền hoặc đổi Key có hạn mức |
| 403 | Không có quyền | Key này không có quyền truy cập mô hình hoặc giao diện đó |
| 404 | Giao diện không tồn tại | Kiểm tra đường dẫn yêu cầu có đúng không |
| 429 | Vượt giới hạn tần suất yêu cầu | Giảm tần suất yêu cầu, hoặc liên hệ quản trị viên tăng hạn mức |
| 500 | Lỗi nội bộ máy chủ | Thử lại sau; nếu liên tục xảy ra thì liên hệ vận hành |
| 502 | Lỗi gateway | Dịch vụ thượng nguồn bất thường, thử lại sau |
| 503 | Dịch vụ không khả dụng | Dịch vụ tạm thời quá tải, thử lại sau |

### Định dạng phản hồi lỗi

Mọi lỗi đều tuân theo định dạng thống nhất:

\`\`\`json
{
  "error": {
    "message": "具体错误描述",
    "type": "错误类型",
    "code": "错误码"
  }
}
\`\`\`

### Mã lỗi thường gặp

| code | Ý nghĩa | Kịch bản kích hoạt |
|---|---|---|
| \`invalid_api_key\` | API Key không hợp lệ | Key viết sai, đã bị xóa, đã bị vô hiệu hóa |
| \`insufficient_quota\` | Hạn mức không đủ | Key hết số dư |
| \`model_not_found\` | Mô hình không tồn tại | Truyền tham số model không tồn tại |
| \`context_length_exceeded\` | Đầu vào quá dài | Tổng độ dài messages vượt cửa sổ ngữ cảnh của mô hình |
| \`rate_limit_exceeded\` | Vượt giới hạn tần suất | Gửi quá nhiều yêu cầu trong thời gian ngắn |
| \`invalid_request_error\` | Sai định dạng yêu cầu | Thiếu tham số bắt buộc, sai kiểu... |
| \`server_error\` | Lỗi máy chủ | Ngoại lệ nội bộ, thường thử lại là khôi phục |

### Khuyến nghị thử lại

**429 / 500 / 502 / 503**: Có thể thử lại, khuyến nghị backoff theo cấp số nhân (1s → 2s → 4s → 8s)

**400 / 401 / 402 / 403 / 404**: Không thử lại, sửa yêu cầu trước

Cùng một yêu cầu thử lại tối đa 3 lần`,
  },
  {
    id: 'streaming',
    title: 'Hướng dẫn đầu ra dạng luồng',
    category: 'Hướng dẫn tích hợp',
    content: `# Hướng dẫn đầu ra dạng luồng

Đầu ra dạng luồng (streaming) dùng cho giao diện Chat và Responses, trả về nội dung từng khối, trải nghiệm người dùng tốt hơn (không cần đợi sinh xong toàn bộ mới hiển thị).

### Cách bật

Đặt \`stream: true\` trong request body:

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "写一首诗"}],
  "stream": true
}
\`\`\`

### Định dạng phản hồi (SSE)

Phản hồi dạng luồng sử dụng giao thức **Server-Sent Events (SSE)**, Content-Type là \`text/event-stream\`.

Định dạng từng khối dữ liệu:

\`\`\`
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

**Điểm mấu chốt:**

- Mỗi dữ liệu bắt đầu bằng \`data: \`, theo sau là JSON
- Dòng cuối là \`data: [DONE]\`, biểu thị kết thúc luồng
- \`delta.content\` của mỗi chunk là đoạn văn bản mới tăng lên lần này, ghép lại chính là phản hồi đầy đủ
- \`finish_reason\` là \`stop\` biểu thị kết thúc bình thường

### Gọi streaming bằng cURL

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

### Gọi streaming bằng Python SDK

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

### Gọi streaming bằng Node.js SDK

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

### Thông tin Usage trong đầu ra dạng luồng

Mặc định phản hồi dạng luồng **không bao gồm** usage (mức dùng Token). Nếu cần, đặt \`stream_options\`:

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true,
  "stream_options": {"include_usage": true}
}
\`\`\`

Sau khi đặt, chunk cuối sẽ chứa trường usage đầy đủ:

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
\`\`\`

### Đầu ra dạng luồng của giao diện Responses

Responses API cũng hỗ trợ \`stream: true\`, định dạng tương tự Chat, cũng là giao thức SSE, cuối kết thúc bằng \`data: [DONE]\`.

### Lưu ý khi tự phân tích SSE

Nếu bạn không dùng SDK mà tự phân tích luồng SSE, chú ý các điểm sau:

1. **Đọc theo dòng**: Mỗi dữ liệu chiếm một dòng, bắt đầu bằng \`data: \`
2. **Bỏ qua dòng trống**: Trong giao thức SSE, dòng trống là dấu phân cách sự kiện, không ảnh hưởng đến dữ liệu
3. **Phát hiện kết thúc**: Gặp \`data: [DONE]\` thì dừng đọc
4. **Xử lý mất kết nối**: Khi mạng ngắt có thể thử lại, nhưng không thể tiếp tục từ điểm dừng, cần gửi lại yêu cầu
5. **Thiết lập timeout**: Khuyến nghị timeout của HTTP client đặt từ 60 giây trở lên, sinh văn bản dài có thể mất nhiều thời gian

### So sánh streaming và không streaming

| Chiều | Không streaming (\`stream: false\`) | Streaming (\`stream: true\`) |
|---|---|---|
| Cách phản hồi | Trả về kết quả đầy đủ một lần | Trả về từng đoạn văn bản |
| Cảm nhận người dùng | Thời gian chờ lâu | Từng chữ xuất hiện, cảm giác nhanh hơn |
| Định dạng phản hồi | \`chat.completion\` | \`chat.completion.chunk\` |
| Usage | Bao gồm theo mặc định | Cần đặt \`stream_options\` |
| Kịch bản phù hợp | Xử lý batch backend, chuỗi API | Hội thoại frontend, tương tác thời gian thực |
| Độ khó phân tích | Đơn giản, đọc JSON trực tiếp | Cần phân tích SSE |`,
  },
  {
    id: 'chat-completions',
    title: 'Hoàn tất hội thoại',
    category: 'Tài liệu tham khảo API',
    content: `# Hoàn tất hội thoại

> **POST** \`/v1/chat/completions\`

Tạo hoàn tất hội thoại. Hỗ trợ hai chế độ streaming (SSE) và không streaming.

- Không streaming: Đặt \`stream: false\` (mặc định), trả về phản hồi đầy đủ
- Streaming: Đặt \`stream: true\`, trả về ChatCompletionChunk từng khối qua SSE

## Tham số yêu cầu

### Tham số Header

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`Authorization\` | string | Có | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | Không | Định danh duy nhất của yêu cầu, dùng để truy vết liên kết |
| \`X-Tenant-Id\` | string | Không | Định danh tenant, dùng để cách ly trong kịch bản đa tenant |
| \`X-Channel\` | enum | Không | Định danh kênh gọi (web/app/api/miniapp), mặc định api |

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Có | ID mô hình, ví dụ \`deepseek-v3\` |
| \`messages\` | array | Có | Danh sách tin nhắn hội thoại |
| \`temperature\` | number | Không | Nhiệt độ lấy mẫu, 0~2, mặc định 0.7 |
| \`top_p\` | number | Không | Xác suất lấy mẫu hạt nhân, 0~1, mặc định 1 |
| \`max_tokens\` | integer | Không | Số Token sinh tối đa |
| \`stream\` | boolean | Không | Có xuất dạng luồng hay không, mặc định false |
| \`stream_options\` | object | Không | Tùy chọn streaming, ví dụ \`{"include_usage": true}\` |
| \`tools\` | array | Không | Danh sách công cụ có thể gọi |
| \`tool_choice\` | string/object | Không | Chiến lược chọn công cụ (none/auto/required) |
| \`response_format\` | object | Không | Định dạng phản hồi, ví dụ \`{"type": "json_object"}\` |
| \`stop\` | string/array | Không | Chuỗi dừng |
| \`presence_penalty\` | number | Không | Hình phạt hiện diện, mặc định 0 |
| \`frequency_penalty\` | number | Không | Hình phạt tần suất, mặc định 0 |
| \`n\` | integer | Không | Số lượng ứng viên sinh, mặc định 1 |
| \`user\` | string | Không | Định danh người dùng |

### Ví dụ yêu cầu

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

### Ví dụ cURL

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

## Phản hồi trả về

### 200 Thành công

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

### 401 Xác thực thất bại`,
  },
  {
    id: 'models',
    title: 'Liệt kê mô hình khả dụng',
    category: 'Tài liệu tham khảo API',
    content: `# Liệt kê mô hình khả dụng

> **GET** \`/v1/models\`

Trả về danh sách mô hình hiện khả dụng

## Tham số yêu cầu

### Tham số Header

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`Authorization\` | string | Có | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | Không | Định danh duy nhất của yêu cầu |
| \`X-Tenant-Id\` | string | Không | Định danh tenant |
| \`X-Channel\` | enum | Không | Định danh kênh gọi, mặc định api |

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/models' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Phản hồi trả về

### 200 Thành công

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
    category: 'Tài liệu tham khảo API',
    content: `# Responses API

> **POST** \`/v1/responses\`

OpenAI Responses API. Hỗ trợ đầu vào văn bản và mảng tin nhắn, trả về đối tượng Response có cấu trúc, bao gồm message output và usage.

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Có | ID mô hình, ví dụ \`qwen-plus\` |
| \`input\` | string/array | Có | Nội dung đầu vào, hỗ trợ chuỗi hoặc mảng tin nhắn |
| \`instructions\` | string | Không | Chỉ dẫn hệ thống |
| \`temperature\` | number | Không | Nhiệt độ lấy mẫu |
| \`max_output_tokens\` | integer | Không | Số Token đầu ra tối đa |
| \`stream\` | boolean | Không | Có xuất dạng luồng hay không, mặc định false |
| \`tools\` | array | Không | Danh sách công cụ có thể gọi |
| \`user\` | string | Không | Định danh người dùng |

### Ví dụ yêu cầu

\`\`\`json
{
    "model": "qwen-plus",
    "input": "介绍北京"
}
\`\`\`

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/responses' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "qwen-plus",
    "input": "介绍北京"
}'
\`\`\`

## Phản hồi trả về

### 200 Thành công

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
    title: 'Vector hóa văn bản',
    category: 'Tài liệu tham khảo API',
    content: `# Vector hóa văn bản

> **POST** \`/v1/embeddings\`

Chuyển văn bản thành biểu diễn vector, hỗ trợ đầu vào batch

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Có | ID mô hình, ví dụ \`text-embedding-3-large\` |
| \`input\` | string/array | Có | Văn bản đầu vào, hỗ trợ một mục hoặc mảng |
| \`encoding_format\` | enum | Không | Định dạng mã hóa (float/base64), mặc định float |
| \`dimensions\` | integer | Không | Chiều vector (chỉ dòng text-embedding-3 hỗ trợ) |

### Ví dụ yêu cầu

\`\`\`json
{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}
\`\`\`

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/embeddings' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}'
\`\`\`

## Phản hồi trả về

### 200 Thành công

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
    title: 'Tạo hình ảnh',
    category: 'Tài liệu tham khảo API',
    content: `# Tạo hình ảnh

> **POST** \`/v1/images/generations\`

Tạo hình ảnh theo gợi ý văn bản.

**Bảng kích thước:**

| Mô hình | Kích thước hỗ trợ |
|---|---|
| wanx-v2 | 1024x1024 / 720x1280 / 1280x720 / auto |
| cogview-4 | 1024x1024 / 768x1344 / 1344x768 |
| cogview-3-plus | 1024x1024 / 768x1344 / 1344x768 |

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Có | Mô hình tạo hình ảnh (wanx-v2 / cogview-4 / cogview-3-plus) |
| \`prompt\` | string | Có | Văn bản mô tả hình ảnh |
| \`n\` | integer | Không | Số lượng tạo (1~10, cogview-3-plus chỉ hỗ trợ 1) |
| \`size\` | string | Không | Kích thước hình ảnh |
| \`quality\` | enum | Không | Chất lượng hình ảnh (low/medium/high/auto) |
| \`background\` | enum | Không | Độ trong suốt nền (transparent/opaque/auto), chỉ wanx-v2 |
| \`moderation\` | enum | Không | Mức kiểm duyệt nội dung (low/auto), chỉ wanx-v2 |
| \`response_format\` | enum | Không | Định dạng trả về (url/b64_json), mặc định url |
| \`style\` | enum | Không | Phong cách hình ảnh (vivid/natural), chỉ cogview-3-plus |
| \`user\` | string | Không | Định danh người dùng |

### Ví dụ yêu cầu

\`\`\`json
{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}
\`\`\`

### Ví dụ cURL

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

## Phản hồi trả về

### 200 Thành công

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
    title: 'Chuyển văn bản thành giọng nói (TTS)',
    category: 'Tài liệu tham khảo API',
    content: `# Chuyển văn bản thành giọng nói (TTS)

> **POST** \`/v1/audio/speech\`

Tổng hợp văn bản thành giọng nói, trả về luồng âm thanh

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Có | ID mô hình TTS, ví dụ \`cosyvoice-v2\` |
| \`voice\` | enum | Có | Giọng đọc |
| \`input\` | string | Có | Văn bản cần tổng hợp |
| \`response_format\` | enum | Không | Định dạng âm thanh đầu ra (mp3/opus/aac/flac/wav/pcm), mặc định mp3 |
| \`speed\` | number | Không | Tốc độ đọc (0.25~4), mặc định 1 |
| \`instructions\` | string | Không | Chỉ dẫn phong cách giọng nói (chỉ cosyvoice-v2) |

### Ví dụ yêu cầu

\`\`\`json
{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}
\`\`\`

### Ví dụ cURL

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

## Phản hồi trả về

### 200 Thành công

Trả về luồng âm thanh (binary), Content-Type: audio/mpeg`,
  },
  {
    id: 'stt',
    title: 'Chuyển giọng nói thành văn bản (STT)',
    category: 'Tài liệu tham khảo API',
    content: `# Chuyển giọng nói thành văn bản (STT)

> **POST** \`/v1/audio/transcriptions\`

Chuyển tệp âm thanh thành văn bản

## Tham số yêu cầu

### Tham số Body (multipart/form-data)

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`file\` | file | Có | Tệp âm thanh |
| \`model\` | string | Có | Mô hình nhận dạng giọng nói, ví dụ \`sensevoice-v1\` |
| \`language\` | string | Không | Ngôn ngữ âm thanh (ISO 639-1, ví dụ zh、en) |
| \`response_format\` | enum | Không | Định dạng đầu ra (json/text/srt/verbose_json/vtt), mặc định json |
| \`temperature\` | number | Không | Nhiệt độ lấy mẫu |

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/transcriptions' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'language="zh"' \\
--form 'response_format="json"'
\`\`\`

## Phản hồi trả về

### 200 Thành công

\`\`\`json
{
    "text": "你好，欢迎使用语音识别服务。"
}
\`\`\``,
  },
  {
    id: 'translation',
    title: 'Dịch giọng nói',
    category: 'Tài liệu tham khảo API',
    content: `# Dịch giọng nói

> **POST** \`/v1/audio/translations\`

Dịch tệp âm thanh thành văn bản tiếng Anh

## Tham số yêu cầu

### Tham số Body (multipart/form-data)

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`file\` | file | Có | Tệp âm thanh |
| \`model\` | string | Có | Mô hình dịch giọng nói, ví dụ \`sensevoice-v1\` |
| \`response_format\` | enum | Không | Định dạng đầu ra (json/text/srt/verbose_json/vtt), mặc định json |
| \`temperature\` | number | Không | Nhiệt độ lấy mẫu |

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/translations' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'response_format="json"'
\`\`\`

## Phản hồi trả về

### 200 Thành công

\`\`\`json
{
    "text": "Hello, welcome to the speech translation service."
}
\`\`\``,
  },
  {
    id: 'video',
    title: 'Tạo video',
    category: 'Tài liệu tham khảo API',
    content: `# Tạo video

> **POST** \`/v1/video/generations\`

Tạo video theo gợi ý văn bản, hỗ trợ hai chế độ thuần văn bản thành video và hình ảnh thành video, tương thích giao thức tạo video Seedance (Sendance) của Doubao.

- Văn bản thành video: Chỉ cung cấp prompt
- Hình ảnh thành video: Cung cấp prompt + image_url (Seedance hỗ trợ nhiều ảnh: first_frame / last_frame / reference_image)

## Mô hình được hỗ trợ

### Dòng Seedance

| Mô hình | Ghi chú |
|---|---|
| \`doubao-seedance-1-0-pro-250528\` | 1.0 Pro, tạo video chất lượng cao |
| \`doubao-seedance-1-0-lite-t2v\` | 1.0 Lite, văn bản thành video |
| \`doubao-seedance-1-0-lite-i2v\` | 1.0 Lite, hình ảnh thành video |
| \`doubao-seedance-1-5-pro-251215\` | 1.5 Pro, hiệu năng nâng cao |
| \`doubao-seedance-2-0-260128\` | 2.0 phiên bản tiêu chuẩn |
| \`doubao-seedance-2-0-fast-260128\` | 2.0 phiên bản nhanh, độ trễ thấp |
| \`doubao-seedance-2-0-mini-260615\` | 2.0 Mini, nhẹ và chi phí thấp |
| \`doubao-seedance-2-5-260628\` | 2.5 phiên bản mới nhất |

### Mô hình khác

\`kling-v1\` / \`kling-v2\` / \`cogvideox-2\` / \`vidu-1\` / \`jimeng\` / \`sora\`

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Có | Mô hình tạo video (khuyến nghị dòng Seedance) |
| \`prompt\` | string | Có | Văn bản mô tả video |
| \`image_url\` | string | Không | URL hình ảnh tham chiếu (chế độ hình ảnh thành video) |
| \`images\` | array | Không | Đầu vào nhiều ảnh (Seedance hình ảnh thành video, ánh xạ theo thứ tự first_frame / last_frame / reference_image) |
| \`resolution\` | string | Không | Độ phân giải đầu ra (Seedance: 480p / 720p / 1080p / 4k) |
| \`ratio\` | string | Không | Tỷ lệ khung hình (Seedance: 16:9 / 9:16 / 1:1) |
| \`size\` | string | Không | Kích thước video, ví dụ 1280x720 |
| \`duration\` | integer | Không | Thời lượng video (giây) |
| \`n\` | integer | Không | Số lượng tạo, mặc định 1 |
| \`metadata\` | object | Không | Tham số mở rộng, hỗ trợ đầu vào đa phương thức (video_url / audio_url) và negative_prompt、style、watermark... |

### Ví dụ yêu cầu (văn bản thành video)

\`\`\`json
{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9"
}
\`\`\`

### Ví dụ yêu cầu (hình ảnh thành video)

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

### Ví dụ yêu cầu (viết tiếp video / đa phương thức)

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

### Ví dụ cURL

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

## Phản hồi trả về

### 200 Thành công

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

> **Lưu ý**: Seedance 2.0 / 2.5 hỗ trợ đầu vào đa phương thức (video + âm thanh + hình ảnh), có thể truyền qua \`metadata.content\`; sau khi gửi tác vụ cần thăm dò trạng thái tác vụ qua \`GET /v1/video/generations/{task_id}\`.`,
  },
  {
    id: 'asset-library',
    title: 'Thư viện tài nguyên',
    category: 'Tài liệu tham khảo API',
    content: `# Thư viện tài nguyên

Thư viện tài nguyên dùng để quản lý tài nguyên đa phương thức cần thiết cho việc tạo video. Khách hàng có thể tải lên tài nguyên hình ảnh / video / âm thanh qua giao diện bên ngoài, sau đó khi gọi giao diện tạo video (\`/v1/video/generations\`), tham chiếu các tài nguyên này dưới dạng URL làm đầu vào đa phương thức cho Seedance (Sendance).

## Danh sách giao diện

| Phương thức | Đường dẫn | Ghi chú |
|---|---|---|
| \`POST\` | \`/api/asset\` | Tải lên tài nguyên |
| \`GET\` | \`/api/asset\` | Lấy danh sách tài nguyên (phân trang) |
| \`GET\` | \`/api/asset/search\` | Tìm kiếm tài nguyên |
| \`GET\` | \`/api/asset/{id}\` | Lấy chi tiết tài nguyên |
| \`DELETE\` | \`/api/asset/{id}\` | Xóa tài nguyên |

Mọi giao diện thư viện tài nguyên đều cần mang \`Authorization: Bearer <token>\` (token người dùng nền tảng), người dùng thường chỉ truy cập được tài nguyên của mình, quản trị viên có thể xem / quản lý mọi tài nguyên.

## Tải lên tài nguyên

> **POST** \`/api/asset\`

Tải lên tệp tài nguyên bằng \`multipart/form-data\`.

### Tham số yêu cầu

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`file\` | file | Có | Tệp tài nguyên |
| \`group_id\` | integer | Có | ID nhóm tài nguyên (tài nguyên phải thuộc về một nhóm) |
| \`model\` | string | Có | Định danh mô hình tạo, ví dụ \`sendance-2.0\` / \`sendance-2.5\` |
| \`channel_id\` | integer | Không | ID kênh nguồn (mặc định là kênh của nhóm) |

### Giới hạn kích thước tệp (căn chỉnh với Volcano Engine Seedance)

| Loại | Giới hạn kích thước |
|---|---|
| Hình ảnh (image) | 30MB |
| Video (video) | 200MB |
| Âm thanh (audio) | 15MB |

Loại tài nguyên được tự động nhận dạng theo MIME type của tệp: \`image/*\` → image、\`video/*\` → video、\`audio/*\` → audio, các loại khác sẽ bị từ chối.

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@/path/to/video.mp4' \\
--form 'group_id=1' \\
--form 'model=sendance-2.0'
\`\`\`

### Ví dụ phản hồi

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

> Trường \`url\` trả về sau khi tải lên thành công chính là địa chỉ truy cập tài nguyên, có thể dùng trực tiếp cho giao diện tạo video.

## Lấy danh sách tài nguyên

> **GET** \`/api/asset\`

Lấy danh sách tài nguyên có phân trang, hỗ trợ lọc theo loại và mô hình.

### Tham số truy vấn

| Tham số | Kiểu | Ghi chú |
|---|---|---|
| \`type\` | string | Loại tài nguyên (image / video / audio) |
| \`model\` | string | Định danh mô hình tạo (ví dụ \`sendance-2.0\`) |
| \`page\` | integer | Số trang, mặc định 0 |
| \`page_size\` | integer | Số lượng mỗi trang, mặc định 10 |
| \`user_id\` | integer | ID người dùng (chỉ quản trị viên) |
| \`tenant_id\` | integer | ID tenant (chỉ quản trị viên) |

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset?type=video&model=sendance-2.0&page=0&page_size=20' \\
--header 'Authorization: Bearer <token>'
\`\`\`

### Ví dụ phản hồi

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

## Tìm kiếm tài nguyên

> **GET** \`/api/asset/search\`

Tìm kiếm tài nguyên theo từ khóa, tham số giống với lấy danh sách tài nguyên, bổ sung hỗ trợ:

| Tham số | Kiểu | Ghi chú |
|---|---|---|
| \`keyword\` | string | Từ khóa tìm kiếm (khớp tên tài nguyên) |

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/search?keyword=开场' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Lấy chi tiết tài nguyên

> **GET** \`/api/asset/{id}\`

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Xóa tài nguyên

> **DELETE** \`/api/asset/{id}\`

Chỉ chủ sở hữu tài nguyên hoặc quản trị viên mới có thể xóa.

\`\`\`bash
curl --location --request DELETE '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Tài nguyên dùng cho tạo video Seedance

Sau khi tải lên tài nguyên, dùng \`url\` trả về làm đầu vào đa phương thức của giao diện tạo video:

> **Ghi chú**: Khi nền tảng gửi tác vụ tạo video, sẽ tự động đọc tài nguyên **hình ảnh** trong thư viện tài nguyên và chuyển đổi thành mã hóa Base64 (\`data:image/...;base64,...\`) gửi lên Volcano Ark thượng nguồn, bạn không cần chuẩn bị thêm địa chỉ tĩnh truy cập được qua mạng công cộng; các URL công cộng tự lưu trữ không tồn tại trong thư viện tài nguyên, mã hóa Base64, ID tài nguyên \`asset://\` sẽ được chuyển tiếp nguyên trạng. Tài nguyên **video/âm thanh** chỉ hỗ trợ đầu vào URL công cộng, hãy dùng địa chỉ công cộng ngoài thư viện tài nguyên (như image host, CDN object storage), một hình ảnh khuyến nghị không quá 25MB.

### Hình ảnh thành video (ảnh tham chiếu)

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

### Viết tiếp video / đầu vào âm thanh

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

> **Gợi ý**: \`metadata.content\` hỗ trợ bốn loại \`text\` / \`image_url\` / \`video_url\` / \`audio_url\`, \`image_url\` có thể chỉ định \`first_frame\` / \`last_frame\` / \`reference_image\` qua \`role\`.`,
  },
  {
    id: 'moderation',
    title: 'Kiểm duyệt nội dung',
    category: 'Tài liệu tham khảo API',
    content: `# Kiểm duyệt nội dung

> **POST** \`/v1/moderations\`

Phát hiện nội dung văn bản hoặc hình ảnh + văn bản có vi phạm chính sách an toàn hay không

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Không | Mô hình kiểm duyệt, ví dụ \`content-moderation-latest\` |
| \`input\` | string/array | Có | Nội dung cần kiểm duyệt (văn bản hoặc mảng văn bản + hình ảnh) |

### Ví dụ yêu cầu

\`\`\`json
{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}
\`\`\`

### Ví dụ cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/moderations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}'
\`\`\`

## Phản hồi trả về

### 200 Thành công

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
    title: 'Tái xếp hạng',
    category: 'Tài liệu tham khảo API',
    content: `# Tái xếp hạng (Rerank)

> **POST** \`/v1/rerank\`

Sắp xếp lại mức độ liên quan của danh sách tài liệu theo văn bản truy vấn

## Tham số yêu cầu

### Tham số Body

| Tham số | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| \`model\` | string | Không | Mô hình tái xếp hạng, ví dụ \`bge-rerank-v3\` |
| \`query\` | string | Có | Văn bản truy vấn |
| \`documents\` | array | Có | Danh sách tài liệu cần sắp xếp |
| \`top_n\` | integer | Không | Trả về N kết quả đầu tiên |
| \`return_documents\` | boolean | Không | Có trả về nguyên văn tài liệu hay không, mặc định true |

### Ví dụ yêu cầu

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

### Ví dụ cURL

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

## Phản hồi trả về

### 200 Thành công

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
    title: 'Câu hỏi thường gặp',
    category: 'Nền tảng',
    content: `# Câu hỏi thường gặp

### Câu hỏi chung

**Q: LingyiYun khác gì so với OpenAI chính thức?**

A: LingyiYun là gateway tương thích định dạng OpenAI, bổ sung hỗ trợ mô hình nội địa (DeepSeek/Qwen/GLM...), giá linh hoạt hơn. Định dạng giao diện hoàn toàn tương thích, dùng thẳng OpenAI SDK được.

**Q: Hỗ trợ những ngôn ngữ lập trình nào?**

A: Mọi ngôn ngữ hỗ trợ HTTP đều gọi được. Python và Node.js có SDK chính thức tiện nhất, các ngôn ngữ khác (Go/Java/PHP/Rust) dùng HTTP client gọi trực tiếp là được.

**Q: Có dùng thử miễn phí không?**

A: Liên hệ quản trị viên lấy Key thử nghiệm, thường có hạn mức ban đầu.

### Câu hỏi về gọi API

**Q: Trả về \`context_length_exceeded\` thì làm sao?**

A: Đầu vào quá dài. Rút gọn nội dung messages, hoặc đổi mô hình có ngữ cảnh dài hơn (ví dụ gpt-4.1 hỗ trợ 1M).

**Q: Trả về \`model_not_found\` thì làm sao?**

A: Tham số model viết sai. Gọi \`GET /v1/models\` để xem danh sách mô hình khả dụng, chú ý phân biệt hoa thường.

**Q: Đầu ra dạng luồng bị ngắt thì làm sao?**

A: Lỗi mạng khiến SSE mất kết nối, không thể truyền tiếp, cần gửi lại yêu cầu. Khuyến nghị client làm logic ghép nối, sau khi mất luồng gửi lại yêu cầu.

**Q: Vì sao nội dung phản hồi bị cắt cụt?**

A: Có thể \`max_tokens\` đặt quá nhỏ, hoặc mô hình sinh đạt giới hạn. Kiểm tra \`finish_reason\`, nếu là \`length\` nghĩa là bị cắt, tăng \`max_tokens\` lên.

**Q: Chất lượng phản hồi tiếng Trung không tốt thì làm sao?**

A: Thử yêu cầu rõ ràng "trả lời bằng tiếng Trung" trong message system, hoặc dùng mô hình có khả năng tiếng Trung mạnh hơn (DeepSeek/Qwen/GLM).

### Câu hỏi về tính phí

**Q: Một yêu cầu tiêu thụ bao nhiêu Token?**

A: Xem trường \`usage\` trong phản hồi. Tổng Token đầu vào + đầu ra chính là mức tiêu thụ.

**Q: Yêu cầu streaming tính Token thế nào?**

A: Đặt \`stream_options: {"include_usage": true}\`, chunk cuối sẽ chứa usage. Yêu cầu không streaming mặc định trả về usage.

**Q: Tính phí giống OpenAI chính thức không?**

A: Logic tính phí giống nhau (theo Token), nhưng hệ số khác nhau, mô hình nội địa của LingyiYun rẻ hơn. Hệ số cụ thể xem cấu hình backend.

### Câu hỏi về tính năng

**Q: Có hỗ trợ Function Calling không?**

A: Có. DeepSeek / GPT / Claude và các mô hình khác đều hỗ trợ, cách dùng hoàn toàn giống OpenAI.

**Q: Có hỗ trợ đầu vào hình ảnh (Vision) không?**

A: Có. Dùng mô hình đa phương thức như gpt-4o / claude-sonnet-4, truyền URL hình ảnh hoặc Base64 trong content.

**Q: Có hỗ trợ đầu ra JSON không?**

A: Có. Đặt \`response_format: {"type": "json_object"}\`.

**Q: Có thể tinh chỉnh (fine-tune) mô hình không?**

A: Hiện chưa hỗ trợ. Có thể dùng trực tiếp mô hình tiền huấn luyện do nền tảng cung cấp, đạt hiệu quả tùy chỉnh qua prompt engineering và few-shot.

**Q: Tạo video phải đợi bao lâu?**

A: Thường 30 giây đến vài phút, tùy thuộc mô hình và độ dài video.

### Câu hỏi về triển khai

**Q: Cấu hình cross-origin (CORS) thế nào?**

A: Nếu frontend gọi API trực tiếp sẽ gặp vấn đề cross-origin. Khuyến nghị đi qua proxy backend, hoặc liên hệ quản trị viên cấu hình CORS whitelist.

**Q: Mạng nội bộ gọi API được không?**

A: LingyiYun triển khai trên mạng công cộng, mạng nội bộ cần truy cập được internet. Nếu cách ly hoàn toàn, cần triển khai riêng tư (private).

**Q: Có hỗ trợ triển khai riêng tư (private deployment) không?**

A: Liên hệ bộ phận kinh doanh, hỗ trợ triển khai riêng tư vào phòng máy của khách hàng.

**Q: Xem log gọi API thế nào?**

A: Backend quản trị → trang log, có thể lọc theo Key / mô hình / thời gian.`,
  },
  {
    id: 'terms',
    title: 'Thỏa thuận nền tảng',
    category: 'Nền tảng',
    content: `# Thỏa thuận nền tảng

Đây là thỏa thuận (gọi là "Thỏa thuận") giữa Bạn ("là cá nhân hoặc tổ chức đã đăng ký trở thành người dùng trên nền tảng và sử dụng dịch vụ của chúng tôi, đồng thời cam kết tuân thủ các thỏa thuận, chính sách bảo mật và các điều khoản dịch vụ khác của chúng tôi") và Công ty TNHH Công nghệ Sáng Thế Hoa Thái Bắc Kinh cùng các công ty liên kết của công ty này ("**Hoa Thái**" hoặc "chúng tôi").

Bạn xác nhận rằng, trước khi sử dụng hoặc mua sản phẩm hoặc dịch vụ LingyiYun của chúng tôi, bạn đã đọc, hiểu và chấp nhận toàn bộ các điều khoản của Thỏa thuận này. Khi bạn thực sự bắt đầu sử dụng dịch vụ trên nền tảng này hoặc hoàn tất quy trình mua hàng, tức là bạn đã đọc và đồng ý tuân thủ Thỏa thuận này. Chúng tôi có quyền sửa đổi các điều khoản của Thỏa thuận này khi cần thiết, bạn có thể xem phiên bản mới nhất của thỏa thuận tại trang này. Sau khi các điều khoản của Thỏa thuận này thay đổi, nếu bạn tiếp tục sử dụng dịch vụ trên nền tảng này, thì được coi là bạn đã chấp nhận thỏa thuận đã thay đổi. **Để biết chi tiết về chính sách thu thập và sử dụng dữ liệu cũng như thông tin cá nhân của nền tảng này, vui lòng tham khảo Chính sách bảo mật.**

Bạn cam đoan rằng bạn có đầy đủ năng lực hành vi dân sự theo quy định của pháp luật, là cá nhân có thể độc lập chịu trách nhiệm dân sự, hoặc là người có đầy đủ năng lực hành vi dân sự được pháp nhân ủy quyền đại diện hành động; nếu bạn chưa đủ mười tám tuổi, dù bạn đã đăng ký cũng không thể hoàn tất xác thực danh tính thực hoặc sử dụng dịch vụ của nền tảng này. Bạn cam kết và xác nhận rằng, nội dung của Thỏa thuận này không vi phạm pháp luật của quốc gia hoặc khu vực nơi bạn sinh sống.

## 1. Quản lý tài khoản

### 1.1 Tài khoản và xác thực danh tính thực

1.1.1. Sau khi bạn điền thông tin liên quan theo yêu cầu của nền tảng này và xác nhận đồng ý tuân thủ toàn bộ các điều khoản của Thỏa thuận này và "Chính sách bảo mật", chúng tôi sẽ tạo tài khoản cho bạn. Bạn biết và đồng ý rằng, một phần hoặc toàn bộ chức năng của nền tảng này cần tài khoản của bạn hoàn tất xác thực danh tính thực mới được kích hoạt, và chúng tôi có quyền căn cứ vào phán đoán của mình và sự thay đổi phát triển kinh doanh, định kỳ sửa đổi và duy trì dịch vụ và chức năng của nền tảng này.

1.1.2. Nếu bạn đại diện cho doanh nghiệp, pháp nhân, tổ chức phi pháp nhân hoặc thực thể khác truy cập và sử dụng nền tảng này, thì phải hoàn tất xác thực doanh nghiệp của tài khoản. Doanh nghiệp đã xác thực phải chịu trách nhiệm đối với mọi hành vi sử dụng, nạp tiền, cung cấp thông tin... của tài khoản đó và người dùng liên quan, không được lấy lý do mượn tài khoản, nhân viên nghỉ việc... để từ chối chịu trách nhiệm.

1.1.3. Nếu bạn truy cập hoặc sử dụng dịch vụ này thông qua bên thứ ba, thì bạn xác nhận và cho phép dịch vụ bên thứ ba đó sử dụng hoặc lưu trữ thông tin người dùng, token truy cập, thông tin tài khoản liên quan và thông tin xác thực danh tính cũng như dữ liệu khác của bạn.

1.1.4. Bạn có trách nhiệm bảo vệ tài khoản do mình tạo, tham gia hoặc quản lý cũng như danh tính người dùng của mình, không được tiết lộ cho bất kỳ ai bất kỳ thông tin đăng nhập nào bạn dùng để đăng nhập. Nếu tài khoản bị mất do bạn chủ động tiết lộ hoặc do bạn bị người khác tấn công hoặc lừa đảo, nền tảng này không chịu trách nhiệm.

1.1.5. Tên tài khoản và biệt danh người dùng bạn đặt không được vi phạm pháp luật, quy định của nhà nước, trật tự công cộng và thuần phong mỹ tục, đạo đức xã hội, cũng không được gây nhầm lẫn giữa bạn với danh tính của nền tảng này.

1.1.6. Cùng một người dùng chỉ được tạo một tài khoản cá nhân. Tài khoản cá nhân của bạn chỉ dành riêng cho bạn sử dụng. Trừ khi hai bên có thỏa thuận khác, bạn không được tặng, cho mượn, cho thuê, chuyển nhượng, bán hoặc dưới bất kỳ hình thức nào cho phép bên thứ ba sử dụng tài khoản cá nhân của bạn.

1.1.7. Cùng một người dùng có thể tạo nhiều tài khoản tổ chức. Nếu bạn cho phép người dùng khác cùng sử dụng tài khoản tổ chức của mình, bạn sẽ chịu toàn bộ trách nhiệm về hậu quả và trách nhiệm của mọi hành vi của người dùng tương ứng trên tài khoản tổ chức đó.

### 1.2 Thay đổi, tạm dừng và chấm dứt

Chúng tôi có thể thay đổi, tạm dừng hoặc chấm dứt dịch vụ cung cấp cho bạn, hoặc đặt ra giới hạn đối với việc sử dụng dịch vụ, mà không phải chịu bất kỳ trách nhiệm nào, với điều kiện chúng tôi đã cố gắng hết sức thông báo trước cho bạn qua một hoặc nhiều hình thức như tin nhắn SMS, email hoặc thông báo trên nền tảng này. Chúng tôi có thể vô hiệu hóa tài khoản của bạn bất cứ lúc nào. Ngay cả khi tài khoản của bạn bị chấm dứt vì bất kỳ lý do nào, bạn vẫn bị ràng buộc bởi Thỏa thuận này.

## 2. Truy cập dịch vụ và giới hạn dịch vụ

### 2.1 Truy cập dịch vụ

Với điều kiện bạn tuân thủ Thỏa thuận này, chúng tôi cấp cho bạn quyền không độc quyền và không thể chuyển nhượng, chỉ dùng cho mục đích sử dụng cá nhân của bạn hoặc mục đích kinh doanh nội bộ của doanh nghiệp hoặc thực thể khác mà bạn đại diện.

### 2.2 Giới hạn dịch vụ

Bạn không được:
- Tháo rời, kỹ nghịch đảo (reverse engineering), giải mã hoặc dịch ngược bất kỳ phần nào của dịch vụ
- Mua, bán hoặc chuyển nhượng API Key khi chưa có sự đồng ý trước bằng văn bản của chúng tôi
- Sao chép, cho thuê, bán, cho mượn, chuyển nhượng, cấp phép hoặc cố gắng cấp phép lại, bán lại, phân phối hoặc sửa đổi bất kỳ phần nào của dịch vụ
- Thực hiện bất kỳ hành động nào có thể gây quá tải cho máy chủ, cơ sở hạ tầng... của chúng tôi
- Sử dụng dịch vụ cho mục đích vi phạm pháp luật, xâm phạm quyền, lừa đảo...
- Vòng tránh các biện pháp chúng tôi có thể áp dụng để chặn hoặc hạn chế truy cập dịch vụ
- Cố gắng can thiệp hoặc phá hoại tính toàn vẹn hệ thống hoặc bảo mật của máy chủ chạy dịch vụ
- Sử dụng dịch vụ này để gửi thư rác, thư chuỗi hoặc email không được yêu cầu khác
- Truyền dữ liệu bất hợp pháp, virus hoặc phần mềm độc hại khác qua dịch vụ này
- Mạo danh người khác hoặc thực thể, trình bày sai mối quan hệ của bạn với người khác hoặc thực thể
- Thu thập hoặc lấy bất kỳ thông tin cá nhân nào từ dịch vụ này

## 3. Dữ liệu tương tác

3.1 Dịch vụ này có thể cho phép người dùng thực hiện các thao tác như nhập, phản hồi, sửa đổi, xử lý, lưu trữ, tải lên, tải xuống và phân phối dữ liệu liên quan với các mô hình lớn, trang web, phần mềm, ứng dụng hoặc dịch vụ bên thứ ba trong quá trình sử dụng dịch vụ nền tảng.

3.2 Nếu phát hiện dữ liệu tương tác vi phạm bất kỳ pháp luật, quy định nào hoặc quy định của Thỏa thuận này, chúng tôi có quyền xóa dữ liệu tương tác đó hoặc ngừng cung cấp dịch vụ kỹ thuật.

3.3 Là bên hỗ trợ kỹ thuật độc lập, nền tảng này không nắm giữ bất kỳ quyền sở hữu trí tuệ nào đối với mọi dữ liệu tương tác phát sinh từ việc bạn sử dụng dịch vụ của nền tảng này. Mọi dữ liệu tương tác, nghĩa vụ và trách nhiệm phát sinh từ việc bạn sử dụng dịch vụ của nền tảng này đều do bạn tự chịu trách nhiệm.

3.4 Tuyên bố miễn trừ trách nhiệm: Chúng tôi không chịu trách nhiệm đối với bất kỳ dữ liệu tương tác nào. Bạn phải hoàn toàn chịu trách nhiệm đối với dữ liệu tương tác mà bạn nhập, phản hồi, sửa chữa, xử lý, lưu trữ, tải lên, tải xuống và phân phối trong dịch vụ của nền tảng này.

3.5 Chúng tôi sẽ bổ sung nhận diện tương ứng cho nội dung tổng hợp do trí tuệ nhân tạo tạo ra theo pháp luật và quy định liên quan. Bạn không được ác ý xóa, giả mạo, làm giả hoặc che giấu các nhận diện nêu trên.

## 4. Sở hữu trí tuệ

### 4.1 Sở hữu trí tuệ của LingyiYun

Quyền sở hữu trí tuệ của mọi nội dung chúng tôi cung cấp trong dịch vụ của nền tảng này ngay từ đầu thuộc về chúng tôi. Bạn không được truy cập, bán, cấp phép, cho thuê, sửa đổi, phân phối, sao chép, truyền tải, hiển thị, công bố, chuyển thể hoặc tạo ra bất kỳ tác phẩm phái sinh nào của quyền sở hữu trí tuệ đó.

### 4.2 Đầu ra

Với điều kiện bạn tuân thủ các quy định liên quan và phù hợp với pháp luật, quy định liên quan, bạn có thể sử dụng kết quả do dịch vụ của nền tảng này tạo ra theo cách được pháp luật yêu cầu.

### 4.3 Dữ liệu sử dụng của người dùng

Chúng tôi có thể thu thập thông tin liên quan đến chẩn đoán, kỹ thuật và tình trạng sử dụng, dùng để cải thiện sản phẩm và dịch vụ của chúng tôi.

### 4.4 Phản hồi

Nếu bạn cung cấp cho chúng tôi bất kỳ đề xuất hoặc phản hồi nào về dịch vụ này, thì bạn chuyển nhượng cho chúng tôi toàn bộ quyền và lợi ích trong phản hồi đó.

## 5. Thông tin bảo mật

Dịch vụ này có thể chứa thông tin không công khai, độc quyền hoặc bảo mật của LingyiYun và những người dùng khác. Bạn sẽ bảo vệ quyền riêng tư của mọi thông tin bảo mật, không được sử dụng cho bất kỳ mục đích nào khác ngoài việc thực hiện quyền theo Thỏa thuận này, và không được tiết lộ cho bất kỳ cá nhân hoặc thực thể nào.

## 6. Chính sách tính phí và thuế

6.1 Một số dịch vụ nhất định do nền tảng này cung cấp có thể phải trả phí sử dụng. Chọn sử dụng dịch vụ này tức là bạn đồng ý với các điều khoản định giá và thanh toán áp dụng cho bạn được nêu trên nền tảng này.

6.2 Do tính đặc thù "dịch vụ trước, tính phí sau", sản phẩm và dịch vụ của chúng tôi thường áp dụng mô hình "trả phí sau khi sử dụng". Vui lòng đảm bảo tài khoản của bạn có đủ số dư, nếu không có thể phát sinh công nợ.

6.3 Các điều khoản định giá, tính phí, thanh toán của mọi sản phẩm và dịch vụ trên nền tảng này được viện dẫn vào Thỏa thuận này.

6.4 Nếu có bất kỳ loại thuế nào do chính phủ quy định, bạn phải chịu trách nhiệm thanh toán mọi loại thuế liên quan đến việc sử dụng/kích hoạt dịch vụ của bạn.

## 7. Kiểm soát xuất khẩu và trừng phạt

Bạn cam kết tuân thủ pháp luật và quy định về kiểm soát xuất khẩu và trừng phạt của Cộng hòa Nhân dân Trung Hoa. Bạn cam kết không sử dụng sản phẩm hoặc dịch vụ do nền tảng này cung cấp cho mục đích quân sự, liên quan đến vũ khí hủy diệt hàng loạt.

## 8. Quyền riêng tư và bảo mật dữ liệu

### 8.1 Quyền riêng tư

Chúng tôi sẽ luôn tuân thủ "Luật Bảo vệ thông tin cá nhân của Cộng hòa Nhân dân Trung Hoa" và các luật áp dụng liên quan khác.

### 8.2 Bảo mật dữ liệu

Chúng tôi rất coi trọng tính toàn vẹn và bảo mật của thông tin cá nhân của bạn. Tuy nhiên, chúng tôi không thể đảm bảo rằng bên thứ ba không được ủy quyền sẽ không bao giờ vượt qua được các biện pháp bảo vệ bảo mật của chúng tôi.

## 9. Sử dụng dịch vụ bên thứ ba

Dịch vụ này có thể chứa liên kết đến trang web, tài liệu và dịch vụ bên thứ ba, các dịch vụ bên thứ ba này không thuộc sở hữu hoặc kiểm soát của chúng tôi. Chúng tôi không xác nhận bất kỳ dịch vụ bên thứ ba nào, cũng không chịu bất kỳ trách nhiệm nào.

## 10. Bồi thường

Bạn phải bảo vệ, bồi thường và giữ cho chúng tôi cùng các công ty liên kết của chúng tôi và các đại lý, nhà cung cấp, bên cấp phép, nhân viên, nhà thầu, cán bộ và giám đốc tương ứng của họ không bị thiệt hại, khỏi mọi khiếu nại, thiệt hại, nghĩa vụ, tổn thất, trách nhiệm, chi phí và phí tổn phát sinh từ việc bạn truy cập và sử dụng dịch vụ này, bạn vi phạm Thỏa thuận này, hoặc bạn xâm phạm quyền của bên thứ ba bất kỳ.`,
  },
  {
    id: 'privacy',
    title: 'Chính sách bảo mật',
    category: 'Nền tảng',
    content: `# Chính sách bảo mật

Chào mừng bạn đến với nền tảng GenAI mở giá trị cao của Công ty TNHH Công nghệ Sáng Thế Hoa Thái Bắc Kinh và các bên liên kết (sau đây gọi là "Hoa Thái" hoặc "chúng tôi"). Chúng tôi rất coi trọng việc bảo vệ thông tin của người dùng (sau đây gọi là "bạn"). Khi bạn đăng ký, đăng nhập và sử dụng nền tảng này, chúng tôi sẽ thu thập và lưu trữ thông tin người dùng cần thiết để bạn đăng ký và sử dụng bình thường các chức năng của nền tảng này. Chúng tôi sẽ không thu thập hoặc lưu trữ dữ liệu tương tác của bạn với các mô hình nguồn mở, trang web, phần mềm, ứng dụng hoặc dịch vụ bên thứ ba trong thời gian bạn sử dụng nền tảng này.

## Tổng quan

Chính sách bảo mật này sẽ giúp bạn hiểu:

1. Chúng tôi thu thập và sử dụng thông tin người dùng của bạn như thế nào
2. Chúng tôi sử dụng Cookie và công nghệ tương tự
3. Chúng tôi lưu trữ thông tin người dùng của bạn như thế nào
4. Chúng tôi chia sẻ, truyền tải và công bố công khai thông tin của bạn như thế nào
5. Chúng tôi bảo vệ an toàn thông tin của bạn như thế nào
6. Chúng tôi quản lý thông tin người dùng của bạn như thế nào
7. Điều khoản sử dụng cho người chưa thành niên
8. Sửa đổi và thông báo của chính sách bảo mật
9. Phạm vi áp dụng

## 1. Chúng tôi thu thập và sử dụng thông tin người dùng của bạn như thế nào

### 1.1 Chúng tôi chủ động thu thập thông tin người dùng của bạn

Để đảm bảo bạn sử dụng bình thường nền tảng của chúng tôi, chúng tôi sẽ thu thập thông tin người dùng mà bạn chủ động cung cấp khi sử dụng dịch vụ của chúng tôi, bao gồm nhưng không giới hạn:

**1.1.1** Khi bạn đăng ký, xác thực và đăng nhập tài khoản nền tảng, bạn có thể dùng số điện thoại di động để tạo tài khoản. Chúng tôi sẽ xác thực danh tính của bạn bằng cách gửi mã xác minh qua SMS.

**1.1.2** Khi bạn đăng ký hoặc kích hoạt dịch vụ, theo pháp luật và quy định, chúng tôi cần thực hiện xác thực danh tính thực cho bạn.

- Đối với người dùng cá nhân: Bạn có thể cần cung cấp thông tin danh tính thực của mình, bao gồm họ tên đầy đủ, số chứng minh nhân dân...
- Đối với người dùng doanh nghiệp: Bạn có thể cần cung cấp thông tin liên quan của đơn vị, bao gồm tên đơn vị, mã tín dụng xã hội thống nhất...

**1.1.3** Khi bạn sử dụng dịch vụ này, chúng tôi sẽ thu thập thông tin cần thiết để duy trì vận hành an toàn, ổn định của sản phẩm và dịch vụ, bao gồm thông tin thiết bị, thông tin log mạng...

### 1.2 Chúng tôi có thể lấy thông tin người dùng từ bên thứ ba

Để cung cấp cho bạn dịch vụ tốt hơn, hiệu quả hơn, cá nhân hóa hơn, các công ty liên kết và đối tác của chúng tôi có thể chia sẻ thông tin của bạn với chúng tôi theo pháp luật, quy định, thỏa thuận bạn đã ký hoặc sự đồng ý của bạn.

### 1.3 Dữ liệu kinh doanh và dữ liệu khách hàng

Dữ liệu được tạo hoặc xử lý qua dịch vụ do nền tảng này cung cấp thuộc về dữ liệu kinh doanh và dữ liệu khách hàng của bạn ("Dữ liệu tương tác"). Bạn sở hữu hoàn toàn dữ liệu tương tác. Là nhà cung cấp dịch vụ kỹ thuật trung lập, nền tảng này sẽ không truy cập, sử dụng hoặc tiết lộ dữ liệu tương tác của bạn, trừ khi pháp luật và quy định có quy định khác.

## 2. Sử dụng Cookie và công nghệ tương tự

Cookie và công nghệ tương tự là công nghệ phổ biến trên Internet. Khi bạn sử dụng nền tảng này, chúng tôi có thể sử dụng công nghệ liên quan để gửi Cookie đến thiết bị của bạn, nhằm thu thập và lưu trữ thông tin tài khoản, lịch sử tìm kiếm và thông tin trạng thái đăng nhập của bạn. Bạn có thể từ chối hoặc quản lý Cookie qua cài đặt trình duyệt.

## 3. Chúng tôi lưu trữ thông tin người dùng của bạn như thế nào

### 3.1 Vị trí lưu trữ thông tin

Chúng tôi sẽ lưu trữ thông tin người dùng được thu thập và tạo ra trong quá trình vận hành trang web này và các dịch vụ liên quan tại lãnh thổ Cộng hòa Nhân dân Trung Hoa.

### 3.2 Thời hạn lưu trữ thông tin

Chúng tôi chỉ giữ lại thông tin người dùng của bạn trong khoảng thời gian cần thiết để cung cấp nền tảng này và các dịch vụ liên quan. Sau khi hết thời hạn cần thiết, chúng tôi sẽ xóa hoặc ẩn danh thông tin của bạn.

## 4. Chúng tôi chia sẻ, truyền tải và công bố thông tin của bạn như thế nào

### 4.1 Đối tác tham gia sử dụng dữ liệu

Các hoạt động sử dụng dữ liệu liên quan đến đối tác phải có mục đích hợp pháp và phải giới hạn trong phạm vi cần thiết để đạt được mục đích đó. Chúng tôi sẽ đánh giá toàn diện năng lực bảo mật của đối tác và yêu cầu họ tuân thủ thỏa thuận pháp lý hợp tác.

### 4.2 Xử lý chung hoặc xử lý ủy thác thông tin người dùng

Một số mô-đun hoặc chức năng cụ thể nhất định trong nền tảng này và dịch vụ liên quan được cung cấp bởi đối tác. Chúng tôi chỉ cung cấp thông tin người dùng của bạn cho họ trong phạm vi tối thiểu cần thiết để cung cấp dịch vụ, theo các nguyên tắc hợp pháp, công bằng, cần thiết và an toàn.

### 4.3 Chuyển giao thông tin người dùng

Trừ khi có sự đồng ý rõ ràng của bạn, theo yêu cầu của pháp luật và quy định, hoặc khi hoạt động nền tảng có thay đổi/sáp nhập/thâu tóm/phá sản thanh lý, chúng tôi sẽ không chuyển giao thông tin người dùng của bạn cho bất kỳ bên thứ ba nào khác.

### 4.4 Công bố thông tin người dùng

Về nguyên tắc, trừ khi có sự đồng ý rõ ràng của bạn hoặc pháp luật, quy định của nhà nước yêu cầu, chúng tôi sẽ không công bố công khai thông tin người dùng của bạn.

## 5. Chúng tôi bảo vệ an toàn thông tin của bạn như thế nào

Chúng tôi rất coi trọng an toàn thông tin người dùng, áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn khỏi bị truy cập, sử dụng hoặc tiết lộ trái phép.

## 6. Chúng tôi quản lý thông tin người dùng của bạn như thế nào

Bạn có quyền truy cập, sửa chữa và xóa thông tin người dùng của mình. Bạn có thể quản lý thông tin cá nhân của mình qua trang cài đặt của nền tảng này, hoặc liên hệ chúng tôi để hỗ trợ xử lý.

## 7. Điều khoản sử dụng cho người chưa thành niên

Chúng tôi không cho phép người chưa thành niên (dưới 18 tuổi) sử dụng dịch vụ của nền tảng này. Nếu bạn là người chưa thành niên, vui lòng ngừng sử dụng dịch vụ của chúng tôi ngay lập tức.

## 8. Sửa đổi và thông báo của chính sách bảo mật

Chúng tôi có thể định kỳ sửa đổi chính sách bảo mật này. Chính sách bảo mật đã sửa đổi sẽ được công bố trên trang này và có hiệu lực kể từ ngày công bố.

## 9. Phạm vi áp dụng

Chính sách bảo mật này áp dụng cho mọi kịch bản bạn sử dụng dịch vụ của nền tảng này. Nếu bạn sử dụng nền tảng này qua dịch vụ bên thứ ba, bạn còn cần tuân thủ chính sách bảo mật của bên thứ ba.`,
  },
]
