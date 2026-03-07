export default defineNuxtPlugin(() => {
  if (typeof IntersectionObserver === 'undefined') return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  )

  // Observe existing and future .reveal elements
  function observeAll() {
    document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => {
      observer.observe(el)
    })
    // Also observe footer columns
    document.querySelectorAll('.footer-cols:not(.revealed)').forEach((el) => {
      observer.observe(el)
    })
  }

  // Run on initial load and on route changes
  const router = useRouter()
  router.afterEach(() => {
    nextTick(() => setTimeout(observeAll, 100))
  })
  nextTick(observeAll)
})
