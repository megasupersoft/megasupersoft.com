import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MegaSuperSoft',
  description: 'Software made with care in New Zealand',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap', rel: 'stylesheet' }],
  ],

  themeConfig: {
    siteTitle: false,

    nav: [
      { text: 'Products', link: '/products' },
      { text: 'Downloads', link: '/downloads' },
      { text: 'About', link: '/about' },
    ],

    sidebar: [
      {
        text: 'Software',
        items: [
          { text: 'FFFFinance', link: '/products#ffffinance' },
          { text: 'OpenComp', link: '/products#opencomp' },
          { text: 'NodeUI', link: '/products#nodeui' },
          { text: 'FileUI', link: '/products#fileui' },
        ],
      },
      {
        text: 'Games',
        items: [
          { text: 'Vampire Runners', link: '/products#vampire-runners' },
          { text: 'Renegade Cop', link: '/products#renegade-cop' },
          { text: 'NeverEverland', link: '/products#nevereverland' },
        ],
      },
      {
        text: 'Downloads',
        items: [
          { text: 'FFFFinance', link: '/downloads' },
        ],
      },
      {
        text: 'About',
        items: [
          { text: 'About MegaSuperSoft', link: '/about' },
        ],
      },
      {
        text: 'Legal',
        collapsed: true,
        items: [
          { text: 'Privacy Policy', link: '/privacy' },
          { text: 'Terms of Service', link: '/terms' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/megasupersoft' },
    ],

    search: {
      provider: 'local',
    },
  },
})
