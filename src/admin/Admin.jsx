import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { categories as allCategories } from '../content'
import './Admin.css'

const categoryOptions = allCategories.filter((category) => category !== 'All')

const emptyForm = {
  title: '',
  category: categoryOptions[0] ?? '',
  size: '',
  actualPrice: '',
  sellPrice: '',
  photo: '',
}

function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await api.login(email, password)
      onLoggedIn(user.email)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-login" onSubmit={submit}>
      <h1>Admin sign in</h1>
      <label className="admin-field">
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </label>
      <label className="admin-field">
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error ? <p className="admin-error">{error}</p> : null}
      <button className="button button--primary" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

function ItemForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial ?? emptyForm)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const photo = await api.uploadPhoto(file)
      setForm((prev) => ({ ...prev, photo }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({
        title: form.title,
        category: form.category,
        size: form.size,
        actualPrice: form.actualPrice === '' ? null : Number(form.actualPrice),
        sellPrice: form.sellPrice === '' ? null : Number(form.sellPrice),
        photo: form.photo,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <h2>{initial ? 'Edit piece' : 'Add a piece'}</h2>
      <label>
        Title
        <input value={form.title} onChange={update('title')} required />
      </label>
      <div className="admin-form__grid">
        <label>
          Category
          <select value={form.category} onChange={update('category')} required>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          Size
          <input value={form.size} onChange={update('size')} />
        </label>
        <label>
          Actual price (RM)
          <input type="number" step="0.01" min="0" value={form.actualPrice} onChange={update('actualPrice')} />
        </label>
        <label>
          Current price (RM)
          <input type="number" step="0.01" min="0" value={form.sellPrice} onChange={update('sellPrice')} />
        </label>
      </div>
      <label>
        Photo
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} />
      </label>
      {uploading ? <p>Uploading photo…</p> : null}
      {form.photo ? <img src={form.photo} alt="Preview" style={{ width: 96, borderRadius: 6 }} /> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-row__actions">
        <button className="button button--primary" type="submit" disabled={saving || uploading}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {onCancel ? <button className="button" type="button" onClick={onCancel}>Cancel</button> : null}
      </div>
    </form>
  )
}

function Dashboard({ email, onLoggedOut }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const refresh = async () => {
    setLoading(true)
    try {
      setItems(await api.listItems())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const createItem = async (values) => {
    await api.createItem(values)
    setAdding(false)
    await refresh()
  }

  const saveItem = async (values) => {
    await api.updateItem(editing.id, values)
    setEditing(null)
    await refresh()
  }

  const removeItem = async (id) => {
    if (!window.confirm('Delete this piece?')) return
    await api.deleteItem(id)
    await refresh()
  }

  const logout = async () => {
    await api.logout()
    onLoggedOut()
  }

  return (
    <div className="admin">
      <div className="admin__header">
        <div>
          <h1>Content</h1>
          <p>Signed in as {email}</p>
        </div>
        <button className="button" type="button" onClick={logout}>Sign out</button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <p>Loading…</p> : null}

      <div className="admin-list">
        {items.map((item) => (
          <div className="admin-row" key={item.id}>
            <img src={item.photo || '/placeholder-item.svg'} alt={item.title} />
            <div className="admin-row__meta">
              <strong>{item.title}</strong>
              <span>{item.category} · {item.size || '—'}</span>
              <span>RM {item.sellPrice ?? '—'} (was RM {item.actualPrice ?? '—'})</span>
            </div>
            <div className="admin-row__actions">
              <button className="button" type="button" onClick={() => setEditing(item)}>Edit</button>
              <button className="button" type="button" onClick={() => removeItem(item.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 ? <p>No pieces yet. Add your first one below.</p> : null}
      </div>

      {editing ? (
        <ItemForm initial={editing} onCancel={() => setEditing(null)} onSave={saveItem} />
      ) : adding ? (
        <ItemForm onCancel={() => setAdding(false)} onSave={createItem} />
      ) : (
        <button className="button button--primary" type="button" onClick={() => setAdding(true)}>
          Add a piece
        </button>
      )}
    </div>
  )
}

export default function Admin() {
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState(null)

  useEffect(() => {
    api.me()
      .then((user) => setEmail(user.email))
      .finally(() => setChecking(false))
  }, [])

  if (checking) return <div className="admin">Loading…</div>

  return email ? (
    <Dashboard email={email} onLoggedOut={() => setEmail(null)} />
  ) : (
    <LoginForm onLoggedIn={setEmail} />
  )
}
