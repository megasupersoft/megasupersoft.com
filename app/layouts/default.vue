<script setup lang="ts">
const { value: colorModeValue } = useColorMode()
</script>

<template>
  <div class="mss-app">
    <SiteNav />
    <main>
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style>
.mss-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.mss-app main {
  flex: 1;
}
</style>
