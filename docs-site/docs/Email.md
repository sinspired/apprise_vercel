# Email（邮件）

> [!TIP]
> 通过标准 SMTP 发送邮件通知，支持常见邮箱（Gmail、Outlook/Office365、QQ、163 等）。[ⓘ 查看详细教程](https://appriseit.com/services/email)

## 📦 URL 格式

- 简洁账号内嵌格式（主机为 SMTP 服务器）

`mailto://{user}:{password}@{smtp_host}:{port}`

- 参数式格式（更利于包含特殊字符的账户）

`mailtos://{smtp_host}:{port}?user={user}&pass={password}&from={from_email}&to={to_email}`

常用可选参数（依据服务端支持不同可能略有差异）：

- `from`：发件人邮箱地址
- `to`：收件人，多个收件人可用 `/` 继续追加：`.../to1@example.com/to2@example.com`
- `name`：发件人显示名称（需 URL 编码）
- `secure`：`yes|no|starttls`（如端口 465 常用 `yes`，端口 587 常用 `starttls`）
- `format`：`text|html|markdown`

> [!NOTE]
>
> - 部分邮箱需开启“SMTP/POP3/IMAP”或使用“应用专用密码”（App Password）。
> - 端口常见：465（SSL/TLS），587（STARTTLS），25（明文/受限）。

## ⚡️ 常见示例

### Gmail（建议应用专用密码）

```bash
mailtos://smtp.gmail.com:465?user=you@gmail.com&pass=APP_PASSWORD&from=you@gmail.com&to=target@example.com
```

或（多收件人）：

```bash
mailtos://smtp.gmail.com:465?user=you@gmail.com&pass=APP_PASSWORD&from=you@gmail.com&to=alice@example.com/bob@example.com
```

### Outlook / Office 365（如用 SMTP）

```bash
mailtos://smtp.office365.com:587?user=you@outlook.com&pass=PASSWORD&from=you@outlook.com&to=target@example.com&secure=starttls
```

### QQ 邮箱（需开通 SMTP 并使用授权码）

```bash
mailtos://smtp.qq.com:465?user=你的QQ邮箱@qq.com&pass=授权码&from=你的QQ邮箱@qq.com&to=target@example.com
```

### 163 邮箱

```bash
mailtos://smtp.163.com:465?user=你的账号@163.com&pass=授权码&from=你的账号@163.com&to=target@example.com
```

## 📘 参考文档

- Apprise 服务文档：[Email](https://appriseit.com/services/email)