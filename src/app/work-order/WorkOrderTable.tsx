import { useMemo, useState, useRef, useEffect } from "react"
import {
  Search, Eye, Trash2, RefreshCcw, Tag, UserCog, CalendarClock,
  X, Check, Download
} from "lucide-react"
import type { WorkOrder, WorkOrderStatus } from "../../services/orderdata"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

/* ===================== EXTENDED TYPES ===================== */

interface ExtendedWorkOrder extends WorkOrder {
  tags?: string[]
  source?: string
}

interface WorkOrderTableProps {
  workOrders: ExtendedWorkOrder[]
  onDelete?: (ids: string[]) => void
  onStatusChange?: (id: string, status: WorkOrderStatus) => void
  onWorkOrdersUpdate?: (orders: ExtendedWorkOrder[]) => void
}

/* ===================== STATUS CONFIG ===================== */

const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus | "all", string> = {
  all: "All",
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
  "on-hold": "On Hold",
}

const statusStyles: Record<WorkOrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  "on-hold": "bg-red-100 text-red-800 border-red-300",
}

/* ===================== AVAILABLE TAGS WITH COLORS ===================== */

const availableTags = [
  { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "priority", label: "Priority", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "warranty", label: "Warranty", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "maintenance", label: "Maintenance", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "repair", label: "Repair", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "installation", label: "Installation", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "inspection", label: "Inspection", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: "follow-up", label: "Follow Up", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "scheduled", label: "Scheduled", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { id: "callback", label: "Callback", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { id: "vip", label: "VIP", color: "bg-rose-100 text-rose-700 border-rose-200" },
  { id: "commercial", label: "Commercial", color: "bg-slate-100 text-slate-700 border-slate-200" },
]

/* ===================== TAG COLOR MAPPING ===================== */

const tagColorMap: Record<string, string> = {
  "Urgent": "bg-red-100 text-red-700 border border-red-200",
  "Priority": "bg-orange-100 text-orange-700 border border-orange-200",
  "Warranty": "bg-purple-100 text-purple-700 border border-purple-200",
  "Maintenance": "bg-blue-100 text-blue-700 border border-blue-200",
  "Repair": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "Installation": "bg-green-100 text-green-700 border border-green-200",
  "Inspection": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Follow Up": "bg-amber-100 text-amber-700 border border-amber-200",
  "Scheduled": "bg-teal-100 text-teal-700 border border-teal-200",
  "Callback": "bg-cyan-100 text-cyan-700 border border-cyan-200",
  "VIP": "bg-rose-100 text-rose-700 border border-rose-200",
  "Commercial": "bg-slate-100 text-slate-700 border border-slate-200",
}

const getTagColor = (tagLabel: string): string => {
  return tagColorMap[tagLabel] || "bg-gray-100 text-gray-700 border border-gray-200"
}

/* ===================== DROPDOWN TYPES ===================== */

type ActiveDropdown = "status" | "tags" | null

/* ===================== COMPONENT ===================== */

export default function WorkOrderTable({
  workOrders: initialWorkOrders,
  onDelete,
  onStatusChange,
  onWorkOrdersUpdate,
}: WorkOrderTableProps) {
  const navigate = useNavigate()

  // Add tags to work orders if not present
  const [workOrders, setWorkOrders] = useState<ExtendedWorkOrder[]>(() =>
    initialWorkOrders.map(order => ({
      ...order,
      tags: order.tags || [],
      source: order.source || "Manual"
    }))
  )

  const [search, setSearch] = useState("")
  const [activeStatus, setActiveStatus] = useState<WorkOrderStatus | "all">("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const tagsDropdownRef = useRef<HTMLDivElement>(null)

  // Check if any orders are selected
  const hasSelection = selectedIds.size > 0

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ===================== STATUS TABS ===================== */

  const workOrderStatusTabs = Object.entries(WORK_ORDER_STATUS_LABELS).map(([key, label]) => ({
    id: key,
    label: label,
  }))

  const statusCounts = useMemo(() => {
    return {
      all: workOrders.length,
      pending: workOrders.filter(w => w.status === "pending").length,
      "in-progress": workOrders.filter(w => w.status === "in-progress").length,
      completed: workOrders.filter(w => w.status === "completed").length,
      "on-hold": workOrders.filter(w => w.status === "on-hold").length,
    }
  }, [workOrders])

  /* ===================== FILTER ===================== */

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

  const totalRows = filtered.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  const paginatedOrders = filtered.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeStatus])

  /* ===================== HANDLERS ===================== */

  // Check if all filtered items are selected
  const isAllSelected = filtered.length > 0 && filtered.every(order => selectedIds.has(order.id))

  // Check if some (but not all) are selected
  const isSomeSelected = filtered.some(order => selectedIds.has(order.id)) && !isAllSelected

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      const newSelected = new Set(selectedIds)
      filtered.forEach(order => newSelected.delete(order.id))
      setSelectedIds(newSelected)
    } else {
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

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: WorkOrderStatus) => {
    setWorkOrders(previousOrders =>
      previousOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
    onStatusChange?.(orderId, newStatus)
  }

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} work order(s)?`
    )
    if (!confirmed) return

    const idsToDelete = Array.from(selectedIds)
    setWorkOrders(workOrders.filter(order => !idsToDelete.includes(order.id)))
    onDelete?.(idsToDelete)
    setSelectedIds(new Set())
  }

  // Handle single delete
  const handleSingleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this work order?")
    if (!confirmed) return

    setWorkOrders(workOrders.filter(order => order.id !== id))
    onDelete?.([id])
    selectedIds.delete(id)
    setSelectedIds(new Set(selectedIds))
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  /* ===================== BULK ACTIONS ===================== */

  // Bulk status change
  const handleBulkStatusChange = (newStatus: WorkOrderStatus) => {
    setWorkOrders(previousOrders =>
      previousOrders.map(order =>
        selectedIds.has(order.id) ? { ...order, status: newStatus } : order
      )
    )

    // Call individual status change for each selected
    selectedIds.forEach(id => {
      onStatusChange?.(id, newStatus)
    })

    setActiveDropdown(null)
  }

  // Bulk add tag
  const handleBulkAddTag = (tagLabel: string) => {
    setWorkOrders(previousOrders =>
      previousOrders.map(order => {
        if (selectedIds.has(order.id)) {
          const currentTags = order.tags || []
          if (!currentTags.includes(tagLabel)) {
            return { ...order, tags: [...currentTags, tagLabel] }
          }
        }
        return order
      })
    )
    setActiveDropdown(null)
    onWorkOrdersUpdate?.(workOrders)
  }

  // Bulk remove tag
  const handleBulkRemoveTag = (tagLabel: string) => {
    setWorkOrders(previousOrders =>
      previousOrders.map(order => {
        if (selectedIds.has(order.id)) {
          const currentTags = order.tags || []
          return { ...order, tags: currentTags.filter(t => t !== tagLabel) }
        }
        return order
      })
    )
    onWorkOrdersUpdate?.(workOrders)
  }

  // Get selected orders' common tags
  const getSelectedOrdersTags = () => {
    const selectedOrdersList = workOrders.filter(order => selectedIds.has(order.id))
    const allTags = selectedOrdersList.flatMap(order => order.tags || [])
    return [...new Set(allTags)]
  }

  const handleViewOrder = (orderId: string) => {
    navigate(`/work-order/${orderId}`)
  }

  return (
    <div className="space-y-6 p-2 min-h-screen">





      <div className="flex gap-3 overflow-x-auto pb-2 thin-scrollbar">
        {workOrderStatusTabs.map((tab) => {
          const isActive = activeStatus === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id as any)}
              className={`
                    flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                    whitespace-nowrap transition
                    ${isActive
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-200"
                }
                  `}
            >
              {tab.label}
              <span
                className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                  }
                    `}
              >
                {statusCounts[tab.id as keyof typeof statusCounts] || 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* SEARCH + BULK ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 min-w-[400px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by Work Order ID, Job ID, Client, or Technician..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {hasSelection && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
              <span className="text-sm font-medium text-primary">
                {selectedIds.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="p-0.5 hover:bg-primary/20 rounded"
              >
                <X size={14} className="text-primary" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
            {/* Change Status Button */}
            <div className="relative" ref={statusDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Change Status"
                  className={`p-2 rounded transition-colors ${activeDropdown === "status"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                    }`}
                >
                  <RefreshCcw size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select work orders to change status"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <RefreshCcw size={20} />
                </button>
              )}

              {/* Status Dropdown */}
              {activeDropdown === "status" && hasSelection && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-72 overflow-y-auto">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Change Status</p>
                  </div>
                  {Object.entries(WORK_ORDER_STATUS_LABELS)
                    .filter(([key]) => key !== "all")
                    .map(([statusKey, statusLabel]) => (
                      <button
                        key={statusKey}
                        onClick={() => handleBulkStatusChange(statusKey as WorkOrderStatus)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusStyles[statusKey as WorkOrderStatus]}`}>
                          {statusLabel}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Modify Tags Button */}
            <div className="relative" ref={tagsDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "tags" ? null : "tags")}
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Modify Tags"
                  className={`p-2 rounded transition-colors ${activeDropdown === "tags"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                    }`}
                >
                  <Tag size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select work orders to modify tags"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Tag size={20} />
                </button>
              )}

              {/* Tags Dropdown */}
              {activeDropdown === "tags" && hasSelection && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Add Tags</p>
                  </div>

                  {availableTags.map((tag) => {
                    const selectedTags = getSelectedOrdersTags()
                    const isApplied = selectedTags.includes(tag.label)

                    return (
                      <button
                        key={tag.id}
                        onClick={() => isApplied ? handleBulkRemoveTag(tag.label) : handleBulkAddTag(tag.label)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between gap-2"
                      >
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${tag.color}`}>
                          {tag.label}
                        </span>
                        {isApplied && (
                          <Check size={16} className="text-green-600" />
                        )}
                      </button>
                    )
                  })}

                  {/* Current tags on selected orders */}
                  {getSelectedOrdersTags().length > 0 && (
                    <>
                      <div className="px-3 py-2 border-t border-b mt-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Current Tags</p>
                      </div>
                      <div className="px-3 py-2 flex flex-wrap gap-1">
                        {getSelectedOrdersTags().map(tag => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${getTagColor(tag)}`}
                          >
                            {tag}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBulkRemoveTag(tag)
                              }}
                              className="hover:opacity-70"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Reassign Technician */}
            {hasSelection ? (
              <button
                data-tooltip-id="quick-actions-tooltip"
                data-tooltip-content="Reassign Technician"
                className="p-2 rounded hover:bg-primary hover:text-white text-gray-700"
              >
                <UserCog size={20} />
              </button>
            ) : (
              <button
                data-tooltip-id="disabled-tooltip"
                data-tooltip-content="Select work orders to reassign"
                className="p-2 rounded text-gray-400 cursor-not-allowed"
                disabled
              >
                <UserCog size={20} />
              </button>
            )}

            {/* Reschedule Work Order */}
            {hasSelection ? (
              <button
                data-tooltip-id="quick-actions-tooltip"
                data-tooltip-content="Reschedule Work Order"
                className="p-2 rounded hover:bg-primary hover:text-white text-gray-700"
              >
                <CalendarClock size={20} />
              </button>
            ) : (
              <button
                data-tooltip-id="disabled-tooltip"
                data-tooltip-content="Select work orders to reschedule"
                className="p-2 rounded text-gray-400 cursor-not-allowed"
                disabled
              >
                <CalendarClock size={20} />
              </button>
            )}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
            <Download size={16} /> Export
          </button>
        </div>
      </div>





      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-12">
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
                {[ "Job ID","WO ID", "Status", "Tags", "Client", "Technician", "Source", "Created", "Updated", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-500">
                    No work orders found
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const isSelected = selectedIds.has(order.id)

                  return (
                    <tr
                      key={order.id}
                      className={`border-t hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""
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


                      <td className="px-4 py-3 font-semibold text-primary">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="text-primary hover:text-blue-600 hover:underline"
                        >
                          #{order.id}
                        </button>
                      </td>

                      {/* Status with Dropdown */}
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as WorkOrderStatus)}
                          className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[order.status]}`}
                        >
                          {Object.entries(WORK_ORDER_STATUS_LABELS)
                            .filter(([key]) => key !== "all")
                            .map(([statusKey, statusLabel]) => (
                              <option key={statusKey} value={statusKey}>
                                {statusLabel}
                              </option>
                            ))}
                        </select>
                      </td>

                      {/* Tags Column with Colors */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(order.tags ?? []).length > 0 ? (
                            (order.tags ?? []).map(tag => (
                              <span
                                key={tag}
                                className={`px-2 py-0.5 text-xs font-medium rounded ${getTagColor(tag)}`}
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs italic">No tags</span>
                          )}
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3">{order.client}</td>

                      {/* Technician */}
                      <td className="px-4 py-3">{order.technician}</td>

                      {/* Source */}
                      <td className="px-4 py-3">{order.source || "Manual"}</td>

                      {/* Created */}
                      <td className="px-4 py-3">{order.createdDate}</td>

                      {/* Updated */}
                      <td className="px-4 py-3">{order.updatedDate}</td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order.id)}
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content="View Work Order"
                            className="p-1.5 rounded hover:bg-primary/10 text-primary"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleSingleDelete(order.id)}
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content="Delete Work Order"
                            className="p-1.5 rounded hover:bg-red-100 text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })  // ← Added missing closing parenthesis here
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{startIndex + 1}</span>
              {" - "}
              <span className="font-semibold">
                {Math.min(endIndex, totalRows)}
              </span>
              {" of "}
              <span className="font-semibold">{totalRows}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm font-semibold">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>




      {/* Tooltips */}
      <Tooltip
        id="quick-actions-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip
        id="action-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip
        id="view-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip
        id="disabled-tooltip"
        place="top"
        className="!bg-red-600 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  )
}