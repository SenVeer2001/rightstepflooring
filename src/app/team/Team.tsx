import { Plus, Search, Phone } from "lucide-react"
import Select from "react-select"
import { useMemo, useState } from "react"
import { AddTeamMemberModal } from "../../components/teamPages/AddTeamMemberModal"
import { useNavigate } from "react-router-dom"

/* ================= TYPES ================= */


const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "38px",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#2563eb" : "#d1d5db", // blue when focus
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: "#2563eb",
    },
  }),
  input: (base: any) => ({
    ...base,
    outline: "none",      
    boxShadow: "none",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "14px",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#dbeafe",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#1e40af",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#1e40af",
    ":hover": {
      backgroundColor: "#bfdbfe",
      color: "#1e3a8a",
    },
  }),
};


interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  fieldTech: boolean
  type: string
  createdAt: string
  skills: string
  areas: string
  status: "active" | "inactive"
  has2FA?: boolean
}

/* ================= MOCK DATA ================= */

const teamData: TeamMember[] = [
  {
    id: "1",
    name: "Joe R Lynn",
    email: "joelynn652@gmail.com",
    phone: "+1 (919) 771-8174",
    role: "tech",
    fieldTech: true,
    type: "Subcontractor",
    createdAt: "Tue Jul 01, 2025",
    skills: "Carpet, Laminate",
    areas: "North",
    status: "active",
    has2FA: true,
  },
  {
    id: "2",
    name: "Adrian Pagaz",
    email: "imperamicile@gmail.com",
    phone: "+1 (919) 232-1571",
    role: "tech",
    fieldTech: true,
    type: "Subcontractor",
    createdAt: "Mon Jun 02, 2025",
    skills: "Bathroom Remodel",
    areas: "East",
    status: "active",
  },
]

/* ================= FILTER OPTIONS ================= */

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

/* ================= COMPONENT ================= */

export function Team() {
  const [search, setSearch] = useState("")
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<
    { label: string; value: string }[]
  >([])

  const navigate = useNavigate();
  const filteredTeam = useMemo(() => {
    return teamData.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter.length === 0 ||
        statusFilter.some(s => s.value === member.status)

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and add users to your team
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary hover:bg-[#2c621b] text-white px-4 py-2 rounded-lg text-sm font-semibold"
          onClick={() => { setIsAddMemberOpen(true) }}
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center bg-white border rounded-lg p-4">

        {/* STATUS MULTI SELECT */}
        <div className="min-w-[220px]">
          <Select
            isMulti
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as any)}
            placeholder="Status"
            styles={selectStyles}
            className="text-sm"
            classNamePrefix="react-select"
          />

        </div>

        {/* SEARCH */}
        <div className="relative flex-1 min-w-[260px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Field Tech</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Skills</th>
              <th className="p-3 text-left">Areas</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeam.map(member => (
              <tr
                key={member.id}
                className="border-b hover:bg-primary/10 transition cursor-pointer"
                onClick={() => { navigate(`/team/user/${member.id}`) }}
              >
                {/* NAME */}
                <td className="p-3">
                  <div className="font-semibold text-gray-900">
                    {member.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {member.email}
                  </div>

                  {member.has2FA && (
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      2FA
                    </span>
                  )}
                </td>

                {/* PHONE */}
                <td className="p-3 text-primary">
                  <a href={`tel:${member.phone}`} className="flex items-center gap-1">
                    <Phone size={14} />
                    {member.phone}
                  </a>
                </td>

                <td className="p-3">{member.role}</td>
                <td className="p-3">{member.fieldTech ? "Yes" : "No"}</td>
                <td className="p-3">{member.type}</td>
                <td className="p-3">{member.createdAt}</td>
                <td className="p-3">{member.skills}</td>
                <td className="p-3">{member.areas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredTeam.map(member => (
          <div key={member.id} className="bg-white border rounded-lg p-4">
            <div className="font-semibold">{member.name}</div>
            <div className="text-xs text-gray-500">{member.email}</div>

            <div className="mt-2 text-sm">
              <p>📞 {member.phone}</p>
              <p>Role: {member.role}</p>
              <p>Type: {member.type}</p>
              <p>Status: {member.status}</p>
            </div>
          </div>
        ))}
      </div>

      <AddTeamMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSave={(data) => {
          console.log("Team member:", data)
          setIsAddMemberOpen(false)
        }}
      />

    </div>
  )
}
