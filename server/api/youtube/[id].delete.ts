/** Delete a YouTube queue item and its blob */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const db = useDB(event)

  const item = await db.prepare('SELECT blob_key FROM youtube_queue WHERE id = ?').bind(id).first()
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Not found' })

  // Delete blob if exists
  if (item.blob_key) {
    try { await hubBlob().del(item.blob_key as string) } catch { /* ok */ }
  }

  await db.prepare('DELETE FROM youtube_queue WHERE id = ?').bind(id).run()
  return { ok: true }
})
