import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, Plus, X } from 'lucide-react'
import Select from 'react-select'
import CustomerJobHeader from './CustomerJobHeader'
import CustomerJobTabs from './CustomerJobTabs'
import { DetailsTab } from './DetailsTab'
import { ItemsTab } from './ItemsTab'
import { PaymentsTab } from './PaymentsTab'
import { EstimatesTab } from './EstimatesTab'
import { AttachmentsTab } from './AttachmentsTab'
import { TasksTab } from './TasksTab'
import { EquipmentTab } from './EquipmentTab'
import EstimatesSection from '../leadsPages/EstimatesSection'
import { ClientPurchaseOrderTab } from './clientPages/tabs/ClientPurchaseOrderTab'
import { staticPurchaseOrders } from '../../types/vendor'
import WorkOrder from '../../app/work-order/WorkOrder'
import ClientWorkOrder from '../../app/work-order/ClientWorkOrder'


/* ===================== TYPES ===================== */

type CustomerJobTabKey = "details" | "items" | "payments" | "estimates" | "attachments" | "tasks" | "equipment" | "purchase" | "workOrder"

interface JobData {
  id: string
  jobNumber: string
  clientName: string
  companyName: string
  phone: string
  email?: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  service: string
  technician: string
  status: string
  totalPrice: number
  projectDescription: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
}

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  companyName?: string
}

interface TagOption {
  value: string
  label: string
}





// Mock jobs data - same as in Jobs.tsx
const MOCK_JOBS: JobData[] = [
  {
    id: "1",
    jobNumber: "480",
    clientName: "Robin Stevens",
    companyName: "Stevens Flooring",
    phone: "(413) 275-4790",
    address: "2225 Charlotte Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    service: "Tile Install",
    technician: "Mike Johnson",
    status: "submitted",
    totalPrice: 2578.95,
    projectDescription: "Install new tile flooring in bathroom",
    startDate: "2026-01-10",
    startTime: "10:00",
    endDate: "2026-01-10",
    endTime: "14:00",
  },
  {
    id: "2",
    jobNumber: "507",
    clientName: "Teresa Lafoon",
    companyName: "Lafoon Interiors",
    phone: "(919) 259-3932",
    address: "215 Granger Rd, Charlotte",
    city: "Charlotte",
    state: "NC",
    zip: "28202",
    country: "United States",
    service: "Carpet",
    technician: "Lisa Brown",
    status: "in-progress",
    totalPrice: 6598.45,
    projectDescription: "Install commercial carpet in office",
    startDate: "2026-01-09",
    startTime: "09:00",
    endDate: "2026-01-09",
    endTime: "11:00",
  },
  {
    id: "3",
    jobNumber: "506",
    clientName: "Kristopher Decker",
    companyName: "Decker Homes",
    phone: "(847) 989-1986",
    address: "109 Donna Pl, Cary",
    city: "Cary",
    state: "NC",
    zip: "27511",
    country: "United States",
    service: "Repair",
    technician: "Tom Davis",
    status: "pending",
    totalPrice: 1004.00,
    projectDescription: "Floor repair in master bedroom",
    startDate: "2026-01-12",
    startTime: "13:00",
    endDate: "2026-01-12",
    endTime: "17:00",
  },
  {
    id: "4",
    jobNumber: "505",
    clientName: "William Chase",
    companyName: "Chase Properties",
    phone: "(919) 302-0824",
    address: "7813 Nugget Lane, Raleigh",
    city: "Raleigh",
    state: "NC",
    zip: "27603",
    country: "United States",
    service: "Repair",
    technician: "Unassigned",
    status: "unscheduled",
    totalPrice: 0,
    projectDescription: "Floor repair in warehouse",
    startDate: "2026-01-08",
    startTime: "10:00",
    endDate: "2026-01-08",
    endTime: "15:00",
  },
  {
    id: "5",
    jobNumber: "508",
    clientName: "Monica Johnson",
    companyName: "Johnson Interiors",
    phone: "(984) 209-0465",
    address: "717 Obsidian Way, Durham",
    city: "Durham",
    state: "NC",
    zip: "27701",
    country: "United States",
    service: "Laminate & LVP Install",
    technician: "Mike Johnson",
    status: "in-progress",
    totalPrice: 3200.00,
    projectDescription: "Install laminate and LVP in living area",
    startDate: "2026-01-11",
    startTime: "08:30",
    endDate: "2026-01-11",
    endTime: "16:30",
  },
]

/* ===================== COMPONENT ===================== */

