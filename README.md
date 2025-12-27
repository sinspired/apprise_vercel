<div align="center">

# 📢 Apprise Vercel Notify

**无服务器极简通知服务**
</br>
支持向 Telegram、Email、钉钉、企业微信 等 100+ 目标发送通知。

![Apprise](https://img.shields.io/badge/Apprise-1.9.6-00A98F)
![Runtime](https://img.shields.io/badge/Runtime-Vercel%20Serverless-000000?logo=vercel&logoColor=white)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)

</div>
</br>

## 🌐 Vercel 一键部署

点击下方按钮，将 Apprise 部署到自己的 Vercel 账户中：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sinspired/apprise_vercel)

> [!TIP]
> 直接访问 `https://your-project.vercel.app` 可在前端页面测试 `API` 和 `通知目标`。

1. 部署完成后，您将获得一个专属域名（如 `https://your-project.vercel.app`）；
2. 您的 API 地址即为：`https://your-project.vercel.app/notify`；
3. 进入project，点击 `setting` -> `domains` -> `add domain`，添加自定义域名；
4. 根据提示添加 `cname` 记录 和 `txt` 记录（可选）

## 🔗 通知渠道

支持 `100+` 通知渠道，完整列表请查阅 [Apprise 官方 Wiki]([https://](https://github.com/caronc/apprise/wiki))

- Telegram: `tgram://BOT_TOKEN/CHAT_ID`
- Discord: `discord://WEBHOOK_ID/WEBHOOK_TOKEN`
- 钉钉 (DingTalk): `dingtalk://TOKEN`
- 邮件 (Email): `mailto://user:pass@smtp.example.com:587`
- Bark (iOS): `bark://DEVICE_KEY`
- 企业微信 (WeCom): `wecombot://{botkey}`
  
## 🤖 API 调用

您可以从任何支持 HTTP 请求的程序或脚本中调用此服务。

- **请求方式**: `POST`
- **接口路径**: `/notify`
- **Content-Type**: `application/json`

### 请求参数 (JSON)

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `urls` | String | Apprise URL，多个 URL 用逗号 `,` 分隔 |
| `title` | String | 通知的标题 |
| `body` | String  | 通知的具体内容 |
| `type` | String | 通知类型：`info`, `success`, `warning`, `error` |
| `format`| String | 内容格式：`text`, `markdown`, `html` |

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

## 📄 许可证

本项目遵循 GPL-3.0 许可证。
