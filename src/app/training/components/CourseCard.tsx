import { Edit2, Eye, Upload, Trash2 } from 'lucide-react'
import type { Course } from '../mockData'
import { StatusBadge } from './StatusBadge'
import { RatingStars } from './RatingStars'

interface CourseCardProps {
  course: Course
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onPublish?: (id: string) => void
  onDelete?: (id: string) => void
}

export function CourseCard({
  course,
  onView,
  onEdit,
  onPublish,
  onDelete,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {course.subcategory}
            </span>
          </div>
        </div>
        <StatusBadge status={course.status} />
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-t border-b border-gray-200">
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1">Questions</p>
          <p className="text-lg font-bold text-gray-900">{course.totalQuestions}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1">Total Marks</p>
          <p className="text-lg font-bold text-gray-900">{course.totalMarks}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-1">Rating</p>
          {course.rating > 0 ? (
            <RatingStars rating={Math.round(course.rating)} readOnly />
          ) : (
            <p className="text-sm text-gray-500 font-medium">No rating</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={() => onView(course.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary hover:bg-[#2c621b] text-white font-semibold text-sm rounded-lg transition-colors"
          >
            <Eye size={16} />
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(course.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold text-sm rounded-lg transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
        {onPublish && course.status === 'Draft' && (
          <button
            onClick={() => onPublish(course.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary hover:bg-[#2c621b] text-white font-semibold text-sm rounded-lg transition-colors"
          >
            <Upload size={16} />
            Publish
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(course.id)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-100 text-red-600 hover:bg-red-200 font-semibold text-sm rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
