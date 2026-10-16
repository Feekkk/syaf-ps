import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  const key = context.params.key
  const store = getStore('item-photos')
  const entry = await store.getWithMetadata(key, { type: 'arrayBuffer' })

  if (!entry) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(entry.data, {
    status: 200,
    headers: {
      'content-type': entry.metadata?.contentType || 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}

export const config = { path: '/api/image/:key' }
