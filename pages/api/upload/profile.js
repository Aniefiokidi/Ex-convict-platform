import { withIronSessionApiRoute } from 'iron-session/next'
import formidable from 'formidable'
import fs from 'fs'
import { uploadToCloudinary } from '../../../lib/cloudinary'
import prisma from '../../../lib/prisma'

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
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Allow images and PDFs
        return mimetype && (
          mimetype.startsWith('image/') || 
          mimetype === 'application/pdf' ||
          mimetype === 'application/msword' ||
          mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
      }
    })

    const [fields, files] = await form.parse(req)
    const uploadType = fields.type?.[0] // 'profile' or 'resume'
    
    if (!files.file || !files.file[0]) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const file = files.file[0]
    const fileBuffer = fs.readFileSync(file.filepath)
    
    // Determine upload options based on type
    const uploadOptions = {
      folder: `ex-convict-platform/${uploadType}s`,
      public_id: `${user.id}_${uploadType}_${Date.now()}`,
    }

    // Add image transformations for profile photos
    if (uploadType === 'profile') {
      uploadOptions.transformation = [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', format: 'auto' }
      ]
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(fileBuffer, uploadOptions)
    
    // Update user record in database
    const updateData = {}
    if (uploadType === 'profile') {
      updateData.profilePhoto = result.secure_url
    } else if (uploadType === 'resume') {
      updateData.resumeUrl = result.secure_url
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        resumeUrl: true
      }
    })

    // Clean up temporary file
    fs.unlinkSync(file.filepath)

    res.json({
      message: 'File uploaded successfully',
      fileUrl: result.secure_url,
      user: updatedUser
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