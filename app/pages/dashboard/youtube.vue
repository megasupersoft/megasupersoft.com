<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useHead({ title: 'YouTube | Dashboard' })

const queue = ref<any[]>([])
const loading = ref(true)
const creating = ref(false)
const publishing = ref<number | null>(null)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Form fields
const title = ref('Hello World — MegaSuperSoft')
const description = ref('Hello world from MegaSuperSoft! We make local-first, open source desktop software and games in New Zealand.\n\nFollow along as we build in public.\n\nhttps://megasupersoft.com\nhttps://bsky.app/profile/megasupersoft.bsky.social\nhttps://github.com/megasupersoft')
const tags = ref('megasupersoft, indie dev, open source, new zealand')
const privacy = ref('public')
const videoMode = ref<'generate' | 'upload'>('generate')
const uploadFile = ref<File | null>(null)
const generatingVideo = ref(false)
const previewId = ref<number | null>(null)

// Branded video text
const videoText = ref('MegaSuperSoft')
const videoSubtext = ref('Hello World')
const videoTagline = ref('Software made with care in New Zealand')

async function loadQueue() {
  loading.value = true
  try {
    queue.value = await $fetch('/api/youtube')
  } catch { queue.value = [] }
  loading.value = false
}

function generateBrandedVideo(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const W = 1920, H = 1080, FPS = 30, DURATION = 15
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')!
    const stream = canvas.captureStream(FPS)

    // Add silent audio track (YouTube requires audio)
    const audioCtx = new AudioContext()
    const oscillator = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    gain.gain.value = 0
    oscillator.connect(gain)
    const dest = audioCtx.createMediaStreamDestination()
    gain.connect(dest)
    oscillator.start()
    dest.stream.getAudioTracks().forEach(t => stream.addTrack(t))

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
    recorder.onstop = () => {
      oscillator.stop()
      audioCtx.close()
      resolve(new Blob(chunks, { type: 'video/webm' }))
    }
    recorder.onerror = reject

    // Load logo
    const logo = new Image()
    logo.crossOrigin = 'anonymous'
    logo.src = '/brand/logo-square-dark.png'

    logo.onload = () => {
      recorder.start()
      let frame = 0
      const totalFrames = FPS * DURATION

      function renderFrame() {
        if (frame >= totalFrames) {
          recorder.stop()
          return
        }

        const t = frame / FPS
        let alpha = 1
        if (t < 2) alpha = t / 2
        else if (t > 13) alpha = (15 - t) / 2

        // Background
        ctx.fillStyle = '#12110f'
        ctx.fillRect(0, 0, W, H)
        ctx.globalAlpha = alpha

        // Logo
        const logoSize = 200
        ctx.drawImage(logo, (W - logoSize) / 2, H / 2 - 180, logoSize, logoSize)

        // Title
        ctx.font = 'bold 64px "JetBrains Mono", "Courier New", monospace'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(videoText.value, W / 2, H / 2 + 70)

        // Subtitle
        ctx.font = 'bold 36px "JetBrains Mono", "Courier New", monospace'
        ctx.fillStyle = '#a39e98'
        ctx.fillText(videoSubtext.value, W / 2, H / 2 + 140)

        // Tagline
        ctx.font = '24px "JetBrains Mono", "Courier New", monospace'
        ctx.fillStyle = '#666666'
        ctx.fillText(videoTagline.value, W / 2, H / 2 + 200)

        // URL
        ctx.font = '28px "JetBrains Mono", "Courier New", monospace'
        ctx.fillStyle = '#888888'
        ctx.fillText('megasupersoft.com', W / 2, H - 60)

        ctx.globalAlpha = 1
        frame++
        requestAnimationFrame(renderFrame)
      }
      renderFrame()
    }

    logo.onerror = () => reject(new Error('Failed to load logo'))
  })
}

async function createQueueItem() {
  if (!title.value.trim()) return
  creating.value = true
  feedback.value = null

  try {
    let videoBlob: Blob

    if (videoMode.value === 'generate') {
      generatingVideo.value = true
      videoBlob = await generateBrandedVideo()
      generatingVideo.value = false
    } else {
      if (!uploadFile.value) {
        feedback.value = { type: 'error', message: 'Select a video file' }
        creating.value = false
        return
      }
      videoBlob = uploadFile.value
    }

    const form = new FormData()
    form.append('title', title.value)
    form.append('description', description.value)
    form.append('tags', tags.value)
    form.append('privacy', privacy.value)
    const ext = videoMode.value === 'generate' ? 'webm' : (uploadFile.value?.name?.split('.').pop() || 'mp4')
    form.append('video', videoBlob, `video.${ext}`)

    await $fetch('/api/youtube', { method: 'POST', body: form })
    feedback.value = { type: 'success', message: 'Video queued — review and publish below' }
    await loadQueue()
  } catch (err: any) {
    feedback.value = { type: 'error', message: err?.data?.statusMessage || err.message || 'Failed' }
  }
  creating.value = false
  generatingVideo.value = false
}

