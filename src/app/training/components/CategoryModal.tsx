import { useState } from 'react'
import { X } from 'lucide-react'
import type { Category, SubCategory } from '../mockData'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Category> | Partial<SubCategory>) => void
  initialData?: Partial<Category> | Partial<SubCategory>
  type: 'category' | 'subcategory'
  title?: string
  categoryId?: string
}

export function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  type,
  title,
  categoryId,
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      if (type === 'subcategory' && categoryId) {
        onSubmit({ ...formData, categoryId })
      } else {
        onSubmit(formData)
      }
      setFormData({ name: '' })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {title || (type === 'category' ? 'New Category' : 'New Sub-Category')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {type === 'category' ? 'Category Name' : 'Sub-Category Name'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder={type === 'category' ? 'e.g., Technical Skills' : 'e.g., HVAC Systems'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
