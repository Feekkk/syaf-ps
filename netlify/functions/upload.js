import { getStore } from '@netlify/blobs'
import { requireSession } from './_lib/auth.js'

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
const MAX_BYTES = 8 * 1024 * 1024

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const { error } = requireSession(req)
  if (error) return error

  const contentType = req.headers.get('content-type') || ''
  if (!ALLOWED_TYPES.has(contentType)) {
    return new Response(JSON.stringify({ error: 'Unsupported image type' }), { status: 400 })
  }

  const buffer = await req.arrayBuffer()
  if (buffer.byteLength === 0 || buffer.byteLength > MAX_BYTES) {
    return new Response(JSON.stringify({ error: 'Image is empty or too large' }), { status: 400 })
  }

  const extension = contentType.split('/')[1]
  const key = `photo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}.${extension}`

  const store = getStore('item-photos')
  await store.set(key, buffer, { metadata: { contentType } })

  return new Response(JSON.stringify({ photo: `/api/image/${key}` }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  })
}

export const config = { path: '/api/upload' }
