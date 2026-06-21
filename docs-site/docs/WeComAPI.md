# 微信（企业微信 应用）通知

> [!TIP]
> **企业微信** 使用微信应用消息 API，直接向微信企业版/微信组织内的用户、部门或标签发送通知。无需第三方服务。[ⓘ 查看详细教程](https://appriseit.com/services/wechat/)


## 📦 URL 格式

`wechat://{corpid}:{corpsecret}@{agentid}/@all`
`wechat://{corpid}:{corpsecret}@{agentid}/@{userid}`

## ⚡️ 快速步骤

您需要从 `WeCom` 管理控制台获取以下三个凭据：

1. 登录到WeCom管理控制台，网址为 `https://work.weixin.qq.com/`。
2. 前往 `“应用程序和小程序”`-> `“应用程序”`，创建一个新的自建应用程序，或者选择一个现有的应用程序。
3. 复制应用程序详情页面上显示的 `AgentID` 。
4. 转到“我的企业”->“企业信息”，然后复制 `CorpID`。
5. 返回应用程序页面，点击 `“密钥”` 旁边的 `“查看”`，复制应用程序密钥。
6. 按格式拼接目标 `URL`，Enjoy! 🎉


### 示例

```bash
# 发送给所有人
wechat://wwCORPID:APPSECRET@1000002/@all

# 发送给指定用户
wechat://wwCORPID:APPSECRET@1000002/@johndoe

# 发送给某个部门
wechat://wwCORPID:APPSECRET@1000002/%2342
```

## 📘 使用文档

[企业微信文档](https://developer.work.weixin.qq.com)

## 📥 下载

[企业微信官网](https://work.weixin.qq.com)