async function publishItem(id: number) {
  publishing.value = id
  feedback.value = null
  try {
    const result = await $fetch<any>(`/api/youtube/${id}`, { method: 'POST' })
    feedback.value = { type: 'success', message: `Published! ${result.url}` }
    await loadQueue()
  } catch (err: any) {
    feedback.value = { type: 'error', message: err?.data?.statusMessage || 'Upload failed' }
    await loadQueue()
  }
  publishing.value = null
}

async function deleteItem(id: number) {
  try {
    await $fetch(`/api/youtube/${id}`, { method: 'DELETE' })
    await loadQueue()
  } catch { /* ok */ }
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  uploadFile.value = input.files?.[0] || null
}

function statusLabel(s: string) {
  return { draft: 'Ready', uploading: 'Uploading...', published: 'Published', failed: 'Failed' }[s] || s
}

function statusClass(s: string) {
  return { draft: 'status-draft', uploading: 'status-uploading', published: 'status-published', failed: 'status-failed' }[s] || ''
}

onMounted(loadQueue)
</script>

<template>
  <div class="youtube-page">
    <div class="page-header">
      <h1>YouTube</h1>
      <p class="subtitle">Generate, queue, and publish videos to YouTube</p>
    </div>

    <div v-if="feedback" :class="['feedback', feedback.type]">
      <span class="material-symbols-outlined">{{ feedback.type === 'success' ? 'check_circle' : 'error' }}</span>
      {{ feedback.message }}
    </div>

    <!-- Create form -->
    <section class="create-section">
      <h2>Create Video</h2>

      <div class="form-grid">
        <div class="form-group full">
          <label>Title</label>
          <input v-model="title" type="text" placeholder="Video title" />
        </div>
        <div class="form-group full">
          <label>Description</label>
          <textarea v-model="description" rows="4" placeholder="Video description" />
        </div>
        <div class="form-group">
          <label>Tags</label>
          <input v-model="tags" type="text" placeholder="comma, separated, tags" />
        </div>
        <div class="form-group">
          <label>Privacy</label>
          <select v-model="privacy">
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div class="video-source">
        <label class="source-option" :class="{ active: videoMode === 'generate' }">
          <input type="radio" v-model="videoMode" value="generate" />
          <span class="material-symbols-outlined">auto_awesome</span>
          Generate Branded Video
        </label>
        <label class="source-option" :class="{ active: videoMode === 'upload' }">
          <input type="radio" v-model="videoMode" value="upload" />
          <span class="material-symbols-outlined">upload_file</span>
          Upload Video File
        </label>
      </div>

      <div v-if="videoMode === 'generate'" class="generate-options">
        <div class="form-group">
          <label>Main Text</label>
          <input v-model="videoText" type="text" />
        </div>
        <div class="form-group">
          <label>Subtitle</label>
          <input v-model="videoSubtext" type="text" />
        </div>
        <div class="form-group">
          <label>Tagline</label>
          <input v-model="videoTagline" type="text" />
        </div>
      </div>
      <div v-else class="upload-area">
        <input type="file" accept="video/*" @change="handleFileSelect" />
        <p v-if="uploadFile" class="file-info">{{ uploadFile.name }} ({{ (uploadFile.size / 1024 / 1024).toFixed(1) }} MB)</p>
      </div>

      <button class="btn-create" :disabled="creating || !title.trim()" @click="createQueueItem">
        <span v-if="generatingVideo" class="material-symbols-outlined spin">progress_activity</span>
        <span v-else-if="creating" class="material-symbols-outlined spin">progress_activity</span>
        <span v-else class="material-symbols-outlined">add_to_queue</span>
        {{ generatingVideo ? 'Generating video...' : creating ? 'Queuing...' : 'Add to Queue' }}
      </button>
    </section>

    <!-- Queue -->
    <section class="queue-section">
      <h2>Queue</h2>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="!queue.length" class="empty">No videos in queue</div>

      <div v-for="item in queue" :key="item.id" class="queue-item">
        <div class="queue-item-main">
          <div class="queue-info">
            <span class="queue-title">{{ item.title }}</span>
            <span class="queue-meta">
              <span :class="['queue-status', statusClass(item.status)]">{{ statusLabel(item.status) }}</span>
              <span class="queue-date">{{ new Date(item.created_at).toLocaleDateString() }}</span>
            </span>
            <span v-if="item.video_url" class="queue-url">
              <a :href="item.video_url" target="_blank">{{ item.video_url }}</a>
            </span>
            <span v-if="item.error" class="queue-error">{{ item.error }}</span>
          </div>
          <div class="queue-actions">
            <button
              v-if="item.status === 'draft' || item.status === 'failed'"
              class="btn-preview"
              @click="previewId = previewId === item.id ? null : item.id"
            >
              <span class="material-symbols-outlined">{{ previewId === item.id ? 'visibility_off' : 'visibility' }}</span>
              Preview
            </button>
            <button
              v-if="item.status === 'draft' || item.status === 'failed'"
              class="btn-publish"
              :disabled="publishing === item.id"
              @click="publishItem(item.id)"
            >
              <span v-if="publishing === item.id" class="material-symbols-outlined spin">progress_activity</span>
              <span v-else class="material-symbols-outlined">upload</span>
              {{ publishing === item.id ? 'Uploading...' : 'Publish' }}
            </button>
            <button
              v-if="item.status !== 'uploading'"
              class="btn-delete"
              @click="deleteItem(item.id)"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
        <div v-if="previewId === item.id" class="queue-preview">
          <video controls :src="`/api/youtube/${item.id}`" />
        </div>
      </div>
    </section>
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
.subtitle { color: var(--mss-text-3); font-size: 0.9rem; }
h2 { font-family: var(--font-heading); font-size: 1rem; font-weight: 600; margin-bottom: 1.15rem; }

