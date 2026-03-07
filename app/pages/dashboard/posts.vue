<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Posts | Dashboard' })

const { data: posts, refresh, status } = await useFetch('/api/posts')

const statusColor: Record<string, string> = {
  published: 'var(--mss-tip)',
  partial: '#c2a06a',
  failed: 'var(--mss-accent)',
  publishing: 'var(--mss-text-3)',
  draft: 'var(--mss-text-3)',
}

const platformIcons: Record<string, string> = {
  x: 'x',
  bluesky: 'bluesky',
  youtube: 'youtube',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Posts</h1>
        <p class="subtitle">Published and scheduled posts across all platforms</p>
      </div>
      <NuxtLink to="/dashboard/compose" class="btn-compose">
        <span class="material-symbols-outlined">add</span>
        New Post
      </NuxtLink>
    </div>

    <div v-if="status === 'pending'" class="loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      Loading...
    </div>

    <div v-else-if="!posts?.length" class="empty-state">
      <span class="material-symbols-outlined">feed</span>
      <p>No posts yet. <NuxtLink to="/dashboard/compose">Compose your first post.</NuxtLink></p>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-content">{{ post.content }}</div>
        <div class="post-footer">
          <div class="post-platforms">
            <span v-for="p in post.platforms" :key="p" class="platform-badge">
              <SocialIcon :name="platformIcons[p] || p" />
            </span>
          </div>
          <span class="post-status" :style="{ color: statusColor[post.status] || 'var(--mss-text-3)' }">
            {{ post.status }}
          </span>
          <span class="post-time">{{ timeAgo(post.created_at) }}</span>
          <span class="post-author">{{ post.author }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
.subtitle { color: var(--mss-text-3); font-size: 0.85rem; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.btn-compose {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--mss-accent);
  color: var(--mss-bg);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.15s;
}
.btn-compose:hover { opacity: 0.9; }
.btn-compose .material-symbols-outlined { font-size: 1rem; }

.loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--mss-text-3);
  font-size: 0.85rem;
}
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: var(--mss-text-3);
  text-align: center;
}
.empty-state .material-symbols-outlined { font-size: 3rem; opacity: 0.3; }
.empty-state a { color: var(--mss-accent); }

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-card {
  background: var(--mss-bg-soft);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.post-content {
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.72rem;
}

.post-platforms {
  display: flex;
  gap: 0.35rem;
}

.platform-badge {
  display: flex;
  color: var(--mss-text-3);
}

.post-status {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.post-time {
  color: var(--mss-text-3);
  font-family: var(--font-mono);
}

.post-author {
  color: var(--mss-text-3);
  margin-left: auto;
}
</style>
