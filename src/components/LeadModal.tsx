// LeadModal.tsx
import { useState } from "react"
import Select, { components } from "react-select"
import type { MultiValue, OptionProps } from "react-select"
import { 
  X, Upload, Calendar, Plus, Trash2, Phone, MapPin, 
  Clock, Users, ChevronDown, ChevronUp, Building
} from "lucide-react"
import type { StylesConfig } from "react-select"

/* ===================== CONSTANTS ===================== */

export const LEAD_STATUSES = ["new", "attempting_to_contact", "initial_contact_made", "qualifying", "scheduling_visit", "scheduled", "delayed", "contacted", "qualified", "proposal-sent", "follow-up", "closed-won", "closed-lost"] as const
export type LeadStatus = typeof LEAD_STATUSES[number]
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  attempting_to_contact: "Attempting to Contact",
  initial_contact_made: "Initial Contact Made",
  qualifying: "Qualifying",
  scheduling_visit: "Scheduling Visit",
  scheduled: "Scheduled",
  delayed: "Delayed",
  contacted: "Contacted",
  qualified: "Qualified",
  "proposal-sent": "Proposal Sent",
  "follow-up": "Follow Up",
  "closed-won": "Closed Won",
  "closed-lost": "Closed Lost",
}

const STATES = ["IL", "IN", "MI", "OH", "WI", "MN", "MO", "IA", "NY", "CA", "TX", "FL", "GA", "NC", "PA"]

export const JOB_TYPES = [
  "Emergency service",
  "Gate lock service",
  "Cabinet lock service",
  "Key extraction",
  "Key duplication",
  "Lock change",
  "Rekey service",
  "Flooring installation",
  "Flooring repair",
  "Carpet installation",
  "Tile installation",
  "Vinyl flooring",
  "Wood flooring",
  "Inspection",
  "Estimate only",
  "Other",
]

export const LEAD_SOURCES = ["Google", "Facebook", "Instagram", "Website", "Phone Call", "WhatsApp", "Referral", "Walk-in"]
export const LEAD_TYPES = ["Flooring", "Carpet", "Tile", "Vinyl", "Wood", "Other"]

const PHONE_TYPES = ["Mobile", "Home", "Work", "Fax", "Other"]
const ADDRESS_TYPES = ["Service", "Billing", "Home", "Office", "Other"]

type TagOption = {
  value: string
  label: string
}

const TAG_OPTIONS: TagOption[] = [
  { value: "Hot", label: " Hot" },
  { value: "Urgent", label: "Urgent" },
  { value: "High Value", label: "High Value" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "VIP", label: "VIP" },
  { value: "New Customer", label: "New Customer" },
]

type TeamMemberOption = {
  value: string
  label: string
  role: string
}

const TEAM_MEMBERS: TeamMemberOption[] = [
  { value: "john-smith", label: "John Smith", role: "Technician" },
  { value: "mike-johnson", label: "Mike Johnson", role: "Senior Tech" },
  { value: "sarah-wilson", label: "Sarah Wilson", role: "Project Manager" },
  { value: "tom-davis", label: "Tom Davis", role: "Technician" },
  { value: "lisa-brown", label: "Lisa Brown", role: "Lead Installer" },
  { value: "david-lee", label: "David Lee", role: "Technician" },
]

/* ===================== TYPES ===================== */

interface PhoneNumber {
  id: string
  number: string
  type: string
  ext: string
  isPrimary: boolean
}

interface Address {
  id: string
  type: string
  address: string
  unit: string
  city: string
  state: string
  zip: string
  country: string
  isPrimary: boolean
}

export interface LeadFormData {
  /* Client */
  firstName: string
  lastName: string
  clientName: string
  companyName: string
  phone: string
  phoneExt: string
  mobilePhone: string
  email: string
  phoneNumbers: PhoneNumber[]

  /* Location */
  addresses: Address[]
  address: string
  unit: string
  city: string
  state: string
  zip: string
  country: string
  metroArea: string

  /* Job */
  jobType: string
  jobSource: string
  jobDescription: string

