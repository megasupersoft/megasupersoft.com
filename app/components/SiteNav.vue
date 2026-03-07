<script setup lang="ts">
const { value: colorModeValue, preference: colorModePreference } = useColorMode()

function toggleTheme() {
  colorModePreference.value = colorModeValue.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
  { text: 'Products', to: '/products' },
  { text: 'Downloads', to: '/downloads' },
  { text: 'About', to: '/about' },
]

const socialLinks = [
  { icon: 'github', href: 'https://github.com/megasupersoft' },
  { icon: 'x', href: 'https://x.com/megasupersoft' },
  { icon: 'youtube', href: 'https://www.youtube.com/@megasupersoftware' },
  { icon: 'bluesky', href: 'https://bsky.app/profile/megasupersoft.bsky.social' },
]

const mobileOpen = ref(false)
</script>

<template>
  <header class="site-nav">
    <div class="nav-inner">
      <NuxtLink to="/" class="nav-brand">
        <span class="nav-brand-accent">Mega</span>SuperSoft
      </NuxtLink>

      <nav class="nav-links" :class="{ open: mobileOpen }">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          @click="mobileOpen = false"
        >
          {{ link.text }}
        </NuxtLink>
      </nav>

      <div class="nav-actions">
        <a
          v-for="social in socialLinks"
          :key="social.icon"
          :href="social.href"
          target="_blank"
          rel="noopener"
          class="social-link"
          :aria-label="social.icon"
        >
          <SocialIcon :name="social.icon" />
        </a>

        <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
          <span class="material-symbols-outlined">
            {{ colorModeValue === 'dark' ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span class="material-symbols-outlined">
            {{ mobileOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px) saturate(1.2);
  -webkit-backdrop-filter: blur(16px) saturate(1.2);
  background: var(--mss-nav-bg);
  animation: hero-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.nav-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-brand {
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--mss-text-1);
  text-decoration: none;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}
.nav-brand-accent {
  color: var(--mss-accent);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--mss-text-2);
  text-decoration: none;
  transition: color 0.15s;
}
.nav-link:hover,
.nav-link.router-link-active {
  color: var(--mss-accent);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.social-link {
  color: var(--mss-text-3);
  transition: color 0.15s;
  display: flex;
  align-items: center;
}
.social-link:hover {
  color: var(--mss-text-1);
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--mss-text-3);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.theme-toggle:hover {
  color: var(--mss-text-1);
}
.theme-toggle .material-symbols-outlined {
  font-size: 1.2rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--mss-text-2);
  cursor: pointer;
  padding: 0.25rem;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: var(--mss-bg-soft);
    flex-direction: column;
    padding: 1rem 1.5rem;
    gap: 0.5rem;
  }
  .nav-links.open {
    display: flex;
  }
  .nav-link {
    padding: 0.5rem 0;
    font-size: 1rem;
  }
  .social-link {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }
}
</style>
