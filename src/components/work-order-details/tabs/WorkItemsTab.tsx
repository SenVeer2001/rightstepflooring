// WorkItemsTab.tsx
"use client"

import { useState } from "react"
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit2, 
  Search,
  X,
  Check,
  DollarSign,
  Hash,
  MoreVertical,
  ShoppingCart,
  AlertCircle,
  Wrench,
  Box,
} from "lucide-react"

type ItemType = "product" | "service"

interface Item {
  id: number
  name: string
  image?: string
  quantity: number
  cost: number
  color?: string
  type: ItemType
}

const defaultItems: Item[] = [
  {
    id: 1,
    name: "Tile Installation",
    image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
    quantity: 320,
    cost: 1.85,
    color: "#DADADA",
    type: "service",
  },
  {
    id: 2,
    name: "Labor",
    image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
    quantity: 8,
    cost: 60,
    color: "#30364F",
    type: "service",
  },
  {
    id: 3,
    name: "Premium Ceramic Tiles",
    image: "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg",
    quantity: 150,
    cost: 2.5,
    color: "#F2F2F2",
    type: "product",
  },
  {
    id: 4,
    name: "Grout & Adhesive",
    image: "https://images.pexels.com/photos/5691620/pexels-photo-5691620.jpeg",
    quantity: 20,
    cost: 15,
    color: "#BF4646",
    type: "product",
  },
]

