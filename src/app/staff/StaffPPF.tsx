// StaffPPF.tsx
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Calendar,
  Eye,
  Send,
  CheckCircle,
  Clock,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  X,
  FileText,
  History,
  Star
} from "lucide-react"
import { mockStaff, type Staff, type StaffRole, type StaffStatus } from "../../types/staff"

/* ===================== TYPES ===================== */

interface FeedbackRecord {
  id: string
  staffId: string
  requestedDate?: string
  submittedDate?: string
  status: 'not_requested' | 'requested' | 'submitted' | 'viewed'
  personalGoal?: {
    goal: string
    deadline: string
    actionPlan: string
  }
  professionalGoal?: {
    goal: string
    deadline: string
    actionPlan: string
  }
  financialGoal?: {
    goal: string
    deadline: string
    actionPlan: string
  }
  finishLine?: string
}

interface FormData {
  personalGoal: { goal: string; deadline: string; actionPlan: string }
  professionalGoal: { goal: string; deadline: string; actionPlan: string }
  financialGoal: { goal: string; deadline: string; actionPlan: string }
  finishLine: string
}

/* ===================== MOCK DATA ===================== */

const staffPPFRecords: Record<string, FeedbackRecord> = {
  "STF-001": {
    id: "PPF-001",
    staffId: "STF-001",
    requestedDate: "2024-01-16",
    submittedDate: "2024-01-17",
    status: "submitted",
    personalGoal: {
      goal: "Achieve better work-life balance by spending more quality time with family",
      deadline: "2024-06-30",
      actionPlan: "Set strict working hours, delegate more tasks, plan weekly family activities"
    },
    professionalGoal: {
      goal: "Complete advanced technician certification",
      deadline: "2024-12-31",
      actionPlan: "Enroll in training program, practice 5 hours/week, pass certification exam"
    },
    financialGoal: {
      goal: "Save $25,000 for down payment on house",
      deadline: "2024-12-31",
      actionPlan: "Save 20% of income monthly, reduce unnecessary expenses, take overtime when available"
    },
    finishLine: "I envision owning my own home with my family, being a certified expert in my field, and having financial security for the future."
  },
  "STF-002": {
    id: "PPF-002",
    staffId: "STF-002",
    requestedDate: "2024-01-15",
    status: "requested"
  },
  "STF-004": {
    id: "PPF-004",
    staffId: "STF-004",
    requestedDate: "2024-01-11",
    submittedDate: "2024-01-12",
    status: "viewed",
    personalGoal: {
      goal: "Improve health and fitness through regular exercise",
      deadline: "2024-09-30",
      actionPlan: "Join gym, workout 4 days/week, meal prep on Sundays"
    },
    professionalGoal: {
      goal: "Get promoted to Senior Dispatcher",
      deadline: "2024-08-31",
      actionPlan: "Take leadership courses, mentor new dispatchers, improve efficiency metrics"
    },
    financialGoal: {
      goal: "Pay off all credit card debt ($8,000)",
      deadline: "2024-12-31",
      actionPlan: "Pay $700/month, stop using cards, sell unused items"
    },
    finishLine: "I see myself debt-free, healthy, and in a leadership position where I can help others grow."
  }
}

/* ===================== STATUS CONFIGS ===================== */

