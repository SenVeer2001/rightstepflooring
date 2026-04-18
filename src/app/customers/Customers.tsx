import { useState, useRef, useEffect } from "react"
import {
  Search, Filter, Plus, RefreshCcw, Tag, X, Check,
  Eye, Trash2, Download, UserCog, Mail, Phone, ShoppingCart, FileText,
  ShoppingBag, Briefcase, ChevronDown, ChevronUp
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CreateClientModal } from "../../components/customerPages/CreateClientModal"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import { ShoppingListModal } from "./ShoppingListModal"
import { PriceBookModal } from "../../components/PriceBookModal"

/* ===================== TYPES ===================== */

type CustomerStatus = "active" | "inactive" | "pending" | "vip"

type JobStatus = "in-progress" | "completed" | "scheduled" | "cancelled" | "on-hold"

interface AssignedJob {
  jobId: string
  title: string
  status: JobStatus
  scheduledDate: string
  amount: number
}

interface Customer {
  id: string
  jobId: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  state: string
  zip: string
  totalJobs: number
  totalSpent: number
  status: CustomerStatus
  tags: string[]
  joinDate: string
  assignedJobs: AssignedJob[]
}

interface PriceBookItem {
  id: string
  name: string
  price: number
  image: string
}

interface PriceBookCategory {
  id: string
  name: string
  image: string
  items: PriceBookItem[]
}

interface ShoppingListItem {
  id: string
  itemId: string
  name: string
  price: number
  quantity: number
  image: string
  total: number
}

/* ===================== STATUS CONFIG ===================== */

const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  vip: "VIP",
}

const statusStyles: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-800 border-green-300",
  inactive: "bg-gray-100 text-gray-800 border-gray-300",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  vip: "bg-purple-100 text-purple-800 border-purple-300",
}

/* ===================== JOB STATUS CONFIG ===================== */

const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  "in-progress": "In Progress",
  "completed": "Completed",
  "scheduled": "Scheduled",
  "cancelled": "Cancelled",
  "on-hold": "On Hold",
}

const jobStatusStyles: Record<JobStatus, string> = {
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  "completed": "bg-green-100 text-green-800 border-green-300",
  "scheduled": "bg-orange-100 text-orange-800 border-orange-300",
  "cancelled": "bg-red-100 text-red-800 border-red-300",
  "on-hold": "bg-yellow-100 text-yellow-800 border-yellow-300",
}

/* ===================== AVAILABLE TAGS ===================== */

