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
  User,
  X,
  FileText,
  Star,
  MessageSquare,
  ThumbsUp,
  AlertCircle
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

interface FeedbackFormData {
  q1_communicationRating: number
  q2_informedConfident: string
  q2_stageNeedsImprovement?: string
  q3_timeframeCompleted: string
  q3_shortfallReason?: string
  q4_professionalismRating: number
  q5_happyWithFloors: string
  q5_expectationDifference?: string
  q6_praise: string
  q6_improvement: string
}

interface FeedbackRecord {
  id: string
  jobId: string
  requestedDate?: string
  submittedDate?: string
  status: 'not_requested' | 'requested' | 'submitted' | 'viewed'
  feedback?: FeedbackFormData
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
    feedback: {
      q1_communicationRating: 5,
      q2_informedConfident: "fully",
      q3_timeframeCompleted: "mostly",
      q3_shortfallReason: "Installation took 1 extra day due to unexpected subfloor repairs",
      q4_professionalismRating: 5,
      q5_happyWithFloors: "completely",
      q6_praise: "Mike Johnson was exceptional - very professional, clean, and explained everything clearly. The final walkthrough was thorough.",
      q6_improvement: "Would be great to get a reminder call the day before installation starts."
    }
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
    feedback: {
      q1_communicationRating: 4,
      q2_informedConfident: "mostly",
      q2_stageNeedsImprovement: "Scheduling could have been clearer - we weren't sure of the exact start time",
      q3_timeframeCompleted: "fully",
      q4_professionalismRating: 5,
      q5_happyWithFloors: "completely",
      q6_praise: "The installation crew was amazing - super clean, respectful, and the floors look perfect!",
      q6_improvement: "More specific timing for installation start would be helpful"
    }
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

/* ===================== STAR RATING COMPONENT ===================== */

const StarRating = ({ 
  value, 
  onChange, 
  readonly = false 
}: { 
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`transition ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={24}
            className={`${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">
        {value > 0 ? `${value}/5` : 'Not rated'}
      </span>
    </div>
  )
}

/* ===================== REQUEST FEEDBACK MODAL ===================== */

interface RequestFeedbackModalProps {
  showRequestModal: boolean
  selectedJob: CompletedJob | null
  formData: FeedbackFormData
  setFormData: React.Dispatch<React.SetStateAction<FeedbackFormData>>
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
        className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-5 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Customer Experience Survey</h2>
              <p className="text-sm text-white/80">Right Step Flooring</p>
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
                {selectedJob.jobNumber} • {selectedJob.service}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Question 1 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  How would you rate the speed and consistency of communication from our team throughout your project?
                </h3>
                <StarRating
                  value={formData.q1_communicationRating}
                  onChange={(rating) => setFormData(prev => ({ ...prev, q1_communicationRating: rating }))}
                />
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Did you feel informed and confident at each stage of the process — sales, scheduling, installation, and final walkthrough?
                </h3>
                <div className="space-y-2 mb-3">
                  {[
                    { value: 'fully', label: 'Yes, fully' },
                    { value: 'mostly', label: 'Mostly' },
                    { value: 'no', label: 'No' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="q2"
                        value={option.value}
                        checked={formData.q2_informedConfident === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, q2_informedConfident: e.target.value }))}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {(formData.q2_informedConfident === 'mostly' || formData.q2_informedConfident === 'no') && (
                  <div className="mt-3">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      If not, which stage needs improvement?
                    </label>
                    <textarea
                      value={formData.q2_stageNeedsImprovement || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, q2_stageNeedsImprovement: e.target.value }))}
                      placeholder="Please specify..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question 3 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Was your project started and completed within the timeframe you were given?
                </h3>
                <div className="space-y-2 mb-3">
                  {[
                    { value: 'fully', label: 'Yes, fully' },
                    { value: 'mostly', label: 'Mostly' },
                    { value: 'no', label: 'No' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="q3"
                        value={option.value}
                        checked={formData.q3_timeframeCompleted === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, q3_timeframeCompleted: e.target.value }))}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {(formData.q3_timeframeCompleted === 'mostly' || formData.q3_timeframeCompleted === 'no') && (
                  <div className="mt-3">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      If no, where did we fall short?
                    </label>
                    <textarea
                      value={formData.q3_shortfallReason || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, q3_shortfallReason: e.target.value }))}
                      placeholder="Please explain..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question 4 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  How would you rate the professionalism, preparedness, and cleanliness of the crew in your home?
                </h3>
                <StarRating
                  value={formData.q4_professionalismRating}
                  onChange={(rating) => setFormData(prev => ({ ...prev, q4_professionalismRating: rating }))}
                />
              </div>
            </div>
          </div>