const getFeedbackStatusConfig = (status: string) => {
  switch (status) {
    case 'submitted':
      return {
        label: 'Submitted',
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle
      }
    case 'requested':
      return {
        label: 'Requested',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: Clock
      }
    case 'viewed':
      return {
        label: 'Viewed',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: Eye
      }
    default:
      return {
        label: 'Not Requested',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: FileText
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

/* ===================== REQUEST MODAL COMPONENT ===================== */

interface RequestPPFModalProps {
  showRequestModal: boolean
  selectedStaff: Staff | null
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  setShowRequestModal: (show: boolean) => void
  handleSubmitPPF: () => void
  isFormValid: () => boolean
}

const RequestPPFModal = ({
  showRequestModal,
  selectedStaff,
  formData,
  setFormData,
  setShowRequestModal,
  handleSubmitPPF,
  isFormValid
}: RequestPPFModalProps) => {
  if (!showRequestModal || !selectedStaff) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowRequestModal(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-5 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Team Member PPF</h2>
              <p className="text-sm text-white/80">Purpose. Priority. Finish Line.</p>
            </div>
            <button
              onClick={() => setShowRequestModal(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Staff Info Bar */}
        <div className="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedStaff.avatar ? (
              <img
                src={selectedStaff.avatar}
                alt={`${selectedStaff.firstName} ${selectedStaff.lastName}`}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {selectedStaff.firstName} {selectedStaff.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {selectedStaff.employeeId} • {getRoleLabel(selectedStaff.role)}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* Instructions */}
        <div className="px-5 py-2 border-b">
          <p className="text-xs text-gray-600">
            Set clear yearly goals in three areas: <span className="font-medium">Personal</span>, <span className="font-medium">Professional</span>, and <span className="font-medium">Financial</span>. Each goal should be specific, measurable, and time-bound.
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. Personal Goal */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Personal Goal</h3>
                <p className="text-xs text-gray-500">What is a personal goal you want to accomplish this year?</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Goal</label>
                <textarea
                  value={formData.personalGoal.goal}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personalGoal: { ...prev.personalGoal, goal: e.target.value }
                  }))}
                  placeholder="Describe your personal goal..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Deadline</label>
                  <input
                    type="date"
                    value={formData.personalGoal.deadline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalGoal: { ...prev.personalGoal, deadline: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Action Plan</label>
                  <input
                    type="text"
                    value={formData.personalGoal.actionPlan}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalGoal: { ...prev.personalGoal, actionPlan: e.target.value }
                    }))}
                    placeholder="Key steps to achieve..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Professional Goal */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Professional Goal</h3>
                <p className="text-xs text-gray-500">What is a professional goal you want to accomplish this year?</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Goal</label>
                <textarea
                  value={formData.professionalGoal.goal}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    professionalGoal: { ...prev.professionalGoal, goal: e.target.value }
                  }))}
                  placeholder="Describe your professional goal..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Deadline</label>
                  <input
                    type="date"
                    value={formData.professionalGoal.deadline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      professionalGoal: { ...prev.professionalGoal, deadline: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Action Plan</label>
                  <input
                    type="text"
                    value={formData.professionalGoal.actionPlan}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      professionalGoal: { ...prev.professionalGoal, actionPlan: e.target.value }
                    }))}
                    placeholder="Key steps to achieve..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Financial Goal */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Financial Goal</h3>
                <p className="text-xs text-gray-500">What is a financial goal you want to accomplish this year?</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Goal</label>
                <textarea
                  value={formData.financialGoal.goal}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    financialGoal: { ...prev.financialGoal, goal: e.target.value }
                  }))}
                  placeholder="Describe your financial goal..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Deadline</label>
                  <input
                    type="date"
                    value={formData.financialGoal.deadline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      financialGoal: { ...prev.financialGoal, deadline: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Action Plan</label>
                  <input
                    type="text"
                    value={formData.financialGoal.actionPlan}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      financialGoal: { ...prev.financialGoal, actionPlan: e.target.value }
                    }))}
                    placeholder="Key steps to achieve..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Finish Line */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">4</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Finish Line</h3>
                <p className="text-xs text-gray-500">How do you envision your life, work, or future looking once you accomplish these goals?</p>
              </div>
            </div>

            <textarea
              value={formData.finishLine}
              onChange={(e) => setFormData(prev => ({ ...prev, finishLine: e.target.value }))}
              placeholder="Describe your vision for the future..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setShowRequestModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitPPF}
            disabled={!isFormValid()}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================== MAIN COMPONENT ===================== */

