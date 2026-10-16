async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: options.body ? { 'content-type': 'application/json' } : undefined,
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  listItems: () => request('/api/items'),
  createItem: (item) => request('/api/items', { method: 'POST', body: JSON.stringify(item) }),
  updateItem: (id, item) => request(`/api/items/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteItem: (id) => request(`/api/items/${id}`, { method: 'DELETE' }),
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  uploadPhoto: async (file) => {
    const res = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': file.type },
      body: file,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || 'Upload failed')
    return data.photo
  },
}
