import React, { useState } from 'react'
import { Upload, Trash2, FileText, Image, Film, X } from 'lucide-react'
import type { MediaItem } from '../mockData'

interface MediaUploadProps {
  moduleId: string
  mediaItems: MediaItem[]
  onAddMedia?: (media: Omit<MediaItem, 'id' | 'uploadedAt' | 'moduleId'>) => void
  onDeleteMedia?: (mediaId: string) => void
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  moduleId,
  mediaItems,
  onAddMedia,
  onDeleteMedia,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'video' as 'image' | 'pdf' | 'video',
    title: '',
    fileName: '',
    fileSize: 0,
    fileUrl: '',
    thumbnailUrl: '',
    duration: '',
  })

  const handleAddMedia = () => {
    if (!formData.title.trim() || !formData.fileName.trim()) {
      alert('Please fill in all required fields')
      return
    }

    onAddMedia?.({
      type: formData.type,
      title: formData.title,
      fileName: formData.fileName,
      fileSize: formData.fileSize,
      fileUrl: formData.fileUrl,
      thumbnailUrl: formData.thumbnailUrl,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
    })

    setFormData({
      type: 'video',
      title: '',
      fileName: '',
      fileSize: 0,
      fileUrl: '',
      thumbnailUrl: '',
      duration: '',
    })
    setShowForm(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Film className="w-5 h-5" />
      case 'pdf':
        return <FileText className="w-5 h-5" />
      case 'image':
        return <Image className="w-5 h-5" />
      default:
        return <Upload className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Media Files</h4>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Add Media
        </button>
      </div>

      {/* Add Media Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="space-y-3">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF Document</option>
                <option value="image">Image</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., System Overview Video"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                placeholder="e.g., overview.mp4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File Size (MB)</label>
              <input
                type="number"
                value={formData.fileSize}
                onChange={(e) => setFormData({ ...formData, fileSize: parseFloat(e.target.value) || 0 })}
                placeholder="125.5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Duration (for videos) */}
            {formData.type === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleAddMedia}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add Media
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media List */}
      {mediaItems.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No media files yet. Add videos, PDFs, or images to this module.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mediaItems.map((media) => (
            <div key={media.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              {/* Media Thumbnail/Icon */}
              {media.type === 'image' && media.fileUrl ? (
                <img
                  src={media.fileUrl}
                  alt={media.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ) : media.type === 'video' && media.thumbnailUrl ? (
                <div className="relative mb-2">
                  <img
                    src={media.thumbnailUrl}
                    alt={media.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Film className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white opacity-75" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  {getIcon(media.type)}
                </div>
              )}

              {/* Media Info */}
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{media.title}</p>
                    <p className="text-xs text-gray-500">{media.fileName}</p>
                  </div>
                  <button
                    onClick={() => onDeleteMedia?.(media.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                {/* Media Meta */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold uppercase ${
                      media.type === 'video'
                        ? 'bg-red-100 text-red-700'
                        : media.type === 'pdf'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {media.type}
                  </span>
                  <span>{media.fileSize} MB</span>
                  {media.duration && <span>• {media.duration} min</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
