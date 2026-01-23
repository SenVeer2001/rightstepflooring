import React, { useState } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { ModuleQuiz, QuizQuestion } from '../mockData'

interface QuizBuilderProps {
  moduleId: string
  quizzes: ModuleQuiz[]
  onAddQuiz?: () => void
  onEditQuiz?: (quiz: ModuleQuiz) => void
  onDeleteQuiz?: (quizId: string) => void
  onAddQuestion?: (quizId: string) => void
  onEditQuestion?: (question: QuizQuestion) => void
  onDeleteQuestion?: (quizId: string, questionId: string) => void
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  moduleId,
  quizzes,
  onAddQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null)

  const handleToggleExpand = (quizId: string) => {
    setExpandedQuizId(expandedQuizId === quizId ? null : quizId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">Quizzes</h4>
          <p className="text-sm text-gray-500">Create and manage quizzes for this module</p>
        </div>
        <button
          onClick={onAddQuiz}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500 text-sm mb-3">No quizzes yet. Create a quiz to assess student knowledge.</p>
          <button
            onClick={onAddQuiz}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Create First Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Quiz Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handleToggleExpand(quiz.id)}
              >
                <button
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleExpand(quiz.id)
                  }}
                >
                  {expandedQuizId === quiz.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{quiz.title}</h5>
                  {quiz.description && (
                    <p className="text-sm text-gray-500">{quiz.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                    {quiz.questions.length} Q
                  </span>
                  <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">
                    Pass: {quiz.passingScore}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditQuiz?.(quiz)
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Edit quiz"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteQuiz?.(quiz.id)
                    }}
                    className="p-2 hover:bg-red-100 rounded transition-colors"
                    title="Delete quiz"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Quiz Details - Expanded */}
              {expandedQuizId === quiz.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                  {/* Quiz Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Passing Score</label>
                      <p className="text-sm text-gray-900 mt-1">{quiz.passingScore}%</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Time Limit</label>
                      <p className="text-sm text-gray-900 mt-1">{quiz.timeLimit ? `${quiz.timeLimit} min` : 'Unlimited'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Total Questions</label>
                      <p className="text-sm text-gray-900 mt-1">{quiz.questions.length}</p>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-semibold text-gray-900">Questions</h6>
                      <button
                        onClick={() => onAddQuestion?.(quiz.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded hover:bg-purple-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Question
                      </button>
                    </div>

                    {quiz.questions.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No questions yet</p>
                    ) : (
                      <div className="space-y-2">
                        {quiz.questions.map((question) => (
                          <div
                            key={question.id}
                            className="bg-white rounded p-3 border border-gray-200 flex items-start gap-3"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{question.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                                  {question.answerType}
                                </span>
                                <span className="text-xs text-gray-500">{question.marks} marks</span>
                                {question.options && (
                                  <span className="text-xs text-gray-500">
                                    • {question.options.length} options
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <button
                                onClick={() => onEditQuestion?.(question)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                              >
                                <Edit2 className="w-3 h-3 text-gray-600" />
                              </button>
                              <button
                                onClick={() => onDeleteQuestion?.(quiz.id, question.id)}
                                className="p-1 hover:bg-red-100 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
