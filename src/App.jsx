import React, { useState } from 'react'
import HireForm from './components/HireForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

export default function App(){
  const [view, setView] = useState('form') // 'form' | 'login' | 'dashboard'

  function onLoginSuccess(){
    setView('dashboard')
  }

  return (
    <div className="container">
      <h1>Hire an Admin to Manage Facebook Page</h1>

      <nav className="nav">
        <button onClick={()=>setView('form')}>Apply</button>
        <button onClick={()=>setView('login')}>Admin Login</button>
        <button onClick={()=>setView('dashboard')}>Dashboard</button>
      </nav>

      <main>
        {view === 'form' && <HireForm />}
        {view === 'login' && <AdminLogin onLoginSuccess={onLoginSuccess} />}
        {view === 'dashboard' && <AdminDashboard />}
      </main>
    </div>
  )
}
