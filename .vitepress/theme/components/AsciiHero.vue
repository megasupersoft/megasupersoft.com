<script setup lang="ts">
const asciiPre = `  █████████                                         █████████              ██████  █████
 ███░░░░░███ `
const asciiPost = `                                  ███░░░░░███            ███░░███░░███
░███    ░░░ █████ ████████████   ██████  ████████ ░███    ░░░   ██████   ░███ ░░░ ███████
░░█████████░░███ ░███░░███░░███ ███░░███░░███░░███░░█████████  ███░░███ ███████  ░░░███░
 ░░░░░░░░███░███ ░███ ░███ ░███░███████  ░███ ░░░  ░░░░░░░░███░███ ░███░░░███░     ░███
 ███    ░███░███ ░███ ░███ ░███░███░░░   ░███      ███    ░███░███ ░███  ░███      ░███ ███
░░█████████ ░░████████░███████ ░░██████  █████    ░░█████████ ░░██████   █████     ░░█████
 ░░░░░░░░░   ░░░░░░░░ ░███░░░   ░░░░░░  ░░░░░      ░░░░░░░░░   ░░░░░░   ░░░░░       ░░░░░
                      ░███
                      █████
                     ░░░░░`
</script>

<template>
  <div class="ascii-hero">
    <pre class="ascii-art"><code>{{ asciiPre }}<span class="mega-text">MEGA</span>{{ asciiPost }}</code></pre>
    <p class="ascii-tagline">Code, pixels, and play.</p>
  </div>
</template>

<style scoped>
.ascii-hero {
  max-width: 1152px;
  margin: 0 auto 0 calc(50% - 600px);
  padding: 6rem 24px 6rem;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ascii-art {
  background: none !important;
  border: none !important;
  margin: 0;
  padding: 0;
  line-height: 1.15;
  font-family: var(--vp-font-family-mono);
  font-size: clamp(0.25rem, 0.9vw, 0.7rem);
  white-space: pre;
  color: var(--vp-c-text-1);
  opacity: 0.85;
}

.ascii-art code {
  background: none !important;
  border: none !important;
  padding: 0 !important;
  font-size: inherit;
  color: inherit;
}

.ascii-tagline {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-base);
  letter-spacing: 0.02em;
}

.mega-text {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 2.5em;
  line-height: 0;
  vertical-align: baseline;
  letter-spacing: -0.02em;
  color: var(--mss-accent);
  margin-right: -1.95em;
}

/* iPad Pro landscape, small laptops */
@media (max-width: 1199px) {
  .ascii-hero {
    margin: 0 auto;
    padding: 5rem 2rem 5rem;
    align-items: center;
  }
}

/* Tablets portrait — iPad, iPad Air, iPad Pro 11" */
@media (max-width: 959px) {
  .ascii-hero {
    padding: 3.5rem 1.5rem 2.5rem;
  }
  .ascii-art {
    font-size: clamp(0.28rem, 1.1vw, 0.55rem);
  }
  .ascii-tagline {
    font-size: 0.95rem;
  }
}

/* Large phones, iPad Mini portrait */
@media (max-width: 768px) {
  .ascii-hero {
    padding: 3rem 1rem 2rem;
  }
  .ascii-art {
    font-size: clamp(0.22rem, 1.3vw, 0.45rem);
  }
  .ascii-tagline {
    font-size: 0.9rem;
  }
}

/* Phones */
@media (max-width: 480px) {
  .ascii-hero {
    padding: 2.5rem 0.75rem 1.5rem;
    overflow-x: hidden;
  }
  .ascii-art {
    font-size: 1.35vw;
    overflow: hidden;
  }
  .ascii-tagline {
    font-size: 0.85rem;
  }
}

/* Very small phones */
@media (max-width: 359px) {
  .ascii-art {
    font-size: 1.1vw;
  }
}
</style>
