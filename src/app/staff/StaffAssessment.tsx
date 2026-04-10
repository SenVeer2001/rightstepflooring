// StaffAssessment.tsx
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Calendar,
  Eye,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Briefcase,
  TrendingUp,
  Award,
  History,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight
} from "lucide-react"
import { mockStaff, type Staff, type StaffRole, type StaffStatus } from "../../types/staff"

/* ===================== TYPES ===================== */

interface AssessmentRecord {
  id: string
  staffId: string
  lastAssessmentDate?: string
  lastAssessmentScore?: number
  lastAssessmentStatus?: 'excellent' | 'good' | 'needs_improvement'
  nextAssessmentDue: string
  completedDate?: string
}

interface AssessmentHistoryItem {
  id: string
  assessmentDate: string
  completedDate: string
  score: number
  status: 'excellent' | 'good' | 'needs_improvement'
  assessedBy: string
}

/* ===================== MOCK ASSESSMENT DATA ===================== */

const staffAssessments: Record<string, AssessmentRecord> = {
  "STF-001": {
    id: "ASS-001",
    staffId: "STF-001",
    lastAssessmentDate: "2024-01-16",
    lastAssessmentScore: 92,
    lastAssessmentStatus: "excellent",
    nextAssessmentDue: "2026-04-10",
    completedDate: "2024-01-16"
  },
  "STF-002": {
    id: "ASS-002",
    staffId: "STF-002",
    lastAssessmentDate: "2024-01-10",
    lastAssessmentScore: 78,
    lastAssessmentStatus: "good",
    nextAssessmentDue: "2024-02-10",
    completedDate: "2024-01-10"
  },
  "STF-003": {
    id: "ASS-003",
    staffId: "STF-003",
    lastAssessmentDate: "2024-01-05",
    lastAssessmentScore: 95,
    lastAssessmentStatus: "excellent",
    nextAssessmentDue: "2026-06-25",
    completedDate: "2024-01-05"
  },
  "STF-004": {
    id: "ASS-004",
    staffId: "STF-004",
    lastAssessmentDate: "2024-01-08",
    lastAssessmentScore: 65,
    lastAssessmentStatus: "needs_improvement",
    nextAssessmentDue: "2024-01-25", // Overdue
    completedDate: "2024-01-08"
  },
  "STF-005": {
    id: "ASS-005",
    staffId: "STF-005",
    nextAssessmentDue: "2024-02-01" // Pending - no previous assessment
  },
  "STF-006": {
    id: "ASS-006",
    staffId: "STF-006",
    lastAssessmentDate: "2023-12-15",
    lastAssessmentScore: 82,
    lastAssessmentStatus: "good",
    nextAssessmentDue: "2024-01-15", // Overdue (on leave)
    completedDate: "2023-12-15"
  },
  "STF-007": {
    id: "ASS-007",
    staffId: "STF-007",
    nextAssessmentDue: "2024-02-15" // Pending - no previous assessment
  },
  "STF-008": {
    id: "ASS-008",
    staffId: "STF-008",
    lastAssessmentDate: "2024-01-12",
    lastAssessmentScore: 88,
    lastAssessmentStatus: "good",
    nextAssessmentDue: "2024-02-12",
    completedDate: "2024-01-12"
  },
  "STF-009": {
    id: "ASS-009",
    staffId: "STF-009",
    lastAssessmentDate: "2024-01-18",
    lastAssessmentScore: 96,
    lastAssessmentStatus: "excellent",
    nextAssessmentDue: "2024-02-18",
    completedDate: "2024-01-18"
  },
  "STF-011": {
    id: "ASS-011",
    staffId: "STF-011",
    lastAssessmentDate: "2024-01-14",
    lastAssessmentScore: 90,
    lastAssessmentStatus: "excellent",
    nextAssessmentDue: "2024-02-14",
    completedDate: "2024-01-14"
  },
  "STF-012": {
    id: "ASS-012",
    staffId: "STF-012",
    lastAssessmentDate: "2023-11-20",
    lastAssessmentScore: 72,
    lastAssessmentStatus: "good",
    nextAssessmentDue: "2023-12-20", // Overdue (inactive)
    completedDate: "2023-11-20"
  }
}

