import { useEffect, useState } from "react"
import { SelectItemsFromJobModal } from "./SelectItemsFromJobModal"
import { CreateVendorModal } from "./CreateVendorModal"
import type { PurchaseOrder, Vendor } from "../../../types/vendor"
import { Plus } from "lucide-react"

export interface Item {
  id: number
  name: string
  quantity: number
  cost: number
}

interface PurchaseOrderFormModalProps {
  isOpen: boolean
  mode: "create" | "edit"
  initialPO?: PurchaseOrder
  onClose: () => void
  jobItems: Item[]
}

export function PurchaseOrderFormModal({
  isOpen,
  mode,
  initialPO,
  onClose,
  jobItems,
}: PurchaseOrderFormModalProps) {

  /* -------------------- ALL HOOKS FIRST -------------------- */

  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [vendorOpenForm, setVendorOpenForm] = useState(false)

  const [selectedPOItems, setSelectedPOItems] = useState<Item[]>([])
  const [selectedVendorId, setSelectedVendorId] = useState("")
  const [orderDate, setOrderDate] = useState("")

  /* -------------------- PREFILL (EDIT MODE) -------------------- */

  useEffect(() => {
    if (!isOpen) return

    if (mode === "edit" && initialPO) {
      setSelectedVendorId(initialPO.vendorId)
      setOrderDate(initialPO.orderDate)
      setSelectedPOItems(initialPO.items)
    }

    if (mode === "create") {
      setSelectedVendorId("")
      setOrderDate("")
      setSelectedPOItems([])
    }
  }, [isOpen, mode, initialPO])

  /* -------------------- CONDITIONAL RENDER -------------------- */

  if (!isOpen) return null

  const availableItems = jobItems.filter(
    jobItem =>
      !selectedPOItems.some(
        selectedItem => selectedItem.id === jobItem.id
      )
  )

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-6xl p-6 shadow-xl min-h-[80vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {mode === "create" ? "Create purchase order" : "Edit purchase order"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* VENDOR + DATE */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <select
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
              value={selectedVendorId}
              onChange={e => setSelectedVendorId(e.target.value)}
            >
              <option value="">Select vendor</option>

              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>



          </div>

          <button
            type="button"
            onClick={() => setVendorOpenForm(true)}
            className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            + Create vendor
          </button>

           <button
            onClick={() => setIsItemSelectorOpen(true)}
            className="px-4 py-2 border rounded-md text-sm font-semibold"
          >
            Select from job
          </button>

         
        </div>

        {/* ADD ITEMS */}
        <div className="flex gap-3 mb-4">
          <select
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            onChange={e => {
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
           <input
            type="date"
            value={orderDate}
            onChange={e => setOrderDate(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary"
          />
         
        </div>

        {/* ITEMS TABLE */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-center">Cost</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedPOItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
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

        {/* FOOTER */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Cancel
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold">
            Save PO
          </button>
        </div>

        {/* MODALS */}
        <SelectItemsFromJobModal
          isOpen={isItemSelectorOpen}
          jobItems={jobItems}
          selectedPOItems={selectedPOItems}
          onClose={() => setIsItemSelectorOpen(false)}
          onChange={setSelectedPOItems}
        />

        <CreateVendorModal
          open={vendorOpenForm}
          onClose={() => setVendorOpenForm(false)}
          onSave={vendor => {
            setVendors(prev => [...prev, vendor])
            setSelectedVendorId(vendor.id)
          }}
        />
      </div>
    </div>
  )
}
