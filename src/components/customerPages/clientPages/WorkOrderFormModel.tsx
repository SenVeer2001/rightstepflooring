import { useEffect, useState } from "react"
import Select from "react-select"
import { SelectItemsFromJobModal } from "./SelectItemsFromJobModal"
import type { WorkOrder } from "../../../types/vendor"
import { teamMembers } from "../../../services/orderdata"

export interface Item {
  id: number
  name: string
  quantity: number
  cost: number
  image?: string
  color?: string
  type: string
}

interface WorkOrderFormModalProps {
  isOpen: boolean
  mode: "create" | "edit"
  initialWO?: WorkOrder
  onClose: () => void
  jobItems: Item[]
}

export function WorkOrderFormModal({
  isOpen,
  mode,
  initialWO,
  onClose,
  jobItems,
}: WorkOrderFormModalProps) {

  /* ---------------- HOOKS FIRST ---------------- */

  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [orderDate, setOrderDate] = useState("")
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any[]>([])

  /* ---------------- PREFILL EDIT ---------------- */

  useEffect(() => {
    if (!isOpen) return

    if (mode === "edit" && initialWO) {
      setOrderDate(initialWO.orderDate)
      setSelectedItems(initialWO.items)

      const preSelectedTeam = teamMembers
        .filter(member => initialWO.teamIds.includes(member.id))
        .map(member => ({
          value: member.id,
          label: member.name,
        }))

      setSelectedTeam(preSelectedTeam)
    }

    if (mode === "create") {
      setOrderDate("")
      setSelectedItems([])
      setSelectedTeam([])
    }

  }, [isOpen, mode, initialWO])

  if (!isOpen) return null

  const availableItems = jobItems.filter(
    jobItem =>
      !selectedItems.some(
        selectedItem => selectedItem.id === jobItem.id
      )
  )

  const teamOptions = teamMembers.map(member => ({
    value: member.id,
    label: member.name,
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-6xl p-6 shadow-xl min-h-[80vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {mode === "create" ? "Create work order" : "Edit work order"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* TEAM + DATE */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          <Select
            isMulti
            options={teamOptions}
            value={selectedTeam}
            onChange={(value) => setSelectedTeam(value as any)}
            placeholder="Select team members"
            className="text-sm"
          />

          <input
            type="date"
            value={orderDate}
            onChange={e => setOrderDate(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />

        </div>

        {/* ADD ITEMS */}
        <div className="flex gap-3 mb-4">
          <select
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            onChange={e => {
              const itemId = Number(e.target.value)
              const item = jobItems.find(i => i.id === itemId)
              if (!item) return
              setSelectedItems(prev => [...prev, item])
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
              {selectedItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No items added
                  </td>
                </tr>
              ) : (
                selectedItems.map(item => (
                  <tr key={item.id} className="border-t">
                     <td className="px-4 py-4 max-w-[300px]">
                      <div className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={70}
                            className="max-h-14 w-16 rounded-md object-cover"
                          />
                        )}
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          {/* <p className="text-xs text-gray-500 text-wrap">{item.description}</p> */}
                          <span
                            className={`py-1 rounded-full text-xs font-semibold ${item.type === "product"
                              ? " text-blue-700"
                              : " text-green-700"
                              }`}
                          >
                            {item.type === "product" ? "Product" : "Service"}
                          </span>
                        </div>
                      </div>

                    </td>
                    <td className="px-4 py-2 text-center">${item.cost}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                     <td className="px-4 py-2 text-center">
                      {item.color && (
                        <div
                          className="w-6 h-6 rounded border border-gray-300 mx-auto"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          setSelectedItems(prev =>
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
          <button className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold">
            Save Work Order
          </button>
        </div>

        <SelectItemsFromJobModal
          isOpen={isItemSelectorOpen}
          jobItems={jobItems}
          selectedPOItems={selectedItems}
          onClose={() => setIsItemSelectorOpen(false)}
          onChange={setSelectedItems}
        />

      </div>
    </div>
  )
}
