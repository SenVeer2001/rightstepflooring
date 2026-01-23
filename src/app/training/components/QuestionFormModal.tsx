import React, { useState } from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'
import type { QuizQuestion } from '../mockData'

interface QuestionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (questionData: Partial<QuizQuestion>) => void
  initialData?: QuizQuestion
  title?: string
}

export const QuestionFormModal: React.FC<QuestionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title = 'Add Question',
}) => {
  const [formData, setFormData] = useState<Partial<QuizQuestion>>(
    initialData || {
      title: '',
      answerType: 'multipleChoice',
      options: ['', ''],
      correctAnswer: '',
      marks: 5,
      order: 1,
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Question text is required'
    }

    if (formData.answerType === 'multipleChoice' || formData.answerType === 'yesNo') {
      if (!formData.options || formData.options.length < 2) {
        newErrors.options = 'Add at least 2 options'
      }
      const emptyOptions = formData.options?.filter((opt) => !opt.trim())
      if (emptyOptions && emptyOptions.length > 0) {
        newErrors.options = 'All options must be filled'
      }
    }

    if (!formData.correctAnswer) {
      newErrors.correctAnswer = 'Select correct answer'
    }

    if (!formData.marks || formData.marks < 1) {
      newErrors.marks = 'Marks must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      answerType: 'multipleChoice',
      options: ['', ''],
      correctAnswer: '',
      marks: 5,
      order: 1,
    })
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'marks' || name === 'order' ? parseInt(value) : value,
    }))
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || [])]
      newOptions[index] = value
      return { ...prev, options: newOptions }
    })
  }

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...(prev.options || []), ''],
    }))
  }

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => {
      const newOptions = (prev.options || []).filter((_, i) => i !== index)
      return { ...prev, options: newOptions }
    })
  }

  if (!isOpen) return null

  const isMultiChoice = formData.answerType === 'multipleChoice' || formData.answerType === 'yesNo'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
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
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              placeholder="Enter your question here..."
              rows={3}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Question Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Type *
              </label>
              <select
                name="answerType"
                value={formData.answerType || 'multipleChoice'}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
              >
                <option value="text">Text Answer</option>
                <option value="multipleChoice">Multiple Choice</option>
                <option value="yesNo">Yes/No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Marks *
              </label>
              <input
                type="number"
                name="marks"
                value={formData.marks || 5}
                onChange={handleChange}
                min="1"
                max="100"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors ${
                  errors.marks ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.marks && <p className="text-red-600 text-sm mt-1">{errors.marks}</p>}
            </div>
          </div>

          {/* Options for Multiple Choice */}
          {isMultiChoice && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Options *
                </label>
                <button
                  onClick={handleAddOption}
                  className="flex items-center gap-1 px-2 py-1 text-purple-600 hover:bg-purple-50 rounded transition-colors text-sm font-medium"
                >
                  <Plus className="w-3 h-3" />
                  Add Option
                </button>
              </div>

              <div className="space-y-2">
                {(formData.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type={formData.answerType === 'yesNo' ? 'radio' : 'radio'}
                      name="correctAnswer"
                      value={option}
                      checked={formData.correctAnswer === option}
                      onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                      className="w-4 h-4 text-purple-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
                    />
                    {(formData.options || []).length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {errors.options && <p className="text-red-600 text-sm mt-2">{errors.options}</p>}
            </div>
          )}

          {/* Text Answer */}
          {formData.answerType === 'text' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correct Answer *
              </label>
              <textarea
                value={formData.correctAnswer as string || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                placeholder="Enter the correct answer or sample answer..."
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-colors ${
                  errors.correctAnswer ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.correctAnswer && (
                <p className="text-red-600 text-sm mt-1">{errors.correctAnswer}</p>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Tip:</span> For multiple choice questions, select the radio button next to the correct answer.
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
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            {initialData ? 'Update Question' : 'Add Question'}
          </button>
        </div>
      </div>
    </div>
  )
}
