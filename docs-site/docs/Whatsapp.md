# WhatsApp

> [!TIP]
> 基于 WhatsApp Cloud API 发送消息通知（Meta 开发者平台）。[ⓘ 查看详细教程](https://appriseit.com/services/whatsapp)

## 📦 URL 格式

`whatsapp://{token}@{from_phone_id}/{to}`  
`whatsapp://{template}:{token}@{from_phone_id}/{to}`

- `{token}`：WhatsApp Cloud API 访问令牌（长期令牌更稳定）
- `{from_phone_id}`：发件号码的 Phone Number ID
- `{to}`：接收方电话号码（国际格式，如 86138xxxxxxx）。多个目标可继续用 `/` 追加
- `{template}`：可选，发送模板消息时的模板名称

## ⚡️ 快速步骤

1. 在 Meta for Developers 创建应用，添加 “WhatsApp” 产品
2. 获取 “永久访问令牌（Access Token）” 与 “电话号码 ID（Phone Number ID）”
3. 将接收号码加入测试/允许列表（或完成业务校验流程）
4. 按 URL 格式拼接并发送，Enjoy! 🎉

### 示例

```bash
# 直接消息
whatsapp://EAAG...TOKEN...@123456789012345/8613812345678

# 使用名为 hello_world 的模板消息
whatsapp://hello_world:EAAG...TOKEN...@123456789012345/8613812345678
```

## 📘 使用文档

- Apprise（WhatsApp）：[whatsapp](https://appriseit.com/services/whatsapp/)
- Meta 文档：
  - Cloud API 概览：[https://developers.facebook.com/docs/whatsapp/cloud-api/](https://developers.facebook.com/docs/whatsapp/cloud-api/)
  - 模板消息：[https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/)
