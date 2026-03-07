import { oauthHeader } from './oauth1'

export async function postToX(content: string, config: any): Promise<{ id: string; url: string }> {
  const url = 'https://api.twitter.com/2/tweets'
  const body = JSON.stringify({ text: content })

  // X API v2 uses OAuth 1.0a for user-context requests
  const auth = oauthHeader(
    'POST',
    url,
    config.xApiKey,
    config.xApiSecret,
    config.xAccessToken,
    config.xAccessSecret,
  )

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: auth,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`X API error ${res.status}: ${text}`)
  }

  const data = await res.json() as { data: { id: string } }
  return {
    id: data.data.id,
    url: `https://x.com/megasupersoft/status/${data.data.id}`,
  }
}

export async function postToBluesky(content: string, config: any): Promise<{ uri: string; url: string }> {
  const service = 'https://bsky.social'

  // Authenticate
  const sessionRes = await fetch(`${service}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: config.blueskyHandle,
      password: config.blueskyAppPassword,
    }),
  })
  if (!sessionRes.ok) {
    throw new Error(`Bluesky auth failed: ${sessionRes.status}`)
  }
  const { did, accessJwt } = await sessionRes.json() as { did: string; accessJwt: string }

  // Parse facets (links, mentions) from content
  const facets = detectFacets(content)

  // Create post
  const record: any = {
    $type: 'app.bsky.feed.post',
    text: content,
    createdAt: new Date().toISOString(),
  }
  if (facets.length) record.facets = facets

  const postRes = await fetch(`${service}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  })

  if (!postRes.ok) {
    const text = await postRes.text()
    throw new Error(`Bluesky post failed: ${postRes.status}: ${text}`)
  }

  const result = await postRes.json() as { uri: string; cid: string }
  // Convert AT URI to web URL
  const rkey = result.uri.split('/').pop()
  return {
    uri: result.uri,
    url: `https://bsky.app/profile/${config.blueskyHandle}/post/${rkey}`,
  }
}

// Detect URLs in text and create Bluesky facets
function detectFacets(text: string) {
  const facets: any[] = []
  const urlRegex = /https?:\/\/[^\s)]+/g
  let match
  while ((match = urlRegex.exec(text)) !== null) {
    const start = new TextEncoder().encode(text.slice(0, match.index)).byteLength
    const end = start + new TextEncoder().encode(match[0]).byteLength
    facets.push({
      index: { byteStart: start, byteEnd: end },
      features: [{ $type: 'app.bsky.richtext.facet#link', uri: match[0] }],
    })
  }
  return facets
}
