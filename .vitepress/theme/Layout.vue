<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import VPSwitchAppearance from 'vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue'
import AsciiHero from './components/AsciiHero.vue'
import SiteFooter from './components/SiteFooter.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #nav-bar-title-before>
      <span class="nav-brand"><span class="nav-brand-accent">Mega</span>SuperSoft</span>
    </template>
    <template #nav-bar-content-after>
      <div class="mobile-appearance-toggle">
        <VPSwitchAppearance />
      </div>
    </template>
    <template #home-hero-before>
      <AsciiHero v-if="frontmatter.layout === 'home'" />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>

<style>
/* Show toggle in nav bar on mobile/tablet, hide on desktop (where default one shows) */
.mobile-appearance-toggle {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}
@media (min-width: 1280px) {
  .mobile-appearance-toggle {
    display: none;
  }
}

/* Hide the toggle from the hamburger menu since it's now always in the nav */
.VPNavScreenAppearance {
  display: none !important;
}
</style>
