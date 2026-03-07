export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const db = useDB(event)

  const [totalPosts, publishedPosts, recentPosts] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM posts').first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'published'").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM posts WHERE created_at > datetime('now', '-7 days')").first<{ count: number }>(),
  ])

  return {
    totalPosts: totalPosts?.count || 0,
    publishedPosts: publishedPosts?.count || 0,
    recentPosts: recentPosts?.count || 0,
  }
})
