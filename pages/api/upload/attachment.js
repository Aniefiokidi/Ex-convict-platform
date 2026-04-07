import { withIronSessionApiRoute } from 'iron-session/next'
import formidable from 'formidable'
import fs from 'fs'
import { uploadToCloudinary } from '../../../lib/cloudinary'

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'devpassworddevpassworddevpass',
  cookieName: 'exconvict_session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production' }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function handler(req, res) {
  const user = req.session.user
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB limit for attachments
      filter: ({ mimetype }) => {
        // Allow images, PDFs, and documents
        return mimetype && (
          mimetype.startsWith('image/') || 
          mimetype === 'application/pdf' ||
          mimetype === 'application/msword' ||
          mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          mimetype === 'text/plain' ||
          mimetype.startsWith('text/')
        )
      }
    })

    const [fields, files] = await form.parse(req)
    
    if (!files.file || !files.file[0]) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = files.file[0]
    const fileBuffer = fs.readFileSync(file.filepath)
    
    // Upload to Cloudinary
    const uploadOptions = {
      folder: 'ex-convict-platform/attachments',
      public_id: `attachment_${user.id}_${Date.now()}`,
      resource_type: 'auto'
    }

    const result = await uploadToCloudinary(fileBuffer, uploadOptions)
    
    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    res.json({
      message: 'File uploaded successfully',
      fileUrl: result.secure_url,
      fileName: file.originalFilename,
      fileSize: file.size,
      fileType: file.mimetype
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      message: 'Upload failed', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
}

export default withIronSessionApiRoute(handler, sessionOptions)