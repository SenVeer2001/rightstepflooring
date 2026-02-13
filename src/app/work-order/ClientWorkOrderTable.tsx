
import { useMemo, useState } from "react"
import { Search, Eye, Trash2 } from "lucide-react"
import type { WorkOrder, WorkOrderStatus } from "../../services/orderdata"
import { useNavigate } from "react-router-dom"

interface WorkOrderTableProps {
  workOrders: WorkOrder[]
  onDelete?: (ids: string[]) => void
}

export default function ClientWorkOrderTable({
  workOrders,
  onDelete,
}: WorkOrderTableProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [activeStatus, setActiveStatus] = useState<WorkOrderStatus | "all">("all")

  // ===================== CHECKBOX STATE =====================
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const statusCounts = useMemo(() => {
    return {
      all: workOrders.length,
      pending: workOrders.filter(w => w.status === "pending").length,
      "in-progress": workOrders.filter(w => w.status === "in-progress").length,
      completed: workOrders.filter(w => w.status === "completed").length,
      "on-hold": workOrders.filter(w => w.status === "on-hold").length,
    }
  }, [workOrders])

  const filtered = useMemo(() => {
    return workOrders.filter(order => {
      const matchesStatus =
        activeStatus === "all" || order.status === activeStatus

      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.jobId.toLowerCase().includes(search.toLowerCase()) ||
        order.client.toLowerCase().includes(search.toLowerCase()) ||
        order.technician.toLowerCase().includes(search.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [search, activeStatus, workOrders])

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    "on-hold": "bg-red-100 text-red-700",
  }

  // ===================== CHECKBOX HANDLERS =====================

  // Check if all filtered items are selected
  const isAllSelected = filtered.length > 0 && filtered.every(order => selectedIds.has(order.id))

  // Check if some (but not all) are selected
  const isSomeSelected = filtered.some(order => selectedIds.has(order.id)) && !isAllSelected

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all filtered items
      const newSelected = new Set(selectedIds)
      filtered.forEach(order => newSelected.delete(order.id))
      setSelectedIds(newSelected)
    } else {
      // Select all filtered items
      const newSelected = new Set(selectedIds)
      filtered.forEach(order => newSelected.add(order.id))
      setSelectedIds(newSelected)
    }
  }

  // Handle individual checkbox
  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} work order(s)?`
    )
    if (!confirmed) return

    onDelete?.(Array.from(selectedIds))
    setSelectedIds(new Set())
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  return (
    <div className="space-y-5">

      {/* STATUS TABS */}
      <div className="flex flex-wrap gap-3">
        {(
          [
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "in-progress", label: "In Progress" },
            { key: "completed", label: "Completed" },
            { key: "on-hold", label: "On Hold" },
          ] as { key: WorkOrderStatus | "all"; label: string }[]
        ).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${
                activeStatus === tab.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label} ({statusCounts[tab.key]})
          </button>
        ))}
      </div>

      {/* SEARCH + BULK ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            placeholder="Search by Work Order ID, Job ID, Client, or Technician..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Bulk Actions - Show only when items are selected */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-red-700 transition"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* TABLE (Desktop) */}
      <div className="hidden md:block border rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              {/* SELECT ALL CHECKBOX */}
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = isSomeSelected
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">Job ID</th>
              <th className="px-4 py-3 text-left">WO ID</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Technician</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  No work orders found
                </td>
              </tr>
            )}

            {filtered.map(order => {
              const isSelected = selectedIds.has(order.id)

              return (
                <tr
                  key={order.id}
                  className={`border-t hover:bg-primary/5 transition ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                >
                  {/* INDIVIDUAL CHECKBOX */}
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(order.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{order.jobId}</td>
                  <td className="px-4 py-4">{order.id}</td>
                  <td className="px-4 py-4">{order.client}</td>
                  <td className="px-4 py-4">{order.technician}</td>
                  <td className="px-4 py-4">{order.createdDate}</td>
                  <td className="px-4 py-4">{order.updatedDate}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => navigate("/work-order/480")}
                        className="p-2 text-primary hover:bg-primary/10 rounded-md transition"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => {
                          const confirmed = window.confirm("Are you sure you want to delete this work order?")
                          if (confirmed) {
                            onDelete?.([order.id])
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW (Card Style) */}
      <div className="md:hidden space-y-4">
        {/* Mobile Select All */}
        {filtered.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = isSomeSelected
                }
              }}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({filtered.length})
            </span>
            {selectedIds.size > 0 && (
              <span className="ml-auto text-sm text-primary font-semibold">
                {selectedIds.size} selected
              </span>
            )}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No work orders found
          </div>
        )}

        {filtered.map(order => {
          const isSelected = selectedIds.has(order.id)

          return (
            <div
              key={order.id}
              className={`border rounded-xl p-4 bg-white shadow-sm ${
                isSelected ? "border-primary bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectOne(order.id)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 cursor-pointer accent-primary"
                />

                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold">{order.id}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[order.status]
                      }`}
                    >
                      {order.status.replace("-", " ")}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>Job: {order.jobId}</p>
                    <p>Client: {order.client}</p>
                    <p>Technician: {order.technician}</p>
                    <p>Created: {order.createdDate}</p>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => navigate("/work-order/480")}
                      className="text-primary font-semibold text-sm flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        const confirmed = window.confirm("Delete this work order?")
                        if (confirmed) {
                          onDelete?.([order.id])
                        }
                      }}
                      className="text-red-500 font-semibold text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MOBILE BULK ACTIONS - Fixed at bottom */}
      {selectedIds.size > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg flex items-center justify-between z-50">
          <span className="text-sm font-semibold text-gray-700">
            {selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold"
            >
              Clear
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}