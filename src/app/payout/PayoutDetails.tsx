import { useMemo, useState } from "react"
import {
  Calendar, ChevronDown, Download, DollarSign, TrendingUp,
  PauseCircle, XCircle, Eye, FileText, ArrowUpRight, ArrowDownRight,
  ChevronLeft, ChevronRight, CheckCircle, Clock, AlertTriangle,
  Wallet, Users, Building2, Star, Search, Filter, X,
  BarChart3, Briefcase, Phone, Mail
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar
} from "recharts"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

/* ===================== TYPES ===================== */

interface PayoutWorkOrder {
  id: string
  jobId: string
  client: string
  completedDate: string
  totalAmount: number
  paidAmount: number
  holdAmount: number
  cancelledAmount: number
  status: 'paid' | 'pending' | 'partial' | 'on_hold' | 'cancelled'
  paymentDate?: string
  reason?: string
}

interface SubcontractorPayout {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  trade: string
  rating: number
  completedJobs: number
  totalToBePaid: number
  totalPaid: number
  totalOnHold: number
  totalCancelled: number
  workOrders: PayoutWorkOrder[]
  status: 'active' | 'inactive' | 'pending'
}

/* ===================== STATIC DATA ===================== */

const subcontractorPayouts: SubcontractorPayout[] = [
  {
    id: "SUB-001",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "(555) 123-4567",
    trade: "Flooring Installation",
    rating: 4.8,
    completedJobs: 156,
    totalToBePaid: 18500,
    totalPaid: 15000,
    totalOnHold: 2500,
    totalCancelled: 1000,
    status: "active",
    workOrders: [
      {
        id: "WO-001",
        jobId: "JB-480",
        client: "Robin Stevens",
        completedDate: "2026-01-12",
        totalAmount: 5000,
        paidAmount: 4500,
        holdAmount: 250,
        cancelledAmount: 250,
        status: "paid",
        paymentDate: "2026-01-15",
      },
      {
        id: "WO-005",
        jobId: "JB-504",
        client: "Jennifer Wilson",
        completedDate: "2026-01-09",
        totalAmount: 3200,
        paidAmount: 3040,
        holdAmount: 160,
        cancelledAmount: 0,
        status: "paid",
        paymentDate: "2026-01-12",
      },
      {
        id: "WO-011",
        jobId: "JB-514",
        client: "Emily Brown",
        completedDate: "2026-01-19",
        totalAmount: 5500,
        paidAmount: 5225,
        holdAmount: 275,
        cancelledAmount: 0,
        status: "paid",
        paymentDate: "2026-01-22",
      },
      {
        id: "WO-015",
        jobId: "JB-520",
        client: "Sarah Thompson",
        completedDate: "2026-01-22",
        totalAmount: 4800,
        paidAmount: 2235,
        holdAmount: 1815,
        cancelledAmount: 750,
        status: "partial",
      },
    ],
  },
  {
    id: "SUB-002",
    name: "Tom Davis",
    email: "tom.davis@email.com",
    phone: "(555) 234-5678",
    trade: "Tile & Stone",
    rating: 4.6,
    completedJobs: 98,
    totalToBePaid: 16800,
    totalPaid: 12075,
    totalOnHold: 1225,
    totalCancelled: 3500,
    status: "active",
    workOrders: [
      {
        id: "WO-003",
        jobId: "JB-506",
        client: "Kristopher Decker",
        completedDate: "2026-01-13",
        totalAmount: 8500,
        paidAmount: 8075,
        holdAmount: 425,
        cancelledAmount: 0,
        status: "paid",
        paymentDate: "2026-01-16",
      },
      {
        id: "WO-009",
        jobId: "JB-512",
        client: "Lisa Rodriguez",
        completedDate: "2026-01-17",
        totalAmount: 4500,
        paidAmount: 0,
        holdAmount: 0,
        cancelledAmount: 4500,
        status: "cancelled",
        reason: "Dispute - Quality issues",
      },
      {
        id: "WO-013",
        jobId: "JB-516",
        client: "Sarah Thompson",
        completedDate: "2026-01-21",
        totalAmount: 3800,
        paidAmount: 4000,
        holdAmount: 800,
        cancelledAmount: 0,
        status: "pending",
      },
    ],
  },
  {
    id: "SUB-003",
    name: "Sarah Miller",
    email: "sarah.miller@email.com",
    phone: "(555) 345-6789",
    trade: "Carpet Installation",
    rating: 4.9,
    completedJobs: 203,
    totalToBePaid: 17500,
    totalPaid: 6000,
    totalOnHold: 11225,
    totalCancelled: 275,
    status: "active",
    workOrders: [
      {
        id: "WO-007",
        jobId: "JB-510",
        client: "Amanda Foster",
        completedDate: "2026-01-15",
        totalAmount: 12000,
        paidAmount: 6000,
        holdAmount: 5725,
        cancelledAmount: 275,
        status: "partial",
        paymentDate: "2026-01-18",
      },
      {
        id: "WO-010",
        jobId: "JB-513",
        client: "David Kim",
        completedDate: "2026-01-18",
        totalAmount: 5500,
        paidAmount: 0,
        holdAmount: 5500,
        cancelledAmount: 0,
        status: "on_hold",
        reason: "Pending quality inspection",
      },
    ],
  },
  {
    id: "SUB-004",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 456-7890",
    trade: "Hardwood Flooring",
    rating: 4.5,
    completedJobs: 87,
    totalToBePaid: 15950,
    totalPaid: 0,
    totalOnHold: 15950,
    totalCancelled: 0,
    status: "pending",
    workOrders: [
      {
        id: "WO-008",
        jobId: "JB-511",
        client: "Marcus Chen",
        completedDate: "2026-01-16",
        totalAmount: 6750,
        paidAmount: 0,
        holdAmount: 6750,
        cancelledAmount: 0,
        status: "on_hold",
        reason: "Pending quality inspection",
      },
      {
        id: "WO-012",
        jobId: "JB-515",
        client: "James Wilson",
        completedDate: "2026-01-20",
        totalAmount: 9200,
        paidAmount: 0,
        holdAmount: 9200,
        cancelledAmount: 0,
        status: "pending",
      },
    ],
  },
  {
    id: "SUB-005",
    name: "David Martinez",
    email: "david.martinez@email.com",
    phone: "(555) 567-8901",
    trade: "Vinyl & Laminate",
    rating: 4.7,
    completedJobs: 134,
    totalToBePaid: 8200,
    totalPaid: 7790,
    totalOnHold: 410,
    totalCancelled: 0,
    status: "active",
    workOrders: [
      {
        id: "WO-014",
        jobId: "JB-518",
        client: "Robert Johnson",
        completedDate: "2026-01-19",
        totalAmount: 4500,
        paidAmount: 4275,
        holdAmount: 225,
        cancelledAmount: 0,
        status: "paid",
        paymentDate: "2026-01-22",
      },
      {
        id: "WO-016",
        jobId: "JB-522",
        client: "Michelle Lee",
        completedDate: "2026-01-23",
        totalAmount: 3700,
        paidAmount: 3515,
        holdAmount: 185,
        cancelledAmount: 0,
        status: "paid",
        paymentDate: "2026-01-26",
      },
    ],
  },
]

