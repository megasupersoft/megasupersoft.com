import { uploadToYouTube } from '../../utils/youtube'

/** Publish a queued YouTube video */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const db = useDB(event)
  const config = useRuntimeConfig()

  const item = await db.prepare('SELECT * FROM youtube_queue WHERE id = ?').bind(id).first<any>()
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  if (item.status === 'published') throw createError({ statusCode: 400, statusMessage: 'Already published' })
  if (!item.blob_key) throw createError({ statusCode: 400, statusMessage: 'No video file' })

  // Mark as uploading
  await db.prepare("UPDATE youtube_queue SET status = 'uploading' WHERE id = ?").bind(id).run()

  try {
    // Get video from blob storage
    const blob = await hubBlob().get(item.blob_key)
    if (!blob) throw new Error('Video blob not found in storage')
    const videoBuffer = await blob.arrayBuffer()

    const tags = JSON.parse(item.tags || '[]')
    const result = await uploadToYouTube(videoBuffer, {
      title: item.title,
      description: item.description,
      tags,
      privacy: item.privacy,
    }, config)

    // Update with success
    await db.prepare(
      "UPDATE youtube_queue SET status = 'published', video_id = ?, video_url = ?, published_at = datetime('now') WHERE id = ?",
    ).bind(result.videoId, result.url, id).run()

    return { ok: true, videoId: result.videoId, url: result.url }
  } catch (err: any) {
    await db.prepare(
      "UPDATE youtube_queue SET status = 'failed', error = ? WHERE id = ?",
    ).bind(err.message, id).run()

    throw createError({ statusCode: 500, statusMessage: err.message })
  }
})
