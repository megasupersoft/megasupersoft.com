/**
 * Returns latest metrics for all platforms + historical data for charts.
 * Public endpoint (no auth) — metrics aren't sensitive.
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)

  // Get latest value for each platform+metric combo
  const latest = await db.prepare(`
    SELECT platform, metric, value, recorded_at
    FROM social_metrics
    WHERE id IN (
      SELECT MAX(id) FROM social_metrics GROUP BY platform, metric
    )
    ORDER BY platform, metric
  `).all()

  // Get daily aggregates for last 30 days (for charts)
  const history = await db.prepare(`
    SELECT platform, metric,
      CAST(AVG(value) AS INTEGER) as value,
      DATE(recorded_at) as date
    FROM social_metrics
    WHERE recorded_at > datetime('now', '-30 days')
    GROUP BY platform, metric, DATE(recorded_at)
    ORDER BY date ASC
  `).all()

  // Organize latest into a lookup
  const current: Record<string, Record<string, number>> = {}
  for (const row of (latest.results || []) as any[]) {
    if (!current[row.platform]) current[row.platform] = {}
    current[row.platform][row.metric] = row.value
  }

  // Organize history by platform.metric
  const charts: Record<string, Array<{ date: string; value: number }>> = {}
  for (const row of (history.results || []) as any[]) {
    const key = `${row.platform}.${row.metric}`
    if (!charts[key]) charts[key] = []
    charts[key].push({ date: row.date, value: row.value })
  }

  return { current, charts }
})