  /* Schedule */
  isScheduled: boolean
  scheduleDate: string
  scheduleEndDate: string
  startTime: string
  endTime: string
  isAllDayEvent: boolean
  assignedTeamMembers: string[]

  /* Team */
  assignTech: string
  techAssigned: string

  /* Checklist */
  preferredName: string
  toolsCollected: boolean
  productType: string
  preferredContactMethod: string
  color: string
  projectStartDate: string
  finalWalkThrough: string
  numberOfRooms: string
  squareFootage: string
  photosDocumented: boolean
  thankYouGift: string
  projectDeliveryTime: string
  salesQualifiers: string

  /* Subcontractor Notes */
  subcontractorNotes: string

  /* Receipts */
  receipts: string[]

  /* Sales Consultant */
  salesConsultantName: string

  /* Extras */
  tags: string[]
  notes: string
  beforeImage?: string
  afterImage?: string
}

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LeadFormData) => void
  title?: string
}

/* ===================== DEFAULT DATA ===================== */

const emptyLeadData: LeadFormData = {
  firstName: "",
  lastName: "",
  clientName: "",
  companyName: "",
  phone: "",
  phoneExt: "",
  mobilePhone: "",
  email: "",
  phoneNumbers: [
    { id: "1", number: "", type: "Mobile", ext: "", isPrimary: true }
  ],

  addresses: [
    { id: "1", type: "Service", address: "", unit: "", city: "", state: "", zip: "", country: "United States", isPrimary: true }
  ],
  address: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  metroArea: "",

  jobType: "",
  jobSource: "Google",
  jobDescription: "",

  isScheduled: false,
  scheduleDate: "",
  scheduleEndDate: "",
  startTime: "",
  endTime: "",
  isAllDayEvent: false,
  assignedTeamMembers: [],

  assignTech: "",
  techAssigned: "",

  preferredName: "",
  toolsCollected: false,
  productType: "",
  preferredContactMethod: "",
  color: "",
  projectStartDate: "",
  finalWalkThrough: "",
  numberOfRooms: "",
  squareFootage: "",
  photosDocumented: false,
  thankYouGift: "",
  projectDeliveryTime: "",
  salesQualifiers: "",

  subcontractorNotes: "",
  receipts: [],
  salesConsultantName: "",

  tags: [],
  notes: "",
}

/* ===================== COMPONENT ===================== */

