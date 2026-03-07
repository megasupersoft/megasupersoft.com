#!/usr/bin/env node
// Update social media profile images and banners from local brand assets.
//
// Usage:
//   node scripts/update-socials.mjs                  # all platforms
//   node scripts/update-socials.mjs --x              # just X/Twitter
//   node scripts/update-socials.mjs --bluesky        # just Bluesky
//   node scripts/update-socials.mjs --youtube        # just YouTube
//   node scripts/update-socials.mjs --github         # just GitHub (org metadata only, avatar is manual)
//   node scripts/update-socials.mjs --avatar         # just avatars
//   node scripts/update-socials.mjs --banner         # just banners
//   node scripts/update-socials.mjs --theme light    # use light variants (default: dark)
//   node scripts/update-socials.mjs --youtube-auth   # one-time YouTube OAuth2 setup
//
// Requires a .env file with API credentials (see .env.example).

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import http from 'http';
import { execSync } from 'child_process';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const flagVal = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : undefined;
};

const theme = flagVal('theme') || 'dark';

const anyPlatform = flag('x') || flag('bluesky') || flag('youtube') || flag('github');
const platforms = {
  x: anyPlatform ? flag('x') : true,
  bluesky: anyPlatform ? flag('bluesky') : true,
  youtube: anyPlatform ? flag('youtube') : true,
  github: anyPlatform ? flag('github') : true,
};

const anyAsset = flag('avatar') || flag('banner');
const assets = {
  avatar: anyAsset ? flag('avatar') : true,
  banner: anyAsset ? flag('banner') : true,
};

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

function loadEnv() {
  try {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* no .env, rely on env vars */ }
}

function hasEnv(...keys) {
  return keys.every((k) => process.env[k]);
}

function env(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

// ---------------------------------------------------------------------------
// Asset paths
// ---------------------------------------------------------------------------

const BRAND = path.resolve('public/brand');

function asset(name) {
  const p = path.join(BRAND, `${name}-${theme}.png`);
  if (!fs.existsSync(p)) throw new Error(`Asset not found: ${p}`);
  return p;
}

// ---------------------------------------------------------------------------
// OAuth 1.0a (for X/Twitter)
// ---------------------------------------------------------------------------

function pctEncode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function oauthSign(method, url, params, consumerSecret, tokenSecret) {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${pctEncode(k)}=${pctEncode(params[k])}`)
    .join('&');
  const baseString = `${method.toUpperCase()}&${pctEncode(url)}&${pctEncode(sorted)}`;
  const signingKey = `${pctEncode(consumerSecret)}&${pctEncode(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

function oauthHeader(method, url, apiKey, apiSecret, token, tokenSecret, bodyParams = {}) {
  const oauth = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: '1.0',
  };
  oauth.oauth_signature = oauthSign(method, url, { ...oauth, ...bodyParams }, apiSecret, tokenSecret);
  return (
    'OAuth ' +
    Object.keys(oauth)
      .sort()
      .map((k) => `${pctEncode(k)}="${pctEncode(oauth[k])}"`)
      .join(', ')
  );
}

// ---------------------------------------------------------------------------
// X / Twitter
// ---------------------------------------------------------------------------

async function updateX({ avatar, banner }) {
  const apiKey = env('X_API_KEY');
  const apiSecret = env('X_API_SECRET');
  const accessToken = env('X_ACCESS_TOKEN');
  const accessSecret = env('X_ACCESS_SECRET');

  if (avatar) {
    process.stdout.write('  Updating avatar...');
    const img = fs.readFileSync(asset('logo-square'), 'base64');
    const url = 'https://api.twitter.com/1.1/account/update_profile_image.json';
    const body = { image: img };
    const auth = oauthHeader('POST', url, apiKey, apiSecret, accessToken, accessSecret, body);
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    });
    if (!res.ok) throw new Error(`X avatar: ${res.status} ${await res.text()}`);
    console.log(' done');
  }

  if (banner) {
    process.stdout.write('  Updating banner...');
    const img = fs.readFileSync(asset('banner-x'), 'base64');
    const url = 'https://api.twitter.com/1.1/account/update_profile_banner.json';
    const body = { banner: img };
    const auth = oauthHeader('POST', url, apiKey, apiSecret, accessToken, accessSecret, body);
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    });
    // 201 or 202 are success for this endpoint
    if (!res.ok && res.status !== 201 && res.status !== 202)
      throw new Error(`X banner: ${res.status} ${await res.text()}`);
    console.log(' done');
  }
}

