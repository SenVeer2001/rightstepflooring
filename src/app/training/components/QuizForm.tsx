import React, { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import type { ModuleQuiz } from '../mockData'

interface QuizFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (quizData: Partial<ModuleQuiz>) => void
  initialData?: ModuleQuiz
  title: string
}

export const QuizForm: React.FC<QuizFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [formData, setFormData] = useState<Partial<ModuleQuiz>>({
    title: '',
    description: '',
    passingScore: 70,
    timeLimit: undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        passingScore: initialData.passingScore,
        timeLimit: initialData.timeLimit,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        passingScore: 70,
        timeLimit: undefined,
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Quiz title is required'
    }

    if (!formData.passingScore) {
      newErrors.passingScore = 'Passing score is required'
    } else if (formData.passingScore < 0 || formData.passingScore > 100) {
      newErrors.passingScore = 'Passing score must be between 0 and 100'
    }

    if (formData.timeLimit && formData.timeLimit <= 0) {
      newErrors.timeLimit = 'Time limit must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quiz Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quiz Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }))
                setErrors((prev) => ({ ...prev, title: '' }))
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., HVAC Systems Fundamentals"
            />
            {errors.title && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              rows={3}
              placeholder="Describe the quiz purpose and what will be tested..."
            />
          </div>

          {/* Passing Score */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Passing Score (%) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={formData.passingScore || 70}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  setFormData((prev) => ({ ...prev, passingScore: value }))
                  setErrors((prev) => ({ ...prev, passingScore: '' }))
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <span className="text-sm text-gray-600 font-medium">%</span>
            </div>
            {errors.passingScore && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.passingScore}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Students must score this percentage to pass the quiz
            </p>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={formData.timeLimit || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined
                  setFormData((prev) => ({ ...prev, timeLimit: value }))
                  setErrors((prev) => ({ ...prev, timeLimit: '' }))
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Leave empty for unlimited time"
              />
              <span className="text-sm text-gray-600 font-medium">min</span>
            </div>
            {errors.timeLimit && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.timeLimit}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Leave blank for unlimited time
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">Next Step:</span> After creating this quiz, you can add questions to it.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {initialData ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
