import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import type { QuestionGroup } from '../mockData'

interface QuestionGroupFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (groupData: Partial<QuestionGroup>) => void
  courseId: string
  title?: string
}

export const QuestionGroupForm: React.FC<QuestionGroupFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseId,
  title = 'Add Question Group',
}) => {
  const [formData, setFormData] = useState<Partial<QuestionGroup>>({
    name: '',
    description: '',
    order: 1,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Group name is required'
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...formData,
        courseId,
        questions: [],
      })
      setFormData({
        name: '',
        description: '',
        order: 1,
      })
      setErrors({})
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value,
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
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="e.g., Module 1: Introduction"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
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
              placeholder="Describe what this group covers..."
              rows={4}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-colors ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order || 1}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">After creating:</span> You can add questions to this group in the Questions tab.
            </p>
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
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-[#2c621b] transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Create Group
          </button>
        </div>
      </div>
    </div>
  )
}
