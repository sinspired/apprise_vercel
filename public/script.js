// PWA Service Worker 注册
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    });
}

// --- 国际化配置 (I18N) ---
const TRANSLATIONS = {
    "zh-CN": {
        app_title: "📢 Apprise 通知",
        lang_switch_title: "切换语言",
        theme_switch_title: "切换主题",
        hint_copy_api: "点击复制 API 地址",
        hint_click_copy: "点击复制",
        label_urls: "目标 URLs (按回车或逗号添加)",
        link_examples: "示例",
        placeholder_urls: "tgram://..., mailto://...",
        label_type: "类型 TYPE",
        label_format: "格式 FORMAT",
        label_title: "标题 TITLE",
        placeholder_title: "Apprise 通知",
        label_body: "内容 BODY",
        placeholder_body: "来自 Apprise 控制台的测试通知",
        btn_send: "发送通知",
        btn_curl: "复制 cURL",
        header_response: "响应结果",
        header_history: "历史记录",
        btn_clear: "清空",
        msg_copied: "已复制!",
        msg_no_url: "请至少添加一个 URL 地址",
        msg_clear_history: "确定要清空历史记录吗？",
        opt_info: "Info",
        opt_success: "Success",
        opt_warning: "Warning",
        opt_error: "Error"
    },
    "en": {
        app_title: "📢 Apprise Notify",
        lang_switch_title: "Switch Language",
        theme_switch_title: "Switch Theme",
        hint_copy_api: "Click to copy API URL",
        hint_click_copy: "Copy",
        label_urls: "Target URLs (Enter/Comma to add)",
        link_examples: "Samples",
        placeholder_urls: "tgram://..., mailto://...",
        label_type: "TYPE",
        label_format: "FORMAT",
        label_title: "TITLE",
        placeholder_title: "Apprise Notification",
        label_body: "BODY",
        placeholder_body: "Test notification from Apprise Console",
        btn_send: "Send",
        btn_curl: "Copy cURL",
        header_response: "Response",
        header_history: "History",
        btn_clear: "Clear",
        msg_copied: "Copied!",
        msg_no_url: "Please add at least one URL",
        msg_clear_history: "Are you sure you want to clear history?",
        opt_info: "Info",
        opt_success: "Success",
        opt_warning: "Warning",
        opt_error: "Error"
    },
    "ja": {
        app_title: "📢 Apprise 通知",
        lang_switch_title: "言語切替",
        hint_copy_api: "クリックしてAPI URLをコピー",
        hint_click_copy: "コピー",
        label_urls: "通知先 URLs (Enter/カンマで追加)",
        link_examples: "例（れい）",
        placeholder_urls: "tgram://..., mailto://...",
        label_type: "タイプ TYPE",
        label_format: "フォーマット FORMAT",
        label_title: "タイトル TITLE",
        placeholder_title: "Apprise 通知",
        label_body: "本文 BODY",
        placeholder_body: "Apprise コンソールからのテスト通知",
        btn_send: "送信",
        btn_curl: "cURLをコピー",
        header_response: "レスポンス",
        header_history: "履歴",
        btn_clear: "クリア",
        msg_copied: "コピーしました!",
        msg_no_url: "URLを1つ以上追加してください",
        msg_clear_history: "履歴を消去してもよろしいですか？",
        opt_info: "Info",
        opt_success: "Success",
        opt_warning: "Warning",
        opt_error: "Error"
    }
};

// 显示名称映射
const LANG_NAMES = {
    "zh-CN": "简体中文",
    "en": "English",
    "ja": "日本語"
};

