// pages/WorkOrderGallery.tsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, Clock, MapPin, User,
  Image as ImageIcon, ChevronRight, Eye, LayoutGrid,
  List, SlidersHorizontal, X
} from "lucide-react"

/* ===================== TYPES ===================== */

type WorkOrderStatus = "pending" | "in-progress" | "completed" | "on-hold"

interface WorkOrderImage {
  id: string
  url: string
  title: string
  uploadedAt: string
}

interface WorkOrder {
  id: string
  name: string
  jobId: string
  clientName: string
  status: WorkOrderStatus
  location: string
  assignedTo: string
  images: WorkOrderImage[]
  lastUpdated: string
  createdAt: string
  description: string
}

/* ===================== STATUS CONFIG ===================== */

const STATUS_CONFIG: Record<WorkOrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-700", bgColor: "bg-yellow-50 border border-yellow-200" },
  "in-progress": { label: "In Progress", color: "text-blue-700", bgColor: "bg-blue-50 border border-blue-200" },
  completed: { label: "Completed", color: "text-green-700", bgColor: "bg-green-50 border border-green-200" },
  "on-hold": { label: "On Hold", color: "text-red-700", bgColor: "bg-red-50 border border-red-200" },
}

/* ===================== MOCK DATA ===================== */

const mockWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    name: "Kitchen Renovation - Phase 1",
    jobId: "JOB-480",
    clientName: "John Smith",
    status: "in-progress",
    location: "123 Main St, Springfield, IL",
    assignedTo: "Mike Johnson",
    lastUpdated: "2024-01-15T14:30:00",
    createdAt: "2024-01-10",
    description: "Complete kitchen renovation including cabinets, countertops, and flooring",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", title: "Kitchen Before", uploadedAt: "2024-01-10" },
      { id: "2", url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400", title: "Cabinet Install", uploadedAt: "2024-01-12" },
      { id: "3", url: "https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=400", title: "Countertop Prep", uploadedAt: "2024-01-13" },
      { id: "4", url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400", title: "Progress Shot", uploadedAt: "2024-01-14" },
      { id: "5", url: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400", title: "Detail Work", uploadedAt: "2024-01-15" },
      { id: "6", url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400", title: "Final Touch", uploadedAt: "2024-01-15" },
      { id: "7", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", title: "Completed", uploadedAt: "2024-01-15" },
    ]
  },
  {
    id: "WO-002",
    name: "Bathroom Tile Installation",
    jobId: "JOB-481",
    clientName: "Sarah Williams",
    status: "pending",
    location: "456 Oak Ave, Chicago, IL",
    assignedTo: "Tom Davis",
    lastUpdated: "2024-01-14T10:15:00",
    createdAt: "2024-01-08",
    description: "Install new ceramic tiles in master bathroom",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400", title: "Bathroom Before", uploadedAt: "2024-01-08" },
      { id: "2", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400", title: "Materials", uploadedAt: "2024-01-10" },
      { id: "3", url: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400", title: "Prep Work", uploadedAt: "2024-01-12" },
    ]
  },
  {
    id: "WO-003",
    name: "Living Room Flooring",
    jobId: "JOB-482",
    clientName: "Michael Brown",
    status: "completed",
    location: "789 Pine Rd, Aurora, IL",
    assignedTo: "Lisa Brown",
    lastUpdated: "2024-01-13T16:45:00",
    createdAt: "2024-01-05",
    description: "Hardwood flooring installation in living room area",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", title: "Before Work", uploadedAt: "2024-01-05" },
      { id: "2", url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400", title: "Floor Prep", uploadedAt: "2024-01-07" },
      { id: "3", url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", title: "Installation", uploadedAt: "2024-01-10" },
      { id: "4", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", title: "Completed", uploadedAt: "2024-01-13" },
      { id: "5", url: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400", title: "Final Result", uploadedAt: "2024-01-13" },
    ]
  },
  {
    id: "WO-004",
    name: "Office Carpet Replacement",
    jobId: "JOB-483",
    clientName: "Emma Davis",
    status: "on-hold",
    location: "321 Elm St, Naperville, IL",
    assignedTo: "David Lee",
    lastUpdated: "2024-01-12T09:00:00",
    createdAt: "2024-01-03",
    description: "Replace worn carpet in office space with new commercial-grade carpet",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400", title: "Office View", uploadedAt: "2024-01-03" },
      { id: "2", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400", title: "Current State", uploadedAt: "2024-01-05" },
    ]
  },
  {
    id: "WO-005",
    name: "Basement Waterproofing",
    jobId: "JOB-484",
    clientName: "Robert Johnson",
    status: "in-progress",
    location: "555 Water St, Evanston, IL",
    assignedTo: "Mike Johnson",
    lastUpdated: "2024-01-15T11:20:00",
    createdAt: "2024-01-11",
    description: "Complete basement waterproofing and drainage installation",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", title: "Basement Before", uploadedAt: "2024-01-11" },
      { id: "2", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400", title: "Excavation", uploadedAt: "2024-01-12" },
      { id: "3", url: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400", title: "Drainage", uploadedAt: "2024-01-14" },
      { id: "4", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400", title: "Membrane", uploadedAt: "2024-01-15" },
      { id: "5", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400", title: "Sealing", uploadedAt: "2024-01-15" },
      { id: "6", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", title: "Progress", uploadedAt: "2024-01-15" },
    ]
  },
]

/* ===================== COMPONENT ===================== */

export default function WorkOrderGallery() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<"all" | WorkOrderStatus>("all")
  const [searchText, setSearchText] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null)

  const filteredWorkOrders = mockWorkOrders.filter(wo => {
    const matchesTab = activeTab === "all" || wo.status === activeTab
    const matchesSearch =
      wo.name.toLowerCase().includes(searchText.toLowerCase()) ||
      wo.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      wo.id.toLowerCase().includes(searchText.toLowerCase()) ||
      wo.jobId.toLowerCase().includes(searchText.toLowerCase())
    return matchesTab && matchesSearch
  })

  const tabCounts = {
    all: mockWorkOrders.length,
    pending: mockWorkOrders.filter(wo => wo.status === "pending").length,
    "in-progress": mockWorkOrders.filter(wo => wo.status === "in-progress").length,
    completed: mockWorkOrders.filter(wo => wo.status === "completed").length,
    "on-hold": mockWorkOrders.filter(wo => wo.status === "on-hold").length,
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleWorkOrderClick = (workOrderId: string) => {
    navigate(`/work-order/${workOrderId}`)
  }

  return (
    <div className="">
      <div className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">

        {/* HEADER */}
        <div className="mb-5 md:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Projects Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">
            View all work orders with photos and updates
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          {[
            { id: "all", label: "All" },
            { id: "in-progress", label: "In Progress" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
            { id: "on-hold", label: "On Hold" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "all" | WorkOrderStatus)}
              className={`
                 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                    whitespace-nowrap transition
                ${activeTab === tab.id
                  ? "bg-primary text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                  text-xs px-1.5 py-0.5 rounded-full font-medium
                  ${activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                {tabCounts[tab.id as keyof typeof tabCounts]}
              </span>
            </button>
          ))}
        </div>

        {/* SEARCH & VIEW TOGGLE */}
        <div className="flex gap-2 sm:gap-3 mb-5 justify-between">
          <div className="relative flex-1 max-w-[70%]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search work orders..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white rounded-lg border border-gray-200 px-1 py-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <List size={20} />
              </button>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* WORK ORDERS GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredWorkOrders.map(workOrder => (
              <WorkOrderCard
                key={workOrder.id}
                workOrder={workOrder}
                onClick={() => handleWorkOrderClick(workOrder.id)}
                onPreview={() => setSelectedWorkOrder(workOrder)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* WORK ORDERS LIST */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredWorkOrders.map(workOrder => (
              <WorkOrderListItem
                key={workOrder.id}
                workOrder={workOrder}
                onClick={() => handleWorkOrderClick(workOrder.id)}
                onPreview={() => setSelectedWorkOrder(workOrder)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {filteredWorkOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ImageIcon size={28} className="text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">No work orders found</h3>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {selectedWorkOrder && (
          <WorkOrderPreviewModal
            workOrder={selectedWorkOrder}
            onClose={() => setSelectedWorkOrder(null)}
            onViewDetails={() => {
              handleWorkOrderClick(selectedWorkOrder.id)
              setSelectedWorkOrder(null)
            }}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  )
}

/* ===================== WORK ORDER CARD COMPONENT (GRID VIEW) ===================== */

interface WorkOrderCardProps {
  workOrder: WorkOrder
  onClick: () => void
  onPreview: () => void
  formatDate: (date: string) => string
}

function WorkOrderCard({ workOrder, onClick, onPreview, formatDate }: WorkOrderCardProps) {
  const statusConfig = STATUS_CONFIG[workOrder.status]
  const displayImages = workOrder.images.slice(0, 4)
  const remainingCount = workOrder.images.length - 4

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:bg-primary hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* IMAGE GRID */}
      <div className="relative">
        {workOrder.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-0.5 h-44 sm:h-48">
            {displayImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative overflow-hidden bg-gray-100 ${
                  displayImages.length === 1 ? 'col-span-2 row-span-2' :
                  displayImages.length === 2 ? 'row-span-2' :
                  displayImages.length === 3 && index === 0 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                {index === 3 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">+{remainingCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-44 sm:h-48 bg-gray-50 group-hover:bg-primary/80 flex items-center justify-center transition-colors duration-300">
            <ImageIcon size={36} className="text-gray-200 group-hover:text-white/40" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Quick Preview Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onPreview() }}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye size={14} className="text-gray-600" />
        </button>

        {/* Image Count */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded-full">
          <ImageIcon size={12} className="text-white" />
          <span className="text-white text-xs font-medium">{workOrder.images.length}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-white line-clamp-1 transition-colors duration-300">
            {workOrder.name}
          </h3>
          <span className="text-xs text-gray-400 group-hover:text-white/60 whitespace-nowrap transition-colors duration-300">
            {workOrder.id}
          </span>
        </div>

        <p className="text-sm text-gray-500 group-hover:text-white/70 mb-2.5 transition-colors duration-300">
          {workOrder.clientName} · {workOrder.jobId}
        </p>

        <div className="flex items-center gap-1.5 text-sm text-gray-400 group-hover:text-white/60 mb-3 transition-colors duration-300">
          <MapPin size={13} className="flex-shrink-0" />
          <span className="truncate">{workOrder.location}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-white/20 transition-colors duration-300">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-primary/10 group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300">
              <User size={10} className="text-primary group-hover:text-white" />
            </div>
            <span className="text-xs text-gray-500 group-hover:text-white/70 transition-colors duration-300">
              {workOrder.assignedTo}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white/60 transition-colors duration-300">
            <Clock size={12} />
            <span>{formatDate(workOrder.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================== WORK ORDER LIST ITEM COMPONENT ===================== */

interface WorkOrderListItemProps {
  workOrder: WorkOrder
  onClick: () => void
  onPreview: () => void
  formatDate: (date: string) => string
}

function WorkOrderListItem({ workOrder, onClick, onPreview, formatDate }: WorkOrderListItemProps) {
  const statusConfig = STATUS_CONFIG[workOrder.status]
  const displayImages = workOrder.images.slice(0, 4)
  const remainingCount = workOrder.images.length - 4

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 sm:p-4 hover:bg-primary hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* LEFT: CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-white truncate transition-colors duration-300">
              {workOrder.name}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* IDs */}
          <p className="text-sm text-gray-500 group-hover:text-white/70 mb-2 transition-colors duration-300">
            {workOrder.clientName} · {workOrder.jobId} · {workOrder.id}
          </p>

          {/* Location & Assignee */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 group-hover:text-white/60 mb-2.5 transition-colors duration-300">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="flex-shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-[240px]">{workOrder.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={13} className="flex-shrink-0" />
              <span>{workOrder.assignedTo}</span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white/60 transition-colors duration-300">
              <Clock size={12} />
              <span>{formatDate(workOrder.lastUpdated)}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 group-hover:bg-white/15 rounded-full transition-colors duration-300">
              <ImageIcon size={11} className="text-gray-400 group-hover:text-white/60" />
              <span className="text-xs font-medium text-gray-500 group-hover:text-white/70 transition-colors duration-300">
                {workOrder.images.length} photos
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onPreview() }}
              className="flex items-center gap-1 text-primary group-hover:text-white text-xs font-medium hover:underline transition-colors duration-300"
            >
              <Eye size={13} />
              Preview
            </button>
          </div>
        </div>

        {/* RIGHT: IMAGES GRID */}
        <div className="flex-shrink-0 hidden sm:block">
          {workOrder.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-0.5 w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden">
              {displayImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative overflow-hidden bg-gray-100 ${
                    displayImages.length === 1 ? 'col-span-2 row-span-2' :
                    displayImages.length === 2 ? 'row-span-2' :
                    displayImages.length === 3 && index === 0 ? 'row-span-2' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{remainingCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-50 group-hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors duration-300">
              <ImageIcon size={28} className="text-gray-200 group-hover:text-white/30" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===================== PREVIEW MODAL COMPONENT ===================== */

interface WorkOrderPreviewModalProps {
  workOrder: WorkOrder
  onClose: () => void
  onViewDetails: () => void
  formatDate: (date: string) => string
}

function WorkOrderPreviewModal({ workOrder, onClose, onViewDetails, formatDate }: WorkOrderPreviewModalProps) {
  const statusConfig = STATUS_CONFIG[workOrder.status]

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">{workOrder.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{workOrder.id} · {workOrder.jobId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] sm:max-h-[calc(85vh-150px)]">
          {/* STATUS & INFO */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Clock size={13} />
              <span>{formatDate(workOrder.lastUpdated)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <User size={13} />
              <span>{workOrder.assignedTo}</span>
            </div>
          </div>

          {/* CLIENT & LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Client</p>
              <p className="text-sm font-semibold text-gray-800">{workOrder.clientName}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-medium">Location</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{workOrder.location}</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-medium">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{workOrder.description}</p>
          </div>

          {/* IMAGES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Photos ({workOrder.images.length})
              </h3>
            </div>

            {workOrder.images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {workOrder.images.map((image) => (
                  <div key={image.id} className="relative group/img">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors duration-200 rounded-lg flex items-end">
                      <div className="w-full p-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium truncate">{image.title}</p>
                        <p className="text-white/60 text-xs">{image.uploadedAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <ImageIcon size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No photos uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Details
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}