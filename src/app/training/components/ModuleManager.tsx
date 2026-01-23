import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { mockModules, mockMediaItems } from '../mockData'
import { ModuleForm } from './ModuleForm'
import { QuestionFormModal } from './QuestionFormModal'
import { ModuleManagement } from './ModuleManagement'
import type { CourseModule, QuizQuestion } from '../mockData'

export const ModuleManager: React.FC<{ courseId: string }> = ({ courseId }) => {
  const navigate = useNavigate()
  const [moduleFormOpen, setModuleFormOpen] = useState(false)
  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<CourseModule | undefined>(undefined)
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>(undefined)

  const courseModules = mockModules.filter((m) => m.courseId === courseId)

  const handleAddModule = (moduleData: Partial<CourseModule>) => {
    console.log('✅ New Module Created:', moduleData)
    console.log('→ Next: Add media files and quizzes to this module')
  }

  const handleEditModule = (module: CourseModule) => {
    setSelectedModule(module)
    setModuleFormOpen(true)
  }

  const handleDeleteModule = (moduleId: string) => {
    console.log('❌ Module Deleted:', moduleId)
  }

  const handleViewModule = (module: CourseModule) => {
    console.log('👁️ View Module:', module.id)
    navigate(`/training/builder/module/${module.id}`)
  }

  const handleSaveQuestion = (questionData: Partial<QuizQuestion>) => {
    console.log('✅ Question Added to Quiz:', selectedQuizId, questionData)
    console.log('Question Details:')
    console.log('  - Type:', questionData.answerType)
    console.log('  - Marks:', questionData.marks)
    if (questionData.options) {
      console.log('  - Options:', questionData.options)
    }
    console.log('  - Correct Answer:', questionData.correctAnswer)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Module Manager</h2>
          <p className="text-gray-600 text-sm mt-1">Create and manage course modules with media and quizzes</p>
        </div>
        <button
          onClick={() => {
            setSelectedModule(undefined)
            setModuleFormOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#2c621b] text-white rounded-lg transition-colors font-bold"
        >
          <Plus className="w-5 h-5" />
          Add Module
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">How to use:</span> Add a module, then use the module details to add media and quizzes.
        </p>
      </div>

      {/* Module Management */}
      <div className=" rounded-lg bg-white shadow p-6">
        <ModuleManagement
          courseId={courseId}
          onAddModule={() => {
            setSelectedModule(undefined)
            setModuleFormOpen(true)
          }}
          onEditModule={handleEditModule}
          onDeleteModule={handleDeleteModule}
          onViewModule={handleViewModule}
        />
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Create Module</h3>
          <p className="text-sm text-blue-800">Click "Add Module" to create a new course topic</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Upload Media</h3>
          <p className="text-sm text-green-800">Add images, PDFs, and videos to modules</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Add Quizzes</h3>
          <p className="text-sm text-purple-800">Create quizzes with multiple question types</p>
        </div>
      </div>

      {/* Module Form Modal */}
      <ModuleForm
        isOpen={moduleFormOpen}
        onClose={() => {
          setModuleFormOpen(false)
          setSelectedModule(undefined)
        }}
        onSubmit={(moduleData) => {
          if (selectedModule) {
            console.log('✏️ Module Updated:', moduleData)
          } else {
            handleAddModule(moduleData)
          }
        }}
        initialData={selectedModule}
        title={selectedModule ? 'Edit Module' : 'Create New Module'}
      />

      {/* Question Form Modal */}
      <QuestionFormModal
        isOpen={questionFormOpen}
        onClose={() => {
          setQuestionFormOpen(false)
          setSelectedQuizId(undefined)
        }}
        onSubmit={handleSaveQuestion}
        title="Add Question to Quiz"
      />

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{courseModules.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Modules</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{mockMediaItems.length}</p>
            <p className="text-sm text-gray-600 mt-1">Media Items</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {courseModules.reduce((sum, m) => sum + m.quizzes.length, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Quizzes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {courseModules.reduce((sum, m) => sum + m.quizzes.reduce((qs, q) => qs + q.questions.length, 0), 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Questions</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">How to Use</h3>
        <ol className="space-y-2 text-gray-700">
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">1.</span>
            <span><strong>Create Module:</strong> Click "Add New Module" and fill in title, description, and duration</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">2.</span>
            <span><strong>View Module:</strong> Click "View & Manage Module" to open the full editor</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">3.</span>
            <span><strong>Add Media:</strong> Go to "Media Files" tab and add images, PDFs, or videos</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">4.</span>
            <span><strong>Add Quizzes:</strong> Go to "Quizzes" tab and create quizzes</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">5.</span>
            <span><strong>Add Questions:</strong> Click "Add Question" in quiz accordion to add questions with different types</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
