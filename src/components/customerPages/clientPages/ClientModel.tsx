import { useState, useMemo, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, Plus, X } from 'lucide-react'
import Select from 'react-select'
import ClientHeader from './ClientHeader'
import ClientTabs from './ClientTabs'
// import { ClientDetailsTab } from './tabs/ClientDetailsTab'
import { ClientJobsTab } from './tabs/ClientJobsTab'
import { ClientEstimatesTab } from './tabs/ClientEstimatesTab'
import { ClientInvoicesTab } from './tabs/ClientInvoicesTab'
import { ClientPaymentsTab } from './tabs/ClientPaymentsTab'
import { ClientAddressesTab } from './tabs/ClientAddressesTab'
import { ClientCustomFieldsTab } from './tabs/ClientCustomFieldsTab'

/* ===================== TYPES ===================== */

type ClientTabKey = "jobs" | "estimates" | "invoices" | "payments" | "addresses" | "custom-fields"

interface ClientData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  companyName?: string
  pastDue: number
  amountDue: number
  totalRevenue: number
  estimateCount: number
  jobCount: number
  invoiceCount: number
  paymentCount: number
  addressCount: number
}

interface TagOption {
  value: string
  label: string
}

// Mock clients data - matches Customers.tsx data
const MOCK_CLIENTS: ClientData[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    companyName: "Smith & Co",
    pastDue: 2500.00,
    amountDue: 3500.00,
    totalRevenue: 12500.00,
    estimateCount: 2,
    jobCount: 5,
    invoiceCount: 4,
    paymentCount: 3,
    addressCount: 1,
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
    companyName: "Williams Group",
    pastDue: 0,
    amountDue: 5000.00,
    totalRevenue: 28300.00,
    estimateCount: 3,
    jobCount: 12,
    invoiceCount: 10,
    paymentCount: 8,
    addressCount: 2,
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
    companyName: "Brown Services",
    pastDue: 1200.00,
    amountDue: 2100.00,
    totalRevenue: 19200.00,
    estimateCount: 2,
    jobCount: 8,
    invoiceCount: 6,
    paymentCount: 5,
    addressCount: 1,
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
    companyName: "Davis Solutions",
    pastDue: 0,
    amountDue: 0,
    totalRevenue: 5600.00,
    estimateCount: 1,
    jobCount: 3,
    invoiceCount: 2,
    paymentCount: 2,
    addressCount: 1,
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
    companyName: "Wilson Enterprises",
    pastDue: 5000.00,
    amountDue: 8000.00,
    totalRevenue: 42800.00,
    estimateCount: 4,
    jobCount: 15,
    invoiceCount: 12,
    paymentCount: 10,
    addressCount: 2,
  },
]

/* ===================== COMPONENT ===================== */

function ClientModel() {
  const { customerId } = useParams<{ customerId: string }>()
  const [activeTab, setActiveTab] = useState<ClientTabKey>("jobs")
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
  const [tagsModalOpen, setTagsModalOpen] = useState(false)
  const [tempSelectedTags, setTempSelectedTags] = useState<TagOption[]>([])

  const tagOptions: TagOption[] = [
    { value: "vip", label: "VIP" },
    { value: "priority", label: "Priority" },
    { value: "reviewed", label: "Reviewed" },
    { value: "at-risk", label: "At Risk" },
    { value: "partner", label: "Partner" },
    { value: "contract", label: "Contract" },
    { value: "renewal", label: "Renewal" },
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

 
  const clientData = useMemo(() => {
    return MOCK_CLIENTS.find(client => client.id === customerId)
  }, [customerId])

  
  const handleOpenTagsModal = () => {
    setTempSelectedTags(selectedTags)
    setTagsModalOpen(true)
  }

 
  const handleCloseTagsModal = (apply: boolean) => {
    if (apply) {
      setSelectedTags(tempSelectedTags)
    }
    setTagsModalOpen(false)
  }

  if (!clientData) {
    return (
      <div className="p-4 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Client not found</h2>
          <p className="text-gray-600">The client you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <ClientHeader
        clientName={clientData.name}
        clientId={clientData.id}
        clientPhone={clientData.phone}
        companyName={clientData.companyName}
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Past Due</p>
          <p className="text-2xl font-bold text-red-600 mt-2">${clientData.pastDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Due</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">${clientData.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">${clientData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estimates</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{clientData.estimateCount}</p>
        </div>
      </div>

      {/* Tags and Actions */}
      <div className="flex items-center gap-4 flex-wrap">
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
                  className="inline-flex items-center justify-center w-6 h-6 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                  title="Edit tags"
                >
                  <Plus size={16}  />
                </button>
              </>
            ) : (
              <button
                onClick={handleOpenTagsModal}
                className="inline-flex items-center justify-center w-6 h-6 text-black bg-primary rounded-full transition-colors"
                title="Add tags"
              >
                <Plus size={15} className='text-white font-medium' />
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
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm transition-colors">
            Create Job
          </button>
        </div>
      </div>

      {/* Tabs */}
      <ClientTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        jobCount={clientData.jobCount}
        estimateCount={clientData.estimateCount}
        invoiceCount={clientData.invoiceCount}
        paymentCount={clientData.paymentCount}
        addressCount={clientData.addressCount}
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
      <div className="rounded-lg">
        {/* {activeTab === "details" && (
          <ClientDetailsTab clientData={clientData} />
        )} */}

        {activeTab === "jobs" && (
          <ClientJobsTab clientId={clientData.id} />
        )}

        {activeTab === "estimates" && (
          <ClientEstimatesTab clientId={clientData.id} />
        )}

        {activeTab === "invoices" && (
          <ClientInvoicesTab clientId={clientData.id} />
        )}

        {activeTab === "payments" && (
          <ClientPaymentsTab clientId={clientData.id} />
        )}

        {activeTab === "addresses" && (
          <ClientAddressesTab clientId={clientData.id} />
        )}

        {activeTab === "custom-fields" && (
          <ClientCustomFieldsTab clientId={clientData.id} />
        )}
      </div>
    </div>
  )
}

export default ClientModel