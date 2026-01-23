import { Edit2, Trash2, GripVertical } from 'lucide-react'
import type { Question } from '../mockData'
import { AnswerTypeBadge } from './AnswerTypeBadge'
import { RatingStars } from './RatingStars'

interface QuestionCardProps {
  question: Question
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  isDragging?: boolean
}

export function QuestionCard({
  question,
  onEdit,
  onDelete,
  isDragging,
}: QuestionCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 bg-gray-50' : ''
      }`}
      draggable
    >
      <div className="flex gap-4">
        {/* Drag Handle */}
        <div className="flex items-start pt-1 text-gray-400">
          <GripVertical size={18} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900 flex-1">{question.title}</h4>
            <AnswerTypeBadge type={question.answerType} />
          </div>

          {question.description && (
            <p className="text-sm text-gray-600 mb-3">{question.description}</p>
          )}

          {question.answerType === 'multipleChoice' && question.options && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Options:</p>
              <ul className="space-y-1">
                {question.options.map((option, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    • {option}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Marks: </span>
                <span className="font-semibold text-gray-900">{question.marks}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Rating: </span>
                <RatingStars rating={question.rating} readOnly size="sm" />
              </div>
            </div>

            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(question.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(question.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
