import { useState } from 'react'
import { MapPin, Clock, Phone, Navigation, AlertCircle, Plus } from "lucide-react"

interface Job {
  id: number
  time: string
  job: string
  tech: string
  location: string
  lat: number
  lng: number
  status: 'Active' | 'Scheduled'
  phone: string
}

const initialJobs: Job[] = [
  { 
    id: 1, 
    time: "09:00", 
    job: "HVAC Maintenance", 
    tech: "John Doe", 
    location: "North St", 
    lat: 40.7128, 
    lng: -74.0060,
    status: "Active",
    phone: "+1 (555) 0101"
  },
  { 
    id: 2, 
    time: "10:30", 
    job: "Plumbing Repair", 
    tech: "Jane Smith", 
    location: "Main Ave", 
    lat: 40.7580, 
    lng: -73.9855,
    status: "Active",
    phone: "+1 (555) 0102"
  },
  { 
    id: 3, 
    time: "14:00", 
    job: "Electrical Work", 
    tech: "Mike Johnson", 
    location: "Park Rd", 
    lat: 40.7489, 
    lng: -73.9680,
    status: "Scheduled",
    phone: "+1 (555) 0103"
  },
]

export function Dispatch() {
  const [jobs, setJobs] = useState(initialJobs)
  const [draggedJob, setDraggedJob] = useState<Job | null>(null)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [showGPS, setShowGPS] = useState(false)

  const handleDragStart = (job: Job) => {
    setDraggedJob(job)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (tech: string) => {
    if (draggedJob) {
      setJobs(jobs.map(job => 
        job.id === draggedJob.id ? { ...job, tech } : job
      ))
      setDraggedJob(null)
    }
  }

  const technicianGroups = [
    { name: "John Doe", status: "On Job", color: "bg-green-100 text-green-700" },
    { name: "Jane Smith", status: "On Job", color: "bg-green-100 text-green-700" },
    { name: "Mike Johnson", status: "Available", color: "bg-blue-100 text-blue-700" },
    { name: "Sarah Lee", status: "Available", color: "bg-blue-100 text-blue-700" },
  ]

  const jobsByTech = (tech: string) => jobs.filter(j => j.tech === tech)
  const unassignedJobs = jobs.filter(j => !technicianGroups.find(t => t.name === j.tech))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispatch Board</h1>
          <p className="text-gray-600 text-sm mt-1">Drag jobs to assign technicians • Real-time tracking</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowGPS(!showGPS)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex-1 md:flex-none justify-center md:justify-start"
          >
            <MapPin size={18} />
            GPS Map
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-1 md:flex-none justify-center md:justify-start">
            <Plus size={18} />
            Assign
          </button>
        </div>
      </div>

      {/* GPS Map View */}
      {showGPS && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-50 relative flex items-center justify-center">
            {/* Simulated Map */}
            <div className="w-full h-full relative">
              {jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedTech(job.tech)}
                  className="absolute group"
                  style={{
                    left: `${(job.lng + 74.0) * 200}px`,
                    top: `${(job.lat - 40.7) * 200}px`,
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-transform hover:scale-110 ${
                    job.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {job.tech.charAt(0)}
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {job.job}
                  </div>
                </button>
              ))}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow p-3 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dispatch Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Unassigned Jobs */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Unassigned Jobs</h3>
          <div className="space-y-2">
            {unassignedJobs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">All jobs assigned</p>
            ) : (
              unassignedJobs.map(job => (
                <div
                  key={job.id}
                  draggable
                  onDragStart={() => handleDragStart(job)}
                  className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded cursor-move hover:shadow-md transition"
                >
                  <p className="font-semibold text-sm text-gray-900">{job.job}</p>
                  <p className="text-xs text-gray-600 mt-1">{job.time}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Technician Columns */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {technicianGroups.map((tech) => (
              <div
                key={tech.name}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(tech.name)}
                className={`bg-white rounded-lg border-2 border-dashed p-4 transition ${
                  draggedJob ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
              >
                {/* Tech Header */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      {tech.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{tech.name}</p>
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${tech.color}`}>
                        {tech.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Jobs */}
                <div className="space-y-3">
                  {jobsByTech(tech.name).length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">No jobs assigned</p>
                  ) : (
                    jobsByTech(tech.name).map(job => (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={() => handleDragStart(job)}
                        className={`p-3 rounded-lg border-l-4 cursor-move hover:shadow-md transition ${
                          job.status === 'Active' 
                            ? 'border-l-green-500 bg-green-50' 
                            : 'border-l-blue-500 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold text-sm text-gray-900 flex-1">{job.job}</p>
                          <span className={`px-1.5 py-0.5 text-xs font-semibold rounded whitespace-nowrap ${
                            job.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {job.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            {job.phone}
                          </div>
                        </div>

                        {/* GPS Link */}
                        <button className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200 transition">
                          <Navigation size={12} />
                          Navigate
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Job Count */}
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 text-center">
                  {jobsByTech(tech.name).length} job{jobsByTech(tech.name).length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Hint */}
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <AlertCircle size={18} />
        Drag jobs from the left panel to assign them to technicians
      </div>
    </div>
  )
}
