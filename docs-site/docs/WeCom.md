# WeCom (企业微信)

> [!TIP]
> **企业微信** 支持通过应用消息接口向成员或群组发送通知。[ⓘ 查看详细教程](https://appriseit.com/services/wecombot)

## 📦 URL 格式

`wecombot://{botkey}`

## ⚡️ 快速步骤

### 💻 PC版WeCom

1. 在PC版WeCom上，找到目标WeCom组来接收报警通知。
2. 右键点击WeCom组。在弹出的窗口中，点击“添加组机器人”。
3. 在弹出的窗口中，点击创建机器人。
4. 在弹出的窗口中，输入自定义机器人名称并点击添加。
5. 你将获得一个看起来像以下的 Webhook URL：
`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abcd`

### ⚛️ WeCom 网页版

1. 在WebCom for Web中，打开目标WeCom群组以接收报警通知。
2. 点击右上角的组设置图标。
3. 在组设置页面，选择“组机器人”>添加机器人。
4. 在添加机器人管理页面，输入新机器人的自定义名称。
5. 点击添加
6. 你将获得一个看起来像以下的Webhook URL：
`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abcd`

7. 按格式拼接目标 `URL`，Enjoy! 🎉

### 示例

```bash
wecombot://{botkey}
https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abcd
```

## 📘 使用文档

[企业微信文档](https://developer.work.weixin.qq.com)

## 📥 下载

[企业微信官网](https://work.weixin.qq.com)
