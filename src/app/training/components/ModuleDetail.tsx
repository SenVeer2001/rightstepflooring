import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { mockModules, mockMediaItems } from '../mockData'
import { ModuleManagement } from './ModuleManagement'
import { MediaUpload } from './MediaUpload'
import { QuizBuilder } from './QuizBuilder'
import { QuizForm } from './QuizForm'
import { QuestionFormModal } from './QuestionFormModal'
import type { MediaItem, ModuleQuiz, QuizQuestion, CourseModule } from '../mockData'

export const ModuleDetail: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'quizzes'>('overview')
  const [quizFormOpen, setQuizFormOpen] = useState(false)
  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>(undefined)
  const [selectedQuiz, setSelectedQuiz] = useState<ModuleQuiz | undefined>(undefined)

  // Find the module
  const module = mockModules.find((m) => m.id === moduleId)

  // Get module's media items
  const moduleMedia = mockMediaItems.filter((m) => m.moduleId === moduleId)

  if (!module) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Module Not Found</h2>
          <p className="text-gray-600 mb-4">The module you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
              {module.description && (
                <p className="text-gray-600 mt-2">{module.description}</p>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Module Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase">Duration</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{module.duration} min</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-purple-600 uppercase">Media Items</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{moduleMedia.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-yellow-600 uppercase">Quizzes</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">{module.quizzes.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-green-600 uppercase">Questions</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {module.quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            {(['overview', 'media', 'quizzes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-purple-600 border-purple-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'media' && 'Media Files'}
                {tab === 'quizzes' && 'Quizzes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Module Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <p className="text-gray-900">{module.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                  <p className="text-gray-900">{module.duration} minutes</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                  <p className="text-gray-900">Module {module.order}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID</label>
                  <p className="text-gray-900 font-mono text-sm">{module.id}</p>
                </div>
              </div>
            </div>

            {module.description && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <p className="text-gray-700 whitespace-pre-wrap">{module.description}</p>
              </div>
            )}

            {/* Content Summary */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Content Summary</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Media Items: {moduleMedia.length}</h4>
                  <ul className="space-y-1 text-sm text-purple-700">
                    {moduleMedia.map((media) => (
                      <li key={media.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                        {media.type.charAt(0).toUpperCase() + media.type.slice(1)}: {media.title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Quizzes: {module.quizzes.length}</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    {module.quizzes.map((quiz) => (
                      <li key={quiz.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-700"></span>
                        {quiz.title} ({quiz.questions.length} Q)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-lg shadow p-6">
            <MediaUpload
              moduleId={moduleId!}
              mediaItems={moduleMedia}
              onAddMedia={() => console.log('Add media')}
              onDeleteMedia={(mediaId) => console.log('Delete media:', mediaId)}
            />
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-lg shadow p-6">
            <QuizBuilder
              moduleId={moduleId!}
              quizzes={module.quizzes}
              onAddQuiz={() => {
                setSelectedQuiz(undefined)
                setQuizFormOpen(true)
              }}
              onEditQuiz={(quiz) => {
                setSelectedQuiz(quiz)
                setQuizFormOpen(true)
              }}
              onDeleteQuiz={(quizId) => console.log('Delete quiz:', quizId)}
              onAddQuestion={(quizId) => {
                setSelectedQuizId(quizId)
                setQuestionFormOpen(true)
              }}
              onEditQuestion={(question) => console.log('Edit question:', question)}
              onDeleteQuestion={(quizId, questionId) =>
                console.log('Delete question:', { quizId, questionId })
              }
            />
          </div>
        )}
      </div>

      {/* Quiz Form Modal */}
      <QuizForm
        isOpen={quizFormOpen}
        onClose={() => {
          setQuizFormOpen(false)
          setSelectedQuiz(undefined)
        }}
        onSubmit={(quizData) => {
          if (selectedQuiz) {
            console.log('✏️ Quiz Updated:', quizData)
          } else {
            console.log('✅ New Quiz Created:', {
              moduleId,
              ...quizData,
              id: `quiz-${Date.now()}`,
              questions: [],
            })
          }
        }}
        initialData={selectedQuiz}
        title={selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
      />

      {/* Question Form Modal */}
      <QuestionFormModal
        isOpen={questionFormOpen}
        onClose={() => {
          setQuestionFormOpen(false)
          setSelectedQuizId(undefined)
        }}
        onSubmit={(questionData) => {
          console.log('✅ Question Added to Quiz:', selectedQuizId, {
            ...questionData,
            id: `q-${Date.now()}`,
            quizId: selectedQuizId,
            order: 1,
          })
        }}
        title={`Add Question to Quiz`}
      />

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => console.log('Save module')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
