#!/usr/bin/env node
/**
 * Automated setup for MegaSuperSoft dashboard.
 *
 * Creates a GitHub App (for OAuth login) via the manifest flow,
 * generates a session password, and writes everything to .env.
 *
 * Usage: node scripts/setup.mjs
 */

import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const ENV_PATH = new URL('../.env', import.meta.url).pathname
const PORT = 3456

// ── Helpers ──────────────────────────────────────────────────────────────────

function readEnv() {
  if (!existsSync(ENV_PATH)) return {}
  const lines = readFileSync(ENV_PATH, 'utf-8').split('\n')
  const env = {}
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (match) env[match[1]] = match[2]
  }
  return env
}

function writeEnv(env) {
  // Preserve original file structure, update/add keys
  let content = ''
  if (existsSync(ENV_PATH)) {
    const lines = readFileSync(ENV_PATH, 'utf-8').split('\n')
    const written = new Set()
    for (const line of lines) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)=/)
      if (match && match[1] in env) {
        content += `${match[1]}=${env[match[1]]}\n`
        written.add(match[1])
      } else {
        content += line + '\n'
      }
    }
    // Append new keys
    for (const [k, v] of Object.entries(env)) {
      if (!written.has(k)) {
        content += `${k}=${v}\n`
      }
    }
  } else {
    for (const [k, v] of Object.entries(env)) {
      content += `${k}=${v}\n`
    }
  }
  // Remove trailing blank lines
  content = content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
  writeFileSync(ENV_PATH, content)
}

function openBrowser(url) {
  try {
    execSync(`which xdg-open && xdg-open "${url}" || open "${url}"`, { stdio: 'ignore' })
  } catch {
    console.log(`\n  Open this URL manually:\n  ${url}\n`)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const env = readEnv()

// Allow --force to recreate the OAuth app
const forceRecreate = process.argv.includes('--force')

if (env.NUXT_OAUTH_GITHUB_CLIENT_ID && env.NUXT_OAUTH_GITHUB_CLIENT_SECRET && !forceRecreate) {
  console.log('✓ GitHub OAuth already configured')
  console.log(`  Client ID: ${env.NUXT_OAUTH_GITHUB_CLIENT_ID.slice(0, 8)}...`)
  if (!env.NUXT_SESSION_PASSWORD) {
    env.NUXT_SESSION_PASSWORD = randomBytes(16).toString('hex')
    writeEnv(env)
    console.log('✓ Generated session password')
  }
  console.log('\n✓ Setup complete. Run: npm run dev')
  console.log('  Tip: use --force to recreate the GitHub App')
  process.exit(0)
}

console.log('╔══════════════════════════════════════════════════╗')
console.log('║  MegaSuperSoft Dashboard Setup                  ║')
console.log('╚══════════════════════════════════════════════════╝')
console.log()

// Generate session password if needed
if (!env.NUXT_SESSION_PASSWORD) {
  env.NUXT_SESSION_PASSWORD = randomBytes(16).toString('hex')
  console.log('✓ Generated session password')
}

// Start temp server for GitHub App Manifest flow
console.log('→ Creating GitHub App for OAuth...')
console.log('  A browser window will open. Click "Create GitHub App" to approve.\n')

const manifest = JSON.stringify({
  name: 'MegaSuperSoft Dashboard',
  url: 'https://megasupersoft.com',
  callback_urls: [
    'http://localhost:3000/api/auth/github',
    'http://localhost:3001/api/auth/github',
    'https://megasupersoft-com.pages.dev/api/auth/github',
    'https://megasupersoft.com/api/auth/github',
  ],
  redirect_url: `http://localhost:${PORT}/callback`,
  public: false,
  default_permissions: {},
  request_oauth_on_install: false,
})

const html = `<!DOCTYPE html>
<html>
<head><title>MegaSuperSoft Setup</title>
<style>
  body { font-family: system-ui; background: #12110f; color: #bfbab2; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { text-align: center; max-width: 400px; }
  h1 { color: #c27a7a; font-size: 1.3rem; }
  p { font-size: 0.9rem; line-height: 1.6; }
  form { margin-top: 1.5rem; }
  button { background: #c27a7a; color: #12110f; border: none; padding: 0.75rem 2rem; border-radius: 6px; font-size: 1rem; font-weight: 700; cursor: pointer; }
  button:hover { opacity: 0.9; }
</style>
</head>
<body>
<div class="card">
  <h1>MegaSuperSoft Dashboard Setup</h1>
  <p>This will create a GitHub App for dashboard authentication.<br>Click the button below, then approve on GitHub.</p>
  <form action="https://github.com/settings/apps/new" method="post">
    <input type="hidden" name="manifest" value='${manifest.replace(/'/g, '&#39;')}'>
    <button type="submit">Create GitHub App</button>
  </form>
</div>
</body>
</html>`

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
    return
  }

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code')
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('Missing code parameter')
      return
    }

    try {
      // Exchange code for app credentials
      const response = await fetch(`https://api.github.com/app-manifests/${code}/conversions`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'megasupersoft-setup',
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${await response.text()}`)
      }

      const app = await response.json()

      env.NUXT_OAUTH_GITHUB_CLIENT_ID = app.client_id
      env.NUXT_OAUTH_GITHUB_CLIENT_SECRET = app.client_secret
      writeEnv(env)

      console.log(`✓ GitHub App created: "${app.name}" (ID: ${app.id})`)
      console.log(`  Client ID: ${app.client_id}`)
      console.log(`  Credentials written to .env`)

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(`<!DOCTYPE html><html>
        <head><style>body{font-family:system-ui;background:#12110f;color:#bfbab2;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
        .card{text-align:center} h1{color:#c27a7a;font-size:1.3rem} p{font-size:0.9rem}</style></head>
        <body><div class="card"><h1>Setup Complete</h1><p>GitHub App created. You can close this tab.<br>Run <code>npm run dev</code> and visit <code>/dashboard</code>.</p></div></body></html>`)

      console.log('\n✓ Setup complete. Run: npm run dev')
      setTimeout(() => process.exit(0), 1000)
    } catch (err) {
      console.error('✗ Failed to create GitHub App:', err.message)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end(`Error: ${err.message}`)
      setTimeout(() => process.exit(1), 1000)
    }
    return
  }

  res.writeHead(404)
  res.end()
})

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`  Setup server running at ${url}`)
  openBrowser(url)
})

// Timeout after 5 minutes
setTimeout(() => {
  console.log('\n✗ Setup timed out. Run again: node scripts/setup.mjs')
  process.exit(1)
}, 5 * 60 * 1000)
