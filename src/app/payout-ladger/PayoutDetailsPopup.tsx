import { X, FileText, Users, Percent } from "lucide-react"

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

interface PayoutDetailsPopupProps {
  isOpen: boolean
  onClose: () => void
  entry: PayoutLedgerEntry | null
}

export default function PayoutDetailsPopup({ isOpen, onClose, entry }: PayoutDetailsPopupProps) {
  if (!isOpen || !entry) return null

  const lineItemsTotal = entry.lineItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-primary px-6 py-5 text-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Job #{entry.jobId} - Payout Calculation</h2>
              <p className="text-white/80 text-sm mt-1">{entry.client} • {entry.completedDate}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-xs text-green-600 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-green-700">${entry.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-xs text-red-600 font-medium">Total Costs</p>
              <p className="text-2xl font-bold text-red-700">${entry.totalCosts.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">True Profit</p>
              <p className="text-2xl font-bold text-blue-700">${entry.trueProfit.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-xs text-purple-600 font-medium">Commission</p>
              <p className="text-2xl font-bold text-purple-700">${entry.commissionEarned.toLocaleString()}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={18} />
              Scope of Work - Line Items
            </h3>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">Quantity</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Unit Cost</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {entry.lineItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">${item.unitCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-700">Subtotal:</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">${lineItemsTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-semibold text-amber-700">Retention Held ({entry.retentionPercent}%):</td>
                    <td className="px-4 py-3 text-right font-bold text-amber-700">-${entry.retentionAmount.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-primary/5">
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">Final Total:</td>
                    <td className="px-4 py-3 text-right font-bold text-primary text-lg">${entry.finalTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Sales Rep Commission */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users size={18} />
              Sales Representative Commission
            </h3>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Sales Rep</p>
                  <p className="font-semibold text-gray-900">{entry.salesRep}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Closing Rate</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600"
                        style={{ width: `${entry.closingRate}%` }}
                      />
                    </div>
                    <span className="font-bold text-green-600">{entry.closingRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Commission Tier</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold">
                    <Percent size={12} />
                    {entry.commissionTier}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Commission Earned</p>
                  <p className="font-bold text-purple-700 text-lg">${entry.commissionEarned.toLocaleString()}</p>
                </div>
              </div>

              {/* Commission Tiers Reference */}
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Commission Structure:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>≤40%: 5%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>41-45%: 6%</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>&gt;45%: 7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Subcontractor</p>
              <p className="font-semibold text-gray-900">{entry.subcontractor}</p>
              <p className="text-sm text-gray-600 mt-1">Payout: ${entry.subcontractorPayout.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Brand & Product</p>
              <p className="font-semibold text-gray-900">{entry.brand}</p>
              <p className="text-sm text-gray-600 mt-1">{entry.product}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}