// ---------------------------------------------------------------------------
// Bluesky
// ---------------------------------------------------------------------------

async function updateBluesky({ avatar, banner }) {
  const handle = env('BLUESKY_HANDLE');
  const password = env('BLUESKY_APP_PASSWORD');
  const service = 'https://bsky.social';

  // Authenticate
  const sessionRes = await fetch(`${service}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: handle, password }),
  });
  if (!sessionRes.ok) throw new Error(`Bluesky auth: ${sessionRes.status} ${await sessionRes.text()}`);
  const { did, accessJwt } = await sessionRes.json();
  const headers = { Authorization: `Bearer ${accessJwt}` };

  // Get current profile so we preserve displayName, description, etc.
  const profileRes = await fetch(
    `${service}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(did)}&collection=app.bsky.actor.profile&rkey=self`,
    { headers },
  );
  let profile = {};
  if (profileRes.ok) {
    profile = (await profileRes.json()).value;
  }

  async function uploadBlob(filePath) {
    const data = fs.readFileSync(filePath);
    const res = await fetch(`${service}/xrpc/com.atproto.repo.uploadBlob`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'image/png' },
      body: data,
    });
    if (!res.ok) throw new Error(`Bluesky blob upload: ${res.status} ${await res.text()}`);
    return (await res.json()).blob;
  }

  if (avatar) {
    process.stdout.write('  Uploading avatar...');
    profile.avatar = await uploadBlob(asset('logo-square'));
    console.log(' done');
  }

  if (banner) {
    process.stdout.write('  Uploading banner...');
    profile.banner = await uploadBlob(asset('banner-x')); // 1500x500 (3:1) works for Bluesky
    console.log(' done');
  }

  process.stdout.write('  Saving profile...');
  profile.$type = 'app.bsky.actor.profile';
  const putRes = await fetch(`${service}/xrpc/com.atproto.repo.putRecord`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo: did,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
      record: profile,
    }),
  });
  if (!putRes.ok) throw new Error(`Bluesky profile update: ${putRes.status} ${await putRes.text()}`);
  console.log(' done');
}

// ---------------------------------------------------------------------------
// YouTube
// ---------------------------------------------------------------------------

async function updateYouTube({ banner }) {
  if (!banner) {
    console.log('  YouTube only supports banner updates via API (avatar comes from Google Account)');
    return;
  }

  const clientId = env('YOUTUBE_CLIENT_ID');
  const clientSecret = env('YOUTUBE_CLIENT_SECRET');
  const refreshToken = env('YOUTUBE_REFRESH_TOKEN');
  const channelId = env('YOUTUBE_CHANNEL_ID');

  // Refresh access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!tokenRes.ok) throw new Error(`YouTube token refresh: ${tokenRes.status} ${await tokenRes.text()}`);
  const { access_token } = await tokenRes.json();
  const headers = { Authorization: `Bearer ${access_token}` };

  // Step 1: Upload banner image
  process.stdout.write('  Uploading banner...');
  const imageData = fs.readFileSync(asset('banner-youtube'));
  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/channelBanners/insert',
    {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'image/png' },
      body: imageData,
    },
  );
  if (!uploadRes.ok) throw new Error(`YouTube banner upload: ${uploadRes.status} ${await uploadRes.text()}`);
  const { url } = await uploadRes.json();
  console.log(' done');

  // Step 2: Get current channel data
  process.stdout.write('  Applying to channel...');
  const getRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}`,
    { headers },
  );
  if (!getRes.ok) throw new Error(`YouTube channel get: ${getRes.status} ${await getRes.text()}`);
  const { items } = await getRes.json();
  if (!items?.length) throw new Error('YouTube channel not found');
  const channel = items[0];

  // Step 3: Update banner
  channel.brandingSettings.image = { bannerExternalUrl: url };
  const updateRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=brandingSettings',
    {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(channel),
    },
  );
  if (!updateRes.ok) throw new Error(`YouTube channel update: ${updateRes.status} ${await updateRes.text()}`);
  console.log(' done');
}

