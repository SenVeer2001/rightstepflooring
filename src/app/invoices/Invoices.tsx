import {
  Search,
  Filter,
  Eye,
  Download,
  Send,
  MailCheck,
  MoreHorizontal,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Percent,
  Zap,
  TrendingUp,
  RefreshCcw,
  CalendarClock,
} from "lucide-react"
import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import InvoiceViewModal from "../../components/invoicePages/InvoiceViewModal"

/* ================= TYPES ================= */

interface Invoice {
  id: string
  invoiceId: string
  invoiceName: string
  clientName: string
  clientEmail: string
  createdAt: string
  subTotal: number
  tax: number
  discount: number
  amount: number
  due: number
  status: "draft" | "sent" | "paid" | "overdue" | "pending" | "approved" | "declined"
  jobId: string
  sentStatus: "sent" | "not_sent"
  appointmentDate?: string
  estimateSentDate?: string
  followUpCount?: number
}

/* ================= MOCK DATA ================= */

const invoiceList: Invoice[] = [
  {
    id: "1",
    invoiceId: "589",
    invoiceName: "Waiting for Quote",
    clientName: "Kathryn Farr",
    clientEmail: "kfarr@email.com",
    createdAt: "Thu Jan 08, 2026",
    subTotal: 12923,
    tax: 0,
    discount: 0,
    amount: 13117.29,
    due: 6461.72,
    status: "pending",
    sentStatus: "not_sent",
    jobId: "492",
    appointmentDate: "2026-01-05",
    estimateSentDate: "2026-01-05",
    followUpCount: 2,
  },
  {
    id: "2",
    invoiceId: "588",
    invoiceName: "Waiting for Quote",
    clientName: "Cindy Kean",
    clientEmail: "ckean@email.com",
    createdAt: "Thu Jan 07, 2026",
    subTotal: 2359,
    tax: 0,
    discount: 0,
    amount: 2359,
    due: 1170.66,
    status: "approved",
    sentStatus: "sent",
    jobId: "491",
    appointmentDate: "2026-01-06",
    estimateSentDate: "2026-01-06",
    followUpCount: 1,
  },
  {
    id: "3",
    invoiceId: "587",
    invoiceName: "Floor Installation",
    clientName: "John Smith",
    clientEmail: "jsmith@email.com",
    createdAt: "Wed Jan 06, 2026",
    subTotal: 5500,
    tax: 440,
    discount: 5,
    amount: 5643,
    due: 0,
    status: "approved",
    sentStatus: "sent",
    jobId: "490",
    appointmentDate: "2026-01-04",
    estimateSentDate: "2026-01-05",
    followUpCount: 3,
  },
  {
    id: "4",
    invoiceId: "586",
    invoiceName: "Kitchen Remodel",
    clientName: "Sarah Johnson",
    clientEmail: "sjohnson@email.com",
    createdAt: "Tue Jan 05, 2026",
    subTotal: 8750,
    tax: 700,
    discount: 0,
    amount: 9450,
    due: 9450,
    status: "declined",
    sentStatus: "sent",
    jobId: "489",
    appointmentDate: "2026-01-03",
    estimateSentDate: "2026-01-04",
    followUpCount: 4,
  },
  {
    id: "5",
    invoiceId: "585",
    invoiceName: "Bathroom Tile",
    clientName: "Mike Wilson",
    clientEmail: "mwilson@email.com",
    createdAt: "Mon Jan 04, 2026",
    subTotal: 3200,
    tax: 256,
    discount: 10,
    amount: 3110.4,
    due: 0,
    status: "approved",
    sentStatus: "sent",
    jobId: "488",
    appointmentDate: "2026-01-02",
    estimateSentDate: "2026-01-02",
    followUpCount: 0,
  },
  {
    id: "6",
    invoiceId: "584",
    invoiceName: "Deck Repair",
    clientName: "Emily Brown",
    clientEmail: "ebrown@email.com",
    createdAt: "Sun Jan 03, 2026",
    subTotal: 4500,
    tax: 360,
    discount: 0,
    amount: 4860,
    due: 4860,
    status: "pending",
    sentStatus: "not_sent",
    jobId: "487",
    appointmentDate: "2026-01-01",
    estimateSentDate: "2026-01-03",
    followUpCount: 1,
  },
]

/* ================= STATUS STYLES ================= */

