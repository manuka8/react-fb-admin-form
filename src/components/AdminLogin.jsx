import React, { useState } from 'react'

export default function AdminLogin({ onLoginSuccess }){
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)

  async function handleLogin(e){
    e.preventDefault()
    setErr(null)
    try{
      const res = await fetch('/api/login', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password })
      })
      if(res.ok){
        // store token (we use the password as token here for simplicity)
        localStorage.setItem('admin_token', password)
        onLoginSuccess && onLoginSuccess()
      } else {
        const d = await res.json()
        setErr(d.message || 'Login failed')
      }
    }catch(err){ setErr('Network error') }
  }

  return (
    <section className="card">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label>Admin Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <button type="submit">Login</button>
        {err && <div className="err">{err}</div>}
      </form>
    </section>
  )
}

