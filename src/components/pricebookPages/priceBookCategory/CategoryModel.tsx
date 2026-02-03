"use client"

import { useEffect, useState } from "react"
import { X, Upload } from "lucide-react"

interface CategoryModalProps {
  open: boolean
  mode: "create" | "edit"
  initialData?: any
  onClose: () => void
  onSave: (data: any) => void
}

export default function CategoryModal({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    parentCategory: "",
    description: "",
  })

  /* ================= PREFILL FOR EDIT ================= */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        parentCategory: initialData.Parent_category || "",
        description: initialData.description || "",
      })
      setEnabled(initialData.status !== "inactive")
      setImagePreview(initialData.image || null)
    }

    if (mode === "create") {
      setFormData({
        name: "",
        parentCategory: "",
        description: "",
      })
      setEnabled(true)
      setImagePreview(null)
    }
  }, [mode, initialData])

  if (!open) return null

  /* ================= IMAGE ================= */

  const handleImageUpload = (file: File) => {
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  /* ================= SAVE ================= */

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      ...formData,
      status: enabled ? "active" : "inactive",
      image: imagePreview,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Create new category" : "Edit category"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* IMAGE */}
            <div className="md:col-span-3">
              <label className="text-sm font-medium mb-2 block">
                Upload Image
              </label>

              <div className="relative group">
                <label className="h-28 w-full border-2 border-dashed border-primary
                                  rounded-xl flex items-center justify-center
                                  cursor-pointer overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="text-gray-400" />
                  )}

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      e.target.files && handleImageUpload(e.target.files[0])
                    }
                  />
                </label>

                {imagePreview && (
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500
                               text-white rounded-full p-1
                               opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* FORM */}
            <div className="md:col-span-9 space-y-4">

              <input
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Category name"
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
                <span className="text-sm text-gray-600">
                  {formData.parentCategory || "Choose parent category (optional)"}
                </span>
                <button className="ml-auto text-primary text-sm font-semibold">
                  Browse
                </button>
              </div>

            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            value={formData.description}
            onChange={e =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Category description (optional)"
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
          />

          {/* ENABLE */}
          <div className="flex gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
            />
            <div>
              <p className="text-sm font-medium">Enable category</p>
              <p className="text-xs text-gray-500">
                Disabling will also disable all subcategories and items
              </p>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-full text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm"
          >
            {mode === "create" ? "Save" : "Update"}
          </button>
        </div>

      </div>
    </div>
  )
}
