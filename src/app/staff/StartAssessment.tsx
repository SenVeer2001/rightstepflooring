// StartAssessment.tsx
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Save,
  Send,
  X
} from "lucide-react"

/* ===================== TYPES ===================== */

interface Question {
  id: number
  category: string
  title: string
  description: string
  type?: 'textarea' | 'rating_with_text' | 'action_plan'
}

interface Answer {
  questionId: number
  text: string
  rating?: number
  actionItems?: string[]
}

/* ===================== QUESTIONS DATA ===================== */

const questions: Question[] = [
  {
    id: 1,
    category: "Wins",
    title: "What did you do well this month?",
    description: "Where did you create real value? Highlight your achievements and contributions."
  },
  {
    id: 2,
    category: "Opportunities for Growth",
    title: "Where do you see the biggest opportunities for growth?",
    description: "What did you miss, delay, or not execute at the level expected?"
  },
  {
    id: 3,
    category: "Ownership",
    title: "Did you fully own your role this month?",
    description: "Or did you wait to be led? Explain your level of initiative and accountability."
  },
  {
    id: 4,
    category: "Standards",
    title: "Did your work reflect the standard of this company?",
    description: "Why or why not? Be honest about the quality of your work."
  },
  {
    id: 5,
    category: "Growth",
    title: "What did you improve this month?",
    description: "What skill, habit, or behavior got stronger?"
  },
  {
    id: 6,
    category: "Mission, Vision & Values",
    title: "How well did you represent the company's mission, vision, and values?",
    description: "In your attitude, decisions, communication, and execution. Give yourself a rating from 1–10 and explain why.",
    type: "rating_with_text"
  },
  {
    id: 7,
    category: "Support Needed",
    title: "What support do you need from leadership?",
    description: "What tools, training, or clarity do you need to perform at a higher level?"
  },
  {
    id: 8,
    category: "Action Plan",
    title: "What are the top 3 things you will do better next month?",
    description: "And how will you make sure they get done?",
    type: "action_plan"
  }
]

/* ===================== COMPONENT ===================== */

export default function StartAssessment() {
  const navigate = useNavigate()
  const { staffId } = useParams()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map(q => ({
      questionId: q.id,
      text: "",
      rating: q.type === "rating_with_text" ? 5 : undefined,
      actionItems: q.type === "action_plan" ? ["", "", ""] : undefined
    }))
  )
  const [isSaving, setIsSaving] = useState(false)

  const question = questions[currentQuestion]
  const currentAnswer = answers[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  /* ===================== HANDLERS ===================== */

  const handleTextChange = (text: string) => {
    setAnswers(prev => prev.map((a, i) =>
      i === currentQuestion ? { ...a, text } : a
    ))
  }

  const handleRatingChange = (rating: number) => {
    setAnswers(prev => prev.map((a, i) =>
      i === currentQuestion ? { ...a, rating } : a
    ))
  }

  const handleActionItemChange = (index: number, value: string) => {
    setAnswers(prev => prev.map((a, i) => {
      if (i === currentQuestion && a.actionItems) {
        const newItems = [...a.actionItems]
        newItems[index] = value
        return { ...a, actionItems: newItems }
      }
      return a
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSaveDraft = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Draft saved successfully!")
    }, 1000)
  }

  const handleSubmit = () => {
    const isComplete = answers.every(a => {
      if (a.actionItems) {
        return a.actionItems.every(item => item.trim() !== "")
      }
      return a.text.trim() !== ""
    })

    if (!isComplete) {
      alert("Please complete all questions before submitting.")
      return
    }

    navigate(`/staff-assessment/view/${staffId}`)
  }

  const isCurrentAnswerValid = () => {
    if (currentAnswer.actionItems) {
      return currentAnswer.actionItems.every(item => item.trim() !== "")
    }
    return currentAnswer.text.trim() !== ""
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Assessments</span>
        </button>

        <div className="bg-white rounded-xl border shadow-sm p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Team Monthly Self-Assessment
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Staff ID: {staffId} • Complete all 8 questions
              </p>
            </div>

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-primary">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex items-center justify-center gap-2">
            {questions.map((q, index) => {
              const isCompleted = answers[index].text.trim() !== "" ||
                (answers[index].actionItems?.every(item => item.trim() !== ""))
              const isCurrent = index === currentQuestion

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                    ${isCurrent
                      ? 'bg-primary text-white scale-110'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                  {isCompleted && !isCurrent ? <CheckCircle size={12} /> : index + 1}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="p-5 border-b bg-gray-50">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                {question.id}
              </span>
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {question.category}
                </span>
                <h2 className="text-base md:text-lg font-bold text-gray-900 mt-1">
                  {question.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {question.description}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Section */}
          <div className="p-5">
            {/* Rating Input (for question 6) */}
            {question.type === "rating_with_text" && (
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Your Rating (1-10)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleRatingChange(num)}
                      className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all border
                        ${currentAnswer.rating === num
                          ? 'bg-primary text-white border-primary scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            )}

            {/* Action Plan Input (for question 8) */}
            {question.type === "action_plan" ? (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 block">
                  Your Top 3 Action Items
                </label>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-2">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={currentAnswer.actionItems?.[index] || ""}
                        onChange={(e) => handleActionItemChange(index, e.target.value)}
                        placeholder={`Action item ${index + 1}...`}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Text Area Input */
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Response
                </label>
                <textarea
                  value={currentAnswer.text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none"
                />
                <div className="flex justify-end mt-2">
                  <span className={`text-xs ${currentAnswer.text.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {currentAnswer.text.length} characters
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  <Send size={16} />
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isCurrentAnswerValid()}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}