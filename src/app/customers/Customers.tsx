import { Search, Filter, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

/* ===================== TYPES ===================== */

type CustomerStatus = "active" | "inactive"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  totalJobs: number
  totalSpent: number
  status: CustomerStatus
  joinDate: string
}

/* ===================== DATA ===================== */

const customersData: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    totalJobs: 5,
    totalSpent: 12500,
    status: "active",
    joinDate: "2025-06-15",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    totalJobs: 12,
    totalSpent: 28300,
    status: "active",
    joinDate: "2024-03-20",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "mbrown@email.com",
    phone: "(555) 345-6789",
    address: "789 Pine Rd",
    city: "Aurora",
    state: "IL",
    zip: "60505",
    totalJobs: 8,
    totalSpent: 19200,
    status: "active",
    joinDate: "2025-01-10",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.d@email.com",
    phone: "(555) 456-7890",
    address: "321 Elm St",
    city: "Naperville",
    state: "IL",
    zip: "60540",
    totalJobs: 3,
    totalSpent: 5600,
    status: "inactive",
    joinDate: "2023-11-05",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "jwilson@email.com",
    phone: "(555) 567-8901",
    address: "654 Maple Dr",
    city: "Evanston",
    state: "IL",
    zip: "60201",
    totalJobs: 15,
    totalSpent: 42800,
    status: "active",
    joinDate: "2023-08-22",
  },
]

/* ===================== COMPONENT ===================== */

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | CustomerStatus>("all")

  /* ===================== SEARCH + FILTER ===================== */

  const filteredCustomers = customersData.filter((customer) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const normalizedPhone = customer.phone.replace(/\D/g, "")

    const matchesSearch =
      normalizedSearch === "" ||
      customer.name.toLowerCase().includes(normalizedSearch) ||
      customer.email.toLowerCase().includes(normalizedSearch) ||
      customer.city.toLowerCase().includes(normalizedSearch) ||
      normalizedPhone.includes(normalizedSearch.replace(/\D/g, ""))

    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 p-4 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your customer database and information
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-[#2c621b] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      {/* Search & Filter */}
      <div className=" rounded-lg  shadow-sm">
        <div className="flex gap-4 ">
          <div className="flex-1 min-w-[300px] ">
            {/* SEARCH ICON FIXED (aligned & consistent) */}
            {/* <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            /> */}
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 text-sm pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 text-sm border max-w-[200px] border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white cursor-pointer"
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(event.target.value as "all" | CustomerStatus)
            }
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="flex items-center text-sm gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-primary" />
            More Filters
          </button>
        </div>
      </div>

      {/* Table (UNCHANGED UI) */}
      <div className="bg-white text-sm rounded-lg border border-gray-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">City</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Jobs</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold">{customer.name}</td>
                  <td className="px-6 py-4 text-blue-600">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">
                    {customer.city}, {customer.state}
                  </td>
                  <td className="px-6 py-4">{customer.totalJobs}</td>
                  <td className="px-6 py-4 font-semibold">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        customer.status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Eye size={18} className="text-gray-600" />
                      <Edit size={18} className="text-blue-600" />
                      <Trash2 size={18} className="text-red-600" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No customers found
          </div>
        )}
      </div>
    </div>
  )
}
