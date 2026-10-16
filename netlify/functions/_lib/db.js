import { neon } from '@netlify/neon'

let client

export function sql(...args) {
  if (!client) client = neon()
  return client(...args)
}

export async function ensureSchema() {
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
}