// ---------------------------------------------------------------------------
// YouTube OAuth2 setup (one-time)
// ---------------------------------------------------------------------------

async function youtubeAuth() {
  const clientId = env('YOUTUBE_CLIENT_ID');
  const clientSecret = env('YOUTUBE_CLIENT_SECRET');
  const redirectUri = 'http://localhost:9876/callback';

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  console.log('Opening browser for YouTube authorization...');
  console.log(`If it doesn't open, visit:\n${authUrl}\n`);
  try {
    execSync(`open "${authUrl}"`);
  } catch { /* browser didn't open, user can use the printed URL */ }

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url, 'http://localhost:9876');
      const error = reqUrl.searchParams.get('error');
      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Authorization failed: ${error}</h1>`);
        server.close();
        reject(new Error(error));
        return;
      }
      const c = reqUrl.searchParams.get('code');
      if (c) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Authorized! You can close this tab.</h1>');
        server.close();
        resolve(c);
      }
    });
    server.listen(9876);
  });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new Error(`Token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`);
  const tokens = await tokenRes.json();

  if (tokens.refresh_token) {
    console.log('\nAdd this to your .env file:');
    console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } else {
    console.error('\nNo refresh token received. Revoke access at https://myaccount.google.com/permissions and retry.');
  }
}

// ---------------------------------------------------------------------------
// GitHub (org metadata only — avatar must be uploaded manually)
// ---------------------------------------------------------------------------

async function updateGitHub() {
  const token = env('GITHUB_TOKEN');
  const org = env('GITHUB_ORG');

  process.stdout.write('  Updating org metadata...');
  const res = await fetch(`https://api.github.com/orgs/${encodeURIComponent(org)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'MegaSuperSoft',
      description: 'Software made with care in New Zealand',
      blog: 'https://megasupersoft.com',
      location: 'New Zealand',
      email: 'hello@megasupersoft.com',
      twitter_username: 'megasupersoft',
    }),
  });
  if (!res.ok) throw new Error(`GitHub org update: ${res.status} ${await res.text()}`);
  console.log(' done');
  console.log('  Note: avatar must be updated manually at https://github.com/organizations/' + org + '/settings/profile');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

loadEnv();

if (flag('youtube-auth')) {
  await youtubeAuth();
  process.exit(0);
}

console.log(`Updating socials (theme: ${theme})\n`);

let ok = 0;
let skipped = 0;
let failed = 0;

if (platforms.x) {
  if (hasEnv('X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_SECRET')) {
    console.log('X/Twitter:');
    try {
      await updateX({ avatar: assets.avatar, banner: assets.banner });
      ok++;
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
      failed++;
    }
  } else {
    console.log('X/Twitter: skipped (missing credentials)');
    skipped++;
  }
}

if (platforms.bluesky) {
  if (hasEnv('BLUESKY_HANDLE', 'BLUESKY_APP_PASSWORD')) {
    console.log('Bluesky:');
    try {
      await updateBluesky({ avatar: assets.avatar, banner: assets.banner });
      ok++;
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
      failed++;
    }
  } else {
    console.log('Bluesky: skipped (missing credentials)');
    skipped++;
  }
}

if (platforms.youtube) {
  if (hasEnv('YOUTUBE_CLIENT_ID', 'YOUTUBE_CLIENT_SECRET', 'YOUTUBE_REFRESH_TOKEN', 'YOUTUBE_CHANNEL_ID')) {
    console.log('YouTube:');
    try {
      await updateYouTube({ avatar: assets.avatar, banner: assets.banner });
      ok++;
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
      failed++;
    }
  } else {
    console.log('YouTube: skipped (missing credentials)');
    skipped++;
  }
}

if (platforms.github) {
  if (hasEnv('GITHUB_TOKEN', 'GITHUB_ORG')) {
    console.log('GitHub:');
    try {
      await updateGitHub();
      ok++;
    } catch (e) {
      console.error(`  FAILED: ${e.message}`);
      failed++;
    }
  } else {
    console.log('GitHub: skipped (missing credentials)');
    skipped++;
  }
}

console.log(`\nDone: ${ok} updated, ${skipped} skipped, ${failed} failed`);
if (failed > 0) process.exit(1);
