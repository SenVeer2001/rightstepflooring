import { X, Search } from "lucide-react"
import { useState } from "react"
import type { PriceBookItem } from "./types"

interface Props {
  isOpen: boolean
  items: PriceBookItem[]
  onClose: () => void
  onSelect: (item: PriceBookItem) => void
  onCreateNew: (name: string) => void
}

export function AddItemSearchModal({
  isOpen,
  items,
  onClose,
  onSelect,
  onCreateNew,
}: Props) {
  const [query, setQuery] = useState("")

  if (!isOpen) return null

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  const showCreate =
    query.trim().length > 0 &&
    !items.some(
      item => item.name.toLowerCase() === query.toLowerCase()
    )

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-900">
            Add Job Item
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search item name"
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
            />
          </div>
        </div>

        {/* RESULTS */}
        <div className="max-h-64 overflow-y-auto divide-y">
          {filteredItems.length > 0 &&
            filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full text-left px-5 py-3 text-sm
                  hover:bg-primary/10 focus:bg-primary/10
                  transition"
              >
                {item.name}
              </button>
            ))}

          {/* CREATE NEW */}
          {showCreate && (
            <button
              onClick={() => onCreateNew(query)}
              className="w-full text-left px-5 py-3 text-sm font-semibold
                bg-yellow-100 hover:bg-yellow-200 transition"
            >
              Create new reusable item
              <span className="ml-1 text-gray-800">
                “{query}”
              </span>
            </button>
          )}

          {/* EMPTY STATE */}
          {filteredItems.length === 0 && !showCreate && (
            <div className="px-5 py-6 text-sm text-gray-500 text-center">
              No items found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
