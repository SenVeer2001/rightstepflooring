import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { AddJobModal } from "../../components/AddJobModal"

/* ===================== TYPES ===================== */

type JobStatus = "pending" | "in-progress" | "completed" | "canceled"

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
}

/* ===================== MOCK DATA ===================== */

const initialJobs: Job[] = [
  {
    id: "1",
    jobNumber: "#JOB-001",

    clientName: "John Smith",
    companyName: "Right Step Flooring",
    phone: "9876543210",

    service: "Flooring Installation",
    technician: "Mike Johnson",
    status: "in-progress",
    amount: 2500,

    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",

    startDate: "2026-01-10",
    startTime: "10:00",
    endDate: "2026-01-10",
    endTime: "14:00",
  },
  {
    id: "2",
    jobNumber: "#JOB-002",

    clientName: "Sarah Williams",
    companyName: "Williams Interiors",
    phone: "9123456789",

    service: "Carpet Cleaning",
    technician: "Lisa Brown",
    status: "completed",
    amount: 450,

    address: "456 Park Avenue",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    country: "United States",

    startDate: "2026-01-09",
    startTime: "09:00",
    endDate: "2026-01-09",
    endTime: "11:00",
  },
  {
    id: "3",
    jobNumber: "#JOB-003",

    clientName: "Michael Brown",
    companyName: "Brown Property Group",
    phone: "9988776655",

    service: "Floor Repair",
    technician: "Tom Davis",
    status: "pending",
    amount: 1800,

    address: "789 Lake Shore Drive",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "United States",

    startDate: "2026-01-12",
    startTime: "13:00",
    endDate: "2026-01-12",
    endTime: "17:00",
  },
  {
    id: "4",
    jobNumber: "#JOB-004",

    clientName: "Emma Davis",
    companyName: "Davis Home Solutions",
    phone: "9090909090",

    service: "Tile Installation",
    technician: "Unassigned",
    status: "canceled",
    amount: 0,

    address: "321 Sunset Boulevard",
    city: "Houston",
    state: "TX",
    zip: "77002",
    country: "United States",

    startDate: "2026-01-08",
    startTime: "10:00",
    endDate: "2026-01-08",
    endTime: "15:00",
  },
  {
    id: "5",
    jobNumber: "#JOB-005",

    clientName: "James Wilson",
    companyName: "Wilson Commercial Spaces",
    phone: "9012345678",

    service: "Vinyl Flooring",
    technician: "Mike Johnson",
    status: "in-progress",
    amount: 3200,

    address: "654 Industrial Road",
    city: "San Diego",
    state: "CA",
    zip: "92101",
    country: "United States",

    startDate: "2026-01-11",
    startTime: "08:30",
    endDate: "2026-01-11",
    endTime: "16:30",
  },
]


/* ===================== STATUS STYLES ===================== */

const statusStyles: Record<JobStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
}

/* ===================== COMPONENT ===================== */

export function Jobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [searchTerm, setSearchTerm] = useState("")
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const itemsPerPage = 5

const [currentPage, setCurrentPage] = useState(1)


  /* ===================== FILTER ===================== */

  const filteredJobs = jobs.filter((job) => {
    const searchValue = searchTerm.toLowerCase()

    return (
      job.clientName.toLowerCase().includes(searchValue) ||
      job.companyName.toLowerCase().includes(searchValue) ||
      job.phone.includes(searchValue) ||
      job.jobNumber.toLowerCase().includes(searchValue) ||
      job.city.toLowerCase().includes(searchValue) ||
      job.state.toLowerCase().includes(searchValue)
    )
  })

  const totalItems = filteredJobs.length
const totalPages = Math.ceil(totalItems / itemsPerPage)

const paginatedJobs = filteredJobs.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
)

  
useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])

  /* ===================== DELETE ===================== */

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

        <button
          onClick={() => setIsJobModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Plus size={18} />
          Create Job
        </button>
      </div>

      <div className=" rounded-lg text-sm ">
        <div className="flex gap-4">
          <div className="relative flex-1 min-w-[940px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4" />
            <input placeholder="Search job, customer, service..." className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          {/* <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as JobStatus | "all")} >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select> */}
        </div>
      </div>

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Job ID",
                  "Client",
                  "Location",
                  "Schedule",
                  "Service",
                  "Technician",
                  "Amount",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-4 py-3 text-left font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
             {paginatedJobs.map((job) => (

                <tr key={job.id} className="border-t hover:bg-gray-50">
                  {/* Client */}

                  {/* Job */}
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {job.jobNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{job.clientName}</span>
                      <span className="text-xs text-gray-500">{job.phone}</span>
                      <span className="text-xs text-gray-400">
                        {job.companyName}
                      </span>
                    </div>
                  </td>



                  {/* Location */}
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <div>{job.address}</div>
                      <div>
                        {job.city}, {job.state} {job.zip}
                      </div>
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="px-4 py-3 text-xs">
                    <div>
                      {job.startDate} {job.startTime}
                    </div>
                    <div className="text-gray-500">
                      to {job.endDate} {job.endTime}
                    </div>
                  </td>

                  {/* Service */}
                  <td className="px-4 py-3">{job.service}</td>

                  {/* Technician */}
                  <td className="px-4 py-3">{job.technician}</td>

                  {/* Amount */}
                  <td className="px-4 py-3 font-semibold">
                    {job.amount > 0 ? `$${job.amount}` : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/jobs/${job.id}`)}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteJob(job.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            <div className="font-semibold">{job.clientName}</div>
            <div className="text-sm text-gray-500">{job.phone}</div>
            <div className="text-sm">{job.service}</div>
            <div className="text-xs text-gray-500">
              {job.city}, {job.state}
            </div>

            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[job.status]}`}
              >
                {job.status}
              </span>

              <div className="flex gap-2">
                <Eye size={16} />
                <Edit size={16} />
                <Trash2 size={16} />
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
            className={`px-3 py-2 text-sm rounded-lg font-medium transition ${
              isActive
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


      {/* Modal */}
      <AddJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={() => { }}
        title="Create Job"
      />
    </div>
  )
}
