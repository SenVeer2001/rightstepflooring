import type { Item } from "./PurchaseOrderFormModal"

interface SelectItemsFromJobModalProps {
  isOpen: boolean
  onClose: () => void
  jobItems: Item[]
  selectedPOItems: Item[]
  onChange: (items: Item[]) => void
}

export function SelectItemsFromJobModal({
  isOpen,
  onClose,
  jobItems,
  selectedPOItems,
  onChange,
}: SelectItemsFromJobModalProps) {
  if (!isOpen) return null

  return (
    <div className="absolute top-[62px] right-20 h-[82%] w-[380px]  bg-white border-l shadow-xl p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Select items from this job</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Job contains line items. Select the ones you want to include.
      </p>

      <div className="space-y-3 overflow-y-auto max-h-[80vh]">
        {jobItems.map(item => {
          const isSelected = selectedPOItems.some(
            selected => selected.id === item.id
          )

          return (
            <label
              key={item.id}
              className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedPOItems, item])
                  } else {
                    onChange(
                      selectedPOItems.filter(i => i.id !== item.id)
                    )
                  }
                }}
                className="mt-1 accent-primary"
              />

              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Cost: ${item.cost} | Qty: {item.quantity}
                </p>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
