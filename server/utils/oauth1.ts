import { createHmac, randomBytes } from 'node:crypto'

function pctEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
}

export function oauthHeader(
  method: string,
  url: string,
  apiKey: string,
  apiSecret: string,
  token: string,
  tokenSecret: string,
  bodyParams: Record<string, string> = {},
): string {
  const oauth: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: '1.0',
  }

  const allParams = { ...oauth, ...bodyParams }
  const sorted = Object.keys(allParams)
    .sort()
    .map((k) => `${pctEncode(k)}=${pctEncode(allParams[k])}`)
    .join('&')
  const baseString = `${method.toUpperCase()}&${pctEncode(url)}&${pctEncode(sorted)}`
  const signingKey = `${pctEncode(apiSecret)}&${pctEncode(tokenSecret)}`
  oauth.oauth_signature = createHmac('sha1', signingKey).update(baseString).digest('base64')

  return (
    'OAuth ' +
    Object.keys(oauth)
      .sort()
      .map((k) => `${pctEncode(k)}="${pctEncode(oauth[k])}"`)
      .join(', ')
  )
}
