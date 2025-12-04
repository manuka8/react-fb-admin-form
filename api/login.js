export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).json({ message:'Method not allowed' })
  const { password } = req.body
  const ADMIN = process.env.ADMIN_PASSWORD
  if(!ADMIN) return res.status(500).json({ message: 'Server misconfigured' })
  if(password === ADMIN) return res.status(200).json({ message:'ok' })
  return res.status(401).json({ message:'Invalid password' })
}
