import { useState } from 'react'
import { ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react'
import type { QuestionGroup } from '../mockData'
import { QuestionCard } from './QuestionCard'

interface QuestionGroupAccordionProps {
  group: QuestionGroup
  onAddQuestion?: () => void
  onEditQuestion?: (questionId: string) => void
  onDeleteQuestion?: (questionId: string) => void
  onDeleteGroup?: (groupId: string) => void
  isDragging?: boolean
}

export function QuestionGroupAccordion({
  group,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onDeleteGroup,
  isDragging,
}: QuestionGroupAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all ${
      isDragging ? 'opacity-50 bg-gray-50' : ''
    }`}>
      {/* Header */}
      <div
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={() => console.log('Dragging group:', group.id)}
        onDragEnd={() => console.log('Dropped group:', group.id)}
      >
        <div className="flex items-center gap-3 flex-1">
          <GripVertical size={18} className="text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 flex-1"
          >
            <ChevronDown
              size={20}
              className={`text-gray-600 flex-shrink-0 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-gray-600">{group.description}</p>
              )}
            </div>
          </button>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full flex-shrink-0">
            {group.questions.length} Q
          </span>
        </div>

        <div className="flex gap-2 ml-4">
          {onDeleteGroup && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteGroup(group.id)
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-white space-y-4">
          {group.questions.length > 0 ? (
            <div className="space-y-3">
              {group.questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onEdit={onEditQuestion}
                  onDelete={onDeleteQuestion}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No questions added yet</p>
          )}

          {/* Add Question Button */}
          {onAddQuestion && (
            <button
              onClick={onAddQuestion}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Add Question
            </button>
          )}
        </div>
      )}
    </div>
  )
}
