"use client"

import { useEffect, useState } from "react"
import { X, Upload, Trash2 } from "lucide-react"
import CheckboxField from "../../ui/CheckboxField"
import Input from "../../ui/Input"

/* ---------------- TYPES ---------------- */

interface ItemModalProps {
  open: boolean
  mode: "create" | "edit"
  initialData?: any
  onClose: () => void
  onSave: (data: any) => void
  onDelete?: (id: string) => void
}

/* ---------------- COMPONENT ---------------- */

export default function ItemModal({
  open,
  mode,
  initialData,
  onClose,
  onSave,
  onDelete,
}: ItemModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    modelNumber: "",
    price: "",
    unitCost: "",
    category: "",
    itemType: "Service",
    description: "",
    taxable: true,
    bookingItem: false,
    addPriceToPriceBook: true,
  })

  const [customFields, setCustomFields] = useState<string[]>(["Color"])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [deletedFields, setDeletedFields] = useState<string[]>([])

  /* -------- PREFILL FOR EDIT -------- */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.name || "",
        modelNumber: initialData.model || "",
        price: String(initialData.price ?? ""),
        unitCost: String(initialData.cost ?? ""),
        category: initialData.category || "",
        itemType: initialData.type || "Service",
        description: initialData.description || "",
        taxable: initialData.taxable === "Yes",
        bookingItem: initialData.booking === "Yes",
        addPriceToPriceBook: true,
      })

      setImagePreview(initialData.image || null)
      setCustomFields(initialData.customFields || ["Color"])
      setDeletedFields([])
    }

    if (mode === "create") {
      setFormData({
        title: "",
        modelNumber: "",
        price: "",
        unitCost: "",
        category: "",
        itemType: "Service",
        description: "",
        taxable: true,
        bookingItem: false,
        addPriceToPriceBook: true,
      })
      setImagePreview(null)
      setCustomFields(["Color"])
      setDeletedFields([])
    }
  }, [mode, initialData])

  if (!open) return null

  /* ---------------- IMAGE ---------------- */

  const handleImageUpload = (file: File) => {
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  /* ---------------- CUSTOM FIELDS ---------------- */

  const addCustomField = () => {
    setCustomFields(prev => [...prev, ""])
  }

  const updateCustomField = (index: number, value: string) => {
    setCustomFields(prev => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  const removeCustomField = (index: number) => {
    setDeletedFields(prev => [...prev, customFields[index]])
    setCustomFields(prev => prev.filter((_, i) => i !== index))
  }

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    onSave({
      ...formData,
      customFields,
      imagePreview,
      id: initialData?.id,
    })
    onClose()
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg max-h-[80vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Add New Item" : "Edit Item"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-4">

            {/* IMAGE */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Item Image
              </label>

              <div className="relative group min-w-[200px]">
                <label className="h-40 w-full border-2 border-primary border-dashed rounded-xl flex items-center justify-center
                                 cursor-pointer overflow-hidden hover:bg-primary/10 transition">
                  {imagePreview ? (
                    <img src={imagePreview} className="h-full w-full object-fill" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Upload size={20} />
                      <span className="text-xs mt-1">Upload image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                  />
                </label>

                {imagePreview && (
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-700
                               text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            
            <TextareaField
              label="Description"
              value={formData.description}
               // @ts-ignore
              onChange={value =>
                setFormData({ ...formData, description: value })
              }
            />

           
            <SelectField
              label="Item Type"
              value={formData.itemType}
               // @ts-ignore
              onChange={value =>
                setFormData({ ...formData, itemType: value })
              }
              options={["Service", "Product"]}
            />

            
            <div>
              <label className="text-sm font-semibold block mb-2">
                Custom Fields
              </label>

              {customFields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 mb-2 border rounded-lg px-2 py-2">
                  <input
                    value={field}
                    onChange={e => updateCustomField(index, e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none"
                  />
                  <button onClick={() => removeCustomField(index)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button onClick={addCustomField} className="text-sm text-primary font-semibold mt-2">
                + Add custom field
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-2">

            <Input label="Title" value={formData.title}
              onChange={v => setFormData({ ...formData, title: v })} />

            <Input label="#Model" value={formData.modelNumber}
              onChange={v => setFormData({ ...formData, modelNumber: v })} />

            <Input label="Price" type="number" value={formData.price}
              onChange={v => setFormData({ ...formData, price: v })} />

            <Input label="Unit Cost" type="number" value={formData.unitCost}
              onChange={v => setFormData({ ...formData, unitCost: v })} />

            <div className="flex items-center gap-3 border rounded-lg px-3 py-2.5">
              <span className="text-sm text-gray-600">Choose category (optional)</span>
              <button className="ml-auto text-primary text-sm font-semibold">Browse</button>
            </div>

            <div className="pt-2 space-y-3">
              <CheckboxField id="taxable" label="Taxable item"
                checked={formData.taxable}
                onChange={v => setFormData({ ...formData, taxable: v })} />

              <CheckboxField id="bookingItem" label="Add to booking items"
                checked={formData.bookingItem}
                onChange={v => setFormData({ ...formData, bookingItem: v })} />

              <CheckboxField id="addPriceToPriceBook" label="Show item in price book"
                checked={formData.addPriceToPriceBook}
                onChange={v => setFormData({ ...formData, addPriceToPriceBook: v })} />
            </div>

            {/* DELETED FIELDS */}
            {deletedFields.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500">Deleted fields</p>
                {deletedFields.map((field, index) => (
                  <div key={index}
                    className="flex justify-between bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-sm">
                    <span className="text-red-600">{field}</span>
                    <button
                      onClick={() => {
                        setCustomFields(prev => [...prev, field])
                        setDeletedFields(prev => prev.filter((_, i) => i !== index))
                      }}
                      className="text-xs text-primary font-semibold">
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between px-6 py-4 border-t bg-gray-50">
          {mode === "edit" && onDelete && initialData && (
            <button
              onClick={() => onDelete(initialData.id)}
              className="px-5 py-2 rounded-full border border-red-500
                         text-sm font-semibold text-red-600 hover:bg-red-50">
              Delete Item
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            <button onClick={onClose}
              className="px-5 py-2 rounded-full border border-gray-600 text-sm font-semibold text-gray-700">
              Cancel
            </button>
            <button onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold">
              {mode === "create" ? "Save Item" : "Update Item"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}




function SelectField({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm">
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}

function TextareaField({ label, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <textarea rows={4} value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm resize-none max-h-32 overflow-y-auto" />
    </div>
  )
}
