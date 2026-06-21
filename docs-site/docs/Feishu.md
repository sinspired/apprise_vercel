# Feishu (飞书)

> [!TIP]
> **飞书** 支持通过机器人 Webhook 向群组发送通知。[ⓘ 查看详细教程](https://appriseit.com/services/feishu)

## 📦 URL 格式

`feishu://{token}`

自定义机器人是一种只能在当前群聊中使用的机器人。`{token}` 是创建 Fieshu 自定义机器人时生成的令牌。

[如何创建 飞书 自定义机器人](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)

## ⚡️ 快速步骤

1. 进入目标群组，在群组右上角点击更多按钮，并点击 设置。
2. 在右侧 设置 界面，点击 群机器人。
3. 在 群机器人 界面点击 添加机器人。
4. 在 添加机器人 对话框，找到并点击 自定义机器人。
5. 获取自定义机器人的 webhook 地址，记录，并点击 完成。（一般地址后面一长串就是机器人的token），例如 `https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxxx`
6. 按格式拼接目标 `URL`，Enjoy! 🎉

### 示例

```bash
feishu://cli_9f8a1234567890ab
```

## 📘 使用文档

- Apprise 服务文档：[飞书](https://open.feishu.cn)

## 📥 下载

[飞书官网](https://www.feishu.cn)
