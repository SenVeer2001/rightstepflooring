import { useEffect, useState } from "react"
import { X, Upload, Trash2 } from "lucide-react"
import CheckboxField from "../../ui/CheckboxField"
import Select from "react-select"

/* ================= TYPES ================= */

interface ItemGroupModalProps {
  open: boolean
  mode: "create" | "edit"
  initialData?: any
  onClose: () => void
  onSave: (data: any) => void
}

interface SelectableItem {
  id: string
  name: string
  price: number
  cost: number
}

/* ================= MOCK ITEMS ================= */

const AVAILABLE_ITEMS: SelectableItem[] = [
  { id: "1", name: "Measurement & Estimate", price: 0, cost: 0 },
  { id: "2", name: "Hardwood Install", price: 3.5, cost: 1.7 },
  { id: "3", name: "Floor Removal", price: 2.2, cost: 1.1 },
]

const itemSelectOptions = AVAILABLE_ITEMS.map(item => ({
  value: item.id,
  label: item.name,
}))

/* ================= COMPONENT ================= */

export default function ItemGroupModal({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: ItemGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [groupType, setGroupType] = useState("Individual items")
  const [description, setDescription] = useState("")
  const [enabled, setEnabled] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [groupItems, setGroupItems] = useState<
    (SelectableItem & { quantity: number })[]
  >([])


  useEffect(() => {
    if (mode === "edit" && initialData) {
      setGroupName(initialData.name || "")
      setGroupType(initialData.groupType || "Individual items")
      setDescription(initialData.description || "")
      setEnabled(initialData.status !== "inactive")
      setImagePreview(initialData.image || null)

      if (Array.isArray(initialData.itemsData)) {
        setGroupItems(initialData.itemsData)
      }
    }

    if (mode === "create") {
      setGroupName("")
      setGroupType("Individual items")
      setDescription("")
      setEnabled(true)
      setImagePreview(null)
      setGroupItems([])
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

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg max-h-[85vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === "create" ? "Create item group" : "Edit item group"}
          </h2>

          <div className="flex items-center gap-4">
            <CheckboxField
              label="Enable"
              id="enable-item-group"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
            <button onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* TOP */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2">
                Upload Image
              </label>

              {/* IMAGE WRAPPER */}
              <div className="relative group">
                <label
                  className="h-32 w-full border-2 border-dashed border-primary
                 rounded-xl flex items-center justify-center
                 cursor-pointer overflow-hidden
                 hover:bg-primary/10 transition"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="text-gray-400" />
                  )}

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={event =>
                      event.target.files &&
                      handleImageUpload(event.target.files[0])
                    }
                  />
                </label>

                {/* REMOVE IMAGE BUTTON */}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2
                   bg-red-500 hover:bg-red-700
                   text-white rounded-full p-1
                   opacity-0 group-hover:opacity-100
                   transition"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>


            {/* FORM */}
            <div className="md:col-span-9 space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Item group name"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                {/* REACT SELECT */}
                <Select
                  isMulti
                  isSearchable
                  placeholder="Add items"
                  options={itemSelectOptions}
                  value={groupItems.map(item => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  onChange={selected => {
                    const selectedIds = selected?.map(o => o.value) || []

                    setGroupItems(prev =>
                      selectedIds.map(id => {
                        const existing = prev.find(i => i.id === id)
                        if (existing) return existing

                        const source = AVAILABLE_ITEMS.find(i => i.id === id)
                        return source ? { ...source, quantity: 1 } : null
                      }).filter(Boolean) as any
                    )
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={groupType}
                  onChange={e => setGroupType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option>Individual items</option>
                  <option>Grouped items</option>
                </select>

                <div className="flex items-center gap-3 border rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600">
                    Choose category (optional)
                  </span>
                  <button className="ml-auto text-primary text-sm font-semibold">
                    Browse
                  </button>
                </div>
              </div>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Item group description"
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {groupItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-gray-400">
                      No items added
                    </td>
                  </tr>
                )}

                {groupItems.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">${item.price}</td>
                    <td className="px-4 py-3">${item.cost}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e =>
                          setGroupItems(prev =>
                            prev.map(i =>
                              i.id === item.id
                                ? { ...i, quantity: Number(e.target.value) }
                                : i
                            )
                          )
                        }
                        className="max-w-20 border rounded px-2"
                      />
                    </td>
                    <td className="px-4 py-3">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setGroupItems(prev =>
                            prev.filter(i => i.id !== item.id)
                          )
                        }
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between px-6 py-4 border-t bg-gray-50">
          <span className="font-semibold">
            Total: $
            {groupItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0
            ).toFixed(2)}
          </span>

          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 border rounded-full">
              Cancel
            </button>
            <button
              onClick={() => {
                onSave({
                  id: initialData?.id,
                  name: groupName,
                  groupType,
                  description,
                  enabled,
                  image: imagePreview,
                  items: groupItems,
                })
                onClose()
              }}
              className="px-6 py-2 bg-primary text-white rounded-full"
            >
              {mode === "create" ? "Save" : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
