// ViewClientFeedbackReport.tsx
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Download,
  Printer,
  User,
  Briefcase,
  DollarSign,
  Flag,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building2,
  CheckCircle,
  Target
} from "lucide-react"

/* ===================== MOCK DATA ===================== */

const feedbackReportData = {
  "JOB-001": {
    job: {
      id: "JOB-001",
      jobNumber: "JOB-2024-480",
      service: "Tile Installation",
      completedDate: "2024-01-15",
      totalAmount: 2578.95,
      technician: "Mike Johnson"
    },
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
    },
    feedback: {
      submittedDate: "2024-01-17",
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
      finishLine: "I envision having a thriving multi-location business that runs smoothly even without my daily involvement, allowing me to spend quality time with my family while maintaining financial security. My goal is to create a legacy business that provides excellent service and employment opportunities in multiple communities."
    }
  },
  "JOB-004": {
    job: {
      id: "JOB-004",
      jobNumber: "JOB-2024-508",
      service: "Laminate & LVP Install",
      completedDate: "2024-01-10",
      totalAmount: 3200.00,
      technician: "Mike Johnson"
    },
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
    },
    feedback: {
      submittedDate: "2024-01-12",
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
      finishLine: "I see myself as a recognized interior design expert with a successful luxury division, financially secure and creatively fulfilled. My business will be known for exceptional quality and innovative design solutions."
    }
  }
}

/* ===================== COMPONENT ===================== */

export default function ViewClientFeedbackReport() {
  const navigate = useNavigate()
  const { jobId } = useParams()

  // @ts-ignore
  const reportData = feedbackReportData[jobId || "JOB-001"]

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Feedback report not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const { job, client, feedback } = reportData

  return (
    <div className="min-h-screen  p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Client Feedback</span>
        </button>

        <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Client PPF Report
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Purpose. Priority. Finish Line.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition">
                <Printer size={16} />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Client & Job Info */}
        <div className="lg:col-span-1 space-y-3">
          {/* Client Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-primary  p-4 text-white">
              <div className="flex items-center gap-3">
                {client.avatar ? (
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold  text-white">{client.name}</h3>
                  {client.companyName && (
                    <p className="text-sm text-white/80">{client.companyName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{client.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {client.city}, {client.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Job Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Job Number</span>
                <span className="text-sm font-semibold text-primary">{job.jobNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Service</span>
                <span className="text-sm font-medium text-gray-900">{job.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Completed</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(job.completedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Amount</span>
                <span className="text-sm font-bold text-green-600">
                  ${job.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Technician</span>
                <span className="text-sm font-medium text-gray-900">{job.technician}</span>
              </div>
            </div>
          </div>

          {/* Submission Info */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-700">Feedback Submitted</h3>
            </div>
            <p className="text-sm text-gray-600">
              Submitted on{" "}
              <span className="font-semibold">
                {new Date(feedback.submittedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Right Column - Goals & Finish Line */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Goal */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-4 border-b border-pink-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">1. Personal Goal</h3>
                  <p className="text-xs text-gray-600">Personal development & life balance</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Goal</p>
                <p className="text-sm text-gray-900">{feedback.personalGoal.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-pink-600 mb-1">Deadline</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-pink-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(feedback.personalGoal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="bg-pink-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-pink-600 mb-1">Action Plan</p>
                  <p className="text-sm text-gray-700">{feedback.personalGoal.actionPlan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Goal */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 border-b border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">2. Professional Goal</h3>
                  <p className="text-xs text-gray-600">Career & business growth</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Goal</p>
                <p className="text-sm text-gray-900">{feedback.professionalGoal.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-600 mb-1">Deadline</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(feedback.professionalGoal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-600 mb-1">Action Plan</p>
                  <p className="text-sm text-gray-700">{feedback.professionalGoal.actionPlan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Goal */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 border-b border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">3. Financial Goal</h3>
                  <p className="text-xs text-gray-600">Financial growth & security</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Goal</p>
                <p className="text-sm text-gray-900">{feedback.financialGoal.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-600 mb-1">Deadline</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(feedback.financialGoal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-green-600 mb-1">Action Plan</p>
                  <p className="text-sm text-gray-700">{feedback.financialGoal.actionPlan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Finish Line */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-4 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Flag className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">4. Finish Line</h3>
                  <p className="text-xs text-gray-600">Vision for the future</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm text-gray-800 leading-relaxed italic">
                  "{feedback.finishLine}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}