// --- 图标定义 ---
const Icons = {
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.48-1.02-2.42-1.63-1.09-.72-.38-1.11.24-1.74.14-.15 2.57-2.35 2.62-2.54.01-.02.01-.05 0-.07-.01-.02-.04-.03-.06-.03-.02 0-.2.12-.56.36L8.4 12.4c-.4.27-.78.41-1.15.4-.41-.01-1.2-.23-1.79-.42-.72-.24-.96-.37-.92-.78.02-.21.32-.43.89-.66 3.5-1.52 5.83-2.53 6.99-3.01 3.33-1.39 4.02-1.66 4.47-1.66.1 0 .32.02.47.14.12.1.16.23.17.33 0 .1 0 .23-.01.36z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"></polyline></svg>'
};

const TypeIcons = {
    info: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--focus-ring)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="11" x2="12" y2="18"/><circle cx="12" cy="7" r="0.4"/></svg>',
    success: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--success)"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    warning: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--warning)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="17" r="0.5"/></svg>',
    error: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:var(--danger)"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
};

const FormatIcons = {
    text: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24""><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
    markdown: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><path d="M9 15V9l3 3 3-3v6"></path></svg>',
    html: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>'
};

class ChipInput {
    constructor(containerId, inputId, storageKey) {
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        this.items = [];
        this.storageKey = storageKey;
        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => this.handleKey(e));
        this.input.addEventListener('paste', (e) => this.handlePaste(e));
        this.input.addEventListener('blur', () => this.addItemFromInput());

        // Focus container -> focus input
        this.container.onclick = (e) => {
            if (e.target === this.container) this.input.focus();
        }

        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                this.items = JSON.parse(saved);
            } catch {
                this.items = saved.split(',').filter(s => s);
            }
        }
        this.render();
    }

    handleKey(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            this.addItemFromInput();
        } else if (e.key === 'Backspace' && this.input.value === '' && this.items.length > 0) {
            this.items.pop();
            this.saveAndRender();
        }
    }

    handlePaste(e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const parts = text.split(/,|\n/);
        parts.forEach(p => this.addItem(p));
    }

    addItemFromInput() {
        const val = this.input.value.trim();
        if (val) {
            this.addItem(val);
            this.input.value = '';
        }
    }

    addItem(text) {
        text = text.trim().replace(/^['"]|['"]$/g, '');
        if (text && !this.items.includes(text)) {
            this.items.push(text);
            this.saveAndRender();
        }
    }

    deleteItem(index) {
        this.items.splice(index, 1);
        this.saveAndRender();
    }

    updateItem(index, newVal) {
        if (newVal && newVal.trim()) {
            this.items[index] = newVal.trim();
        }
        this.saveAndRender();
    }

    saveAndRender() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this.render();
    }

    getIcon(text) {
        const lower = text.toLowerCase();
        if (lower.startsWith('tgram')) return Icons.telegram;
        if (lower.startsWith('discord')) return Icons.discord;
        if (lower.startsWith('mail')) return Icons.mail;
        return Icons.link;
    }

    render() {
        const chips = this.container.querySelectorAll('.chip');
        chips.forEach(c => c.remove());

        this.items.forEach((text, index) => {
            const chip = document.createElement('div');
            chip.className = 'chip';

            chip.innerHTML = this.getIcon(text);

            // Editable Span
            const span = document.createElement('span');
            span.className = 'chip-text';
            span.innerText = text;
            span.contentEditable = true;

            span.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    span.blur();
                }
            };
            span.onblur = () => {
                if (span.innerText !== text) {
                    this.updateItem(index, span.innerText);
                }
            };
            span.onclick = (e) => e.stopPropagation();

            chip.appendChild(span);

            const close = document.createElement('span');
            close.className = 'chip-close';
            close.innerText = '×';
            close.onclick = (e) => {
                e.stopPropagation();
                this.deleteItem(index);
            };
            chip.appendChild(close);

            this.container.insertBefore(chip, this.input);
        });
    }

    getValue() { return this.items.join(','); }
    setValue(arr) { this.items = arr; this.saveAndRender(); }
}

