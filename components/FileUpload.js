import { useState, useRef } from 'react'

export default function FileUpload({ 
  type = 'profile', // 'profile', 'resume', 'attachment'
  onUploadSuccess, 
  onUploadError,
  acceptedTypes = 'image/*,.pdf,.doc,.docx',
  maxSizeMB = 10,
  currentFile = null,
  label = 'Upload File',
  description = null
}) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (file) => {
    if (!file) return

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      onUploadError?.(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const endpoint = type === 'attachment' ? '/api/upload/attachment' : '/api/upload/profile'
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        onUploadSuccess?.(result)
      } else {
        onUploadError?.(result.message || 'Upload failed')
      }
    } catch (error) {
      onUploadError?.(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {type === 'profile' && currentFile ? (
              <div className="mb-4">
                <img 
                  src={currentFile} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            ) : (
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">{label}</h3>
            
            {description && (
              <p className="text-sm text-gray-500 mb-4">{description}</p>
            )}
            
            <p className="text-sm text-gray-500 mb-2">
              Drop files here or click to browse
            </p>
            
            <p className="text-xs text-gray-400">
              Max size: {maxSizeMB}MB
            </p>
            
            {currentFile && type !== 'profile' && (
              <div className="mt-3 text-sm text-green-600">
                ✓ File uploaded successfully
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}