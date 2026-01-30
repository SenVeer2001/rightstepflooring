"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface BrandModalProps {
  open: boolean
  mode: "create" | "edit"
  initialData?: any
  onClose: () => void
  onSave: (data: any) => void
}

export default function BrandModal({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: BrandModalProps) {
  const [brandName, setBrandName] = useState("")
  const [description, setDescription] = useState("")

  /* ============ PREFILL ============ */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setBrandName(initialData.name || "")
      setDescription(initialData.description || "")
    }

    if (mode === "create") {
      setBrandName("")
      setDescription("")
    }
  }, [mode, initialData])

  if (!open) return null

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      name: brandName,
      description,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Create new brand" : "Edit brand"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <input
            placeholder="Brand name"
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm
                       focus:ring-2 focus:ring-primary outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none
                       focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold"
          >
            {mode === "create" ? "Save" : "Update"}
          </button>
        </div>

      </div>
    </div>
  )
}
