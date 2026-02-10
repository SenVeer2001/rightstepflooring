import { useState } from "react"

interface PurchaseOrderChoiceModalProps {
  isOpen: boolean
  onClose: () => void
  existingPOs: { id: string; name: string }[]
  onContinue: (data: {
    mode: "create" | "edit"
    poId?: string
  }) => void
}

export function PurchaseOrderChoiceModal({
  isOpen,
  onClose,
  existingPOs,
  onContinue,
}: PurchaseOrderChoiceModalProps) {
  const [mode, setMode] = useState<"create" | "edit">("create")
  const [selectedPOId, setSelectedPOId] = useState("")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        <h2 className="text-lg font-bold mb-4">
          Add to purchase order
        </h2>

        <div className="space-y-4">

          {/* CREATE */}
          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={mode === "create"}
              onChange={() => setMode("create")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Create new PO</span>
          </label>

          {/* EDIT */}
          <label className="flex items-center gap-3">
            <input
              type="radio"
              checked={mode === "edit"}
              onChange={() => setMode("edit")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Edit existing PO</span>
          </label>

          {/* 👇 DROPDOWN ONLY FOR EDIT */}
          {mode === "edit" && (
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={selectedPOId}
              onChange={e => setSelectedPOId(e.target.value)}
            >
              <option value="">Select purchase order</option>
              {existingPOs.map(po => (
                <option key={po.id} value={po.id}>
                  {po.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            disabled={mode === "edit" && !selectedPOId}
            onClick={() =>
              onContinue({
                mode,
                poId: selectedPOId || undefined,
              })
            }
            className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
