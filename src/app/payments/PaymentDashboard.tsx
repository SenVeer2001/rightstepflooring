import { useEffect, useMemo, useRef, useState } from "react"
import {
  RefreshCcw,
  Download,
  Trash2,
  Eye,
  X,
} from "lucide-react"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import { useNavigate } from "react-router-dom"

/* ===================== TYPES ===================== */

type PaymentStatus = "paid" | "pending" | "overdue"

type ActiveDropdown = "status" | null

interface Payment {
  id: string
  invoiceId: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  amount: number
  status: PaymentStatus
  issueDate: string // ISO
  dueDate: string  // ISO
}

/* ===================== STATUS CONFIG ===================== */

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
}

const statusStyles: Record<PaymentStatus, string> = {
  paid: "bg-green-100 text-green-800 border-green-300",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  overdue: "bg-red-100 text-red-800 border-red-300",
}

/* ===================== MOCK DATA ===================== */

const paymentsData: Payment[] = [
  {
    id: "1",
    invoiceId: "INV-001",
    customer: { name: "John Doe", email: "john@example.com", phone: "(555) 111-2222" },
    amount: 2500,
    status: "paid",
    issueDate: "2025-06-01",
    dueDate: "2025-06-15",
  },
  {
    id: "2",
    invoiceId: "INV-002",
    customer: { name: "Jane Smith", email: "jane@example.com", phone: "(555) 333-4444" },
    amount: 1800,
    status: "pending",
    issueDate: "2025-06-10",
    dueDate: "2025-06-25",
  },
  {
    id: "3",
    invoiceId: "INV-003",
    customer: { name: "Bob Johnson", email: "bob@example.com", phone: "(555) 555-6666" },
    amount: 3200,
    status: "overdue",
    issueDate: "2025-05-20",
    dueDate: "2025-06-05",
  },
]

/* ===================== COMPONENT ===================== */

