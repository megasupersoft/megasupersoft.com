import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import AsciiHero from './components/AsciiHero.vue'
import DownloadTable from './components/DownloadTable.vue'
import SiteFooter from './components/SiteFooter.vue'
import './styles/vars.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('AsciiHero', AsciiHero)
    app.component('DownloadTable', DownloadTable)
    app.component('SiteFooter', SiteFooter)
  },
} satisfies Theme
