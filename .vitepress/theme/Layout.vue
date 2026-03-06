<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
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
    <template #home-hero-before>
      <AsciiHero v-if="frontmatter.layout === 'home'" />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>