const statusStyles: Record<Invoice["status"], string> = {
  overdue: "text-red-600",
  paid: "text-green-600",
  sent: "text-blue-600",
  draft: "text-gray-500",
  pending: "text-yellow-600",
  approved: "text-green-600",
  declined: "text-red-600",
}

const tabs = [
  { id: "all", label: "All", count: invoiceList.length },
  { id: "pending", label: "Pending", count: invoiceList.filter(i => i.status === "pending").length },
  { id: "approved", label: "Approved", count: invoiceList.filter(i => i.status === "approved").length },
  { id: "declined", label: "Declined", count: invoiceList.filter(i => i.status === "declined").length },
  { id: "draft", label: "Draft", count: invoiceList.filter(i => i.status === "draft").length },
  { id: "sent", label: "Sent", count: invoiceList.filter(i => i.status === "sent").length },
  { id: "paid", label: "Paid", count: invoiceList.filter(i => i.status === "paid").length },
  { id: "overdue", label: "Overdue", count: invoiceList.filter(i => i.status === "overdue").length },
]

/* ================= COMPONENT ================= */

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  /* ================= STATS CALCULATION ================= */

  const stats = useMemo(() => {
    // Dollar amounts
    const pendingAmount = invoiceList
      .filter(i => i.status === "pending")
      .reduce((sum, i) => sum + i.amount, 0)

    const approvedAmount = invoiceList
      .filter(i => i.status === "approved")
      .reduce((sum, i) => sum + i.amount, 0)

    const declinedAmount = invoiceList
      .filter(i => i.status === "declined")
      .reduce((sum, i) => sum + i.amount, 0)

    // Percentages
    const totalInvoices = invoiceList.length
    const approvedCount = invoiceList.filter(i => i.status === "approved").length
    const approvedPercentage = totalInvoices > 0 ? (approvedCount / totalInvoices) * 100 : 0

    // Same-day estimate sent calculation
    const invoicesWithDates = invoiceList.filter(i => i.appointmentDate && i.estimateSentDate)
    const sameDayCount = invoicesWithDates.filter(i => i.appointmentDate === i.estimateSentDate).length
    const sameDayPercentage = invoicesWithDates.length > 0 
      ? (sameDayCount / invoicesWithDates.length) * 100 
      : 0

    // Average time from appointment to estimate sent (in days)
    let totalDays = 0
    invoicesWithDates.forEach(invoice => {
      const appointmentDate = new Date(invoice.appointmentDate!)
      const estimateSentDate = new Date(invoice.estimateSentDate!)
      const diffTime = Math.abs(estimateSentDate.getTime() - appointmentDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      totalDays += diffDays
    })
    const avgTimeToEstimate = invoicesWithDates.length > 0 
      ? (totalDays / invoicesWithDates.length).toFixed(1) 
      : "0"

    // Estimate-to-close rate (approved / (approved + declined))
    const declinedCount = invoiceList.filter(i => i.status === "declined").length
    const closedTotal = approvedCount + declinedCount
    const estimateToCloseRate = closedTotal > 0 ? (approvedCount / closedTotal) * 100 : 0

    // Average # of Follow up
    const totalFollowUps = invoiceList.reduce((sum, i) => sum + (i.followUpCount || 0), 0)
    const avgFollowUps = totalInvoices > 0 ? (totalFollowUps / totalInvoices).toFixed(1) : "0"

    return {
      pendingAmount,
      approvedAmount,
      declinedAmount,
      approvedPercentage,
      sameDayPercentage,
      avgTimeToEstimate,
      estimateToCloseRate,
      avgFollowUps,
    }
  }, [])

  /* ================= FILTER ================= */

  const filteredInvoices = invoiceList.filter((invoice) => {
    const search = searchTerm.toLowerCase().trim()

    const matchesSearch =
      search === "" ||
      invoice.invoiceId.toLowerCase().includes(search) ||
      invoice.clientName.toLowerCase().includes(search)

    const matchesTab =
      activeTab === "all" || invoice.status === activeTab

    return matchesSearch && matchesTab
  })

  /* ================= SELECTION ================= */

  const toggleSelectInvoice = (id: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(id)
        ? prev.filter((invoiceId) => invoiceId !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map((invoice) => invoice.id))
    }
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track all invoices
          </p>
        </div>
      </div>

      {/* STATS BOXES - ROW 1: Dollar Amounts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
        {/* $Pending$ */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">$ Pending</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">
                ${stats.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <span className="font-medium text-yellow-600">
              {invoiceList.filter(i => i.status === "pending").length}
            </span>
            <span>invoices pending</span>
          </div>
        </div>

        {/* $Approved$ */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">$ Approved</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                ${stats.approvedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <span className="font-medium text-green-600">
              {invoiceList.filter(i => i.status === "approved").length}
            </span>
            <span>invoices approved</span>
          </div>
        </div>

        {/* $Declined$ */}
        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">$ Declined</p>
              <p className="text-xl font-bold text-red-600 mt-1">
                ${stats.declinedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <span className="font-medium text-red-600">
              {invoiceList.filter(i => i.status === "declined").length}
            </span>
            <span>invoices declined</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">% Approved</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                {stats.approvedPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <Percent className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.approvedPercentage}%` }}
              />
            </div>
          </div>
        </div>
         <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Time to Estimate</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {stats.avgTimeToEstimate} <span className="text-sm font-normal">days</span>
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CalendarClock className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            From appointment to estimate sent
          </p>
        </div>

        {/* Estimate-to-close rate */}
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Estimate-to-Close Rate</p>
              <p className="text-2xl font-bold text-teal-600 mt-1">
                {stats.estimateToCloseRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-teal-100 rounded-xl">
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Approved / (Approved + Declined)
          </p>
        </div>

        {/* Average # of Follow up */}
        {/* <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. # of Follow-ups</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {stats.avgFollowUps}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <RefreshCcw className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Per invoice on average
          </p>
        </div> */}
      </div>

    

      {/* TABS */}
      {/* <div className="flex gap-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition
              ${activeTab === tab.id
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div> */}

      {/* BULK ACTIONS */}
      <div className="flex flex-wrap gap-2 items-center p-3">
        <span className="text-sm text-gray-600">
          {selectedInvoices.length} invoices selected
        </span>

        <ActionButton><Send size={16} /> Send invoice</ActionButton>
        <ActionButton><MailCheck size={16} /> Send reminder</ActionButton>
        <ActionButton>✓ Mark sent</ActionButton>
        <ActionButton><MoreHorizontal size={16} /> More</ActionButton>

        <div className="ml-auto">
          <ActionButton><Download size={16} /> Export</ActionButton>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice or client..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
          />
        </div>

        <ActionButton><Filter size={16} /> Filter</ActionButton>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    filteredInvoices.length > 0 &&
                    selectedInvoices.length === filteredInvoices.length
                  }
                  onChange={toggleSelectAll}
                  className="accent-primary"
                />
              </th>
              <th className="p-3 text-left">Invoice No.</th>
              <th className="p-3 text-left">Invoice Name</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-right">Subtotal</th>
              <th className="p-3 text-right">Tax</th>
              <th className="p-3 text-right">Discount</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-right">Due</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Job</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-8 text-center text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.id)}
                      onChange={() => toggleSelectInvoice(invoice.id)}
                      className="accent-primary"
                    />
                  </td>

                  <td className="p-3 font-semibold text-primary">
                    <Link to={`/invoices/${invoice.invoiceId}`} className="text-primary hover:text-blue-500">
                      {invoice.invoiceId}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-600">{invoice.invoiceName}</td>

                  <td className="p-3">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="flex flex-col text-left text-primary border-none hover:underline"
                    >
                      <span className="font-semibold">{invoice.clientName}</span>
                      <span className="text-xs text-gray-500">{invoice.clientEmail}</span>
                    </button>
                  </td>

                  <td className="p-3">{invoice.createdAt}</td>
                  <td className="p-3 text-right">${invoice.subTotal.toLocaleString()}</td>
                  <td className="p-3 text-right">${invoice.tax.toFixed(2)}</td>
                  <td className="p-3 text-right">{invoice.discount.toFixed(2)}%</td>
                  <td className="p-3 text-right font-semibold">${invoice.amount.toLocaleString()}</td>
                  <td className="p-3 text-right">${invoice.due.toLocaleString()}</td>

                  <td className="p-3">
                    <div className={`font-semibold capitalize ${statusStyles[invoice.status]}`}>
                      {invoice.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invoice.sentStatus === "not_sent" ? "Not sent" : "Sent"}
                    </div>
                  </td>

                  <td className="p-3">{invoice.jobId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  )
}

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex items-center font-semibold gap-2 px-3 py-2 text-sm rounded-lg
      text-primary bg-gray-200 hover:bg-primary hover:text-white transition">
      {children}
    </button>
  )
}