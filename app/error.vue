<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage: string } }>()

useHead({ title: `${props.error.statusCode} | MegaSuperSoft` })
</script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage || 'Page not found' }}</p>
    <NuxtLink to="/" class="back-link">Back to home</NuxtLink>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--mss-bg);
  color: var(--mss-text-1);
}
h1 {
  font-family: var(--font-heading);
  font-size: 4rem;
  font-weight: 900;
  color: var(--mss-accent);
}
p {
  color: var(--mss-text-3);
  font-size: 1.1rem;
}
.back-link {
  color: var(--mss-accent);
  font-weight: 600;
}
</style>
