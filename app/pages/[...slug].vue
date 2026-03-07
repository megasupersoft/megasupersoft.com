<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: page.value.title ? `${page.value.title} | MegaSuperSoft` : 'MegaSuperSoft',
  meta: [
    { property: 'og:title', content: page.value.title ? `${page.value.title} | MegaSuperSoft` : 'MegaSuperSoft' },
    ...(page.value.description ? [{ name: 'description', content: page.value.description }, { property: 'og:description', content: page.value.description }] : []),
  ],
})
</script>

<template>
  <div class="content-page">
    <div class="prose">
      <ContentRenderer v-if="page" :value="page" />
    </div>
  </div>
</template>

<style scoped>
.content-page {
  max-width: 1152px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
}
</style>