const availableTags = [
  { id: "priority", label: "Priority", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "vip", label: "VIP", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "new-customer", label: "New Customer", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "returning", label: "Returning", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "commercial", label: "Commercial", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: "residential", label: "Residential", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { id: "follow-up", label: "Follow Up", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "high-value", label: "High Value", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "referral", label: "Referral", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { id: "contract", label: "Contract", color: "bg-rose-100 text-rose-700 border-rose-200" },
]

const tagColorMap: Record<string, string> = {
  "Priority": "bg-red-100 text-red-700 border border-red-200",
  "VIP": "bg-purple-100 text-purple-700 border border-purple-200",
  "New Customer": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Returning": "bg-blue-100 text-blue-700 border border-blue-200",
  "Commercial": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Residential": "bg-teal-100 text-teal-700 border border-teal-200",
  "Follow Up": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "High Value": "bg-amber-100 text-amber-700 border border-amber-200",
  "Referral": "bg-cyan-100 text-cyan-700 border border-cyan-200",
  "Contract": "bg-rose-100 text-rose-700 border border-rose-200",
}

const getTagColor = (tagLabel: string): string => {
  return tagColorMap[tagLabel] || "bg-gray-100 text-gray-700 border border-gray-200"
}

/* ===================== PRICE BOOK DATA ===================== */

const priceBookData: PriceBookCategory[] = [
  {
    id: "flooring",
    name: "Flooring Install",
    image: "https://images.pexels.com/photos/48889/cleaning-washing-cleanup-the-ilo-48889.jpeg",
    items: [
      { id: "lvp", name: "LVP Installation", price: 2.5, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea" },
      { id: "hardwood", name: "Hardwood Installation", price: 4.25, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
      { id: "tile-floor", name: "Tile Flooring", price: 5.75, image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed" },
    ],
  },
  {
    id: "carpet",
    name: "Carpet Services",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
    items: [
      { id: "carpet-install", name: "Carpet Installation", price: 1.67, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
      { id: "carpet-removal", name: "Carpet Removal", price: 0.85, image: "https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg" },
      { id: "carpet-clean", name: "Carpet Deep Cleaning", price: 0.95, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6" },
    ],
  },
  {
    id: "painting",
    name: "Painting",
    image: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828",
    items: [
      { id: "interior-paint", name: "Interior Wall Painting", price: 1.5, image: "https://images.pexels.com/photos/6764289/pexels-photo-6764289.jpeg" },
      { id: "exterior-paint", name: "Exterior Painting", price: 2.75, image: "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg" },
      { id: "ceiling-paint", name: "Ceiling Painting", price: 1.9, image: "https://images.pexels.com/photos/69903/pexels-photo-69903.jpeg" },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    items: [
      { id: "faucet-install", name: "Faucet Installation", price: 120, image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea" },
      { id: "toilet-install", name: "Toilet Installation", price: 180, image: "https://images.pexels.com/photos/10421641/pexels-photo-10421641.jpeg" },
      { id: "leak-fix", name: "Leak Repair", price: 95, image: "https://images.pexels.com/photos/11658940/pexels-photo-11658940.jpeg" },
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    image: "https://images.pexels.com/photos/9989522/pexels-photo-9989522.jpeg",
    items: [
      { id: "light-install", name: "Light Fixture Installation", price: 85, image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da" },
      { id: "ceiling-fan", name: "Ceiling Fan Installation", price: 120, image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a" },
      { id: "switch-repair", name: "Switch / Socket Repair", price: 65, image: "https://images.pexels.com/photos/7596370/pexels-photo-7596370.jpeg" },
    ],
  },
]

/* ===================== MOCK DATA ===================== */

const customersData: Customer[] = [
  {
    id: "1",
    jobId: "480",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    company: "Smith Heating",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    totalJobs: 5,
    totalSpent: 12500,
    status: "active",
    tags: ["Priority", "Commercial"],
    joinDate: "2025-06-15",
    assignedJobs: [
      {
        jobId: "JOB-480",
        title: "HVAC System Installation",
        status: "in-progress",
        scheduledDate: "2025-07-10",
        amount: 4500,
      },
      {
        jobId: "JOB-481",
        title: "Furnace Repair",
        status: "scheduled",
        scheduledDate: "2025-07-15",
        amount: 1200,
      },
      {
        jobId: "JOB-482",
        title: "Duct Cleaning",
        status: "completed",
        scheduledDate: "2025-06-20",
        amount: 800,
      },
    ],
  },
  {
    id: "2",
    jobId: "398",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "(555) 234-5678",
    company: "Williams Electric",
    address: "456 Oak Ave",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    totalJobs: 12,
    totalSpent: 28300,
    status: "vip",
    tags: ["VIP", "High Value", "Returning"],
    joinDate: "2024-03-20",
    assignedJobs: [
      {
        jobId: "JOB-398",
        title: "Electrical Panel Upgrade",
        status: "in-progress",
        scheduledDate: "2025-07-05",
        amount: 3200,
      },
      {
        jobId: "JOB-399",
        title: "Whole House Rewiring",
        status: "scheduled",
        scheduledDate: "2025-08-01",
        amount: 8500,
      },
      {
        jobId: "JOB-400",
        title: "Outdoor Lighting Installation",
        status: "completed",
        scheduledDate: "2025-06-10",
        amount: 2100,
      },
      {
        jobId: "JOB-401",
        title: "EV Charger Installation",
        status: "completed",
        scheduledDate: "2025-05-15",
        amount: 1800,
      },
      {
        jobId: "JOB-402",
        title: "Generator Hook-up",
        status: "on-hold",
        scheduledDate: "2025-09-01",
        amount: 4200,
      },
    ],
  },
  {
    id: "3",
    jobId: "490",
    name: "Michael Brown",
    email: "mbrown@email.com",
    phone: "(555) 345-6789",
    company: "Brown Landscaping",
    address: "789 Pine Rd",
    city: "Aurora",
    state: "IL",
    zip: "60505",
    totalJobs: 8,
    totalSpent: 19200,
    status: "active",
    tags: ["Residential", "Referral"],
    joinDate: "2025-01-10",
    assignedJobs: [
      {
        jobId: "JOB-490",
        title: "Lawn Renovation",
        status: "in-progress",
        scheduledDate: "2025-07-08",
        amount: 2800,
      },
      {
        jobId: "JOB-491",
        title: "Patio Paver Installation",
        status: "scheduled",
        scheduledDate: "2025-07-20",
        amount: 5500,
      },
    ],
  },
  {
    id: "4",
    jobId: "890",
    name: "Emma Davis",
    email: "emma.d@email.com",
    phone: "(555) 456-7890",
    company: "Davis Painting",
    address: "321 Elm St",
    city: "Naperville",
    state: "IL",
    zip: "60540",
    totalJobs: 3,
    totalSpent: 5600,
    status: "inactive",
    tags: ["Follow Up"],
    joinDate: "2023-11-05",
    assignedJobs: [
      {
        jobId: "JOB-890",
        title: "Interior Painting - Living Room",
        status: "completed",
        scheduledDate: "2025-04-15",
        amount: 2200,
      },
    ],
  },
  {
    id: "5",
    jobId: "567",
    name: "Robert Johnson",
    email: "r.johnson@email.com",
    phone: "(555) 567-8901",
    company: "Johnson Plumbing",
    address: "555 Water St",
    city: "Evanston",
    state: "IL",
    zip: "60201",
    totalJobs: 2,
    totalSpent: 3400,
    status: "pending",
    tags: ["New Customer"],
    joinDate: "2025-06-01",
    assignedJobs: [],
  },
]

/* ===================== DROPDOWN TYPES ===================== */

type ActiveDropdown = "status" | "tags" | null

/* ===================== ASSIGNED JOBS CELL COMPONENT ===================== */

function AssignedJobsCell({ jobs, navigate }: { jobs: AssignedJob[]; navigate: (path: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (jobs.length === 0) {
    return (
      <span className="text-gray-400 text-xs italic">No jobs assigned</span>
    )
  }

  const visibleJobs = isExpanded ? jobs : jobs.slice(0, 2)
  const hasMore = jobs.length > 2

  return (
    <div className="space-y-1.5 min-w-[220px]">
      {visibleJobs.map((job) => (
        <div
          key={job.jobId}
          className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
        >
          <div className="flex-shrink-0">
            <Briefcase size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => navigate(`/jobs/${job.jobId}`)}
                className="text-xs font-semibold text-primary hover:text-blue-600 hover:underline truncate"
              >
                {job.jobId}
              </button>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border whitespace-nowrap ${jobStatusStyles[job.status]
                  }`}
              >
                {JOB_STATUS_LABELS[job.status]}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 truncate" title={job.title}>
              {job.title}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-semibold text-gray-700">
              ${job.amount.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400">
              {new Date(job.scheduledDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-primary hover:text-blue-600 font-medium px-1.5 py-0.5 rounded hover:bg-primary/5 transition-colors w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={12} />
              Show less
            </>
          ) : (
            <>
              <ChevronDown size={12} />
              +{jobs.length - 2} more job{jobs.length - 2 > 1 ? "s" : ""}
            </>
          )}
        </button>
      )}

      {/* Job count summary */}
      <div className="flex items-center gap-2 px-1.5 pt-1 border-t border-gray-100">
        <span className="text-[10px] text-gray-400 font-medium">
          Total: {jobs.length} job{jobs.length > 1 ? "s" : ""}
        </span>
        <span className="text-[10px] text-gray-300">•</span>
        <span className="text-[10px] font-semibold text-gray-500">
          ${jobs.reduce((sum, j) => sum + j.amount, 0).toLocaleString()}
        </span>
      </div>
    </div>
  )
}

/* ===================== COMPONENT ===================== */

export function Customers() {

  const navigate = useNavigate()

  const [customers, setCustomers] = useState<Customer[]>(customersData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | CustomerStatus>("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFields, setShowFields] = useState(false)
  const [openCreateClient, setOpenCreateClient] = useState(false)

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const tagsDropdownRef = useRef<HTMLDivElement>(null)

  // Price Book Modal State
  const [isPriceBookOpen, setIsPriceBookOpen] = useState(false)

  // Shopping List State
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([])

  const [isShoppingListViewOpen, setIsShoppingListViewOpen] = useState(false)
  const [selectedClientForView, setSelectedClientForView] = useState<Customer | null>(null)

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    status: true,
    tags: true,
    assignedJobs: true,
    company: true,
    address: true,
    phone: true,
    created: true,
    action: true,
  })

  const hasSelection = selectedIds.size > 0

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ===================== PRICE BOOK HANDLER ===================== */

  const handleAddToShoppingList = (item: PriceBookItem, quantity: number) => {
    const newShoppingItem: ShoppingListItem = {
      id: Date.now().toString(),
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      image: item.image,
      total: item.price * quantity,
    }

    setShoppingListItems(prev => [...prev, newShoppingItem])
  }

  const handleRemoveFromShoppingList = (itemId: string) => {
    setShoppingListItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleClearShoppingList = () => {
    setShoppingListItems([])
  }

  const shoppingListTotal = shoppingListItems.reduce((sum, item) => sum + item.total, 0)

  /* ===================== VIEW SHOPPING LIST HANDLER ===================== */

  const handleViewShoppingList = (customer: Customer) => {
    setSelectedClientForView(customer)
    setIsShoppingListViewOpen(true)
  }

  /* ===================== STATUS TABS ===================== */

  const customerStatusTabs = [
    { id: "all", label: "All" },
    ...Object.entries(CUSTOMER_STATUS_LABELS).map(([key, label]) => ({
      id: key,
      label: label,
    })),
  ]

  const statusCounts: Record<string, number> = {
    all: customers.length,
    ...customers.reduce<Record<string, number>>((acc, customer) => {
      acc[customer.status] = (acc[customer.status] || 0) + 1
      return acc
    }, {}),
  }

  /* ===================== FILTER LOGIC ===================== */

  const filteredCustomers = customers.filter(customer => {
    const search = searchTerm.toLowerCase().trim()
    const phone = customer.phone.replace(/\D/g, "")

    const matchesSearch =
      search === "" ||
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      phone.includes(search.replace(/\D/g, "")) ||
      customer.company?.toLowerCase().includes(search) ||
      customer.assignedJobs.some(job =>
        job.jobId.toLowerCase().includes(search) ||
        job.title.toLowerCase().includes(search)
      )

    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  /* ===================== SELECTION ===================== */

  const isAllSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every(c => selectedIds.has(c.id))

  const isSomeSelected =
    filteredCustomers.some(c => selectedIds.has(c.id)) && !isAllSelected

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCustomers.map(c => c.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  /* ===================== STATUS HANDLERS ===================== */

  const handleStatusChange = (customerId: string, newStatus: CustomerStatus) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      )
    )
  }

  const handleBulkStatusChange = (newStatus: CustomerStatus) => {
    setCustomers(prev =>
      prev.map(customer =>
        selectedIds.has(customer.id) ? { ...customer, status: newStatus } : customer
      )
    )
    setActiveDropdown(null)
  }

  /* ===================== TAG HANDLERS ===================== */

  const handleBulkAddTag = (tagLabel: string) => {
    setCustomers(prev =>
      prev.map(customer => {
        if (selectedIds.has(customer.id)) {
          const currentTags = customer.tags || []
          if (!currentTags.includes(tagLabel)) {
            return { ...customer, tags: [...currentTags, tagLabel] }
          }
        }
        return customer
      })
    )
    setActiveDropdown(null)
  }

  const handleBulkRemoveTag = (tagLabel: string) => {
    setCustomers(prev =>
      prev.map(customer => {
        if (selectedIds.has(customer.id)) {
          const currentTags = customer.tags || []
          return { ...customer, tags: currentTags.filter(t => t !== tagLabel) }
        }
        return customer
      })
    )
  }

  const getSelectedCustomersTags = () => {
    const selectedCustomersList = customers.filter(c => selectedIds.has(c.id))
    const allTags = selectedCustomersList.flatMap(c => c.tags || [])
    return [...new Set(allTags)]
  }

  /* ===================== DELETE HANDLER ===================== */

  const handleDelete = (customerId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this client?")
    if (!confirmed) return

    setCustomers(prev => prev.filter(c => c.id !== customerId))
    selectedIds.delete(customerId)
    setSelectedIds(new Set(selectedIds))
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} client(s)?`
    )
    if (!confirmed) return

    setCustomers(prev => prev.filter(c => !selectedIds.has(c.id)))
    setSelectedIds(new Set())
  }

  /* ===================== UI ===================== */

  return (
    <div className="p-6 space-y-6 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-600">
            Manage your client database
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPriceBookOpen(true)}
            className="flex text-sm items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart size={18} />
            Client Shopping List
          </button>

          <button
            onClick={() => setOpenCreateClient(true)}
            className="flex text-sm items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </div>

      {/* SHOPPING LIST PREVIEW */}
      {shoppingListItems.length > 0 && (
        <div className="bg-white border border-primary/20 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={20} className="text-primary" />
              Shopping List ({shoppingListItems.length} items)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPriceBookOpen(true)}
                className="px-3 py-1.5 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                + Add More
              </button>
              <button
                onClick={handleClearShoppingList}
                className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {shoppingListItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">
                    ${item.total.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveFromShoppingList(item.id)}
                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="text-xl font-bold text-primary">
              ${shoppingListTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Clients" value={customers.length} />
        <StatCard
          label="Active Clients"
          value={customers.filter(c => c.status === "active").length}
        />
        <StatCard
          label="VIP Clients"
          value={customers.filter(c => c.status === "vip").length}
        />
        <StatCard
          label="Pending client"
          value={customers.filter(c => c.status === "pending").length}
        />
      </div>

      {/* STATUS TABS */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {customerStatusTabs.map((tab) => {
          const isActive = filterStatus === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
                whitespace-nowrap transition
                ${isActive
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {tab.label}
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                  }
                `}
              >
                {statusCounts[tab.id] || 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* SEARCH & BULK ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="Search by name, email, phone, company, or job..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasSelection && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
              <span className="text-sm font-medium text-primary">
                {selectedIds.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="p-0.5 hover:bg-primary/20 rounded"
              >
                <X size={14} className="text-primary" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
            {/* Change Status Button */}
            <div className="relative" ref={statusDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Change Status"
                  className={`p-2 rounded transition-colors ${activeDropdown === "status"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                    }`}
                >
                  <RefreshCcw size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select clients to change status"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <RefreshCcw size={20} />
                </button>
              )}

              {activeDropdown === "status" && hasSelection && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 py-2">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Change Status</p>
                  </div>
                  {Object.entries(CUSTOMER_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                    <button
                      key={statusKey}
                      onClick={() => handleBulkStatusChange(statusKey as CustomerStatus)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusStyles[statusKey as CustomerStatus]}`}>
                        {statusLabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modify Tags Button */}
            <div className="relative" ref={tagsDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "tags" ? null : "tags")}
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Modify Tags"
                  className={`p-2 rounded transition-colors ${activeDropdown === "tags"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                    }`}
                >
                  <Tag size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select clients to modify tags"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Tag size={20} />
                </button>
              )}

              {activeDropdown === "tags" && hasSelection && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Add Tags</p>
                  </div>

                  {availableTags.map((tag) => {
                    const selectedTags = getSelectedCustomersTags()
                    const isApplied = selectedTags.includes(tag.label)

                    return (
                      <button
                        key={tag.id}
                        onClick={() => isApplied ? handleBulkRemoveTag(tag.label) : handleBulkAddTag(tag.label)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between gap-2"
                      >
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${tag.color}`}>
                          {tag.label}
                        </span>
                        {isApplied && (
                          <Check size={16} className="text-green-600" />
                        )}
                      </button>
                    )
                  })}

                  {getSelectedCustomersTags().length > 0 && (
                    <>
                      <div className="px-3 py-2 border-t border-b mt-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Current Tags</p>
                      </div>
                      <div className="px-3 py-2 flex flex-wrap gap-1">
                        {getSelectedCustomersTags().map(tag => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${getTagColor(tag)}`}
                          >
                            {tag}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBulkRemoveTag(tag)
                              }}
                              className="hover:opacity-70"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Send Email */}
            {hasSelection ? (
              <button
                data-tooltip-id="quick-actions-tooltip"
                data-tooltip-content="Send Email"
                className="p-2 rounded hover:bg-primary hover:text-white text-gray-700 transition-colors"
              >
                <Mail size={20} />
              </button>
            ) : (
              <button
                data-tooltip-id="disabled-tooltip"
                data-tooltip-content="Select clients to send email"
                className="p-2 rounded text-gray-400 cursor-not-allowed"
                disabled
              >
                <Mail size={20} />
              </button>
            )}

            {/* Delete */}
            {hasSelection ? (
              <button
                onClick={handleBulkDelete}
                data-tooltip-id="quick-actions-tooltip"
                data-tooltip-content="Delete Selected"
                className="p-2 rounded hover:bg-red-500 hover:text-white text-gray-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            ) : (
              <button
                data-tooltip-id="disabled-tooltip"
                data-tooltip-content="Select clients to delete"
                className="p-2 rounded text-gray-400 cursor-not-allowed"
                disabled
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
            <Download size={16} /> Export
          </button>

          <div className="relative">
            <button
              onClick={() => setShowFields(!showFields)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Fields
            </button>

            {showFields && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-3 z-20 w-48">
                {Object.keys(visibleColumns).map(key => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[key as keyof typeof visibleColumns]}
                      onChange={() =>
                        setVisibleColumns(prev => ({
                          ...prev,
                          [key]: !prev[key as keyof typeof prev],
                        }))
                      }
                      className="accent-primary"
                    />
                    {key === "assignedJobs"
                      ? "Assigned Jobs"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
     <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
  <table className="w-full text-sm">
    <thead className="bg-gray-100 border-b">
      <tr>
        <th className="px-4 py-3 w-12">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={input => {
              if (input) {
                input.indeterminate = isSomeSelected
              }
            }}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
          />
        </th>

        {visibleColumns.id && (
          <th className="px-4 py-3 text-left font-semibold">Client ID</th>
        )}
        {visibleColumns.name && (
          <th className="px-4 py-3 text-left font-semibold">Client Info</th>
        )}
        {visibleColumns.status && (
          <th className="px-4 py-3 text-left font-semibold">Status</th>
        )}
        {visibleColumns.tags && (
          <th className="px-4 py-3 text-left font-semibold">Tags</th>
        )}
        {visibleColumns.company && (
          <th className="px-4 py-3 text-left font-semibold">Company</th>
        )}
        {visibleColumns.assignedJobs && (
          <th className="px-4 py-3 text-left font-semibold">
            <div className="flex items-center gap-1.5">
              <Briefcase size={14} />
              Assigned Jobs
            </div>
          </th>
        )}
        {visibleColumns.created && (
          <th className="px-4 py-3 text-left font-semibold">Created</th>
        )}
        {visibleColumns.action && (
          <th className="px-4 py-3 text-left font-semibold">Action</th>
        )}
      </tr>
    </thead>

    <tbody>
      {filteredCustomers.length === 0 ? (
        <tr>
          <td colSpan={9} className="text-center py-10 text-gray-500">
            No clients found
          </td>
        </tr>
      ) : (
        filteredCustomers.map(customer => {
          const isSelected = selectedIds.has(customer.id)
          return (
            <tr
              key={customer.id}
              className={`border-b hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-blue-50" : ""
              }`}
            >
             
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(customer.id)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                />
              </td>

              {/* Client ID */}
              {visibleColumns.id && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => navigate(`/client/${customer.id}`)}
                    className="font-semibold text-primary hover:text-blue-600 hover:underline"
                  >
                    #{customer.id}
                  </button>
                </td>
              )}

              {/* ✅ Client Info - Name + Email + Phone + Address combined */}
              {visibleColumns.name && (
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2.5 min-w-[240px]">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">
                        {customer.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      {/* Name */}
                      <button
                        onClick={() => navigate(`/client/${customer.id}`)}
                        className="font-semibold text-primary hover:text-blue-600 hover:underline text-left text-sm leading-tight"
                      >
                        {customer.name}
                      </button>

                      {/* Email */}
                      <a
                        href={`mailto:${customer.email}`}
                        className="text-xs text-blue-500 hover:underline leading-tight"
                      >
                        {customer.email}
                      </a>

                      {/* Phone */}
                      <a
                        href={`tel:${customer.phone}`}
                        className="text-xs text-gray-500 hover:text-primary transition-colors leading-tight"
                      >
                        {customer.phone}
                      </a>

                      {/* Address */}
                      <p className="text-xs text-gray-400 leading-tight">
                        {customer.address}, {customer.city}, {customer.state} {customer.zip}
                      </p>
                    </div>
                  </div>
                </td>
              )}

              {/* Status */}
              {visibleColumns.status && (
                <td className="px-4 py-3 min-w-[150px]">
                  <select
                    value={customer.status}
                    onChange={(e) =>
                      handleStatusChange(customer.id, e.target.value as CustomerStatus)
                    }
                    className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[customer.status]}`}
                  >
                    {Object.entries(CUSTOMER_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                      <option key={statusKey} value={statusKey}>
                        {statusLabel}
                      </option>
                    ))}
                  </select>
                </td>
              )}

              {/* Tags */}
              {visibleColumns.tags && (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {(customer.tags ?? []).length > 0 ? (
                      (customer.tags ?? []).map(tag => (
                        <span
                          key={tag}
                          className={`px-2 py-0.5 text-xs font-medium rounded ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs italic">No tags</span>
                    )}
                  </div>
                </td>
              )}

              {/* Company */}
              {visibleColumns.company && (
                <td className="px-4 py-3 text-gray-700">
                  {customer.company || "-"}
                </td>
              )}

              {/* ✅ Assigned Jobs - with outer border */}
              {visibleColumns.assignedJobs && (
                <td className="px-4 py-3 align-top">
                  {customer.assignedJobs && customer.assignedJobs.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl p-2 bg-gray-50 min-w-[230px] shadow-sm">
                      <AssignedJobsCell
                        jobs={customer.assignedJobs}
                        navigate={navigate}
                      />
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded-xl p-3 min-w-[230px] flex items-center justify-center">
                      <span className="text-gray-400 text-xs italic">No jobs assigned</span>
                    </div>
                  )}
                </td>
              )}

              {/* Created */}
              {visibleColumns.created && (
                <td className="px-4 py-3 text-nowrap text-gray-500">
                  {new Date(customer.joinDate).toLocaleDateString()}
                </td>
              )}

              {/* Action */}
              {visibleColumns.action && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewShoppingList(customer)}
                      data-tooltip-id="action-tooltip"
                      data-tooltip-content="View Shopping List"
                      className="p-1.5 rounded hover:bg-emerald-100 text-emerald-600 transition-colors"
                    >
                      <ShoppingBag size={16} />
                    </button>

                    <button
                      onClick={() => navigate(`/client/${customer.id}`)}
                      data-tooltip-id="action-tooltip"
                      data-tooltip-content="View Client"
                      className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(customer.id)}
                      data-tooltip-id="action-tooltip"
                      data-tooltip-content="Delete Client"
                      className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          )
        })
      )}
    </tbody>
  </table>
</div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.map(customer => {
          const isSelected = selectedIds.has(customer.id)

          return (
            <div
              key={customer.id}
              className={`bg-white border rounded-xl p-4 shadow-sm ${isSelected ? "ring-2 ring-primary bg-blue-50" : ""
                }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(customer.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <button
                        onClick={() => navigate(`/client/${customer.id}`)}
                        className="font-semibold text-primary hover:text-blue-600"
                      >
                        {customer.name}
                      </button>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <select
                      value={customer.status}
                      onChange={(e) => handleStatusChange(customer.id, e.target.value as CustomerStatus)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[customer.status]}`}
                    >
                      {Object.entries(CUSTOMER_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                        <option key={statusKey} value={statusKey}>
                          {statusLabel}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {(customer.tags ?? []).map(tag => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  
                  {customer.assignedJobs.length > 0 && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                        <Briefcase size={12} />
                        Assigned Jobs ({customer.assignedJobs.length})
                      </p>
                      <div className="space-y-1.5">
                        {customer.assignedJobs.slice(0, 3).map((job) => (
                          <div
                            key={job.jobId}
                            className="flex items-center justify-between bg-white rounded p-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/jobs/${job.jobId}`)}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                {job.jobId}
                              </button>
                              <span
                                className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${jobStatusStyles[job.status]
                                  }`}
                              >
                                {JOB_STATUS_LABELS[job.status]}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-gray-700">
                              ${job.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {customer.assignedJobs.length > 3 && (
                          <p className="text-xs text-primary font-medium px-1.5">
                            +{customer.assignedJobs.length - 3} more jobs
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-sm text-gray-600">
                    <p>{customer.company}</p>
                    <p>{customer.address}, {customer.city}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-primary text-sm font-medium flex items-center gap-1"
                    >
                      <Phone size={14} />
                      {customer.phone}
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewShoppingList(customer)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-emerald-600"
                      >
                        <ShoppingCart size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/client/${customer.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-primary"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CREATE CLIENT MODAL */}
      <CreateClientModal
        isOpen={openCreateClient}
        onClose={() => setOpenCreateClient(false)}
        onSave={(data) => {
          // console.log("CLIENT DATA", data)
          setOpenCreateClient(false)
        }}
      />

      {/* PRICE BOOK MODAL */}
      <PriceBookModal
        isOpen={isPriceBookOpen}
        onClose={() => setIsPriceBookOpen(false)}
        data={priceBookData}
        onAddToEstimate={handleAddToShoppingList}
      />

      {/* SHOPPING LIST VIEW MODAL */}
      <ShoppingListModal
        isOpen={isShoppingListViewOpen}
        onClose={() => {
          setIsShoppingListViewOpen(false)
          setSelectedClientForView(null)
        }}
        client={selectedClientForView ? {
          name: selectedClientForView.name,
          email: selectedClientForView.email,
          phone: selectedClientForView.phone,
          company: selectedClientForView.company,
          address: `${selectedClientForView.address}, ${selectedClientForView.city}, ${selectedClientForView.state} ${selectedClientForView.zip}`
        } : null}
        items={shoppingListItems}
      />

      {/* TOOLTIPS */}
      <Tooltip
        id="quick-actions-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip
        id="action-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip
        id="disabled-tooltip"
        place="top"
        className="!bg-red-600 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  )
}


function StatCard({
  label,
  value,
  danger = false,
}: {
  label: string
  value: string | number
  danger?: boolean
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${danger ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  )
}