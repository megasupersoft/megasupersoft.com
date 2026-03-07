/** Stream the queued video for preview */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const db = useDB(event)

  const item = await db.prepare('SELECT blob_key FROM youtube_queue WHERE id = ?').bind(id).first<any>()
  if (!item?.blob_key) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  const blob = await hubBlob().get(item.blob_key)
  if (!blob) throw createError({ statusCode: 404, statusMessage: 'Video not found in storage' })

  setResponseHeader(event, 'Content-Type', 'video/mp4')
  setResponseHeader(event, 'Cache-Control', 'private, max-age=3600')
  return blob
})
