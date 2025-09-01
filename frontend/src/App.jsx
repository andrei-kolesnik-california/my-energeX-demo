
import React, { useEffect, useState } from 'react'
import { api, setAuth } from './api'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import './styles.css'

function IconLogin(){ return (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 17l5-5-5-5v3H3v4h7v3zM20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
  </svg>
)}

function IconUserPlus(){ return (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 12c2.761 0 5-2.239 5-5S17.761 2 15 2s-5 2.239-5 5 2.239 5 5 5zm-9 1C3.794 13 2 14.794 2 17v3h9v-3c0-2.206-1.794-4-4-4H6zM20 14h-2v-2h-2v2h-2v2h2v2h2v-2h2z"></path>
  </svg>
)}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [posts, setPosts] = useState([])
  const [modal, setModal] = useState(null) // 'login' | 'register' | null

  useEffect(() => { setAuth(token) }, [token])

  useEffect(() => {
    loadPosts();
  }, [])

  const handleLogin = async (username, password) => {
    const { data } = await api.post('/api/login/', { username, password })
    localStorage.setItem('token', data.access)
    setToken(data.access)
    setModal(null)
    await loadPosts()
  }

    const handleRegister = async (payload) => {
    // payload = { username, full_name, email, password }
    await api.post('/api/register/', payload);
    setModal('login');
  };

  const loadPosts = async () => {
    const { data } = await api.get('/api/posts/')
    setPosts(data)
  }

  const createPost = async (title, content) => {
    await api.post('/api/posts/', { title, content })
    await loadPosts()
  }

  return (
    <div>
      {/* Header */}
      <div className="headerbar">
        <div className="brand">
          <span className="logo" aria-hidden="true"></span>
          EnergeX
        </div>
        <div className="header-actions">
          {!token && (
            <>
              <button className="icon-btn" onClick={() => setModal('login')} title="Login">
                <IconLogin /><span className="icon-label">Login</span>
              </button>
              <button className="icon-btn" onClick={() => setModal('register')} title="Sign up">
                <IconUserPlus /><span className="icon-label">Sign up</span>
              </button>
            </>
          )}
          {token && (
            <button className="icon-btn" onClick={() => { localStorage.removeItem('token'); setToken('') }} title="Logout">
              ✦<span className="icon-label">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="hero">
        <h1>Ship reliable APIs faster</h1>
        <p>EnergeX helps teams build and scale backend services with confidence: clean architecture, smart caching, and simple deployment. Log in to create posts and see Redis-backed responses in action.</p>
        {token && <p><a className="link" href="http://localhost:8000/api/docs/" target="_blank" rel="noreferrer">Open API docs</a></p>}
      </div>

      {/* Authenticated area */}
      {token && (
        <div className="container">
          <div className="card">
            <div className="section-title">Create post</div>
            <PostForm onCreate={createPost} />
            <button className="btn" style={{marginTop:12}} onClick={loadPosts}>Reload posts</button>
          </div>

          <div className="section-title container">Posts</div>
          <div className="container">
            <div className="posts">
              <PostList items={posts} />
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop">
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'login' ? 'Login' : 'Create your account'}</h3>
              <button className="close-btn" onClick={() => setModal(null)} aria-label="Close">×</button>
            </div>
            {modal === 'login' ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <RegisterForm onRegister={handleRegister} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
