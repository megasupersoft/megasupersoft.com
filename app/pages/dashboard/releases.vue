<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Releases | Dashboard' })

const { data: releases, status } = await useFetch('/api/releases')

const released = computed(() => releases.value?.filter((r: any) => r.tag) || [])
const unreleased = computed(() => releases.value?.filter((r: any) => !r.tag) || [])

function formatSize(bytes: number) {
  if (bytes > 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes > 1_000) return `${(bytes / 1_000).toFixed(0)} KB`
  return `${bytes} B`
}
</script>

<template>
  <div>
    <h1>Releases</h1>
    <p class="subtitle">Latest releases across all products</p>

    <div v-if="status === 'pending'" class="loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      Fetching from GitHub...
    </div>

    <template v-else>
      <div v-if="released.length" class="releases-list">
        <div v-for="release in released" :key="release.repo" class="release-card">
          <div class="release-header">
            <div class="release-product">
              <span class="release-name">{{ release.product }}</span>
              <span class="release-tag">{{ release.tag }}</span>
            </div>
            <div class="release-links">
              <a v-if="release.website" :href="release.website" target="_blank" rel="noopener" class="release-link">
                <span class="material-symbols-outlined">language</span>
              </a>
              <a :href="release.url" target="_blank" rel="noopener" class="release-link">
                <span class="material-symbols-outlined">open_in_new</span>
              </a>
            </div>
          </div>

          <div class="release-title" v-if="release.name && release.name !== release.tag">{{ release.name }}</div>

          <div class="release-meta">
            <span class="meta-item">
              <span class="material-symbols-outlined">calendar_today</span>
              {{ new Date(release.published).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </span>
            <span class="meta-item" v-if="release.downloads">
              <span class="material-symbols-outlined">download</span>
              {{ release.downloads.toLocaleString() }} downloads
            </span>
          </div>

          <div v-if="release.assets?.length" class="release-assets">
            <div v-for="asset in release.assets" :key="asset.name" class="asset-row">
              <a :href="asset.url" class="asset-name" target="_blank" rel="noopener">{{ asset.name }}</a>
              <div class="asset-meta">
                <span class="asset-size">{{ formatSize(asset.size) }}</span>
                <span class="asset-dl">{{ asset.downloads }} dl</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="unreleased.length" class="unreleased-section">
        <h2>Unreleased</h2>
        <div class="unreleased-grid">
          <div v-for="product in unreleased" :key="product.repo" class="unreleased-card">
            <span class="unreleased-name">{{ product.product }}</span>
            <span class="unreleased-repo">{{ product.repo }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
h1 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
h2 { font-family: var(--font-heading); font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--mss-text-2); }
.subtitle { color: var(--mss-text-3); font-size: 0.85rem; margin-bottom: 2rem; }

.loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--mss-text-3);
  padding: 2rem 0;
  font-size: 0.85rem;
}
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.releases-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.release-card {
  background: var(--mss-bg-soft);
  border-radius: 8px;
  padding: 1.25rem;
}

.release-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.release-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.release-name {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
}

.release-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--mss-accent);
  background: rgba(var(--mss-accent-raw), 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.release-links {
  display: flex;
  gap: 0.5rem;
}

.release-link {
  color: var(--mss-text-3);
  display: flex;
  padding: 0.3rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}
.release-link:hover {
  color: var(--mss-accent);
  background: rgba(var(--mss-accent-raw), 0.1);
}
.release-link .material-symbols-outlined { font-size: 1.1rem; }

.release-title {
  font-size: 0.85rem;
  color: var(--mss-text-2);
  margin-bottom: 0.5rem;
}

.release-meta {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: var(--mss-text-3);
  font-family: var(--font-mono);
}
.meta-item .material-symbols-outlined { font-size: 0.9rem; }

.release-assets {
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.asset-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  transition: background 0.12s;
}
.asset-row:hover {
  background: var(--mss-bg-mute);
}

.asset-name {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--mss-text-2);
  text-decoration: none;
}
.asset-name:hover {
  color: var(--mss-accent);
}

.asset-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.72rem;
  color: var(--mss-text-3);
  font-family: var(--font-mono);
}

.unreleased-section {
  padding-top: 1.5rem;
}

.unreleased-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.unreleased-card {
  background: var(--mss-bg-soft);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.unreleased-name {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--mss-text-2);
}

.unreleased-repo {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--mss-text-3);
}
</style>
