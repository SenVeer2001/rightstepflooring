import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import type { Category, SubCategory } from '../mockData'
import { mockCategories } from '../mockData'
import { CategoryModal } from '../components/CategoryModal'

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    mockCategories[0] || null
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'category' | 'subcategory'>('category')
  const [editingItem, setEditingItem] = useState<Partial<Category> | Partial<SubCategory> | null>(null)

  const handleAddCategory = () => {
    setModalType('category')
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setModalType('category')
    setEditingItem(category)
    setModalOpen(true)
  }

  const handleAddSubcategory = () => {
    if (!selectedCategory) return
    setModalType('subcategory')
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEditSubcategory = (subcategory: SubCategory) => {
    setModalType('subcategory')
    setEditingItem(subcategory)
    setModalOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId))
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(categories[0] || null)
    }
  }

  const handleDeleteSubcategory = (subcategoryId: string) => {
    if (!selectedCategory) return
    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub.id !== subcategoryId
              ),
            }
          : cat
      )
    )
    setSelectedCategory((prev) =>
      prev
        ? {
            ...prev,
            subcategories: prev.subcategories.filter(
              (sub) => sub.id !== subcategoryId
            ),
          }
        : null
    )
  }

  const handleModalSubmit = (data: Partial<Category> | Partial<SubCategory>) => {
    if (modalType === 'category') {
      if (editingItem && 'id' in editingItem) {
        setCategories(
          categories.map((c) =>
            c.id === editingItem.id ? { ...c, ...data } : c
          )
        )
      } else {
        const newCategory: Category = {
          id: `cat-${Date.now()}`,
          name: data.name || '',
          subcategories: [],
        }
        setCategories([...categories, newCategory])
        setSelectedCategory(newCategory)
      }
    } else if (modalType === 'subcategory' && selectedCategory) {
      if (editingItem && 'id' in editingItem) {
        setSelectedCategory((prev) =>
          prev
            ? {
                ...prev,
                subcategories: prev.subcategories.map((sub) =>
                  sub.id === editingItem.id ? { ...sub, ...data } : sub
                ),
              }
            : null
        )
        setCategories(
          categories.map((cat) =>
            cat.id === selectedCategory.id
              ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.id === editingItem.id ? { ...sub, ...data } : sub
                  ),
                }
              : cat
          )
        )
      } else {
        const newSubcategory: SubCategory = {
          id: `subcat-${Date.now()}`,
          name: data.name || '',
          categoryId: selectedCategory.id,
        }
        setSelectedCategory((prev) =>
          prev
            ? {
                ...prev,
                subcategories: [...prev.subcategories, newSubcategory],
              }
            : null
        )
        setCategories(
          categories.map((cat) =>
            cat.id === selectedCategory.id
              ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
              : cat
          )
        )
      }
    }
  }

  return (
    <div className="space-y-6 min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 text-sm mt-1">Manage training categories and subcategories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Categories */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Categories</h2>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary hover:bg-[#2c621b] text-white rounded-lg transition-colors font-semibold"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {categories.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-all border-l-4 group ${
                      selectedCategory?.id === category.id
                        ? 'border-primary bg-blue-50'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {category.subcategories.length} subcategories
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCategory(category)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCategory(category.id)
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-500 font-semibold">
                No categories yet
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Subcategories */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory.name} Subcategories` : 'Subcategories'}
            </h2>
            <button
              onClick={handleAddSubcategory}
              disabled={!selectedCategory}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors font-semibold ${
                selectedCategory
                  ? 'bg-primary hover:bg-[#2c621b] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {selectedCategory && selectedCategory.subcategories.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {selectedCategory.subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="px-6 py-4 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{subcategory.name}</p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditSubcategory(subcategory)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-500 font-semibold">
                {selectedCategory ? 'No subcategories' : 'Select a category'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={modalOpen}
        type={modalType}
        initialData={editingItem || undefined}
        onClose={() => {
          setModalOpen(false)
          setEditingItem(null)
        }}
        onSubmit={(data) => {
          handleModalSubmit(data)
          setModalOpen(false)
          setEditingItem(null)
        }}
      />
    </div>
  )
}