// Monthly trend data
const monthlyTrendData = [
  { month: "Aug", toBePaid: 45000, paid: 38000, hold: 4500, cancelled: 2500 },
  { month: "Sep", toBePaid: 52000, paid: 45000, hold: 5200, cancelled: 1800 },
  { month: "Oct", toBePaid: 48000, paid: 42000, hold: 4800, cancelled: 1200 },
  { month: "Nov", toBePaid: 61000, paid: 55000, hold: 4500, cancelled: 1500 },
  { month: "Dec", toBePaid: 58000, paid: 50000, hold: 5800, cancelled: 2200 },
  { month: "Jan", toBePaid: 76950, paid: 40865, hold: 31310, cancelled: 4775 },
]

// Top performers data for bar chart
const topPerformersData = [
  { name: "Mike J.", paid: 15000, pending: 3500 },
  { name: "Tom D.", paid: 12075, pending: 4725 },
  { name: "David M.", paid: 7790, pending: 410 },
  { name: "Sarah M.", paid: 6000, pending: 11500 },
  { name: "John S.", paid: 0, pending: 15950 },
]

/* ===================== COMPONENT ===================== */

export default function PayoutDetailsBySubcontractor() {
  const navigate = useNavigate()

  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [showCalendar, setShowCalendar] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'on_hold' | 'cancelled'>('all')
  const [expandedSubcontractor, setExpandedSubcontractor] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<SubcontractorPayout | null>(null)
  const [showDetailPopup, setShowDetailPopup] = useState(false)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  /* ===================== CALCULATIONS ===================== */

  const stats = useMemo(() => {
    const totalToBePaid = subcontractorPayouts.reduce((sum, s) => sum + s.totalToBePaid, 0)
    const totalPaid = subcontractorPayouts.reduce((sum, s) => sum + s.totalPaid, 0)
    const totalOnHold = subcontractorPayouts.reduce((sum, s) => sum + s.totalOnHold, 0)
    const totalCancelled = subcontractorPayouts.reduce((sum, s) => sum + s.totalCancelled, 0)

    const totalWorkOrders = subcontractorPayouts.reduce((sum, s) => sum + s.workOrders.length, 0)
    const paidWorkOrders = subcontractorPayouts.reduce((sum, s) => 
      sum + s.workOrders.filter(w => w.status === 'paid').length, 0)
    const pendingWorkOrders = subcontractorPayouts.reduce((sum, s) => 
      sum + s.workOrders.filter(w => w.status === 'pending' || w.status === 'partial').length, 0)
    const holdWorkOrders = subcontractorPayouts.reduce((sum, s) => 
      sum + s.workOrders.filter(w => w.status === 'on_hold').length, 0)
    const cancelledWorkOrders = subcontractorPayouts.reduce((sum, s) => 
      sum + s.workOrders.filter(w => w.status === 'cancelled').length, 0)

    return {
      totalToBePaid,
      totalPaid,
      totalOnHold,
      totalCancelled,
      totalWorkOrders,
      paidWorkOrders,
      pendingWorkOrders,
      holdWorkOrders,
      cancelledWorkOrders,
      totalSubcontractors: subcontractorPayouts.length,
      paidPercentage: ((totalPaid / totalToBePaid) * 100).toFixed(1),
      holdPercentage: ((totalOnHold / totalToBePaid) * 100).toFixed(1),
    }
  }, [])

  // Pie chart data
  const pieChartData = [
    { name: "Amount Paid", value: stats.totalPaid, color: "#10B981" },
    { name: "Amount on Hold", value: stats.totalOnHold, color: "#F59E0B" },
    { name: "Amount Cancelled", value: stats.totalCancelled, color: "#EF4444" },
    { name: "Pending Payment", value: stats.totalToBePaid - stats.totalPaid - stats.totalOnHold - stats.totalCancelled, color: "#6366F1" },
  ]

  // Filtered subcontractors
  const filteredSubcontractors = useMemo(() => {
    let filtered = subcontractorPayouts

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.trade.toLowerCase().includes(query)
      )
    }

    return filtered.sort((a, b) => b.totalToBePaid - a.totalToBePaid)
  }, [searchQuery])

  /* ===================== STATUS HELPERS ===================== */

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: CheckCircle }
      case 'pending':
        return { label: 'Pending', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', icon: Clock }
      case 'partial':
        return { label: 'Partial', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: TrendingUp }
      case 'on_hold':
        return { label: 'On Hold', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300', icon: PauseCircle }
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: XCircle }
      default:
        return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: FileText }
    }
  }

  const getSubcontractorStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' }
      case 'inactive':
        return { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-700' }
      case 'pending':
        return { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' }
      default:
        return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-700' }
    }
  }

  /* ===================== CALENDAR HANDLERS ===================== */

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(prev => prev - 1)
    } else {
      setSelectedMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(prev => prev + 1)
    } else {
      setSelectedMonth(prev => prev + 1)
    }
  }

  /* ===================== CUSTOM TOOLTIPS ===================== */

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">${entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const PieCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / stats.totalToBePaid) * 100).toFixed(1)
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="font-semibold text-gray-800">{data.name}</span>
          </div>
          <p className="text-lg font-bold mt-1">${data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  /* ===================== DETAIL POPUP ===================== */

  const SubcontractorDetailPopup = () => {
    if (!showDetailPopup || !selectedSubcontractor) return null

    const sub = selectedSubcontractor
    const statusConfig = getSubcontractorStatusConfig(sub.status)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDetailPopup(false)}
        />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
          {/* Header */}
          <div className="sticky top-0 bg-primary  px-6 py-5 text-white z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {sub.avatar ? (
                  <img src={sub.avatar} alt={sub.name} className="w-14 h-14 rounded-full border-2 border-white/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                    <span className="text-xl font-bold">{sub.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{sub.name}</h2>
                  <p className="text-white/80 text-sm">{sub.trade}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-300 fill-yellow-300" />
                      <span className="text-sm font-medium">{sub.rating}</span>
                    </div>
                    <span className="text-white/60">•</span>
                    <span className="text-sm text-white/80">{sub.completedJobs} jobs completed</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDetailPopup(false)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-gray-400" />
                {sub.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                {sub.phone}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                {statusConfig.label}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-medium">Total To Be Paid</p>
                <p className="text-xl font-bold text-gray-900">${sub.totalToBePaid.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium">Total Paid</p>
                <p className="text-xl font-bold text-green-600">${sub.totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-xs text-amber-600 font-medium">On Hold</p>
                <p className="text-xl font-bold text-amber-600">${sub.totalOnHold.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-600 font-medium">Cancelled</p>
                <p className="text-xl font-bold text-red-600">${sub.totalCancelled.toLocaleString()}</p>
              </div>
            </div>

            {/* Work Orders Table */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-900">Work Orders ({sub.workOrders.length})</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Work Order</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Job ID</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Client</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Completed</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-600">Paid</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sub.workOrders.map(wo => {
                    const woStatus = getStatusConfig(wo.status)
                    return (
                      <tr key={wo.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-primary">#{wo.id}</td>
                        <td className="px-4 py-3">{wo.jobId}</td>
                        <td className="px-4 py-3">{wo.client}</td>
                        <td className="px-4 py-3 text-gray-600">{wo.completedDate}</td>
                        <td className="px-4 py-3 text-right font-semibold">${wo.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">${wo.paidAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${woStatus.bg} ${woStatus.text}`}>
                            <woStatus.icon size={12} />
                            {woStatus.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      
      {/* Header with Calendar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payout Details</h1>
          <p className="text-gray-600 mt-1">Overview of all payouts by subcontractors</p>
        </div>

        {/* Calendar Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span>{months[selectedMonth]} {selectedYear}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 w-72">
                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="font-semibold text-gray-800">
                    {months[selectedMonth]} {selectedYear}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Month Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {months.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => {
                        setSelectedMonth(index)
                        setShowCalendar(false)
                      }}
                      className={`px-3 py-2 text-sm rounded-lg transition ${
                        index === selectedMonth
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>

                {/* Year Selector */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t">
                  <button
                    onClick={() => setSelectedYear(prev => prev - 1)}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    {selectedYear - 1}
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold bg-primary text-white rounded-lg">
                    {selectedYear}
                  </span>
                  <button
                    onClick={() => setSelectedYear(prev => prev + 1)}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    {selectedYear + 1}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg text-white bg-primary font-semibold hover:bg-primary/90 transition shadow-sm">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Amount To Be Paid */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Amount To Be Paid</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalToBePaid.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                From {stats.totalWorkOrders} work orders by {stats.totalSubcontractors} subcontractors
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <ArrowUpRight className="w-3 h-3 text-green-500" />
            <span className="text-green-600 font-medium">+15.2%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Total Amount Paid */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Amount Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${stats.totalPaid.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {stats.paidWorkOrders} payments completed
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">{stats.paidPercentage}% of total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${stats.paidPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Amount on Hold */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Amount on Hold</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                ${stats.totalOnHold.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                5% retention + {stats.holdWorkOrders} orders on hold
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <PauseCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">{stats.holdPercentage}% of total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all"
                style={{ width: `${stats.holdPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Amount Cancelled */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Amount Cancelled</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                ${stats.totalCancelled.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {stats.cancelledWorkOrders} cancelled due to disputes
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <ArrowDownRight className="w-3 h-3 text-green-500" />
            <span className="text-green-600 font-medium">-12.5%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Payout Distribution</h3>
              <p className="text-sm text-gray-500">Breakdown by status</p>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<PieCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600 text-xs">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Payment Trends</h3>
              <p className="text-sm text-gray-500">Last 6 months overview</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorToBePaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="toBePaid" 
                  name="To Be Paid"
                  stroke="#6366F1" 
                  fillOpacity={1} 
                  fill="url(#colorToBePaid)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="paid" 
                  name="Paid"
                  stroke="#10B981" 
                  fillOpacity={1} 
                  fill="url(#colorPaid)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

     

      {/* Subcontractor Cards */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Payout by Subcontractor</h3>
              <p className="text-sm text-gray-500">Click to expand and see work order details</p>
            </div>
            
            {/* Search */}
            <div className="relative">
              {/* <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                placeholder="Search subcontractor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none w-full md:min-w-[500px]"
              />
            </div>
          </div>
        </div>

        <div className="divide-y">
          {filteredSubcontractors.map((sub) => {
            const subStatus = getSubcontractorStatusConfig(sub.status)
            const isExpanded = expandedSubcontractor === sub.id
            
            return (
              <div key={sub.id}>
                {/* Subcontractor Row */}
                <button
                  onClick={() => setExpandedSubcontractor(isExpanded ? null : sub.id)}
                  className="w-full p-4 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      {sub.avatar ? (
                        <img src={sub.avatar} alt={sub.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {sub.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{sub.name}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${subStatus.bg} ${subStatus.text}`}>
                            {subStatus.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">{sub.trade}</span>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-600">{sub.rating}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{sub.workOrders.length} work orders</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">Total Payout</p>
                        <p className="font-semibold text-gray-900">${sub.totalToBePaid.toLocaleString()}</p>
                      </div>
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="font-semibold text-green-600">${sub.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-gray-500">On Hold</p>
                        <p className="font-semibold text-amber-600">${sub.totalOnHold.toLocaleString()}</p>
                      </div>
                      <div className="text-right hidden lg:block">
                        <p className="text-xs text-gray-500">Cancelled</p>
                        <p className="font-semibold text-red-600">${sub.totalCancelled.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSubcontractor(sub)
                            setShowDetailPopup(true)
                          }}
                          className="p-2 hover:bg-primary/10 rounded-lg transition text-primary"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Full Details"
                        >
                          <Eye size={18} />
                        </button>
                        <ChevronDown 
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 flex gap-0.5 h-1 rounded-full overflow-hidden bg-gray-100">
                    <div 
                      className="bg-green-500 transition-all"
                      style={{ width: `${(sub.totalPaid / sub.totalToBePaid) * 100}%` }}
                      data-tooltip-id="action-tooltip"
                      data-tooltip-content={`Paid: $${sub.totalPaid.toLocaleString()}`}
                    />
                    <div 
                      className="bg-amber-500 transition-all"
                      style={{ width: `${(sub.totalOnHold / sub.totalToBePaid) * 100}%` }}
                      data-tooltip-id="action-tooltip"
                      data-tooltip-content={`On Hold: $${sub.totalOnHold.toLocaleString()}`}
                    />
                    <div 
                      className="bg-red-500 transition-all"
                      style={{ width: `${(sub.totalCancelled / sub.totalToBePaid) * 100}%` }}
                      data-tooltip-id="action-tooltip"
                      data-tooltip-content={`Cancelled: $${sub.totalCancelled.toLocaleString()}`}
                    />
                  </div>
                </button>

                {/* Expanded Work Orders */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t">
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b">
                              <th className="pb-2 font-medium">Work Order</th>
                              <th className="pb-2 font-medium">Job ID</th>
                              <th className="pb-2 font-medium">Client</th>
                              <th className="pb-2 font-medium">Completed</th>
                              <th className="pb-2 font-medium text-right">Total</th>
                              <th className="pb-2 font-medium text-right">Paid</th>
                              <th className="pb-2 font-medium text-right">Hold</th>
                              <th className="pb-2 font-medium text-center">Status</th>
                              <th className="pb-2 font-medium">Reason</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sub.workOrders.map(order => {
                              const statusConfig = getStatusConfig(order.status)
                              return (
                                <tr key={order.id} className="border-t border-gray-200 hover:bg-white">
                                  <td className="py-3">
                                    <button
                                      onClick={() => navigate(`/payouts/${order.id}`)}
                                      className="font-semibold text-primary hover:underline"
                                    >
                                      #{order.id}
                                    </button>
                                  </td>
                                  <td className="py-3">{order.jobId}</td>
                                  <td className="py-3">{order.client}</td>
                                  <td className="py-3 text-gray-600">{order.completedDate}</td>
                                  <td className="py-3 text-right font-semibold">${order.totalAmount.toLocaleString()}</td>
                                  <td className="py-3 text-right font-semibold text-green-600">${order.paidAmount.toLocaleString()}</td>
                                  <td className="py-3 text-right font-semibold text-amber-600">${order.holdAmount.toLocaleString()}</td>
                                  <td className="py-3 text-center">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                      <statusConfig.icon size={12} />
                                      {statusConfig.label}
                                    </span>
                                  </td>
                                  <td className="py-3 text-gray-500 text-xs max-w-[150px] truncate">
                                    {order.reason || '-'}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                          <tfoot className="border-t-2 border-gray-300 bg-gray-100">
                            <tr>
                              <td colSpan={4} className="py-3 font-semibold text-gray-700">Totals</td>
                              <td className="py-3 text-right font-bold text-gray-900">
                                ${sub.totalToBePaid.toLocaleString()}
                              </td>
                              <td className="py-3 text-right font-bold text-green-600">
                                ${sub.totalPaid.toLocaleString()}
                              </td>
                              <td className="py-3 text-right font-bold text-amber-600">
                                ${sub.totalOnHold.toLocaleString()}
                              </td>
                              <td colSpan={2}></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {filteredSubcontractors.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No subcontractors found</p>
            </div>
          )}
        </div>
      </div>

 

      {/* Tooltips */}
      <Tooltip
        id="action-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded z-50"
      />

      {/* Detail Popup */}
      <SubcontractorDetailPopup />
    </div>
  )
}