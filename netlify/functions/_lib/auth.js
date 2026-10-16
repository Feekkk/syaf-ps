import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'spsession'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

function secret() {
  const value = process.env.JWT_SECRET
  if (!value) throw new Error('JWT_SECRET is not set')
  return value
}

export function signSession(payload) {
  return jwt.sign(payload, secret(), { expiresIn: MAX_AGE_SECONDS })
}

function parseCookies(header) {
  const jar = {}
  if (!header) return jar
  for (const part of header.split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    jar[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim())
  }
  return jar
}

export function getSession(req) {
  const cookies = parseCookies(req.headers.get('cookie'))
  const token = cookies[COOKIE_NAME]
  if (!token) return null
  try {
    return jwt.verify(token, secret())
  } catch {
    return null
  }
}

export function requireSession(req) {
  const session = getSession(req)
  if (!session) {
    return { error: new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    }) }
  }
  return { session }
}

export function sessionCookie(token) {
  const isProd = process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production'
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_SECONDS}`,
    isProd ? 'Secure' : '',
  ].filter(Boolean).join('; ')
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}
