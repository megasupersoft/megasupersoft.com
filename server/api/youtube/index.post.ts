/** Create a new YouTube queue item and store the uploaded video in blob storage */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, statusMessage: 'Multipart form data required' })

  const fields: Record<string, string> = {}
  let videoFile: { data: Buffer; filename?: string; type?: string } | null = null

  for (const part of form) {
    if (part.name === 'video' && part.data?.length) {
      videoFile = { data: part.data, filename: part.filename, type: part.type }
    } else if (part.name && part.data) {
      fields[part.name] = part.data.toString('utf-8')
    }
  }

  if (!fields.title?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }
  if (!videoFile) {
    throw createError({ statusCode: 400, statusMessage: 'Video file is required' })
  }

  // Store video in blob storage
  const blobKey = `youtube/${Date.now()}-${videoFile.filename || 'video.mp4'}`
  await hubBlob().put(blobKey, videoFile.data, {
    contentType: videoFile.type || 'video/mp4',
  })

  // Insert queue entry
  const db = useDB(event)
  const tags = fields.tags ? JSON.stringify(fields.tags.split(',').map((t: string) => t.trim()).filter(Boolean)) : '[]'
  const { meta } = await db.prepare(
    'INSERT INTO youtube_queue (title, description, tags, privacy, blob_key, status) VALUES (?, ?, ?, ?, ?, ?)',
  )
    .bind(fields.title, fields.description || '', tags, fields.privacy || 'public', blobKey, 'draft')
    .run()

  return { id: meta.last_row_id, blobKey }
})
