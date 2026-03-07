<script setup lang="ts">
useHead({ title: 'MegaSuperSoft — Code, pixels, and play.' })

const features = [
  {
    title: 'Local-First Software',
    details: 'Your data stays on your machine. No accounts, no uploads, no cloud required. Privacy isn\'t a feature — it\'s the architecture.',
  },
  {
    title: 'Creative Tools',
    details: 'Image compositing, multimedia canvases, and file management — built for artists, VFX professionals, and content creators.',
  },
  {
    title: 'Games',
    details: 'Roguelike arcade, adventure RPGs, and isometric exploration. Made for fun, not for metrics.',
  },
  {
    title: 'Open Source',
    details: 'Built in the open. Inspect the code, file issues, contribute. No black boxes. Made with care in New Zealand.',
  },
]
</script>

<template>
  <div class="home">
    <AsciiHero />

    <div class="hero-actions">
      <NuxtLink to="/products#software" class="btn btn-brand">
        <span class="btn-icon material-symbols-outlined">keyboard</span>
        Software
      </NuxtLink>
      <NuxtLink to="/products#games" class="btn btn-games">
        <span class="btn-icon material-symbols-outlined">stadia_controller</span>
        Games
      </NuxtLink>
      <a href="https://github.com/megasupersoft" class="btn btn-code">
        <SocialIcon name="github" />
        Code
      </a>
    </div>

    <section class="features reveal-stagger">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="feature-card reveal"
      >
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-details">{{ feature.details }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 1.5rem 4rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.btn-brand {
  background: var(--mss-accent);
  color: var(--mss-bg);
}
.btn-brand:hover {
  box-shadow: 0 0 16px rgba(var(--mss-accent-raw), 0.15);
  transform: translateY(-1px);
  color: var(--mss-bg);
}

.btn-games {
  background: var(--mss-tip);
  color: #504e4a;
}
.btn-games:hover {
  box-shadow: 0 0 16px rgba(122, 184, 158, 0.2);
  transform: translateY(-1px);
  color: #504e4a;
}

.btn-code {
  background: var(--mss-code-btn);
  color: var(--mss-bg);
}
.btn-code:hover {
  box-shadow: 0 0 16px rgba(90, 122, 150, 0.2);
  transform: translateY(-1px);
  color: var(--mss-bg);
}

.btn-icon {
  font-size: 1.1em;
}

.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1152px;
  padding: 0 2rem 6rem;
  width: 100%;
}

.feature-card {
  background: var(--mss-bg-soft);
  border-radius: 8px;
  padding: 1.5rem;
}
.feature-card:hover {
  box-shadow: 0 0 16px rgba(var(--mss-accent-raw), 0.1);
  transform: translateY(-1px);
}

.feature-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
}

.feature-details {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--mss-text-2);
}

@media (max-width: 959px) {
  .features { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .features { grid-template-columns: 1fr; }
}
</style>
