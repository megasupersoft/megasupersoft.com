<script setup lang="ts">
import { products, releasedProducts } from '~/utils/products'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Dashboard | MegaSuperSoft' })

const { data: releases } = await useFetch('/api/releases')
const { data: stats } = await useFetch('/api/stats')
const { data: metrics } = await useFetch('/api/metrics')

const github = computed(() => metrics.value?.current?.github || {})
const bluesky = computed(() => metrics.value?.current?.bluesky || {})

const latestRelease = computed(() => {
  const released = releases.value?.filter((r: any) => r.tag)
  if (!released?.length) return null
  return released.sort((a: any, b: any) => new Date(b.published).getTime() - new Date(a.published).getTime())[0]
})

const totalDownloads = computed(() => {
  return releases.value
    ?.filter((r: any) => r.tag)
    ?.reduce((sum: number, r: any) => sum + (r.downloads || 0), 0) || 0
})
</script>

<template>
  <div class="dashboard-overview">
    <div class="page-header">
      <h1>Dashboard</h1>
      <p class="subtitle">MegaSuperSoft command center</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrap">
          <span class="material-symbols-outlined">inventory_2</span>
        </div>
        <div class="stat-content">
          <span class="stat-label">Products</span>
          <span class="stat-value">{{ products.length }}</span>
          <span class="stat-detail">{{ releasedProducts.length }} released</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap">
          <span class="material-symbols-outlined">new_releases</span>
        </div>
        <div class="stat-content">
          <span class="stat-label">Latest Release</span>
          <span class="stat-value">{{ latestRelease?.tag || '—' }}</span>
          <span class="stat-detail" v-if="latestRelease">{{ latestRelease.product }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap">
          <span class="material-symbols-outlined">download</span>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Downloads</span>
          <span class="stat-value">{{ totalDownloads.toLocaleString() }}</span>
          <span class="stat-detail">across all releases</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap">
          <span class="material-symbols-outlined">edit_note</span>
        </div>
        <div class="stat-content">
          <span class="stat-label">Social Posts</span>
          <span class="stat-value">{{ stats?.publishedPosts ?? '—' }}</span>
          <span class="stat-detail">{{ stats?.recentPosts || 0 }} this week</span>
        </div>
      </div>
    </div>

    <div class="sections-grid">
      <div class="section-card">
        <div class="section-header">
          <h2>Products</h2>
          <span class="section-count">{{ products.length }}</span>
        </div>
        <div class="product-list">
          <div v-for="product in products" :key="product.slug" class="product-row">
            <div class="product-info">
              <span class="material-symbols-outlined product-icon" :style="{ color: product.color }">{{ product.icon }}</span>
              <div>
                <span class="product-name">{{ product.name }}</span>
                <span class="product-desc">{{ product.description }}</span>
              </div>
            </div>
            <span :class="['product-status', product.released ? 'released' : 'dev']">
              {{ product.released ? 'Released' : 'In dev' }}
            </span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div class="actions-list">
          <NuxtLink to="/dashboard/compose" class="action-item">
            <span class="material-symbols-outlined">edit_note</span>
            New Post
          </NuxtLink>
          <NuxtLink to="/dashboard/youtube" class="action-item">
            <span class="material-symbols-outlined">smart_display</span>
            YouTube
          </NuxtLink>
          <NuxtLink to="/dashboard/releases" class="action-item">
            <span class="material-symbols-outlined">new_releases</span>
            Releases
          </NuxtLink>
          <NuxtLink to="/dashboard/analytics" class="action-item">
            <span class="material-symbols-outlined">monitoring</span>
            Analytics
          </NuxtLink>
          <NuxtLink to="/dashboard/brand" class="action-item">
            <span class="material-symbols-outlined">palette</span>
            Brand Assets
          </NuxtLink>
        </div>

        <div class="social-section">
          <div class="section-header">
            <h2>Social</h2>
          </div>
          <div class="social-metrics">
            <div class="social-row" v-if="github.stars !== undefined">
              <SocialIcon name="github" /><span>{{ (github.stars || 0).toLocaleString() }} stars</span>
            </div>
            <div class="social-row" v-if="bluesky.followers !== undefined">
              <SocialIcon name="bluesky" /><span>{{ (bluesky.followers || 0).toLocaleString() }} followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.5rem;
}
.page-header h1 {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.subtitle {
  color: var(--mss-text-3);
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--mss-bg-soft);
  border-radius: 14px;
  padding: 1.35rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.stat-icon-wrap {
  background: rgba(var(--mss-accent-raw), 0.08);
  border-radius: 12px;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon-wrap .material-symbols-outlined {
  font-size: 1.35rem;
  color: var(--mss-accent);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.stat-label {
  font-size: 0.75rem;
  color: var(--mss-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}
.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: var(--font-mono);
  line-height: 1.3;
}
.stat-detail {
  font-size: 0.75rem;
  color: var(--mss-text-3);
}

.sections-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 1rem;
}

.section-card {
  background: var(--mss-bg-soft);
  border-radius: 14px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.section-header h2 {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}
.section-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--mss-text-3);
  background: var(--mss-bg-mute);
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-family: var(--font-mono);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.product-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.75rem;
  border-radius: 10px;
  transition: background 0.1s;
}
.product-row:hover {
  background: var(--mss-bg-mute);
}
.product-info {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.product-icon {
  font-size: 1.3rem;
}
.product-name {
  font-size: 0.9rem;
  font-weight: 600;
  display: block;
  line-height: 1.3;
}
.product-desc {
  font-size: 0.78rem;
  color: var(--mss-text-3);
  line-height: 1.3;
}
.product-status {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}
.product-status.released {
  color: var(--mss-tip);
  background: rgba(122, 184, 158, 0.1);
}
.product-status.dev {
  color: var(--mss-text-3);
  background: var(--mss-bg-mute);
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.75rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--mss-text-2);
  text-decoration: none;
  transition: all 0.1s;
}
.action-item:hover {
  background: var(--mss-bg-mute);
  color: var(--mss-accent);
}
.action-item .material-symbols-outlined {
  font-size: 1.25rem;
  opacity: 0.6;
}
.action-item:hover .material-symbols-outlined {
  opacity: 1;
}

.social-section {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
}
.social-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.social-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: var(--mss-text-2);
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  background: var(--mss-bg-mute);
}

@media (max-width: 960px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .sections-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