.feedback {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.82rem; margin-bottom: 1.5rem;
}
.feedback.success { background: rgba(122, 184, 158, 0.08); color: var(--mss-tip); }
.feedback.error { background: rgba(194, 122, 122, 0.08); color: #c27a7a; }
.feedback .material-symbols-outlined { font-size: 1.1rem; }

.create-section {
  background: var(--mss-bg-soft);
  border-radius: 14px;
  padding: 1.75rem;
  margin-bottom: 2.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.form-group.full { grid-column: 1 / -1; }
.form-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--mss-text-3);
  margin-bottom: 0.4rem;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  background: var(--mss-bg);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: var(--mss-text-1);
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
}
.form-group textarea { resize: vertical; }

.video-source {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.15rem;
}
.source-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.15rem;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--mss-text-3);
  background: var(--mss-bg);
  cursor: pointer;
  transition: all 0.15s;
}
.source-option input { display: none; }
.source-option.active {
  color: var(--mss-accent);
  background: rgba(var(--mss-accent-raw), 0.06);
}
.source-option .material-symbols-outlined { font-size: 1.05rem; }

.generate-options {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.85rem;
  margin-bottom: 1.15rem;
}

.upload-area {
  margin-bottom: 1.15rem;
  padding: 1.25rem;
  background: var(--mss-bg);
  border-radius: 10px;
}
.upload-area input[type="file"] { font-size: 0.8rem; }
.file-info { font-size: 0.72rem; color: var(--mss-text-3); margin-top: 0.5rem; }

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--mss-accent);
  color: var(--mss-bg);
  border: none;
  border-radius: 12px;
  padding: 0.7rem 1.6rem;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-create:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-create:not(:disabled):hover { opacity: 0.9; }
.btn-create .material-symbols-outlined { font-size: 1.05rem; }

.queue-section {
  margin-top: 0.5rem;
}

.loading, .empty {
  font-size: 0.9rem;
  color: var(--mss-text-3);
  padding: 3rem;
  text-align: center;
  background: var(--mss-bg-soft);
  border-radius: 14px;
}

.queue-item {
  background: var(--mss-bg-soft);
  border-radius: 14px;
  margin-bottom: 0.65rem;
  overflow: hidden;
}
.queue-item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.15rem 1.5rem;
  gap: 1.25rem;
}

.queue-info { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; flex: 1; }
.queue-title { font-size: 0.95rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.queue-meta { display: flex; align-items: center; gap: 0.75rem; }
.queue-date { font-size: 0.7rem; color: var(--mss-text-3); }
.queue-url a { font-size: 0.72rem; color: var(--mss-accent); text-decoration: none; }
.queue-url a:hover { text-decoration: underline; }
.queue-error { font-size: 0.72rem; color: #c27a7a; }

.queue-status {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.status-draft { color: var(--mss-text-2); background: var(--mss-bg-mute); }
.status-uploading { color: #d4a853; background: rgba(212, 168, 83, 0.08); }
.status-published { color: var(--mss-tip); background: rgba(122, 184, 158, 0.08); }
.status-failed { color: #c27a7a; background: rgba(194, 122, 122, 0.08); }

.queue-actions {
  display: flex;
  gap: 0.35rem;
  flex-shrink: 0;
}

.btn-preview, .btn-publish, .btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.12s;
}
.btn-preview {
  background: var(--mss-bg-mute);
  color: var(--mss-text-2);
}
.btn-preview:hover { color: var(--mss-accent); background: rgba(var(--mss-accent-raw), 0.06); }
.btn-publish {
  background: var(--mss-accent);
  color: var(--mss-bg);
}
.btn-publish:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-publish:not(:disabled):hover { opacity: 0.9; }
.btn-delete {
  background: transparent;
  color: var(--mss-text-3);
  padding: 0.4rem;
}
.btn-delete:hover { color: #c27a7a; }

.btn-preview .material-symbols-outlined,
.btn-publish .material-symbols-outlined,
.btn-delete .material-symbols-outlined {
  font-size: 0.95rem;
}

.queue-preview {
  padding: 0 1.25rem 1.25rem;
}
.queue-preview video {
  width: 100%;
  max-height: 400px;
  border-radius: 10px;
  background: #000;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
  .generate-options { grid-template-columns: 1fr; }
  .video-source { flex-direction: column; }
  .queue-item-main { flex-direction: column; align-items: flex-start; }
  .queue-actions { width: 100%; justify-content: flex-end; }
}
</style>
