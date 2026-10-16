import { clearCookie } from './_lib/auth.js'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }
  return new Response(null, {
    status: 204,
    headers: { 'set-cookie': clearCookie() },
  })
}

export const config = { path: '/api/auth/logout' }
