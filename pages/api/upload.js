import { withIronSessionApiRoute } from 'iron-session/next'
import formidable from 'formidable'
import fs from 'fs'
import cloudinary from '../../lib/cloudinary'

export const config = { api: { bodyParser: false } }

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const user = req.session.user
  if (!user) return res.status(401).json({ message: 'Please log in to upload files' })

  const form = formidable({ maxFileSize: 5 * 1024 * 1024 })

  let fields, files
  try {
    ;[fields, files] = await form.parse(req)
  } catch (err) {
    return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' })
  }

  const file = Array.isArray(files.file) ? files.file[0] : files.file
  if (!file) return res.status(400).json({ message: 'No file provided' })

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).json({ message: 'Only PDF and Word documents (.doc, .docx) are allowed' })
  }

  try {
    const buffer = fs.readFileSync(file.filepath)
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'restart-platform/resumes',
          public_id: `resume_${user.id}_${Date.now()}`,
          use_filename: true,
          unique_filename: true
        },
        (error, result) => (error ? reject(error) : resolve(result))
      )
      stream.end(buffer)
    })

    return res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    return res.status(500).json({ message: 'File upload failed. Please try again or contact support.' })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)
