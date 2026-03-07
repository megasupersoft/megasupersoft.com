/**
 * Scheduled task: collects metrics from all platforms and stores in D1.
 * Runs every 6 hours via Cloudflare Cron Triggers.
 *
 * Sources: GitHub (stars, forks, issues), Cloudflare Analytics (page views, visitors),
 *          Bluesky (followers, posts), X (followers), YouTube (subscribers, views)
 */
export default defineTask({
  meta: {
    name: 'collect-metrics',
    description: 'Collect telemetry from GitHub, Cloudflare, and social platforms',
  },
  async run() {
    const config = useRuntimeConfig()
    const db = useDB()
    const results: string[] = []

    // Run all collectors in parallel
    const [github, cloudflare, bluesky, youtube] = await Promise.allSettled([
      collectGitHub(config, db),
      collectCloudflare(config, db),
      collectBluesky(config, db),
      collectYouTube(config, db),
    ])

    for (const [name, result] of [['github', github], ['cloudflare', cloudflare], ['bluesky', bluesky], ['youtube', youtube]] as const) {
      if (result.status === 'fulfilled') {
        results.push(`${name}: ok`)
      } else {
        results.push(`${name}: ${result.reason?.message || 'failed'}`)
        console.error(`[collect-metrics] ${name} failed:`, result.reason)
      }
    }

    return { result: results.join(', ') }
  },
})

// ── GitHub ────────────────────────────────────────────────────────────────────
const REPOS = [
  'DangerDrome/FFFFinance_app',
  'megasupersoft/OpenComp',
  'megasupersoft/NodeUI',
  'megasupersoft/FileUI',
  'megasupersoft/VampireRunners',
  'megasupersoft/RenegadeCop',
  'megasupersoft/NeverEverland',
]

async function collectGitHub(config: any, db: any) {
  if (!config.githubToken) return

  const headers = {
    'Authorization': `Bearer ${config.githubToken}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'megasupersoft-telemetry',
  }

  let totalStars = 0, totalForks = 0, totalIssues = 0, totalDownloads = 0

  for (const repo of REPOS) {
    try {
      const data = await $fetch<any>(`https://api.github.com/repos/${repo}`, { headers })
      totalStars += data.stargazers_count || 0
      totalForks += data.forks_count || 0
      totalIssues += data.open_issues_count || 0
    } catch { /* skip missing repos */ }

    try {
      const releases = await $fetch<any[]>(`https://api.github.com/repos/${repo}/releases`, { headers })
      for (const rel of releases) {
        for (const asset of rel.assets || []) {
          totalDownloads += asset.download_count || 0
        }
      }
    } catch { /* no releases */ }
  }

  // Also get org-level follower count
  let orgFollowers = 0
  try {
    const org = await $fetch<any>(`https://api.github.com/orgs/${config.githubOrg}`, { headers })
    orgFollowers = org.followers || 0
  } catch { /* skip */ }

  const now = new Date().toISOString()
  const stmt = db.prepare('INSERT INTO social_metrics (platform, metric, value, recorded_at) VALUES (?, ?, ?, ?)')
  await db.batch([
    stmt.bind('github', 'stars', totalStars, now),
    stmt.bind('github', 'forks', totalForks, now),
    stmt.bind('github', 'issues', totalIssues, now),
    stmt.bind('github', 'downloads', totalDownloads, now),
    stmt.bind('github', 'followers', orgFollowers, now),
  ])
}

// ── Cloudflare Analytics ──────────────────────────────────────────────────────
async function collectCloudflare(config: any, db: any) {
  // Use the Cloudflare API token from env (needs Analytics:Read permission)
  const cfToken = config.cfApiToken
  const zoneId = config.cfZoneId || '756c6e06a2eed70d147f00e4f7ed756d'
  if (!cfToken) return

  const now = new Date()
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00Z'
  const until = now.toISOString().split('T')[0] + 'T00:00:00Z'

  const query = `{
    viewer {
      zones(filter: { zoneTag: "${zoneId}" }) {
        httpRequests1dGroups(limit: 1, filter: { date_geq: "${since.split('T')[0]}", date_leq: "${until.split('T')[0]}" }) {
          sum { requests pageViews }
          uniq { uniques }
        }
      }
    }
  }`

  try {
    const data = await $fetch<any>('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfToken}`,
        'Content-Type': 'application/json',
      },
      body: { query },
    })

    const zone = data?.data?.viewer?.zones?.[0]
    const group = zone?.httpRequests1dGroups?.[0]
    if (!group) return

    const ts = new Date().toISOString()
    const stmt = db.prepare('INSERT INTO social_metrics (platform, metric, value, recorded_at) VALUES (?, ?, ?, ?)')
    await db.batch([
      stmt.bind('cloudflare', 'requests_24h', group.sum?.requests || 0, ts),
      stmt.bind('cloudflare', 'pageviews_24h', group.sum?.pageViews || 0, ts),
      stmt.bind('cloudflare', 'visitors_24h', group.uniq?.uniques || 0, ts),
    ])
  } catch (err: any) {
    console.error('[collect-metrics] Cloudflare analytics error:', err.message)
  }
}

// ── Bluesky ───────────────────────────────────────────────────────────────────
async function collectBluesky(config: any, db: any) {
  const handle = config.blueskyHandle
  if (!handle) return

  // Public API — no auth needed for profile
  const data = await $fetch<any>(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`,
  )

  const now = new Date().toISOString()
  const stmt = db.prepare('INSERT INTO social_metrics (platform, metric, value, recorded_at) VALUES (?, ?, ?, ?)')
  await db.batch([
    stmt.bind('bluesky', 'followers', data.followersCount || 0, now),
    stmt.bind('bluesky', 'following', data.followsCount || 0, now),
    stmt.bind('bluesky', 'posts', data.postsCount || 0, now),
  ])
}

// ── YouTube ───────────────────────────────────────────────────────────────────
async function collectYouTube(config: any, db: any) {
  if (!config.youtubeChannelId) return

  // Try using API key first, fall back to OAuth
  let apiKey = process.env.YOUTUBE_API_KEY || ''
  let headers: Record<string, string> = {}

  if (!apiKey && config.youtubeClientId && config.youtubeRefreshToken) {
    // Exchange refresh token for access token
    try {
      const tokenRes = await $fetch<any>('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: {
          client_id: config.youtubeClientId,
          client_secret: config.youtubeClientSecret,
          refresh_token: config.youtubeRefreshToken,
          grant_type: 'refresh_token',
        },
      })
      headers['Authorization'] = `Bearer ${tokenRes.access_token}`
    } catch {
      return // can't authenticate
    }
  } else if (apiKey) {
    // API key is appended as query param below
  } else {
    return
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'statistics')
  url.searchParams.set('id', config.youtubeChannelId)
  if (apiKey) url.searchParams.set('key', apiKey)

  const data = await $fetch<any>(url.toString(), { headers })
  const stats = data?.items?.[0]?.statistics
  if (!stats) return

  const now = new Date().toISOString()
  const stmt = db.prepare('INSERT INTO social_metrics (platform, metric, value, recorded_at) VALUES (?, ?, ?, ?)')
  await db.batch([
    stmt.bind('youtube', 'subscribers', parseInt(stats.subscriberCount) || 0, now),
    stmt.bind('youtube', 'views', parseInt(stats.viewCount) || 0, now),
    stmt.bind('youtube', 'videos', parseInt(stats.videoCount) || 0, now),
  ])
}
