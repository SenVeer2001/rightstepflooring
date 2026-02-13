"use client"

import { Download, Eye, Layers, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import type { PurchaseOrderTableItem } from "../../../../types/vendor"
import { PurchaseOrderFormModal, type Item } from "../PurchaseOrderFormModal"


// ===================== STATUS TYPES =====================
type POStatus = "po_created" | "po_approved" | "item_dispatched" | "item_received"

// ===================== STATUS LABELS =====================
const PO_STATUS_LABELS: Record<POStatus, string> = {
  po_created: "PO Created",
  po_approved: "PO Approved",
  item_dispatched: "Item Dispatched",
  item_received: "Item Received",
}

// ===================== STATUS STYLES (Inline) =====================
const statusStyles: Record<POStatus, { bg: string; text: string; border: string }> = {
  po_created: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
  po_approved: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
  item_dispatched: { bg: "#FEF9C3", text: "#854D0E", border: "#FDE047" },
  item_received: { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
}

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrderTableItem[]
  jobItems?: Item[]
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, itemId: string, status: POStatus) => void
  onUpdate?: (updatedPO: any) => void
}

export function ClientPurchaseOrderTab({
  purchaseOrders: initialOrders,
  jobItems = [],
  onDelete,
  onStatusChange,
  onUpdate,
}: PurchaseOrderTableProps) {

  // ===================== LOCAL STATE =====================
  const [purchaseOrders, setPurchaseOrders] = useState(initialOrders || [])
  const [showAll, setShowAll] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<"all" | POStatus>("all")

  // ===================== MODAL STATE =====================
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<any>(null)

  // Update local state when props change
  useEffect(() => {
    setPurchaseOrders(initialOrders || [])
  }, [initialOrders])

  // ===================== SAFE ARRAYS =====================
  const safePurchaseOrders = purchaseOrders || []
  const safeJobItems = jobItems || []

  // ===================== STATUS TABS =====================
  const statusTabs = [
    { id: "all", label: "All" },
    ...Object.entries(PO_STATUS_LABELS).map(([statusKey, statusLabel]) => ({
      id: statusKey,
      label: statusLabel,
    })),
  ]

  // ===================== COUNT STATUS =====================
  const statusCounts: Record<string, number> = {
    all: safePurchaseOrders.reduce((acc, order) => acc + (order.items?.length || 0), 0),
  }

  safePurchaseOrders.forEach(order => {
    (order.items || []).forEach(item => {
      const status = (item as any).status || "po_created"
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
  })

  // ===================== FILTER ORDERS =====================
  const filteredOrders = safePurchaseOrders.map(order => ({
    ...order,
    items: (order.items || []).filter(item => {
      const itemStatus = (item as any).status || "po_created"
      return selectedStatus === "all" || itemStatus === selectedStatus
    })
  })).filter(order => order.items.length > 0)

  const visibleOrders = showAll
    ? filteredOrders
    : filteredOrders.slice(0, 5)

  // ===================== CALCULATE TOTAL COST =====================
  const totalCost = safePurchaseOrders.reduce((total, order) => {
    return total + (order.items || []).reduce((itemTotal, item) => {
      const cost = (item as any).cost || 0
      const quantity = (item as any).quantity || 1
      return itemTotal + (cost * quantity)
    }, 0)
  }, 0)

  // ===================== HANDLE STATUS CHANGE =====================
  const handleStatusChange = (orderId: string, itemId: string, newStatus: POStatus) => {
    setPurchaseOrders(prevOrders =>
      (prevOrders || []).map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: (order.items || []).map(item => {
              // @ts-ignore
              if (item.id === itemId) {
                return { ...item, status: newStatus }
              }
              return item
            })
          }
        }
        return order
      })
    )
    onStatusChange?.(orderId, itemId, newStatus)
  }

  // ===================== HANDLE VIEW/EDIT =====================
  const handleViewPO = (order: PurchaseOrderTableItem) => {
    const poData = {
      id: order.id,
      vendorId: (order as any).vendorId || order.id,
      vendorName: order.vendorName,
      orderDate: order.orderDate,
      items: (order.items || []).map(i => ({
        id: typeof i.id === 'string' ? parseInt(i.id) || 0 : i.id,
        name: i.name || "",
        quantity: (i as any).quantity || 1,
        cost: (i as any).cost || 0,
        image: i.image || "",
        color: i.color || "",
        type: i.type || "product",
        status: (i as any).status || "po_created",
      })),
    }

    setSelectedPO(poData)
    setIsModalOpen(true)
  }

  // ===================== HANDLE MODAL CLOSE =====================
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedPO(null)
  }

  // ===================== HANDLE DELETE =====================
  const handleDelete = (orderId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this purchase order?")
    if (!confirmed) return

    setPurchaseOrders(prev => (prev || []).filter(order => order.id !== orderId))
    onDelete?.(orderId)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold flex gap-2 text-gray-900">
            Purchase Order
            <Layers className="text-primary" />
          </h2>
         
        </div>

      </div>

      {/* ===================== STATUS TABS ===================== */}
      <div className="flex gap-3 overflow-x-auto pb-2 thin-scrollbar">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as "all" | POStatus)}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                whitespace-nowrap transition
                ${isActive
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
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
                {statusCounts[tab.id] || 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Item</th>
                <th className="px-6 py-3 text-left font-semibold">Type</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Color</th>
                <th className="px-6 py-3 text-left font-semibold">Qty</th>
                <th className="px-6 py-3 text-left font-semibold">Cost</th>
                <th className="px-6 py-3 text-left font-semibold">Total</th>
                <th className="px-6 py-3 text-left font-semibold">Vendor</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {visibleOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-gray-400"
                  >
                    No purchase orders found
                  </td>
                </tr>
              )}

              {visibleOrders.map(order =>
                (order.items || []).map(item => {
                  const itemStatus = ((item as any).status || "po_created") as POStatus
                  const currentStyle = statusStyles[itemStatus] || statusStyles.po_created
                  
                  // Get cost and quantity
                  const itemCost = (item as any).cost || 0
                  const itemQuantity = (item as any).quantity || 1
                  const itemTotal = itemCost * itemQuantity

                  return (
                    <tr
                      key={`${order.id}-${item.id}`}
                      className="border-t hover:bg-primary/5 transitione"
                    >
                      {/* ITEM */}
                      <td className="px-6 py-4 min-w-[300px]">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-md object-cover border"
                            />
                          )}
                          <span className="font-semibold text-gray-900">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.type === "product"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.type === "product" ? "Product" : "Service"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 min-w-[200px]">
                        <select
                          value={itemStatus}
                           // @ts-ignore
                          onChange={(e) => handleStatusChange(order.id, item.id, e.target.value as POStatus)}
                          style={{
                            backgroundColor: currentStyle.bg,
                            color: currentStyle.text,
                            borderColor: currentStyle.border,
                          }}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold border cursor-pointer outline-none"
                        >
                          {Object.entries(PO_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                            <option
                              key={statusKey}
                              value={statusKey}
                              style={{
                                backgroundColor: "white",
                                color: "#374151",
                              }}
                            >
                              {statusLabel}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* COLOR */}
                      <td className="px-6 py-4">
                        {item.color ? (
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: item.color }}
                          />
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* QUANTITY */}
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {itemQuantity}
                      </td>

                      {/* COST (per unit) */}
                      <td className="px-6 py-4 text-gray-700">
                        ${itemCost.toFixed(2)}
                      </td>

                      {/* TOTAL (cost * quantity) */}
                      <td className="px-6 py-4 font-semibold text-primary">
                        ${itemTotal.toFixed(2)}
                      </td>

                      {/* VENDOR */}
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {order.vendorName}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-gray-600">
                        {order.orderDate}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* VIEW/EDIT BUTTON */}
                          <button
                            onClick={() => handleViewPO(order)}
                            className="p-2 text-white border bg-primary rounded-md"
                            title="View/Edit PO"
                          >
                            <Eye size={18} />
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 bg-red-600 text-white rounded-md"
                            title="Delete PO"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>

            {/* TABLE FOOTER - TOTAL */}
            {visibleOrders.length > 0 && (
              <tfoot className="bg-gray-50 border-t-2">
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-right font-bold text-gray-700">
                    Grand Total:
                  </td>
                  <td className="px-6 py-4 font-bold text-primary text-lg">
                    ${totalCost.toFixed(2)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* SHOW MORE BUTTON */}
      {filteredOrders.length > 5 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-sm font-semibold text-primary hover:underline"
          >
            {showAll ? "Show Less" : `Show All (${filteredOrders.length})`}
          </button>
        </div>
      )}

      {/* ===================== VIEW/EDIT MODAL ===================== */}
      <PurchaseOrderFormModal
        isOpen={isModalOpen}
        mode="edit"
        initialPO={selectedPO}
        onClose={handleModalClose}
        jobItems={safeJobItems}
      />
    </div>
  )
}