// Mock Assessment History
const assessmentHistory: Record<string, AssessmentHistoryItem[]> = {
  "STF-001": [
    { id: "H1-1", assessmentDate: "2024-01-16", completedDate: "2024-01-16", score: 92, status: "excellent", assessedBy: "Admin" },
    { id: "H1-2", assessmentDate: "2023-12-16", completedDate: "2023-12-16", score: 88, status: "good", assessedBy: "Sarah Johnson" },
    { id: "H1-3", assessmentDate: "2023-11-16", completedDate: "2023-11-16", score: 85, status: "good", assessedBy: "Admin" },
    { id: "H1-4", assessmentDate: "2023-10-16", completedDate: "2023-10-16", score: 90, status: "excellent", assessedBy: "Sarah Johnson" },
  ],
  "STF-002": [
    { id: "H2-1", assessmentDate: "2024-01-10", completedDate: "2024-01-10", score: 78, status: "good", assessedBy: "Admin" },
    { id: "H2-2", assessmentDate: "2023-12-10", completedDate: "2023-12-10", score: 75, status: "good", assessedBy: "Admin" },
  ],
  "STF-003": [
    { id: "H3-1", assessmentDate: "2024-01-05", completedDate: "2024-01-05", score: 95, status: "excellent", assessedBy: "Admin" },
    { id: "H3-2", assessmentDate: "2023-12-05", completedDate: "2023-12-05", score: 94, status: "excellent", assessedBy: "Admin" },
    { id: "H3-3", assessmentDate: "2023-11-05", completedDate: "2023-11-05", score: 92, status: "excellent", assessedBy: "Admin" },
  ],
  "STF-004": [
    { id: "H4-1", assessmentDate: "2024-01-08", completedDate: "2024-01-08", score: 65, status: "needs_improvement", assessedBy: "Sarah Johnson" },
    { id: "H4-2", assessmentDate: "2023-12-08", completedDate: "2023-12-08", score: 70, status: "good", assessedBy: "Sarah Johnson" },
  ],
}

/* ===================== STATUS CONFIGS ===================== */

const getAssessmentStatusConfig = (status?: string) => {
  switch (status) {
    case 'excellent':
      return {
        label: 'Excellent',
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: CheckCircle
      }
    case 'good':
      return {
        label: 'Good',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: TrendingUp
      }
    case 'needs_improvement':
      return {
        label: 'Needs Improvement',
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: AlertCircle
      }
    default:
      return {
        label: 'Not Assessed',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: Clock
      }
  }
}

