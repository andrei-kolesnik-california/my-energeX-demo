import React from 'react'

export default function PostList({ items }) {
  if (!items || !items.length) {
    return <div className="card">No posts yet.</div>
  }
  return (
    <div className="posts">
      {items.map(p => (
        <div className="post card" key={p.id}>
          <div className="post-head">
            <span className="post-label">Title:</span> <span>{p.title}</span>
            <span className="post-label">Author:</span> <span>{p.user_full_name}</span>
          </div>
          <div className="post-sep" />
          <div className="post-body">{p.content}</div>
        </div>
      ))}
    </div>
  )
}
