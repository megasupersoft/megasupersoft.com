<script setup lang="ts">
const CDN = 'https://cdn.ffffinance.org/releases'

const platforms = [
  {
    name: 'macOS',
    icon: 'apple',
    downloads: [
      { label: 'Apple Silicon', ext: '.dmg', file: 'FFFFinance-arm64.dmg', note: 'M1 / M2 / M3 / M4' },
      { label: 'Intel', ext: '.dmg', file: 'FFFFinance-x64.dmg', note: '2012-2020 Macs' },
    ],
  },
  {
    name: 'Windows',
    icon: 'windows',
    downloads: [
      { label: 'Installer', ext: '.exe', file: 'FFFFinance-Setup.exe', note: 'NSIS installer, auto-update' },
    ],
  },
  {
    name: 'Linux',
    icon: 'linux',
    downloads: [
      { label: 'AppImage', ext: '.AppImage', file: 'FFFFinance.AppImage', note: 'Universal, any distro' },
      { label: 'Debian / Ubuntu', ext: '.deb', file: 'FFFFinance.deb', note: 'apt install' },
      { label: 'Fedora / RHEL', ext: '.rpm', file: 'FFFFinance.rpm', note: 'dnf install' },
    ],
  },
]
</script>

<template>
  <div class="dl-table">
    <div v-for="platform in platforms" :key="platform.name" class="dl-platform-group">
      <div class="dl-platform-header">
        <span class="material-symbols-outlined dl-platform-icon">
          {{ platform.icon === 'apple' ? 'laptop_mac' : platform.icon === 'windows' ? 'laptop_windows' : 'terminal' }}
        </span>
        <h3 class="dl-platform-name">{{ platform.name }}</h3>
      </div>
      <div class="dl-items">
        <a
          v-for="dl in platform.downloads"
          :key="dl.file"
          :href="`${CDN}/${dl.file}`"
          class="dl-item"
        >
          <div class="dl-item-main">
            <span class="material-symbols-outlined dl-download-icon">download</span>
            <span class="dl-label">{{ dl.label }}</span>
            <span class="dl-ext">{{ dl.ext }}</span>
          </div>
          <span class="dl-note">{{ dl.note }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dl-table {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin: 2rem 0;
}

.dl-platform-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
}

.dl-platform-icon {
  font-size: 1.4rem;
  opacity: 0.6;
}

.dl-platform-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--mss-text-1);
  border: none;
  padding: 0;
}

.dl-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dl-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--mss-bg-soft);
  color: var(--mss-text-1);
  text-decoration: none;
  transition: background 0.2s, transform 0.1s;
}
.dl-item:hover {
  background: var(--mss-bg-mute);
  transform: translateX(4px);
  color: var(--mss-text-1);
}
.dl-item:hover .dl-download-icon {
  color: var(--mss-accent);
  opacity: 1;
}

.dl-item-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dl-download-icon {
  font-size: 1.1rem;
  opacity: 0.4;
  transition: color 0.2s, opacity 0.2s;
}

.dl-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.dl-ext {
  font-size: 0.75rem;
  color: var(--mss-text-3);
  font-family: var(--font-mono);
  background: var(--mss-bg-mute);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.dl-note {
  font-size: 0.75rem;
  color: var(--mss-text-3);
}

@media (max-width: 640px) {
  .dl-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    padding: 1rem;
  }
  .dl-label { font-size: 1rem; }
  .dl-note { font-size: 0.8rem; }
}
</style>
