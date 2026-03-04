import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Apprise Vercel',
  tagline: 'Apprise Vercel 是一个无服务器极简通知服务...',
  favicon: 'img/favicon.ico',

  future: { v4: true },

  url: 'https://sinspired.github.io',
  baseUrl: '/apprise_vercel',
  organizationName: 'sinspired',
  projectName: 'apprise_vercel',

  onBrokenLinks: 'throw',

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