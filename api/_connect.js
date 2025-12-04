import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
if(!uri) throw new Error('MONGODB_URI not set in environment')

let cached = global._mongoose
if(!cached) cached = global._mongoose = { conn: null, promise: null }

export async function connect(){
  if(cached.conn) return cached.conn
  if(!cached.promise){
    cached.promise = mongoose.connect(uri).then(m=> m)
  }
  cached.conn = await cached.promise
  return cached.conn
}

// Schema
// Updated ApplicationSchema in api/_connect.js
export const ApplicationSchema = new mongoose.Schema({
  // Personal Information
  fullName: String,
  email: String,
  phone: String,
  age: Number,
  city: String,
  employed: String,
  gender: String,
  
  // Social Media Experience
  smm_experience: Number,
  previous_experience: String,
  managed_pages: String,
  page_links: String,
  graphic_designs: String,
  fb_ads: String,
  ads_experience: String,
  
  // Knowledge
  organic_engagement: String,
  negative_comments: String,
  posting_frequency: String,
  best_post_time: String,
  meta_skill: String,
  
  // Salary
  expected_salary: Number,
  comments: String,
  
  createdAt: { type: Date, default: Date.now }
})

export function getAppModel(){
  if(mongoose.models.Application) return mongoose.models.Application
  return mongoose.model('Application', ApplicationSchema)
}
