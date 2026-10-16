import { getSession } from './_lib/auth.js'

export default async (req) => {
  const session = getSession(req)
  if (!session) {
    return new Response(JSON.stringify({ email: null }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ email: session.email }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

export const config = { path: '/api/auth/me' }
