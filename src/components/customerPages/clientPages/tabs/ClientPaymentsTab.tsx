import { Search } from 'lucide-react'

interface ClientPaymentsTabProps {
  clientId: string
}

export function ClientPaymentsTab({ clientId }: ClientPaymentsTabProps) {
  // Mock payments data
  const payments = [
    {
      id: "1",
      jobId: "480",
      date: "Sat Dec 27, 2025 06:42 am",
      amount: "1289.48",
      type: "Bank Transfer (ACH)",
      approvalCode: "-",
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Job Id</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Approval Code</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-semibold text-primary">{payment.jobId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.date}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{payment.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.approvalCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">No payments found for this client.</p>
        </div>
      )}
    </div>
  )
}
