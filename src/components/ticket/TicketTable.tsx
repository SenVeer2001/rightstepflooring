// components/ticket/TicketTable.tsx
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RefreshCcw,
  Flag,
  ChevronDown
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import type { Ticket, TicketStatus, TicketPriority } from "../../data/ticketData";
import { useNavigate } from "react-router-dom";

interface TicketTableProps {
  tickets: Ticket[];
  onStatusChange: (ticketId: number, newStatus: TicketStatus) => void;
  onPriorityChange: (ticketId: number, newPriority: TicketPriority) => void;
  onDelete: (ticketId: number) => void;
}

// Status options for dropdown
const STATUS_OPTIONS: TicketStatus[] = ["Open", "In Progress", "Resolved", "Closed", "On Hold"];
const PRIORITY_OPTIONS: TicketPriority[] = ["Low", "Normal", "High", "Urgent"];

// Status colors matching pie chart
const STATUS_COLORS: Record<TicketStatus, string> = {
  "Open": "#4D2FB2",
  "In Progress": "#FDE68A",
  "Resolved": "#48A111",
  "Closed": "#E2E8F0",
  "On Hold": "#f5a962",
};

// Priority colors matching pie chart
const PRIORITY_COLORS: Record<TicketPriority, string> = {
  "Low": "#BBF7D0",
  "Normal": "#0C7779",
  "High": "#C8AAAA",
  "Urgent": "#F5E7C6",
};

// Status badge styles with chart colors
const statusStyles: Record<TicketStatus, { bg: string; text: string; border: string }> = {
  "Open": {
    bg: "#EDE9FE",
    text: "#4D2FB2",
    border: "#4D2FB2"
  },
  "In Progress": {
    bg: "#FEF9E7",
    text: "#92400E",
    border: "#FDE68A"
  },
  "Resolved": {
    bg: "#DCFCE7",
    text: "#48A111",
    border: "#48A111"
  },
  "Closed": {
    bg: "#F1F5F9",
    text: "#64748B",
    border: "#E2E8F0"
  },
  "On Hold": {
    bg: "#FFF4E6",
    text: "#C2410C",
    border: "#f5a962"
  },
};

// Priority badge styles with chart colors
const priorityStyles: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  "Low": {
    bg: "#F0FDF4",
    text: "#166534",
    border: "#BBF7D0"
  },
  "Normal": {
    bg: "#E6F7F7",
    text: "#0C7779",
    border: "#0C7779"
  },
  "High": {
    bg: "#FDF2F2",
    text: "#7F1D1D",
    border: "#C8AAAA"
  },
  "Urgent": {
    bg: "#FFFBEB",
    text: "#92400E",
    border: "#F5E7C6"
  },
};

// Dropdown type
type ActiveDropdown = "status" | "priority" | null;

// ==================== IMAGE CAROUSEL COMPONENT ====================
interface ImageCarouselProps {
  files: string[];
}

