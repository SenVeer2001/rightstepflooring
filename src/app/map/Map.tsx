import { useState } from 'react'
import { MapPin, Phone, Clock, Wrench, Users, Search, Filter, Eye, Map as MapIcon } from 'lucide-react'

interface Job {
  id: string
  title: string
  address: string
  status: 'scheduled' | 'in-progress' | 'completed'
  technician: string
  time: string
  lat: number
  lng: number
}

interface Technician {
  id: string
  name: string
  phone: string
  lat: number
  lng: number
  status: 'available' | 'busy' | 'offline'
  currentJob?: string
  jobsToday: number
}

const jobsData: Job[] = [
  {
    id: '1',
    title: 'Flooring Installation',
    address: '123 Main St, Downtown',
    status: 'in-progress',
    technician: 'John Smith',
    time: '2:30 PM',
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: '2',
    title: 'Carpet Cleaning',
    address: '456 Oak Ave, Midtown',
    status: 'scheduled',
    technician: 'Sarah Johnson',
    time: '4:00 PM',
    lat: 40.7580,
    lng: -73.9855,
  },
  {
    id: '3',
    title: 'Tile Repair',
    address: '789 Pine Rd, Uptown',
    status: 'completed',
    technician: 'Mike Davis',
    time: 'Completed',
    lat: 40.7689,
    lng: -73.9776,
  },
  {
    id: '4',
    title: 'Wood Finishing',
    address: '321 Elm St, Downtown',
    status: 'scheduled',
    technician: 'Emily White',
    time: '3:15 PM',
    lat: 40.7505,
    lng: -74.0055,
  },
  {
    id: '5',
    title: 'Flooring Repair',
    address: '654 Maple Ave, Midtown',
    status: 'in-progress',
    technician: 'James Brown',
    time: '1:45 PM',
    lat: 40.7614,
    lng: -73.9776,
  },
]

const techniciansData: Technician[] = [
  {
    id: 't1',
    name: 'John Smith',
    phone: '+1-555-0123',
    lat: 40.7128,
    lng: -74.0060,
    status: 'busy',
    currentJob: 'Flooring Installation',
    jobsToday: 3,
  },
  {
    id: 't2',
    name: 'Sarah Johnson',
    phone: '+1-555-0124',
    lat: 40.7580,
    lng: -73.9855,
    status: 'available',
    jobsToday: 2,
  },
  {
    id: 't3',
    name: 'Mike Davis',
    phone: '+1-555-0125',
    lat: 40.7689,
    lng: -73.9776,
    status: 'available',
    jobsToday: 4,
  },
  {
    id: 't4',
    name: 'Emily White',
    phone: '+1-555-0126',
    lat: 40.7505,
    lng: -74.0055,
    status: 'busy',
    currentJob: 'Wood Finishing',
    jobsToday: 2,
  },
  {
    id: 't5',
    name: 'James Brown',
    phone: '+1-555-0127',
    lat: 40.7614,
    lng: -73.9776,
    status: 'busy',
    currentJob: 'Flooring Repair',
    jobsToday: 5,
  },
]

export function Map() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'techs'>('jobs')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const filteredJobs = jobsData.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.technician.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTechs = techniciansData.filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.phone.includes(searchQuery)
  )

  return (
    <div className="flex flex-col h-screen">
      {/* Breadcrumb */}
      <div className="px-6 pt-6 pb-4 text-xs text-gray-500 uppercase tracking-wider">
        WORKSPACE # MAP
      </div>

      {/* Header with Tabs */}
      <div className="px-6 pb-4 ">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'jobs'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Wrench size={18} />
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('techs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'techs'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Users size={18} />
              Technicians
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'jobs' ? 'Search jobs, address, technician...' : 'Search technician, phone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* Map Section (Left) */}
        <div className="flex-1 bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-gray-300 relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center flex-col gap-4">
            {/* Placeholder for Map */}
            {/* <MapIcon size={64} className="text-gray-400" />
            <p className="text-gray-500 font-medium">Map View</p>
            <p className="text-gray-400 text-sm">Integrate Google Maps API to display locations</p> */}


            <iframe
              className="w-full h-full rounded-lg"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=40.758,-73.9855&z=13&output=embed"
            />

            {/* Sample Markers */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Jobs markers */}
              {activeTab === 'jobs' &&
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                    style={{
                      left: `${30 + (job.lat - 40.7) * 100}px`,
                      top: `${50 + (job.lng + 74) * 100}px`,
                    }}
                  >
                    <button
                      onClick={() => setSelectedItem(job.id)}
                      className={`w-full h-full rounded-full flex items-center justify-center transition-all ${job.status === 'in-progress'
                          ? 'bg-orange-500 ring-2 ring-orange-300'
                          : job.status === 'scheduled'
                            ? 'bg-blue-500 ring-2 ring-blue-300'
                            : 'bg-green-500 ring-2 ring-green-300'
                        } hover:scale-110`}
                    >
                      <MapPin size={16} className="text-white" />
                    </button>
                  </div>
                ))}

              {/* Technicians markers */}
              {activeTab === 'techs' &&
                filteredTechs.map((tech) => (
                  <div
                    key={tech.id}
                    className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
                    style={{
                      left: `${30 + (tech.lat - 40.7) * 100}px`,
                      top: `${50 + (tech.lng + 74) * 100}px`,
                    }}
                  >
                    <button
                      onClick={() => setSelectedItem(tech.id)}
                      className={`w-full h-full rounded-full flex items-center justify-center transition-all ${tech.status === 'busy'
                          ? 'bg-red-500 ring-2 ring-red-300'
                          : 'bg-green-500 ring-2 ring-green-300'
                        } hover:scale-110`}
                    >
                      <Users size={16} className="text-white" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar List Section (Right) */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Tab Title */}
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'jobs' ? `Jobs (${filteredJobs.length})` : `Technicians (${filteredTechs.length})`}
            </h3>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'jobs' ? (
              <div className="space-y-2 p-3">
                {filteredJobs.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No jobs found</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedItem(job.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedItem === job.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">{job.title}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${job.status === 'in-progress'
                              ? 'bg-orange-100 text-orange-700'
                              : job.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {job.status === 'in-progress'
                            ? 'In Progress'
                            : job.status === 'scheduled'
                              ? 'Scheduled'
                              : 'Completed'}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{job.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          <span>{job.technician}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>{job.time}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2 p-3">
                {filteredTechs.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No technicians found</p>
                  </div>
                ) : (
                  filteredTechs.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedItem(tech.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedItem === tech.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{tech.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{tech.phone}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${tech.status === 'busy'
                              ? 'bg-red-100 text-red-700'
                              : tech.status === 'available'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {tech.status === 'busy'
                            ? 'Busy'
                            : tech.status === 'available'
                              ? 'Available'
                              : 'Offline'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {tech.currentJob && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            <p className="font-medium text-gray-700">Current: {tech.currentJob}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Jobs today:</span>
                          <span className="font-semibold text-gray-900">{tech.jobsToday}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-3 py-3 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white font-medium py-2 px-3 rounded-lg transition">
              <Eye size={16} />
              View Details
            </button>
            {activeTab === 'jobs' && (
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-3 rounded-lg transition">
                <Phone size={16} />
                Call Technician
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
