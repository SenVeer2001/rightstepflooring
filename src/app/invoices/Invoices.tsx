import {
  Search,
  Filter,
  Plus,
  Eye,
  Download,
  Send,
  MailCheck,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"
import InvoiceViewModal from "../../components/invoice/InvoiceViewModal"


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
  status: "draft" | "sent" | "paid" | "overdue"
  jobId: string
  sentStatus: "sent" | "not_sent"
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
    status: "overdue",
    sentStatus: "not_sent",
    jobId: "492",
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
    status: "overdue",
    sentStatus: "not_sent",
    jobId: "491",
  },
]

/* ================= STATUS STYLES ================= */

const statusStyles: Record<Invoice["status"], string> = {
  overdue: "text-red-600",
  paid: "text-green-600",
  sent: "text-blue-600",
  draft: "text-gray-500",
}

const tabs = [
  { id: "all", label: "All", count: invoiceList.length },
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

        {/* <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#2c621b]">
          <Plus size={18} />
          Create Invoice
        </button> */}
      </div>

      {/* TABS */}
      <div className="flex gap-3 overflow-x-auto">
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
      </div>

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
      <div className="bg-white border rounded-lg overflow-x-auto ">
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
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={13} className="p-8 text-center text-gray-500">
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
                      className=" accent-primary "
                    />
                  </td>

                  <td className="p-3 font-semibold text-primary">{invoice.invoiceId}</td>
                  <td className="p-3 text-gray-600">{invoice.invoiceName}</td>

                  <td className="p-3">
                    <div className="font-semibold">{invoice.clientName}</div>
                    <div className="text-xs text-gray-500">{invoice.clientEmail}</div>
                  </td>

                  <td className="p-3">{invoice.createdAt}</td>
                  <td className="p-3 text-right">${invoice.subTotal.toLocaleString()}</td>
                  <td className="p-3 text-right">${invoice.tax.toFixed(2)}</td>
                  <td className="p-3 text-right">{invoice.discount.toFixed(2)}%</td>
                  <td className="p-3 text-right font-semibold">${invoice.amount.toLocaleString()}</td>
                  <td className="p-3 text-right">${invoice.due.toLocaleString()}</td>

                  <td className="p-3">
                    <div className={`font-semibold ${statusStyles[invoice.status]}`}>
                      {invoice.status === "overdue" ? "Overdue" : invoice.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {invoice.sentStatus === "not_sent" ? "Not sent" : "Sent"}
                    </div>
                  </td>

                  <td className="p-3">{invoice.jobId}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
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

/* ================= ACTION BUTTON ================= */

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex items-center font-semibold gap-2 px-3 py-2 text-sm rounded-lg
      text-primary bg-gray-200 hover:bg-primary hover:text-white transition">
      {children}
    </button>
  )
}
