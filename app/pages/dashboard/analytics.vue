<script setup lang="ts">
import { products } from '~/utils/products'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Analytics | Dashboard' })

const { data: metrics, refresh } = await useFetch('/api/metrics')
const collecting = ref(false)

async function collectNow() {
  collecting.value = true
  try {
    await $fetch('/api/metrics/collect', { method: 'POST' })
    await refresh()
  } catch (e: any) {
    console.error('Collection failed:', e)
  }
  collecting.value = false
}

const github = computed(() => metrics.value?.current?.github || {})
const cloudflare = computed(() => metrics.value?.current?.cloudflare || {})
const bluesky = computed(() => metrics.value?.current?.bluesky || {})
const youtube = computed(() => metrics.value?.current?.youtube || {})

const pageviewChart = computed(() => {
  const data = metrics.value?.charts?.['cloudflare.pageviews_24h'] || []
  if (!data.length) return null
  const max = Math.max(...data.map((d: any) => d.value), 1)
  return data.map((d: any) => ({
    date: d.date,
    value: d.value,
    pct: (d.value / max) * 100,
  }))
})

const starsChart = computed(() => {
  const data = metrics.value?.charts?.['github.stars'] || []
  if (!data.length) return null
  const max = Math.max(...data.map((d: any) => d.value), 1)
  return data.map((d: any) => ({
    date: d.date,
    value: d.value,
    pct: (d.value / max) * 100,
  }))
})

function fmt(n: number | undefined) {
  if (n === undefined || n === null) return '--'
  return n.toLocaleString()
}

