// api/submit.js
import { connect, getAppModel } from './_connect'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  try{
    await connect()
    const Application = getAppModel()
    
    // Extract all fields from request body
    const {
      // Personal Information
      fullName, email, phone, age, city, employed, gender,
      
      // Social Media Experience
      smm_experience, previous_experience, managed_pages, page_links,
      graphic_designs, fb_ads, ads_experience,
      
      // Knowledge About Facebook Page Management
      organic_engagement, negative_comments, posting_frequency,
      best_post_time, meta_skill,
      
      // Expected Salary & Work Conditions
      expected_salary, comments
    } = req.body
    
    // Check required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'age', 'city', 'employed', 'gender',
      'smm_experience', 'previous_experience', 'managed_pages', 'graphic_designs', 'fb_ads',
      'organic_engagement', 'negative_comments', 'posting_frequency', 'best_post_time', 'meta_skill',
      'expected_salary'
    ]
    
    const missingFields = []
    requiredFields.forEach(field => {
      if(!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field)
      }
    })
    
    if(missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: missingFields 
      })
    }
    
    // Create application with all fields
    const app = new Application({
      // Personal Information
      fullName,
      email,
      phone,
      age: Number(age) || 0,
      city,
      employed,
      gender,
      
      // Social Media Experience
      smm_experience: Number(smm_experience) || 0,
      previous_experience,
      managed_pages,
      page_links: page_links || '',
      graphic_designs,
      fb_ads,
      ads_experience: ads_experience || '',
      
      // Knowledge About Facebook Page Management
      organic_engagement,
      negative_comments,
      posting_frequency,
      best_post_time,
      meta_skill,
      
      // Expected Salary & Work Conditions
      expected_salary: Number(expected_salary) || 0,
      comments: comments || '',
      
      createdAt: new Date()
    })
    
    await app.save()
    return res.status(200).json({ message: 'Application saved successfully' })
    
  } catch(err) {
    console.error('Submit error:', err)
    return res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    })
  }
}
