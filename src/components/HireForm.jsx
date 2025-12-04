import React, { useState } from 'react'

export default function HireForm(){
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', experienceYears: '', previousWorks: ''
  })
  const [loading, setLoading] = useState(false)
  const [ack, setAck] = useState(null)
  const [errors, setErrors] = useState({})

  function handleChange(e){
    setForm({...form, [e.target.name]: e.target.value})
  }

  function validate(){
    const e = {}
    if(!form.fullName) e.fullName = 'Required'
    if(!form.email) e.email = 'Required'
    if(!form.phone) e.phone = 'Required'
    if(!form.previousWorks) e.previousWorks = 'Required'
    return e
  }

  async function handleSubmit(e){
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if(Object.keys(v).length) return

    setLoading(true)
    try{
      const res = await fetch('/api/submit', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if(res.ok) {
        setAck('Thank you! Your application was received.')
        setForm({ fullName: '', email: '', phone: '', experienceYears: '', previousWorks: '' })
      } else {
        setAck('Error: ' + (data.message || 'Unable to submit'))
      }
    }catch(err){
      setAck('Network error')
    }finally{ setLoading(false) }
  }

  return (
    <section className="card">
      <h2>Application Form</h2>
      {ack && <div className="ack">{ack}</div>}
      <form onSubmit={handleSubmit}>
        <label>Full name*<input name="fullName" value={form.fullName} onChange={handleChange} /></label>
        {errors.fullName && <small className="err">{errors.fullName}</small>}

        <label>Email*<input name="email" value={form.email} onChange={handleChange} type="email" /></label>
        {errors.email && <small className="err">{errors.email}</small>}

        <label>Phone*<input name="phone" value={form.phone} onChange={handleChange} /></label>
        {errors.phone && <small className="err">{errors.phone}</small>}

        <label>Years of experience<input name="experienceYears" value={form.experienceYears} onChange={handleChange} type="number" /></label>

        <label>Describe previous works*<textarea name="previousWorks" value={form.previousWorks} onChange={handleChange} rows="6"></textarea></label>
        {errors.previousWorks && <small className="err">{errors.previousWorks}</small>}

        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
      </form>
    </section>
  )
}

