import { useEffect, useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { 
  Search, Plus, Eye, Trash2, ChevronDown, LayoutGrid, List, 
  Download, RefreshCcw, Tag, UserCog, CalendarClock, X, Check 
} from "lucide-react"
import { AddJobModal } from "../../components/AddJobModal"
import { JobModal } from "../../components/jobPages/JobModal"
import { JobKanbanBoard } from "../../components/kanban/jobKanban/JobKanbanView"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

/* ===================== TYPES ===================== */

type JobStatus = "submitted" | "in-progress" | "pending" | "unscheduled" | "completed" | "cancelled"

interface Job {
  id: string
  jobNumber: string
  clientName: string
  companyName: string
  phone: string
  service: string
  technician: string
  status: JobStatus
  amount: number
  address: string
  city: string
  state: string
  zip: string
  country: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  tags: string[]
  jobType: string
  scheduled: string
  techAssigned: boolean
  timeInSchedule: string
  didYouComplete: boolean
  finalWalkthrough: boolean
  totalPrice: number
  projectDescription: string
  source: string
  createdDate: string
}

/* ===================== STATUS CONFIG ===================== */

const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  submitted: "Submitted",
  "in-progress": "In Progress",
  pending: "Pending",
  unscheduled: "Unscheduled",
  completed: "Completed",
  cancelled: "Cancelled",
}

const statusStyles: Record<JobStatus, string> = {
  submitted: "bg-gray-100 text-gray-800 border-gray-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  unscheduled: "bg-orange-100 text-orange-800 border-orange-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
}

/* ===================== AVAILABLE TAGS WITH COLORS ===================== */

