// ViewAssessmentReport.tsx
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Download,
  Printer,
  Trophy,
  TrendingUp,
  Shield,
  Award,
  Sparkles,
  Target,
  HeartHandshake,
  ListChecks,
  CheckCircle,
  Star,
  Calendar,
  User,
  Briefcase
} from "lucide-react"

/* ===================== PIE CHART COMPONENT ===================== */

interface PieChartProps {
  score: number
  size?: number
  strokeWidth?: number
}

const PieChart = ({ score, size = 200, strokeWidth = 20 }: PieChartProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#22c55e', bg: '#dcfce7', text: 'text-green-600' }
    if (score >= 60) return { stroke: '#3b82f6', bg: '#dbeafe', text: 'text-blue-600' }
    if (score >= 40) return { stroke: '#eab308', bg: '#fef9c3', text: 'text-yellow-600' }
    return { stroke: '#ef4444', bg: '#fee2e2', text: 'text-red-600' }
  }

  const colors = getScoreColor(score)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colors.text}`}>{score}%</span>
        <span className="text-sm text-gray-500 font-medium">Overall Score</span>
      </div>
    </div>
  )
}

/* ===================== MOCK ASSESSMENT DATA ===================== */

const assessmentData = {
  jobId: "480",
  jobNumber: "480",
  clientName: "Robin Stevens",
  technician: "Mike Johnson",
  completedDate: "2024-01-15",
  assessmentDate: "2024-01-16",
  assessedBy: "Admin",
  overallScore: 85,
  rating: "excellent" as const,
  answers: [
    {
      questionId: 1,
      category: "Wins",
      question: "What did you do well this month?",
      answer: "Successfully completed 5 major flooring installations ahead of schedule. Received positive feedback from 3 clients specifically mentioning attention to detail. Trained 2 new team members on tile installation techniques. Reduced material waste by 15% through better planning.",
      icon: Trophy,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      score: 90
    },
    {
      questionId: 2,
      category: "Opportunities for Growth",
      question: "Where do you see the biggest opportunities for growth?",
      answer: "Need to improve communication with clients about timeline changes. Missed one callback deadline this month. Could be more proactive in identifying potential issues before they become problems. Documentation could be more thorough.",
      icon: TrendingUp,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      score: 75
    },
    {
      questionId: 3,
      category: "Ownership",
      question: "Did you fully own your role this month?",
      answer: "Yes, I took full ownership of my projects and didn't wait to be told what to do. When I noticed a potential issue with materials, I proactively contacted the supplier. However, there was one instance where I should have escalated a customer concern faster instead of trying to handle it alone.",
      icon: Shield,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      score: 85
    },
    {
      questionId: 4,
      category: "Standards",
      question: "Did your work reflect the standard of this company?",
      answer: "I believe my work consistently met company standards. Every installation was completed with attention to detail and quality. I followed all safety protocols and ensured clean job sites. One area of improvement would be more consistent photo documentation.",
      icon: Award,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      score: 88
    },
    {
      questionId: 5,
      category: "Growth",
      question: "What did you improve this month?",
      answer: "Improved my time management significantly - now completing estimates 30% faster. Got better at using the new project management software. Developed a personal checklist for quality control that has reduced callbacks. Also improved my communication with the office team.",
      icon: Sparkles,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
      score: 92
    },
    {
      questionId: 6,
      category: "Mission, Vision & Values",
      question: "How well did you represent the company's values?",
      answer: "I would rate myself an 8/10. I consistently represented professionalism and quality in all interactions. I could improve in being more patient with difficult customers and better embodying the 'customer first' value in stressful situations.",
      icon: Target,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      score: 80,
      rating: 8
    },
    {
      questionId: 7,
      category: "Support Needed",
      question: "What support do you need from leadership?",
      answer: "Would benefit from advanced training on new flooring materials (especially luxury vinyl). Need clearer guidelines on handling warranty claims. Would appreciate more regular feedback on performance. Better tools for managing multiple projects simultaneously.",
      icon: HeartHandshake,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      score: null
    },
    {
      questionId: 8,
      category: "Action Plan",
      question: "Top 3 things you will do better next month?",
      answer: "",
      actionItems: [
        "Implement a daily communication check-in with office team by 9 AM each morning",
        "Complete photo documentation for every job before leaving the site",
        "Respond to all customer inquiries within 2 hours during business hours"
      ],
      icon: ListChecks,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
      score: null
    }
  ]
}

/* ===================== HELPER FUNCTIONS ===================== */

const getScoreLabel = (score: number) => {
  if (score >= 90) return { label: "Excellent", color: "bg-green-100 text-green-700 border-green-200" }
  if (score >= 75) return { label: "Good", color: "bg-blue-100 text-blue-700 border-blue-200" }
  if (score >= 60) return { label: "Average", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
  return { label: "Needs Improvement", color: "bg-red-100 text-red-700 border-red-200" }
}

const getOverallRatingConfig = (rating: string) => {
  switch (rating) {
    case 'excellent':
      return {
        label: 'Excellent Performance',
        bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
        icon: Star,
        description: 'Outstanding work! Keep up the great performance.'
      }
    case 'good':
      return {
        label: 'Good Performance',
        bg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        icon: TrendingUp,
        description: 'Solid performance with room for growth.'
      }
    case 'needs_improvement':
      return {
        label: 'Needs Improvement',
        bg: 'bg-gradient-to-br from-orange-500 to-red-600',
        icon: Target,
        description: 'Areas identified for improvement. Action plan required.'
      }
    default:
      return {
        label: 'Pending Review',
        bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
        icon: CheckCircle,
        description: 'Assessment under review.'
      }
  }
}

/* ===================== COMPONENT ===================== */

export default function ViewAssessmentReport() {
  const navigate = useNavigate()
  const { jobId } = useParams()

  const ratingConfig = getOverallRatingConfig(assessmentData.rating)

  // Calculate category scores
  const categoryScores = assessmentData.answers
    .filter(a => a.score !== null)
    .map(a => ({ category: a.category, score: a.score as number }))

  return (
    <div className="min-h-screen  p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Assessments</span>
        </button>

        <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Assessment Report
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Job #{assessmentData.jobNumber} • {assessmentData.clientName}
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Score & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overall Score Card */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className={`${ratingConfig.bg} p-4 text-white`}>
              <div className="flex items-center gap-2">
                <ratingConfig.icon size={20} />
                <span className="font-semibold">{ratingConfig.label}</span>
              </div>
              <p className="text-sm text-white/80 mt-1">{ratingConfig.description}</p>
            </div>

            <div className="p-6 flex flex-col items-center">
              <PieChart score={assessmentData.overallScore} />

              <div className="w-full mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Category Breakdown</h3>
                <div className="space-y-2">
                  {categoryScores.map((cat, index) => {
                    const scoreLabel = getScoreLabel(cat.score)
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 truncate flex-1">{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cat.score >= 80 ? 'bg-green-500' :
                                cat.score >= 60 ? 'bg-blue-500' :
                                cat.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${cat.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                            {cat.score}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Info */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Assessment Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Technician</p>
                  <p className="text-sm font-medium text-gray-900">{assessmentData.technician}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Briefcase size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Job Completed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(assessmentData.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assessment Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(assessmentData.assessmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle size={14} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assessed By</p>
                  <p className="text-sm font-medium text-gray-900">{assessmentData.assessedBy}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Legend */}
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Rating Scale</h3>
            <div className="space-y-2">
              {[
                { range: "90-100%", label: "Excellent", color: "bg-green-500" },
                { range: "75-89%", label: "Good", color: "bg-blue-500" },
                { range: "60-74%", label: "Average", color: "bg-yellow-500" },
                { range: "0-59%", label: "Needs Improvement", color: "bg-red-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-xs text-gray-600">{item.range}</span>
                  <span className="text-xs font-medium text-gray-700">- {item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Questions & Answers */}
        <div className="lg:col-span-2 space-y-4">
          {assessmentData.answers.map((answer, index) => {
            const scoreLabel = answer.score ? getScoreLabel(answer.score) : null

            return (
              <div key={index} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                {/* Question Header */}
                <div className={`p-4 ${answer.iconBg} border-b`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <answer.icon className={`w-5 h-5 ${answer.iconColor}`} />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${answer.iconColor}`}>
                          {answer.category}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 mt-0.5">
                          {answer.question}
                        </h3>
                      </div>
                    </div>

                    {scoreLabel && (
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${scoreLabel.color}`}>
                        {answer.score}% - {scoreLabel.label}
                      </span>
                    )}

                    {answer.rating && (
                      <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-sm">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < answer.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-xs font-bold text-gray-700 ml-1">{answer.rating}/10</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer Content */}
                <div className="p-4">
                  {answer.actionItems ? (
                    <div className="space-y-3">
                      {answer.actionItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold">{itemIndex + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {answer.answer}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}