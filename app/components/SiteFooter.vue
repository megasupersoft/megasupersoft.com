<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-cols">
        <div class="footer-col brand-col">
          <span class="footer-brand"><span style="color: var(--mss-accent)">Mega</span>SuperSoft</span>
          <p class="footer-tagline">Code, pixels, and play.</p>
          <p class="footer-copy">&copy; {{ year }} MegaSuperSoft. All rights reserved.</p>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Software</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/products#ffffinance">FFFFinance</NuxtLink></li>
            <li><NuxtLink to="/products#opencomp">OpenComp</NuxtLink></li>
            <li><NuxtLink to="/products#nodeui">NodeUI</NuxtLink></li>
            <li><NuxtLink to="/products#fileui">FileUI</NuxtLink></li>
            <li><NuxtLink to="/downloads">Downloads</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Games</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/products#vampire-runners">Vampire Runners</NuxtLink></li>
            <li><NuxtLink to="/products#renegade-cop">Renegade Cop</NuxtLink></li>
            <li><NuxtLink to="/products#nevereverland">NeverEverland</NuxtLink></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/about">About</NuxtLink></li>
            <li><a href="https://github.com/megasupersoft" target="_blank" rel="noopener">GitHub</a></li>
            <li><a href="https://x.com/megasupersoft" target="_blank" rel="noopener">X</a></li>
            <li><a href="https://www.youtube.com/@megasupersoftware" target="_blank" rel="noopener">YouTube</a></li>
            <li><a href="https://bsky.app/profile/megasupersoft.bsky.social" target="_blank" rel="noopener">Bluesky</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Legal</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms of Service</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="footer-made">Made with <span class="material-symbols-outlined footer-heart">favorite</span> in New Zealand</span>
        <span class="footer-bottom-copy">&copy; {{ year }} MegaSuperSoft</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: none;
  background: var(--mss-bg-soft);
  margin-top: 4rem;
  position: relative;
  z-index: 1;
}

.footer-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 3rem 2rem 0;
}

.footer-cols {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 2.5rem 2rem;
  padding-bottom: 2.5rem;
}

.brand-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-brand {
  font-size: 1rem;
  font-weight: 800;
  color: var(--mss-accent);
  letter-spacing: -0.02em;
  font-family: var(--font-mono);
}

.footer-tagline {
  font-size: 0.82rem;
  color: var(--mss-text-2);
  line-height: 1.5;
  margin: 0;
  max-width: 220px;
  white-space: nowrap;
}

.footer-copy {
  font-size: 0.72rem;
  color: var(--mss-text-3);
  margin: 0.25rem 0 0;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-heading {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mss-text-3);
  margin: 0;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.footer-links a {
  font-size: 0.82rem;
  color: var(--mss-text-2);
  text-decoration: none;
  transition: color 0.15s ease;
}
.footer-links a:hover {
  color: var(--mss-accent);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 0 1.5rem;
  gap: 1rem;
}

.footer-made {
  font-size: 0.75rem;
  color: var(--mss-text-3);
  font-style: italic;
  white-space: nowrap;
}

.footer-heart {
  font-size: 1em;
  vertical-align: -0.15em;
  color: var(--mss-accent);
  font-variation-settings: 'FILL' 1;
}

.footer-bottom-copy {
  font-size: 0.72rem;
  color: var(--mss-text-3);
  font-family: var(--font-mono);
}

@media (max-width: 960px) {
  .footer-cols { grid-template-columns: repeat(4, 1fr); }
  .brand-col { grid-column: 1 / -1; }
  .footer-tagline { max-width: 100%; }
}

@media (max-width: 640px) {
  .footer-inner { padding: 2rem 1.25rem 0; }
  .footer-cols { grid-template-columns: 1fr 1fr; gap: 1.75rem 1.5rem; }
  .brand-col { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.4rem; }
}

@media (max-width: 400px) {
  .footer-cols { grid-template-columns: 1fr; }
}
</style>
