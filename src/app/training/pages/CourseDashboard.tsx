import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { mockCourses } from '../mockData'
import { CourseCard } from '../components/CourseCard'
import Select from '../../../components/ui/Select'


export function CourseDashboard() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || course.category === filterCategory
    const matchesStatus = !filterStatus || course.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleView = (id: string) => {
    navigate(`/training/courses/view/${id}`)
  }

  const handlePublish = (id: string) => {
    console.log('Publish course:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete course:', id)
  }

  const categories = Array.from(
    new Set(mockCourses.map((course) => course.category))
  )

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Courses</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage and create training courses
          </p>
        </div>
        <button onClick={() => navigate('/training/courses/new')} className="flex items-center gap-2 bg-primary hover:bg-[#2c621b] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
          <Plus size={20} />
          Add Course
        </button>
      </div>

      {/* Search & Filter */}
      <div className="rounded-lg ">
        <div className="flex gap-2 items-center justify-between">
          <div className="relative flex-1 max-w-[50%]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice or client..."
              className="w-full pl-10 pr-4 py-[9px] border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className='flex gap-4 mr-10'>
            
            <Select
              label=''
              value={filterCategory}
              onChange={(value) => setFilterCategory(value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>

            
            <Select
              label=''
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </Select>
          </div>
        </div>
      </div>


      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onView={handleView}
              onEdit={(id) => navigate(`/training/courses/edit/${id}`)}
              onPublish={handlePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-600 text-lg font-semibold">No courses found</p>
          <p className="text-gray-500 text-sm mt-1">Get started by creating a new course</p>
          <button onClick={() => navigate('/training/courses/new')} className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-[#2c621b] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            <Plus size={18} />
            Create Course
          </button>
        </div>
      )}
    </div>
  )
}
