import { connect, getAppModel } from './_connect'

export default async function handler(req, res){
  if(req.method !== 'GET') return res.status(405).json({ message:'Method not allowed' })
  const token = req.headers.authorization || ''
  const ADMIN = process.env.ADMIN_PASSWORD
  if(token !== ADMIN) return res.status(401).json({ message:'Unauthorized' })
  try{
    await connect()
    const Application = getAppModel()
    const list = await Application.find({}).sort({ createdAt: -1 }).lean()
    return res.status(200).json(list)
  }catch(err){
    console.error(err)
    return res.status(500).json({ message:'Server error' })
  }
}
