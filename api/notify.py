from http.server import BaseHTTPRequestHandler
import json
import apprise
import asyncio

# 全局缓存对象，避免重复初始化
apobj = apprise.Apprise()

class handler(BaseHTTPRequestHandler):

    def _send_response(self, code, payload, content_type="application/json"):
        self.send_response(code)
        self.send_header("Content-type", content_type)
        self.end_headers()
        if isinstance(payload, dict):
            self.wfile.write(json.dumps(payload).encode("utf-8"))
        else:
            self.wfile.write(str(payload).encode("utf-8"))

    def do_GET(self):
        self._send_response(200, {
            "message": "Apprise Vercel Notify is running",
            "usage": "Send POST request with JSON {urls, body, title?, type?, format?}"
        })

    def do_POST(self):
        if self.headers.get("content-type") != "application/json":
            self._send_response(400, {"error": "Content-Type must be application/json"})
            return

        try:
            length = int(self.headers["content-length"])
            form = json.loads(self.rfile.read(length))
        except Exception as e:
            self._send_response(400, {"error": f"Invalid JSON: {str(e)}"})
            return

        urls = form.get("urls", "")
        if not urls:
            self._send_response(400, {"error": "Missing 'urls' field"})
            return

        # 添加通知服务
        for url in urls.split(","):
            apobj.add(url.strip())

        async def send():
            return await apobj.async_notify(
                body=form.get("body", ""),
                title=form.get("title", ""),
                notify_type=form.get("type", "info"),
                body_format=form.get("format", "text"),
            )

        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            success = loop.run_until_complete(send())
            loop.close()
        except Exception as e:
            self._send_response(500, {"error": f"Notification failed: {str(e)}"})
            return

        if success:
            self._send_response(200, {"status": "OK"})
        else:
            self._send_response(500, {"error": "Failed to send notifications"})
