import { X } from "lucide-react"
import { useState } from "react"
import type { PriceBookItem } from "./types"

interface Props {
  isOpen: boolean
  item: PriceBookItem
  onClose: () => void
  onSave: (item: any) => void
}

export function ItemDetailsModal({
  isOpen,
  item,
  onClose,
  onSave,
}: Props) {
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(item.price || 0)
  const [cost, setCost] = useState(item.cost || 0)
  const [itemType, setItemType] = useState("service")
  const [description, setDescription] = useState("")
  const [taxable, setTaxable] = useState(false)
  const [optional, setOptional] = useState(false)

  const markup =
    cost > 0 ? (((price - cost) / cost) * 100).toFixed(1) : "0"

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Job Item
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* ITEM NAME */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Item Name
            </label>
            <input
              value={item.name}
              disabled
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-gray-100 text-gray-700"
            />
          </div>

          {/* PRICING GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

            <Field
              label="Quantity"
              value={quantity}
              onChange={setQuantity}
              type="number"
            />

            <Field
              label="Price"
              value={price}
              onChange={setPrice}
              type="number"
              prefix="$"
            />

            <Field
              label="Cost"
              value={cost}
              onChange={setCost}
              type="number"
              prefix="$"
            />

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Markup %
              </label>
              <input
                disabled
                value={markup}
                className="w-full border rounded-lg px-4 py-2.5 text-sm bg-gray-100"
              />
            </div>
          </div>

          {/* ITEM TYPE */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Item Type
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-primary"
            >
              <option value="service">Service</option>
              <option value="material">Material</option>
              <option value="labor">Labor</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Item Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the work, materials, or notes..."
              className="w-full border rounded-lg px-4 py-3 text-sm bg-gray-50 focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* OPTIONS */}
          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={taxable}
                onChange={(e) => setTaxable(e.target.checked)}
                className="accent-primary"
              />
              Taxable item
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={optional}
                onChange={(e) => setOptional(e.target.checked)}
                className="accent-primary"
              />
              Optional item
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            // onClick={() =>
            //   onSave({
            //     ...item,
            //     quantity,
            //     price,
            //     cost,
            //     description,
            //     itemType,
            //     taxable,
            //     optional,
            //   })
            // }
            onClick={onClose}
            className="px-6 py-2 bg-primary hover:bg-[#2c621b] text-white rounded-lg text-sm font-semibold"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= SMALL FIELD COMPONENT ================= */

function Field({
  label,
  value,
  onChange,
  type = "text",
  prefix,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  type?: string
  prefix?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full border rounded-lg px-4 ml-2 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-primary
            ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  )
}
