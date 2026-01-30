import { Plus } from "lucide-react"

interface Payment {
  id: number
  date: string
  amount: number
  type: string
  status: "completed" | "pending" | "failed"
}

interface PaymentsTabProps {
  payments?: Payment[]
  onAddPayment?: () => void
}

export function PaymentsTab({ payments = [], onAddPayment }: PaymentsTabProps) {
  const statusStyles: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
        <button
          onClick={onAddPayment}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold"
        >
          <Plus size={18} />
          Add Payment
        </button>
      </div>

      {/* Payments Table */}
      {payments.length > 0 ? (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{payment.date}</td>
                    <td className="px-4 py-3 text-right font-semibold">${payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{payment.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[payment.status]}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">No payments recorded yet</p>
        </div>
      )}
    </div>
  )
}
