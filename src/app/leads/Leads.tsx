import { useState } from "react"
import { Search, Plus, Download, LayoutGrid, List } from "lucide-react"
import { LeadModal, LEAD_STATUS_LABELS } from "../../components/LeadModal"
import type { LeadStatus } from "../../components/LeadModal"
import { KanbanView } from './KanbanView'
import { Eye, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { mockLeadsData } from '../../services/mockLeadData'


/* ===================== TYPES ===================== */

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  service?: string
  budget?: number
  createdAt?: string
  status: LeadStatus
  source: string
  type: string
  tags?: string[]
  requirement?: string
  createdDate: string
}

// @ts-ignore
const leadsData: Lead[] = Array.isArray(mockLeadsData)
  ? mockLeadsData.map(lead => ({
    ...lead,
    address: lead.address || '',
    city: lead.city || '',
    state: lead.state || '',
    createdDate: lead.createdAt,
  }))
  : []




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
  const [leads, setLeads] = useState<Lead[]>(leadsData ?? [])

  const [searchText, setSearchText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | LeadStatus>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [currentPage, setCurrentPage] = useState(1)
const rowsPerPage = 10 // change if needed

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

  const totalRows = filteredLeads.length
const totalPages = Math.ceil(totalRows / rowsPerPage)

const startIndex = (currentPage - 1) * rowsPerPage
const endIndex = startIndex + rowsPerPage

const paginatedLeads = filteredLeads.slice(startIndex, endIndex)


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

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(previousLeads =>
      previousLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    )
  }

  const handleSelectLead = (leadId: string) => {
    const newSelected = new Set(selectedLeads)
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId)
    } else {
      newSelected.add(leadId)
    }
    setSelectedLeads(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)))
    }
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
          <h1 className="text-3xl font-bold text-black">{viewMode == "table" ? "Leads" : "Lead Pipeline"}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode == "table" ? "Manage sales leads and prospects" : "Drag and drop leads between columns to update their status"}
          </p>
        </div>

        <div className="flex gap-8">

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-1 bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-2 rounded transition-colors ${viewMode === 'table'
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-gray-100'
                  }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                title="Kanban View"
                className={`p-2 rounded transition-colors ${viewMode === 'kanban'
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-gray-100'
                  }`}
              >
                <LayoutGrid size={20} />
              </button>
            </div>


          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {viewMode === 'table' && (
        <>
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
        </>

      )}


      {viewMode === 'kanban' && (
        <KanbanView
           // @ts-ignore
          leads={Array.isArray(leads) ? leads : []}
          // @ts-ignore
          onLeadsUpdate={(updatedLeads: Lead[]) =>
            setLeads(Array.isArray(updatedLeads) ? updatedLeads : [])
          }
        />

      )}

      {/* Table */}

      {viewMode === 'table' && (

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap w-12">
                    <input
                      type="checkbox"
                      checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAll}
                      className="w-3 h-3 rounded border-gray-300 cursor-pointer accent-primary"
                    />
                  </th>
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
                {paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-t hover:bg-gray-50 ${selectedLeads.has(lead.id) ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-3 h-3 rounded border-gray-300 cursor-pointer accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold">{lead.id}</td>

                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer border-primary outline-none`}
                      >
                        {Object.entries(LEAD_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                          <option key={statusKey} value={statusKey}>
                            {statusLabel}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {(lead.tags ?? []).map(tag => (
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

          {filteredLeads.length > 0 && (
  <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
    
    {/* Left: info */}
    <p className="text-sm text-gray-600">
      Showing{" "}
      <span className="font-semibold">{startIndex + 1}</span>
      {" - "}
      <span className="font-semibold">
        {Math.min(endIndex, totalRows)}
      </span>
      {" of "}
      <span className="font-semibold">{totalRows}</span>
    </p>

    {/* Right: controls */}
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm rounded border disabled:opacity-50"
      >
        First
      </button>

      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm rounded border disabled:opacity-50"
      >
        Prev
      </button>

      <span className="px-3 py-1.5 text-sm font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm rounded border disabled:opacity-50"
      >
        Next
      </button>

      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm rounded border disabled:opacity-50"
      >
        Last
      </button>
    </div>
  </div>
)}

        </div>

      )}


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
