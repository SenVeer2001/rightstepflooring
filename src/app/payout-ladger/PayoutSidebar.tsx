import { X, DollarSign, Mail, Phone, Star, Building2, Eye, MapPin, Camera, Image, Clock, CheckCircle, Briefcase, TrendingUp, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  lineItems: any[]
  location?: string
  photos?: string[]
  vendorName?: string
  vendorPayout?: number
}

interface PayoutSidebarProps {
  isOpen: boolean
  onClose: () => void
  entry: PayoutLedgerEntry | null
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'approved':
      return { label: 'Approved', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
    case 'pending':
      return { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock }
    case 'on_hold':
      return { label: 'On Hold', bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock }
    case 'rejected':
      return { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800', icon: X }
    case 'paid':
      return { label: 'Paid', bg: 'bg-blue-100', text: 'text-blue-800', icon: DollarSign }
    default:
      return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText }
  }
}

export default function PayoutSidebar({ isOpen, onClose, entry }: PayoutSidebarProps) {
  const navigate = useNavigate()

  if (!isOpen || !entry) return null

  const dueAmount = entry.subcontractorPayout - entry.retentionAmount
  const vendorPayout = entry.vendorPayout || (entry.totalCosts - entry.subcontractorPayout)
  const totalPayout = entry.subcontractorPayout + vendorPayout
  const statusConfig = getStatusConfig(entry.status)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-50 shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary px-4 py-3 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <h2 className="text-sm text-white font-bold">Financial Details</h2>
              </div>
              <p className="text-white/80 text-xs mt-0.5">Job #{entry.jobId} • {entry.client}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20">
            <div>
              <p className="text-[10px] text-white/70">Total Payout</p>
              <p className="text-sm font-bold">${totalPayout.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/70">Revenue</p>
              <p className="text-sm font-bold">${entry.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/70">Profit</p>
              <p className="text-sm font-bold text-green-300">${entry.trueProfit.toLocaleString()}</p>
            </div>
            <div className="ml-auto">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white`}>
                <statusConfig.icon size={10} />
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                  <span className="text-sm font-bold">
                    {entry.subcontractor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-blue-200 font-medium uppercase">Subcontractor</p>
                  <p className="text-sm font-bold">{entry.subcontractor}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-yellow-300 fill-yellow-300" />
                      <span className="text-xs">4.8</span>
                    </div>
                    <span className="text-white/50 text-xs">•</span>
                    <span className="text-xs text-blue-200">Flooring</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Mail size={12} className="text-gray-400" />
                  <span>mike.johnson@email.com</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone size={12} className="text-gray-400" />
                  <span>(555) 123-4567</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">Total Payout</p>
                  <p className="text-lg font-bold text-blue-700">${entry.subcontractorPayout.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
                  <p className="text-[10px] text-green-600 font-semibold uppercase">Amount Due</p>
                  <p className="text-lg font-bold text-green-700">${dueAmount.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                  <p className="text-[10px] text-amber-600 font-semibold uppercase">Retention ({entry.retentionPercent}%)</p>
                  <p className="text-lg font-bold text-amber-700">${entry.retentionAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-600 font-semibold uppercase">Jobs Done</p>
                  <p className="text-lg font-bold text-gray-700">156</p>
                </div>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                    <statusConfig.icon size={10} />
                    {statusConfig.label}
                  </span>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                  Process Payment
                </button>
              </div>
            </div>
          </div>

          {/* VENDOR SECTION */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-purple-200 font-medium uppercase">Vendor</p>
                  <p className="text-sm font-bold">{entry.vendorName || entry.brand}</p>
                  <p className="text-xs text-purple-200">{entry.product}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Mail size={12} className="text-gray-400" />
                  <span>orders@{entry.brand.toLowerCase().replace(' ', '')}.com</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone size={12} className="text-gray-400" />
                  <span>(800) 555-0123</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100">
                  <p className="text-[10px] text-purple-600 font-semibold uppercase">Material Cost</p>
                  <p className="text-lg font-bold text-purple-700">${vendorPayout.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
                  <p className="text-[10px] text-gray-600 font-semibold uppercase">Invoice #</p>
                  <p className="text-sm font-bold text-gray-700">INV-{entry.jobId.replace('JB-', '')}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose()
                  navigate(`/orders/work-order/${entry.workOrderId}`)
                }}
                className="w-full mt-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-1.5"
              >
                <Eye size={14} />
                View Work Order
              </button>
            </div>
          </div>

          {/* TOTAL SUMMARY */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-[10px] font-medium text-white/80 uppercase mb-3">Total Payout Summary</p>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-2.5">
                <p className="text-[10px] text-white/70">Subcontractor</p>
                <p className="text-sm font-bold">${entry.subcontractorPayout.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5">
                <p className="text-[10px] text-white/70">Vendor</p>
                <p className="text-sm font-bold">${vendorPayout.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2.5 border border-white/20">
                <p className="text-[10px] text-white/70">Total</p>
                <p className="text-sm font-bold">${totalPayout.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/70">Your Profit</p>
                <p className="text-lg font-bold text-green-200">${entry.trueProfit.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/70">Margin</p>
                <p className="text-sm font-bold">{((entry.trueProfit / entry.revenue) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-red-100 rounded-lg">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Job Location</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-sm text-gray-800">{entry.location || "123 Main Street, Springfield, IL 62701"}</p>
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200 text-xs">
                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="font-semibold text-gray-800">{entry.client}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-semibold text-gray-800">{entry.createDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Completed</p>
                  <p className="font-semibold text-gray-800">{entry.completedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* PHOTOS */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Camera className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-xs font-semibold text-gray-900">Photos</h3>
              </div>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-full">
                4 Photos
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition overflow-hidden group relative"
                >
                  <Image className="w-5 h-5 text-gray-400" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  {i === 1 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-medium rounded">
                      Before
                    </span>
                  )}
                  {i === 4 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-[8px] font-medium rounded">
                      After
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STATUS TIMELINE */}
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-xs font-semibold text-gray-900">Status Timeline</h3>
            </div>

            <div className="space-y-0">
              {[
                { icon: CheckCircle, color: 'bg-green-500', title: 'Approved & Paid', desc: 'Payment processed', date: entry.completedDate },
                { icon: Briefcase, color: 'bg-blue-500', title: 'Job Completed', desc: 'Work finished', date: entry.completedDate },
                { icon: TrendingUp, color: 'bg-yellow-500', title: 'In Progress', desc: 'Work started', date: entry.createDate },
                { icon: FileText, color: 'bg-gray-400', title: 'Created', desc: 'Order generated', date: entry.createDate },
              ].map((item, index, arr) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center`}>
                      <item.icon size={14} className="text-white" />
                    </div>
                    {index !== arr.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}