const app = {
    urlInput: null,
    currentLang: 'zh-CN',

    init() {
        this.initLang();
        this.initTheme();
        this.urlInput = new ChipInput('urlContainer', 'urlInput', 'apprise_urls');

        // Auto API URL
        const apiUrl = window.location.protocol.startsWith('http') ? window.location.origin + '/notify' : 'http://host.asdsadadsasdasdadadasdsad.asdads.d.ad.a:port/notify';
        document.getElementById('apiUrlText').innerText = apiUrl;

        // Restore Inputs
        ['title', 'body'].forEach(id => {
            const el = document.getElementById(id);
            const val = localStorage.getItem('apprise_' + id);
            if (val) el.value = val;
            // Bind save events
            el.addEventListener('input', () => this.saveInput(id));
        });

        // Setup Buttons
        document.getElementById('themeBtn').addEventListener('click', () => this.toggleTheme());

        // Language Dropdown
        document.getElementById('langTrigger').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLangMenu();
        });

        document.getElementById('sendBtn').addEventListener('click', () => this.send());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyCurl());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        document.getElementById('apiBox').addEventListener('click', () => this.copyApiUrl());

        // Form Selects
        document.getElementById('typeTrigger').addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡
            this.toggleTypeSelect();
        });
        document.getElementById('formatTrigger').addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡
            this.toggleFormatSelect();
        });

        // Initialize Selects
        this.initTypeSelect();
        this.initFormatSelect();

        // Global click to close ALL dropdowns
        document.addEventListener('click', () => {
            document.getElementById('typeOptions').classList.remove('open');
            document.getElementById('formatOptions').classList.remove('open');
            document.getElementById('langOptions').classList.remove('open');
        });

        this.renderHistory();
    },

    // --- 国际化功能 ---
    initLang() {
        const saved = localStorage.getItem('language');
        if (saved && TRANSLATIONS[saved]) {
            this.currentLang = saved;
        } else {
            // 简单检测浏览器语言
            const navLang = navigator.language || navigator.userLanguage;
            if (navLang.startsWith('en')) this.currentLang = 'en';
            else if (navLang.startsWith('ja')) this.currentLang = 'ja';
            else this.currentLang = 'zh-CN';
        }
        this.applyLanguage(this.currentLang);
        this.renderLangMenu();
    },

    toggleLangMenu() {
        // 关闭其他下拉菜单
        document.getElementById('typeOptions').classList.remove('open');
        document.getElementById('formatOptions').classList.remove('open');
        document.getElementById('langOptions').classList.toggle('open');
    },

    renderLangMenu() {
        const container = document.getElementById('langOptions');
        container.innerHTML = '';
        Object.keys(TRANSLATIONS).forEach(key => {
            const div = document.createElement('div');
            // 添加 .selected 类如果当前语言匹配
            const isSelected = key === this.currentLang;
            div.className = `custom-option ${isSelected ? 'selected' : ''}`;

            // 名称 + 选中时的勾选图标
            div.innerHTML = `
                <span>${LANG_NAMES[key] || key}</span>
                <span class="check-icon">${Icons.check}</span>
            `;

            div.onclick = (e) => {
                e.stopPropagation();
                this.applyLanguage(key);
                document.getElementById('langOptions').classList.remove('open');
            };
            container.appendChild(div);
        });
    },

    applyLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);

        const t = TRANSLATIONS[lang];

        // 1. 处理 data-i18n (innerText)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

        // 2. 处理 data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });

        // 3. 处理 data-i18n-title (tooltip)
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (t[key]) el.title = t[key];
        });

        // 4. 更新动态组件 (Type & Format Selects)
        this.updateTypeSelectLabel();
        this.updateFormatSelectLabel();
        // 重新渲染下拉列表以更新语言
        this.renderTypeOptions();
        this.renderFormatOptions();
        // 重新渲染语言菜单以更新选中状态
        this.renderLangMenu();
    },

    t(key) {
        return TRANSLATIONS[this.currentLang][key] || key;
    },
    // -----------------

    initTypeSelect() {
        const savedType = localStorage.getItem('apprise_type') || 'info';
        // 设置隐藏 input 的值
        document.getElementById('type').value = savedType;
        // 渲染选项
        this.renderTypeOptions();
        // 更新显示标签
        this.updateTypeSelectLabel();
    },

    renderTypeOptions() {
        const container = document.getElementById('typeOptions');
        container.innerHTML = ''; // clear
        Object.keys(TypeIcons).forEach(key => {
            const div = document.createElement('div');
            div.className = 'custom-option';

            // 获取翻译文本
            const label = this.t('opt_' + key);

            div.innerHTML = `${TypeIcons[key]} ${label}`;
            div.onclick = () => this.setType(key);
            container.appendChild(div);
        });
    },

    initFormatSelect() {
        const saved = localStorage.getItem('apprise_format') || 'text';
        document.getElementById('format').value = saved;
        this.renderFormatOptions();
        this.updateFormatSelectLabel();
    },

    renderFormatOptions() {
        const container = document.getElementById('formatOptions');
        container.innerHTML = '';
        Object.keys(FormatIcons).forEach(key => {
            const div = document.createElement('div');
            div.className = 'custom-option';

            let label = key === 'html' ? 'HTML' : key.charAt(0).toUpperCase() + key.slice(1);

            div.innerHTML = `${FormatIcons[key]} ${label}`;
            div.onclick = (e) => {
                e.stopPropagation();
                this.setFormat(key);
            };
            container.appendChild(div);
        });
    },

    initTheme() {
        const saved = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let mode = 'light';
        if (saved === 'dark') mode = 'dark';
        else if (saved === 'light') mode = 'light';
        else if (systemDark) mode = 'dark';

        this.applyTheme(mode);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        this.applyTheme(next);
    },

    applyTheme(mode) {
        if (mode === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        const btn = document.getElementById('themeBtn');
        if (btn) btn.innerHTML = mode === 'dark' ? Icons.sun : Icons.moon;

        const metaTag = document.querySelector('meta[name="theme-color"]');
        if (metaTag) metaTag.setAttribute('content', mode === 'dark' ? '#1c1c1e' : '#ffffff');
    },

    toggleTypeSelect() {
        document.getElementById('formatOptions').classList.remove('open');
        document.getElementById('langOptions').classList.remove('open');
        document.getElementById('typeOptions').classList.toggle('open');
    },

    toggleFormatSelect() {
        document.getElementById('typeOptions').classList.remove('open');
        document.getElementById('langOptions').classList.remove('open');
        document.getElementById('formatOptions').classList.toggle('open');
    },

    setType(val) {
        document.getElementById('type').value = val;
        this.updateTypeSelectLabel();
        document.getElementById('typeOptions').classList.remove('open');
        localStorage.setItem('apprise_type', val);
    },

    updateTypeSelectLabel() {
        const val = document.getElementById('type').value;
        const label = this.t('opt_' + val);
        document.getElementById('typeDisplay').innerHTML = TypeIcons[val] + ' ' + label;
    },

    setFormat(val) {
        document.getElementById('format').value = val;
        this.updateFormatSelectLabel();
        document.getElementById('formatOptions').classList.remove('open');
        this.saveInput('format');
    },

    updateFormatSelectLabel() {
        const val = document.getElementById('format').value;
        let label = val === 'html' ? 'HTML' : val.charAt(0).toUpperCase() + val.slice(1);
        document.getElementById('formatDisplay').innerHTML = FormatIcons[val] + ' ' + label;
    },

    saveInput(id) {
        localStorage.setItem('apprise_' + id, document.getElementById(id).value);
    },

    copyApiUrl() {
        const url = document.getElementById('apiUrlText').innerText;
        navigator.clipboard.writeText(url).then(() => {
            // 修改：限定选择器范围，只获取 API Box 里的提示元素
            const hint = document.querySelector('#apiBox .copy-hint');
            const originalText = hint.innerText;
            hint.innerText = this.t('msg_copied');
            hint.style.color = "var(--success)";
            setTimeout(() => {
                hint.innerText = this.t('hint_click_copy'); // reset to translation
                hint.style.color = "";
            }, 1500);
        });
    },

    async send() {
        const rawTitle = document.getElementById('title').value;
        const rawBody = document.getElementById('body').value;
        const typeVal = document.getElementById('type').value;

        // 获取当前语言环境下的默认值
        const defaultTitle = this.t('placeholder_title');
        const defaultBody = this.t('placeholder_body');

        const payload = {
            urls: this.urlInput.getValue(),
            type: typeVal,
            format: document.getElementById('format').value,
            title: rawTitle.trim() || "Apprise Notification",
            body: rawBody.trim() || "Test notification from Apprise Console"
        };

        if (!payload.urls) {
            alert(this.t('msg_no_url'));
            return;
        }

        const btn = document.getElementById('sendBtn');
        const resArea = document.getElementById('resultArea');

        btn.classList.add('loading');
        btn.disabled = true;
        resArea.innerText = 'Sending...';
        resArea.className = '';

        try {
            const res = await fetch('/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            resArea.innerText = JSON.stringify(data, null, 2);
            if (res.ok) {
                resArea.classList.add('response-ok');
                this.addToHistory(payload);
            } else {
                resArea.classList.add('response-err');
            }
        } catch (e) {
            resArea.innerText = 'Error: ' + e.message;
            resArea.classList.add('response-err');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    },

    addToHistory(payload) {
        const history = JSON.parse(localStorage.getItem('apprise_history') || '[]');
        payload._time = new Date().toLocaleTimeString();
        history.unshift(payload);
        if (history.length > 30) history.pop();
        localStorage.setItem('apprise_history', JSON.stringify(history));
        this.renderHistory();
    },

    renderHistory() {
        const list = document.getElementById('historyList');
        const history = JSON.parse(localStorage.getItem('apprise_history') || '[]');

        list.innerHTML = history.map((item, idx) => `
          <div class="history-item" onclick="app.restore(${idx})">
            <div class="h-top">
              <span>${item._time}</span>
              <span>${item.type}</span>
            </div>
            <div class="h-title">${item.title}</div>
            <div class="h-preview">${item.body}</div>
          </div>
        `).join('');
    },

    restore(index) {
        const history = JSON.parse(localStorage.getItem('apprise_history') || '[]');
        const item = history[index];
        if (!item) return;

        this.urlInput.setValue(item.urls ? item.urls.split(',') : []);

        this.setType(item.type);
        this.setFormat(item.format);

        document.getElementById('title').value = item.title;
        document.getElementById('body').value = item.body;

        this.saveInput('title');
        this.saveInput('body');
    },

    clearHistory() {
        if (confirm(this.t('msg_clear_history'))) {
            localStorage.removeItem('apprise_history');
            this.renderHistory();
        }
    },

    copyCurl() {
        const defaultTitle = this.t('placeholder_title');
        const defaultBody = this.t('placeholder_body');
        const payload = {
            urls: this.urlInput.getValue(),
            title: document.getElementById('title').value || defaultTitle,
            body: document.getElementById('body').value || defaultBody,
            type: document.getElementById('type').value,
            format: document.getElementById('format').value
        };
        const cmd = `curl -X POST "${location.origin}/notify" -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`;

        navigator.clipboard.writeText(cmd).then(() => {
            const btn = document.getElementById('copyBtn');
            const span = btn.querySelector('span');
            const originalText = span.innerText;

            span.innerText = this.t('msg_copied');
            btn.classList.add('btn-copied');

            setTimeout(() => {
                span.innerText = originalText;
                btn.classList.remove('btn-copied');
                this.applyLanguage(this.currentLang);
            }, 1000);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());