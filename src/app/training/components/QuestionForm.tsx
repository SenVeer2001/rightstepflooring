import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Question } from '../mockData'
import { RatingStars } from './RatingStars'

interface QuestionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (question: Partial<Question>) => void
  initialData?: Partial<Question>
  title?: string
  groupId: string
}

interface FormData {
  title: string
  description: string
  answerType: 'text' | 'multipleChoice' | 'yesNo'
  options: string[]
  marks: number
  rating: number
}

const emptyForm: FormData = {
  title: '',
  description: '',
  answerType: 'text',
  options: ['', ''],
  marks: 5,
  rating: 0,
}

export function QuestionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Add Question',
  groupId,
}: QuestionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    answerType: (initialData?.answerType as FormData['answerType']) || 'text',
    options: initialData?.options || ['', ''],
    marks: initialData?.marks || 5,
    rating: initialData?.rating || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'marks' ? parseInt(value, 10) : value,
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }))
  }

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }))
  }

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Question title is required'
    if (formData.marks <= 0) newErrors.marks = 'Marks must be greater than 0'
    if (formData.answerType === 'multipleChoice') {
      const filledOptions = formData.options.filter((opt) => opt.trim())
      if (filledOptions.length < 2) {
        newErrors.options = 'Multiple choice requires at least 2 options'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const questionData: Partial<Question> = {
      groupId,
      title: formData.title,
      description: formData.description,
      answerType: formData.answerType,
      marks: formData.marks,
      rating: formData.rating,
    }

    if (formData.answerType === 'multipleChoice') {
      questionData.options = formData.options.filter((opt) => opt.trim())
    }

    onSubmit(questionData)
    setFormData(emptyForm)
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Question Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Question Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter question title"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter additional details or context"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Answer Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Answer Type
            </label>
            <select
              name="answerType"
              value={formData.answerType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="text">Text Input</option>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="yesNo">Yes / No</option>
            </select>
          </div>

          {/* Multiple Choice Options */}
          {formData.answerType === 'multipleChoice' && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Options
              </label>
              <div className="space-y-2 mb-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.options && <p className="text-sm text-red-600">{errors.options}</p>}
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                <Plus size={16} />
                Add Option
              </button>
            </div>
          )}

          {/* Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.marks ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.marks && <p className="text-sm text-red-600 mt-1">{errors.marks}</p>}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rating (1-5 Stars)
              </label>
              <div className="flex items-center gap-2 mt-2">
                <RatingStars
                  rating={formData.rating}
                  onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
                  readOnly={false}
                  size="md"
                />
                <span className="text-sm text-gray-600 font-medium">{formData.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
