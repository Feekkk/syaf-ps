import { sql } from './_lib/db.js'
import { requireSession } from './_lib/auth.js'

function toItem(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    size: row.size,
    actualPrice: row.actual_price == null ? null : Number(row.actual_price),
    sellPrice: row.sell_price == null ? null : Number(row.sell_price),
    photo: row.photo,
  }
}

export default async (req, context) => {
  const { error } = requireSession(req)
  if (error) return error

  const id = context.params.id

  if (req.method === 'PUT') {
    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
    }

    const { title, category, size, actualPrice, sellPrice, photo } = body
    const rows = await sql`
      update items set
        title = coalesce(${title ?? null}, title),
        category = coalesce(${category ?? null}, category),
        size = coalesce(${size ?? null}, size),
        actual_price = coalesce(${actualPrice ?? null}, actual_price),
        sell_price = coalesce(${sellPrice ?? null}, sell_price),
        photo = coalesce(${photo ?? null}, photo),
        updated_at = now()
      where id = ${id}
      returning *
    `
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }
    return new Response(JSON.stringify(toItem(rows[0])), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (req.method === 'DELETE') {
    const rows = await sql`delete from items where id = ${id} returning id`
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }
    return new Response(null, { status: 204 })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
}

export const config = { path: '/api/items/:id' }
