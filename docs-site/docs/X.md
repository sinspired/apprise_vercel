# X（Twitter）

> 使用 Twitter/X API 发送推文或私信通知（需开发者凭据）。[ⓘ 查看详细教程](https://appriseit.com/services/twitter)

## 📦 URL 格式

`x://{screen_name}@{consumer_key}/{consumer_secret}/{access_token}/{access_secret}`  
`twitter://{consumer_key}/{consumer_secret}/{access_token}/{access_secret}/{screen_name}`  
可选：`?mode=tweet`（显式以推文形式发布）

- `{screen_name}`：你的 X 用户名（不带 @）
- 其余为开发者后台申请的 API Key/Token/Secret

## ⚡️ 快速步骤

1. 你需要在 developer.x.com 申请 X 开发者账号，在开发者后台创建应用
2. 获取 `Consumer Key/Secret` 与 `Access Token/Secret`
3. 选择是否使用 `?mode=tweet` 发布推文，或默认行为（可能为私信/自发）
4. 按 URL 格式拼接，Enjoy! 🎉

### 示例

```bash
# 以推文方式发布
x://myname@CKEY/CSECRET/ATOKEN/ASECRET?mode=tweet

# 备用等价写法
twitter://CKEY/CSECRET/ATOKEN/ASECRET/myname?mode=tweet
```

## 📘 使用文档

- Apprise（X/Twitter）：[twitter](https://appriseit.com/services/twitter)
- X 开发者平台：[https://developer.twitter.com/](https://developer.twitter.com/)
