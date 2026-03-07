#!/usr/bin/env node
/**
 * Creates CNAME record for megasupersoft.com -> megasupersoft-com.pages.dev
 * Uses Cloudflare OAuth with zone:write scope
 */

import http from 'node:http'
import crypto from 'node:crypto'
import { execSync } from 'node:child_process'

const CLIENT_ID = '54d11594-84e4-41aa-b438-e81b8fa78ee7'
const REDIRECT_URI = 'http://localhost:8976/oauth/callback'
const SCOPES = 'account:read zone:read zone:write pages:write offline_access'
const ZONE_ID = '756c6e06a2eed70d147f00e4f7ed756d'

const state = crypto.randomBytes(16).toString('hex')
const verifier = crypto.randomBytes(32).toString('base64url')
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')

const authUrl = `https://dash.cloudflare.com/oauth2/auth?${new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
  state,
  code_challenge: challenge,
  code_challenge_method: 'S256',
})}`

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:8976')
  if (url.pathname !== '/oauth/callback') { res.end(); return }

  const code = url.searchParams.get('code')
  if (!code) {
    res.writeHead(400)
    res.end('No code')
    server.close()
    return
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://dash.cloudflare.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      }),
    })
    const data = await tokenRes.json()
    if (!data.access_token) {
      throw new Error(`Token exchange failed: ${JSON.stringify(data)}`)
    }

    const token = data.access_token
    console.log('✓ Got OAuth token with DNS write scope')

    // List existing records
    const listRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=megasupersoft.com`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const listData = await listRes.json()
    console.log(`  Found ${listData.result?.length || 0} existing record(s)`)

    // Delete existing records that conflict
    if (listData.result?.length) {
      for (const r of listData.result) {
        console.log(`  Deleting ${r.type} ${r.name} -> ${r.content}`)
        await fetch(
          `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${r.id}`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
        )
      }
    }

    // Create CNAME
    const createRes = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CNAME',
          name: '@',
          content: 'megasupersoft-com.pages.dev',
          proxied: true,
          ttl: 1,
        }),
      },
    )
    const createData = await createRes.json()

    if (createData.success) {
      console.log('✓ CNAME record created: megasupersoft.com -> megasupersoft-com.pages.dev')
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end('<h1>Done!</h1><p>CNAME record created. Close this tab.</p>')
    } else {
      console.error('✗ Failed:', JSON.stringify(createData.errors))
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.end(`<h1>Failed</h1><pre>${JSON.stringify(createData.errors, null, 2)}</pre>`)
    }
  } catch (err) {
    console.error('✗ Error:', err.message)
    res.writeHead(500)
    res.end(err.message)
  }

  setTimeout(() => process.exit(0), 1000)
})

server.listen(8976, () => {
  console.log('→ Approve the Cloudflare authorization in your browser...')
  try {
    execSync(`xdg-open "${authUrl}"`, { stdio: 'ignore' })
  } catch {
    console.log(`  Open: ${authUrl}`)
  }
})

setTimeout(() => {
  console.log('✗ Timed out after 2 minutes')
  process.exit(1)
}, 120000)
