# 常用通知渠道

支持 `100+` 通知渠道，完整列表请查阅 [Apprise 官方文档](https://appriseit.com/services)

## 📱 手机通知

| 目标           | 快速上手 |     平台      | 快速格式                     |
| :------------- | :------- | :-----------: | :--------------------------- |
| [Bark ⓘ](Bark) | ⭐⭐⭐⭐⭐    |      iOS      | `bark://{host}/{device_key}` |
| [Ntfy ⓘ](Ntfy) | ⭐⭐⭐⭐⭐    | iOS + Android | `ntfy://TOPIC`               |

## 🗨️ 社交软件通知

| 目标                             | 快速上手 | 快速格式                                                            |
| :------------------------------- | :------- | :------------------------------------------------------------------ |
| [Telegram ⓘ](Telegram)           | ⭐⭐⭐      | `tgram://BOT_TOKEN/CHAT_ID`                                         |
| [Discord ⓘ](Discord)             | ⭐⭐⭐      | `discord://WEBHOOK_ID/WEBHOOK_TOKEN`                                |
| [Line ⓘ](Line)                   | ⭐⭐       | `line://ACCESS_TOKEN`                                               |
| [Slack ⓘ](Slack)                 | ⭐⭐⭐      | `slack://TOKEN/CHANNEL`                                             |
| [Whatsapp ⓘ](Whatsapp)           | ⭐⭐       | `whatsapp://PHONE_NUMBER`                                           |
| [X (Twitter) ⓘ](X)               | ⭐⭐       | `twitter://CONSUMER_KEY/CONSUMER_SECRET/ACCESS_TOKEN/ACCESS_SECRET` |
| [飞书 ⓘ](Feishu)                 | ⭐⭐⭐      | `feishu://{bot_token}`                                              |
| [钉钉 ⓘ](DingTalk)               | ⭐⭐⭐      | `dingtalk://{ApiKey}/{ToPhoneNo}`                                   |
| [企业微信应用 ⓘ](WeComAPI)       | ⭐⭐⭐      | `wechat://{corpid}:{corpsecret}@{agentid}/@all`                     |
|                                  |
| [企业微信群组机器人 ⓘ](WeComBot) | ⭐⭐⭐      | `wecombot://{botkey}`                                               |
| [邮件 (Email) ⓘ](Email)          | ⭐⭐⭐⭐     | `mailto://USER:PASSWORD@SMTP_SERVER:PORT`                           |
