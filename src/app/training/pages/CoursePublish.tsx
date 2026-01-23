import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { mockCourses, mockQuestionGroups } from '../mockData'

export function CoursePublish() {
  const selectedCourse = mockCourses[0]
  const courseGroups = mockQuestionGroups.filter((g) => g.courseId === selectedCourse.id)
  const [isPublished, setIsPublished] = useState(selectedCourse.status === 'Published')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handlePublishToggle = () => {
    if (!isPublished) {
      setShowConfirmModal(true)
    } else {
      setIsPublished(false)
    }
  }

  const handleConfirmPublish = () => {
    setIsPublished(true)
    setShowConfirmModal(false)
  }

  const totalQuestions = courseGroups.reduce((sum, group) => sum + group.questions.length, 0)
  const totalMarks = courseGroups.reduce(
    (sum, group) => sum + group.questions.reduce((qSum, q) => qSum + q.marks, 0),
    0
  )

  const checklistItems = [
    { label: 'Course title is set', checked: !!selectedCourse.name },
    { label: 'Category and sub-category assigned', checked: true },
    { label: 'Description provided', checked: !!selectedCourse.description },
    { label: 'Question groups created', checked: courseGroups.length > 0 },
    { label: 'Questions added to groups', checked: totalQuestions > 0 },
  ]

  const allChecked = checklistItems.every(item => item.checked)

  return (
    <div className="space-y-6 min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Publish Course</h1>
        <p className="text-gray-600 mt-1 text-sm">Review course details before publishing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Summary</h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">Course Name</p>
                <p className="text-lg font-semibold text-gray-900">{selectedCourse.name}</p>
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedCourse.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Subcategory</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedCourse.subcategory}</p>
                </div>
              </div>

              <div className="pb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Description</p>
                <p className="text-gray-700 line-clamp-3">{selectedCourse.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-blue-600">{totalQuestions}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-700 mb-1">Total Marks</p>
                  <p className="text-2xl font-bold text-green-600">{totalMarks}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Groups</p>
                  <p className="text-2xl font-bold text-purple-600">{courseGroups.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Question Groups Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Question Groups</h3>

            <div className="space-y-3">
              {courseGroups.map((group, idx) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{idx + 1}. {group.name}</h4>
                    {group.description && (
                      <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                    )}
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Questions</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {group.questions.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Marks</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {group.questions.reduce((sum, q) => sum + q.marks, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pre-Publish Checklist</h3>

            <div className="space-y-2">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg">
                  {item.checked ? (
                    <div className="flex items-center justify-center w-5 h-5 bg-primary rounded-full flex-shrink-0">
                      <Check size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full flex-shrink-0">
                      <X size={16} className="text-red-600" />
                    </div>
                  )}
                  <span className={`font-semibold ${item.checked ? 'text-gray-900' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Publish Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Publish Course</h4>

            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900">
                {allChecked ? 'Ready to publish' : 'Complete the checklist'}
              </p>
            </div>

            <button
              onClick={handlePublishToggle}
              disabled={!allChecked && !isPublished}
              className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors mb-3 ${
                isPublished
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : allChecked
                    ? 'bg-primary hover:bg-[#2c621b] text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isPublished ? 'Unpublish' : 'Publish Course'}
            </button>

            {isPublished && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
                  <Check size={16} />
                  Published
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Publish Course?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Once published, your course will be available to users. You can unpublish it later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-[#2c621b] text-white font-semibold rounded-lg transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
