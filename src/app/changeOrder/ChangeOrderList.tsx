import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  FileText,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react'

interface ChangeItem {
  id: string
  currentItem: string
  description: string
  quantity: number
  currentPrice: number
  newPrice: number
  costImpact: number
  timeImpact: number
  type: 'delete' | 'modify' | 'add'
  image?: string
}

interface ChangeOrder {
  id: string
  orderNumber: string
  projectType: string
  jobNumber: string
  date: string
  owner: string
  ownerAddress: string
  pm: string
  status: 'pending' | 'approved' | 'rejected' | 'draft'
  originalContractValue: number
  items: ChangeItem[]
}

// Sample Data - Same structure as ChangeOrderView
const changeOrdersData: ChangeOrder[] = [
  {
    id: "1",
    orderNumber: "JOB-1134",
    projectType: "Residential Renovation",
    jobNumber: "1134",
    date: "2024-01-15",
    owner: "Trang Leminh",
    ownerAddress: "5534 Jessip St, Morrisville, NC 27560",
    pm: "John Manager",
    status: "pending",
    originalContractValue: 5835,
    items: [
      {
        id: "1",
        currentItem: "Paint Estimate",
        description: "Paint - Labor\nPatching small holes\nPrep walls / sanding\nPrime all walls\nPaint walls (2 coats)\nPaint baseboard trim",
        quantity: 2000,
        currentPrice: 2.5,
        newPrice: 0,
        costImpact: -5000,
        timeImpact: -3,
        type: "delete",
        image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg"
      },
    ],
  },
  {
    id: "2",
    orderNumber: "JOB-1135",
    projectType: "Commercial Flooring",
    jobNumber: "1135",
    date: "2024-01-14",
    owner: "John Smith",
    ownerAddress: "123 Business Ave, Raleigh, NC 27601",
    pm: "Sarah Wilson",
    status: "approved",
    originalContractValue: 12500,
    items: [
      {
        id: "1",
        currentItem: "LVP Flooring",
        description: "LVP Installation\nRemove old flooring\nLevel subfloor\nInstall LVP",
        quantity: 1000,
        currentPrice: 0,
        newPrice: 5.0,
        costImpact: 5000,
        timeImpact: 2,
        type: "add",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"
      },
      {
        id: "2",
        currentItem: "Carpet Removal",
        description: "Remove existing carpet\nDispose materials",
        quantity: 500,
        currentPrice: 1.5,
        newPrice: 0,
        costImpact: -750,
        timeImpact: -1,
        type: "delete",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "JOB-1136",
    projectType: "Kitchen Remodel",
    jobNumber: "1136",
    date: "2024-01-13",
    owner: "Sarah Wilson",
    ownerAddress: "456 Oak Street, Durham, NC 27701",
    pm: "Mike Johnson",
    status: "rejected",
    originalContractValue: 8000,
    items: [
      {
        id: "1",
        currentItem: "Cabinet Installation",
        description: "Install upper cabinets\nInstall lower cabinets\nAdd hardware",
        quantity: 20,
        currentPrice: 150,
        newPrice: 180,
        costImpact: 600,
        timeImpact: 1,
        type: "modify",
      },
    ],
  },
  {
    id: "4",
    orderNumber: "JOB-1137",
    projectType: "Bathroom Renovation",
    jobNumber: "1137",
    date: "2024-01-12",
    owner: "Mike Johnson",
    ownerAddress: "789 Pine Road, Cary, NC 27513",
    pm: "John Manager",
    status: "draft",
    originalContractValue: 6500,
    items: [
      {
        id: "1",
        currentItem: "Tile Installation",
        description: "Floor tile\nWall tile\nGrout and seal",
        quantity: 100,
        currentPrice: 0,
        newPrice: 8.0,
        costImpact: 800,
        timeImpact: 2,
        type: "add",
      },
    ],
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

  // Filter orders
  const filteredOrders = changeOrdersData.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const totalPending = changeOrdersData.filter(o => o.status === 'pending').length
  const totalApproved = changeOrdersData.filter(o => o.status === 'approved').length
  
  // Calculate total change value from all orders
  const totalChangeValue = changeOrdersData.reduce((sum, order) => {
    const orderChange = order.items.reduce((itemSum, item) => itemSum + item.costImpact, 0)
    return sum + orderChange
  }, 0)

  // Helper function to calculate order totals
  const getOrderTotals = (order: ChangeOrder) => {
    const changeAmount = order.items.reduce((sum, item) => sum + item.costImpact, 0)
    const daysImpact = order.items.reduce((sum, item) => sum + item.timeImpact, 0)
    const newTotal = order.originalContractValue + changeAmount
    return { changeAmount, daysImpact, newTotal }
  }

  return (
    <div className="p-4 md:p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Change Orders</h1>
        <p className="text-gray-600 mt-1">Manage all project change orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search by order #, project, owner, job #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Create New Button */}
            {/* <button 
              onClick={() => navigate('/change-orders/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" />
              New Change Order
            </button> */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#JobID </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Original $</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Change $</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">New Total $</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Days</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Items</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon
                const { changeAmount, daysImpact, newTotal } = getOrderTotals(order)
                
                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/change-orders/${order.id}`)}
                  >
                    {/* Order Number */}
                    <td className="px-4 py-3 text-nowrap">
                      <span className="font-semibold text-green-600">{order.orderNumber}</span>
                    </td>
                    
                    {/* Project */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.projectType}</p>
                        <p className="text-xs text-gray-500">Job #{order.jobNumber}</p>
                      </div>
                    </td>
                    
                    {/* Owner */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-900">{order.owner}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{order.ownerAddress}</p>
                      </div>
                    </td>
                    
                    {/* Date */}
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    
                    {/* Original Value */}
                    <td className="px-4 py-3 text-right text-gray-700">
                      ${order.originalContractValue.toLocaleString()}
                    </td>
                    
                    {/* Change Amount */}
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {changeAmount >= 0 ? '+' : ''}${changeAmount.toLocaleString()}
                      </span>
                    </td>
                    
                    {/* New Total */}
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      ${newTotal.toLocaleString()}
                    </td>
                    
                    {/* Days Impact */}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                        daysImpact > 0 ? 'text-orange-600' : 
                        daysImpact < 0 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {daysImpact > 0 ? '+' : ''}{daysImpact}
                      </span>
                    </td>
                    
                    {/* Items Count */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {order.items.length}
                      </span>
                    </td>
                    
                    {/* Actions */}
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
                          onClick={() => navigate(`/change-orders/${order.id}/edit`)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this change order?')) {
                              // Handle delete
                              console.log('Delete:', order.id)
                            }
                          }}
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

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No change orders found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
            <button 
              onClick={() => navigate('/change-orders/new')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" />
              Create New Change Order
            </button>
          </div>
        )}
      </div>

      {/* Pagination (Optional - can add later) */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <p>Showing {filteredOrders.length} of {changeOrdersData.length} change orders</p>
        </div>
      )}
    </div>
  )
}