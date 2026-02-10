import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Search, Plus, Eye, Edit, Trash2, ChevronDown, LayoutGrid, List } from "lucide-react"
import { AddJobModal } from "../../components/AddJobModal"
import { JobModal } from "../../components/jobPages/JobModal"

import { JobKanbanBoard } from "../../components/kanban/jobKanban/JobKanbanView"


/* ===================== TYPES ===================== */

type JobStatus = "submitted" | "in-progress" | "pending" | "unscheduled"

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

  tags: string
  jobType: string
  scheduled: string
  techAssigned: boolean
  timeInSchedule: string
  didYouComplete: boolean
  finalWalkthrough: boolean
  totalPrice: number
  projectDescription: string
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
    tags: "Residential",
    jobType: "Tile Install",
    scheduled: "Unscheduled",
    techAssigned: true,
    timeInSchedule: "21 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 2578.95,
    projectDescription: "Install new tile flooring in bathroom",
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
    tags: "Commercial",
    jobType: "Carpet",
    scheduled: "Unscheduled",
    techAssigned: true,
    timeInSchedule: "2 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 6598.45,
    projectDescription: "Install commercial carpet in office",
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
    tags: "Residential",
    jobType: "Repair",
    scheduled: "Unscheduled",
    techAssigned: true,
    timeInSchedule: "1 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 1004.00,
    projectDescription: "Floor repair in master bedroom",
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
    tags: "Commercial",
    jobType: "Repair",
    scheduled: "Unscheduled",
    techAssigned: false,
    timeInSchedule: "7 DAYS",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 0,
    projectDescription: "Floor repair in warehouse",
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
    tags: "Residential",
    jobType: "Laminate & LVP Install",
    scheduled: "Thu Jan 28, 2026 10:00 am in 2 days",
    techAssigned: true,
    timeInSchedule: "09:53",
    didYouComplete: false,
    finalWalkthrough: false,
    totalPrice: 3200.00,
    projectDescription: "Install laminate and LVP in living area",
  },
]

const tabs = [
  { id: "all", label: "All", count: initialJobs.length },
  { id: "submitted", label: "Submitted", count: initialJobs.filter(i => i.status === "submitted").length },
  { id: "in-progress", label: "In Progress", count: initialJobs.filter(i => i.status === "in-progress").length },
  { id: "pending", label: "Pending", count: initialJobs.filter(i => i.status === "pending").length },
  { id: "unscheduled", label: "Unscheduled", count: initialJobs.filter(i => i.status === "unscheduled").length },
]


/* ===================== STATUS STYLES ===================== */

const statusStyles: Record<JobStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  submitted: "bg-gray-100 text-gray-800",
  unscheduled: "bg-orange-100 text-orange-800",
}

/* ===================== COMPONENT ===================== */


