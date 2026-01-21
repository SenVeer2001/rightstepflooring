import { useState } from "react"
import { Search, Plus, Download } from "lucide-react"
import { LeadModal, LEAD_STATUS_LABELS } from "../../components/LeadModal"
import type { LeadStatus } from "../../components/LeadModal"
import { Eye, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"


/* ===================== TYPES ===================== */

interface Lead {
  id: string
  name: string
  email: string
  phone: string

  address: string
  city: string
  state: string

  status: LeadStatus
  source: string
  type: string
  tags: string[]

  createdDate: string
}

/* ===================== MOCK DATA ===================== */
const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Robert Johnson",
    email: "robert.j@email.com",
    phone: "(555) 111-2222",
    address: "123 Oak Street",
    city: "Springfield",
    state: "IL",
    status: "qualifying",
    source: "Google",
    type: "Flooring",
    tags: ["Hot"],
    createdDate: "2026-01-08",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    phone: "(555) 222-3333",
    address: "456 Elm Avenue",
    city: "Chicago",
    state: "IL",
    status: "attempting_to_contact",
    source: "Facebook",
    type: "Carpet",
    tags: ["Follow-up"],
    createdDate: "2026-01-09",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "mbrown@email.com",
    phone: "(555) 333-4444",
    address: "789 Pine Road",
    city: "Aurora",
    state: "IL",
    status: "initial_contact_made",
    source: "Website",
    type: "Tile",
    tags: ["Warm"],
    createdDate: "2026-01-10",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.d@email.com",
    phone: "(555) 444-5555",
    address: "321 Maple Drive",
    city: "Naperville",
    state: "IL",
    status: "scheduling_visit",
    source: "Referral",
    type: "Vinyl",
    tags: ["High Value"],
    createdDate: "2026-01-06",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "jwilson@email.com",
    phone: "(555) 555-6666",
    address: "654 Cedar Lane",
    city: "Evanston",
    state: "IL",
    status: "scheduled",
    source: "Phone Call",
    type: "Wood",
    tags: ["Confirmed"],
    createdDate: "2026-01-05",
  },
]


/* ===================== STATUS STYLES ===================== */

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  attempting_to_contact: "bg-yellow-100 text-yellow-800",
  initial_contact_made: "bg-indigo-100 text-indigo-800",
  qualifying: "bg-green-100 text-green-800",
  scheduling_visit: "bg-purple-100 text-purple-800",
  scheduled: "bg-emerald-100 text-emerald-800",
  delayed: "bg-red-100 text-red-800",
}

/* ===================== COMPONENT ===================== */

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchText, setSearchText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | LeadStatus>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigateTo = useNavigate()


  /* ===================== FILTER ===================== */

  const filteredLeads = leads.filter((lead) => {
    const search = searchText.toLowerCase().trim()

    const matchesSearch =
      lead.name.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.phone.replace(/\s/g, "").includes(search.replace(/\s/g, "")) ||
      lead.city.toLowerCase().includes(search) ||
      lead.type.toLowerCase().includes(search)

    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  /* ===================== CREATE ===================== */

  const handleCreateLead = (formData: any) => {
  const newLead: Lead = {
    id: String(leads.length + 1),

    // 🔹 map correctly
    name: formData.clientName,
    email: formData.email,
    phone: formData.phone,

    address: formData.address,
    city: formData.city,
    state: formData.state,

    status: formData.status,
    source: formData.jobSource || "Manual",
    type: formData.jobType || "Other",

    tags: formData.tags || [],

    createdDate: new Date().toISOString().split("T")[0],
  }

  setLeads(previousLeads => [newLead, ...previousLeads])
  setIsModalOpen(false)
}


  const handleViewLead = (leadId: string) => {
    navigateTo(`/leads/${leadId}`)
  }

  const handleDeleteLead = (leadId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this lead?")
    if (!confirmed) return

    setLeads(previousLeads =>
      previousLeads.filter(lead => lead.id !== leadId)
    )
  }



  const leadStatusTabs = [
    { id: "all", label: "All" },
    ...Object.entries(LEAD_STATUS_LABELS).map(([statusKey, statusLabel]) => ({
      id: statusKey,
      label: statusLabel,
    })),
  ]

  const leadStatusCounts: Record<string, number> = {
    all: leads.length,
    ...leads.reduce<Record<string, number>>((accumulator, lead) => {
      accumulator[lead.status] = (accumulator[lead.status] || 0) + 1
      return accumulator
    }, {}),
  }



  return (
    <div className="p-4 space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Leads</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage sales leads and prospects
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold"
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>


      <div className="flex gap-3 overflow-x-auto pb-2 thin-scrollbar">
        {leadStatusTabs.map((tab) => {
          const isActive = selectedStatus === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id as any)}
              className={`
          flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
          whitespace-nowrap transition
          ${isActive
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }
        `}
            >
              {tab.label}
              <span
                className={`
            text-xs px-2 py-0.5 rounded-full
            ${isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                  }
          `}
              >
                {leadStatusCounts[tab.id] || 0}
              </span>
            </button>
          )
        })}
      </div>


      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 min-w-[900px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search name, email, phone, city or service..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
        </div>

        {/* <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-2 border text-sm border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select> */}
         <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg
      text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
        <Download size={16} /> export
    </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {["ID", "Status", "Tags", "Source", "Client", "Location", "Type", "Phone", "Created", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-semibold">{lead.id}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[lead.status]}`}
                    >
                      {LEAD_STATUS_LABELS[lead.status]}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {lead.tags.map(tag => (
                      <span
                        key={tag}
                        className="mr-1 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>

                  <td className="px-4 py-3">{lead.source}</td>
                  <td className="px-4 py-3 font-semibold">{lead.name}</td>

                  <td className="px-4 py-3 table-cell">
                    {lead.city}, {lead.state}
                  </td>

                  <td className="px-4 py-3 table-cell">
                    {lead.type}
                  </td>

                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">{lead.createdDate}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* View */}
                      <button
                        onClick={() => handleViewLead(lead.id)}
                        className="p-1.5 rounded hover:bg-primary/10 text-primary"
                        title="View Lead"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1.5 rounded hover:bg-red-100 text-red-600"
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No leads found
          </div>
        )}
      </div>

      {/* Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLead}
        // title="Add New Lead"
      />
    </div>
  )
}
