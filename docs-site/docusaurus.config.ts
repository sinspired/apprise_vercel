import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const getBaseUrl = () => {
  // 1. 如果是从根目录 vercel.json 启动的综合站构建
  if (process.env.IS_COMBINED_SITE === 'true') {
    return '/docs/';
  }

  // 2. 如果是在 Vercel 中直接把 docs-site 设为根目录部署（此时没有 IS_COMBINED_SITE）
  if (process.env.VERCEL) {
    return '/';
  }

  // 3. 本地开发或通过 pnpm run deploy 部署到 GitHub Pages
  return '/apprise_vercel';
};

const config: Config = {
  title: 'Apprise Vercel',
  tagline: 'Apprise Vercel 是一个无服务器极简通知服务...',
  favicon: 'img/favicon.ico',

  future: { v4: true },




  url: 'https://sinspired.github.io',
  // 动态判断路径
  // 1. 如果在 Vercel 部署，BaseUrl 为 /docs/
  // 2. 如果是本地执行 pnpm run deploy 部署到 GitHub Pages，保持原路径
  baseUrl: getBaseUrl(),
  organizationName: 'sinspired',
  projectName: 'apprise_vercel',

  // onBrokenLinks: 'throw',
  // 即使有死链也允许编译通过（防止因路径调整导致部署中断）
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // 关键优化：将文档路由设为根，避免出现 /docs/docs/xxx
          routeBasePath: '/',
          editUrl: 'https://github.com/sinspired/apprise_vercel/wiki/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/Apprise_OG.png',
    colorMode: { respectPrefersColorScheme: true },
    navbar: {
      title: 'Apprise Vercel',
      logo: { alt: 'Apprise Vercel Logo', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: '文档' },
        {
          href: 'https://github.com/sinspired/apprise_vercel',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [],
      copyright: `Made by <a href="https://github.com/sinspired/apprise_vercel" target="_blank" rel="noopener noreferrer">sinspired</a> · © ${new Date().getFullYear()} Apprise Vercel`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;