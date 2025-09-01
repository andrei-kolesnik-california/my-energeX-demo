import React, { useState } from 'react'
import Alert from './Alert'
import { parseApiError } from '../api'

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    try {
      await onLogin(username, password)
    } catch (err) {
      setError(parseApiError(err) || 'Login failed')
    }
  }

  return (
    <div className="row" autoComplete="off">
      <input className="input" placeholder="username (e.g., andrei)" autoComplete="off" onFocus={e=>e.target.select()} value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="input" type="password" placeholder="password" autoComplete="new-password" onFocus={e=>e.target.select()} value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn" onClick={submit}>Login</button>
      {error && <Alert type="error">{error}</Alert>}
    </div>
  )
}

