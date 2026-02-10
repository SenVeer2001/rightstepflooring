import { useState } from "react"

interface PurchaseOrderChoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: (mode: "create" | "edit") => void
}

export function PurchaseOrderChoiceModal({
  isOpen,
  onClose,
  onContinue,
}: PurchaseOrderChoiceModalProps) {
  const [selected, setSelected] = useState<"create" | "edit">("create")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Add to purchase order
        </h2>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={selected === "create"}
              onChange={() => setSelected("create")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Create new PO</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={selected === "edit"}
              onChange={() => setSelected("edit")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Edit existing PO</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onContinue(selected)}
            className="px-5 py-2 bg-primary text-sm  text-white font-semibold rounded-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
