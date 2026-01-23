import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Save, Plus, ArrowLeft } from 'lucide-react'
import { mockCourses, mockCategories, mockQuestionGroups } from '../mockData'
import { StatusBadge } from '../components/StatusBadge'
import { QuestionForm } from '../components/QuestionForm'
import { QuestionGroupAccordion } from '../components/QuestionGroupAccordion'
import { QuestionGroupForm } from '../components/QuestionGroupForm'
import { ModuleManager } from '../components/ModuleManager'
import Select from '../../../components/ui/Select'
import type { QuestionGroup } from '../mockData'


type Tab = 'details' | 'modules' | 'questions'

export function CourseBuilder() {
  const navigate = useNavigate()
  const selectedCourse = mockCourses[0]
  const [activeTab, setActiveTab] = useState<Tab>('details')
  const [formData, setFormData] = useState({
    title: selectedCourse.name,
    category: selectedCourse.category,
    subcategory: selectedCourse.subcategory,
    description: selectedCourse.description,
  })

  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(mockQuestionGroups[0])
  const [groupFormOpen, setGroupFormOpen] = useState(false)
  const [groups, setGroups] = useState<QuestionGroup[]>(mockQuestionGroups)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveQuestion = (questionData: unknown) => {
    console.log('Save question:', questionData)
  }

  const handleDeleteQuestion = (questionId: string) => {
    console.log('Delete question:', questionId)
  }

  const handleDeleteQuestionGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId))
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(groups[0] || mockQuestionGroups[0])
    }
  }

  const handleAddGroup = (groupData: Partial<QuestionGroup>) => {
    const newGroup: QuestionGroup = {
      id: `group-${Date.now()}`,
      courseId: selectedCourse.id,
      name: groupData.name || '',
      description: groupData.description,
      order: groupData.order || groups.length + 1,
      questions: [],
    }
    setGroups([...groups, newGroup])
    setSelectedGroup(newGroup)
    setActiveTab('questions')
  }

  const subcategoryOptions = mockCategories
    .find((cat) => cat.name === formData.category)
    ?.subcategories.map((sub) => sub.name) || []

  return (
    <div className="space-y-4 min-h-screen p-4">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/training/courses')}
          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between  rounded-lg p-4 ">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Builder</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-gray-700 font-semibold">{selectedCourse.name}</span>
            <StatusBadge status={selectedCourse.status} size="sm" />
          </div>
          <p className="text-sm text-gray-600 mt-2">Manage course content, modules, groups, and questions</p>
        </div>
        <button className="flex text-sm items-center gap-2 bg-primary hover:bg-[#2c621b] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm">
          <Save size={20} />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8 px-6">
          {([
            { id: 'details', label: 'Details' },
            { id: 'modules', label: 'Modules' },
            // { id: 'groups', label: 'Groups' },
            { id: 'questions', label: 'Questions' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-3 border-b-2 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-b-lg border border-t-0 border-gray-200 p-8 shadow-sm">
        {/* Tab 1: Course Details */}
        {activeTab === 'details' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Course Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-semibold transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Category"
                value={formData.category}
                onChange={(value) => handleChange({ target: { name: 'category', value } } as React.ChangeEvent<HTMLSelectElement>)}
              >
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Subcategory"
                value={formData.subcategory}
                onChange={(value) => handleChange({ target: { name: 'subcategory', value } } as React.ChangeEvent<HTMLSelectElement>)}
              >
                {subcategoryOptions.map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none font-medium transition-all"
              />
            </div>

            <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Status</p>
                  <p className="text-lg font-bold text-blue-900 mt-2">{selectedCourse.status}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Total Questions</p>
                  <p className="text-lg font-bold text-blue-900 mt-2">{selectedCourse.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Total Marks</p>
                  <p className="text-lg font-bold text-blue-900 mt-2">{selectedCourse.totalMarks}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Modules */}
        {activeTab === 'modules' && (
          <div className="space-y-4 max-w-5xl">
            <div className="space-y-3">
              {/* <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Course Modules</h3>
                <p className="text-sm text-gray-600">2 modules initialized</p>
              </div> */}
              <ModuleManager courseId={selectedCourse.id} />
            </div>
          </div>
        )}

        {/* Tab 3: Question Groups */}
        {/* {activeTab === 'groups' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Question Groups</h3>
              <button
                onClick={() => setGroupFormOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-[#2c621b] text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-sm"
              >
                <Plus size={18} />
                Add Group
              </button>
            </div>

            <div className="space-y-3">
              {groups.map((group) => (
                <div 
                  key={group.id} 
                  className="border border-gray-200 rounded-lg p-5 hover:border-primary hover:bg-green-50 transition-all cursor-pointer group"
                  onClick={() => {
                    setSelectedGroup(group)
                    setActiveTab('questions')
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{group.name}</h4>
                      {group.description && (
                        <p className="text-sm text-gray-600 mt-2">{group.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-2 bg-green-100 text-primary text-sm font-bold rounded-full border border-green-200">
                        {group.questions.length} Questions
                      </span>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Tab 4: Question Builder */}
        {activeTab === 'questions' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <div className="mb-6 p-5 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Selected Group</p>
                <p className="text-2xl font-bold text-blue-900">{selectedGroup?.name}</p>
              </div>

              <button
                onClick={() => setQuestionFormOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-[#2c621b] text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-sm mb-6"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            {selectedGroup && (
              <div className="space-y-3">
                <QuestionGroupAccordion
                  group={selectedGroup}
                  onAddQuestion={() => setQuestionFormOpen(true)}
                  onEditQuestion={() => console.log('edit')}
                  onDeleteQuestion={handleDeleteQuestion}
                  onDeleteGroup={handleDeleteQuestionGroup}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      <QuestionForm
        isOpen={questionFormOpen}
        onClose={() => setQuestionFormOpen(false)}
        onSubmit={handleSaveQuestion}
        groupId={selectedGroup?.id || ''}
        title="Add Question to Module"
      />

      {/* Question Group Form Modal */}
      <QuestionGroupForm
        isOpen={groupFormOpen}
        onClose={() => setGroupFormOpen(false)}
        onSubmit={handleAddGroup}
        courseId={selectedCourse.id}
        title="Create Question Group"
      />
    </div>
  )
}
