// PriceBookPopup.tsx
import { X, Plus, Minus, Pencil } from "lucide-react"
import { useState } from "react"
import type { Category, SubCategory, PriceBookItem } from "../../../types/priceBook"

interface Props {
  isOpen: boolean
  category: Category | null
  onClose: () => void
}

export function PriceBookPopup({ isOpen, category, onClose }: Props) {
  const [activeSub, setActiveSub] = useState<SubCategory | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  if (!isOpen || !category) return null

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }))
  }

  const total = Object.entries(quantities).reduce((sum, [id, qty]) => {
    const item = activeSub?.items.find(i => i.id === id)
    return item ? sum + item.price * qty : sum
  }, 0)

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            {activeSub && (
              <button
                onClick={() => setActiveSub(null)}
                className="text-sm text-primary"
              >
                ← Back
              </button>
            )}
            <h2 className="text-lg font-semibold">
              {activeSub ? activeSub.name : category.name}
            </h2>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* SUB-CATEGORIES */}
          {!activeSub && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {category.subCategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub)}
                  className="border rounded-xl p-2 hover:shadow transition"
                >
                  <img src={sub.image} className="h-[200px] w-full object-cover mb-3  rounded-lg" />
                  <p className="font-semibold text-sm">{sub.name}</p>
                  <p className="text-xs text-primary">
                    {sub.items.length} items
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* ITEMS */}
          {activeSub && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {activeSub.items.map(item => (
                <div key={item.id} className="border rounded-xl p-3 relative flex flex-col justify-between">
                  <div>
                    {item.stock === "out" && (
                      <span className="absolute top-2 left-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Out of stock
                      </span>
                    )}

                    <img
                      src={item.image}
                      className="h-30 w-full object-cover mb-3  rounded-lg"
                    />

                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                  </div>
                  {/* QTY */}
                  <div className="flex items-center justify-between mt-3 ">
                    <div className="flex items-center py-1 rounded-lg bg-primary/20 px-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-1.5 py-1.5 bg-primary rounded-full text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm">
                        {quantities[item.id] || 0}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-1.5 py-1.5 bg-primary rounded-full text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button className=" bg-primary text-white rounded-full px-2 py-2 ">
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {activeSub && (
          <div className="border-t px-6 py-4 flex justify-between items-center">
            <span className="font-semibold text-sm">
              Total: ${total.toFixed(2)}
            </span>
            <button 
            onClick={onClose}
            className="bg-primary text-white px-6 py-1.5 rounded-full font-semibold">
              Add 
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
