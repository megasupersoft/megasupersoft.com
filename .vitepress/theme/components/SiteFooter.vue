<script setup lang="ts">
import { useData } from 'vitepress'

const year = new Date().getFullYear()
const { frontmatter } = useData()
</script>

<template>
  <footer :class="['site-footer', { 'has-sidebar': frontmatter.layout !== 'home' }]">
    <div class="footer-inner">

      <div class="footer-cols">

        <!-- Brand -->
        <div class="footer-col brand-col">
          <span class="footer-brand"><span style="color: var(--mss-accent)">Mega</span>SuperSoft</span>
          <p class="footer-tagline">Software made with care in New Zealand.</p>
          <p class="footer-copy">&copy; {{ year }} MegaSuperSoft. All rights reserved.</p>
        </div>

        <!-- Software -->
        <div class="footer-col">
          <h4 class="footer-heading">Software</h4>
          <ul class="footer-links">
            <li><a href="/products#ffffinance">FFFFinance</a></li>
            <li><a href="/products#opencomp">OpenComp</a></li>
            <li><a href="/products#nodeui">NodeUI</a></li>
            <li><a href="/products#fileui">FileUI</a></li>
            <li><a href="/downloads">Downloads</a></li>
          </ul>
        </div>

        <!-- Games -->
        <div class="footer-col">
          <h4 class="footer-heading">Games</h4>
          <ul class="footer-links">
            <li><a href="/products#vampire-runners">Vampire Runners</a></li>
            <li><a href="/products#renegade-cop">Renegade Cop</a></li>
            <li><a href="/products#nevereverland">NeverEverland</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="footer-col">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><a href="/about">About</a></li>
            <li><a href="https://github.com/megasupersoft" target="_blank" rel="noopener">GitHub</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-col">
          <h4 class="footer-heading">Legal</h4>
          <ul class="footer-links">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <span class="footer-made">Made with care in New Zealand</span>
        <span class="footer-bottom-copy">&copy; {{ year }} MegaSuperSoft</span>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: none;
  background: var(--vp-c-bg-soft);
  margin-top: 4rem;
  position: relative;
  z-index: 1;
}

@media (min-width: 960px) {
  .site-footer.has-sidebar {
    padding-left: 272px;
  }
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
  font-family: var(--vp-font-family-mono);
}

.footer-tagline {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
  max-width: 220px;
}

.footer-copy {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
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
  color: var(--vp-c-text-3);
  margin: 0;
  padding: 0;
  border: none;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.footer-links li {
  margin: 0;
  padding: 0;
}

.footer-links a {
  font-size: 0.82rem;
  color: var(--vp-c-text-2);
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
  color: var(--vp-c-text-3);
  font-style: italic;
}

.footer-bottom-copy {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

/* Tablets — brand spans full, 4 link cols across */
@media (max-width: 960px) {
  .footer-cols {
    grid-template-columns: repeat(4, 1fr);
  }
  .brand-col {
    grid-column: 1 / -1;
  }
  .footer-tagline {
    max-width: 100%;
  }
}

/* Small tablets, large phones — 2x2 link grid */
@media (max-width: 640px) {
  .footer-inner {
    padding: 2rem 1.25rem 0;
  }
  .footer-cols {
    grid-template-columns: 1fr 1fr;
    gap: 1.75rem 1.5rem;
  }
  .brand-col {
    grid-column: 1 / -1;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
}

/* Small phones — single column */
@media (max-width: 400px) {
  .footer-cols {
    grid-template-columns: 1fr;
  }
}
</style>
