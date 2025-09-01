import React, { useState } from 'react'
import Alert from './Alert'
import { parseApiError } from '../api'

export default function PostForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const submit = async () => {
    setError(''); setOk('')
    if (!title.trim()) { setError('Title is required'); return }
    try {
      await onCreate(title, content)
      setTitle(''); setContent('')
      setOk('Post created')
    } catch (err) {
      setError(parseApiError(err) || 'Failed to create post')
    }
  }

  return (
    <div className="row" autoComplete="off">
      <input className="input" placeholder="Post title" onFocus={e=>e.target.select()} value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="textarea" placeholder="Write something interesting..." onFocus={e=>e.target.select()} value={content} onChange={e=>setContent(e.target.value)} />
      <button className="btn" onClick={submit}>Create</button>
      {error && <Alert type="error">{error}</Alert>}
      {ok && <Alert type="success">{ok}</Alert>}
    </div>
  )
}