function CustomerAndJobModel() {
  const { jobId } = useParams<{ jobId: string }>()
  const [activeTab, setActiveTab] = useState<CustomerJobTabKey>("details")
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
  const [currentStatus, setCurrentStatus] = useState<string>("")
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [tagsModalOpen, setTagsModalOpen] = useState(false)
  const [tempSelectedTags, setTempSelectedTags] = useState<TagOption[]>([])
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  const statusOptions = ["submitted", "in-progress", "pending", "unscheduled", "completed", "on-hold"]

  const tagOptions: TagOption[] = [
    { value: "urgent", label: "Urgent" },
    { value: "follow-up", label: "Follow-up" },
    { value: "reviewed", label: "Reviewed" },
    { value: "approved", label: "Approved" },
    { value: "blocked", label: "Blocked" },
    { value: "in-review", label: "In Review" },
    { value: "completed", label: "Completed" },
  ]

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "42px",
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "none",
      padding: "4px 8px",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#16a34a" : state.isFocused ? "#f3f4f6" : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#374151",
      padding: "10px 12px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500",
      "&:active": {
        backgroundColor: "#16a34a",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#dcfce7",
      borderRadius: "16px",
      padding: "2px 6px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#166534",
      fontSize: "12px",
      fontWeight: "600",
      padding: "2px 4px",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#16a34a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#bbf7d0",
        color: "#166534",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "13px",
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "250px",
    }),
  }

  // Find the job data from mock data
  const jobData = useMemo(() => {
    return MOCK_JOBS.find(job => job.id === jobId)
  }, [jobId])

  // Initialize status from job data
  useMemo(() => {
    if (jobData && !currentStatus) {
      setCurrentStatus(jobData.status)
    }
  }, [jobData, currentStatus])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false)
      }
      // if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target as Node)) {
      //   setTagsDropdownOpen(false)
      // }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Transform job data to customer data
  const customerData: CustomerData = useMemo(() => {
    if (!jobData) {
      return {
        name: "Unknown",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        companyName: "",
      }
    }

    return {
      name: jobData.clientName,
      email: jobData.email || "",
      phone: jobData.phone,
      address: jobData.address,
      city: jobData.city,
      state: jobData.state,
      zip: jobData.zip,
      companyName: jobData.companyName,
    }
  }, [jobData])

  // Handle tag selection change
  // const handleTagChange = (selectedOptions: TagOption[]) => {
  //   setSelectedTags(selectedOptions)
  // }

  // Open modal with current tags
  const handleOpenTagsModal = () => {
    setTempSelectedTags(selectedTags)
    setTagsModalOpen(true)
  }

  // Close modal and apply changes
  const handleCloseTagsModal = (apply: boolean) => {
    if (apply) {
      setSelectedTags(tempSelectedTags)
    }
    setTagsModalOpen(false)
  }

  if (!jobData) {
    return (
      <div className="p-4 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
          <p className="text-gray-600">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 ">
      {/* Header */}
      <CustomerJobHeader
        customerName={customerData.name}
        customerId={jobData.id}
        jobNumber={jobData.jobNumber}
        clientPhone={customerData.phone}
      />

      <div className="flex items-center gap-4 flex-wrap">

        <div className="flex items-center gap-2" ref={statusDropdownRef}>
          <span className="text-sm font-semibold text-gray-700">Status:</span>
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace("-", " ")}
              <ChevronDown size={16} className={`transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Status Dropdown Menu */}
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setCurrentStatus(status)
                      setStatusDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${currentStatus === status
                        ? "bg-blue-50 text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Tags:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedTags.length > 0 ? (
              <>
                {selectedTags.map((tag) => (
                  <span
                    key={tag.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                  >
                    {tag.label}
                    <button
                      onClick={() => {
                        setSelectedTags(selectedTags.filter(t => t.value !== tag.value))
                      }}
                      className="ml-0.5 hover:text-green-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleOpenTagsModal}
                  className="inline-flex items-center justify-center w-6 h-6 text-green-600 bg-green-50 rounded-full transition-colors"
                  title="Edit tags"
                >
                  <Plus size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleOpenTagsModal}
                className="inline-flex items-center justify-center w-6 h-6 text-balck text-secondary bg-primary  rounded-full transition-colors"
                title="Add tags"
              >
                <Plus size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm transition-colors">
            Actions
            <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg  font-semibold text-sm transition-colors">
            View Invoice
          </button>
        </div>
      </div>

      {/* Tabs */}
      <CustomerJobTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tags Modal */}
      {tagsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-900">Select Tags</h3>
              <button
                onClick={() => handleCloseTagsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <Select
                isMulti
                options={tagOptions}
                value={tempSelectedTags}
                // @ts-ignore
                onChange={(options) => setTempSelectedTags(options || [])}
                placeholder="Search and select tags..."
                styles={customSelectStyles}
                classNamePrefix="react-select"
                isClearable={false}
                isSearchable={true}
                noOptionsMessage={() => "No tags available"}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => handleCloseTagsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCloseTagsModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className=" rounded-lg">
        {activeTab === "details" && (
          <DetailsTab customerId={jobData.id} customerData={customerData} />
        )}

        {activeTab === "items" && (
          <ItemsTab />
        )}

        {activeTab === "payments" && (
          <PaymentsTab />
        )}

        {activeTab === "estimates" && (
          <EstimatesSection />
        )}

        {activeTab === "attachments" && (
          <AttachmentsTab />
        )}

        {activeTab === "tasks" && (
          <TasksTab />
        )}
        {activeTab === "purchase" && (
          <ClientPurchaseOrderTab
            purchaseOrders={staticPurchaseOrders}
            onDelete={(id) => {
              console.log("Delete PO:", id)
            }}
          />
        )}
        {activeTab === "workOrder" && (
          < ClientWorkOrder />
        )}

        {activeTab === "equipment" && (
          <EquipmentTab />
        )}
      </div>
    </div>
  )
}

export default CustomerAndJobModel