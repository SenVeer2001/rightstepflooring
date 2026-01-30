import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

interface ClientEstimatesTabProps {
  clientId: string
}

export function ClientEstimatesTab({ clientId }: ClientEstimatesTabProps) {
  const navigate = useNavigate()

  // Mock estimates data
  const estimates = [
    {
      id: "1",
      estimateNumber: "E-001",
      name: "Estimate 1",
      createdDate: "Sat Dec 06, 2025 03:27 pm",
      address: "2225 Charlotte Street, Durham...",
      status: "Won",
      jobNumber: "480",
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Job</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => (
              <tr
                key={estimate.id}
                className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/estimates/${estimate.id}`)}
              >
                <td className="px-6 py-4 text-sm font-semibold text-primary">{estimate.estimateNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{estimate.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{estimate.createdDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{estimate.address}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {estimate.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-primary cursor-pointer hover:underline">{estimate.jobNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {estimates.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">No estimates found for this client.</p>
        </div>
      )}
    </div>
  )
}
