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
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-xl">

  {/* Section 1: Personal Information */}
  <h2 className="text-xl font-bold mt-4">Section 1: Personal Information</h2>

  <div>
    <label className="block font-semibold">Full Name</label>
    <input type="text" name="fullName" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Email Address</label>
    <input type="email" name="email" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Phone Number (WhatsApp Enabled)</label>
    <input type="text" name="phone" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Age</label>
    <input type="number" name="age" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">City / District</label>
    <input type="text" name="city" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Are you currently employed?</label>
    <select name="employed" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold">Gender</label>
    <select name="gender" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Section 2: Social Media Experience */}
  <h2 className="text-xl font-bold mt-6">Section 2: Social Media Experience</h2>

  <div>
    <label className="block font-semibold">Years of experience in Social Media Management</label>
    <input type="number" name="smm_experience" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Describe your previous experiences</label>
    <textarea name="previous_experience" className="w-full border p-2 rounded" rows="4" required></textarea>
  </div>

  <div>
    <label className="block font-semibold">Have you managed Facebook pages before?</label>
    <select name="managed_pages" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold">If yes, mention the pages (with links)</label>
    <textarea name="page_links" className="w-full border p-2 rounded" rows="3"></textarea>
  </div>

  <div>
    <label className="block font-semibold">Do you provide graphic designs for our FB page?</label>
    <select name="graphic_designs" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold">Do you have experience running Facebook Ads?</label>
    <select name="fb_ads" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold">If yes, explain your experience</label>
    <textarea name="ads_experience" className="w-full border p-2 rounded" rows="3"></textarea>
  </div>


  {/* Section 3: Knowledge About Facebook Page Management */}
  <h2 className="text-xl font-bold mt-6">Section 3: Knowledge About Facebook Page Management</h2>

  <div>
    <label className="block font-semibold">How do you increase page engagement organically?</label>
    <textarea name="organic_engagement" className="w-full border p-2 rounded" rows="3" required></textarea>
  </div>

  <div>
    <label className="block font-semibold">How do you handle negative comments or customer complaints?</label>
    <textarea name="negative_comments" className="w-full border p-2 rounded" rows="3" required></textarea>
  </div>

  <div>
    <label className="block font-semibold">Posting frequency recommendation</label>
    <select name="posting_frequency" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Daily">Daily</option>
      <option value="3-4 times a week">3–4 times a week</option>
      <option value="Once a week">Once a week</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold">What is the best time to post content?</label>
    <input type="text" name="best_post_time" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Familiarity with Meta Business Suite scheduling</label>
    <select name="meta_skill" className="w-full border p-2 rounded" required>
      <option value="">Select</option>
      <option value="Beginner">Beginner</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Expert">Expert</option>
    </select>
  </div>


  {/* Section 5: Expected Salary */}
  <h2 className="text-xl font-bold mt-6">Section 5: Expected Salary & Work Conditions</h2>

  <div>
    <label className="block font-semibold">Expected Monthly Salary</label>
    <input type="number" name="expected_salary" className="w-full border p-2 rounded" required />
  </div>

  <div>
    <label className="block font-semibold">Any additional comments or questions?</label>
    <textarea name="comments" className="w-full border p-2 rounded" rows="4"></textarea>
  </div>

  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Submit</button>
</form>
    </section>
  )
}
