// ClientFeedback.tsx
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Calendar,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Briefcase,
  Building2,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight,
  FileText,
  Target,
  DollarSign,
  Sparkles,
  Flag
} from "lucide-react"

/* ===================== TYPES ===================== */

interface Client {
  id: string
  name: string
  companyName?: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  avatar?: string
}

interface CompletedJob {
  id: string
  jobNumber: string
  service: string
  completedDate: string
  totalAmount: number
  technician: string
  client: Client
}

interface FeedbackRecord {
  id: string
  jobId: string
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

const completedJobs: CompletedJob[] = [
  {
    id: "JOB-001",
    jobNumber: "JOB-480",
    service: "Tile Installation",
    completedDate: "2024-01-15",
    totalAmount: 2578.95,
    technician: "Mike Johnson",
    client: {
      id: "CLT-001",
      name: "Robin Stevens",
      companyName: "Stevens Flooring",
      email: "robin@stevensflooring.com",
      phone: "(413) 275-4790",
      address: "2225 Charlotte Street",
      city: "New York",
      state: "NY",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    }
  },
  {
    id: "JOB-002",
    jobNumber: "JOB-506",
    service: "Carpet Installation",
    completedDate: "2024-01-14",
    totalAmount: 6598.45,
    technician: "Lisa Brown",
    client: {
      id: "CLT-002",
      name: "Teresa Lafoon",
      companyName: "Lafoon Interiors",
      email: "teresa@lafooninteriors.com",
      phone: "(919) 259-3932",
      address: "215 Granger Rd",
      city: "Charlotte",
      state: "NC",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    }
  },
  {
    id: "JOB-003",
    jobNumber: "JOB-507",
    service: "Hardwood Repair",
    completedDate: "2024-01-12",
    totalAmount: 1004.00,
    technician: "Tom Davis",
    client: {
      id: "CLT-003",
      name: "Kristopher Decker",
      companyName: "Decker Homes",
      email: "kdecker@deckerhomes.com",
      phone: "(847) 989-1986",
      address: "109 Donna Pl",
      city: "Cary",
      state: "NC"
    }
  },
  {
    id: "JOB-004",
    jobNumber: "JOB-508",
    service: "Laminate & LVP Install",
    completedDate: "2024-01-10",
    totalAmount: 3200.00,
    technician: "Mike Johnson",
    client: {
      id: "CLT-004",
      name: "Monica Johnson",
      companyName: "Johnson Interiors",
      email: "monica@johnsoninteriors.com",
      phone: "(984) 209-0465",
      address: "717 Obsidian Way",
      city: "Durham",
      state: "NC",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  },
  {
    id: "JOB-005",
    jobNumber: "JOB-509",
    service: "Vinyl Flooring",
    completedDate: "2024-01-08",
    totalAmount: 4500.00,
    technician: "Sarah Miller",
    client: {
      id: "CLT-005",
      name: "David Martinez",
      companyName: "Martinez Construction",
      email: "david@martinezconstruction.com",
      phone: "(919) 555-0123",
      address: "890 Industrial Blvd",
      city: "Raleigh",
      state: "NC",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    }
  },
  {
    id: "JOB-006",
    jobNumber: "JOB-510",
    service: "Bathroom Tile",
    completedDate: "2024-01-05",
    totalAmount: 1850.00,
    technician: "Tom Davis",
    client: {
      id: "CLT-006",
      name: "Jennifer Wilson",
      email: "jennifer.wilson@email.com",
      phone: "(555) 123-4567",
      address: "456 Oak Avenue",
      city: "Brooklyn",
      state: "NY",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
    }
  }
]

const feedbackRecords: Record<string, FeedbackRecord> = {
  "JOB-001": {
    id: "FB-001",
    jobId: "JOB-001",
    requestedDate: "2024-01-16",
    submittedDate: "2024-01-17",
    status: "submitted",
    personalGoal: {
      goal: "Achieve better work-life balance by spending more quality time with family",
      deadline: "2024-06-30",
      actionPlan: "Set strict working hours, delegate more tasks, plan weekly family activities"
    },
    professionalGoal: {
      goal: "Expand flooring business to 3 new locations",
      deadline: "2024-12-31",
      actionPlan: "Research potential locations, secure financing, hire regional managers"
    },
    financialGoal: {
      goal: "Increase annual revenue by 40% to $2M",
      deadline: "2024-12-31",
      actionPlan: "Expand service offerings, improve marketing, build strategic partnerships"
    },
    finishLine: "I envision having a thriving multi-location business that runs smoothly even without my daily involvement, allowing me to spend quality time with my family while maintaining financial security."
  },
  "JOB-002": {
    id: "FB-002",
    jobId: "JOB-002",
    requestedDate: "2024-01-15",
    status: "requested"
  },
  "JOB-004": {
    id: "FB-004",
    jobId: "JOB-004",
    requestedDate: "2024-01-11",
    submittedDate: "2024-01-12",
    status: "viewed",
    personalGoal: {
      goal: "Complete a professional interior design certification",
      deadline: "2024-09-30",
      actionPlan: "Enroll in accredited program, dedicate 10 hours/week to studies"
    },
    professionalGoal: {
      goal: "Launch a luxury interior design division",
      deadline: "2024-08-31",
      actionPlan: "Build portfolio, network with high-end clients, hire specialized designers"
    },
    financialGoal: {
      goal: "Save $50,000 for business expansion",
      deadline: "2024-12-31",
      actionPlan: "Set aside 20% of profits monthly, reduce overhead costs"
    },
    finishLine: "I see myself as a recognized interior design expert with a successful luxury division, financially secure and creatively fulfilled."
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

/* ===================== REQUEST MODAL COMPONENT ===================== */

interface RequestFeedbackModalProps {
  showRequestModal: boolean
  selectedJob: CompletedJob | null
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  setShowRequestModal: (show: boolean) => void
  handleSubmitFeedback: () => void
  isFormValid: () => boolean
}

const RequestFeedbackModal = ({
  showRequestModal,
  selectedJob,
  formData,
  setFormData,
  setShowRequestModal,
  handleSubmitFeedback,
  isFormValid
}: RequestFeedbackModalProps) => {
  if (!showRequestModal || !selectedJob) return null

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

        {/* Client Info Bar */}
        <div className="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedJob.client.avatar ? (
              <img
                src={selectedJob.client.avatar}
                alt={selectedJob.client.name}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={16} className="text-primary" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{selectedJob.client.name}</p>
              <p className="text-xs text-gray-500">
                {selectedJob.client.companyName} • {selectedJob.jobNumber}
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
            onClick={handleSubmitFeedback}
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

export default function ClientFeedback() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_requested' | 'requested' | 'submitted' | 'viewed'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null)
  const [feedbackData, setFeedbackData] = useState(feedbackRecords)
  const rowsPerPage = 10

  // Form states for PPF
  const [formData, setFormData] = useState<FormData>({
    personalGoal: { goal: '', deadline: '', actionPlan: '' },
    professionalGoal: { goal: '', deadline: '', actionPlan: '' },
    financialGoal: { goal: '', deadline: '', actionPlan: '' },
    finishLine: ''
  })

  /* ===================== STATS ===================== */

  const stats = useMemo(() => {
    let total = completedJobs.length
    let notRequested = 0
    let requested = 0
    let submitted = 0
    let viewed = 0

    completedJobs.forEach(job => {
      const feedback = feedbackData[job.id]
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
  }, [feedbackData])

  /* ===================== FILTERED DATA ===================== */

  const filteredJobs = useMemo(() => {
    return completedJobs.filter(job => {
      const searchValue = searchTerm.toLowerCase()
      const matchesSearch =
        job.jobNumber.toLowerCase().includes(searchValue) ||
        job.client.name.toLowerCase().includes(searchValue) ||
        (job.client.companyName?.toLowerCase().includes(searchValue) || false) ||
        job.service.toLowerCase().includes(searchValue) ||
        job.technician.toLowerCase().includes(searchValue)

      const feedback = feedbackData[job.id]
      const jobStatus = feedback?.status || 'not_requested'

      const matchesFilter =
        filterStatus === 'all' ||
        jobStatus === filterStatus

      return matchesSearch && matchesFilter
    })
  }, [searchTerm, filterStatus, feedbackData])

  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  /* ===================== HANDLERS ===================== */

  const handleRequestFeedback = (job: CompletedJob) => {
    setSelectedJob(job)
    setFormData({
      personalGoal: { goal: '', deadline: '', actionPlan: '' },
      professionalGoal: { goal: '', deadline: '', actionPlan: '' },
      financialGoal: { goal: '', deadline: '', actionPlan: '' },
      finishLine: ''
    })
    setShowRequestModal(true)
  }

  const handleSubmitFeedback = () => {
    if (!selectedJob) return

    const newFeedback: FeedbackRecord = {
      id: `FB-${Date.now()}`,
      jobId: selectedJob.id,
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
      [selectedJob.id]: newFeedback
    }))

    setShowRequestModal(false)
    setSelectedJob(null)
  }

  const handleViewFeedback = (jobId: string) => {
    navigate(`/client-feedback/view/${jobId}`)
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
          <h1 className="text-3xl font-bold text-black">Client Feedback</h1>
          <p className="text-sm text-gray-600 mt-1">
            PPF - Purpose, Priority, Finish Line
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Not Requested</p>
              <p className="text-xl font-bold text-gray-600">{stats.notRequested}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Send className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Requested</p>
              <p className="text-xl font-bold text-yellow-600">{stats.requested}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-xl font-bold text-green-600">{stats.submitted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Viewed</p>
              <p className="text-xl font-bold text-blue-600">{stats.viewed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job number, client name, company, or service..."
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Job #",
                  "Client",
                  "Service",
                  "Completed Date",
                  "Amount",
                  "Technician",
                  "Status",
                  "Req Feedback",
                  "Check Feedback"
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
              {paginatedJobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500">
                    No completed jobs found
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => {
                  const feedback = feedbackData[job.id]
                  const status = feedback?.status || 'not_requested'
                  const statusConfig = getFeedbackStatusConfig(status)
                  const hasSubmitted = status === 'submitted' || status === 'viewed'

                  return (
                    <tr key={job.id} className="border-t hover:bg-primary/10">
                      {/* Job Number */}
                      <td className="px-4 py-3 font-semibold text-primary text-nowrap ">
                       <button
                            onClick={() => navigate(`/client/jobs/1`)}
                            className="  underline"
                          >
                            {job.jobNumber }
                          </button>
                      </td>
                      {/* /client/jobs/1 */}

                      {/* Client */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {job.client.avatar ? (
                            <img
                              src={job.client.avatar}
                              alt={job.client.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-xs">
                                {job.client.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{job.client.name}</p>
                            {job.client.companyName && (
                              <p className="text-xs text-gray-500">{job.client.companyName}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3">{job.service}</td>

                      {/* Completed Date */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(job.completedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 font-semibold">
                        ${job.totalAmount.toLocaleString()}
                      </td>

                      {/* Technician */}
                      <td className="px-4 py-3">{job.technician}</td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <statusConfig.icon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Req Feedback */}
                      <td className="px-4 py-3">
                        {!hasSubmitted ? (
                          <button
                            onClick={() => handleRequestFeedback(job)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition"
                          >
                            <Send size={14} />
                            Request
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Completed</span>
                        )}
                      </td>

                     
                      <td className="px-4 py-3">
                        {hasSubmitted ? (
                          <button
                            onClick={() => handleViewFeedback(job.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-green-800 transition"
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
        {filteredJobs.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{(currentPage - 1) * rowsPerPage + 1}</span>
              {" - "}
              <span className="font-semibold">
                {Math.min(currentPage * rowsPerPage, filteredJobs.length)}
              </span>
              {" of "}
              <span className="font-semibold">{filteredJobs.length}</span>
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

      {/* Request Feedback Modal */}
      <RequestFeedbackModal
        showRequestModal={showRequestModal}
        selectedJob={selectedJob}
        formData={formData}
        setFormData={setFormData}
        setShowRequestModal={setShowRequestModal}
        handleSubmitFeedback={handleSubmitFeedback}
        isFormValid={isFormValid}
      />
    </div>
  )
}