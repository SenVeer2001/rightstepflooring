import { useMemo, useState } from "react"
import {
  Calendar, Download, DollarSign, TrendingUp, Filter, X, Eye, FileText,
  CheckCircle, Clock, XCircle, AlertTriangle, Percent, Users, Building2,
  Briefcase
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import PayoutDetailsPopup from "./PayoutDetailsPopup"
import PayoutSidebar from "./PayoutSidebar"

/* ===================== TYPES ===================== */

interface LineItem {
  id: string
  description: string
  quantity: number
  unitCost: number
  total: number
}

interface PayoutLedgerEntry {
  id: string
  jobId: string
  workOrderId: string
  client: string
  salesRep: string
  subcontractor: string
  brand: string
  product: string
  createDate: string
  completedDate: string
  jobStatus: 'completed' | 'in_progress' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'partial' | 'failed'
  status: 'approved' | 'pending' | 'on_hold' | 'rejected' | 'paid'
  revenue: number
  totalCosts: number
  subcontractorPayout: number
  paidAmount: number
  holdAmount: number
  retentionPercent: number
  retentionAmount: number
  finalTotal: number
  trueProfit: number
  closingRate: number
  commissionTier: string
  commissionEarned: number
  lineItems: LineItem[]
  location?: string
  photos?: string[]
  vendorName?: string
  vendorPayout?: number
}

/* ===================== STATIC DATA ===================== */

const payoutLedgerData: PayoutLedgerEntry[] = [
  {
    id: "PL-001",
    jobId: "JB-480",
    workOrderId: "WO-001",
    client: "Robin Stevens",
    salesRep: "John Carter",
    subcontractor: "Mike Johnson",
    brand: "Shaw Floors",
    product: "Luxury Vinyl Plank",
    createDate: "2026-01-05",
    completedDate: "2026-01-12",
    jobStatus: "completed",
    paymentStatus: "paid",
    status: "approved",
    revenue: 12000,
    totalCosts: 8500,
    subcontractorPayout: 7000,
    paidAmount: 6650,
    holdAmount: 350,
    retentionPercent: 5,
    retentionAmount: 350,
    finalTotal: 3500,
    trueProfit: 3150,
    closingRate: 48,
    commissionTier: "7%",
    commissionEarned: 840,
    location: "123 Main Street, Springfield, IL 62701",
    photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
    vendorName: "Shaw Flooring Distributors",
    vendorPayout: 1500,
    lineItems: [
      { id: "L1", description: "Luxury Vinyl Installation", quantity: 500, unitCost: 8, total: 4000 },
      { id: "L2", description: "Underlayment", quantity: 500, unitCost: 2, total: 1000 },
      { id: "L3", description: "Material Delivery", quantity: 1, unitCost: 500, total: 500 },
      { id: "L4", description: "Labor", quantity: 40, unitCost: 75, total: 3000 },
    ],
  },
  {
    id: "PL-002",
    jobId: "JB-506",
    workOrderId: "WO-003",
    client: "Kristopher Decker",
    salesRep: "Sarah Williams",
    subcontractor: "Tom Davis",
    brand: "Mohawk",
    product: "Porcelain Tile",
    createDate: "2026-01-06",
    completedDate: "2026-01-13",
    jobStatus: "completed",
    paymentStatus: "paid",
    status: "paid",
    revenue: 18500,
    totalCosts: 12000,
    subcontractorPayout: 9500,
    paidAmount: 9025,
    holdAmount: 475,
    retentionPercent: 5,
    retentionAmount: 475,
    finalTotal: 6500,
    trueProfit: 6025,
    closingRate: 52,
    commissionTier: "7%",
    commissionEarned: 1295,
    location: "456 Oak Avenue, Chicago, IL 60601",
    photos: ["photo1.jpg", "photo2.jpg"],
    vendorName: "Mohawk Tile Supplies",
    vendorPayout: 2500,
    lineItems: [
      { id: "L1", description: "Porcelain Tile Installation", quantity: 800, unitCost: 10, total: 8000 },
      { id: "L2", description: "Tile Material", quantity: 850, unitCost: 4, total: 3400 },
      { id: "L3", description: "Grout & Adhesive", quantity: 1, unitCost: 600, total: 600 },
    ],
  },
  {
    id: "PL-003",
    jobId: "JB-504",
    workOrderId: "WO-005",
    client: "Jennifer Wilson",
    salesRep: "Mike Anderson",
    subcontractor: "Sarah Miller",
    brand: "Karastan",
    product: "Carpet",
    createDate: "2026-01-04",
    completedDate: "2026-01-09",
    jobStatus: "completed",
    paymentStatus: "pending",
    status: "pending",
    revenue: 7500,
    totalCosts: 5200,
    subcontractorPayout: 4500,
    paidAmount: 0,
    holdAmount: 225,
    retentionPercent: 5,
    retentionAmount: 225,
    finalTotal: 2300,
    trueProfit: 2075,
    closingRate: 38,
    commissionTier: "5%",
    commissionEarned: 375,
    location: "789 Pine Road, Naperville, IL 60540",
    photos: ["photo1.jpg"],
    vendorName: "Karastan Carpet Warehouse",
    vendorPayout: 700,
    lineItems: [
      { id: "L1", description: "Carpet Installation", quantity: 400, unitCost: 6, total: 2400 },
      { id: "L2", description: "Padding", quantity: 400, unitCost: 2, total: 800 },
      { id: "L3", description: "Labor", quantity: 25, unitCost: 80, total: 2000 },
    ],
  },
  {
    id: "PL-004",
    jobId: "JB-510",
    workOrderId: "WO-007",
    client: "Amanda Foster",
    salesRep: "John Carter",
    subcontractor: "Mike Johnson",
    brand: "Armstrong",
    product: "Hardwood Flooring",
    createDate: "2026-01-08",
    completedDate: "2026-01-15",
    jobStatus: "in_progress",
    paymentStatus: "partial",
    status: "on_hold",
    revenue: 22000,
    totalCosts: 15500,
    subcontractorPayout: 13000,
    paidAmount: 6500,
    holdAmount: 6500,
    retentionPercent: 5,
    retentionAmount: 650,
    finalTotal: 6500,
    trueProfit: 5850,
    closingRate: 46,
    commissionTier: "7%",
    commissionEarned: 1540,
    location: "321 Elm Street, Evanston, IL 60201",
    photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"],
    vendorName: "Armstrong Hardwood Co.",
    vendorPayout: 2500,
    lineItems: [
      { id: "L1", description: "Hardwood Installation", quantity: 1000, unitCost: 12, total: 12000 },
      { id: "L2", description: "Finishing & Staining", quantity: 1, unitCost: 2500, total: 2500 },
      { id: "L3", description: "Labor", quantity: 60, unitCost: 50, total: 3000 },
    ],
  },
  {
    id: "PL-005",
    jobId: "JB-511",
    workOrderId: "WO-008",
    client: "Marcus Chen",
    salesRep: "Sarah Williams",
    subcontractor: "John Smith",
    brand: "Shaw Floors",
    product: "Laminate",
    createDate: "2026-01-09",
    completedDate: "2026-01-16",
    jobStatus: "cancelled",
    paymentStatus: "failed",
    status: "rejected",
    revenue: 9800,
    totalCosts: 6500,
    subcontractorPayout: 5500,
    paidAmount: 0,
    holdAmount: 0,
    retentionPercent: 5,
    retentionAmount: 275,
    finalTotal: 3300,
    trueProfit: 3025,
    closingRate: 42,
    commissionTier: "6%",
    commissionEarned: 588,
    location: "654 Maple Drive, Aurora, IL 60502",
    photos: ["photo1.jpg", "photo2.jpg"],
    vendorName: "Shaw Laminate Supply",
    vendorPayout: 1000,
    lineItems: [
      { id: "L1", description: "Laminate Installation", quantity: 600, unitCost: 7, total: 4200 },
      { id: "L2", description: "Underlayment", quantity: 600, unitCost: 1.5, total: 900 },
      { id: "L3", description: "Labor", quantity: 30, unitCost: 65, total: 1950 },
    ],
  },
]

/* ===================== COMPONENT ===================== */

export default function PayoutLedger() {
  const navigate = useNavigate()

  // Search & Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [salesRepFilter, setSalesRepFilter] = useState<string>("all")
  const [brandFilter, setBrandFilter] = useState<string>("all")

  // NEW FILTERS
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [jobStatusFilter, setJobStatusFilter] = useState<string>("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
  const [subcontractorFilter, setSubcontractorFilter] = useState<string>("all")
  const [closingRateFilter, setClosingRateFilter] = useState<string>("all")
  const [quickDateFilter, setQuickDateFilter] = useState<string>("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [selectedEntry, setSelectedEntry] = useState<PayoutLedgerEntry | null>(null)
  const [showDetailPopup, setShowDetailPopup] = useState(false)

  const [payoutEntry, setPayoutEntry] = useState<PayoutLedgerEntry | null>(null)
  const [showPayoutSidebar, setShowPayoutSidebar] = useState(false)

  const rowsPerPage = 10

  /* ===================== FILTER OPTIONS ===================== */

  const salesReps = useMemo(() => {
    const reps = new Set(payoutLedgerData.map(e => e.salesRep))
    return ["all", ...Array.from(reps)]
  }, [])

  const brands = useMemo(() => {
    const brandSet = new Set(payoutLedgerData.map(e => e.brand))
    return ["all", ...Array.from(brandSet)]
  }, [])

  const subcontractors = useMemo(() => {
    const subs = new Set(payoutLedgerData.map(e => e.subcontractor))
    return ["all", ...Array.from(subs)]
  }, [])

  /* ===================== QUICK DATE FILTER ===================== */

  const getDateRange = (filter: string) => {
    const today = new Date()
    const oneDay = 24 * 60 * 60 * 1000

    switch (filter) {
      case "last_week":
        return {
          from: new Date(today.getTime() - 7 * oneDay),
          to: today
        }
      case "last_month":
        return {
          from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
          to: today
        }
      case "last_3_months":
        return {
          from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
          to: today
        }
      default:
        return null
    }
  }

  /* ===================== CALCULATIONS ===================== */

  const stats = useMemo(() => {
    const totalRevenue = payoutLedgerData.reduce((sum, e) => sum + e.revenue, 0)
    const totalCosts = payoutLedgerData.reduce((sum, e) => sum + e.totalCosts, 0)
    const totalProfit = payoutLedgerData.reduce((sum, e) => sum + e.trueProfit, 0)
    const totalCommissions = payoutLedgerData.reduce((sum, e) => sum + e.commissionEarned, 0)
    const avgClosingRate = payoutLedgerData.reduce((sum, e) => sum + e.closingRate, 0) / payoutLedgerData.length

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      totalCommissions,
      avgClosingRate,
      totalJobs: payoutLedgerData.length,
      profitMargin: ((totalProfit / totalRevenue) * 100).toFixed(1),
    }
  }, [])

  /* ===================== FILTERED DATA ===================== */

  const filtered = useMemo(() => {
    return payoutLedgerData.filter(entry => {
      // Search
      const matchesSearch =
        entry.id.toLowerCase().includes(search.toLowerCase()) ||
        entry.jobId.toLowerCase().includes(search.toLowerCase()) ||
        entry.client.toLowerCase().includes(search.toLowerCase()) ||
        entry.subcontractor.toLowerCase().includes(search.toLowerCase())

      // Status filters
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter
      const matchesSalesRep = salesRepFilter === "all" || entry.salesRep === salesRepFilter
      const matchesBrand = brandFilter === "all" || entry.brand === brandFilter

      // NEW FILTERS
      const matchesJobStatus = jobStatusFilter === "all" || entry.jobStatus === jobStatusFilter
      const matchesPaymentStatus = paymentStatusFilter === "all" || entry.paymentStatus === paymentStatusFilter
      const matchesSubcontractor = subcontractorFilter === "all" || entry.subcontractor === subcontractorFilter

      // Date Range Filter
      let matchesDateRange = true
      if (quickDateFilter !== "all") {
        const range = getDateRange(quickDateFilter)
        if (range) {
          const entryDate = new Date(entry.createDate)
          matchesDateRange = entryDate >= range.from && entryDate <= range.to
        }
      } else if (dateFrom || dateTo) {
        const entryDate = new Date(entry.createDate)
        if (dateFrom && dateTo) {
          matchesDateRange = entryDate >= new Date(dateFrom) && entryDate <= new Date(dateTo)
        } else if (dateFrom) {
          matchesDateRange = entryDate >= new Date(dateFrom)
        } else if (dateTo) {
          matchesDateRange = entryDate <= new Date(dateTo)
        }
      }

      // Closing Rate Filter
      let matchesClosingRate = true
      if (closingRateFilter !== "all") {
        const rate = entry.closingRate
        switch (closingRateFilter) {
          case "0-20":
            matchesClosingRate = rate >= 0 && rate <= 20
            break
          case "20-30":
            matchesClosingRate = rate > 20 && rate <= 30
            break
          case "30-40":
            matchesClosingRate = rate > 30 && rate <= 40
            break
          case "40-50":
            matchesClosingRate = rate > 40 && rate <= 50
            break
          case "above_50":
            matchesClosingRate = rate > 50
            break
        }
      }

      return matchesSearch && matchesStatus && matchesSalesRep && matchesBrand &&
        matchesJobStatus && matchesPaymentStatus && matchesSubcontractor &&
        matchesDateRange && matchesClosingRate
    })
  }, [search, statusFilter, salesRepFilter, brandFilter, jobStatusFilter,
    paymentStatusFilter, subcontractorFilter, dateFrom, dateTo, quickDateFilter, closingRateFilter])

  const totalPages = Math.ceil(filtered.length / rowsPerPage)
  const paginatedData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  /* ===================== STATUS CONFIGS ===================== */

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
      case 'pending':
        return { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock }
      case 'on_hold':
        return { label: 'On Hold', bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertTriangle }
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
      case 'paid':
        return { label: 'Paid', bg: 'bg-blue-100', text: 'text-blue-800', icon: DollarSign }
      default:
        return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText }
    }
  }

  const getJobStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
      case 'in_progress':
        return { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock }
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
      default:
        return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText }
    }
  }

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
      case 'pending':
        return { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock }
      case 'partial':
        return { label: 'Partial', bg: 'bg-blue-100', text: 'text-blue-800', icon: TrendingUp }
      case 'failed':
        return { label: 'Failed', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
      default:
        return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText }
    }
  }

  const clearAllFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setSalesRepFilter("all")
    setBrandFilter("all")
    setJobStatusFilter("all")
    setPaymentStatusFilter("all")
    setSubcontractorFilter("all")
    setClosingRateFilter("all")
    setQuickDateFilter("all")
    setDateFrom("")
    setDateTo("")
  }

  const hasActiveFilters = search || statusFilter !== "all" || salesRepFilter !== "all" ||
    brandFilter !== "all" || jobStatusFilter !== "all" || paymentStatusFilter !== "all" ||
    subcontractorFilter !== "all" || closingRateFilter !== "all" || quickDateFilter !== "all" ||
    dateFrom || dateTo

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payout Ledger</h1>
        <p className="text-gray-600 mt-1">Financial control center - Track revenue, costs, and commissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Costs</p>
              <p className="text-xl font-bold text-gray-900">
                ${stats.totalCosts.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">True Profit</p>
              <p className="text-xl font-bold text-blue-600">
                ${stats.totalProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Commissions</p>
              <p className="text-xl font-bold text-purple-600">
                ${stats.totalCommissions.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Percent className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Closing Rate</p>
              <p className="text-xl font-bold text-orange-600">
                {stats.avgClosingRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== FILTERS SECTION ===================== */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Header Row - Search + Quick Actions */}
        <div className="p-4 border-b bg-gray-50/50">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by Job ID, Client, Subcontractor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white"
              />
            </div>

            {/* Quick Date Tabs */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {[
                { value: "all", label: "All Time" },
                { value: "last_week", label: "Last Week" },
                { value: "last_month", label: "Last Month" },
                { value: "last_3_months", label: "3 Months" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setQuickDateFilter(item.value)
                    if (item.value !== "all") {
                      setDateFrom("")
                      setDateTo("")
                    }
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${quickDateFilter === item.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm rounded-xl text-white bg-primary font-semibold hover:bg-primary/90 transition shadow-sm">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Filter Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {/* Date From */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setQuickDateFilter("all")
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setQuickDateFilter("all")
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Job Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Briefcase size={12} />
                Job Status
              </label>
              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <DollarSign size={12} />
                Payment Status
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Subcontractor */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Users size={12} />
                Subcontractor
              </label>
              <select
                value={subcontractorFilter}
                onChange={(e) => setSubcontractorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                {subcontractors.filter(s => s !== "all").map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Sales Rep */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Users size={12} />
                Sales Rep
              </label>
              <select
                value={salesRepFilter}
                onChange={(e) => setSalesRepFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                {salesReps.filter(r => r !== "all").map(rep => (
                  <option key={rep} value={rep}>{rep}</option>
                ))}
              </select>
            </div>

            {/* Closing Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Percent size={12} />
                Closing Rate
              </label>
              <select
                value={closingRateFilter}
                onChange={(e) => setClosingRateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="0-20">0 - 20%</option>
                <option value="20-30">20 - 30%</option>
                <option value="30-40">30 - 40%</option>
                <option value="40-50">40 - 50%</option>
                <option value="above_50">Above 50%</option>
              </select>
            </div>

            {/* Brand */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Building2 size={12} />
                Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                {brands.filter(b => b !== "all").map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="px-4 py-3 border-t bg-gradient-to-r from-primary/5 to-indigo-50 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Filter size={12} />
              Active Filters:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {quickDateFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                  <Calendar size={12} />
                  {quickDateFilter === "last_week" ? "Last Week" :
                    quickDateFilter === "last_month" ? "Last Month" : "Last 3 Months"}
                  <button onClick={() => setQuickDateFilter("all")} className="text-blue-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {dateFrom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  From: {dateFrom}
                  <button onClick={() => setDateFrom("")} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {dateTo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  To: {dateTo}
                  <button onClick={() => setDateTo("")} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {jobStatusFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                  <Briefcase size={12} />
                  {jobStatusFilter === "completed" ? "Completed" :
                    jobStatusFilter === "in_progress" ? "In Progress" : "Cancelled"}
                  <button onClick={() => setJobStatusFilter("all")} className="text-green-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {paymentStatusFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700">
                  <DollarSign size={12} />
                  {paymentStatusFilter.charAt(0).toUpperCase() + paymentStatusFilter.slice(1)}
                  <button onClick={() => setPaymentStatusFilter("all")} className="text-purple-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {subcontractorFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                  <Users size={12} />
                  {subcontractorFilter}
                  <button onClick={() => setSubcontractorFilter("all")} className="text-indigo-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {salesRepFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-full text-xs font-medium text-cyan-700">
                  <Users size={12} />
                  {salesRepFilter}
                  <button onClick={() => setSalesRepFilter("all")} className="text-cyan-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {closingRateFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-700">
                  <Percent size={12} />
                  {closingRateFilter === "above_50" ? ">50%" : closingRateFilter + "%"}
                  <button onClick={() => setClosingRateFilter("all")} className="text-orange-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}

              {brandFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-medium text-pink-700">
                  <Building2 size={12} />
                  {brandFilter}
                  <button onClick={() => setBrandFilter("all")} className="text-pink-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            {/* Clear All Button */}
            <button
              onClick={clearAllFilters}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X size={14} />
              Clear All
            </button>
          </div>
        )}

        {/* Results Count Bar */}
        <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> results
            {hasActiveFilters && (
              <span className="text-gray-400"> (filtered from {payoutLedgerData.length} total)</span>
            )}
          </p>

        
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Job ID",
                  "WO-ID",
                  "Client",
                  "Sales Rep",
                  "Subcontractor",
                  "Brand/Product",
                  "Create Date",
                  "Closing %",
                  "Commission",
                  "Revenue",
                  "Payout",
                  "Paid Amount",
                  "Hold Amount",
                  "Profit",
                  "Job Status",
                  "Payment Status",
                  "Action"
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={17} className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No records found</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((entry) => {
                  const statusConfig = getStatusConfig(entry.status)
                  const jobStatusConfig = getJobStatusConfig(entry.jobStatus)
                  const paymentStatusConfig = getPaymentStatusConfig(entry.paymentStatus)

                  return (
                    <tr key={entry.id} className="border-t hover:bg-gray-50">
                      {/* Job ID - Clickable */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/jobs/${entry.jobId}`)}
                          className="text-nowrap underline font-semibold text-primary hover:text-primary/80 transition"
                        >
                          {entry.jobId}
                        </button>
                      </td>

                      {/* Work Order ID - Clickable */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/orders/work-order/${entry.workOrderId}`)}
                          className="text-nowrap underline font-semibold text-primary hover:text-primary/80 transition"
                        >
                          {entry.workOrderId}
                        </button>
                      </td>

                      <td className="px-4 py-3">{entry.client}</td>
                      <td className="px-4 py-3">{entry.salesRep}</td>
                      <td className="px-4 py-3">{entry.subcontractor}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{entry.brand}</p>
                          <p className="text-xs text-gray-500">{entry.product}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{entry.createDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[40px]">
                            <div
                              className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                              style={{ width: `${entry.closingRate}%` }}
                            />
                          </div>
                          <span className="font-semibold text-orange-600 text-xs">{entry.closingRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-purple-600">${entry.commissionEarned.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{entry.commissionTier}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-600">
                        ${entry.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedEntry(entry)
                            setShowDetailPopup(true)
                          }}
                          className="font-semibold text-red-600 hover:text-red-700 underline cursor-pointer"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Payout Details"
                        >
                          ${entry.totalCosts.toLocaleString()}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        ${entry.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-amber-600">
                        ${entry.holdAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        ${entry.trueProfit.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${jobStatusConfig.bg} ${jobStatusConfig.text}`}>
                          <jobStatusConfig.icon size={12} />
                          {jobStatusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${paymentStatusConfig.bg} ${paymentStatusConfig.text}`}>
                          <paymentStatusConfig.icon size={12} />
                          {paymentStatusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setPayoutEntry(entry)
                            setShowPayoutSidebar(true)
                          }}
                          className="p-1.5 rounded hover:bg-primary/10 text-primary"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Financial Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{(currentPage - 1) * rowsPerPage + 1}</span>
              {" - "}
              <span className="font-semibold">{Math.min(currentPage * rowsPerPage, filtered.length)}</span>
              {" of "}
              <span className="font-semibold">{filtered.length}</span>
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

      <PayoutDetailsPopup
        isOpen={showDetailPopup}
        onClose={() => setShowDetailPopup(false)}
        entry={selectedEntry}
      />

      <PayoutSidebar
        isOpen={showPayoutSidebar}
        onClose={() => setShowPayoutSidebar(false)}
        entry={payoutEntry}
      />
    </div>
  )
}