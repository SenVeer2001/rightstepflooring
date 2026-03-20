import { useMemo, useState } from "react"
import {
  Search, Eye, Download, DollarSign, Percent, CreditCard, Wallet,
  Calendar, ChevronDown, FileText, CheckCircle
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

/* ===================== TYPES ===================== */

interface PayoutWorkOrder {
  id: string
  jobId: string
  client: string
  technician: string
  completedDate: string
  paymentAmount: number      // Total payment from client
  payoutAmount: number       // Amount to pay vendor/subcontractor
  rstFeePercent: number      // RST fee percentage
  rstFeeAmount: number       // RST fee in USD
  vendor: string
  status: 'completed'        // Always completed
}

/* ===================== STATIC DATA ===================== */

const payoutWorkOrders: PayoutWorkOrder[] = [
  {
    id: "WO-001",
    jobId: "JB-480",
    client: "Robin Stevens",
    technician: "Mike Johnson",
    completedDate: "Jan 12, 2026",
    paymentAmount: 5000,
    payoutAmount: 3500,
    rstFeePercent: 10,
    rstFeeAmount: 500,
    vendor: "ABC Flooring Supply",
    status: "completed",
  },
  {
    id: "WO-003",
    jobId: "JB-506",
    client: "Kristopher Decker",
    technician: "Tom Davis",
    completedDate: "Jan 13, 2026",
    paymentAmount: 8500,
    payoutAmount: 6000,
    rstFeePercent: 10,
    rstFeeAmount: 850,
    vendor: "Tile World Distributors",
    status: "completed",
  },
  {
    id: "WO-005",
    jobId: "JB-504",
    client: "Jennifer Wilson",
    technician: "Mike Johnson",
    completedDate: "Jan 9, 2026",
    paymentAmount: 3200,
    payoutAmount: 2200,
    rstFeePercent: 10,
    rstFeeAmount: 320,
    vendor: "Premier Carpet Co.",
    status: "completed",
  },
  {
    id: "WO-007",
    jobId: "JB-510",
    client: "Amanda Foster",
    technician: "Sarah Miller",
    completedDate: "Jan 15, 2026",
    paymentAmount: 12000,
    payoutAmount: 8500,
    rstFeePercent: 10,
    rstFeeAmount: 1200,
    vendor: "Elite Flooring Solutions",
    status: "completed",
  },
  {
    id: "WO-008",
    jobId: "JB-511",
    client: "Marcus Chen",
    technician: "John Smith",
    completedDate: "Jan 16, 2026",
    paymentAmount: 6750,
    payoutAmount: 4800,
    rstFeePercent: 10,
    rstFeeAmount: 675,
    vendor: "ABC Flooring Supply",
    status: "completed",
  },
  {
    id: "WO-009",
    jobId: "JB-512",
    client: "Lisa Rodriguez",
    technician: "Tom Davis",
    completedDate: "Jan 17, 2026",
    paymentAmount: 4500,
    payoutAmount: 3150,
    rstFeePercent: 10,
    rstFeeAmount: 450,
    vendor: "Tile World Distributors",
    status: "completed",
  },
]

/* ===================== COMPONENT ===================== */

export default function PayoutList() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [dateFilter, setDateFilter] = useState<string>("all")
  const rowsPerPage = 10

  /* ===================== CALCULATIONS ===================== */

  const stats = useMemo(() => {
    const totalPayment = payoutWorkOrders.reduce((sum, order) => sum + order.paymentAmount, 0)
    const totalPayout = payoutWorkOrders.reduce((sum, order) => sum + order.payoutAmount, 0)
    const totalRstFees = payoutWorkOrders.reduce((sum, order) => sum + order.rstFeeAmount, 0)
    const avgRstPercent = payoutWorkOrders.length > 0 
      ? payoutWorkOrders.reduce((sum, order) => sum + order.rstFeePercent, 0) / payoutWorkOrders.length 
      : 0

    return {
      totalPayment,
      totalPayout,
      totalRstFees,
      avgRstPercent,
    }
  }, [])

  /* ===================== FILTER ===================== */

  const filtered = useMemo(() => {
    return payoutWorkOrders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.jobId.toLowerCase().includes(search.toLowerCase()) ||
        order.client.toLowerCase().includes(search.toLowerCase()) ||
        order.technician.toLowerCase().includes(search.toLowerCase()) ||
        order.vendor.toLowerCase().includes(search.toLowerCase())

      return matchesSearch
    })
  }, [search])

  const totalRows = filtered.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  const paginatedOrders = filtered.slice(startIndex, endIndex)

  /* ===================== HANDLERS ===================== */

  const handleViewOrder = (orderId: string) => {
    navigate(`/payouts/${orderId}`)
  }
   const handleViewWorkOrder = (orderId: string) => {
    navigate(`/orders/work-order/${orderId}`)
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-gray-600 mt-1">Manage payments for completed work orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Payment */}
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payment</p>
              <p className="text-xl font-bold text-gray-900">
                ${stats.totalPayment.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payout</p>
              <p className="text-xl font-bold text-gray-900">
                ${stats.totalPayout.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

      
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">RST Fees %</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.avgRstPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* RST Fees (USD) */}
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">RST Fees (USD)</p>
              <p className="text-xl font-bold text-gray-900">
                ${stats.totalRstFees.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tab - Always Completed */}
      {/* <div className="flex gap-3 overflow-x-auto pb-2 thin-scrollbar">
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition bg-primary text-white"
        >
          <CheckCircle className="w-4 h-4" />
          Completed
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
            {payoutWorkOrders.length}
          </span>
        </button>
      </div> */}

      {/* Search + Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 min-w-[400px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by Work Order ID, Job ID, Client, Technician, or Vendor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Job ID",
                  "WO ID",
                  "Status",
                  "Client",
                  "Technician",
                  "Vendor",
                  "Completed Date",
                  "Payment $",
                  "Payout $",
                  "RST %",
                  "RST Fees $",
                  "Action"
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-semibold whitespace-nowrap text-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No payout records found</p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Job ID */}
                    <td className="px-4 py-3 font-semibold text-nowrap">{order.jobId}</td>

                    {/* WO ID */}
                    <td className="px-4 py-3 font-semibold text-primary text-nowrap">
                      <button
                        onClick={() => handleViewWorkOrder(order.id)}
                        className="text-primary hover:text-blue-600 hover:underline"
                      >
                        #{order.id}
                      </button>
                    </td>

                    {/* Status - Always Completed */}
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold border bg-green-100 text-green-800 border-green-300">
                        Completed
                      </span>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3">{order.client}</td>

                    {/* Technician */}
                    <td className="px-4 py-3">{order.technician}</td>

                    {/* Vendor */}
                    <td className="px-4 py-3">
                      <span className="text-gray-900">{order.vendor}</span>
                    </td>

                    {/* Completed Date */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {order.completedDate}
                      </div>
                    </td>

                    {/* Payment Amount */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-green-600">
                        ${order.paymentAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Payout Amount */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-600">
                        ${order.payoutAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* RST Fee % */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-purple-600">
                        {order.rstFeePercent}%
                      </span>
                    </td>

                    {/* RST Fee Amount */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-orange-600">
                        ${order.rstFeeAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Details"
                          className="p-1.5 rounded hover:bg-primary/10 text-primary"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
        id="action-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  )
}