from http.server import BaseHTTPRequestHandler
import json
import apprise
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

# 默认图标
DEFAULT_ICON = "https://apprise.linkpc.dpdns.org/static/icons/icon-512.png"


def decorate_url(raw_url, icon_url):
    """
    仅通过修改 URL 参数来适配图标，不修改 Apprise 内部逻辑。
    """
    if not icon_url:
        return raw_url

    try:
        # 解析 URL
        parsed = urlparse(raw_url)
        scheme = parsed.scheme.lower()
        query_params = parse_qs(parsed.query)

        # 辅助函数：如果参数不存在，则添加
        def set_if_missing(key, value):
            if key not in query_params:
                query_params[key] = [value]

        # 辅助函数：追加参数 (用于 tags)
        def append_param(key, value):
            current_vals = query_params.get(key, [])
            if current_vals and current_vals[0]:
                if value not in current_vals[0]:
                    query_params[key] = [f"{current_vals[0]},{value}"]
            else:
                query_params[key] = [value]

        if scheme.startswith("bark"):
            set_if_missing("icon", icon_url)
            #  group/category
            set_if_missing("group", "Apprise_Vercel")

        elif scheme.startswith("ntfy"):
            set_if_missing("avatar_url", icon_url)
            append_param("tags", "Apprise_Vercel")

        elif scheme == "discord":
            # Discord Webhook: 需要 avatar=yes 才能生效
            set_if_missing("avatar", "yes")
            set_if_missing("avatar_url", icon_url)
        elif scheme == "mailto" or scheme == "mailtos":
            set_if_missing("from", "Apprise_Vercel")

        # 重新组装 URL
        new_query = urlencode(query_params, doseq=True)
        new_parsed = parsed._replace(query=new_query)
        return urlunparse(new_parsed)

    except Exception as e:
        print(f"URL Decoration Error: {e}")
        return raw_url


class handler(BaseHTTPRequestHandler):

    def _send_response(self, code, payload, content_type="application/json"):
        self.send_response(code)
        self.send_header("Content-type", content_type)
        self.end_headers()
        response = json.dumps(payload) if isinstance(payload, dict) else str(payload)
        self.wfile.write(response.encode("utf-8"))

    def do_GET(self):
        self._send_response(
            200,
            {
                "message": "Apprise Vercel Notify is running",
                "usage": "Send POST request with JSON {urls, body, title?, type?, format?, icon?}",
            },
        )

    def do_POST(self):
        # 1. 校验 Content-Type
        if self.headers.get("content-type") != "application/json":
            self._send_response(400, {"error": "Content-Type must be application/json"})
            return

        # 2. 解析 JSON
        try:
            length = int(self.headers["content-length"])
            req_body = self.rfile.read(length)
            form = json.loads(req_body)
        except Exception as e:
            self._send_response(400, {"error": f"Invalid JSON: {str(e)}"})
            return

        # 3. 获取 URLs
        urls_input = form.get("urls")
        if not urls_input:
            self._send_response(400, {"error": "Missing 'urls' field"})
            return

        # 处理 URL 列表 (支持 string 或 list)
        url_list = []
        if isinstance(urls_input, str):
            url_list = [u.strip() for u in urls_input.split(",") if u.strip()]
        elif isinstance(urls_input, list):
            url_list = [
                u.strip() for u in urls_input if isinstance(u, str) and u.strip()
            ]

        if not url_list:
            self._send_response(400, {"error": "No valid URLs provided"})
            return

        # 4. 获取图标 (优先使用 payload 中的 icon，其次是默认图标)
        target_icon = form.get("icon", "").strip() or DEFAULT_ICON

        # 5. 初始化 Apprise
        asset = apprise.AppriseAsset()
        asset.image_url_logo = target_icon
        apobj = apprise.Apprise(asset=asset)

        # 6. 添加 URL (并在添加前注入图标参数)
        added_count = 0
        for raw_url in url_list:
            # 修改 URL 参数
            final_url = decorate_url(raw_url, target_icon)

            if apobj.add(final_url):
                added_count += 1

        if added_count == 0:
            self._send_response(500, {"error": "Failed to add any valid Apprise URLs"})
            return

        # 7. 发送通知
        try:
            success = apobj.notify(
                body=form.get("body", ""),
                title=form.get("title", ""),
                notify_type=form.get("type", "info"),
                body_format=form.get("format", "text"),
            )
        except Exception as e:
            # 捕获严重错误
            print(f"Notification Exception: {e}")
            self._send_response(500, {"error": f"Notification failed: {str(e)}"})
            return

        if success:
            if added_count > 1:
                self._send_response(200, {"status": "OK", "count": added_count})
            else:
                self._send_response(200, {"status": "OK"})
        else:
            self._send_response(
                500,
                {"error": "Failed to send notifications (Check network or URL params)"},
            )
