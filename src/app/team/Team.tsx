import { Search, Filter, Plus, Eye, Edit, Trash2, Award } from 'lucide-react'
import { useState } from 'react'

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: 'manager' | 'technician' | 'admin'
  status: 'active' | 'inactive'
  joinDate: string
  jobs: number
  rating: number
}

const teamData: TeamMember[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike.johnson@workiz.com',
    phone: '(555) 123-4567',
    role: 'manager',
    status: 'active',
    joinDate: '2024-06-15',
    jobs: 45,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Lisa Brown',
    email: 'lisa.brown@workiz.com',
    phone: '(555) 234-5678',
    role: 'technician',
    status: 'active',
    joinDate: '2025-01-10',
    jobs: 23,
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Tom Davis',
    email: 'tom.davis@workiz.com',
    phone: '(555) 345-6789',
    role: 'technician',
    status: 'active',
    joinDate: '2024-08-20',
    jobs: 38,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Sarah Admin',
    email: 'sarah@workiz.com',
    phone: '(555) 456-7890',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-05',
    jobs: 0,
    rating: 5.0,
  },
]

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  technician: 'bg-green-100 text-green-800',
}

export function Team() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')

  const filteredTeam = teamData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === 'all' || member.role === filterRole

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your team members and roles</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
          <Plus size={20} />
          Add Member
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="technician">Technician</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-gray-600" />
            More Filters
          </button>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jobs</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.map((member) => (
                <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600">{member.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{member.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${roleColors[member.role as keyof typeof roleColors]}`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {member.jobs}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Award size={16} className="text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">{member.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${member.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeam.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No team members found</p>
          </div>
        )}
      </div>
    </div>
  )
}
