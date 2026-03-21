// PWA Service Worker 注册
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    });
}

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
        if (lower.startsWith('twitter') || lower.startsWith('x')) return Icons.x;
        if (lower.startsWith('whatsapp')) return Icons.whatsapp;
        if (lower.startsWith('line')) return Icons.line;
        if (lower.startsWith('slack')) return Icons.slack;
        if (lower.startsWith('discord')) return Icons.discord;
        if (lower.startsWith('bark')) return Icons.bark;
        if (lower.startsWith('dingtalk')) return Icons.dingtalk;
        if (lower.startsWith('wecombot')) return Icons.wecombot;
        if (lower.startsWith('qq')) return Icons.qq;
        if (lower.startsWith('feishu')) return Icons.feishu;
        if (lower.startsWith('ntfy')) return Icons.ntfy;
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

            // 禁用拼写检查、自动更正、自动大写（iOS/Android/桌面全兼容）
            span.setAttribute('spellcheck', 'false');
            span.setAttribute('autocorrect', 'off');
            span.setAttribute('autocapitalize', 'off');

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
        const apiUrl = window.location.protocol.startsWith('http') ? window.location.origin + '/notify' : 'http://host:port/notify';
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

        const bindResetAction = (btnId, inputId) => {
            const btn = document.getElementById(btnId);
            const input = document.getElementById(inputId);

            if (btn && input) {
                btn.addEventListener('click', (e) => {
                    // 阻止按钮默认行为
                    e.preventDefault();

                    // 清空输入框
                    input.value = '';

                    // 触发 input 事件以保存到 localStorage (触发 saveInput)
                    input.dispatchEvent(new Event('input'));

                    // 重新聚焦到输入框，方便用户直接输入
                    input.focus();
                });
            }
        };

        // 绑定重置按钮
        bindResetAction('titleResetTitleBtn', 'title');
        bindResetAction('bodyResetIconBtn', 'body');


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
            title: rawTitle.trim() || defaultTitle,
            body: rawBody.trim() || defaultBody
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