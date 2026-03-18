import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface ChangeOrder {
  id: string
  orderNumber: string
  projectName: string
  jobNumber: string
  owner: string
  date: string
  status: 'pending' | 'approved' | 'rejected' | 'draft'
  originalValue: number
  changeAmount: number
  newTotal: number
  daysImpact: number
  itemsChanged: number
}

const changeOrdersData: ChangeOrder[] = [
  {
    id: "1",
    orderNumber: "CO-1134-001",
    projectName: "Paint Estimate - Trang Leminh",
    jobNumber: "1134",
    owner: "Trang Leminh",
    date: "2024-01-15",
    status: "pending",
    originalValue: 5835,
    changeAmount: -835,
    newTotal: 5000,
    daysImpact: 0,
    itemsChanged: 1
  },
  {
    id: "2",
    orderNumber: "CO-1135-001",
    projectName: "Flooring Install - John Smith",
    jobNumber: "1135",
    owner: "John Smith",
    date: "2024-01-14",
    status: "approved",
    originalValue: 12500,
    changeAmount: 2500,
    newTotal: 15000,
    daysImpact: 3,
    itemsChanged: 2
  },
  {
    id: "3",
    orderNumber: "CO-1136-001",
    projectName: "Kitchen Remodel - Sarah Wilson",
    jobNumber: "1136",
    owner: "Sarah Wilson",
    date: "2024-01-13",
    status: "rejected",
    originalValue: 8000,
    changeAmount: 1500,
    newTotal: 9500,
    daysImpact: 5,
    itemsChanged: 3
  },
  {
    id: "4",
    orderNumber: "CO-1137-001",
    projectName: "Bathroom Renovation - Mike Johnson",
    jobNumber: "1137",
    owner: "Mike Johnson",
    date: "2024-01-12",
    status: "draft",
    originalValue: 6500,
    changeAmount: 800,
    newTotal: 7300,
    daysImpact: 2,
    itemsChanged: 1
  },
]

const statusConfig = {
  pending: { 
    label: 'Pending', 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700',
    icon: AlertCircle
  },
  approved: { 
    label: 'Approved', 
    bg: 'bg-green-100', 
    text: 'text-green-700',
    icon: CheckCircle
  },
  rejected: { 
    label: 'Rejected', 
    bg: 'bg-red-100', 
    text: 'text-red-700',
    icon: XCircle
  },
  draft: { 
    label: 'Draft', 
    bg: 'bg-gray-100', 
    text: 'text-gray-700',
    icon: FileText
  },
}

export default function ChangeOrderList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = changeOrdersData.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalPending = changeOrdersData.filter(o => o.status === 'pending').length
  const totalApproved = changeOrdersData.filter(o => o.status === 'approved').length
  const totalChangeValue = changeOrdersData.reduce((sum, o) => sum + o.changeAmount, 0)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Change Orders</h1>
        <p className="text-gray-600 mt-1">Manage all project change orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{changeOrdersData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{totalPending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-bold text-gray-900">{totalApproved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Impact</p>
              <p className={`text-xl font-bold ${totalChangeValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChangeValue >= 0 ? '+' : ''}${totalChangeValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl border shadow-sm mb-6">
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order #, project, owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Create New Button */}
            <button 
              onClick={() => navigate('/change-orders/new')}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition"
            >
              <Plus className="w-4 h-4" />
              New Change Order
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Original $</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Change $</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">New Total</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Days</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/change-orders/${order.id}`)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.projectName}</p>
                        <p className="text-xs text-gray-500">Job #{order.jobNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{order.owner}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ${order.originalValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${order.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {order.changeAmount >= 0 ? '+' : ''}${order.changeAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ${order.newTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 ${order.daysImpact > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
                        {order.daysImpact > 0 ? `+${order.daysImpact}` : order.daysImpact}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => navigate(`/change-orders/${order.id}`)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No change orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}