export default function StaffPPF() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_requested' | 'requested' | 'submitted' | 'viewed'>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [feedbackData, setFeedbackData] = useState(staffPPFRecords)
  const rowsPerPage = 10

  // Form states for PPF
  const [formData, setFormData] = useState<FormData>({
    personalGoal: { goal: '', deadline: '', actionPlan: '' },
    professionalGoal: { goal: '', deadline: '', actionPlan: '' },
    financialGoal: { goal: '', deadline: '', actionPlan: '' },
    finishLine: ''
  })

  // Filter only active staff (exclude terminated)
  const activeStaff = mockStaff.filter(s => s.status !== 'terminated')

  // Get unique departments
  const departments = [...new Set(activeStaff.map(s => s.department))]

  /* ===================== STATS ===================== */

  const stats = useMemo(() => {
    let total = activeStaff.length
    let notRequested = 0
    let requested = 0
    let submitted = 0
    let viewed = 0

    activeStaff.forEach(staff => {
      const feedback = feedbackData[staff.id]
      if (!feedback || feedback.status === 'not_requested') {
        notRequested++
      } else if (feedback.status === 'requested') {
        requested++
      } else if (feedback.status === 'submitted') {
        submitted++
      } else if (feedback.status === 'viewed') {
        viewed++
      }
    })

    return { total, notRequested, requested, submitted, viewed }
  }, [feedbackData, activeStaff])

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

      const feedback = feedbackData[staff.id]
      const staffStatus = feedback?.status || 'not_requested'

      const matchesFilter =
        filterStatus === 'all' ||
        staffStatus === filterStatus

      const matchesRole = roleFilter === 'all' || staff.role === roleFilter
      const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter

      return matchesSearch && matchesFilter && matchesRole && matchesDepartment
    })
  }, [searchTerm, filterStatus, roleFilter, departmentFilter, feedbackData, activeStaff])

  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage)
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  /* ===================== HANDLERS ===================== */

  const handleRequestPPF = (staff: Staff) => {
    setSelectedStaff(staff)
    setFormData({
      personalGoal: { goal: '', deadline: '', actionPlan: '' },
      professionalGoal: { goal: '', deadline: '', actionPlan: '' },
      financialGoal: { goal: '', deadline: '', actionPlan: '' },
      finishLine: ''
    })
    setShowRequestModal(true)
  }

  const handleSubmitPPF = () => {
    if (!selectedStaff) return

    const newFeedback: FeedbackRecord = {
      id: `PPF-${Date.now()}`,
      staffId: selectedStaff.id,
      requestedDate: new Date().toISOString().split('T')[0],
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      personalGoal: formData.personalGoal,
      professionalGoal: formData.professionalGoal,
      financialGoal: formData.financialGoal,
      finishLine: formData.finishLine
    }

    setFeedbackData(prev => ({
      ...prev,
      [selectedStaff.id]: newFeedback
    }))

    setShowRequestModal(false)
    setSelectedStaff(null)
  }

  const handleViewPPF = (staffId: string) => {
    navigate(`/client-feedback/view/JOB-001`)
  }

  const isFormValid = () => {
    return (
      formData.personalGoal.goal.trim() !== '' &&
      formData.personalGoal.deadline !== '' &&
      formData.personalGoal.actionPlan.trim() !== '' &&
      formData.professionalGoal.goal.trim() !== '' &&
      formData.professionalGoal.deadline !== '' &&
      formData.professionalGoal.actionPlan.trim() !== '' &&
      formData.financialGoal.goal.trim() !== '' &&
      formData.financialGoal.deadline !== '' &&
      formData.financialGoal.actionPlan.trim() !== '' &&
      formData.finishLine.trim() !== ''
    )
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Staff PPF</h1>
          <p className="text-sm text-gray-600 mt-1">
            Purpose, Priority, Finish Line - Team Member Goals
          </p>
        </div>
      </div>

     
      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[450px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, employee ID, email, role, or department..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {[
              { value: 'all', label: 'All' },
              { value: 'not_requested', label: 'Not Requested' },
              { value: 'requested', label: 'Requested' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'viewed', label: 'Viewed' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilterStatus(item.value as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${
                  filterStatus === item.value
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
                  "Last PPF",
                  "PPF Status",
                  "Request PPF",
                  "View PPF"
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
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((staff) => {
                  const feedback = feedbackData[staff.id]
                  const status = feedback?.status || 'not_requested'
                  const statusConfig = getFeedbackStatusConfig(status)
                  const hasSubmitted = status === 'submitted' || status === 'viewed'
                  const staffStatusConfig = getStaffStatusConfig(staff.status)

                  return (
                    <tr key={staff.id} className="border-t hover:bg-primary/5">
                      {/* Staff */}
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
                            <button
                              onClick={() => navigate(`/staff/${staff.id}`)}
                              className="font-medium text-primary hover:underline text-left"
                            >
                              {staff.firstName} {staff.lastName}
                            </button>
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
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        </div>
                      </td>

                      {/* Last PPF */}
                      <td className="px-4 py-3">
                        {feedback?.submittedDate ? (
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {new Date(feedback.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not submitted</span>
                        )}
                      </td>

                      {/* PPF Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <statusConfig.icon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Request PPF */}
                      <td className="px-4 py-3">
                        {!hasSubmitted ? (
                          <button
                            onClick={() => handleRequestPPF(staff)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition"
                          >
                            <Send size={14} />
                            Request
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Completed</span>
                        )}
                      </td>

                      {/* View PPF */}
                      <td className="px-4 py-3">
                        {hasSubmitted ? (
                          <button
                            onClick={() => handleViewPPF(staff.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
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

      {/* Request PPF Modal */}
      <RequestPPFModal
        showRequestModal={showRequestModal}
        selectedStaff={selectedStaff}
        formData={formData}
        setFormData={setFormData}
        setShowRequestModal={setShowRequestModal}
        handleSubmitPPF={handleSubmitPPF}
        isFormValid={isFormValid}
      />
    </div>
  )
}