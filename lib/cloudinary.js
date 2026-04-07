import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
  secure: true
})

export default cloudinary

// Helper function to upload file buffer to Cloudinary
export const uploadToCloudinary = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: options.folder || 'ex-convict-platform',
        public_id: options.public_id,
        transformation: options.transformation,
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
    uploadStream.end(buffer)
  })
}

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    format: 'auto',
    quality: 'auto',
    crop: 'limit',
    ...options
  })
}