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
        <svg v-if="platform.icon === 'apple'" viewBox="0 0 24 24" fill="currentColor" class="dl-platform-icon"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        <svg v-else-if="platform.icon === 'windows'" viewBox="0 0 24 24" fill="currentColor" class="dl-platform-icon"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
        <svg v-else-if="platform.icon === 'linux'" viewBox="-100 -100 900 1000" fill="currentColor" stroke="var(--vp-c-bg)" stroke-width="40" stroke-linejoin="round" stroke-linecap="round" class="dl-platform-icon"><path d="m 407.78259,-63.885865 c -5.50873,-0.01007 -11.25467,0.221097 -17.24663,0.698832 -151.44034,12.19639 -111.27731,172.185293 -113.52498,225.760433 -2.76559,39.17912 -10.7093,70.05493 -37.65515,108.35728 -31.65734,37.64621 -76.22729,98.57709 -97.34124,162.00402 -9.96481,29.93478 -14.70669,60.44635 -10.32746,89.32352 -1.3718,1.22846 -2.67777,2.51556 -3.91957,3.84127 -9.29459,9.92281 -16.16224,21.94573 -23.81454,30.04053 -7.149273,7.13157 -17.335189,9.84418 -28.528667,13.86011 -11.197757,4.01773 -23.49204,9.94102 -30.954745,24.26137 0,0 0,0.005 -0.005,0.007 -0.01218,0.0238 -0.02547,0.0461 -0.03816,0.0703 l 0,0 c -6.755617,12.61799 -4.747277,27.1486 -2.684066,40.61093 2.063272,13.46217 4.152016,26.18346 1.379482,34.81434 -8.862262,24.22286 -9.993724,40.9783 -3.754978,53.13208 6.252047,12.17909 19.106775,17.55476 33.635407,20.58924 29.057347,6.06892 68.408607,4.56076 100.529727,21.46622 32.12112,16.90546 65.7807,23.07106 92.63513,16.93731 19.4699,-4.44703 35.27484,-16.04026 43.39171,-33.87948 21.00445,-0.10329 44.05315,-8.9992 80.97431,-11.03212 25.04734,-2.01755 56.33588,8.8946 92.32544,6.89621 0.94075,3.90462 2.30228,7.66025 4.166,11.22902 0.0191,0.0367 0.037,0.073 0.0565,0.10928 13.95143,27.89813 39.87419,40.65877 67.49992,38.47853 27.66216,-2.18303 57.07262,-18.49393 80.30621,-46.39828 23.2336,-27.90436 60.84554,-39.2976 85.78528,-54.33966 12.46992,-7.52124 22.58833,-16.93894 23.37012,-30.61751 0.78137,-13.6717 -7.24514,-28.99303 -25.70186,-49.48067 l -0.005,-0.005 c -0.007,-0.009 -0.0144,-0.017 -0.0216,-0.0255 -6.06426,-6.85303 -8.95726,-19.55446 -12.06623,-33.08031 -3.10684,-13.51762 -6.57481,-28.09935 -17.67261,-37.54916 l 0,0 c -0.0222,-0.0196 -0.0446,-0.0371 -0.0668,-0.0565 l 0,0 c -4.41677,-3.84869 -9.00656,-6.46081 -13.62872,-8.21572 15.42945,-45.75986 9.37563,-91.32556 -6.19944,-132.50113 -19.115,-50.53385 -52.48693,-94.56634 -77.97362,-124.68843 -28.5282,-35.98392 -56.43129,-70.14776 -55.88163,-120.60662 0.84975,-77.011218 8.47096,-219.826209 -127.04556,-220.011161 z"/></svg>
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
            <svg class="dl-download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  opacity: 0.6;
}

.dl-platform-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--vp-c-text-1);
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
  border: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s, transform 0.1s;
}
.dl-item:hover {
  background: var(--vp-c-bg-elv);
  transform: translateX(4px);
}
.dl-item:hover .dl-download-icon {
  color: var(--mss-accent, var(--vp-c-brand-1));
}

.dl-item-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dl-download-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.4;
  transition: color 0.2s, opacity 0.2s;
}
.dl-item:hover .dl-download-icon {
  opacity: 1;
}

.dl-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.dl-ext {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-bg-alt);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.dl-note {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* Tablets — bigger touch targets */
@media (max-width: 960px) {
  .dl-item {
    padding: 0.875rem 1rem;
  }
  .dl-label {
    font-size: 0.95rem;
  }
}

/* Large phones */
@media (max-width: 640px) {
  .dl-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    padding: 1rem;
  }
  .dl-label {
    font-size: 1rem;
  }
  .dl-note {
    font-size: 0.8rem;
  }
}

/* Small phones */
@media (max-width: 400px) {
  .dl-item {
    padding: 0.875rem 0.75rem;
  }
}
</style>
