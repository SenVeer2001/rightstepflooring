import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

interface ClientInvoicesTabProps {
  clientId: string
}

export function ClientInvoicesTab({ clientId }: ClientInvoicesTabProps) {
  const navigate = useNavigate()

  // Mock invoices data
  const invoices = [
    {
      id: "1",
      invoiceNumber: "558",
      createdDate: "Mon Dec 29, 2025 0...",
      sent: "Not sent",
      total: "2578.95",
      amountDue: "1289.47",
      pastDue: "1289.47",
      dueBy: "Sat Dec 06, 2025 12...",
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Pay Button */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
        <button className="ml-4 px-4 py-2 text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
          💳 Pay unpaid invoices
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Id</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Sent</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount Due</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Past Due</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Due By</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <td className="px-6 py-4 text-sm font-semibold text-primary">{invoice.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.createdDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.sent}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.total}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.amountDue}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.pastDue}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">No invoices found for this client.</p>
        </div>
      )}
    </div>
  )
}
