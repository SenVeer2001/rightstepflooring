import { X } from "lucide-react"
import { useEffect, useState } from "react"
import type { PriceBookItem } from "./types"

interface Props {
  isOpen: boolean
  initialName: string
  onCancel: () => void
  onSave: (item: PriceBookItem) => void
}

export function CreateItemModal({
  isOpen,
  initialName,
  onCancel,
  onSave,
}: Props) {
  const [itemName, setItemName] = useState("")

  // ✅ SYNC initial name when modal opens or value changes
  useEffect(() => {
    if (isOpen) {
      setItemName(initialName)
    }
  }, [initialName, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-sm font-semibold">Create new item</h2>
          <button onClick={onCancel}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Item name
            </label>
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              className="w-full border rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onCancel}
            className="px-6 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                id: Date.now().toString(),
                name: itemName,
                price: 0,
                cost: 0,
              })
            }
            disabled={!itemName.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg
                       text-sm font-semibold disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
