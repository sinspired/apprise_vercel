# API 调用

可以从任何支持 HTTP 请求的程序或脚本中调用此服务。

- **请求方式**: `POST`
- **接口路径**: `/notify`
- **Content-Type**: `application/json`

## 请求参数 (JSON)

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `urls` | String | Apprise URL，多个 URL 用逗号 `,` 分隔 |
| `title` | String | 通知的标题 |
| `body` | String  | 通知的具体内容 |
| `type` | String | 通知类型：`info`, `success`, `warning`, `error` |
| `format`| String | 内容格式：`text`, `markdown`, `html` |

## 调用示例

### Windows PowerShell

```powershell
$body = @{
  urls   = "tgram://BOT_TOKEN/CHAT_ID"
  title  = "任务完成"
  body   = "您的自动化脚本已成功执行完毕。"
  type   = "success"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://您的域名/notify" -ContentType "application/json" -Body $body
```

### cURL (Linux/macOS)

```Bash
curl -X POST "https://您的域名/notify" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": "tgram://BOT_TOKEN/CHAT_ID, mailto://user:pass@gmail.com",
    "title": "服务器警告",
    "body": "检测到 CPU 使用率过高！",
    "type": "warning",
    "format": "text"
  }'
```
