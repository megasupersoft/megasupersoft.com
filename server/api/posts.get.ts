export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const db = useDB(event)
  const { results } = await db.prepare(
    `SELECT * FROM posts ORDER BY created_at DESC LIMIT 50`,
  ).all()

  return results.map((row: any) => ({
    ...row,
    platforms: JSON.parse(row.platforms || '[]'),
  }))
})
