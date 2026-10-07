# api/index.py
import os
import tempfile
import json
import re
from pathlib import Path
from flask import Flask, request, jsonify, Response
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
        "version": "2.0.0",
        "description": "轻量无服务器消息推送，支持 Bark、ntfy、Discord、Telegram 等 100+ 渠道。",
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
                "summary": "发送通知",
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
                    "500": {
                        "description": "发送失败或部分失败",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                            }
                        },
                    },
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
                        "description": "成功发送的目标数量，多目标时才返回",
                    },
                },
            },
            "ErrorResponse": {
                "type": "object",
                "properties": {
                    "error": {"type": "string"},
                    "success_count": {"type": "integer"},
                    "failed_count": {"type": "integer"},
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

# Scalar 文档页面 HTML
_SCALAR_HTML = """\
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Apprise Notify API · Docs</title>
  <link rel="icon" href="/static/icons/icon-512.png" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    /* Scalar 滚动条 —— 对齐紫粉主题 */
    *, *::before, *::after {
      scrollbar-width: thin;
      scrollbar-color: rgba(192, 132, 252, 0.4) transparent;
    }
    *::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    *::-webkit-scrollbar-track {
      background: transparent;
    }
    *::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #c084fc, #e879f9);
      border-radius: 999px;
    }
    *::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #a855f7, #d946ef);
    }
    #topnav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
      display: flex; align-items: center; gap: 8px;
      padding: 0 20px; height: 44px;
      background: #13111a;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-family: Inter, system-ui, sans-serif;
      font-size: 13px;
    }
    #topnav a {
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 6px;
      transition: background 0.15s, color 0.15s;
    }
    #topnav a:hover { background: rgba(255,255,255,0.08); color: #fff; }
    #topnav a.active { background: rgba(139,92,246,0.2); color: #a78bfa; }
    #topnav .sep { color: rgba(255,255,255,0.15); }
    #topnav .logo { color: #fff; font-weight: 600; margin-right: 8px; text-decoration: none; cursor: pointer;}
    /* 给 Scalar 主体留出顶部空间 */
    body { padding-top: 44px; }
  </style>
</head>
<body>
  <nav id="topnav">
    <a href="/" class="logo">Apprise Vercel</a>
    <span class="sep">|</span>
    <a href="/docs/">文档</a>
    <a href="/open-api" class="active">API</a>
  </nav>

  <script
    id="api-reference"
    data-url="/openapi.json"
    data-configuration='{
      "theme": "purple",
      "layout": "modern",
      "darkMode": true,
      "defaultHttpClient": { "targetKey": "shell", "clientKey": "curl" },
      "hideModels": true,
      "hideDownloadButton": true,
      "hideClientButton": false,
      "withDefaultFonts": true
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


def _split_tag_prefix(raw_url: str) -> tuple[str, str]:
    """
    分离 Apprise 标签前缀，返回 (prefix_with_eq, actual_url)。

    支持格式：
      tgram://...            → ('', 'tgram://...')
      alerts=tgram://...     → ('alerts=', 'tgram://...')
      1:alerts=tgram://...   → ('1:alerts=', 'tgram://...')
    """
    eq_pos = raw_url.find("=")
    if eq_pos == -1:
        return "", raw_url

    prefix_part = raw_url[:eq_pos]
    url_part = raw_url[eq_pos + 1 :]

    # 前缀部分绝不含 '://'；含则说明 '=' 是 query 参数的一部分
    if "://" in prefix_part:
        return "", raw_url

    return prefix_part + "=", url_part


def decorate_url(raw_url: str, icon_url: str) -> str:
    """按协议类型为 URL 注入图标、分组等默认参数（仅在参数缺失时补充，不覆盖已有值）。"""
    if not icon_url:
        return raw_url

    # ── 拆离标签前缀 ──────────────────────────────────────────────────────────
    prefix, actual_url = _split_tag_prefix(raw_url)

    try:
        parsed = urlparse(actual_url)
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

        decorated = urlunparse(parsed._replace(query=urlencode(params, doseq=True)))

        # ── 拼回标签前缀 ──────────────────────────────────────────────────────
        return prefix + decorated

    except Exception as e:
        print(f"URL Decoration Error: {e}")
        return raw_url  # 原样返回，含前缀


def _build_apprise(url_list: list[str], icon_url: str) -> tuple[apprise.Apprise, int]:
    """构建 Apprise 实例，注入图标并添加所有目标 URL，返回 (实例, 成功添加数)"""
    asset = apprise.AppriseAsset()
    asset.image_url_logo = icon_url
    apobj = apprise.Apprise(asset=asset)

    added = 0
    for u in url_list:
        try:
            # Apprise v2 遇到无效配置可能会直接抛出异常而不是静默忽略
            if apobj.add(decorate_url(u, icon_url)):
                added += 1
        except Exception as e:
            print(f"Failed to add Apprise URL '{u}': {e}")

    return apobj, added


# ─── Telegram Rich Message（方案 3）──────────────────────────────────────────


# ─── 提取到全局的 Markdown 转 HTML 函数 ───────────────────────────────────────
def _to_html(source: str, fmt: str) -> str:
    import re

    if fmt == "html":
        return source
    # markdown → html
    try:
        import markdown

        # 任务列表预处理
        def convert_task_lists(text):
            def repl(m):
                indent, mark, content = m.group(1), m.group(2), m.group(3)
                checked = " checked" if mark.lower() == "x" else ""
                return f'{indent}- <input type="checkbox"{checked} disabled> {content}'

            return re.sub(
                r"(?m)^(\s*)[-*+]\s+\[([ xX])\]\s+(.*)$",
                repl,
                text,
            )

        source = convert_task_lists(source)
        # commit 短 hash：去掉代码样式，保留可点击链接
        source = re.sub(
            r"\(\[`([0-9a-f]{4,40})`\]\((https://[^)]+/commit/[^)]+)\)\)",
            r"([\1](\2))",
            source,
        )
        return markdown.markdown(source, extensions=["extra"])
    except Exception:
        # 降级：简单换行
        from html import escape

        return escape(source).replace("\n", "<br>\n")


def _is_telegram_url(raw_url: str) -> bool:
    _, actual = _split_tag_prefix(raw_url)
    scheme = actual.split("://", 1)[0].lower() if "://" in actual else ""
    return scheme in ("tgram", "telegram")


def _append_url_param(url: str, key: str, value: str) -> str:
    """安全追加 query 参数（保留已有参数）"""
    from urllib.parse import quote

    prefix, actual = _split_tag_prefix(url)
    sep = "&" if "?" in actual else "?"
    encoded = quote(str(value), safe="")
    return prefix + actual + f"{sep}{key}={encoded}"


def _build_telegram_rich_blocks(
    body: str,
    title: str = "",
    body_format: str = "markdown",
) -> dict:
    """
    将 Markdown/HTML 转为 Telegram InputRichMessage 的 blocks 结构。
    返回: {"blocks": [...]}
    """
    from html.parser import HTMLParser

    # ---------- DOM ----------
    VOID = {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    }

    class Node:
        __slots__ = ("tag", "attrs", "children", "text")

        def __init__(self, tag=None, attrs=None, text=None):
            self.tag = tag
            self.attrs = dict(attrs or [])
            self.children = []
            self.text = text

    class TreeParser(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=True)
            self.root = Node("__root__")
            self.stack = [self.root]

        def handle_starttag(self, tag, attrs):
            tag = tag.lower()
            node = Node(tag, attrs)
            self.stack[-1].children.append(node)
            if tag not in VOID:
                self.stack.append(node)

        def handle_startendtag(self, tag, attrs):
            self.stack[-1].children.append(Node(tag.lower(), attrs))

        def handle_endtag(self, tag):
            tag = tag.lower()
            for i in range(len(self.stack) - 1, 0, -1):
                if self.stack[i].tag == tag:
                    del self.stack[i:]
                    return

        def handle_data(self, data):
            if data:
                self.stack[-1].children.append(Node(None, text=data))

        def handle_comment(self, data):
            pass

    # ---------- helpers ----------
    def descendants(node, tag):
        out = []
        for c in node.children:
            if c.tag == tag:
                out.append(c)
            out.extend(descendants(c, tag))
        return out

    def text_content(node, preserve=False):
        parts = []

        def walk(n):
            if n.tag is None:
                parts.append(n.text or "")
                return
            if n.tag == "img":
                parts.append(n.attrs.get("alt", "") or "")
                return
            if n.tag == "br":
                parts.append("\n")
                return
            for c in n.children:
                walk(c)

        walk(node)
        t = "".join(parts)
        return t if preserve else re.sub(r"\s+", " ", t).strip()

    def merge_rich(parts):
        result = []
        for p in parts:
            if p is None or p == "" or p == []:
                continue
            if isinstance(p, list):
                result.extend(p)
            else:
                result.append(p)
        if not result:
            return ""
        if len(result) == 1:
            return result[0]
        return result

    def filename_from_url(url: str) -> str:
        if not url:
            return ""
        path = url.split("?")[0].split("#")[0]
        name = path.rstrip("/").split("/")[-1]
        if name and not name.startswith("."):
            return name
        return ""

    def get_img_alt(node):
        return (node.attrs.get("alt") or "").strip()

    # ---------- inline ----------
    def render_inline(nodes):
        parts = []
        for node in nodes:
            if node.tag is None:
                if node.text:
                    parts.append(node.text)
                continue
            tag = node.tag

            if tag == "br":
                parts.append("\n")
            elif tag == "img":
                alt = get_img_alt(node)
                if alt:
                    parts.append(alt)
            elif tag in ("b", "strong"):
                parts.append(
                    {
                        "type": "bold",
                        "text": merge_rich(render_inline(node.children)),
                    }
                )
            elif tag in ("i", "em"):
                parts.append(
                    {
                        "type": "italic",
                        "text": merge_rich(render_inline(node.children)),
                    }
                )
            elif tag in ("u", "ins"):
                parts.append(
                    {
                        "type": "underline",
                        "text": merge_rich(render_inline(node.children)),
                    }
                )
            elif tag in ("s", "strike", "del"):
                parts.append(
                    {
                        "type": "strikethrough",
                        "text": merge_rich(render_inline(node.children)),
                    }
                )
            elif tag == "mark":
                parts.append(
                    {
                        "type": "marked",
                        "text": merge_rich(render_inline(node.children)),
                    }
                )
            elif tag == "code":
                parts.append(
                    {
                        "type": "code",
                        "text": text_content(node, preserve=True),
                    }
                )
            elif tag == "a":
                href = node.attrs.get("href", "")
                img_nodes = [c for c in node.children if c.tag == "img"]
                text_nodes = [
                    c for c in node.children if c.tag is None and (c.text or "").strip()
                ]
                other = [c for c in node.children if c.tag not in (None, "img", "br")]
                is_image_link = len(img_nodes) >= 1 and not text_nodes and not other

                if is_image_link:
                    alt = get_img_alt(img_nodes[0])
                    display = alt or filename_from_url(href) or href
                    if href:
                        parts.append(
                            {
                                "type": "url",
                                "text": display,
                                "url": href,
                            }
                        )
                    else:
                        parts.append(display)
                else:
                    child = merge_rich(render_inline(node.children))
                    if href and child:
                        parts.append(
                            {
                                "type": "url",
                                "text": child,
                                "url": href,
                            }
                        )
                    elif child:
                        parts.append(child)
                    elif href:
                        short = filename_from_url(href) or href
                        parts.append(
                            {
                                "type": "url",
                                "text": short,
                                "url": href,
                            }
                        )
            else:
                parts.append(render_inline(node.children))
        return parts

    # ---------- blocks ----------
    def render_paragraph(node):
        rich = merge_rich(render_inline(node.children))
        if not rich or (isinstance(rich, str) and not rich.strip()):
            return None
        return {"type": "paragraph", "text": rich}

    def render_list(node):
        items = []
        for li in [c for c in node.children if c.tag == "li"]:
            content = [c for c in li.children if c.tag not in ("ul", "ol")]
            blocks = []
            rich = merge_rich(render_inline(content))
            if rich:
                blocks.append({"type": "paragraph", "text": rich})
            for nested in [c for c in li.children if c.tag in ("ul", "ol")]:
                blocks.extend(render_blocks(nested))
            item = {"blocks": blocks or [{"type": "paragraph", "text": ""}]}
            checkbox = next(
                (
                    c
                    for c in li.children
                    if c.tag == "input" and c.attrs.get("type") == "checkbox"
                ),
                None,
            )
            if checkbox is not None:
                item["has_checkbox"] = True
                item["is_checked"] = "checked" in checkbox.attrs
            if node.tag == "ol":
                item["value"] = len(items) + 1
            items.append(item)
        if not items:
            return None
        return {"type": "list", "items": items}

    def render_table(node):
        rows = descendants(node, "tr")
        output_rows = []
        for row in rows:
            cells = []
            for cell in [c for c in row.children if c.tag in ("th", "td")]:
                cell_obj = {"text": merge_rich(render_inline(cell.children)) or ""}
                if cell.tag == "th":
                    cell_obj["is_header"] = True
                for attr, key in (("rowspan", "rowspan"), ("colspan", "colspan")):
                    try:
                        v = int(cell.attrs.get(attr, "1"))
                        if v > 1:
                            cell_obj[key] = v
                    except (TypeError, ValueError):
                        pass
                align = cell.attrs.get("align")
                if align in ("left", "center", "right"):
                    cell_obj["align"] = align
                cells.append(cell_obj)
            if cells:
                output_rows.append(cells)
        if not output_rows:
            return None
        max_cols = max(len(r) for r in output_rows)
        if max_cols > 20:
            return {
                "type": "paragraph",
                "text": "Table omitted: more than 20 columns.",
            }
        if len(output_rows) > 80:
            return {
                "type": "paragraph",
                "text": f"Table omitted: too many rows ({len(output_rows)}).",
            }
        table = {
            "type": "table",
            "cells": output_rows,
            "is_bordered": True,
            "is_striped": True,
            "is_compact": True,
        }
        caption = next((c for c in node.children if c.tag == "caption"), None)
        if caption:
            cap = merge_rich(render_inline(caption.children))
            if cap:
                table["caption"] = cap
        return table

    def render_blocks(node):
        result = []
        tag = node.tag

        if tag in (
            "__root__",
            "div",
            "section",
            "article",
            "main",
            "thead",
            "tbody",
            "tfoot",
        ):
            for c in node.children:
                result.extend(render_blocks(c))
            return result

        if tag == "p":
            b = render_paragraph(node)
            return [b] if b else []

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            rich = merge_rich(render_inline(node.children))
            if not rich:
                return []
            return [
                {
                    "type": "heading",
                    "text": rich,
                    "size": int(tag[1]),
                }
            ]

        if tag == "pre":
            code = next(iter(descendants(node, "code")), None)
            raw = text_content(node, preserve=True).strip("\n")
            block = {"type": "pre", "text": raw}
            if code:
                m = re.search(
                    r"(?:^|\s)language-([\w+-]+)",
                    code.attrs.get("class", ""),
                )
                if m:
                    block["language"] = m.group(1)
            return [block]

        if tag == "hr":
            return [{"type": "divider"}]

        if tag in ("ul", "ol"):
            b = render_list(node)
            return [b] if b else []

        if tag == "blockquote":
            if "expandable" in node.attrs:
                rich = merge_rich(render_inline(node.children))
                if rich:
                    return [{"type": "expandable_blockquote", "text": rich}]
                return []
            inner = []
            for c in node.children:
                inner.extend(render_blocks(c))
            if inner:
                return [{"type": "blockquote", "blocks": inner}]
            return []

        if tag == "table":
            b = render_table(node)
            return [b] if b else []

        if tag is None:
            t = re.sub(r"\s+", " ", node.text or "").strip()
            if t:
                return [{"type": "paragraph", "text": t}]
            return []

        rich = merge_rich(render_inline(node.children))
        child_has_block = any(
            c.tag
            in (
                "p",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "blockquote",
                "table",
                "pre",
                "hr",
            )
            for c in node.children
        )
        if rich and not child_has_block:
            return [{"type": "paragraph", "text": rich}]
        for c in node.children:
            result.extend(render_blocks(c))
        return result

    html = _to_html(body or "", body_format or "markdown")
    parser = TreeParser()
    parser.feed(html)
    parser.close()
    content_blocks = render_blocks(parser.root)

    blocks = []
    if title and title.strip():
        blocks.append(
            {
                "type": "heading",
                "text": title.strip(),
                "size": 2,
            }
        )
        blocks.append({"type": "divider"})

    blocks.extend(content_blocks)
    blocks = [b for b in blocks if b]

    # 体积保护
    MAX_BYTES = 32000
    MAX_BLOCKS = 480

    def payload_size(p):
        return len(
            json.dumps(p, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        )

    def count_blocks(blks):
        total = 0
        for b in blks:
            if not isinstance(b, dict):
                continue
            total += 1
            if "blocks" in b:
                total += count_blocks(b["blocks"])
            if "items" in b:
                for it in b.get("items", []):
                    total += count_blocks(it.get("blocks", []))
            if "cells" in b:
                total += sum(len(r) for r in b["cells"])
        return total

    payload = {"blocks": blocks}
    while blocks and (
        payload_size(payload) > MAX_BYTES or count_blocks(blocks) > MAX_BLOCKS
    ):
        blocks.pop()
        if title:
            # 保留标题+分割线，从内容尾部删
            if len(blocks) <= 2:
                break
        payload = {"blocks": blocks}

    if (
        payload_size(payload) > MAX_BYTES
        or count_blocks(payload["blocks"]) > MAX_BLOCKS
    ):
        payload["blocks"].append(
            {
                "type": "footer",
                "text": "… Content truncated due to length limits.",
            }
        )

    return payload


def _write_rich_template(payload: dict) -> str:
    """写入临时 JSON 文件，返回路径"""
    fd, path = tempfile.mkstemp(prefix="tg-rich-", suffix=".json")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
    except Exception:
        try:
            os.unlink(path)
        except OSError:
            pass
        raise
    return path


# ─── 路由 ─────────────────────────────────────────────────────────────────────


@app.get("/openapi.json")
def openapi_spec():
    """直接返回 OpenAPI Spec，不依赖任何第三方库"""
    return jsonify(_OPENAPI_SPEC)


@app.get("/open-api")
def docs():
    """Scalar 文档页面"""
    return Response(_SCALAR_HTML, mimetype="text/html")


@app.get("/notify")
def notify_status():
    """健康检查"""
    return jsonify(
        {
            "message": "Apprise Vercel Notify is running",
            "usage": "POST /notify - JSON { urls, body, title?, type?, format?, icon? }",
            "docs": "/open-api",
            "apprise_version": apprise.__version__,
        }
    )


@app.post("/notify")
def notify():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    form = request.get_json(silent=True)
    if not form:
        return jsonify({"error": "Invalid JSON"}), 400

    url_list = _parse_url_list(form.get("urls"))
    if not url_list:
        return jsonify({"error": "Missing or invalid 'urls' field"}), 400

    icon = form.get("icon", "").strip() or DEFAULT_ICON
    body = form.get("body", "") or ""
    title = form.get("title", "") or ""
    notify_type = form.get("type", "info")
    body_format = form.get("format", "text")

    # 1. 拆分目标渠道
    telegram_urls_initial = [u for u in url_list if _is_telegram_url(u)]
    other_urls = [u for u in url_list if not _is_telegram_url(u)]

    tg_use_rich = False
    tg_rich_payload = None

    # 2. 预判 Telegram 是否需要启用 Rich Text（是否含表格、折叠块等高级组件）
    if telegram_urls_initial:
        try:
            fmt_for_rich = (
                body_format if body_format in ("html", "markdown") else "markdown"
            )
            tg_rich_payload = _build_telegram_rich_blocks(
                body=body,
                title=title,
                body_format=fmt_for_rich,
            )

            def _needs_rich_text(blocks):
                for b in blocks:
                    if not isinstance(b, dict):
                        continue
                    if b.get("type") in ("table", "expandable_blockquote"):
                        return True
                    if "blocks" in b and _needs_rich_text(b["blocks"]):
                        return True
                    if "items" in b:
                        for item in b.get("items", []):
                            if "blocks" in item and _needs_rich_text(item["blocks"]):
                                return True
                return False

            if _needs_rich_text(tg_rich_payload.get("blocks", [])):
                tg_use_rich = True
        except Exception as e:
            print(f"Telegram rich text check error: {e}")

    success_count = 0
    failed_count = 0
    errors = []
    temp_files = []

    try:
        # ── 其它渠道（Bark、Ntfy 等：保持绝对原生，客户端传什么就是什么） ───────────────
        if other_urls:
            apobj, added = _build_apprise(other_urls, icon)
            if added > 0:
                try:
                    result = apobj.notify(
                        body=body,
                        title=title,
                        notify_type=notify_type,
                        body_format=body_format,  # 尊重原生输入
                    )
                    if result:
                        success_count += getattr(result, "success_count", added)
                        failed_count += getattr(result, "failed_count", 0)
                    else:
                        failed_count += added
                        errors.append("Non-Telegram notification failed")
                except Exception as e:
                    failed_count += added
                    errors.append(f"Non-Telegram error: {e}")

        # ── Telegram 渠道（拦截处理：绕过 Telegram 苛刻的 Markdown 限制） ───────────────
        if telegram_urls_initial:
            try:
                apobj_tg = apprise.Apprise(asset=apprise.AppriseAsset())
                try:
                    apobj_tg.asset.image_url_logo = icon
                except Exception:
                    pass

                decorated = []
                # 情况 A：含表格 -> 挂载富文本模板，作为 HTML 发送
                if tg_use_rich and tg_rich_payload:
                    template_path = _write_rich_template(tg_rich_payload)
                    temp_files.append(template_path)
                    for u in telegram_urls_initial:
                        u2 = decorate_url(u, icon)
                        u2 = _append_url_param(u2, "template", template_path)
                        decorated.append(u2)
                # 情况 B：普通文本降级 -> 不带模板，后续转换格式发送
                else:
                    for u in telegram_urls_initial:
                        decorated.append(decorate_url(u, icon))

                added_tg = 0
                for u in decorated:
                    try:
                        if apobj_tg.add(u):
                            added_tg += 1
                    except Exception as e:
                        print(f"Failed to add Telegram URL: {e}")

                if added_tg > 0:
                    tg_body = body
                    tg_format = body_format

                    # 【核心转换枢纽】
                    # 为了避开 Apprise 遇到报错后的 "纯文本去超链接" 降级
                    # 如果用户传的是 Markdown，统一在此处安全转义为 HTML 喂给 Telegram
                    if not tg_use_rich and body_format == "markdown":
                        tg_body = _to_html(body, "markdown")
                        tg_format = "html"
                    elif tg_use_rich:
                        tg_body = body or " "
                        tg_format = "html"

                    result_tg = apobj_tg.notify(
                        body=tg_body,
                        title=title or " ",
                        notify_type=notify_type,
                        body_format=tg_format,
                    )
                    if result_tg:
                        success_count += getattr(result_tg, "success_count", added_tg)
                        failed_count += getattr(result_tg, "failed_count", 0)
                    else:
                        failed_count += added_tg
                        errors.append("Telegram Notification failed")
                else:
                    failed_count += len(telegram_urls_initial)
                    errors.append("Failed to add any Telegram URLs")
            except Exception as e:
                failed_count += len(telegram_urls_initial)
                errors.append(f"Telegram error: {e}")

    finally:
        for p in temp_files:
            try:
                os.unlink(p)
            except OSError:
                pass

    if success_count == 0 and failed_count > 0:
        return (
            jsonify(
                {
                    "error": "; ".join(errors) or "All notifications failed",
                    "success_count": success_count,
                    "failed_count": failed_count,
                }
            ),
            500,
        )

    if failed_count > 0:
        return (
            jsonify(
                {
                    "error": "Partial failure: " + "; ".join(errors),
                    "success_count": success_count,
                    "failed_count": failed_count,
                }
            ),
            500,
        )

    result = {"status": "OK"}
    if success_count > 1:
        result["count"] = success_count
    return jsonify(result)
