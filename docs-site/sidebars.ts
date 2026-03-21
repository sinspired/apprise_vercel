import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    // ── 入门 ──────────────────────────────────────────
    {
      type: 'doc',
      id: 'Home',
      label: '首页',
      className: 'sidebar-icon sidebar-icon-home',
    },
    {
      type: 'doc',
      id: 'QuicSet',
      label: '快速上手',
      className: 'sidebar-icon sidebar-icon-setup',
    },
    {
      type: 'doc',
      id: 'Deploy',
      label: '部署',
      className: 'sidebar-icon sidebar-icon-deploy',
    },

    // ── 分隔 ──────────────────────────────────────────
    { type: 'html', value: '<hr style="margin:8px 12px;opacity:.2"/>' },

    // ── 通知渠道 ──────────────────────────────────────
    {
      type: 'category',
      label: '手机通知',
      className: 'sidebar-icon sidebar-icon-phone',
      collapsible: true,
      collapsed: true,
      items: ['Bark', 'Ntfy'],
    },
    {
      type: 'category',
      label: '邮件通知',
      className: 'sidebar-icon sidebar-icon-email',
      collapsible: true,
      collapsed: true,
      items: ['Email'],
    },
    {
      type: 'category',
      label: 'IM 集成',
      className: 'sidebar-icon sidebar-icon-chat',
      collapsible: true,
      collapsed: true,
      items: [
        'Telegram', 'DingTalk', 'WeCom',
        'Discord', 'Feishu', 'Slack',
        'Line', 'Whatsapp', 'X',
      ],
    },

    // ── 分隔 ──────────────────────────────────────────
    { type: 'html', value: '<hr style="margin:8px 12px;opacity:.2"/>' },

    // ── 开发者 ────────────────────────────────────────
    {
      type: 'doc',
      id: 'API调用',
      label: 'API 调用',
      className: 'sidebar-icon sidebar-icon-api',
    },
    {
      type: 'doc',
      id: 'api-reference',
      label: 'API 参考文档',
      className: 'sidebar-icon sidebar-icon-swagger',
    },
  ],
};

export default sidebars;