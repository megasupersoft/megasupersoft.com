<script setup lang="ts">
const { value: colorModeValue } = useColorMode()
const { user } = useUserSession()
const route = useRoute()

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: 'dashboard', exact: true },
  { label: 'Compose', to: '/dashboard/compose', icon: 'edit_note' },
  { label: 'Posts', to: '/dashboard/posts', icon: 'feed' },
  { label: 'YouTube', to: '/dashboard/youtube', icon: 'smart_display' },
  { label: 'Analytics', to: '/dashboard/analytics', icon: 'monitoring' },
  { label: 'Brand', to: '/dashboard/brand', icon: 'palette' },
  { label: 'Releases', to: '/dashboard/releases', icon: 'new_releases' },
]
</script>

<template>
  <div class="mss-app">
    <SiteNav />
    <main>
      <div class="dashboard-container">
        <nav class="dashboard-tabs">
          <div class="tabs-inner">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :class="['tab-item', { active: item.exact ? route.path === item.to : route.path.startsWith(item.to) }]"
            >
              <span class="material-symbols-outlined">{{ item.icon }}</span>
              {{ item.label }}
            </NuxtLink>
          </div>
          <div class="tabs-user" v-if="user">
            <img :src="user.avatarUrl" :alt="user.login" class="user-avatar" />
            <span class="user-name">{{ user.login }}</span>
            <a href="/api/auth/logout" class="logout-btn" aria-label="Logout">
              <span class="material-symbols-outlined">logout</span>
            </a>
          </div>
        </nav>
        <div class="dashboard-content">
          <slot />
        </div>
      </div>
    </main>
    <footer class="dashboard-footer">
      <span class="footer-made">Made with <span class="material-symbols-outlined footer-heart">favorite</span> in New Zealand</span>
      <span class="footer-copy">&copy; {{ new Date().getFullYear() }} MegaSuperSoft</span>
    </footer>
  </div>
</template>

<style scoped>
.mss-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.mss-app main {
  flex: 1;
}

.dashboard-container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 2rem;
}

.dashboard-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.tabs-inner {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tabs-inner::-webkit-scrollbar { display: none; }

.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1rem;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--mss-text-3);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.12s;
}
.tab-item:hover {
  color: var(--mss-text-1);
}
.tab-item.active {
  color: var(--mss-accent);
  background: rgba(var(--mss-accent-raw), 0.06);
  border-radius: 10px;
}
.tab-item .material-symbols-outlined {
  font-size: 1.25rem;
  opacity: 0.6;
}
.tab-item.active .material-symbols-outlined {
  opacity: 1;
}

.tabs-user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  padding: 0.75rem 0;
}
.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.user-name {
  font-size: 0.85rem;
  color: var(--mss-text-2);
  font-weight: 500;
}
.logout-btn {
  color: var(--mss-text-3);
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border-radius: 6px;
  transition: color 0.12s;
}
.logout-btn:hover {
  color: var(--mss-accent);
}
.logout-btn .material-symbols-outlined {
  font-size: 1.1rem;
}

.dashboard-content {
  padding-bottom: 3rem;
}

.dashboard-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1152px;
  margin: 0 auto;
  padding: 2rem;
  font-size: 0.78rem;
  color: var(--mss-text-3);
}
.footer-made {
  font-style: italic;
}
.footer-heart {
  font-size: 1em;
  vertical-align: -0.15em;
  color: var(--mss-accent);
  font-variation-settings: 'FILL' 1;
}
.footer-copy {
  font-family: var(--font-mono);
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 1.25rem;
  }
  .tabs-user {
    display: none;
  }
  .tab-item {
    padding: 0.75rem 0.7rem;
    font-size: 0.8rem;
  }
  .tab-item .material-symbols-outlined {
    font-size: 1.1rem;
  }
}
</style>
