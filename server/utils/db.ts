import type { H3Event } from 'h3'

/**
 * Get the raw D1 database binding.
 * Works on Cloudflare Pages (via platform.env) and locally (via globalThis).
 */
export function useDB(event?: H3Event) {
  // Cloudflare Pages: binding is on the platform context
  if (event) {
    const env = (event.context as any).cloudflare?.env
    if (env?.DB) return env.DB
  }
  // Fallback: globalThis (used by NuxtHub dev proxy and Nitro)
  const binding = (globalThis as any).__env__?.DB || (globalThis as any).DB || process.env.DB
  if (!binding) throw new Error('DB binding not found')
  return binding
}
