

import { useMemo, useState } from "react"
import { Plus, Search, Trash2 } from "lucide-react"
import AddRoleModal from "./AddRoleModel"

interface Role {
  id: string
  name: string
  deletable: boolean
}

const INITIAL_ROLES: Role[] = [
  { id: "1", name: "Admin", deletable: false },
  { id: "2", name: "Manager", deletable: true },
  { id: "3", name: "Tech", deletable: true },
  { id: "4", name: "Sales Tech", deletable: true },
  { id: "5", name: "Field Manager", deletable: true },
  { id: "6", name: "Data Entry", deletable: true },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredRoles = useMemo(() => {
    return roles.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [roles, search])

  const handleDelete = (id: string) => {
    setRoles(prev => prev.filter(role => role.id !== id))
  }

  const handleAddRole = (name: string) => {
    setRoles(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        deletable: true,
      },
    ])
  }

  return (
    <div className="p-3 space-y-6 bg-white rounded-lg">

      {/* HEADER */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Roles & Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Control what your team can see or do on your account
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          <Plus size={16} />
          Add New Role
        </button>
      </div>

      {/* SEARCH */}
      {/* <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
          />
        </div>
      </div> */}

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.map(role => (
              <tr
                key={role.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {role.name}
                </td>

                <td className="px-6 py-4 text-right">
                  {role.deletable ? (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="inline-flex items-center gap-2 px-4 py-1.5
                                 border border-primary
                                 text-red-500 text-xs font-semibold rounded-full"
                    >
                      <Trash2 size={14} className="text-red-700" />
                      Delete Role
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">
                      System role
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRoles.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No roles found
          </div>
        )}
      </div>

      {/* ADD ROLE MODAL */}
      <AddRoleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRole}
      />
    </div>
  )
}
