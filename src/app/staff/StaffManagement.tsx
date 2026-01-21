"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import {

  STAFF_STATUS_LABELS,
  staffStatusStyles,
  type Staff,
  type StaffStatus,
} from "../../types/staffTypes"
import { StaffModal } from "../../components/StaffModal"

/* ===================== MOCK DATA ===================== */

const initialStaffList: Staff[] = [
  {
    id: "1",
    name: "Amit Sharma",
    phone: "9876543210",
    field: "Electrical",
    type: "Full-time",
    skills: ["Wiring", "Maintenance"],
    area: "Delhi",
    status: "active",
    createdDate: "2026-01-10",
  },
]

/* ===================== COMPONENT ===================== */

export function StaffManagement() {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaffList)
  const [searchText, setSearchText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | StaffStatus>("all")
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)

  const filteredStaff = staffList.filter((staff) => {
    const searchValue = searchText.toLowerCase()

    const matchesSearch =
      staff.name.toLowerCase().includes(searchValue) ||
      staff.phone.includes(searchValue) ||
      staff.field.toLowerCase().includes(searchValue) ||
      staff.area.toLowerCase().includes(searchValue) ||
      staff.skills.join(" ").toLowerCase().includes(searchValue)

    const matchesStatus =
      selectedStatus === "all" || staff.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const handleCreateStaff = (formData: any) => {
    const newStaff: Staff = {
      id: String(staffList.length + 1),
      ...formData,
      createdDate: new Date().toISOString().split("T")[0],
    }

    setStaffList([newStaff, ...staffList])
    setIsStaffModalOpen(false)
  }

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-sm text-gray-600">
            Manage staff members and assignments
          </p>
        </div>

        <button
          onClick={() => setIsStaffModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row text-sm gap-4">
        <div className="relative flex-1 min-w-[900px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search name, phone, skill, field or area..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg  border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value as any)
          }
          className="px-4 py-2  rounded-lg border border-gray-300  focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          {Object.entries(STAFF_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["ID", "Name", "Phone", "Field", "Type", "Skills", "Area", "Status", "Created"].map(
                (header) => (
                  <th key={header} className="px-4 py-3 text-left">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{staff.id}</td>
                <td className="px-4 py-3 font-semibold">{staff.name}</td>
                <td className="px-4 py-3">{staff.phone}</td>
                <td className="px-4 py-3">{staff.field}</td>
                <td className="px-4 py-3">{staff.type}</td>
                <td className="px-4 py-3">
                  {staff.skills.join(", ")}
                </td>
                <td className="px-4 py-3">{staff.area}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${staffStatusStyles[staff.status]}`}
                  >
                    {STAFF_STATUS_LABELS[staff.status]}
                  </span>
                </td>
                <td className="px-4 py-3">{staff.createdDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStaff.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No staff found
          </div>
        )}
      </div>

      {/* Modal */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSubmit={handleCreateStaff}
      />
    </div>
  )
}
