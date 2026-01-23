import React, { useState } from 'react'
import { X, Save, Upload } from 'lucide-react'
import type { CourseModule } from '../mockData'

interface ModuleFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (moduleData: Partial<CourseModule>) => void
  initialData?: CourseModule
  title?: string
}

export const ModuleForm: React.FC<ModuleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Add Module',
}) => {
  const [formData, setFormData] = useState<Partial<CourseModule>>(
    initialData || {
      title: '',
      description: '',
      duration: 30,
      order: 1,
    }
  )

  const [mediaType, setMediaType] = useState<'ppt' | 'pdf' | 'video'>('video')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Module title is required'
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.duration || formData.duration < 5) {
      newErrors.duration = 'Duration must be at least 5 minutes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        title: '',
        description: '',
        duration: 30,
        order: 1,
      })
      setMediaType('video')
      setUploadedFile(null)
      setErrors({})
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'order' ? parseInt(value) : value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Module Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Module Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="e.g., HVAC System Basics"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe what students will learn in this module..."
              rows={4}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-colors ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration || 30}
                onChange={handleChange}
                placeholder="30"
                min="5"
                max="480"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.duration && (
                <p className="text-red-600 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order || 1}
                onChange={handleChange}
                placeholder="1"
                min="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">After creating:</span> You can add media files (images, PDFs, videos) and quizzes to this module.
            </p>
          </div>

          {/* Media Upload Section */}
          <div className="border border-gray-300 rounded-lg p-5 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Add Media (Optional)</h3>
            
            {/* Media Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Media Type
              </label>
              <div className="flex gap-3">
                {(['video', 'pdf','ppt'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setMediaType(type)
                      setUploadedFile(null)
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      mediaType === type
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {type.charAt(0) + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-green-50 transition-colors cursor-pointer"
                   onClick={() => document.getElementById('media-upload')?.click()}
              >
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {mediaType === 'video' && 'MP4, WebM (Max 500MB)'}
                  {mediaType === 'pdf' && 'PDF (Max 100MB)'}
                  {mediaType === 'ppt' && 'pptx, .ppt, .pptm)'}
                </p>
                <input
                  id="media-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    mediaType === 'video' ? 'video/mp4,video/webm' :
                    mediaType === 'pdf' ? 'application/pdf' :
                    ''
                  }
                  className="hidden"
                />
              </div>
              {uploadedFile && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-green-700 font-medium">✓ {uploadedFile.name}</p>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-600 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {initialData ? 'Update Module' : 'Create Module'}
          </button>
        </div>
      </div>
    </div>
  )
}