const availableTags = [
  { id: "residential", label: "Residential", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "commercial", label: "Commercial", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "priority", label: "Priority", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "urgent", label: "Urgent", color: "bg-rose-100 text-rose-700 border-rose-200" },
  { id: "scheduled", label: "Scheduled", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "follow-up", label: "Follow Up", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "vip", label: "VIP", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "new-customer", label: "New Customer", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "returning", label: "Returning", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { id: "callback", label: "Callback", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: "warranty", label: "Warranty", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { id: "inspection", label: "Inspection", color: "bg-slate-100 text-slate-700 border-slate-200" },
]

/* ===================== TAG COLOR MAPPING ===================== */

const tagColorMap: Record<string, string> = {
  "Residential": "bg-blue-100 text-blue-700 border border-blue-200",
  "Commercial": "bg-purple-100 text-purple-700 border border-purple-200",
  "Priority": "bg-red-100 text-red-700 border border-red-200",
  "Urgent": "bg-rose-100 text-rose-700 border border-rose-200",
  "Scheduled": "bg-green-100 text-green-700 border border-green-200",
  "Follow Up": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "VIP": "bg-amber-100 text-amber-700 border border-amber-200",
  "New Customer": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Returning": "bg-teal-100 text-teal-700 border border-teal-200",
  "Callback": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Warranty": "bg-cyan-100 text-cyan-700 border border-cyan-200",
  "Inspection": "bg-slate-100 text-slate-700 border border-slate-200",
}

const getTagColor = (tagLabel: string): string => {
  return tagColorMap[tagLabel] || "bg-gray-100 text-gray-700 border border-gray-200"
}

/* ===================== MOCK DATA ===================== */

const initialJobs: Job[] = [
  {
    id: "1",
    jobNumber: "480",
    clientName: "Robin Stevens",
    companyName: "Stevens Flooring",
    phone: "(413) 275-4790",
    service: "Tile Install",
    technician: "Mike Johnson",
    status: "submitted",
    amount: 2578.95,
    address: "2225 Charlotte Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    startDate: "2026-01-10",
    startTime: "10:00",
    endDate: "2026-01-10",
    endTime: "14:00",
    tags: ["Residential", "Priority"],
    jobType: "Tile Install",
    scheduled: "Unscheduled",
    techAssigned: true,
    timeInSchedule: "21 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 2578.95,
    projectDescription: "Install new tile flooring in bathroom",
    source: "Website",
    createdDate: "2026-01-05",
  },
  {
    id: "2",
    jobNumber: "507",
    clientName: "Teresa Lafoon",
    companyName: "Lafoon Interiors",
    phone: "(919) 259-3932",
    service: "Carpet",
    technician: "Lisa Brown",
    status: "in-progress",
    amount: 6598.45,
    address: "215 Granger Rd, Charlotte",
    city: "Charlotte",
    state: "NC",
    zip: "28202",
    country: "United States",
    startDate: "2026-01-09",
    startTime: "09:00",
    endDate: "2026-01-09",
    endTime: "11:00",
    tags: ["Commercial", "VIP"],
    jobType: "Carpet",
    scheduled: "Unscheduled",
    techAssigned: true,
    timeInSchedule: "2 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 6598.45,
    projectDescription: "Install commercial carpet in office",
    source: "Referral",
    createdDate: "2026-01-03",
  },
  {
    id: "3",
    jobNumber: "506",
    clientName: "Kristopher Decker",
    companyName: "Decker Homes",
    phone: "(847) 989-1986",
    service: "Repair",
    technician: "Tom Davis",
    status: "pending",
    amount: 1004.00,
    address: "109 Donna Pl, Cary",
    city: "Cary",
    state: "NC",
    zip: "27511",
    country: "United States",
    startDate: "2026-01-12",
    startTime: "13:00",
    endDate: "2026-01-12",
    endTime: "17:00",
    tags: ["Residential", "Warranty"],
    jobType: "Repair",
    scheduled: "Unscheduled",
    techAssigned: true,
    timeInSchedule: "1 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 1004.00,
    projectDescription: "Floor repair in master bedroom",
    source: "Phone",
    createdDate: "2026-01-06",
  },
  {
    id: "4",
    jobNumber: "505",
    clientName: "William Chase",
    companyName: "Chase Properties",
    phone: "(919) 302-0824",
    service: "Repair",
    technician: "Unassigned",
    status: "unscheduled",
    amount: 0,
    address: "7813 Nugget Lane, Raleigh",
    city: "Raleigh",
    state: "NC",
    zip: "27603",
    country: "United States",
    startDate: "2026-01-08",
    startTime: "10:00",
    endDate: "2026-01-08",
    endTime: "15:00",
    tags: ["Commercial", "Urgent"],
    jobType: "Repair",
    scheduled: "Unscheduled",
    techAssigned: false,
    timeInSchedule: "7 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 0,
    projectDescription: "Floor repair in warehouse",
    source: "Website",
    createdDate: "2026-01-01",
  },
  {
    id: "5",
    jobNumber: "508",
    clientName: "Monica Johnson",
    companyName: "Johnson Interiors",
    phone: "(984) 209-0465",
    service: "Laminate & LVP Install",
    technician: "Mike Johnson",
    status: "in-progress",
    amount: 3200.00,
    address: "717 Obsidian Way, Durham",
    city: "Durham",
    state: "NC",
    zip: "27701",
    country: "United States",
    startDate: "2026-01-11",
    startTime: "08:30",
    endDate: "2026-01-11",
    endTime: "16:30",
    tags: ["Residential", "New Customer"],
    jobType: "Laminate & LVP Install",
    scheduled: "Thu Jan 28, 2026 10:00 am in 2 days",
    techAssigned: true,
    timeInSchedule: "09:53",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 3200.00,
    projectDescription: "Install laminate and LVP in living area",
    source: "Referral",
    createdDate: "2026-01-04",
  },
]

/* ===================== DROPDOWN TYPES ===================== */

type ActiveDropdown = "status" | "tags" | null

/* ===================== COMPONENT ===================== */

export function Jobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | JobStatus>("all")
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false)
  const [showUnpaidJobs, setShowUnpaidJobs] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const tagsDropdownRef = useRef<HTMLDivElement>(null)

  // Check if any jobs are selected
  const hasSelection = selectedJobs.size > 0

  // Close dropdowns when clicking outside
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

  /* ===================== TABS ===================== */

  const jobStatusTabs = [
    { id: "all", label: "All" },
    ...Object.entries(JOB_STATUS_LABELS).map(([statusKey, statusLabel]) => ({
      id: statusKey,
      label: statusLabel,
    })),
  ]

  const jobStatusCounts: Record<string, number> = {
    all: jobs.length,
    ...jobs.reduce<Record<string, number>>((accumulator, job) => {
      accumulator[job.status] = (accumulator[job.status] || 0) + 1
      return accumulator
    }, {}),
  }

  /* ===================== FILTER ===================== */

  const filteredJobs = jobs.filter((job) => {
    const searchValue = searchTerm.toLowerCase()

    const matchesSearch =
      job.clientName.toLowerCase().includes(searchValue) ||
      job.companyName.toLowerCase().includes(searchValue) ||
      job.phone.includes(searchValue) ||
      job.jobNumber.toLowerCase().includes(searchValue) ||
      job.city.toLowerCase().includes(searchValue) ||
      job.state.toLowerCase().includes(searchValue) ||
      job.jobType.toLowerCase().includes(searchValue)

    const matchesStatus =
      selectedStatus === "all" || job.status === selectedStatus

    const matchesUnpaid = !showUnpaidJobs || job.amount > 0

    return matchesSearch && matchesStatus && matchesUnpaid
  })

  const totalRows = filteredJobs.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  const paginatedJobs = filteredJobs.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus])

  /* ===================== HANDLERS ===================== */

  const handleDeleteJob = (jobId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?")
    if (!confirmed) return
    setJobs(jobs.filter((job) => job.id !== jobId))
    selectedJobs.delete(jobId)
    setSelectedJobs(new Set(selectedJobs))
  }

  const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
    setJobs(previousJobs =>
      previousJobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    )
  }

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs)
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId)
    } else {
      newSelected.add(jobId)
    }
    setSelectedJobs(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedJobs.size === filteredJobs.length) {
      setSelectedJobs(new Set())
    } else {
      setSelectedJobs(new Set(filteredJobs.map(job => job.id)))
    }
  }

  /* ===================== BULK ACTIONS ===================== */

  // Bulk status change
  const handleBulkStatusChange = (newStatus: JobStatus) => {
    setJobs(previousJobs =>
      previousJobs.map(job =>
        selectedJobs.has(job.id) ? { ...job, status: newStatus } : job
      )
    )
    setActiveDropdown(null)
  }

  // Bulk add tag
  const handleBulkAddTag = (tagLabel: string) => {
    setJobs(previousJobs =>
      previousJobs.map(job => {
        if (selectedJobs.has(job.id)) {
          const currentTags = job.tags || []
          if (!currentTags.includes(tagLabel)) {
            return { ...job, tags: [...currentTags, tagLabel] }
          }
        }
        return job
      })
    )
    setActiveDropdown(null)
  }

  // Bulk remove tag
  const handleBulkRemoveTag = (tagLabel: string) => {
    setJobs(previousJobs =>
      previousJobs.map(job => {
        if (selectedJobs.has(job.id)) {
          const currentTags = job.tags || []
          return { ...job, tags: currentTags.filter(t => t !== tagLabel) }
        }
        return job
      })
    )
  }

  // Clear selection
  const handleClearSelection = () => {
    setSelectedJobs(new Set())
  }

  // Get selected jobs' common tags
  const getSelectedJobsTags = () => {
    const selectedJobsList = jobs.filter(job => selectedJobs.has(job.id))
    const allTags = selectedJobsList.flatMap(job => job.tags || [])
    return [...new Set(allTags)]
  }

  const handleViewJob = (jobId: string) => {
    navigate(`/client/jobs/${jobId}`)
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {viewMode === "table" ? "Jobs" : "Job Pipeline"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode === "table"
              ? "Manage and track all service jobs"
              : "Drag and drop jobs between columns to update their status"
            }
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-1 bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('table')}
                data-tooltip-id="view-tooltip"
                data-tooltip-content="Table View"
                className={`p-2 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-gray-100'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                data-tooltip-id="view-tooltip"
                data-tooltip-content="Kanban View"
                className={`p-2 rounded transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-gray-100'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsJobModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Create Job
          </button>
        </div>
      </div>

      {viewMode === 'table' && (
        <>
          {/* Status Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 thin-scrollbar">
            {jobStatusTabs.map((tab) => {
              const isActive = selectedStatus === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id as any)}
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
                    {jobStatusCounts[tab.id] || 0}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 min-w-[400px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, phone, job number, city or job type..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {hasSelection && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
                  <span className="text-sm font-medium text-primary">
                    {selectedJobs.size} selected
                  </span>
                  <button
                    onClick={handleClearSelection}
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
                      className={`p-2 rounded transition-colors ${
                        activeDropdown === "status" 
                          ? "bg-primary text-white" 
                          : "hover:bg-primary hover:text-white text-gray-700"
                      }`}
                    >
                      <RefreshCcw size={20} />
                    </button>
                  ) : (
                    <button
                      data-tooltip-id="disabled-tooltip"
                      data-tooltip-content="Select jobs to change status"
                      className="p-2 rounded text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      <RefreshCcw size={20} />
                    </button>
                  )}

                  {/* Status Dropdown */}
                  {activeDropdown === "status" && hasSelection && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-72 overflow-y-auto">
                      <div className="px-3 py-2 border-b">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Change Status</p>
                      </div>
                      {Object.entries(JOB_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                        <button
                          key={statusKey}
                          onClick={() => handleBulkStatusChange(statusKey as JobStatus)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusStyles[statusKey as JobStatus]}`}>
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
                      className={`p-2 rounded transition-colors ${
                        activeDropdown === "tags" 
                          ? "bg-primary text-white" 
                          : "hover:bg-primary hover:text-white text-gray-700"
                      }`}
                    >
                      <Tag size={20} />
                    </button>
                  ) : (
                    <button
                      data-tooltip-id="disabled-tooltip"
                      data-tooltip-content="Select jobs to modify tags"
                      className="p-2 rounded text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      <Tag size={20} />
                    </button>
                  )}

                  {/* Tags Dropdown */}
                  {activeDropdown === "tags" && hasSelection && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-80 overflow-y-auto">
                      <div className="px-3 py-2 border-b">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Add Tags</p>
                      </div>
                      
                      {availableTags.map((tag) => {
                        const selectedTags = getSelectedJobsTags()
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

                      {/* Current tags on selected jobs */}
                      {getSelectedJobsTags().length > 0 && (
                        <>
                          <div className="px-3 py-2 border-t border-b mt-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Current Tags</p>
                          </div>
                          <div className="px-3 py-2 flex flex-wrap gap-1">
                            {getSelectedJobsTags().map(tag => (
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

                {/* Reassign Job */}
                {hasSelection ? (
                  <button
                    data-tooltip-id="quick-actions-tooltip"
                    data-tooltip-content="Reassign Job"
                    className="p-2 rounded hover:bg-primary hover:text-white text-gray-700"
                  >
                    <UserCog size={20} />
                  </button>
                ) : (
                  <button
                    data-tooltip-id="disabled-tooltip"
                    data-tooltip-content="Select jobs to reassign"
                    className="p-2 rounded text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <UserCog size={20} />
                  </button>
                )}

                {/* Reschedule Job */}
                {hasSelection ? (
                  <button
                    data-tooltip-id="quick-actions-tooltip"
                    data-tooltip-content="Reschedule Job"
                    className="p-2 rounded hover:bg-primary hover:text-white text-gray-700"
                  >
                    <CalendarClock size={20} />
                  </button>
                ) : (
                  <button
                    data-tooltip-id="disabled-tooltip"
                    data-tooltip-content="Select jobs to reschedule"
                    className="p-2 rounded text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <CalendarClock size={20} />
                  </button>
                )}
              </div>

              {/* Show Unpaid Toggle */}
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={showUnpaidJobs}
                  onChange={(e) => setShowUnpaidJobs(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">Unpaid only</span>
              </label>

              <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </>
      )}

      {viewMode === "kanban" && (
        <JobKanbanBoard
          jobs={jobs}
          // @ts-ignore
          onJobsUpdate={setJobs}
        />
      )}

      {/* Table */}
      {viewMode === 'table' && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-12">
                    <input
                      type="checkbox"
                      checked={selectedJobs.size === filteredJobs.length && filteredJobs.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                    />
                  </th>
                  {["Job ID", "Status", "Tags", "Client", "Job Type", "Location", "Phone", "Scheduled", "Tech", "Total Price", "Created", "Action"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {paginatedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-gray-500">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  paginatedJobs.map((job) => (
                    <tr
                      key={job.id}
                      className={`border-t hover:bg-gray-50 ${selectedJobs.has(job.id) ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedJobs.has(job.id)}
                          onChange={() => handleSelectJob(job.id)}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                        />
                      </td>

                      {/* Job ID */}
                      <td className="px-4 py-3 font-semibold text-primary">
                        <button
                          onClick={() => {
                            setSelectedJob(job)
                            setIsJobDetailModalOpen(true)
                          }}
                          className="text-primary hover:text-blue-600 hover:underline"
                        >
                          #{job.jobNumber}
                        </button>
                      </td>

                      {/* Status with Dropdown */}
                      <td className="px-4 py-3 min-w-[150px]">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                          className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[job.status]}`}
                        >
                          {Object.entries(JOB_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                            <option key={statusKey} value={statusKey}>
                              {statusLabel}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Tags Column with Colors */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 min-w-[200px]">
                          {(job.tags ?? []).length > 0 ? (
                            (job.tags ?? []).map(tag => (
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

                      {/* Client */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/client/${job.id}`)}
                          className="flex flex-col text-left text-primary border-none hover:text-blue-600"
                        >
                          <div className="font-semibold text-nowrap">{job.clientName}</div>
                          <div className="text-xs text-gray-500 text-nowrap">{job.companyName}</div>
                        </button>
                      </td>

                      {/* Job Type */}
                      <td className="px-4 py-3 text-nowrap">{job.jobType}</td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        {job.city}, {job.state}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 text-nowrap">
                        <a href={`tel:${job.phone}`} className="text-blue-600 hover:underline">
                          {job.phone}
                        </a>
                      </td>

                      {/* Scheduled */}
                      <td className="px-4 py-3 text-sm">{job.scheduled}</td>

                      {/* Tech */}
                      <td className="px-4 py-3 text-center">
                        {job.techAssigned ? (
                          <span className="text-green-600 text-lg">✓</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Total Price */}
                      <td className="px-4 py-3 font-semibold text-nowrap">
                        ${job.totalPrice.toLocaleString()}
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3">{job.createdDate}</td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewJob(job.id)}
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content="View Job"
                            className="p-1.5 rounded hover:bg-primary/10 text-primary"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content="Delete Job"
                            className="p-1.5 rounded hover:bg-red-100 text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{startIndex + 1}</span>
                {" - "}
                <span className="font-semibold">
                  {Math.min(endIndex, totalRows)}
                </span>
                {" of "}
                <span className="font-semibold">{totalRows}</span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== MOBILE CARDS ===================== */}
      {viewMode === 'table' && (
        <div className="md:hidden space-y-4">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white border border-gray-300 rounded-lg p-4 space-y-3 ${
                selectedJobs.has(job.id) ? "ring-2 ring-primary bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedJobs.has(job.id)}
                    onChange={() => handleSelectJob(job.id)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                  />
                  <div>
                    <Link to={`/jobs/${job.id}`} className="font-semibold text-primary hover:text-blue-600">
                      #{job.jobNumber}
                    </Link>
                    <div className="text-sm font-medium">{job.clientName}</div>
                    <div className="text-sm text-gray-500">{job.phone}</div>
                  </div>
                </div>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[job.status]}`}
                >
                  {Object.entries(JOB_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                    <option key={statusKey} value={statusKey}>
                      {statusLabel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {(job.tags ?? []).map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 text-xs font-medium rounded ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-sm">{job.jobType}</div>
              <div className="text-xs text-gray-500">
                {job.city}, {job.state} {job.zip}
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-semibold">${job.totalPrice.toLocaleString()}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewJob(job.id)}
                    className="p-1.5 hover:bg-gray-200 rounded text-primary"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1.5 hover:bg-gray-200 rounded text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={() => { }}
        title="Create Job"
      />

      {/* Job Detail Modal */}
      <JobModal
       // @ts-ignore
        job={selectedJob}
        isOpen={isJobDetailModalOpen}
        onClose={() => {
          setIsJobDetailModalOpen(false)
          setSelectedJob(null)
        }}
      />

      {/* Tooltips */}
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
        id="view-tooltip" 
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