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

export default async (req) => {
  if (req.method === 'GET') {
    const rows = await sql`select * from items order by created_at desc`
    return new Response(JSON.stringify(rows.map(toItem)), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  if (req.method === 'POST') {
    const { error } = requireSession(req)
    if (error) return error

    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
    }

    const { title, category, size, actualPrice, sellPrice, photo } = body
    if (!title || !category) {
      return new Response(JSON.stringify({ error: 'title and category are required' }), { status: 400 })
    }

    const id = `item_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    const rows = await sql`
      insert into items (id, title, category, size, actual_price, sell_price, photo)
      values (${id}, ${title}, ${category}, ${size ?? null}, ${actualPrice ?? null}, ${sellPrice ?? null}, ${photo ?? null})
      returning *
    `
    return new Response(JSON.stringify(toItem(rows[0])), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
}

export const config = { path: '/api/items' }