export function Payments() {
  const navigate = useNavigate()

  const [payments, setPayments] = useState<Payment[]>(paymentsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // dropdown like your reference
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  const hasSelection = selectedIds.size > 0

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ===================== TABS + COUNTS ===================== */

  const paymentStatusTabs = [
    { id: "all", label: "All" },
    ...Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => ({
      id: key,
      label,
    })),
  ]

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: payments.length }
    for (const p of payments) counts[p.status] = (counts[p.status] || 0) + 1
    return counts
  }, [payments])

  /* ===================== FILTERING ===================== */

  const filteredPayments = useMemo(() => {
    const s = searchTerm.toLowerCase().trim()

    return payments.filter((p) => {
      const matchesSearch =
        s === "" ||
        p.invoiceId.toLowerCase().includes(s) ||
        p.customer.name.toLowerCase().includes(s) ||
        p.customer.email.toLowerCase().includes(s)

      const matchesStatus = filterStatus === "all" || p.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [payments, searchTerm, filterStatus])

  /* ===================== SELECTION ===================== */

  const isAllSelected =
    filteredPayments.length > 0 && filteredPayments.every((p) => selectedIds.has(p.id))

  const isSomeSelected =
    filteredPayments.some((p) => selectedIds.has(p.id)) && !isAllSelected

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filteredPayments.map((p) => p.id)))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  /* ===================== HANDLERS ===================== */

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  const handleStatusChange = (paymentId: string, newStatus: PaymentStatus) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
    )
  }

  const handleBulkStatusChange = (newStatus: PaymentStatus) => {
    setPayments((prev) =>
      prev.map((p) => (selectedIds.has(p.id) ? { ...p, status: newStatus } : p))
    )
    setActiveDropdown(null)
  }

  const handleDelete = (paymentId: string) => {
    const ok = window.confirm("Are you sure you want to delete this payment?")
    if (!ok) return
    setPayments((prev) => prev.filter((p) => p.id !== paymentId))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(paymentId)
      return next
    })
  }

  const handleBulkDelete = () => {
    if (!hasSelection) return
    const ok = window.confirm(`Delete ${selectedIds.size} payment(s)?`)
    if (!ok) return
    setPayments((prev) => prev.filter((p) => !selectedIds.has(p.id)))
    setSelectedIds(new Set())
    setActiveDropdown(null)
  }

  /* ===================== STATS ===================== */

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const paidTotal = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0)
  const pendingTotal = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0)
  const overdueTotal = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-600">Track invoices and update payment status</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} />
        <StatCard label="Paid" value={formatCurrency(paidTotal)} />
        <StatCard label="Pending" value={formatCurrency(pendingTotal)} />
        <StatCard label="Overdue" value={formatCurrency(overdueTotal)} danger />
      </div>

      {/* STATUS TABS */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {paymentStatusTabs.map((tab) => {
          const isActive = filterStatus === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
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
                  ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}
                `}
              >
                {statusCounts[tab.id] || 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* SEARCH + BULK ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Search by invoice, customer name, or email..."
            className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasSelection && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
              <span className="text-sm font-medium text-primary">
                {selectedIds.size} selected
              </span>
              <button onClick={clearSelection} className="p-0.5 hover:bg-primary/20 rounded">
                <X size={14} className="text-primary" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
            {/* Bulk Change Status Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "status" ? null : "status")
                  }
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Change Status"
                  className={`p-2 rounded transition-colors ${
                    activeDropdown === "status"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                  }`}
                >
                  <RefreshCcw size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select payments to change status"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <RefreshCcw size={20} />
                </button>
              )}

              {activeDropdown === "status" && hasSelection && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 py-2">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Change Status
                    </p>
                  </div>

                  {Object.entries(PAYMENT_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                    <button
                      key={statusKey}
                      onClick={() => handleBulkStatusChange(statusKey as PaymentStatus)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${
                          statusStyles[statusKey as PaymentStatus]
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bulk Delete */}
            {hasSelection ? (
              <button
                onClick={handleBulkDelete}
                data-tooltip-id="quick-actions-tooltip"
                data-tooltip-content="Delete Selected"
                className="p-2 rounded hover:bg-red-500 hover:text-white text-gray-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            ) : (
              <button
                data-tooltip-id="disabled-tooltip"
                data-tooltip-content="Select payments to delete"
                className="p-2 rounded text-gray-400 cursor-not-allowed"
                disabled
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected
                  }}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                />
              </th>

              <th className="px-4 py-3 text-left font-semibold">Invoice</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Issued</th>
              <th className="px-4 py-3 text-left font-semibold">Due</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => {
                const isSelected = selectedIds.has(p.id)

                return (
                  <tr
                    key={p.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/invoice/${p.invoiceId}`, { state: { payment: p } })}
                        className="font-semibold text-primary hover:text-blue-600 hover:underline"
                      >
                        {p.invoiceId}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-nowrap">
                          {p.customer.name}
                        </span>
                        <span className="text-xs text-gray-500 text-nowrap">
                          {p.customer.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-900 text-nowrap">
                      {formatCurrency(p.amount)}
                    </td>

                    {/* Status dropdown like your reference */}
                    <td className="px-4 py-3 min-w-[160px]">
                      <select
                        value={p.status}
                        onChange={(e) =>
                          handleStatusChange(p.id, e.target.value as PaymentStatus)
                        }
                        className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[p.status]}`}
                      >
                        {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3 text-nowrap">
                      {new Date(p.issueDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-nowrap">
                      {new Date(p.dueDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/invoice/${p.invoiceId}`, { state: { payment: p } })}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Invoice"
                          className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Delete"
                          className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
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
        </table>
      </div>

      {/* TOOLTIPS */}
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
        id="disabled-tooltip"
        place="top"
        className="!bg-red-600 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  )
}

/* ===================== STAT CARD ===================== */

function StatCard({
  label,
  value,
  danger = false,
}: {
  label: string
  value: string | number
  danger?: boolean
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${danger ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  )
}