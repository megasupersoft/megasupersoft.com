<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'Compose | Dashboard' })

const content = ref('')
const platforms = ref({ x: true, bluesky: true, youtube: false })
const posting = ref(false)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

async function publish() {
  posting.value = true
  feedback.value = null
  try {
    const result = await $fetch('/api/posts', {
      method: 'POST',
      body: {
        content: content.value,
        platforms: Object.entries(platforms.value)
          .filter(([, v]) => v)
          .map(([k]) => k),
      },
    })
    content.value = ''
    feedback.value = { type: 'success', message: result.message || 'Published successfully' }
  } catch (err: any) {
    feedback.value = { type: 'error', message: err?.data?.statusMessage || 'Failed to publish' }
  } finally {
    posting.value = false
  }
}

const charLimit = computed(() => platforms.value.x ? 280 : 300)
</script>

<template>
  <div class="compose-page">
    <div class="page-header">
      <h1>Compose</h1>
      <p class="subtitle">Draft and publish to your socials</p>
    </div>

    <div v-if="feedback" :class="['feedback', feedback.type]">
      <span class="material-symbols-outlined">{{ feedback.type === 'success' ? 'check_circle' : 'error' }}</span>
      {{ feedback.message }}
    </div>

    <div class="compose-form">
      <textarea
        v-model="content"
        class="compose-input"
        placeholder="What's happening at MegaSuperSoft?"
        rows="6"
      />

      <div class="compose-meta">
        <div class="platform-toggles">
          <label class="platform-toggle" :class="{ active: platforms.x }">
            <input type="checkbox" v-model="platforms.x" />
            <SocialIcon name="x" /> X
          </label>
          <label class="platform-toggle" :class="{ active: platforms.bluesky }">
            <input type="checkbox" v-model="platforms.bluesky" />
            <SocialIcon name="bluesky" /> Bluesky
          </label>
          <label class="platform-toggle" :class="{ active: platforms.youtube }">
            <input type="checkbox" v-model="platforms.youtube" />
            <SocialIcon name="youtube" /> YouTube
          </label>
        </div>

        <div class="compose-actions">
          <span class="char-count" :class="{ over: content.length > charLimit }">
            {{ content.length }} / {{ charLimit }}
          </span>
          <button
            class="btn-publish"
            :disabled="!content.trim() || posting"
            @click="publish"
          >
            <span v-if="posting" class="material-symbols-outlined spin">progress_activity</span>
            {{ posting ? 'Publishing...' : 'Publish' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 2.5rem; }
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

.feedback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  margin-bottom: 1.5rem;
  max-width: 640px;
}
.feedback.success {
  background: rgba(122, 184, 158, 0.08);
  color: var(--mss-tip);
}
.feedback.error {
  background: rgba(194, 122, 122, 0.08);
  color: var(--mss-accent);
}
.feedback .material-symbols-outlined {
  font-size: 1.1rem;
}

.compose-form {
  max-width: 640px;
}

.compose-input {
  width: 100%;
  background: var(--mss-bg-soft);
  border: none;
  border-radius: 14px;
  padding: 1.15rem 1.25rem;
  color: var(--mss-text-1);
  font-family: var(--font-body);
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
}
.compose-input::placeholder {
  color: var(--mss-text-3);
}

.compose-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.platform-toggles {
  display: flex;
  gap: 0.5rem;
}

.platform-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--mss-text-3);
  background: var(--mss-bg-soft);
  cursor: pointer;
  transition: all 0.15s;
}
.platform-toggle input { display: none; }
.platform-toggle.active {
  color: var(--mss-accent);
  background: rgba(var(--mss-accent-raw), 0.06);
}

.compose-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.char-count {
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--mss-text-3);
}
.char-count.over {
  color: #b87a7a;
}

.btn-publish {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--mss-accent);
  color: var(--mss-bg);
  border: none;
  border-radius: 12px;
  padding: 0.65rem 1.6rem;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-publish:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.btn-publish:not(:disabled):hover {
  opacity: 0.9;
}

.spin {
  animation: spin 1s linear infinite;
  font-size: 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