export function LeadModal({ isOpen, onClose, onSubmit, title = 'Create Lead' }: LeadModalProps) {
  const [leadData, setLeadData] = useState<LeadFormData>(emptyLeadData)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState({
    phones: true,
    addresses: true,
    schedule: true,
  })

  if (!isOpen) return null

  /* ================= PHONE HANDLERS ================= */

  const addPhoneNumber = () => {
    const newPhone: PhoneNumber = {
      id: Date.now().toString(),
      number: "",
      type: "Mobile",
      ext: "",
      isPrimary: leadData.phoneNumbers.length === 0
    }
    setLeadData({
      ...leadData,
      phoneNumbers: [...leadData.phoneNumbers, newPhone]
    })
  }

  const updatePhoneNumber = (id: string, updates: Partial<PhoneNumber>) => {
    setLeadData({
      ...leadData,
      phoneNumbers: leadData.phoneNumbers.map(phone =>
        phone.id === id ? { ...phone, ...updates } : phone
      )
    })
  }

  const removePhoneNumber = (id: string) => {
    const remaining = leadData.phoneNumbers.filter(p => p.id !== id)
    if (remaining.length > 0 && !remaining.some(p => p.isPrimary)) {
      remaining[0].isPrimary = true
    }
    setLeadData({ ...leadData, phoneNumbers: remaining })
  }

  const setPrimaryPhone = (id: string) => {
    setLeadData({
      ...leadData,
      phoneNumbers: leadData.phoneNumbers.map(phone => ({
        ...phone,
        isPrimary: phone.id === id
      }))
    })
  }

  /* ================= ADDRESS HANDLERS ================= */

  const addAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      type: "Service",
      address: "",
      unit: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      isPrimary: leadData.addresses.length === 0
    }
    setLeadData({
      ...leadData,
      addresses: [...leadData.addresses, newAddress]
    })
  }

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setLeadData({
      ...leadData,
      addresses: leadData.addresses.map(addr =>
        addr.id === id ? { ...addr, ...updates } : addr
      )
    })
  }

  const removeAddress = (id: string) => {
    const remaining = leadData.addresses.filter(a => a.id !== id)
    if (remaining.length > 0 && !remaining.some(a => a.isPrimary)) {
      remaining[0].isPrimary = true
    }
    setLeadData({ ...leadData, addresses: remaining })
  }

  const setPrimaryAddress = (id: string) => {
    setLeadData({
      ...leadData,
      addresses: leadData.addresses.map(addr => ({
        ...addr,
        isPrimary: addr.id === id
      }))
    })
  }

  /* ================= VALIDATION ================= */

  const validateLead = () => {
    const newErrors: Record<string, string> = {}

    if (!leadData.firstName.trim() && !leadData.clientName.trim()) {
      newErrors.firstName = "Client name is required"
    }

    if (leadData.phoneNumbers.length === 0 || !leadData.phoneNumbers.some(p => p.number.length >= 10)) {
      newErrors.phone = "At least one valid phone number is required"
    }

    if (leadData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      newErrors.email = "Invalid email format"
    }

    const primaryAddress = leadData.addresses.find(a => a.isPrimary)
    if (!primaryAddress || !primaryAddress.address.trim()) {
      newErrors.address = "Primary address is required"
    }

    if (primaryAddress && !primaryAddress.city.trim()) {
      newErrors.city = "City is required"
    }

    if (primaryAddress && !primaryAddress.state) {
      newErrors.state = "State is required"
    }

    if (!leadData.jobType.trim()) {
      newErrors.jobType = "Job type is required"
    }

    if (leadData.isScheduled && !leadData.scheduleDate) {
      newErrors.scheduleDate = "Schedule date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateLead()) return

    setIsSaving(true)
    await new Promise(res => setTimeout(res, 400))
    
    // Combine first and last name for clientName
    const submitData = {
      ...leadData,
      clientName: `${leadData.firstName} ${leadData.lastName}`.trim() || leadData.clientName,
      phone: leadData.phoneNumbers.find(p => p.isPrimary)?.number || leadData.phoneNumbers[0]?.number || "",
      address: leadData.addresses.find(a => a.isPrimary)?.address || "",
      city: leadData.addresses.find(a => a.isPrimary)?.city || "",
      state: leadData.addresses.find(a => a.isPrimary)?.state || "",
      zip: leadData.addresses.find(a => a.isPrimary)?.zip || "",
    }
    
    onSubmit(submitData)
    setIsSaving(false)
    onClose()
  }

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)

    setLeadData(prev => ({
      ...prev,
      [type === "before" ? "beforeImage" : "afterImage"]: previewUrl,
    }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Format schedule preview
  const getSchedulePreview = () => {
    if (!leadData.isScheduled || !leadData.scheduleDate) return null
    
    const startDate = new Date(leadData.scheduleDate)
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })

    if (leadData.isAllDayEvent) {
      if (leadData.scheduleEndDate && leadData.scheduleEndDate !== leadData.scheduleDate) {
        const endDate = new Date(leadData.scheduleEndDate)
        return `${formatDate(startDate)} - ${formatDate(endDate)} (All Day)`
      }
      return `${formatDate(startDate)} (All Day)`
    }

    return `${formatDate(startDate)} ${leadData.startTime || ''} - ${leadData.endTime || ''}`
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-white flex-shrink-0">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ==================== LEFT COLUMN (2/3) ==================== */}
              <div className="lg:col-span-2 space-y-6">

                {/* CLIENT DETAILS */}
                <Section title="Client Details" icon={<Building size={18} />}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="First Name *" 
                      value={leadData.firstName}
                      onChange={(v: string) => setLeadData({ ...leadData, firstName: v })}
                      error={errors.firstName}
                      placeholder="Enter first name"
                    />
                    <Input 
                      label="Last Name" 
                      value={leadData.lastName}
                      onChange={(v: string) => setLeadData({ ...leadData, lastName: v })}
                      placeholder="Enter last name"
                    />
                    <Input 
                      label="Company Name" 
                      value={leadData.companyName} 
                      onChange={(v: string) => setLeadData({ ...leadData, companyName: v })}
                      placeholder="Enter company name"
                    />
                    <Input 
                      label="Email" 
                      type="email"
                      value={leadData.email} 
                      onChange={(v: string) => setLeadData({ ...leadData, email: v })}
                      error={errors.email}
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Tags */}
                  <div className="mt-4">
                    <label className="text-xs font-semibold block mb-2">Tags</label>
                    <Select<TagOption, true>
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="react-select"
                      options={TAG_OPTIONS}
                      value={TAG_OPTIONS.filter(tagOption =>
                        leadData.tags.includes(tagOption.value)
                      )}
                      onChange={(selectedTagOptions: MultiValue<TagOption>) => {
                        setLeadData({
                          ...leadData,
                          tags: selectedTagOptions.map(t => t.value),
                        })
                      }}
                      components={{ Option: CheckboxOption }}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      placeholder="Select tags..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "42px",
                          borderRadius: "0.5rem",
                          borderColor: "#D1D5DB",
                        }),
                      }}
                    />
                  </div>
                </Section>

                {/* MULTIPLE PHONE NUMBERS */}
                <div className="bg-white rounded-xl border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('phones')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-primary" />
                      <h3 className="font-semibold">Phone Numbers</h3>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {leadData.phoneNumbers.length}
                      </span>
                    </div>
                    {expandedSections.phones ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {expandedSections.phones && (
                    <div className="p-4 pt-0 border-t">
                      <div className="pt-4 space-y-3">
                        {errors.phone && (
                          <p className="text-red-500 text-xs mb-2">{errors.phone}</p>
                        )}

                        {leadData.phoneNumbers.map((phone, index) => (
                          <div 
                            key={phone.id}
                            className={`flex  items-center gap-3 p-3 rounded-lg border transition-all ${
                              phone.isPrimary ? 'bg-primary/5 border-primary/30' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            {/* Phone Type */}
                            <select
                              value={phone.type}
                              onChange={e => updatePhoneNumber(phone.id, { type: e.target.value })}
                              className="px-3 max-w-[25%] py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none min-w-[100px]"
                            >
                              {PHONE_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>

                            {/* Phone Number */}
                            <input
                              type="tel"
                              value={phone.number}
                              onChange={e => updatePhoneNumber(phone.id, { 
                                number: e.target.value.replace(/\D/g, '') 
                              })}
                              placeholder="(555) 123-4567"
                              className="flex-1 min-w-[250px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />

                            {/* Extension */}
                            <input
                              type="text"
                              value={phone.ext}
                              onChange={e => updatePhoneNumber(phone.id, { ext: e.target.value })}
                              placeholder="Ext"
                              className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />

                            {/* Primary Badge / Set Primary */}
                            {phone.isPrimary ? (
                              <span className="px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full whitespace-nowrap">
                                Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPrimaryPhone(phone.id)}
                                className="px-2.5 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-300 transition-colors whitespace-nowrap"
                              >
                                Set Primary
                              </button>
                            )}

                            {/* Remove */}
                            {leadData.phoneNumbers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePhoneNumber(phone.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addPhoneNumber}
                          className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors mt-2"
                        >
                          <Plus size={16} />
                          Add Another Phone
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* MULTIPLE ADDRESSES */}
                <div className="bg-white rounded-xl border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('addresses')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-primary" />
                      <h3 className="font-semibold">Service Locations</h3>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {leadData.addresses.length}
                      </span>
                    </div>
                    {expandedSections.addresses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {expandedSections.addresses && (
                    <div className="p-4 pt-0 border-t">
                      <div className="pt-4 space-y-4">
                        {errors.address && (
                          <p className="text-red-500 text-xs mb-2">{errors.address}</p>
                        )}

                        {leadData.addresses.map((addr, index) => (
                          <div 
                            key={addr.id}
                            className={`p-4 rounded-lg border transition-all ${
                              addr.isPrimary ? 'bg-primary/5 border-primary/30' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <select
                                  value={addr.type}
                                  onChange={e => updateAddress(addr.id, { type: e.target.value })}
                                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                  {ADDRESS_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>

                                {addr.isPrimary ? (
                                  <span className="px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full">
                                    Primary
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setPrimaryAddress(addr.id)}
                                    className="px-2.5 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-300 transition-colors"
                                  >
                                    Set Primary
                                  </button>
                                )}
                              </div>

                              {leadData.addresses.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeAddress(addr.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>

                            {/* Address Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="md:col-span-2">
                                <input
                                  type="text"
                                  value={addr.address}
                                  onChange={e => updateAddress(addr.id, { address: e.target.value })}
                                  placeholder="Street Address *"
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <input
                                type="text"
                                value={addr.unit}
                                onChange={e => updateAddress(addr.id, { unit: e.target.value })}
                                placeholder="Apt, Suite, Unit"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                              <input
                                type="text"
                                value={addr.city}
                                onChange={e => updateAddress(addr.id, { city: e.target.value })}
                                placeholder="City *"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                              <select
                                value={addr.state}
                                onChange={e => updateAddress(addr.id, { state: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                              >
                                <option value="">State *</option>
                                {STATES.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={addr.zip}
                                onChange={e => updateAddress(addr.id, { zip: e.target.value })}
                                placeholder="Zip Code"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={addAddress}
                          className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                          <Plus size={16} />
                          Add Another Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* JOB DETAILS */}
                <Section title="Job Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Job Type *"
                      value={leadData.jobType}
                      options={JOB_TYPES}
                      onChange={(v: string) => setLeadData({ ...leadData, jobType: v })}
                      error={errors.jobType}
                    />
                    <SelectField
                      label="Job Source"
                      value={leadData.jobSource}
                      options={LEAD_SOURCES}
                      onChange={(v: string) => setLeadData({ ...leadData, jobSource: v })}
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        label="Job Description"
                        value={leadData.jobDescription}
                        onChange={(v: string) => setLeadData({ ...leadData, jobDescription: v })}
                        placeholder="Describe the job requirements..."
                      />
                    </div>
                  </div>
                </Section>

                {/* BEFORE & AFTER PHOTOS */}
                <Section title="Before & After Photos">
                  <div className="flex flex-wrap gap-6">
                    <ImageUpload 
                      label="Before Photo" 
                      image={leadData.beforeImage} 
                      onUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e, "before")} 
                    />
                    <ImageUpload 
                      label="After Photo" 
                      image={leadData.afterImage} 
                      onUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e, "after")} 
                    />
                  </div>
                </Section>

              </div>

              {/* ==================== RIGHT COLUMN (1/3) ==================== */}
              <div className="space-y-6">

                {/* SCHEDULE */}
                <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar size={18} className="text-primary" />
                        Schedule
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={leadData.isScheduled}
                          onChange={e => setLeadData({ ...leadData, isScheduled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>

                  {leadData.isScheduled ? (
                    <div className="p-4 space-y-4">
                      {/* Start Date */}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={leadData.scheduleDate}
                          onChange={e => setLeadData({ ...leadData, scheduleDate: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        {errors.scheduleDate && (
                          <p className="text-red-500 text-xs mt-1">{errors.scheduleDate}</p>
                        )}
                      </div>

                      {/* Time Selection - Only show if not all day */}
                      {!leadData.isAllDayEvent && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={leadData.startTime}
                              onChange={e => setLeadData({ ...leadData, startTime: e.target.value })}
                              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={leadData.endTime}
                              onChange={e => setLeadData({ ...leadData, endTime: e.target.value })}
                              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* End Date */}
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={leadData.scheduleEndDate}
                          onChange={e => setLeadData({ ...leadData, scheduleEndDate: e.target.value })}
                          min={leadData.scheduleDate}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>

                      {/* All Day Event Toggle */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">All Day Event</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={leadData.isAllDayEvent}
                            onChange={e => setLeadData({ ...leadData, isAllDayEvent: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* Schedule Preview */}
                      {getSchedulePreview() && (
                        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Scheduled for</p>
                          <p className="text-sm font-semibold text-gray-900">{getSchedulePreview()}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">
                        Enable scheduling to set appointment details
                      </p>
                    </div>
                  )}
                </div>

                {/* ASSIGN TEAM MEMBERS */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Users size={18} className="text-primary" />
                      Assign Team Members
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <Select<TeamMemberOption, true>
                      isMulti
                      options={TEAM_MEMBERS}
                      value={TEAM_MEMBERS.filter(member =>
                        leadData.assignedTeamMembers.includes(member.value)
                      )}
                      onChange={selected => {
                        setLeadData({
                          ...leadData,
                          assignedTeamMembers: selected ? selected.map(v => v.value) : [],
                        })
                      }}
                      placeholder="Select team members..."
                      className="react-select-container"
                      classNamePrefix="react-select"
                      formatOptionLabel={(option: TeamMemberOption) => (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {option.label.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className="text-xs text-gray-500">{option.role}</p>
                          </div>
                        </div>
                      )}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: '#D1D5DB',
                          minHeight: '44px',
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: '#EFF6FF',
                          borderRadius: '9999px',
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: '#3B82F6',
                          fontWeight: 500,
                          paddingLeft: '10px',
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: '#3B82F6',
                          borderRadius: '0 9999px 9999px 0',
                          '&:hover': {
                            backgroundColor: '#DBEAFE',
                            color: '#1D4ED8',
                          },
                        }),
                      }}
                    />

                    {/* Assigned Members List */}
                    {leadData.assignedTeamMembers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Assigned ({leadData.assignedTeamMembers.length})
                        </p>
                        {leadData.assignedTeamMembers.map(memberId => {
                          const member = TEAM_MEMBERS.find(m => m.value === memberId)
                          if (!member) return null
                          return (
                            <div 
                              key={memberId}
                              className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">
                                    {member.label.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{member.label}</p>
                                  <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setLeadData({
                                  ...leadData,
                                  assignedTeamMembers: leadData.assignedTeamMembers.filter(id => id !== memberId)
                                })}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {leadData.assignedTeamMembers.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No team members assigned</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* NOTES */}
                <div className="bg-white rounded-xl border shadow-sm p-4">
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <textarea
                    value={leadData.notes}
                    onChange={e => setLeadData({ ...leadData, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 sticky bottom-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Create Lead"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

/* ===================== SMALL COMPONENTS ===================== */

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border p-5">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  )
}

function Input({ label, value, onChange, error, type = "text", placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none
          ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
        `}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1 text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
      />
    </div>
  )
}

function SelectField({ label, value, options, onChange, error }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1 text-gray-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none
          ${error ? "border-red-500 bg-red-50" : "border-gray-300"}
        `}
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

function ImageUpload({ label, image, onUpload }: {
  label: string
  image?: string
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-2 text-gray-700">{label}</label>
      <div className="relative h-32 w-32 border-2 border-dashed hover:border-primary rounded-lg flex items-center justify-center bg-gray-50 transition-colors cursor-pointer group">
        {image ? (
          <img src={image} className="h-full w-full object-cover rounded-lg" alt={label} />
        ) : (
          <div className="text-center">
            <Upload className="mx-auto text-gray-400 group-hover:text-primary transition-colors" size={24} />
            <span className="text-xs text-gray-500 mt-1 block">Upload</span>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={onUpload} 
          className="absolute inset-0 opacity-0 cursor-pointer" 
        />
      </div>
    </div>
  )
}

const CheckboxOption = (props: OptionProps<TagOption, true>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={props.isSelected}
          readOnly
          className="h-4 w-4 rounded border-gray-300 accent-primary"
        />
        <span>{props.label}</span>
      </div>
    </components.Option>
  )
}