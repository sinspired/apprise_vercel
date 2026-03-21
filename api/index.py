# api/index.py
from flask import Flask, request, jsonify, Response
from flasgger import Swagger
import apprise
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

DEFAULT_ICON = "https://apprise.linkpc.dpdns.org/static/icons/icon-512.png"
DEFAULT_NOTIFY_TITLE = "Apprise 通知"
DEFAULT_NOTIFY_BODY = "来自 Apprise 控制台的测试通知"

app = Flask(__name__)

# OpenAPI 3.0 Spec
_OPENAPI_SPEC = {
    "openapi": "3.0.3",
    "info": {
        "title": "Apprise Notify API",
        "version": "1.0.0",
        "description": "Apprise Notify 是一个轻量、快速的消息推送工具，支持 Telegram、Discord、邮件、Webhook 等 100+ 通知方式。",
    },
    "servers": [{"url": "/"}],
    "paths": {
        "/notify": {
            "get": {
                "summary": "健康检查",
                "operationId": "notify_status",
                "responses": {
                    "200": {
                        "description": "服务运行状态",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/StatusResponse"
                                }
                            }
                        },
                    }
                },
            },
            "post": {
                "summary": "发送推送通知",
                "operationId": "notify",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/NotifyRequest"},
                            "example": {
                                "urls": "bark://key@api.day.app",
                                "title": DEFAULT_NOTIFY_TITLE,
                                "body": DEFAULT_NOTIFY_BODY,
                                "type": "info",
                                "format": "text",
                                "icon": "",
                            },
                        }
                    },
                },
                "responses": {
                    "200": {
                        "description": "发送成功",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/NotifyResponse"
                                }
                            }
                        },
                    },
                    "400": {"description": "参数错误"},
                    "500": {"description": "发送失败"},
                },
            },
        }
    },
    "components": {
        "schemas": {
            # 请求体 Schema
            "NotifyRequest": {
                "type": "object",
                "required": ["urls", "body"],
                "properties": {
                    "urls": {
                        "description": "Apprise URL，支持逗号分隔字符串或字符串数组",
                        "oneOf": [
                            {"type": "string", "example": "bark://key@api.day.app"},
                            {"type": "array", "items": {"type": "string"}},
                        ],
                    },
                    "title": {
                        "type": "string",
                        "default": DEFAULT_NOTIFY_TITLE,
                        "example": DEFAULT_NOTIFY_TITLE,
                    },
                    "body": {
                        "type": "string",
                        "default": DEFAULT_NOTIFY_BODY,
                        "example": DEFAULT_NOTIFY_BODY,
                    },
                    "type": {
                        "type": "string",
                        "enum": ["info", "success", "warning", "failure"],
                        "default": "info",
                        "example": "info",
                    },
                    "format": {
                        "type": "string",
                        "enum": ["text", "html", "markdown"],
                        "default": "text",
                        "example": "text",
                    },
                    "icon": {
                        "type": "string",
                        "description": "自定义图标 URL，不填则使用服务默认图标",
                        "example": "",
                    },
                },
            },
            # 响应体 Schema
            "NotifyResponse": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "example": "OK"},
                    "count": {
                        "type": "integer",
                        "example": 2,
                        "description": "成功发送的目标数量，多目标时才返回",
                    },
                },
            },
            "StatusResponse": {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "usage": {"type": "string"},
                    "docs": {"type": "string"},
                    "apprise_version": {"type": "string"},
                },
            },
        }
    },
}

# Flasgger 仅用于将 _OPENAPI_SPEC 挂载为 /apispec_1.json，不启用自带 UI
Swagger(
    app,
    template=_OPENAPI_SPEC,
    config={
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec_1",
                "route": "/apispec_1.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "swagger_ui": False,  # UI 由 Scalar 接管
        "specs_route": "/apidocs/",
    },
)