          {/* Question 5 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Are you happy with your new floors, and did the final result match what you hoped for?
                </h3>
                <div className="space-y-2 mb-3">
                  {[
                    { value: 'completely', label: 'Yes, completely' },
                    { value: 'mostly', label: 'Mostly' },
                    { value: 'not_fully', label: 'Not fully' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="q5"
                        value={option.value}
                        checked={formData.q5_happyWithFloors === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, q5_happyWithFloors: e.target.value }))}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {(formData.q5_happyWithFloors === 'mostly' || formData.q5_happyWithFloors === 'not_fully') && (
                  <div className="mt-3">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      If not, what felt different from your expectations?
                    </label>
                    <textarea
                      value={formData.q5_expectationDifference || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, q5_expectationDifference: e.target.value }))}
                      placeholder="Please describe..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question 6 */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">6</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  What is one team member, moment, or part of the process you would praise, and what is one thing we should improve for the next customer?
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block flex items-center gap-1">
                      <ThumbsUp size={12} className="text-green-600" />
                      What would you praise?
                    </label>
                    <textarea
                      value={formData.q6_praise}
                      onChange={(e) => setFormData(prev => ({ ...prev, q6_praise: e.target.value }))}
                      placeholder="Tell us what we did well..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block flex items-center gap-1">
                      <AlertCircle size={12} className="text-orange-600" />
                      What should we improve?
                    </label>
                    <textarea
                      value={formData.q6_improvement}
                      onChange={(e) => setFormData(prev => ({ ...prev, q6_improvement: e.target.value }))}
                      placeholder="How can we do better?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
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
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================== VIEW FEEDBACK MODAL ===================== */

interface ViewFeedbackModalProps {
  showViewModal: boolean
  selectedJob: CompletedJob | null
  feedback: FeedbackFormData | null
  setShowViewModal: (show: boolean) => void
}

const ViewFeedbackModal = ({
  showViewModal,
  selectedJob,
  feedback,
  setShowViewModal
}: ViewFeedbackModalProps) => {
  if (!showViewModal || !selectedJob || !feedback) return null

  const getResponseLabel = (questionKey: string, value: string) => {
    const labels: Record<string, Record<string, string>> = {
      q2_informedConfident: {
        'fully': 'Yes, fully',
        'mostly': 'Mostly',
        'no': 'No'
      },
      q3_timeframeCompleted: {
        'fully': 'Yes, fully',
        'mostly': 'Mostly',
        'no': 'No'
      },
      q5_happyWithFloors: {
        'completely': 'Yes, completely',
        'mostly': 'Mostly',
        'not_fully': 'Not fully'
      }
    }
    return labels[questionKey]?.[value] || value
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowViewModal(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-5 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Customer Feedback Report</h2>
              <p className="text-sm text-white/80">Right Step Flooring</p>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
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
                {selectedJob.jobNumber} • {selectedJob.service}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Completed</p>
            <p className="text-xs font-medium text-gray-700">
              {new Date(selectedJob.completedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Feedback Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Question 1 - Communication Rating */}
          <div className="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Question 1</h3>
            <p className="text-sm font-medium text-gray-900 mb-3">
              How would you rate the speed and consistency of communication from our team throughout your project?
            </p>
            <StarRating value={feedback.q1_communicationRating} readonly />
          </div>

          {/* Question 2 - Informed & Confident */}
          <div className="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Question 2</h3>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Did you feel informed and confident at each stage of the process?
            </p>
            <div className="bg-white rounded-lg p-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {getResponseLabel('q2_informedConfident', feedback.q2_informedConfident)}
              </span>
            </div>
            {feedback.q2_stageNeedsImprovement && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-medium text-orange-900 mb-1">Stage needs improvement:</p>
                <p className="text-sm text-orange-800">{feedback.q2_stageNeedsImprovement}</p>
              </div>
            )}
          </div>

          {/* Question 3 - Timeframe */}
          <div className="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Question 3</h3>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Was your project started and completed within the timeframe you were given?
            </p>
            <div className="bg-white rounded-lg p-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {getResponseLabel('q3_timeframeCompleted', feedback.q3_timeframeCompleted)}
              </span>
            </div>
            {feedback.q3_shortfallReason && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-medium text-orange-900 mb-1">Reason for delay:</p>
                <p className="text-sm text-orange-800">{feedback.q3_shortfallReason}</p>
              </div>
            )}
          </div>

          {/* Question 4 - Professionalism Rating */}
          <div className="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Question 4</h3>
            <p className="text-sm font-medium text-gray-900 mb-3">
              How would you rate the professionalism, preparedness, and cleanliness of the crew?
            </p>
            <StarRating value={feedback.q4_professionalismRating} readonly />
          </div>

          {/* Question 5 - Happy with Floors */}
          <div className="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Question 5</h3>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Are you happy with your new floors, and did the final result match what you hoped for?
            </p>
            <div className="bg-white rounded-lg p-3 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {getResponseLabel('q5_happyWithFloors', feedback.q5_happyWithFloors)}
              </span>
            </div>
            {feedback.q5_expectationDifference && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-medium text-orange-900 mb-1">Expectation difference:</p>
                <p className="text-sm text-orange-800">{feedback.q5_expectationDifference}</p>
              </div>
            )}
          </div>

          {/* Question 6 - Praise & Improvement */}
          <div className="border-l-4 border-primary bg-gray-50 rounded-r-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Question 6</h3>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Praise and suggestions for improvement
            </p>
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp size={14} className="text-green-600" />
                  <p className="text-xs font-medium text-green-900">What they praised:</p>
                </div>
                <p className="text-sm text-green-800">{feedback.q6_praise}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={14} className="text-blue-600" />
                  <p className="text-xs font-medium text-blue-900">Suggested improvement:</p>
                </div>
                <p className="text-sm text-blue-800">{feedback.q6_improvement}</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
              <p className="text-xs text-yellow-700 font-medium mb-1">Communication Score</p>
              <div className="flex items-center gap-2">
                <Star size={20} className="fill-yellow-400 text-yellow-400" />
                <p className="text-2xl font-bold text-yellow-900">
                  {feedback.q1_communicationRating}/5
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-xs text-purple-700 font-medium mb-1">Professionalism Score</p>
              <div className="flex items-center gap-2">
                <Star size={20} className="fill-purple-400 text-purple-400" />
                <p className="text-2xl font-bold text-purple-900">
                  {feedback.q4_professionalismRating}/5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t flex justify-end flex-shrink-0">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            Close
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
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null)
  const [feedbackData, setFeedbackData] = useState(feedbackRecords)
  const rowsPerPage = 10

  // Form states
  const [formData, setFormData] = useState<FeedbackFormData>({
    q1_communicationRating: 0,
    q2_informedConfident: '',
    q2_stageNeedsImprovement: '',
    q3_timeframeCompleted: '',
    q3_shortfallReason: '',
    q4_professionalismRating: 0,
    q5_happyWithFloors: '',
    q5_expectationDifference: '',
    q6_praise: '',
    q6_improvement: ''
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
      q1_communicationRating: 0,
      q2_informedConfident: '',
      q2_stageNeedsImprovement: '',
      q3_timeframeCompleted: '',
      q3_shortfallReason: '',
      q4_professionalismRating: 0,
      q5_happyWithFloors: '',
      q5_expectationDifference: '',
      q6_praise: '',
      q6_improvement: ''
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
      feedback: formData
    }

    setFeedbackData(prev => ({
      ...prev,
      [selectedJob.id]: newFeedback
    }))

    setShowRequestModal(false)
    setSelectedJob(null)
  }

  const handleViewFeedback = (job: CompletedJob) => {
    setSelectedJob(job)
    setShowViewModal(true)
  }

  const isFormValid = () => {
    return (
      formData.q1_communicationRating > 0 &&
      formData.q2_informedConfident !== '' &&
      formData.q3_timeframeCompleted !== '' &&
      formData.q4_professionalismRating > 0 &&
      formData.q5_happyWithFloors !== '' &&
      formData.q6_praise.trim() !== '' &&
      formData.q6_improvement.trim() !== ''
    )
  }

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Client Feedback</h1>
          <p className="text-sm text-gray-600 mt-1">
            Customer Experience Survey - Right Step Flooring
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
                  "View Feedback"
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
                    <tr key={job.id} className="border-t hover:bg-primary/5">
                      {/* Job Number */}
                      <td className="px-4 py-3 font-semibold text-primary">
                        <button
                          onClick={() => navigate(`/client/jobs/1`)}
                          className="underline text-nowrap hover:text-primary/80"
                        >
                          {job.jobNumber}
                        </button>
                      </td>

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

                      {/* Request */}
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

                      {/* View */}
                      <td className="px-4 py-3">
                        {hasSubmitted ? (
                          <button
                            onClick={() => handleViewFeedback(job)}
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

      {/* View Feedback Modal */}
      <ViewFeedbackModal
        showViewModal={showViewModal}
        selectedJob={selectedJob}
        feedback={selectedJob ? feedbackData[selectedJob.id]?.feedback || null : null}
        setShowViewModal={setShowViewModal}
      />
    </div>
  )
}