export default function WorkItemsTab() {
  const [items, setItems] = useState<Item[]>(defaultItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | ItemType>("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showMobileActions, setShowMobileActions] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    type: "product" as ItemType,
    quantity: 1,
    cost: 0,
    color: "#DADADA"
  })

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    return matchesSearch && matchesType
  })

  // Calculate totals
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
  const productCount = items.filter(i => i.type === "product").length
  const serviceCount = items.filter(i => i.type === "service").length
  const totalProducts = items.filter(i => i.type === "product").reduce((sum, item) => sum + (item.quantity * item.cost), 0)
  const totalServices = items.filter(i => i.type === "service").reduce((sum, item) => sum + (item.quantity * item.cost), 0)

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      type: "product",
      quantity: 1,
      cost: 0,
      color: "#DADADA"
    })
    setEditingItem(null)
  }

  // Open add modal
  const openAddModal = (type?: ItemType) => {
    resetForm()
    if (type) {
      setFormData(prev => ({
        ...prev,
        type,
      }))
    }
    setShowAddModal(true)
  }

  // Open edit modal
  const openEditModal = (item: Item) => {
    setFormData({
      name: item.name,
      image: item.image || "",
      type: item.type,
      quantity: item.quantity,
      cost: item.cost,
      color: item.color || "#DADADA"
    })
    setEditingItem(item)
    setShowAddModal(true)
  }

  // Handle type change in form
  const handleTypeChange = (type: ItemType) => {
    setFormData(prev => ({
      ...prev,
      type,
    }))
  }

  // Handle form submit
  const handleSubmit = () => {
    if (!formData.name.trim()) return

    if (editingItem) {
      setItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              name: formData.name,
              image: formData.image,
              type: formData.type,
              quantity: formData.quantity,
              cost: formData.cost,
              color: formData.color
            }
          : item
      ))
    } else {
      const newItem: Item = {
        id: Date.now(),
        name: formData.name,
        image: formData.image,
        type: formData.type,
        quantity: formData.quantity,
        cost: formData.cost,
        color: formData.color
      }
      setItems(prev => [...prev, newItem])
    }

    setShowAddModal(false)
    resetForm()
  }

  // Handle delete
  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
    setShowDeleteModal(null)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="text-primary" size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-gray-900">Items</h2>
              <p className="text-sm text-gray-500">
                {productCount} products • {serviceCount} services
              </p>
            </div>
          </div>
          
         
        </div>

        {/* Search & Type Filter */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            {/* <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex gap-2">
            {[
              { id: "all" as const, label: "All", icon: Package, count: items.length },
              { id: "product" as const, label: "Products", icon: Box, count: productCount },
              { id: "service" as const, label: "Services", icon: Wrench, count: serviceCount },
            ].map(type => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${selectedType === type.id 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{type.label}</span>
                  <span className="text-xs opacity-70">({type.count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

   

      {/* ITEMS LIST */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const itemTotal = item.quantity * item.cost
            
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Item Image */}
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: item.color || '#f3f4f6' }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "product" ? (
                      <Box size={24} className="text-gray-400" />
                    ) : (
                      <Wrench size={24} className="text-gray-400" />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full
                            ${item.type === "product" 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {item.type === "product" ? "Product" : "Service"}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Actions */}
                      <div className="hidden sm:flex items-center gap-1">
                        {/* <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button> */}
                        <button
                          onClick={() => setShowDeleteModal(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Mobile Actions */}
                      <div className="sm:hidden relative">
                        <button
                          onClick={() => setShowMobileActions(showMobileActions === item.id ? null : item.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>

                        {showMobileActions === item.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowMobileActions(null)} 
                            />
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border py-2 z-20 min-w-[140px]">
                              <button 
                                onClick={() => { openEditModal(item); setShowMobileActions(null) }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Edit2 size={16} />
                                Edit
                              </button>
                              <button 
                                onClick={() => { setShowDeleteModal(item.id); setShowMobileActions(null) }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                   

                    {/* Item Meta */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                        <Hash size={12} />
                        Qty: {item.quantity}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-lg">
                       
                        {formatCurrency(item.cost)} each
                      </span>
                       <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text- text-[11px]  font-medium rounded-lg border border-green-200">
  <Check size={12} />
  Item reached at warehouse
</span>
                    </div>
                  </div>

                  {/* Total Price - Desktop */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(itemTotal)}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>

                {/* Mobile Total */}
                <div className="sm:hidden mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-base font-bold text-gray-900">{formatCurrency(itemTotal)}</span>
                </div>
              </div>
            )
          })
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="text-gray-400" size={28} />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No items found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || selectedType !== "all"
                ? "Try adjusting your search or filters" 
                : "Add products or services to this work order"
              }
            </p>
            {!searchQuery && selectedType === "all" && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => openAddModal("product")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100"
                >
                  <Box size={16} />
                  Add Product
                </button>
                <button
                  onClick={() => openAddModal("service")}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100"
                >
                  <Wrench size={16} />
                  Add Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => { setShowAddModal(false); resetForm() }}
        >
          <div 
            className="bg-white w-full sm:rounded-xl sm:max-w-lg rounded-t-xl shadow-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-base font-semibold text-gray-900">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); resetForm() }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("product")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${formData.type === "product" 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                  >
                    <Box size={20} />
                    <span className="font-medium">Product</span>
                    {formData.type === "product" && (
                      <Check size={16} className="ml-1" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("service")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                      ${formData.type === "service" 
                        ? 'border-purple-500 bg-purple-50 text-purple-700' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                  >
                    <Wrench size={20} />
                    <span className="font-medium">Service</span>
                    {formData.type === "service" && (
                      <Check size={16} className="ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {formData.type === "product" ? "Product Name" : "Service Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={formData.type === "product" ? "Enter product name" : "Enter service name"}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Quantity & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {formData.type === "product" ? "Unit Cost" : "Rate"}
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded-lg border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Total Preview */}
              <div className={`rounded-xl p-4 ${formData.type === "product" ? 'bg-blue-50' : 'bg-purple-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {formData.type === "product" ? (
                      <Box size={18} className="text-blue-600" />
                    ) : (
                      <Wrench size={18} className="text-purple-600" />
                    )}
                    <span className={`text-sm font-medium ${formData.type === "product" ? 'text-blue-700' : 'text-purple-700'}`}>
                      Total Amount
                    </span>
                  </div>
                  <span className={`text-xl font-bold ${formData.type === "product" ? 'text-blue-700' : 'text-purple-700'}`}>
                    {formatCurrency(formData.quantity * formData.cost)}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${formData.type === "product" ? 'text-blue-600' : 'text-purple-600'}`}>
                  {formData.quantity} × {formatCurrency(formData.cost)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 sm:rounded-b-xl flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => { setShowAddModal(false); resetForm() }}
                className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.name.trim()}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  ${formData.type === "product" 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {editingItem ? "Save Changes" : `Add ${formData.type === "product" ? "Product" : "Service"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal !== null && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Item?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}