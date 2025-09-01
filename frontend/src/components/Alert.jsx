import React from 'react'

export default function Alert({ type='info', children }) {
  const cls = type === 'error' ? 'alert alert-error' : type === 'success' ? 'alert alert-success' : 'alert alert-info'
  return <div className={cls}>{children}</div>
}