const ImageCarousel = ({ files }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (files.length === 0) {
    return <span className="text-xs text-gray-400">No files</span>;
  }

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {files.length > 1 && (
          <button
            onClick={goPrev}
            className="p-1 rounded-full hover:bg-gray-200 transition flex-shrink-0"
            title="Previous"
          >
            <ChevronLeft size={14} className="text-gray-600" />
          </button>
        )}

        <div
          className="relative cursor-pointer group"
          onClick={openModal}
        >
          <img
            src={files[currentIndex]}
            alt={`File ${currentIndex + 1}`}
            className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 group-hover:border-primary transition"
          />
          <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <Eye size={14} className="text-white" />
          </div>
          {files.length > 1 && (
            <span className="absolute -bottom-1 -right-1 bg-gray-800 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
              {currentIndex + 1}/{files.length}
            </span>
          )}
        </div>

        {files.length > 1 && (
          <button
            onClick={goNext}
            className="p-1 rounded-full hover:bg-gray-200 transition flex-shrink-0"
            title="Next"
          >
            <ChevronRight size={14} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">
                TID-1001 | WO ID-001 | 	Johnson Residence
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="relative flex items-center justify-center p-4 bg-gray-50 min-h-[400px]">
              {files.length > 1 && (
                <button
                  onClick={goPrev}
                  className="absolute left-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition z-10"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>
              )}

              <img
                src={files[currentIndex]}
                alt={`File ${currentIndex + 1}`}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />

              {files.length > 1 && (
                <button
                  onClick={goNext}
                  className="absolute right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition z-10"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>
              )}
            </div>

            {files.length > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t overflow-x-auto">
                {files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${idx === currentIndex
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <img
                      src={file}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ==================== MAIN TABLE COMPONENT ====================
export default function TicketTable({
  tickets,
  onStatusChange,
  onPriorityChange,
  onDelete
}: TicketTableProps) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | TicketStatus>("all");
  const [selectedPriority, setSelectedPriority] = useState<"all" | TicketPriority>("all");
  const [selectedTickets, setSelectedTickets] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Refs for dropdowns
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  // Check if any tickets are selected
  const hasSelection = selectedTickets.size > 0;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.customer.toLowerCase().includes(search.toLowerCase()) ||
      ticket.jobProject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.details.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toString().includes(search);

    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || ticket.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + rowsPerPage);

  // Select handlers
  const toggleSelect = (id: number) => {
    setSelectedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedTickets.size === paginatedTickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(paginatedTickets.map(t => t.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedTickets(new Set());
  };

  // Bulk action handlers
  const handleBulkStatusChange = (newStatus: TicketStatus) => {
    selectedTickets.forEach(id => {
      onStatusChange(id, newStatus);
    });
    setSelectedTickets(new Set());
    setActiveDropdown(null);
  };

  const handleBulkPriorityChange = (newPriority: TicketPriority) => {
    selectedTickets.forEach(id => {
      onPriorityChange(id, newPriority);
    });
    setSelectedTickets(new Set());
    setActiveDropdown(null);
  };

  const handleViewOrder = (workOrderId: string) => {
    navigate(`/work-order/${workOrderId}`)
  }

  // Status filter tabs
  const statusTabs: { id: "all" | TicketStatus; label: string; color: string }[] = [
    { id: "all", label: "All", color: "#6B7280" },
    { id: "Open", label: "Open", color: STATUS_COLORS["Open"] },
    { id: "In Progress", label: "In Progress", color: STATUS_COLORS["In Progress"] },
    { id: "Resolved", label: "Resolved", color: STATUS_COLORS["Resolved"] },
    { id: "On Hold", label: "On Hold", color: STATUS_COLORS["On Hold"] },
    { id: "Closed", label: "Closed", color: STATUS_COLORS["Closed"] },
  ];

  return (
    <div className="space-y-4">

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusTabs.map(tab => {
          const count = tab.id === "all"
            ? tickets.length
            : tickets.filter(t => t.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedStatus(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${selectedStatus === tab.id
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}

            >

              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${selectedStatus === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-600"
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-3 w-full md:w-auto items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[300px]">
            {/* <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search by ID, customer, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as "all" | TicketPriority)}
            className="px-4 py-2.5 border max-w-[200px] border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">All Priority</option>
            {PRIORITY_OPTIONS.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">

          {hasSelection && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
              <span className="text-sm font-medium text-primary">
                {selectedTickets.size} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="p-0.5 hover:bg-primary/20 rounded"
              >
                <X size={14} className="text-primary" />
              </button>
            </div>
          )}

          {/* Action Icons Container */}
          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">

            {/* Change Status Button */}
            <div className="relative" ref={statusDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Change Status"
                  className={`p-2 rounded transition-colors ${activeDropdown === "status"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                    }`}
                >
                  <RefreshCcw size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select tickets to change status"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <RefreshCcw size={20} />
                </button>
              )}

              {/* Status Dropdown */}
              {activeDropdown === "status" && hasSelection && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-72 overflow-y-auto">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Change Status</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Apply to {selectedTickets.size} ticket{selectedTickets.size > 1 ? 's' : ''}
                    </p>
                  </div>
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleBulkStatusChange(status)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[status] }}
                      />
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: statusStyles[status].bg,
                          color: statusStyles[status].text,
                        }}
                      >
                        {status}
                      </span>
                      <Check size={14} className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Change Priority Button */}
            <div className="relative" ref={priorityDropdownRef}>
              {hasSelection ? (
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "priority" ? null : "priority")}
                  data-tooltip-id="quick-actions-tooltip"
                  data-tooltip-content="Change Priority"
                  className={`p-2 rounded transition-colors ${activeDropdown === "priority"
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white text-gray-700"
                    }`}
                >
                  <Flag size={20} />
                </button>
              ) : (
                <button
                  data-tooltip-id="disabled-tooltip"
                  data-tooltip-content="Select tickets to change priority"
                  className="p-2 rounded text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <Flag size={20} />
                </button>
              )}

              {/* Priority Dropdown */}
              {activeDropdown === "priority" && hasSelection && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 py-2 max-h-72 overflow-y-auto">
                  <div className="px-3 py-2 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Change Priority</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Apply to {selectedTickets.size} ticket{selectedTickets.size > 1 ? 's' : ''}
                    </p>
                  </div>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => handleBulkPriorityChange(priority)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PRIORITY_COLORS[priority] }}
                      />
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: priorityStyles[priority].bg,
                          color: priorityStyles[priority].text,
                        }}
                      >
                        {priority}
                      </span>
                      <Check size={14} className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedTickets.size === paginatedTickets.length && paginatedTickets.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Ticket ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Job/Project</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">WO ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Sub Contractor</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Co-Assign (Staff)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Priority</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Files</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTickets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-gray-400">
                    No tickets found
                  </td>
                </tr>
              ) : (
                paginatedTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className={`border-t hover:bg-primary/10 transition ${selectedTickets.has(ticket.id) ? "bg-blue-50" : ""
                      }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTickets.has(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Ticket ID & Date */}
                    <td className="px-4 py-4 min-w-[120px]">
                      <button  className="cursor-pointer"  onClick={() => navigate(`/support/manage-ticket/${ticket.id}`)}>
                        <p className="font-bold text-primary hover:underline">TID-{ticket.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5 hover:underline">{ticket.date}</p>
                      </button>
                    </td>

                   

                    {/* Customer */}
                    <td className="px-4 py-4 min-w-[100px]">
                      <div>
                        <span className="font-medium text-nowrap text-gray-900">{ticket.customer}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{ticket.address}</p>
                      </div>

                    </td>

                    {/* Job/Project */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{ticket.jobProject}</p>
                    </td>


                     <td className="px-4 py-4 min-w-[120px]">
                      <button className="cursor-pointer hover:text-primary hover:underline " onClick={() => { handleViewOrder(ticket.woId) }}>
                        <p className="font-bold text-primary">WO-{ticket.woId}</p>

                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-nowrap">{ticket.category}</p>
                        <p className="text-xs text-gray-500">{ticket.subCategory}</p>
                      </div>
                    </td>

                    {/* Sub Contractor */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-nowrap text-gray-700">{ticket.subContractor}</span>
                    </td>

                    {/* Co-Assign (Staff) */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-nowrap text-gray-700">{ticket.coAssign}</span>
                    </td>

                    {/* Priority - Editable Dropdown */}
                    <td className="px-4 py-4 min-w-[130px]">
                      <select
                        value={ticket.priority}
                        onChange={(e) => onPriorityChange(ticket.id, e.target.value as TicketPriority)}
                        style={{
                          backgroundColor: priorityStyles[ticket.priority].bg,
                          color: priorityStyles[ticket.priority].text,
                          borderColor: priorityStyles[ticket.priority].border,
                        }}
                        className="px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none"
                      >
                        {PRIORITY_OPTIONS.map(priority => (
                          <option
                            key={priority}
                            value={priority}
                          >
                            {priority}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status - Editable */}
                    <td className="px-4 py-4 min-w-[140px]">
                      <select
                        value={ticket.status}
                        onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
                        style={{
                          backgroundColor: statusStyles[ticket.status].bg,
                          color: statusStyles[ticket.status].text,
                          borderColor: statusStyles[ticket.status].border,
                        }}
                        className="px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer outline-none"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Files - Carousel */}
                    <td className="px-4 py-4 min-w-[150px]">
                      <ImageCarousel files={ticket.files} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/support/manage-ticket/${ticket.id}`)}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Details"
                          className="p-1.5 rounded hover:bg-primary/10 text-primary"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(ticket.id)}
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Delete Ticket"
                          className="p-1.5 rounded hover:bg-red-100 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTickets.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + rowsPerPage, filteredTickets.length)}</strong> of <strong>{filteredTickets.length}</strong>
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
        id="disabled-tooltip"
        place="top"
        className="!bg-red-600 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  );
}