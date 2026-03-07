const mode = ref<'dark' | 'light'>('dark')
let initialized = false

export function useColorMode() {
  if (import.meta.client && !initialized) {
    initialized = true
    const stored = localStorage.getItem('mss-color-mode')
    if (stored === 'light' || stored === 'dark') {
      mode.value = stored
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      mode.value = 'light'
    }

    watch(mode, (v) => {
      document.documentElement.classList.toggle('light', v === 'light')
      localStorage.setItem('mss-color-mode', v)
    }, { immediate: true })
  }

  return {
    value: computed(() => mode.value),
    preference: computed({
      get: () => mode.value,
      set: (v: 'dark' | 'light') => { mode.value = v },
    }),
  }
}
