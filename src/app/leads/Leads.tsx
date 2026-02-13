// Leads.tsx
import { useState, useRef, useEffect } from "react"
import { Search, Plus, Download, LayoutGrid, List, Eye, Trash2, RefreshCcw, Tag, UserCog, CalendarClock, X, Check } from "lucide-react"
import { LeadModal, LEAD_STATUS_LABELS } from "../../components/LeadModal"
import type { LeadStatus } from "../../components/LeadModal"
import { useNavigate } from "react-router-dom"
import { mockLeadsData } from '../../services/mockLeadData'
import { LeadKanbanBoard } from "../../components/kanban/leadKanban/LeadKanbanView"
import type { Lead } from "../../types/lead"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

/* ===================== TYPES ===================== */

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

/* ===================== AVAILABLE TAGS WITH COLORS ===================== */
const availableTags = [
  { id: "hot", label: "Hot Lead", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "warm", label: "Warm Lead", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "cold", label: "Cold Lead", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { id: "priority", label: "Priority", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "follow-up", label: "Follow Up", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "vip", label: "VIP", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "new-customer", label: "New Customer", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "returning", label: "Returning", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { id: "urgent", label: "Urgent", color: "bg-rose-100 text-rose-700 border-rose-200" },
  { id: "pending", label: "Pending", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "callback", label: "Callback", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { id: "qualified", label: "Qualified", color: "bg-green-100 text-green-700 border-green-200" },
]

/* ===================== TAG COLOR MAPPING ===================== */
const tagColorMap: Record<string, string> = {
  "Hot Lead": "bg-red-100 text-red-700 border border-red-200",
  "Warm Lead": "bg-orange-100 text-orange-700 border border-orange-200",
  "Cold Lead": "bg-cyan-100 text-cyan-700 border border-cyan-200",
  "Priority": "bg-purple-100 text-purple-700 border border-purple-200",
  "Follow Up": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "VIP": "bg-amber-100 text-amber-700 border border-amber-200",
  "New Customer": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Returning": "bg-teal-100 text-teal-700 border border-teal-200",
  "Urgent": "bg-rose-100 text-rose-700 border border-rose-200",
  "Pending": "bg-slate-100 text-slate-700 border border-slate-200",
  "Callback": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Qualified": "bg-green-100 text-green-700 border border-green-200",
}

// Function to get tag color - returns default if not found
const getTagColor = (tagLabel: string): string => {
  return tagColorMap[tagLabel] || "bg-blue-100 text-blue-700 border border-blue-200"
}

/* ===================== STATUS STYLES ===================== */

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-300",
  attempting_to_contact: "bg-yellow-100 text-yellow-800 border-yellow-300",
  initial_contact_made: "bg-indigo-100 text-indigo-800 border-indigo-300",
  qualifying: "bg-green-100 text-green-800 border-green-300",
  scheduling_visit: "bg-purple-100 text-purple-800 border-purple-300",
  scheduled: "bg-emerald-100 text-emerald-800 border-emerald-300",
  delayed: "bg-red-100 text-red-800 border-red-300",
  contacted: "bg-green-100 text-green-800 border-green-300",
  qualified: "bg-purple-100 text-purple-800 border-purple-300",
  "proposal-sent": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "follow-up": "bg-amber-100 text-amber-800 border-amber-300",
  "closed-won": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "closed-lost": "bg-gray-100 text-gray-800 border-gray-300",
}

/* ===================== DROPDOWN TYPES ===================== */
type ActiveDropdown = "status" | "tags" | null

/* ===================== COMPONENT ===================== */

export function Leads() {
  const [leads, setLeads] = useState<Lead[]>(leadsData ?? [])
  const [searchText, setSearchText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | LeadStatus>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const tagsDropdownRef = useRef<HTMLDivElement>(null)

  const navigateTo = useNavigate()

  // Check if any leads are selected
  const hasSelection = selectedLeads.size > 0

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current && 
        !statusDropdownRef.current.contains(event.target as Node) &&
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ===================== FILTER ===================== */

  const filteredLeads = leads.filter((lead) => {
    const search = searchText.toLowerCase().trim()

    const matchesSearch =
      lead.name.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.phone.replace(/\s/g, "").includes(search.replace(/\s/g, "")) ||
      lead.city.toLowerCase().includes(search) ||
      lead.type?.toLowerCase().includes(search) || ""

    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const totalRows = filteredLeads.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage

  const paginatedLeads = filteredLeads.slice(startIndex, endIndex)

  /* ===================== HANDLERS ===================== */

  const handleCreateLead = (formData: any) => {
    const newLead: Lead = {
      id: String(leads.length + 1),
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

  /* ===================== BULK ACTIONS ===================== */

  // Bulk status change
  const handleBulkStatusChange = (newStatus: LeadStatus) => {
    setLeads(previousLeads =>
      previousLeads.map(lead =>
        selectedLeads.has(lead.id) ? { ...lead, status: newStatus } : lead
      )
    )
    setActiveDropdown(null)
  }

  // Bulk add tag
  const handleBulkAddTag = (tagLabel: string) => {
    setLeads(previousLeads =>
      previousLeads.map(lead => {
        if (selectedLeads.has(lead.id)) {
          const currentTags = lead.tags || []
          if (!currentTags.includes(tagLabel)) {
            return { ...lead, tags: [...currentTags, tagLabel] }
          }
        }
        return lead
      })
    )
    setActiveDropdown(null)
  }

  // Bulk remove tag
  const handleBulkRemoveTag = (tagLabel: string) => {
    setLeads(previousLeads =>
      previousLeads.map(lead => {
        if (selectedLeads.has(lead.id)) {
          const currentTags = lead.tags || []
          return { ...lead, tags: currentTags.filter(t => t !== tagLabel) }
        }
        return lead
      })
    )
  }

  // Clear selection
  const handleClearSelection = () => {
    setSelectedLeads(new Set())
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

  // Get selected leads' common tags
  const getSelectedLeadsTags = () => {
    const selectedLeadsList = leads.filter(lead => selectedLeads.has(lead.id))
    const allTags = selectedLeadsList.flatMap(lead => lead.tags || [])
    return [...new Set(allTags)]
  }

  return (
    <div className="p-4 space-y-6 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {viewMode == "table" ? "Leads" : "Lead Pipeline"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {viewMode == "table" 
              ? "Manage sales leads and prospects" 
              : "Drag and drop leads between columns to update their status"
            }
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex gap-1 bg-white rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('table')}
                data-tooltip-id="view-tooltip"
                data-tooltip-content="Table View"
                className={`p-2 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-gray-100'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                data-tooltip-id="view-tooltip"
                data-tooltip-content="Kanban View"
                className={`p-2 rounded transition-colors ${
                  viewMode === 'kanban'
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
          {/* Status Tabs */}
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
            <div className="relative flex-1 min-w-[400px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search name, email, phone, city or service..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {hasSelection && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
                  <span className="text-sm font-medium text-primary">
                    {selectedLeads.size} selected
                  </span>
                  <button
                    onClick={handleClearSelection}
                    className="p-0.5 hover:bg-primary/20 rounded"
                  >
                    <X size={14} className="text-primary" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
                {/* Change Status Button */}
                <div className="relative" ref={statusDropdownRef}>
                  {hasSelection ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
                      className={`p-2 rounded transition-colors ${
                        activeDropdown === "status" 
                          ? "bg-primary text-white" 
                          : "hover:bg-primary hover:text-white text-gray-700"
                      }`}
                    >
                      <RefreshCcw size={20} />
                    </button>
                  ) : (
                    <button
                      data-tooltip-id="disabled-tooltip"
                      data-tooltip-content="Select leads to change status"
                      className="p-2 rounded text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      <RefreshCcw size={20} />
                    </button>
                  )}

                  {/* Status Dropdown */}
                  {activeDropdown === "status" && hasSelection && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-72 overflow-y-auto">
                      <div className="px-3 py-2 border-b">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Change Status</p>
                      </div>
                      {Object.entries(LEAD_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                        <button
                          key={statusKey}
                          onClick={() => handleBulkStatusChange(statusKey as LeadStatus)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[statusKey as LeadStatus]}`}>
                            {statusLabel}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modify Tags Button */}
                <div className="relative" ref={tagsDropdownRef}>
                  {hasSelection ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === "tags" ? null : "tags")}
                      className={`p-2 rounded transition-colors ${
                        activeDropdown === "tags" 
                          ? "bg-primary text-white" 
                          : "hover:bg-primary hover:text-white text-gray-700"
                      }`}
                    >
                      <Tag size={20} />
                    </button>
                  ) : (
                    <button
                      data-tooltip-id="disabled-tooltip"
                      data-tooltip-content="Select leads to modify tags"
                      className="p-2 rounded text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      <Tag size={20} />
                    </button>
                  )}

                  {/* Tags Dropdown */}
                  {activeDropdown === "tags" && hasSelection && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-80 overflow-y-auto">
                      <div className="px-3 py-2 border-b">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Add Tags</p>
                      </div>
                      
                      {availableTags.map((tag) => {
                        const selectedTags = getSelectedLeadsTags()
                        const isApplied = selectedTags.includes(tag.label)
                        
                        return (
                          <button
                            key={tag.id}
                            onClick={() => isApplied ? handleBulkRemoveTag(tag.label) : handleBulkAddTag(tag.label)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between gap-2"
                          >
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${tag.color}`}>
                              {tag.label}
                            </span>
                            {isApplied && (
                              <Check size={16} className="text-green-600" />
                            )}
                          </button>
                        )
                      })}

                      {/* Current tags on selected leads */}
                      {getSelectedLeadsTags().length > 0 && (
                        <>
                          <div className="px-3 py-2 border-t border-b mt-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Current Tags</p>
                          </div>
                          <div className="px-3 py-2 flex flex-wrap gap-1">
                            {getSelectedLeadsTags().map(tag => (
                              <span
                                key={tag}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${getTagColor(tag)}`}
                              >
                                {tag}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleBulkRemoveTag(tag)
                                  }}
                                  className="hover:opacity-70"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Reassign Job */}
                {hasSelection ? (
                  <button
                    data-tooltip-id="quick-actions-tooltip"
                    data-tooltip-content="Reassign Job"
                    className="p-2 rounded hover:bg-primary hover:text-white text-gray-700"
                  >
                    <UserCog size={20} />
                  </button>
                ) : (
                  <button
                    data-tooltip-id="disabled-tooltip"
                    data-tooltip-content="Select leads to reassign"
                    className="p-2 rounded text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <UserCog size={20} />
                  </button>
                )}

                {/* Reschedule Job */}
                {hasSelection ? (
                  <button
                    data-tooltip-id="quick-actions-tooltip"
                    data-tooltip-content="Reschedule Job"
                    className="p-2 rounded hover:bg-primary hover:text-white text-gray-700"
                  >
                    <CalendarClock size={20} />
                  </button>
                ) : (
                  <button
                    data-tooltip-id="disabled-tooltip"
                    data-tooltip-content="Select leads to reschedule"
                    className="p-2 rounded text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <CalendarClock size={20} />
                  </button>
                )}
              </div>

              <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
        </>
      )}

      {viewMode === "kanban" && (
        <LeadKanbanBoard
          leads={leads}
          onLeadsUpdate={setLeads}
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
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
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
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold">{lead.id}</td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none ${statusStyles[lead.status]}`}
                      >
                        {Object.entries(LEAD_STATUS_LABELS).map(([statusKey, statusLabel]) => (
                          <option key={statusKey} value={statusKey}>
                            {statusLabel}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    {/* Tags Column with Colors */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(lead.tags ?? []).length > 0 ? (
                          (lead.tags ?? []).map(tag => (
                            <span
                              key={tag}
                              className={`px-2 py-0.5 text-xs font-medium rounded ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs italic">No tags</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3">{lead.source}</td>
                    <td className="px-4 py-3 font-semibold">{lead.name}</td>
                    <td className="px-4 py-3">
                      {lead.city}, {lead.state}
                    </td>
                    <td className="px-4 py-3">
                      {lead.type}
                    </td>
                    <td className="px-4 py-3">{lead.phone}</td>
                    <td className="px-4 py-3">{lead.createdDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewLead(lead.id)}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Lead"
                          className="p-1.5 rounded hover:bg-primary/10 text-primary"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Delete Lead"
                          className="p-1.5 rounded hover:bg-red-100 text-red-600"
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

          {/* Pagination */}
          {filteredLeads.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
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
      />

      {/* Tooltips */}
      <Tooltip 
        id="quick-actions-tooltip" 
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip 
        id="action-tooltip" 
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip 
        id="view-tooltip" 
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
      <Tooltip 
        id="disabled-tooltip" 
        place="top"
        className="!bg-red-600 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  )
}