# Scalar 文档页面 HTML
_SCALAR_HTML = """\
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Apprise Notify API · Docs</title>
</head>
<body>
  <script src="/i18n.js"></script>
  <script>
    (function () {
      const lang = localStorage.getItem('language') || 'zh-CN';
      const t = TRANSLATIONS[lang];
      if (!t) return;
      document.documentElement.setAttribute('lang', lang);
      document.title = (t.app_title || 'Apprise Notify') + ' · API Docs';
    })();
  </script>

  <script
    id="api-reference"
    data-url="/apispec_1.json"
    data-configuration='{
      "theme": "purple",
      "layout": "modern",
      "darkMode": true,
      "hideDarkModeToggle": false,
      "defaultHttpClient": { "targetKey": "shell", "clientKey": "curl" },
      "hideModels": true,
      "hideDownloadButton": true,
      "hideClientButton": false,
      "metaData": {
        "title": "Apprise Notify API · Docs",
        "description": "通过 Apprise 发送推送通知",
        "ogTitle": "Apprise Notify API"
      },
      "withDefaultFonts": true,
      "favicon": "/static/icons/icon-512.png"
    }'
  ></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>
"""

# 辅助函数


def _parse_url_list(urls_input) -> list[str]:
    """将 urls 字段统一解析为字符串列表，支持逗号分隔字符串或字符串数组"""
    if isinstance(urls_input, str):
        return [u.strip() for u in urls_input.split(",") if u.strip()]
    if isinstance(urls_input, list):
        return [u.strip() for u in urls_input if isinstance(u, str) and u.strip()]
    return []


def _build_apprise(url_list: list[str], icon_url: str) -> tuple[apprise.Apprise, int]:
    """构建 Apprise 实例，注入图标并添加所有目标 URL，返回 (实例, 成功添加数)"""
    asset = apprise.AppriseAsset()
    asset.image_url_logo = icon_url
    apobj = apprise.Apprise(asset=asset)
    added = sum(1 for u in url_list if apobj.add(decorate_url(u, icon_url)))
    return apobj, added


def decorate_url(raw_url: str, icon_url: str) -> str:
    """按协议类型为 URL 注入图标、分组等默认参数（仅在参数缺失时补充，不覆盖已有值）"""
    if not icon_url:
        return raw_url
    try:
        parsed = urlparse(raw_url)
        scheme = parsed.scheme.lower()
        params = parse_qs(parsed.query)

        def set_if_missing(key, value):
            if key not in params:
                params[key] = [value]

        def append_if_missing(key, value):
            existing = params.get(key, [""])[0]
            params[key] = [
                f"{existing},{value}" if existing and value not in existing else value
            ]

        if scheme.startswith("bark"):
            set_if_missing("icon", icon_url)
            set_if_missing("group", "Apprise_Vercel")
        elif scheme.startswith("ntfy"):
            set_if_missing("avatar_url", icon_url)
            append_if_missing("tags", "Apprise_Vercel")
        elif scheme == "discord":
            set_if_missing("avatar", "yes")
            set_if_missing("avatar_url", icon_url)
        elif scheme in ("mailto", "mailtos"):
            set_if_missing("from", "Apprise_Vercel")

        return urlunparse(parsed._replace(query=urlencode(params, doseq=True)))
    except Exception as e:
        print(f"URL Decoration Error: {e}")
        return raw_url


# 路由


@app.get("/docs/api")
def docs():
    """Scalar 文档页面"""
    return Response(_SCALAR_HTML, mimetype="text/html")


@app.get("/notify")
def notify_status():
    """健康检查"""
    return jsonify(
        {
            "message": "Apprise Vercel Notify is running",
            "usage": "POST /notify  →  JSON { urls, body, title?, type?, format?, icon? }",
            "docs": "/api/docs",
            "apprise_version": apprise.__version__,
        }
    )


@app.post("/notify")
def notify():
    """发送推送通知"""
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    form = request.get_json(silent=True)
    if not form:
        return jsonify({"error": "Invalid JSON"}), 400

    url_list = _parse_url_list(form.get("urls"))
    if not url_list:
        return jsonify({"error": "Missing or invalid 'urls' field"}), 400

    icon = form.get("icon", "").strip() or DEFAULT_ICON
    apobj, added = _build_apprise(url_list, icon)

    if added == 0:
        return jsonify({"error": "Failed to add any valid Apprise URLs"}), 500

    try:
        success = apobj.notify(
            body=form.get("body", ""),
            title=form.get("title", ""),
            notify_type=form.get("type", "info"),
            body_format=form.get("format", "text"),
        )
    except Exception as e:
        return jsonify({"error": f"Notification failed: {e}"}), 500

    if not success:
        return jsonify({"error": "Failed to send (check URL params)"}), 500

    result = {"status": "OK"}
    if added > 1:
        result["count"] = added
    return jsonify(result)
