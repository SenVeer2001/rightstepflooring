import { useEffect, useMemo, useState } from "react"
import { X, ArrowLeft, Plus, Minus } from "lucide-react"

/* ================= TYPES ================= */

interface PriceBookItem {
  id: string
  name: string
  price: number
  image: string
}

interface PriceBookCategory {
  id: string
  name: string
  image: string
  items: PriceBookItem[]
}

interface PriceBookModalProps {
  isOpen: boolean
  onClose: () => void
  onAddToEstimate: (item: PriceBookItem, quantity: number) => void
  data?: PriceBookCategory[]
}

/* ================= COMPONENT ================= */

export function PriceBookModal({
  isOpen,
  onClose,
  onAddToEstimate,
  data,
}: PriceBookModalProps) {
  /* ---------- STATE ---------- */

  const [activeView, setActiveView] =
    useState<"categories" | "items">("categories")

  const [selectedCategory, setSelectedCategory] =
    useState<PriceBookCategory | null>(null)

  const [selectedItem, setSelectedItem] =
    useState<PriceBookItem | null>(null)

  const [quantities, setQuantities] =
    useState<Record<string, number>>({})

  const [searchText, setSearchText] = useState("")

  /* ---------- RESET ON CLOSE ---------- */

  useEffect(() => {
    if (!isOpen) {
      setActiveView("categories")
      setSelectedCategory(null)
      setSelectedItem(null)
      setQuantities({})
      setSearchText("")
    }
  }, [isOpen])

  /* ---------- MEMO ---------- */

  const filteredCategories = useMemo(() => {
     // @ts-ignore
    return data.filter((category) =>
      category.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [data, searchText])

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return []
    return selectedCategory.items.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [selectedCategory, searchText])

  /* ---------- HANDLERS ---------- */

  const openCategory = (category: PriceBookCategory) => {
    setSelectedCategory(category)
    setActiveView("items")
    setSelectedItem(null)
  }

  const goBack = () => {
    setActiveView("categories")
    setSelectedCategory(null)
    setSelectedItem(null)
  }

  const changeQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }))
  }

  const handleAdd = () => {
    if (!selectedItem) return
    const quantity = quantities[selectedItem.id] || 1
    onAddToEstimate(selectedItem, quantity)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!isOpen) return null

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg overflow-hidden flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            {activeView === "items" && (
              <button
                onClick={goBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-semibold">
              {activeView === "categories"
                ? "Price Book"
                : selectedCategory?.name}
            </h2>
          </div>

          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="px-6 py-3 border-b">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              activeView === "categories"
                ? "Search categories"
                : "Search items"
            }
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 flex-1 overflow-y-auto">

          {/* -------- CATEGORIES -------- */}
          {activeView === "categories" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => openCategory(category)}
                  className="bg-gray-50 hover:bg-gray-100 rounded-xl overflow-hidden text-left"
                >
                  <img
                    src={category.image}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-sm">{category.name}</p>
                    <p className="text-xs text-gray-500">
                      {category.items.length} items
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* -------- ITEMS -------- */}
          {activeView === "items" && selectedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const quantity = quantities[item.id] || 1
                const isSelected = selectedItem?.id === item.id

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`border rounded-xl overflow-hidden cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={item.image}
                      className="h-36 w-full object-cover"
                    />

                    <div className="p-4 space-y-3">
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity per item */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            changeQuantity(item.id, -1)
                          }}
                          className="p-1 border rounded"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-6 text-center font-semibold">
                          {quantity}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            changeQuantity(item.id, 1)
                          }}
                          className="p-1 border rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        {activeView === "items" && (
          <div className="border-t px-6 py-4 flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCancel}
              // disabled={!selectedItem}
              className="px-5 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
