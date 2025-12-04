import React, { useEffect, useState } from 'react'

export default function AdminDashboard(){
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  async function fetchApps(){
    setLoading(true); setErr(null)
    const token = localStorage.getItem('admin_token') || ''
    try{
      const res = await fetch('/api/applications', { headers: { 'Authorization': token } })
      if(res.ok){
        const d = await res.json(); setApps(d)
      } else {
        const d = await res.json(); setErr(d.message || 'Failed')
      }
    }catch(e){ setErr('Network error') }
    setLoading(false)
  }

  useEffect(()=>{ fetchApps() }, [])

  return (
    <section className="card">
      <h2>Admin Dashboard - Applications</h2>
      {loading && <div>Loading...</div>}
      {err && <div className="err">{err}</div>}
      <button onClick={fetchApps}>Refresh</button>
      <div className="table">
        {apps.length===0 && <div>No applications yet.</div>}
        {apps.map(a=> (
          <div className="row" key={a._id}>
            <div><strong>{a.fullName}</strong> ({a.email})</div>
            <div>Phone: {a.phone} | Exp: {a.experienceYears || 'N/A'}</div>
            <div className="prev">{a.previousWorks}</div>
            <div className="date">{new Date(a.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
