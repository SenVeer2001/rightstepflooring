import React, { useState } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Upload, FileText, X, Video, File, ImageIcon } from 'lucide-react'
import type { CourseModule } from '../mockData'
import { mockModules } from '../mockData'

interface ModuleManagementProps {
  courseId: string
  onAddModule?: () => void
  onEditModule?: (module: CourseModule) => void
  onDeleteModule?: (moduleId: string) => void
  onViewModule?: (module: CourseModule) => void
}

interface MediaModalState {
  isOpen: boolean
  moduleId: string | null
}

interface QuizModalState {
  isOpen: boolean
  moduleId: string | null
}

interface QuestionModalState {
  isOpen: boolean
  quizId: string | null
}

interface ExpandedQuizState {
  [quizId: string]: boolean
}

export const ModuleManagement: React.FC<ModuleManagementProps> = ({
  courseId,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onViewModule,
}) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)
  const [expandedQuizzes, setExpandedQuizzes] = useState<ExpandedQuizState>({})
  const [mediaModal, setMediaModal] = useState<MediaModalState>({ isOpen: false, moduleId: null })
  const [quizModal, setQuizModal] = useState<QuizModalState>({ isOpen: false, moduleId: null })
  const [questionModal, setQuestionModal] = useState<QuestionModalState>({ isOpen: false, quizId: null })
  const [mediaFormData, setMediaFormData] = useState({ title: '', type: 'video', fileName: '' })
  const [quizFormData, setQuizFormData] = useState({ title: '', description: '', passingScore: 70, timeLimit: 30 })
  const [questionFormData, setQuestionFormData] = useState({ title: '', answerType: 'multipleChoice', correctAnswer: '', marks: 10, timeLimit: 5, options: ['', ''] })

  const modules = mockModules.filter((m) => m.courseId === courseId)

  const handleToggleExpand = (moduleId: string) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId)
  }

  const handleToggleQuiz = (quizId: string) => {
    setExpandedQuizzes((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }))
  }

  const handleAddMedia = (moduleId: string) => {
    setMediaModal({ isOpen: true, moduleId })
    setMediaFormData({ title: '', type: 'video', fileName: '' })
  }

  const handleSaveMedia = () => {
    console.log('✅ Media Added:', mediaFormData)
    setMediaModal({ isOpen: false, moduleId: null })
    setMediaFormData({ title: '', type: 'video', fileName: '' })
  }

  const handleAddQuiz = (moduleId: string) => {
    setQuizModal({ isOpen: true, moduleId })
    setQuizFormData({ title: '', description: '', passingScore: 70, timeLimit: 30 })
  }

  const handleSaveQuiz = () => {
    console.log('✅ Quiz Added:', quizFormData)
    setQuizModal({ isOpen: false, moduleId: null })
    setQuizFormData({ title: '', description: '', passingScore: 70, timeLimit: 30 })
  }

  const handleAddQuestion = (quizId: string) => {
    setQuestionModal({ isOpen: true, quizId })
    setQuestionFormData({ title: '', answerType: 'multipleChoice', correctAnswer: '', marks: 10, timeLimit: 5, options: ['', ''] })
  }

  const handleSaveQuestion = () => {
    console.log('✅ Question Added:', questionFormData)
    setQuestionModal({ isOpen: false, quizId: null })
    setQuestionFormData({ title: '', answerType: 'multipleChoice', correctAnswer: '', marks: 10, timeLimit: 5, options: ['', ''] })
  }

  const handleAddOption = () => {
    if (questionFormData.options.length < 4) {
      setQuestionFormData({
        ...questionFormData,
        options: [...questionFormData.options, ''],
      })
    }
  }

  const handleRemoveOption = (index: number) => {
    if (questionFormData.options.length > 2) {
      const newOptions = questionFormData.options.filter((_, i) => i !== index)
      setQuestionFormData({
        ...questionFormData,
        options: newOptions,
        correctAnswer: questionFormData.correctAnswer === questionFormData.options[index] ? '' : questionFormData.correctAnswer,
      })
    }
  }

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...questionFormData.options]
    newOptions[index] = value
    setQuestionFormData({
      ...questionFormData,
      options: newOptions,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Modules</h3>
          <p className="text-sm text-gray-500">Create and manage course modules with media and quizzes</p>
        </div>
        {/* <button
          onClick={onAddModule}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button> */}
      </div>

      {modules.length === 0 ? (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No modules yet. Create your first module to get started.</p>
          <button
            onClick={onAddModule}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Create First Module
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className=" border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
              draggable
            >
              {/* Module Header */}
              <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50" onClick={() => handleToggleExpand(module.id)}>
                <button
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleExpand(module.id)
                  }}
                >
                  {expandedModuleId === module.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{module.title}</h4>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {module.mediaItems.length} media
                  </span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                    {module.quizzes.length} quiz{module.quizzes.length !== 1 ? 'zes' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditModule?.(module)
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Edit module"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteModule?.(module.id)
                    }}
                    className="p-2 hover:bg-red-100 rounded transition-colors"
                    title="Delete module"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Module Details - Expanded */}
              {expandedModuleId === module.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                  {/* Module Info */}
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Duration</label>
                      <p className="text-sm text-gray-900 mt-1">{module.duration} minutes</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Order</label>
                      <p className="text-sm text-gray-900 mt-1">Position {module.order}</p>
                    </div>
                     <button
                      onClick={() => handleAddMedia(module.id)}
                      className="flex-1 flex items-center max-w-[200px] justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Add Media File
                    </button>
                  </div>

                  {/* Media Items */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Media Files ({module.mediaItems.length})</h5>
                    <div className="space-y-2">
                      {module.mediaItems.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No media files</p>
                      ) : (
                        module.mediaItems.map((media) => (
                          <div key={media.id} className="bg-white rounded p-2 border border-gray-200 flex items-center gap-3">
                            <div
                              className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                media.type === 'video'
                                  ? 'bg-red-100 text-red-700'
                                  : media.type === 'pdf'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {media.type}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{media.title}</p>
                              <p className="text-xs text-gray-500">{media.fileName}</p>
                            </div>
                            <span className="text-xs text-gray-500">{media.fileSize} MB</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Quizzes */}
                  <div>
                   <div className='flex items-center justify-between mb-2'>
                       <h5 className="text-sm font-semibold text-gray-900 mb-3">Quizzes ({module.quizzes.length})</h5>
                  
                   
                    <button
                      onClick={() => handleAddQuiz(module.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Add Quiz
                    </button>
                  
                   </div>
                    <div className="space-y-3">
                      {module.quizzes.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No quizzes</p>
                      ) : (
                        module.quizzes.map((quiz) => (
                          <div key={quiz.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            {/* Quiz Header */}
                            <button
                              onClick={() => handleToggleQuiz(quiz.id)}
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 text-left">
                                <h6 className="font-semibold text-gray-900">{quiz.title}</h6>
                                {quiz.description && (
                                  <p className="text-xs text-gray-600 mt-1">{quiz.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4 ml-4">
                                <div className="text-right">
                                  <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                    {quiz.questions.length} Q
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                                    Pass: {quiz.passingScore}%
                                  </span>
                                </div>
                                <ChevronDown
                                  className={`w-5 h-5 text-gray-600 transition-transform ${
                                    expandedQuizzes[quiz.id] ? 'transform rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </button>

                            {/* Quiz Details - Expanded */}
                            {expandedQuizzes[quiz.id] && (
                              <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                                {/* Quiz Info */}
                                <div className="grid grid-cols-3 gap-4 bg-white rounded-lg p-4">
                                  <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase">Passing Score</label>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{quiz.passingScore}%</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase">Time Limit</label>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{quiz.timeLimit || 0} min</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase">Total Questions</label>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{quiz.questions.length}</p>
                                  </div>
                                </div>

                                {/* Questions Section */}
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <h6 className="font-bold text-gray-900">Questions</h6>
                                    <button
                                      onClick={() => handleAddQuestion(quiz.id)}
                                      className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded font-medium hover:bg-green-100 transition-colors"
                                    >
                                      + Add Question
                                    </button>
                                  </div>

                                  {quiz.questions.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic py-4 text-center">No questions added yet</p>
                                  ) : (
                                    <div className="space-y-3">
                                      {quiz.questions.map((question) => (
                                        <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                          {/* Question Title */}
                                          <p className="font-semibold text-gray-900">{question.title}</p>

                                          {/* Question Details */}
                                          <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                              {question.answerType === 'multipleChoice'
                                                ? 'Multiple Choice'
                                                : question.answerType === 'yesNo'
                                                ? 'Yes/No'
                                                : 'Text Answer'}
                                            </span>
                                            <span className="text-xs text-gray-600">•</span>
                                            <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                                              {question.marks} marks
                                            </span>
                                            {question.options && question.options.length > 0 && (
                                              <>
                                                <span className="text-xs text-gray-600">•</span>
                                                <span className="text-xs text-gray-600">
                                                  {question.options.length} options
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          {/* Correct Answer */}
                                          <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Correct Answer</p>
                                            <p className="text-sm text-gray-900 mt-1 font-medium">{question.correctAnswer}</p>
                                          </div>

                                          {/* Options Display */}
                                          {question.options && question.options.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Options</p>
                                              <div className="space-y-1">
                                                {question.options.map((option, idx) => (
                                                  <p
                                                    key={idx}
                                                    className={`text-sm p-2 rounded ${
                                                      option === question.correctAnswer
                                                        ? 'bg-green-100 text-green-900 font-semibold'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                  >
                                                    {String.fromCharCode(65 + idx)}) {option}
                                                  </p>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Edit/Delete Buttons */}
                                          <div className="flex gap-2 mt-4">
                                            <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                                              Edit
                                            </button>
                                            <button className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded transition-colors">
                                              Delete
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
                        ))
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                 
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ========== ADD MEDIA MODAL ========== */}
      {mediaModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Add Media File</h3>
                <p className="text-sm text-gray-600 mt-1">Upload videos, PDFs, or images</p>
              </div>
              <button
                onClick={() => setMediaModal({ isOpen: false, moduleId: null })}
                className="p-2 hover:bg-blue-200 rounded-lg transition-colors text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Supported formats:</span> MP4, WebM for videos • PDF for documents • JPG, PNG for images
                </p>
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Media Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['video', 'pdf', 'image'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMediaFormData({ ...mediaFormData, type })}
                      className={`p-4 rounded-lg border-2 transition-all font-medium text-center ${
                        mediaFormData.type === type
                          ? 'border-primary bg-primary bg-opacity-10 text-primary'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {type === 'video' && <Video/>}
                      {type === 'pdf' && <File/>}
                      {type === 'image' && <ImageIcon/>}
                      <div className="capitalize mt-1 text-sm">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Media Title *</label>
                <input
                  type="text"
                  value={mediaFormData.title}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                  placeholder="e.g., HVAC System Overview"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* File Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">File Name *</label>
                <input
                  type="text"
                  value={mediaFormData.fileName}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, fileName: e.target.value })}
                  placeholder="e.g., hvac-overview.mp4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Drag Drop Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-primary hover:bg-opacity-5 transition-all cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">Drag and drop your file here</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse</p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
              <button
                onClick={() => setMediaModal({ isOpen: false, moduleId: null })}
                className="px-6 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMedia}
                className="px-6 py-2.5 text-sm bg-primary hover:bg-[#2c621b] text-white rounded-lg transition-colors font-bold flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== ADD QUIZ MODAL ========== */}
      {quizModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Create New Quiz</h3>
                <p className="text-sm text-gray-600 mt-1">Add a quiz to test student knowledge</p>
              </div>
              <button
                onClick={() => setQuizModal({ isOpen: false, moduleId: null })}
                className="p-2 hover:bg-purple-200 rounded-lg transition-colors text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Box */}
              <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
                <p className="text-sm text-purple-900">
                  <span className="font-semibold">Note:</span> You can add questions to the quiz after creating it.
                </p>
              </div>

              {/* Quiz Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Quiz Title *</label>
                <input
                  type="text"
                  value={quizFormData.title}
                  onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                  placeholder="e.g., HVAC Basics Quiz"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={quizFormData.description}
                  onChange={(e) => setQuizFormData({ ...quizFormData, description: e.target.value })}
                  placeholder="e.g., Test your knowledge of HVAC system basics"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Passing Score */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Passing Score (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={quizFormData.passingScore}
                    onChange={(e) => setQuizFormData({ ...quizFormData, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-2xl font-bold text-purple-600 min-w-[60px] text-right">
                    {quizFormData.passingScore}%
                  </div>
                </div>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={quizFormData.timeLimit}
                  onChange={(e) => setQuizFormData({ ...quizFormData, timeLimit: parseInt(e.target.value) })}
                  min="1"
                  max="180"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
              <button
                onClick={() => setQuizModal({ isOpen: false, moduleId: null })}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-bold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== ADD QUESTION MODAL ========== */}
      {questionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Add Question</h3>
                <p className="text-sm text-gray-600 mt-1">Create a new question for the quiz</p>
              </div>
              <button
                onClick={() => setQuestionModal({ isOpen: false, quizId: null })}
                className="p-2 hover:bg-green-200 rounded-lg transition-colors text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Box */}
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <span className="font-semibold">Tip:</span> Make questions clear and include correct answer and marks.
                </p>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Question Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'multipleChoice', label: 'Multiple Choice' },
                    { id: 'text', label: 'Text Answer' },
                    { id: 'yesNo', label: 'Yes/No' },
                    { id: 'truefalse', label: 'True/False' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setQuestionFormData({ ...questionFormData, answerType: type.id })}
                      className={`p-3 rounded-lg border-2 transition-all font-medium text-center text-sm ${
                        questionFormData.answerType === type.id
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Question *</label>
                <textarea
                  value={questionFormData.title}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, title: e.target.value })}
                  placeholder="Enter your question here"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Marks</label>
                <input
                  type="number"
                  value={questionFormData.marks}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, marks: parseInt(e.target.value) })}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={questionFormData.timeLimit || 5}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, timeLimit: parseInt(e.target.value) })}
                  min="1"
                  max="60"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Options Section - Only show for Multiple Choice */}
              {questionFormData.answerType === 'multipleChoice' && (
                <div className="space-y-3 border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">Options * (Min 2, Max 4)</label>
                    <button
                      onClick={handleAddOption}
                      disabled={questionFormData.options.length >= 4}
                      className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded font-medium hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {questionFormData.options.map((option, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded text-sm">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleUpdateOption(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          />
                          <button
                            onClick={() => handleRemoveOption(idx)}
                            disabled={questionFormData.options.length <= 2}
                            className="px-3 py-2 text-red-600 bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors font-medium text-sm"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Radio button to select correct answer */}
                        <div className="ml-10 flex items-center gap-2">
                          <input
                            type="radio"
                            id={`answer-${idx}`}
                            name="correctAnswer"
                            value={option}
                            checked={questionFormData.correctAnswer === option}
                            onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor={`answer-${idx}`} className="text-sm text-gray-700 cursor-pointer font-medium">
                            This is the correct answer
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {questionFormData.options.length < 2 && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded">At least 2 options are required</p>
                  )}
                </div>
              )}

              {/* Answer field for non-multiple choice */}
              {questionFormData.answerType !== 'multipleChoice' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correct Answer *</label>
                  <input
                    type="text"
                    value={questionFormData.correctAnswer}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, correctAnswer: e.target.value })}
                    placeholder="Enter the correct answer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3 justify-end">
              <button
                onClick={() => setQuestionModal({ isOpen: false, quizId: null })}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold"
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
