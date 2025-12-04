// api/_connect.js
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
if(!uri) throw new Error('MONGODB_URI not set in environment')

let cached = global._mongoose
if(!cached) cached = global._mongoose = { conn: null, promise: null }

export async function connect(){
  if(cached.conn) return cached.conn
  if(!cached.promise){
    cached.promise = mongoose.connect(uri).then(m => m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

// Updated Application Schema with all fields
export const ApplicationSchema = new mongoose.Schema({
  // Personal Information
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  employed: { type: String, required: true },
  gender: { type: String, required: true },
  
  // Social Media Experience
  smm_experience: { type: Number, required: true },
  previous_experience: { type: String, required: true },
  managed_pages: { type: String, required: true },
  page_links: { type: String, default: '' },
  graphic_designs: { type: String, required: true },
  fb_ads: { type: String, required: true },
  ads_experience: { type: String, default: '' },
  
  // Knowledge About Facebook Page Management
  organic_engagement: { type: String, required: true },
  negative_comments: { type: String, required: true },
  posting_frequency: { type: String, required: true },
  best_post_time: { type: String, required: true },
  meta_skill: { type: String, required: true },
  
  // Expected Salary & Work Conditions
  expected_salary: { type: Number, required: true },
  comments: { type: String, default: '' },
  
  createdAt: { type: Date, default: Date.now }
})

export function getAppModel(){
  if(mongoose.models.Application) return mongoose.models.Application
  return mongoose.model('Application', ApplicationSchema)
}