const softwareApps = products.filter(p => p.type === 'software')
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Analytics</h1>
        <p class="subtitle">Telemetry, web analytics, and social metrics</p>
      </div>
      <button class="collect-btn" :disabled="collecting" @click="collectNow">
        <span class="material-symbols-outlined" :class="{ spinning: collecting }">sync</span>
        {{ collecting ? 'Collecting...' : 'Collect Now' }}
      </button>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon-wrap"><span class="material-symbols-outlined">visibility</span></div>
        <div class="stat-content">
          <span class="stat-label">Page Views (24h)</span>
          <span class="stat-value">{{ fmt(cloudflare.pageviews_24h) }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap"><span class="material-symbols-outlined">person</span></div>
        <div class="stat-content">
          <span class="stat-label">Visitors (24h)</span>
          <span class="stat-value">{{ fmt(cloudflare.visitors_24h) }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap"><span class="material-symbols-outlined">star</span></div>
        <div class="stat-content">
          <span class="stat-label">GitHub Stars</span>
          <span class="stat-value">{{ fmt(github.stars) }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrap"><span class="material-symbols-outlined">download</span></div>
        <div class="stat-content">
          <span class="stat-label">Total Downloads</span>
          <span class="stat-value">{{ fmt(github.downloads) }}</span>
        </div>
      </div>
    </div>

    <div class="analytics-grid">
      <!-- Web Analytics Chart -->
      <section class="card wide">
        <div class="card-header">
          <div class="card-header-left">
            <div class="card-icon-wrap"><span class="material-symbols-outlined">language</span></div>
            <h2>Web Analytics</h2>
          </div>
          <span class="card-detail">Page views · Last 30 days</span>
        </div>
        <div v-if="pageviewChart" class="chart-container">
          <div class="chart-bars">
            <div
              v-for="(bar, i) in pageviewChart" :key="i"
              class="chart-bar-wrapper"
              :title="`${bar.date}: ${bar.value.toLocaleString()} views`"
            >
              <div class="chart-bar" :style="{ height: `${Math.max(bar.pct, 3)}%` }" />
            </div>
          </div>
          <div class="chart-labels">
            <span>{{ pageviewChart[0]?.date?.slice(5) }}</span>
            <span>{{ pageviewChart[pageviewChart.length - 1]?.date?.slice(5) }}</span>
          </div>
        </div>
        <div v-else class="placeholder-chart">
          <div class="chart-bars">
            <div v-for="i in 14" :key="i" class="chart-bar placeholder" :style="{ height: `${20 + Math.random() * 60}%` }" />
          </div>
          <p class="placeholder-text">No data yet — click "Collect Now" or wait for the scheduled run</p>
        </div>
        <div class="web-stats-row">
          <div class="web-stat">
            <span class="web-stat-label">Requests (24h)</span>
            <span class="web-stat-value">{{ fmt(cloudflare.requests_24h) }}</span>
          </div>
          <div class="web-stat">
            <span class="web-stat-label">Page Views (24h)</span>
            <span class="web-stat-value">{{ fmt(cloudflare.pageviews_24h) }}</span>
          </div>
          <div class="web-stat">
            <span class="web-stat-label">Unique Visitors (24h)</span>
            <span class="web-stat-value">{{ fmt(cloudflare.visitors_24h) }}</span>
          </div>
        </div>
      </section>

      <!-- GitHub -->
      <section class="card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="card-icon-wrap"><span class="material-symbols-outlined">code</span></div>
            <h2>GitHub</h2>
          </div>
        </div>
        <div class="metric-list">
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="github" /> Stars</span>
            <span class="metric-value" :class="{ empty: !github.stars }">{{ fmt(github.stars) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="github" /> Forks</span>
            <span class="metric-value" :class="{ empty: !github.forks }">{{ fmt(github.forks) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="github" /> Open Issues</span>
            <span class="metric-value" :class="{ empty: !github.issues }">{{ fmt(github.issues) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="github" /> Downloads</span>
            <span class="metric-value" :class="{ empty: !github.downloads }">{{ fmt(github.downloads) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="github" /> Org Followers</span>
            <span class="metric-value" :class="{ empty: !github.followers }">{{ fmt(github.followers) }}</span>
          </div>
        </div>
      </section>

      <!-- Social -->
      <section class="card">
        <div class="card-header">
          <div class="card-header-left">
            <div class="card-icon-wrap"><span class="material-symbols-outlined">group</span></div>
            <h2>Social</h2>
          </div>
        </div>
        <div class="metric-list">
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="bluesky" /> Followers</span>
            <span class="metric-value" :class="{ empty: !bluesky.followers }">{{ fmt(bluesky.followers) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="bluesky" /> Posts</span>
            <span class="metric-value" :class="{ empty: !bluesky.posts }">{{ fmt(bluesky.posts) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="youtube" /> Subscribers</span>
            <span class="metric-value" :class="{ empty: !youtube.subscribers }">{{ fmt(youtube.subscribers) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="youtube" /> Views</span>
            <span class="metric-value" :class="{ empty: !youtube.views }">{{ fmt(youtube.views) }}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><SocialIcon name="youtube" /> Videos</span>
            <span class="metric-value" :class="{ empty: !youtube.videos }">{{ fmt(youtube.videos) }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
h1 { font-family: var(--font-heading); font-size: 1.75rem; font-weight: 700; margin-bottom: 0.3rem; }
h2 { font-family: var(--font-heading); font-size: 1rem; font-weight: 600; margin: 0; }
.subtitle { color: var(--mss-text-3); font-size: 0.9rem; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
}

.collect-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--mss-bg-soft);
  color: var(--mss-text-2);
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.collect-btn:hover:not(:disabled) { color: var(--mss-accent); }
.collect-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.collect-btn .material-symbols-outlined { font-size: 1.15rem; }
.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--mss-bg-soft);
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.stat-icon-wrap {
  background: rgba(var(--mss-accent-raw), 0.08);
  border-radius: 12px;
  padding: 0.55rem;
  display: flex;
}
.stat-icon-wrap .material-symbols-outlined {
  font-size: 1.3rem;
  color: var(--mss-accent);
}

.stat-content { display: flex; flex-direction: column; }
.stat-label { font-size: 0.72rem; color: var(--mss-text-3); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
.stat-value { font-size: 1.3rem; font-weight: 700; font-family: var(--font-mono); line-height: 1.3; }

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.card {
  background: var(--mss-bg-soft);
  border-radius: 14px;
  padding: 1.5rem;
}
.card.wide { grid-column: 1 / -1; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.card-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.card-icon-wrap {
  background: rgba(var(--mss-accent-raw), 0.08);
  border-radius: 10px;
  padding: 0.45rem;
  display: flex;
}
.card-icon-wrap .material-symbols-outlined {
  font-size: 1.25rem;
  color: var(--mss-accent);
}
.card-detail { font-size: 0.78rem; color: var(--mss-text-3); }

.chart-container { margin-bottom: 1.25rem; }

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 160px;
  width: 100%;
}
.chart-bar-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  cursor: default;
}
.chart-bar {
  width: 100%;
  background: rgba(var(--mss-accent-raw), 0.2);
  border-radius: 3px 3px 0 0;
  min-height: 2px;
  transition: background 0.15s;
}
.chart-bar.placeholder {
  background: rgba(var(--mss-accent-raw), 0.06);
  flex: 1;
}
.chart-bar-wrapper:hover .chart-bar { background: var(--mss-accent); }

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.63rem;
  color: var(--mss-text-3);
  margin-top: 0.35rem;
  padding: 0 2px;
}

.web-stats-row {
  display: flex;
  gap: 2.5rem;
  padding-top: 1rem;
}
.web-stat { display: flex; flex-direction: column; }
.web-stat-label { font-size: 0.72rem; color: var(--mss-text-3); text-transform: uppercase; letter-spacing: 0.04em; }
.web-stat-value { font-family: var(--font-mono); font-weight: 600; font-size: 1rem; }

.placeholder-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.placeholder-chart .chart-bars {
  height: 120px;
  padding: 0 0.5rem;
}
.placeholder-text { font-size: 0.75rem; color: var(--mss-text-3); text-align: center; }

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: var(--mss-bg-mute);
  transition: background 0.1s;
}
.metric-row:hover {
  background: var(--mss-bg);
}
.metric-label {
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.metric-value {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
}
.metric-value.empty { color: var(--mss-text-3); }

@media (max-width: 960px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .analytics-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; gap: 1rem; }
  .web-stats-row { flex-direction: column; gap: 0.5rem; }
}
</style>
