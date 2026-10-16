// One-time setup: creates tables, the admin account, and migrates the
// hardcoded items from src/content.js into the database.
//
// Usage (after `netlify db init` and `netlify env:pull`):
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword node scripts/seed.mjs
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { neon } from '@netlify/neon'
import { items } from '../src/content.js'

const sql = neon()

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables before running this script.')
    process.exit(1)
  }

  await sql`
    create table if not exists admin_users (
      id serial primary key,
      email text unique not null,
      password_hash text not null,
      created_at timestamptz not null default now()
    )
  `
  await sql`
    create table if not exists items (
      id text primary key,
      title text not null,
      category text not null,
      size text,
      actual_price numeric,
      sell_price numeric,
      photo text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `

  const passwordHash = await bcrypt.hash(password, 10)
  await sql`
    insert into admin_users (email, password_hash)
    values (${email}, ${passwordHash})
    on conflict (email) do update set password_hash = excluded.password_hash
  `
  console.log(`Admin account ready: ${email}`)

  for (const item of items) {
    await sql`
      insert into items (id, title, category, size, actual_price, sell_price, photo)
      values (${item.id}, ${item.title}, ${item.category}, ${item.size ?? null}, ${item.actualPrice ?? null}, ${item.sellPrice ?? null}, ${item.photo ?? null})
      on conflict (id) do nothing
    `
  }
  console.log(`Seeded ${items.length} items (existing ids left untouched).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
