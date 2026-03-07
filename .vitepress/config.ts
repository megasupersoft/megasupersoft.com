import { defineConfig } from 'vitepress'
import pkg from '../package.json'

const hostname = 'https://megasupersoft.com'

export default defineConfig({
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  },

  lang: 'en-NZ',
  title: 'MegaSuperSoft',
  description: 'Software made with care in New Zealand',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,

  sitemap: {
    hostname,
    transformItems(items) {
      return items.filter(item => !item.url.includes('logo') && !item.url.includes('404'))
    },
  },

  head: [
    // Favicon & icons
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],

    // Theme color (matches dark mode bg)
    ['meta', { name: 'theme-color', content: '#12110f', media: '(prefers-color-scheme: dark)' }],
    ['meta', { name: 'theme-color', content: '#a39e98', media: '(prefers-color-scheme: light)' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'MegaSuperSoft' }],
    ['meta', { property: 'og:locale', content: 'en_NZ' }],
    ['meta', { property: 'og:image', content: `${hostname}/og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'MegaSuperSoft — Code, pixels, and play.' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@megasupersoft' }],
    ['meta', { name: 'twitter:image', content: `${hostname}/og-image.png` }],

    // Security & privacy
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],

    // Fonts — preconnect then load
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap', rel: 'stylesheet' }],

    // JSON-LD structured data
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MegaSuperSoft',
      url: hostname,
      logo: `${hostname}/favicon.svg`,
      description: 'Independent software company. Local-first, open source desktop software and games. Based in New Zealand.',
      foundingLocation: {
        '@type': 'Place',
        name: 'New Zealand',
      },
      sameAs: [
        'https://github.com/megasupersoft',
        'https://x.com/megasupersoft',
        'https://www.youtube.com/@megasupersoftware',
        'https://bsky.app/profile/megasupersoft.bsky.social',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@megasupersoft.com',
        contactType: 'customer support',
      },
    })],
  ],

  // Per-page Open Graph tags
  transformHead({ pageData }) {
    const head: Array<[string, Record<string, string>]> = []
    const title = pageData.frontmatter.title || pageData.title
    const description = pageData.frontmatter.description || pageData.description

    head.push(['meta', { property: 'og:title', content: `${title} | MegaSuperSoft` }])
    if (description) {
      head.push(['meta', { property: 'og:description', content: description }])
    }

    const canonicalUrl = `${hostname}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    head.push(['link', { rel: 'canonical', href: canonicalUrl }])
    head.push(['meta', { property: 'og:url', content: canonicalUrl }])

    return head
  },

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
      { icon: 'x', link: 'https://x.com/megasupersoft' },
      { icon: 'youtube', link: 'https://www.youtube.com/@megasupersoftware' },
      {
        icon: { svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.574 6.467.744 3.033 3.40 4.065 5.824 3.556 1.96-.412 3.68-.412 5.602-.412-3.766 2.606-9.504 1.233-11.236 5.67-.263.672-.39 1.085.46 1.95C4.924 24.667 11.5 21 12 21c.5 0 7.076 3.667 10.776 0 .85-.866.723-1.278.46-1.95-1.732-4.437-7.47-3.064-11.236-5.67 1.922 0 3.642 0 5.602.412 2.424.509 5.08-.523 5.824-3.556.196-.818.574-5.778.574-6.467 0-.688-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>' },
        link: 'https://bsky.app/profile/megasupersoft.bsky.social',
      },
    ],

    search: {
      provider: 'local',
    },
  },
})
