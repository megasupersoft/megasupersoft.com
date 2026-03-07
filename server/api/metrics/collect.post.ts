/**
 * Manual trigger for metric collection (dashboard button).
 * Auth required — only logged-in users can trigger.
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { result } = await runTask('collect-metrics')
  return { ok: true, result }
})
