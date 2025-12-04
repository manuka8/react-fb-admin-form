import React, { useState } from 'react'

export default function HireForm(){
  const [form, setForm] = useState({
    // Section 1: Personal Information
    fullName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    employed: '',
    gender: '',
    
    // Section 2: Social Media Experience
    smm_experience: '',
    previous_experience: '',
    managed_pages: '',
    page_links: '',
    graphic_designs: '',
    fb_ads: '',
    ads_experience: '',
    
    // Section 3: Knowledge About Facebook Page Management
    organic_engagement: '',
    negative_comments: '',
    posting_frequency: '',
    best_post_time: '',
    meta_skill: '',
    
    // Section 5: Expected Salary & Work Conditions
    expected_salary: '',
    comments: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [ack, setAck] = useState(null)
  const [errors, setErrors] = useState({})

  function handleChange(e){
    const { name, value } = e.target
    setForm(prev => ({...prev, [name]: value}))
    // Clear error for this field if user starts typing
    if(errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}))
    }
  }

  function validate(){
    const e = {}
    // Required fields validation
    const requiredFields = [
      'fullName', 'email', 'phone', 'age', 'city', 'employed', 'gender',
      'smm_experience', 'previous_experience', 'managed_pages', 'graphic_designs', 'fb_ads',
      'organic_engagement', 'negative_comments', 'posting_frequency', 'best_post_time', 'meta_skill',
      'expected_salary'
    ]
    
    requiredFields.forEach(field => {
      if(!form[field] || form[field].toString().trim() === '') {
        e[field] = 'This field is required'
      }
    })
    
    // Email validation
    if(form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address'
    }
    
    // Phone validation (basic)
    if(form.phone && !/^[0-9+\-\s()]{10,}$/.test(form.phone.replace(/\s/g, ''))) {
      e.phone = 'Please enter a valid phone number'
    }
    
    return e
  }

  async function handleSubmit(e){
    e.preventDefault()
    const v = validate()
    setErrors(v)
    
    if(Object.keys(v).length > 0) {
      setAck({type: 'error', message: 'Please fix the errors in the form'})
      return
    }

    setLoading(true)
    try{
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if(res.ok) {
        setAck({type: 'success', message: 'Thank you! Your application was successfully submitted.'})
        // Reset form
        setForm({
          fullName: '', email: '', phone: '', age: '', city: '', employed: '', gender: '',
          smm_experience: '', previous_experience: '', managed_pages: '', page_links: '',
          graphic_designs: '', fb_ads: '', ads_experience: '',
          organic_engagement: '', negative_comments: '', posting_frequency: '',
          best_post_time: '', meta_skill: '',
          expected_salary: '', comments: ''
        })
      } else {
        setAck({type: 'error', message: `Error: ${data.message || 'Unable to submit application'}`})
      }
    }catch(err){
      setAck({type: 'error', message: 'Network error. Please check your connection and try again.'})
      console.error('Submission error:', err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h2>Application Form</h2>
      {ack && (
        <div className={`ack ${ack.type === 'success' ? 'success' : 'error'}`}>
          {ack.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-xl">
        {/* Section 1: Personal Information */}
        <h2 className="text-xl font-bold mt-4">Section 1: Personal Information</h2>

        <div>
          <label className="block font-semibold">Full Name *</label>
          <input 
            type="text" 
            name="fullName" 
            value={form.fullName}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.fullName ? 'border-red-500' : ''}`} 
            required 
          />
          {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
        </div>

        <div>
          <label className="block font-semibold">Email Address *</label>
          <input 
            type="email" 
            name="email" 
            value={form.email}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : ''}`} 
            required 
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div>
          <label className="block font-semibold">Phone Number (WhatsApp Enabled) *</label>
          <input 
            type="tel" 
            name="phone" 
            value={form.phone}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.phone ? 'border-red-500' : ''}`} 
            placeholder="e.g., +1 (123) 456-7890"
            required 
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
        </div>

        <div>
          <label className="block font-semibold">Age *</label>
          <input 
            type="number" 
            name="age" 
            value={form.age}
            onChange={handleChange}
            min="18"
            max="70"
            className={`w-full border p-2 rounded ${errors.age ? 'border-red-500' : ''}`} 
            required 
          />
          {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
        </div>

        <div>
          <label className="block font-semibold">City / District *</label>
          <input 
            type="text" 
            name="city" 
            value={form.city}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.city ? 'border-red-500' : ''}`} 
            required 
          />
          {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
        </div>

        <div>
          <label className="block font-semibold">Are you currently employed? *</label>
          <select 
            name="employed" 
            value={form.employed}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.employed ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.employed && <span className="text-red-500 text-sm">{errors.employed}</span>}
        </div>

        <div>
          <label className="block font-semibold">Gender *</label>
          <select 
            name="gender" 
            value={form.gender}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.gender ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
        </div>

        {/* Section 2: Social Media Experience */}
        <h2 className="text-xl font-bold mt-6">Section 2: Social Media Experience</h2>

        <div>
          <label className="block font-semibold">Years of experience in Social Media Management *</label>
          <input 
            type="number" 
            name="smm_experience" 
            value={form.smm_experience}
            onChange={handleChange}
            min="0"
            max="50"
            className={`w-full border p-2 rounded ${errors.smm_experience ? 'border-red-500' : ''}`} 
            required 
          />
          {errors.smm_experience && <span className="text-red-500 text-sm">{errors.smm_experience}</span>}
        </div>

        <div>
          <label className="block font-semibold">Describe your previous experiences *</label>
          <textarea 
            name="previous_experience" 
            value={form.previous_experience}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.previous_experience ? 'border-red-500' : ''}`} 
            rows="4" 
            placeholder="Describe your social media management experiences..."
            required
          ></textarea>
          {errors.previous_experience && <span className="text-red-500 text-sm">{errors.previous_experience}</span>}
        </div>

        <div>
          <label className="block font-semibold">Have you managed Facebook pages before? *</label>
          <select 
            name="managed_pages" 
            value={form.managed_pages}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.managed_pages ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.managed_pages && <span className="text-red-500 text-sm">{errors.managed_pages}</span>}
        </div>

        <div>
          <label className="block font-semibold">If yes, mention the pages (with links)</label>
          <textarea 
            name="page_links" 
            value={form.page_links}
            onChange={handleChange}
            className="w-full border p-2 rounded" 
            rows="3"
            placeholder="Enter Facebook page URLs separated by commas..."
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold">Do you provide graphic designs for our FB page? *</label>
          <select 
            name="graphic_designs" 
            value={form.graphic_designs}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.graphic_designs ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.graphic_designs && <span className="text-red-500 text-sm">{errors.graphic_designs}</span>}
        </div>

        <div>
          <label className="block font-semibold">Do you have experience running Facebook Ads? *</label>
          <select 
            name="fb_ads" 
            value={form.fb_ads}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.fb_ads ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.fb_ads && <span className="text-red-500 text-sm">{errors.fb_ads}</span>}
        </div>

        <div>
          <label className="block font-semibold">If yes, explain your experience</label>
          <textarea 
            name="ads_experience" 
            value={form.ads_experience}
            onChange={handleChange}
            className="w-full border p-2 rounded" 
            rows="3"
            placeholder="Describe your Facebook Ads experience..."
          ></textarea>
        </div>

        {/* Section 3: Knowledge About Facebook Page Management */}
        <h2 className="text-xl font-bold mt-6">Section 3: Knowledge About Facebook Page Management</h2>

        <div>
          <label className="block font-semibold">How do you increase page engagement organically? *</label>
          <textarea 
            name="organic_engagement" 
            value={form.organic_engagement}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.organic_engagement ? 'border-red-500' : ''}`} 
            rows="3" 
            required
          ></textarea>
          {errors.organic_engagement && <span className="text-red-500 text-sm">{errors.organic_engagement}</span>}
        </div>

        <div>
          <label className="block font-semibold">How do you handle negative comments or customer complaints? *</label>
          <textarea 
            name="negative_comments" 
            value={form.negative_comments}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.negative_comments ? 'border-red-500' : ''}`} 
            rows="3" 
            required
          ></textarea>
          {errors.negative_comments && <span className="text-red-500 text-sm">{errors.negative_comments}</span>}
        </div>

        <div>
          <label className="block font-semibold">Posting frequency recommendation *</label>
          <select 
            name="posting_frequency" 
            value={form.posting_frequency}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.posting_frequency ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Daily">Daily</option>
            <option value="3-4 times a week">3–4 times a week</option>
            <option value="Once a week">Once a week</option>
          </select>
          {errors.posting_frequency && <span className="text-red-500 text-sm">{errors.posting_frequency}</span>}
        </div>

        <div>
          <label className="block font-semibold">What is the best time to post content? *</label>
          <input 
            type="text" 
            name="best_post_time" 
            value={form.best_post_time}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.best_post_time ? 'border-red-500' : ''}`} 
            placeholder="e.g., 6-9 PM on weekdays"
            required 
          />
          {errors.best_post_time && <span className="text-red-500 text-sm">{errors.best_post_time}</span>}
        </div>

        <div>
          <label className="block font-semibold">Familiarity with Meta Business Suite scheduling *</label>
          <select 
            name="meta_skill" 
            value={form.meta_skill}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.meta_skill ? 'border-red-500' : ''}`} 
            required
          >
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
          {errors.meta_skill && <span className="text-red-500 text-sm">{errors.meta_skill}</span>}
        </div>

        {/* Section 5: Expected Salary */}
        <h2 className="text-xl font-bold mt-6">Section 5: Expected Salary & Work Conditions</h2>

        <div>
          <label className="block font-semibold">Expected Monthly Salary (USD) *</label>
          <input 
            type="number" 
            name="expected_salary" 
            value={form.expected_salary}
            onChange={handleChange}
            min="0"
            step="50"
            className={`w-full border p-2 rounded ${errors.expected_salary ? 'border-red-500' : ''}`} 
            required 
          />
          {errors.expected_salary && <span className="text-red-500 text-sm">{errors.expected_salary}</span>}
        </div>

        <div>
          <label className="block font-semibold">Any additional comments or questions?</label>
          <textarea 
            name="comments" 
            value={form.comments}
            onChange={handleChange}
            className="w-full border p-2 rounded" 
            rows="4"
            placeholder="Any additional information you'd like to share..."
          ></textarea>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className={`px-6 py-3 rounded font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </section>
  )
}
