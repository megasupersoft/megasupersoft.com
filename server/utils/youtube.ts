/**
 * YouTube Data API v3 — resumable video upload.
 */
export async function uploadToYouTube(
  videoBlob: ArrayBuffer,
  metadata: { title: string; description: string; tags: string[]; privacy: string },
  config: any,
): Promise<{ videoId: string; url: string }> {
  const accessToken = await getYouTubeAccessToken(config)

  const body = JSON.stringify({
    snippet: {
      title: metadata.title,
      description: metadata.description,
      tags: metadata.tags,
      categoryId: '28', // Science & Technology
    },
    status: {
      privacyStatus: metadata.privacy || 'public',
      selfDeclaredMadeForKids: false,
    },
  })

  // Step 1: Initiate resumable upload
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(videoBlob.byteLength),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body,
    },
  )

  if (!initRes.ok) {
    const text = await initRes.text()
    throw new Error(`YouTube init failed (${initRes.status}): ${text}`)
  }

  const uploadUrl = initRes.headers.get('Location')
  if (!uploadUrl) throw new Error('No upload URL returned')

  // Step 2: Upload the video bytes
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(videoBlob.byteLength),
    },
    body: videoBlob,
  })

  if (!uploadRes.ok) {
    const text = await uploadRes.text()
    throw new Error(`YouTube upload failed (${uploadRes.status}): ${text}`)
  }

  const result = (await uploadRes.json()) as { id: string }
  return {
    videoId: result.id,
    url: `https://www.youtube.com/watch?v=${result.id}`,
  }
}

async function getYouTubeAccessToken(config: any): Promise<string> {
  if (!config.youtubeClientId || !config.youtubeRefreshToken) {
    throw new Error('YouTube OAuth credentials not configured')
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.youtubeClientId,
      client_secret: config.youtubeClientSecret,
      refresh_token: config.youtubeRefreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`YouTube token exchange failed (${res.status}): ${text}`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}
