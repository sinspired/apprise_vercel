<div align="center">

# 📢 Apprise Vercel Notify

**无服务器极简通知服务**  
</br>
![Apprise](https://img.shields.io/badge/Apprise-1.9.6-00A98F)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)

</div>
</br>

> [!NOTE]
> Apprise Vercel 是一个**无服务器极简通知服务**，它的主要设计目的是消除不同通知服务之间使用上的不一致性。通过利用一个简单的 URL 字符串，你可以向 Telegram、Email、钉钉、企业微信 等 `100+` 目标发送通知。

## 🛠️ 部署

点击下方按钮，一键部署到你的 `Vercel` 账户：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sinspired/apprise_vercel)

> [!TIP]  
> 部署完成后访问 `https://your-project.vercel.app` 可在前端页面测试 `API` 和通知目标。

## 🔔 通知渠道

支持 `100+` 通知渠道，完整列表请查阅 [Apprise 官方 Wiki](https://github.com/caronc/apprise/wiki)。

常用渠道示例：

- Telegram: `tgram://BOT_TOKEN/CHAT_ID`
- Discord: `discord://WEBHOOK_ID/WEBHOOK_TOKEN`
- 钉钉 (DingTalk): `dingtalk://TOKEN`
- 邮件 (Email): `mailto://user:pass@smtp.example.com:587`
- Bark (iOS): `bark://DEVICE_KEY`
- 企业微信 (WeCom): `wecombot://{botkey}`

### [⚡️1分钟搞定常用通知渠道](https://github.com/sinspired/apprise_vercel/wiki/QuicSet)

## 🤖 API 调用

- **请求方式**: `POST`  
- **接口路径**: `/notify`  
- **Content-Type**: `application/json`

### 请求参数 (JSON)

| 字段   | 类型   | 说明 |
|--------|--------|------|
| `urls` | String | Apprise URL，多个 URL 用逗号分隔 |
| `title`| String | 通知标题 |
| `body` | String | 通知内容 |
| `type` | String | 通知类型：`info`, `success`, `warning`, `error` |
| `format`| String| 内容格式：`text`, `markdown`, `html` |

### 调用示例

#### Windows PowerShell

```powershell
$body = @{
  urls   = "tgram://BOT_TOKEN/CHAT_ID"
  title  = "任务完成"
  body   = "您的自动化脚本已成功执行完毕。"
  type   = "success"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "https://您的域名/notify" -ContentType "application/json" -Body $body
```

#### cURL (Linux/macOS)

```bash
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

## 📄 许可证

本项目遵循 GPL-3.0 许可证。
