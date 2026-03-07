import { postToX, postToBluesky } from '../utils/socials'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { content, platforms } = body

  if (!content?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }
  if (!platforms?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Select at least one platform' })
  }

  const config = useRuntimeConfig()
  const db = useDB(event)

  // Insert post into D1
  const { meta } = await db.prepare(
    `INSERT INTO posts (content, platforms, status, author) VALUES (?, ?, 'publishing', ?)`,
  )
    .bind(content, JSON.stringify(platforms), session.user.login)
    .run()

  const postId = meta.last_row_id

  const results: Record<string, { success: boolean; url?: string; error?: string }> = {}

  // Post to each platform
  for (const platform of platforms) {
    try {
      if (platform === 'x') {
        if (!config.xApiKey || !config.xAccessToken) {
          results.x = { success: false, error: 'X credentials not configured' }
          continue
        }
        const result = await postToX(content, config)
        results.x = { success: true, url: result.url }
      } else if (platform === 'bluesky') {
        if (!config.blueskyAppPassword) {
          results.bluesky = { success: false, error: 'Bluesky credentials not configured' }
          continue
        }
        const result = await postToBluesky(content, config)
        results.bluesky = { success: true, url: result.url }
      }
    } catch (err: any) {
      results[platform] = { success: false, error: err.message }
    }
  }

  // Update post status
  const allSuccess = Object.values(results).every((r) => r.success)
  const anySuccess = Object.values(results).some((r) => r.success)
  const status = allSuccess ? 'published' : anySuccess ? 'partial' : 'failed'

  await db.prepare(
    `UPDATE posts SET status = ?, published_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
  )
    .bind(status, postId)
    .run()

  const summaryParts = Object.entries(results).map(
    ([p, r]) => `${p}: ${r.success ? 'posted' : 'failed'}`,
  )

  return {
    success: anySuccess,
    status,
    message: summaryParts.join(', '),
    results,
    postId,
  }
})
