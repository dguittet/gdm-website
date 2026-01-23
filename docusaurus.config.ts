import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Grid-Data-Models',
  tagline: 'Platform for grid engineering and management',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://dguittet.github.io',
  baseUrl: '/gdm-website/',
  organizationName: 'dguittet',
  projectName: 'gdm-website',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Grid-Data-Models',
      logo: {
        alt: 'GDM Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          label: 'Platform for grid engineering',
          position: 'left',
          to: '/',
        },
        {
          label: 'Unlocking the value stack for grid data',
          position: 'left',
          to: '/',
        },
        {
          label: 'Advancing grid digitalization',
          position: 'left',
          to: '/',
        },
        {
          label: 'Schema',
          position: 'left',
          to: '/schema',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          label: 'Contact Us',
          position: 'right',
          to: '/contact',
          className: 'navbar__item__contact',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Schema Documentation',
              to: '/schema',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/NREL/grid-data-models',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NREL. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
