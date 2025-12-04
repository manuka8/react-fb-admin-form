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
    
    // Age validation
    if(form.age && (form.age < 18 || form.age > 70)) {
      e.age = 'Age must be between 18 and 70'
    }
    
    // Experience validation
    if(form.smm_experience && form.smm_experience < 0) {
      e.smm_experience = 'Experience cannot be negative'
    }
    
    // Salary validation
    if(form.expected_salary && form.expected_salary < 0) {
      e.expected_salary = 'Salary cannot be negative'
    }
    
    return e
  }

  async function handleSubmit(e){
    e.preventDefault()
    const v = validate()
    setErrors(v)
    
    if(Object.keys(v).length > 0) {
      setAck({type: 'error', message: 'Please fix the errors in the form before submitting.'})
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        setAck({type: 'success', message: '🎉 Thank you! Your application was successfully submitted. We will contact you soon.'})
        // Reset form
        setForm({
          fullName: '', email: '', phone: '', age: '', city: '', employed: '', gender: '',
          smm_experience: '', previous_experience: '', managed_pages: '', page_links: '',
          graphic_designs: '', fb_ads: '', ads_experience: '',
          organic_engagement: '', negative_comments: '', posting_frequency: '',
          best_post_time: '', meta_skill: '',
          expected_salary: '', comments: ''
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setAck({type: 'error', message: `❌ Error: ${data.message || 'Unable to submit application. Please try again.'}`})
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }catch(err){
      setAck({type: 'error', message: '⚠️ Network error. Please check your connection and try again.'})
      console.error('Submission error:', err)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="card fade-in">
      <div className="section-title">
        <div className="section-title-icon">
          <i className="fas fa-file-alt"></i>
        </div>
        <h2>Application Form</h2>
      </div>
      
      {ack && (
        <div className={`ack ${ack.type === 'success' ? 'success' : 'error'} mb-4`}>
          <i className={`fas ${ack.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {ack.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        <div className="section">
          <div className="section-title">
            <div className="section-title-icon">
              <i className="fas fa-user"></i>
            </div>
            <h2>Personal Information</h2>
          </div>
          
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label className="font-semibold mb-2 required">Full Name</label>
              <input 
                type="text" 
                name="fullName" 
                value={form.fullName}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="John Doe"
              />
              {errors.fullName && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.fullName}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={form.email}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.email ? 'is-invalid' : ''}`}
                placeholder="john@example.com"
              />
              {errors.email && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.email}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={form.phone}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="+1 (123) 456-7890"
              />
              {errors.phone && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.phone}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Age</label>
              <input 
                type="number" 
                name="age" 
                value={form.age}
                onChange={handleChange}
                min="18"
                max="70"
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.age ? 'is-invalid' : ''}`}
                placeholder="25"
              />
              {errors.age && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.age}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">City / District</label>
              <input 
                type="text" 
                name="city" 
                value={form.city}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.city ? 'is-invalid' : ''}`}
                placeholder="New York"
              />
              {errors.city && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.city}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Current Employment Status</label>
              <select 
                name="employed" 
                value={form.employed}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.employed ? 'is-invalid' : ''}`}
              >
                <option value="">Select status</option>
                <option value="Employed">Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
                <option value="Freelancer">Freelancer</option>
              </select>
              {errors.employed && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.employed}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Gender</label>
              <select 
                name="gender" 
                value={form.gender}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.gender ? 'is-invalid' : ''}`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.gender}
              </div>}
            </div>
          </div>
        </div>

        {/* Section 2: Social Media Experience */}
        <div className="section">
          <div className="section-title">
            <div className="section-title-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h2>Social Media Experience</h2>
          </div>
          
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label className="font-semibold mb-2 required">Years of SMM Experience</label>
              <input 
                type="number" 
                name="smm_experience" 
                value={form.smm_experience}
                onChange={handleChange}
                min="0"
                max="50"
                step="0.5"
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.smm_experience ? 'is-invalid' : ''}`}
                placeholder="2.5"
              />
              {errors.smm_experience && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.smm_experience}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Managed Facebook Pages Before?</label>
              <select 
                name="managed_pages" 
                value={form.managed_pages}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.managed_pages ? 'is-invalid' : ''}`}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.managed_pages && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.managed_pages}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Provide Graphic Designs?</label>
              <select 
                name="graphic_designs" 
                value={form.graphic_designs}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.graphic_designs ? 'is-invalid' : ''}`}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.graphic_designs && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.graphic_designs}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Facebook Ads Experience?</label>
              <select 
                name="fb_ads" 
                value={form.fb_ads}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.fb_ads ? 'is-invalid' : ''}`}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.fb_ads && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.fb_ads}
              </div>}
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="font-semibold mb-2 required">Previous Experience Description</label>
            <textarea 
              name="previous_experience" 
              value={form.previous_experience}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md transition-all ${errors.previous_experience ? 'is-invalid' : ''}`}
              rows="4"
              placeholder="Describe your social media management experiences, campaigns you've run, and results achieved..."
            ></textarea>
            {errors.previous_experience && <div className="invalid-feedback mt-1">
              <i className="fas fa-exclamation-circle"></i> {errors.previous_experience}
            </div>}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-2">Facebook Page Links (If applicable)</label>
            <textarea 
              name="page_links" 
              value={form.page_links}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded-md transition-all"
              rows="3"
              placeholder="Enter URLs of Facebook pages you've managed (one per line)..."
            ></textarea>
            <small className="text-gray-600 mt-1 block">Separate URLs with commas or new lines</small>
          </div>

          <div className="form-group">
            <label className="font-semibold mb-2">Facebook Ads Experience Details</label>
            <textarea 
              name="ads_experience" 
              value={form.ads_experience}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded-md transition-all"
              rows="3"
              placeholder="Describe your Facebook Ads experience, budgets managed, and campaign results..."
            ></textarea>
          </div>
        </div>

        {/* Section 3: Knowledge About Facebook Page Management */}
        <div className="section">
          <div className="section-title">
            <div className="section-title-icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h2>Facebook Management Knowledge</h2>
          </div>
          
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label className="font-semibold mb-2 required">Posting Frequency Recommendation</label>
              <select 
                name="posting_frequency" 
                value={form.posting_frequency}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.posting_frequency ? 'is-invalid' : ''}`}
              >
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="3-4 times a week">3–4 times a week</option>
                <option value="2-3 times a week">2–3 times a week</option>
                <option value="Once a week">Once a week</option>
              </select>
              {errors.posting_frequency && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.posting_frequency}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Best Time to Post Content</label>
              <input 
                type="text" 
                name="best_post_time" 
                value={form.best_post_time}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.best_post_time ? 'is-invalid' : ''}`}
                placeholder="e.g., Weekdays 6-9 PM, Weekends 2-5 PM"
              />
              {errors.best_post_time && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.best_post_time}
              </div>}
            </div>

            <div className="form-group">
              <label className="font-semibold mb-2 required">Meta Business Suite Skill Level</label>
              <select 
                name="meta_skill" 
                value={form.meta_skill}
                onChange={handleChange}
                className={`w-full p-3 border-2 rounded-md transition-all ${errors.meta_skill ? 'is-invalid' : ''}`}
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              {errors.meta_skill && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.meta_skill}
              </div>}
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="font-semibold mb-2 required">Organic Engagement Strategy</label>
            <textarea 
              name="organic_engagement" 
              value={form.organic_engagement}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md transition-all ${errors.organic_engagement ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="How would you increase page engagement organically without ads?"
            ></textarea>
            {errors.organic_engagement && <div className="invalid-feedback mt-1">
              <i className="fas fa-exclamation-circle"></i> {errors.organic_engagement}
            </div>}
          </div>

          <div className="form-group">
            <label className="font-semibold mb-2 required">Negative Comment Handling</label>
            <textarea 
              name="negative_comments" 
              value={form.negative_comments}
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-md transition-all ${errors.negative_comments ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="How would you handle negative comments or customer complaints?"
            ></textarea>
            {errors.negative_comments && <div className="invalid-feedback mt-1">
              <i className="fas fa-exclamation-circle"></i> {errors.negative_comments}
            </div>}
          </div>
        </div>

        {/* Section 4: Expected Salary */}
        <div className="section">
          <div className="section-title">
            <div className="section-title-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h2>Compensation & Final Details</h2>
          </div>
          
          <div className="grid grid-2 gap-4">
            <div className="form-group">
              <label className="font-semibold mb-2 required">Expected Monthly Salary (USD)</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</div>
                <input 
                  type="number" 
                  name="expected_salary" 
                  value={form.expected_salary}
                  onChange={handleChange}
                  min="0"
                  step="50"
                  className={`w-full p-3 pl-8 border-2 rounded-md transition-all ${errors.expected_salary ? 'is-invalid' : ''}`}
                  placeholder="2000"
                />
              </div>
              {errors.expected_salary && <div className="invalid-feedback mt-1">
                <i className="fas fa-exclamation-circle"></i> {errors.expected_salary}
              </div>}
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="font-semibold mb-2">Additional Comments or Questions</label>
            <textarea 
              name="comments" 
              value={form.comments}
              onChange={handleChange}
              className="w-full p-3 border-2 rounded-md transition-all"
              rows="4"
              placeholder="Any additional information, questions about the role, or portfolio links you'd like to share..."
            ></textarea>
            <small className="text-gray-600 mt-1 block">This is your chance to make a final impression!</small>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Ready to submit?</h3>
              <p className="text-gray-600">Please review all information before submitting your application.</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => {
                  setForm({
                    fullName: '', email: '', phone: '', age: '', city: '', employed: '', gender: '',
                    smm_experience: '', previous_experience: '', managed_pages: '', page_links: '',
                    graphic_designs: '', fb_ads: '', ads_experience: '',
                    organic_engagement: '', negative_comments: '', posting_frequency: '',
                    best_post_time: '', meta_skill: '',
                    expected_salary: '', comments: ''
                  })
                  setErrors({})
                  setAck(null)
                }}
                className="btn-secondary"
                disabled={loading}
              >
                <i className="fas fa-redo"></i> Reset Form
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-blue-600 mt-1"></i>
              <div>
                <h4 className="font-semibold text-blue-800">Privacy Notice</h4>
                <p className="text-blue-700 text-sm">Your information is secure and will only be used for recruitment purposes. We never share your data with third parties without your consent.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
