import { Search, Filter, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreateClientModal } from "../../components/customerPages/CreateClientModal"

/* ===================== TYPES ===================== */

type CustomerStatus = "active" | "inactive"

interface Customer {
  id: string
  jobId: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  city: string
  state: string
  zip: string
  totalJobs: number
  totalSpent: number
  status: CustomerStatus
  joinDate: string
}



const customersData: Customer[] = [
  {
    id: "1",
    jobId: "480",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    company: "Smith Heating",
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
    jobId: "398",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "(555) 234-5678",
    company: "Williams Electric",
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
    jobId: "490",
    name: "Michael Brown",
    email: "mbrown@email.com",
    phone: "(555) 345-6789",
    company: "Brown Landscaping",
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
    jobId: "890",
    name: "Emma Davis",
    email: "emma.d@email.com",
    phone: "(555) 456-7890",
    company: "Davis Painting",
    address: "321 Elm St",
    city: "Naperville",
    state: "IL",
    zip: "60540",
    totalJobs: 3,
    totalSpent: 5600,
    status: "inactive",
    joinDate: "2023-11-05",
  },
]

/* ===================== COMPONENT ===================== */

export function Customers() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | CustomerStatus>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showFields, setShowFields] = useState(false)
  const [openCreateClient, setOpenCreateClient] = useState(false)

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    company: true,
    address: true,
    phone: true,
    created: true,
  })

  /* ===================== FILTER LOGIC ===================== */

  const filteredCustomers = customersData.filter(customer => {
    const search = searchTerm.toLowerCase().trim()
    const phone = customer.phone.replace(/\D/g, "")

    const matchesSearch =
      search === "" ||
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      phone.includes(search.replace(/\D/g, ""))

    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  /* ===================== SELECTION ===================== */

  const isAllSelected =
    filteredCustomers.length > 0 &&
    filteredCustomers.every(c => selectedIds.includes(c.id))

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : filteredCustomers.map(c => c.id))
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  /* ===================== UI ===================== */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-600">
            Manage your client database
          </p>
        </div>

        <button 
        onClick={() => setOpenCreateClient(true)}
        className="flex text-sm items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold">
          <Plus size={18} />
          Add client
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Clients" value={customersData.length} />
        <StatCard
          label="Total Due"
          value={`$${customersData.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}`}
        />
        <StatCard
          label="Past Due"
          value={`$${(customersData.reduce((s, c) => s + c.totalSpent, 0) * 0.1).toFixed(2)}`}
          danger
        />
        <StatCard label="Estimates Pending" value="466" />
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex  gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          className="w-full md:w-96 px-4 py-2.5 border rounded-lg text-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2.5 max-w-[200px] border   focus:border-primary rounded-lg text-sm outline-none"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* FIELDS */}
        <div className="relative">
          <button
            onClick={() => setShowFields(!showFields)}
            className="px-4 py-2.5 border border-primary rounded-lg text-sm flex items-center gap-2"
          >
            <Filter size={16} />
            Fields
          </button>

          {showFields && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-3 z-20 w-48">
              {Object.keys(visibleColumns).map(key => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm mb-2"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                    onChange={() =>
                      setVisibleColumns(prev => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof prev],
                      }))
                    }
                    className={`${selectedIds ? " accent-primary" : ""}`}
                  />
                  {key.toUpperCase()}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className={`${selectedIds ? " accent-primary" : ""}`}
                />
              </th>

              {visibleColumns.id && <th className="px-4 py-3 text-left">Client ID</th>}
              {visibleColumns.name && <th className="px-4 py-3 text-left">Name</th>}
              {visibleColumns.company && <th className="px-4 py-3 text-left">Company</th>}
              {visibleColumns.address && <th className="px-4 py-3 text-left">Address</th>}
              {visibleColumns.phone && <th className="px-4 py-3 text-left">Phone</th>}
              {visibleColumns.created && <th className="px-4 py-3 text-left">Created</th>}
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(customer.id)}
                    onChange={() => toggleSelect(customer.id)}
                    className={`${selectedIds ? " accent-primary" : ""}`}
                  />
                </td>

                {visibleColumns.id && 
                (
                  <td className="px-4 py-3">
                    <button
                        onClick={() => navigate(`/client/${customer.id}`)}
                        className="flex flex-col text-left text-primary border-none hover:text-blue-600 "
                      >
                        <div className="font-semibold text-nowrap">{customer.id}</div>
                       
                      </button>
                  </td>
                )
                
                }
                {visibleColumns.name && (
                <td className="px-4 py-3">
                    <button
                        onClick={() => navigate(`/client/${customer.id}`)}
                        className="flex flex-col text-left text-primary border-none hover:text-blue-600 "
                      >
                        <div className="font-semibold text-nowrap">{customer.name}</div>
                        <div className="text-xs text-gray-500 text-nowrap">{customer.email}</div>
                      </button>
                </td>
                )}
                {visibleColumns.company && <td className="px-4 py-3">{customer.company || "-"}</td>}
                {visibleColumns.address && (
                  <td className="px-4 py-3">
                    {customer.address}, {customer.city}
                  </td>
                )}
                {visibleColumns.phone && (
                  <td className="px-4 py-3 text-primary">{customer.phone}</td>
                )}
                {visibleColumns.created && (
                  <td className="px-4 py-3">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No customers found
          </div>
        )}
      </div>

      <CreateClientModal
  isOpen={openCreateClient}
  onClose={() => setOpenCreateClient(false)}
  onSave={(data) => {
    console.log("CLIENT DATA", data)
    setOpenCreateClient(false)
  }}
/>
    </div>
  )
}

/* ===================== STAT CARD ===================== */

function StatCard({
  label,
  value,
  danger = false,
}: {
  label: string
  value: string | number
  danger?: boolean
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${danger ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  )
}