export function Jobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [activeTab, setActiveTab] = useState("all")
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isJobDetailModalOpen, setIsJobDetailModalOpen] = useState(false)
  const [showUnpaidJobs, setShowUnpaidJobs] = useState(false)
  const [showFieldsMenu, setShowFieldsMenu] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    jobId: true,
    client: true,
    tags: true,
    jobType: true,
    scheduled: true,
    phone: true,
    tech: true,
    address: true,
    timeInSchedule: true,
    didYouComplete: true,
    finalWalkthrough: true,
    totalPrice: true,
    projectDescription: true,
  })
  const itemsPerPage = 50
  const [currentPage, setCurrentPage] = useState(1)




  const filteredJobs = jobs.filter((job) => {
    const searchValue = searchTerm.toLowerCase()

    const matchesSearch =
      job.clientName.toLowerCase().includes(searchValue) ||
      job.companyName.toLowerCase().includes(searchValue) ||
      job.phone.includes(searchValue) ||
      job.jobNumber.toLowerCase().includes(searchValue) ||
      job.city.toLowerCase().includes(searchValue) ||
      job.state.toLowerCase().includes(searchValue)

    const matchesTab =
      activeTab === "all" || job.status === activeTab

    const matchesUnpaid = !showUnpaidJobs || job.amount > 0

    return matchesSearch && matchesTab && matchesUnpaid
  })

  const totalItems = filteredJobs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )


  useEffect(() => {
    // Reset to page 1 when search changes
    setTimeout(() => setCurrentPage(1), 0)
  }, [searchTerm])

 

  const handleDeleteJob = (jobId: string) => {
    const confirmed = window.confirm("Delete this job?")
    if (!confirmed) return
    setJobs(jobs.filter((job) => job.id !== jobId))
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobs</h1>
          <p className="text-sm text-gray-600">
            Manage and track all service jobs
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-1 bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-2 rounded transition-colors ${viewMode === 'table'
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-gray-100'
                  }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                title="Kanban View"
                className={`p-2 rounded transition-colors ${viewMode === 'kanban'
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
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold"
          >
            <Plus size={18} />
            Create Job
          </button>

        </div>

      </div>

      {/* TABS */}

      {viewMode === 'table' && (
        <>
          <div className="flex gap-3 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap
              ${activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>



          {/* SEARCH & FILTER SECTION */}
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4" />
                <input
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={showUnpaidJobs}
                  onChange={(e) => setShowUnpaidJobs(e.target.checked)}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">Show unpaid jobs</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowFieldsMenu(!showFieldsMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
                >
                  Fields
                  <ChevronDown size={16} />
                </button>
                {showFieldsMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[200px]">
                    <div className="p-3 space-y-2">
                      {[
                        { key: "checkbox", label: "Checkbox" },
                        { key: "jobId", label: "Job ID" },
                        { key: "client", label: "Client" },
                        { key: "tags", label: "Tags" },
                        { key: "jobType", label: "Job Type" },
                        { key: "scheduled", label: "Scheduled" },
                        { key: "phone", label: "Phone" },
                        { key: "tech", label: "Tech" },
                        { key: "address", label: "Address" },
                        { key: "timeInSchedule", label: "Time in Schedule" },
                        { key: "didYouComplete", label: "Did You Complete" },
                        { key: "finalWalkthrough", label: "Final Walkthrough" },
                        { key: "totalPrice", label: "Total Price" },
                        { key: "projectDescription", label: "Project Description" },
                      ].map(col => (
                        <label key={col.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.key as keyof typeof visibleColumns]}
                            onChange={(e) => setVisibleColumns({
                              ...visibleColumns,
                              [col.key]: e.target.checked
                            })}
                            className="accent-primary"
                          />
                          <span className="text-sm">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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



      {viewMode === 'table' && (
        <>


          {/* ===================== DESKTOP TABLE ===================== */}
          <div className="bg-white border border-gray-300 rounded-lg ">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    {visibleColumns.checkbox && <th className="p-3 w-10"><input type="checkbox" className="accent-primary" /></th>}
                    {visibleColumns.jobId && <th className="p-3 text-left font-semibold text-nowrap">Job ID</th>}
                    {visibleColumns.client && <th className="p-3 text-left font-semibold">Client</th>}
                    {visibleColumns.tags && <th className="p-3 text-left font-semibold">Tags</th>}
                    {visibleColumns.jobType && <th className="p-3 text-left font-semibold">Job Type</th>}
                    {visibleColumns.scheduled && <th className="p-3 text-left font-semibold">Scheduled</th>}
                    {visibleColumns.phone && <th className="p-3 text-left font-semibold">Phone</th>}
                    {visibleColumns.tech && <th className="p-3 text-left font-semibold">Tech</th>}
                    {visibleColumns.address && <th className="p-3 text-left font-semibold">Address</th>}
                    {visibleColumns.timeInSchedule && <th className="p-3 text-left text-nowrap font-semibold">Time in S...</th>}
                    {visibleColumns.didYouComplete && <th className="p-3 text-left text-nowrap font-semibold">Did you c...</th>}
                    {visibleColumns.finalWalkthrough && <th className="p-3 text-left text-nowrap font-semibold">Final Wal...</th>}
                    {visibleColumns.totalPrice && <th className="p-3 text-left font-semibold text-nowrap">Total Price</th>}
                    {visibleColumns.projectDescription && <th className="p-3 text-left font-semibold">Project D...</th>}
                  </tr>
                </thead>

                <tbody>
                  {paginatedJobs.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="p-8 text-center text-gray-500">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    paginatedJobs.map((job) => (
                      <tr key={job.id} className="border-t hover:bg-gray-50">
                        {visibleColumns.checkbox && (
                          <td className="p-3">
                            <input type="checkbox" className="accent-primary" />
                          </td>
                        )}

                        {visibleColumns.jobId && (
                          <td className="p-3 font-semibold text-primary ">
                            <button
                              onClick={() => {
                                setSelectedJob(job)
                                setIsJobDetailModalOpen(true)
                              }}
                              className="text-primary hover:text-blue-600 hover:underline"
                            >
                              {job.jobNumber}
                            </button>
                          </td>
                        )}

                        {visibleColumns.client && (
                          <td className="p-3">
                            <button
                              onClick={() => navigate(`/client/${job.id}`)}
                              className="flex flex-col text-left text-primary border-none hover:text-blue-600"
                            >
                              <div className="font-semibold text-nowrap">{job.clientName}</div>
                              <div className="text-xs text-gray-500 text-nowrap">{job.companyName}</div>
                            </button>
                          </td>
                        )}

                        {visibleColumns.tags && (
                          <td className="p-3 text-sm">{job.tags}</td>
                        )}

                        {visibleColumns.jobType && (
                          <td className="p-3 text-sm text-nowrap">{job.jobType}</td>
                        )}

                        {visibleColumns.scheduled && (
                          <td className="p-3 text-sm " >{job.scheduled}</td>
                        )}

                        {visibleColumns.phone && (
                          <td className="p-3 text-sm text-nowrap">
                            <a href={`tel:${job.phone}`} className="text-blue-600 hover:underline">
                              {job.phone}
                            </a>
                          </td>
                        )}

                        {visibleColumns.tech && (
                          <td className="p-3 text-center">
                            {job.techAssigned ? (
                              <span className="text-green-600 text-lg">✓</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        )}

                        {visibleColumns.address && (
                          <td className="p-3 text-sm">{job.address}</td>
                        )}

                        {visibleColumns.timeInSchedule && (
                          <td className="p-3 text-sm">
                            {job.timeInSchedule.includes("DAYS") ? (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                {job.timeInSchedule}
                              </span>
                            ) : (
                              <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-semibold">
                                {job.timeInSchedule}
                              </span>
                            )}
                          </td>
                        )}

                        {visibleColumns.didYouComplete && (
                          <td className="p-3 text-center">
                            {job.didYouComplete ? (
                              <span className="text-green-600 text-lg">✓</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        )}

                        {visibleColumns.finalWalkthrough && (
                          <td className="p-3 text-center">
                            {job.finalWalkthrough ? (
                              <span className="text-green-600 text-lg">✓</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        )}

                        {visibleColumns.totalPrice && (
                          <td className="p-3 font-semibold text-nowrap">
                            ${job.totalPrice.toLocaleString()}
                          </td>
                        )}

                        {visibleColumns.projectDescription && (
                          <td className="p-3 text-sm text-gray-600">
                            {job.projectDescription.substring(0, 20)}...
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================== MOBILE CARDS ===================== */}
          <div className="md:hidden space-y-4">
            {paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-300 rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="font-semibold text-primary hover:text-blue-600">
                      {job.jobNumber}
                    </Link>
                    <div className="text-sm font-medium">{job.clientName}</div>
                    <div className="text-sm text-gray-500">{job.phone}</div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[job.status]}`}
                  >
                    {job.status === "in-progress" ? "In Progress" : job.status}
                  </span>
                </div>

                <div className="text-sm">{job.service}</div>
                <div className="text-xs text-gray-500">
                  {job.city}, {job.state} {job.zip}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-semibold">${job.amount.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/jobs/${job.id}`)} className="p-1.5 hover:bg-gray-200 rounded">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => navigate(`/jobs/${job.id}/edit`)} className="p-1.5 hover:bg-gray-200 rounded">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 hover:bg-gray-200 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-300 rounded-lg px-4 py-3">
              {/* Info */}
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>
                –
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-semibold">{totalItems}</span> jobs
              </p>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1
                  const isActive = currentPage === pageNumber

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg font-medium transition ${isActive
                        ? "bg-primary text-white shadow-sm"
                        : "border border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                {/* Next */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          )}




        </>


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
        job={selectedJob}
        isOpen={isJobDetailModalOpen}
        onClose={() => {
          setIsJobDetailModalOpen(false)
          setSelectedJob(null)
        }}
      />
    </div>
  )
}
