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
export const ApplicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  experienceYears: Number,
  previousWorks: String,
  createdAt: { type: Date, default: Date.now }
})

export function getAppModel(){
  if(mongoose.models.Application) return mongoose.models.Application
  return mongoose.model('Application', ApplicationSchema)
}
