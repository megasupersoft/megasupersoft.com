import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import AsciiHero from './components/AsciiHero.vue'
import DownloadTable from './components/DownloadTable.vue'
import SiteFooter from './components/SiteFooter.vue'
import './styles/vars.css'
import './styles/animations.css'

function setupScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  // Feature cards — add reveal classes and stagger wrapper
  const featureItems = document.querySelector('.VPFeatures .items')
  if (featureItems) {
    featureItems.classList.add('reveal-stagger')
    featureItems.querySelectorAll('.VPFeature').forEach((el) => {
      el.classList.add('reveal')
      observer.observe(el)
    })
  }

  // Home page content sections
  document.querySelectorAll('.VPHome .vp-doc h2, .VPHome .vp-doc p').forEach((el) => {
    el.classList.add('reveal')
    observer.observe(el)
  })

  // Footer
  document.querySelectorAll('.site-footer .footer-cols').forEach((el) => {
    observer.observe(el)
  })
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('AsciiHero', AsciiHero)
    app.component('DownloadTable', DownloadTable)
    app.component('SiteFooter', SiteFooter)

    if (typeof window !== 'undefined') {
      router.onAfterRouteChanged = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(setupScrollReveal)
        })
      }
    }
  },
} satisfies Theme
