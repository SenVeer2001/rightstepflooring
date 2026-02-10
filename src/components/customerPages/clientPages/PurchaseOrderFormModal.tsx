import { useState } from "react"
import { SelectItemsFromJobModal } from "./SelectItemsFromJobModal"

export interface Item {
  id: number
  name: string
  quantity: number
  cost: number
}

export interface PurchaseOrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  jobItems: Item[]
}

export function PurchaseOrderFormModal({
  isOpen,
  onClose,
  jobItems,
}: PurchaseOrderFormModalProps) {
  const [selectedPOItems, setSelectedPOItems] = useState<Item[]>([])
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false)

  if (!isOpen) return null

  const availableItems = jobItems.filter(
    jobItem =>
      !selectedPOItems.some(
        selectedItem => selectedItem.id === jobItem.id
      )
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
      <div className="bg-white rounded-xl w-full max-w-6xl p-6 shadow-xl relative min-h-[80vh]">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Create purchase order</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Vendor + Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>Select vendor</option>
          </select>
          <input type="date" className="border rounded-md px-3 py-2 text-sm" />
        </div>

        {/* ADD ITEMS DROPDOWN */}
        <div className="flex gap-3 mb-4">
          <select
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            onChange={(e) => {
              const itemId = Number(e.target.value)
              const item = jobItems.find(i => i.id === itemId)
              if (!item) return
              setSelectedPOItems(prev => [...prev, item])
            }}
          >
            <option value="">Add items</option>
            {availableItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsItemSelectorOpen(true)}
            className="px-4 py-2 border rounded-md text-sm font-semibold"
          >
            Select from job
          </button>
        </div>

        {/* PO ITEMS TABLE */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Item Name</th>
                <th className="px-4 py-2 text-center">Cost</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedPOItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No items added
                  </td>
                </tr>
              ) : (
                selectedPOItems.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2 text-center">${item.cost}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          setSelectedPOItems(prev =>
                            prev.filter(i => i.id !== item.id)
                          )
                        }
                        className="text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-full font-semibold">
            Save PO
          </button>
        </div>

        {/* RIGHT SIDE POPUP */}
        <SelectItemsFromJobModal
          isOpen={isItemSelectorOpen}
          jobItems={jobItems}
          selectedPOItems={selectedPOItems}
          onClose={() => setIsItemSelectorOpen(false)}
          onChange={setSelectedPOItems}
        />
      </div>
    </div>
  )
}
