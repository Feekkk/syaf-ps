import bcrypt from 'bcryptjs'
import { sql } from './_lib/db.js'
import { signSession, sessionCookie } from './_lib/auth.js'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 })
  }

  const rows = await sql`select id, email, password_hash from admin_users where email = ${email} limit 1`
  const user = rows[0]
  const valid = user ? await bcrypt.compare(password, user.password_hash) : false
  if (!user || !valid) {
    return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 })
  }

  const token = signSession({ sub: user.id, email: user.email })
  return new Response(JSON.stringify({ email: user.email }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': sessionCookie(token),
    },
  })
}

export const config = { path: '/api/auth/login' }
