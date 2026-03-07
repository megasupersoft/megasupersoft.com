const hostname = 'https://megasupersoft.com'

export default defineNuxtConfig({
  compatibilityDate: '2025-03-07',
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxthub/core',
    '@nuxt/content',
    'nuxt-auth-utils',
  ],

  hub: {
    database: true,
    kv: true,
    blob: true,
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'CONTENT_DB',
    },
    renderer: {
      anchorLinks: true,
    },
  },

  mdc: {
    components: {
      map: {
        'download-table': 'DownloadTable',
      },
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en-NZ' },
      title: 'MegaSuperSoft',
      meta: [
        { name: 'description', content: 'Software made with care in New Zealand' },
        { name: 'theme-color', content: '#12110f', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#a39e98', media: '(prefers-color-scheme: light)' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MegaSuperSoft' },
        { property: 'og:locale', content: 'en_NZ' },
        { property: 'og:image', content: `${hostname}/og-image-dark.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'MegaSuperSoft — Code, pixels, and play.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@megasupersoft' },
        { name: 'twitter:image', content: `${hostname}/og-image-dark.png` },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap', rel: 'stylesheet' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MegaSuperSoft',
            url: hostname,
            logo: `${hostname}/favicon.svg`,
            description: 'Independent software company. Local-first, open source desktop software and games. Based in New Zealand.',
            foundingLocation: { '@type': 'Place', name: 'New Zealand' },
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
          }),
        },
      ],
    },
  },

  css: [
    '~/assets/css/vars.css',
    '~/assets/css/animations.css',
    '~/assets/css/prose.css',
    '~/assets/css/transitions.css',
  ],

  runtimeConfig: {
    // Server-only secrets — mapped from existing env var names
    githubToken: process.env.GITHUB_TOKEN || '',
    githubOrg: process.env.GITHUB_ORG || 'megasupersoft',
    xApiKey: process.env.X_API_KEY || '',
    xApiSecret: process.env.X_API_SECRET || '',
    xAccessToken: process.env.X_ACCESS_TOKEN || '',
    xAccessSecret: process.env.X_ACCESS_SECRET || '',
    blueskyHandle: process.env.BLUESKY_HANDLE || 'megasupersoft.bsky.social',
    blueskyAppPassword: process.env.BLUESKY_APP_PASSWORD || '',
    youtubeClientId: process.env.YOUTUBE_CLIENT_ID || '',
    youtubeClientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
    youtubeRefreshToken: process.env.YOUTUBE_REFRESH_TOKEN || '',
    youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || '',
    cfApiToken: process.env.CF_API_TOKEN || '',
    cfZoneId: '756c6e06a2eed70d147f00e4f7ed756d',
    sessionPassword: '',
    oauth: {
      github: {
        clientId: '',
        clientSecret: '',
      },
    },
  },

  devtools: { enabled: false },

  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // Every 6 hours: collect metrics from all platforms
      '0 */6 * * *': ['collect-metrics'],
    },
  },
})