const getStaffStatusConfig = (status: StaffStatus) => {
  switch (status) {
    case 'active':
      return { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' }
    case 'inactive':
      return { label: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-700' }
    case 'on_leave':
      return { label: 'On Leave', bg: 'bg-yellow-100', text: 'text-yellow-700' }
    case 'terminated':
      return { label: 'Terminated', bg: 'bg-red-100', text: 'text-red-700' }
    default:
      return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-700' }
  }
}

const getRoleLabel = (role: StaffRole) => {
  const labels: Record<StaffRole, string> = {
    admin: 'Admin',
    manager: 'Manager',
    technician: 'Technician',
    dispatcher: 'Dispatcher',
    sales: 'Sales',
    support: 'Support',
    accounting: 'Accounting'
  }
  return labels[role]
}

/* ===================== COMPONENT ===================== */

export default function StaffAssessment() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'assessed' | 'pending' | 'overdue'>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedStaffForHistory, setSelectedStaffForHistory] = useState<Staff | null>(null)
  const rowsPerPage = 10

  // Filter only active staff (exclude terminated)
  const activeStaff = mockStaff.filter(s => s.status !== 'terminated')

  /* ===================== HELPER FUNCTIONS ===================== */

  const isAssessmentOverdue = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return due < today
  }

  const isAssessmentDueToday = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return due.getTime() === today.getTime()
  }

  const canStartAssessment = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return due <= today
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  /* ===================== STATS ===================== */

  const stats = useMemo(() => {
    let assessed = 0
    let pending = 0
    let overdue = 0
    let excellent = 0
    let needsImprovement = 0
    let totalScore = 0
    let scoreCount = 0

    activeStaff.forEach(staff => {
      const assessment = staffAssessments[staff.id]
      if (assessment) {
        if (assessment.lastAssessmentDate) {
          assessed++
          if (assessment.lastAssessmentScore) {
            totalScore += assessment.lastAssessmentScore
            scoreCount++
          }
          if (assessment.lastAssessmentStatus === 'excellent') excellent++
          if (assessment.lastAssessmentStatus === 'needs_improvement') needsImprovement++
        }

        if (isAssessmentOverdue(assessment.nextAssessmentDue)) {
          overdue++
        } else if (!assessment.lastAssessmentDate) {
          pending++
        }
      } else {
        pending++
      }
    })

    return {
      total: activeStaff.length,
      assessed,
      pending,
      overdue,
      excellent,
      needsImprovement,
      avgScore: scoreCount > 0 ? totalScore / scoreCount : 0
    }
  }, [activeStaff])

  /* ===================== FILTERED DATA ===================== */

  const filteredStaff = useMemo(() => {
    return activeStaff.filter(staff => {
      const searchValue = searchTerm.toLowerCase()
      const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchValue) ||
        staff.employeeId.toLowerCase().includes(searchValue) ||
        staff.email.toLowerCase().includes(searchValue) ||
        staff.department.toLowerCase().includes(searchValue) ||
        staff.role.toLowerCase().includes(searchValue)

      const assessment = staffAssessments[staff.id]
      const isOverdue = assessment && isAssessmentOverdue(assessment.nextAssessmentDue)
      const isPending = !assessment?.lastAssessmentDate
      const isAssessed = !!assessment?.lastAssessmentDate

      const matchesFilter =
        filterStatus === 'all' ||
        (filterStatus === 'assessed' && isAssessed) ||
        (filterStatus === 'pending' && isPending && !isOverdue) ||
        (filterStatus === 'overdue' && isOverdue)

      const matchesRole = roleFilter === 'all' || staff.role === roleFilter
      const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter

      return matchesSearch && matchesFilter && matchesRole && matchesDepartment
    })
  }, [searchTerm, filterStatus, roleFilter, departmentFilter, activeStaff])

  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage)
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Get unique departments
  const departments = [...new Set(activeStaff.map(s => s.department))]

  /* ===================== HANDLERS ===================== */

  const handleViewReport = (staffId: string) => {
    navigate(`/staff-assessment/view/${staffId}`)
  }

  const handleStartAssessment = (staffId: string) => {
    navigate(`/staff-assessment/start/${staffId}`)
  }

  const handleViewHistory = (staff: Staff) => {
    setSelectedStaffForHistory(staff)
    setShowHistoryModal(true)
  }

  /* ===================== HISTORY MODAL ===================== */

  const HistoryModal = () => {
    if (!showHistoryModal || !selectedStaffForHistory) return null

    const staff = selectedStaffForHistory
    const history = assessmentHistory[staff.id] || []

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowHistoryModal(false)}
      >
        <div
          className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History size={20} />
                <div>
                  <h3 className="text-sm font-semibold">Assessment History</h3>
                  <p className="text-xs text-white/80">
                    {staff.firstName} {staff.lastName} • {staff.employeeId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <History size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No assessment history found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, index) => {
                  const statusConfig = getAssessmentStatusConfig(item.status)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => {
                        setShowHistoryModal(false)
                        navigate(`/staff-assessment/view/${staff.id}?historyId=${item.id}`)
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.bg}`}>
                          <statusConfig.icon size={20} className={statusConfig.text} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(item.assessmentDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            Completed: {new Date(item.completedDate).toLocaleDateString()} • By: {item.assessedBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{item.score}%</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t flex justify-end flex-shrink-0">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Staff Assessment</h1>
          <p className="text-sm text-gray-600 mt-1">
            Monthly self-assessment for team members
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assessed</p>
              <p className="text-xl font-bold text-green-600">{stats.assessed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-xl font-bold text-purple-600">{stats.avgScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Excellent</p>
              <p className="text-xl font-bold text-emerald-600">{stats.excellent}</p>
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Needs Work</p>
              <p className="text-xl font-bold text-orange-600">{stats.needsImprovement}</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[600px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, employee ID, email, or department..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {[
              { value: 'all', label: 'All' },
              { value: 'assessed', label: 'Assessed' },
              { value: 'pending', label: 'Pending' },
              { value: 'overdue', label: 'Overdue' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilterStatus(item.value as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${filterStatus === item.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="technician">Technician</option>
            <option value="manager">Manager</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="admin">Admin</option>
            <option value="accounting">Accounting</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Staff",
                  "Role / Department",
                  "Status",
                  "Rating",
                  "Last Assessment",
                  "Next Assessment",
                  "Actions"
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((staff) => {
                  const assessment = staffAssessments[staff.id]
                  const statusConfig = assessment
                    ? getAssessmentStatusConfig(assessment.lastAssessmentStatus)
                    : getAssessmentStatusConfig(undefined)
                  const staffStatusConfig = getStaffStatusConfig(staff.status)
                  const isOverdue = assessment && isAssessmentOverdue(assessment.nextAssessmentDue)
                  const isDueToday = assessment && isAssessmentDueToday(assessment.nextAssessmentDue)
                  const canStart = assessment && canStartAssessment(assessment.nextAssessmentDue)
                  const daysUntilDue = assessment ? getDaysUntilDue(assessment.nextAssessmentDue) : null

                  return (
                    <tr key={staff.id} className="border-t hover:bg-gray-50">
                      {/* Staff Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={`${staff.firstName} ${staff.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {staff.firstName[0]}{staff.lastName[0]}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{staff.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role / Department */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 capitalize">
                            {getRoleLabel(staff.role)}
                          </p>
                          <p className="text-xs text-gray-500">{staff.department}</p>
                        </div>
                      </td>

                      {/* Staff Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${staffStatusConfig.bg} ${staffStatusConfig.text}`}>
                          {staffStatusConfig.label}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">{staff.rating}</span>
                          <span className="text-yellow-400">★</span>
                        </div>
                      </td>
                      

                      {/* Last Assessment */}
                      <td className="px-4 py-3">
                        {assessment?.lastAssessmentDate ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-xs text-gray-600">
                                {new Date(assessment.lastAssessmentDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                <statusConfig.icon size={10} />
                                {statusConfig.label}
                              </span>
                              {assessment.lastAssessmentScore && (
                                <span className="text-xs font-semibold text-gray-700">
                                  {assessment.lastAssessmentScore}%
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleViewReport(staff.id)}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <Eye size={12} />
                              View Report
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not assessed yet</span>
                        )}
                      </td>

                      {/* Next Assessment */}
                      {/* Next Assessment */}
                      <td className="px-4 py-3">
                        {assessment?.nextAssessmentDue && (
                          <div className="space-y-2">
                            {/* When Overdue - Show Start Button */}
                            {isOverdue && (
                              <div className="flex gap-2">
                                <div className="flex items-center gap-2 text-red-600">
                                  <Calendar size={12} className="text-red-600" />
                                  <span className="text-xs font-medium">
                                    {new Date(assessment.nextAssessmentDue).toLocaleDateString()}
                                  </span>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold">
                                  <AlertCircle size={10} />
                                  OVERDUE
                                </span>
                              </div>
                            )}

                            {/* When Due Today - Show Start Button */}
                            {isDueToday && (
                              <>
                                <div className="flex items-center gap-2 text-green-600">
                                  <Calendar size={12} className="text-green-600" />
                                  <span className="text-xs font-medium">
                                    {new Date(assessment.nextAssessmentDue).toLocaleDateString()}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleStartAssessment(staff.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition w-full justify-center"
                                >
                                  <Play size={14} />
                                  Start Now
                                </button>
                              </>
                            )}

                            {/* When Pending (Future Date) - Show Date Only */}
                            {!isOverdue && !isDueToday && (
                              <>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Calendar size={12} className="text-gray-400" />
                                  <span className="text-xs font-medium">
                                    {new Date(assessment.nextAssessmentDue).toLocaleDateString()}
                                  </span>
                                </div>
                                {daysUntilDue !== null && daysUntilDue > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                    <Clock size={10} />
                                    Pending ({daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''})
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* History Button */}
                          <button
                            onClick={() => handleViewHistory(staff)}
                            className="flex items-center gap-1 px-2 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-lg hover:bg-gray-200 transition"
                            title="View History"
                          >
                            <History size={18} />
                            
                          </button>

                        
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStaff.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{(currentPage - 1) * rowsPerPage + 1}</span>
              {" - "}
              <span className="font-semibold">
                {Math.min(currentPage * rowsPerPage, filteredStaff.length)}
              </span>
              {" of "}
              <span className="font-semibold">{filteredStaff.length}</span>
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

      {/* History Modal */}
      <HistoryModal />
    </div>
  )
}