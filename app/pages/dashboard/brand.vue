<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Brand | Dashboard' })

const assets = [
  { name: 'Logo (Dark)', file: '/brand/logo-square-dark.png', size: '1024x1024', category: 'logo' },
  { name: 'Logo (Light)', file: '/brand/logo-square-light.png', size: '1024x1024', category: 'logo' },
  { name: 'X Banner (Dark)', file: '/brand/banner-x-dark.png', size: '1500x500', category: 'banner' },
  { name: 'X Banner (Light)', file: '/brand/banner-x-light.png', size: '1500x500', category: 'banner' },
  { name: 'YouTube Banner (Dark)', file: '/brand/banner-youtube-dark.png', size: '2560x1440', category: 'banner' },
  { name: 'YouTube Banner (Light)', file: '/brand/banner-youtube-light.png', size: '2560x1440', category: 'banner' },
  { name: 'OG Image (Dark)', file: '/og-image-dark.png', size: '1200x630', category: 'og' },
  { name: 'OG Image (Light)', file: '/og-image-light.png', size: '1200x630', category: 'og' },
]

const filter = ref('all')
const filtered = computed(() =>
  filter.value === 'all' ? assets : assets.filter((a) => a.category === filter.value),
)
</script>

<template>
  <div>
    <h1>Brand Assets</h1>
    <p class="subtitle">Manage logos, banners, and social media assets</p>

    <div class="filter-bar">
      <button
        v-for="f in [{ key: 'all', label: 'All' }, { key: 'logo', label: 'Logos' }, { key: 'banner', label: 'Banners' }, { key: 'og', label: 'OG Images' }]"
        :key="f.key"
        :class="['filter-btn', { active: filter === f.key }]"
        @click="filter = f.key"
      >
        {{ f.label }}
      </button>
    </div>

    <div class="assets-grid">
      <div v-for="asset in filtered" :key="asset.file" class="asset-card">
        <div class="asset-preview-wrap">
          <img :src="asset.file" :alt="asset.name" class="asset-preview" />
        </div>
        <div class="asset-info">
          <div class="asset-details">
            <span class="asset-name">{{ asset.name }}</span>
            <span class="asset-size">{{ asset.size }}</span>
          </div>
          <a :href="asset.file" :download="asset.file.split('/').pop()" class="download-btn" aria-label="Download">
            <span class="material-symbols-outlined">download</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
.subtitle { color: var(--mss-text-3); font-size: 0.85rem; margin-bottom: 1.5rem; }

.filter-bar {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  background: var(--mss-bg-soft);
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--mss-text-3);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.filter-btn:hover {
  background: var(--mss-bg-mute);
  color: var(--mss-text-1);
}
.filter-btn.active {
  background: rgba(var(--mss-accent-raw), 0.1);
  color: var(--mss-accent);
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.asset-card {
  background: var(--mss-bg-soft);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.15s;
}
.asset-card:hover {
  box-shadow: 0 0 0 1px var(--mss-divider);
}

.asset-preview-wrap {
  background: var(--mss-bg-mute);
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-preview {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: contain;
}

.asset-info {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-details {
  display: flex;
  flex-direction: column;
}

.asset-name {
  font-size: 0.82rem;
  font-weight: 600;
}

.asset-size {
  font-size: 0.7rem;
  color: var(--mss-text-3);
  font-family: var(--font-mono);
}

.download-btn {
  color: var(--mss-text-3);
  display: flex;
  align-items: center;
  padding: 0.35rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}
.download-btn:hover {
  color: var(--mss-accent);
  background: rgba(var(--mss-accent-raw), 0.1);
}
.download-btn .material-symbols-outlined {
  font-size: 1.1rem;
}
</style>
