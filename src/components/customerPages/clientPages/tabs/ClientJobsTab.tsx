import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

interface ClientJobsTabProps {
  clientId: string
}

export function ClientJobsTab({ clientId }: ClientJobsTabProps) {
  const navigate = useNavigate()

  // Mock jobs data for this client
  const jobs = [
    {
      id: "1",
      jobNumber: "480",
      name: "Robin Stevens",
      address: "2225 Charlotte Street",
      city: "Durham",
      state: "North Carolina",
      zip: "27705",
      jobDate: "Sat Dec 0...",
      jobType: "Tile Install",
      status: "Submitted",
      total: "2578.95",
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Id</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">State</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Zip code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Job Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Job Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/client/jobs/1`)}
              >
                <td className="px-6 py-4 text-sm font-semibold text-primary">{job.jobNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{job.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.address}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.city}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.state}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.zip}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.jobDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{job.jobType}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${job.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">No jobs found for this client.</p>
        </div>
      )}
    </div>
  )
}
