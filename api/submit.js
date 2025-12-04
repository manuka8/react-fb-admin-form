import { connect, getAppModel } from './_connect'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  try{
    await connect()
    const Application = getAppModel()
    const { fullName, email, phone, experienceYears, previousWorks } = req.body
    if(!fullName || !email || !phone || !previousWorks) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const app = new Application({ fullName, email, phone, experienceYears: experienceYears||0, previousWorks })
    await app.save()
    return res.status(200).json({ message:'saved' })
  }catch(err){
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
