import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
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
    {
      type: 'doc',
      id: 'API调用',
      label: 'API 调用',
      className: 'sidebar-icon sidebar-icon-api',
    },
    {
      type: 'category',
      label: '手机通知',
      className: 'sidebar-icon sidebar-icon-phone',
      collapsible: false,
      items: ['Bark', 'Ntfy'],
    },
    {
      type: 'category',
      label: '邮件通知',
      className: 'sidebar-icon sidebar-icon-email',
      collapsible: false,
      items: ['Email'],
    },
    {
      type: 'category',
      label: 'IM 集成',
      className: 'sidebar-icon sidebar-icon-chat',
      collapsible: false,
      items: [
        'Telegram', 'DingTalk', 'WeCom', 'Discord', 'Feishu', 'Slack', 'Line', 'Whatsapp', 'X',
      ],
    },
  ],
};

export default sidebars;
