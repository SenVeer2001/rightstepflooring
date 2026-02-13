// LeadForm.tsx
import { useState } from "react"
import SelectReact from "react-select"
import { 
  Calendar, Upload, X, Plus, Phone, Mail, MapPin, 
  Briefcase, User, Clock, Users, CalendarCheck, 
  Eye, Trash2, Building, FileText, Tags, ChevronDown, ChevronUp
} from "lucide-react"

import {
  LEAD_SOURCES,
} from "../LeadModal"
import type { LeadFormData } from "../LeadModal"

import Select from "../ui/Select"
import Input from "../ui/Input"
import Textarea from "../ui/Textarea"

const STATES = ["IL", "IN", "MI", "OH", "WI", "MN", "MO", "IA", "NY", "CA", "TX", "FL"]

const JOB_TYPES = [
  "Flooring",
  "Carpet",
  "Tile",
  "Vinyl",
  "Wood",
  "Painting",
  "Remodeling",
  "Other",
]

const LEAD_TAG_OPTIONS = [
  { value: "Hot", label: "Hot", color: "#EF4444" },
  { value: "Urgent", label: "Urgent", color: "#F59E0B" },
  { value: "Follow-up", label: "Follow-up", color: "#3B82F6" },
  { value: "High Value", label: "High Value", color: "#8B5CF6" },
  { value: "Low Budget", label: "Low Budget", color: "#6B7280" },
  { value: "Repeat Client", label: " Repeat Client", color: "#10B981" },
  { value: "VIP", label: "VIP", color: "#EC4899" },
]

const TEAM_MEMBERS = [
  { value: "john-smith", label: "John Smith", role: "Technician" },
  { value: "mike-johnson", label: "Mike Johnson", role: "Senior Tech" },
  { value: "sarah-wilson", label: "Sarah Wilson", role: "Project Manager" },
  { value: "tom-davis", label: "Tom Davis", role: "Technician" },
  { value: "lisa-brown", label: "Lisa Brown", role: "Lead Installer" },
  { value: "david-lee", label: "David Lee", role: "Technician" },
]

const PHONE_TYPES = ["Mobile", "Home", "Work", "Fax", "Other"]

interface PhoneNumber {
  id: string
  number: string
  type: string
  isPrimary: boolean
  ext: string  //
}

interface ExtendedLeadFormData extends LeadFormData {
  firstName: string
  lastName: string
  phoneNumbers: PhoneNumber[]
  scheduleEndDate: string
  isAllDayEvent: boolean
  assignedTeamMembers: string[]
}

export function LeadForm({
  formData: initialFormData,
  onChange,
  onSubmit,
}: {
  formData: LeadFormData
  onChange: (data: LeadFormData) => void
  onSubmit: () => void
}) {

  console.log("dfghj",initialFormData);
  
  // Extended form data with additional fields
  const [formData, setFormData] = useState<ExtendedLeadFormData>({
    ...initialFormData,
    firstName: initialFormData.clientName?.split(' ')[0] || '',
    lastName: initialFormData.clientName?.split(' ').slice(1).join(' ') || '',
    phoneNumbers: [
      { id: '1', number: initialFormData.phone || '', type: 'Mobile', isPrimary: true,ext : "" }
    ],
    scheduleEndDate: '',
    isAllDayEvent: false,
    assignedTeamMembers: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newReceipt, setNewReceipt] = useState("")
  const [showSchedulePreview, setShowSchedulePreview] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    client: true,
    location: true,
    job: true,
    checklist: false,
    receipts: false,
    notes: false
  })

  // Update parent form data
  const updateFormData = (updates: Partial<ExtendedLeadFormData>) => {
    const newData = { ...formData, ...updates }
    setFormData(newData)
    
    // Sync with parent
    onChange({
      
      ...newData,
      clientName: `${newData.firstName} ${newData.lastName}`.trim(),
      phone: newData.phoneNumbers.find(p => p.isPrimary)?.number || newData.phoneNumbers[0]?.number || ''
    })
  }

  /* ================= PHONE NUMBER HANDLERS ================= */

  const addPhoneNumber = () => {
    // @ts-ignore
    const newPhone: PhoneNumber = {
      id: Date.now().toString(),
      number: '',
      type: 'Mobile',
      isPrimary: formData.phoneNumbers.length === 0
    }
    updateFormData({
      phoneNumbers: [...formData.phoneNumbers, newPhone]
    })
  }

  const updatePhoneNumber = (id: string, updates: Partial<PhoneNumber>) => {
    updateFormData({
      phoneNumbers: formData.phoneNumbers.map(phone =>
        phone.id === id ? { ...phone, ...updates } : phone
      )
    })
  }

  const removePhoneNumber = (id: string) => {
    const remaining = formData.phoneNumbers.filter(p => p.id !== id)
    // If we removed the primary, make the first one primary
    if (remaining.length > 0 && !remaining.some(p => p.isPrimary)) {
      remaining[0].isPrimary = true
    }
    updateFormData({ phoneNumbers: remaining })
  }

  const setPrimaryPhone = (id: string) => {
    updateFormData({
      phoneNumbers: formData.phoneNumbers.map(phone => ({
        ...phone,
        isPrimary: phone.id === id
      }))
    })
  }

  /* ================= VALIDATION ================= */

  const validateLeadForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (formData.phoneNumbers.length === 0 || !formData.phoneNumbers.some(p => p.number.length >= 10)) {
      newErrors.phone = "At least one valid phone number is required"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.jobType) newErrors.jobType = "Job type is required"

    if (formData.isScheduled) {
      if (!formData.scheduleDate) newErrors.scheduleDate = "Start date is required"
      if (!formData.isAllDayEvent) {
        if (!formData.startTime) newErrors.startTime = "Start time is required"
        if (!formData.endTime) newErrors.endTime = "End time is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateLeadForm()) return
    onSubmit()
  }

  const handleAddReceipt = () => {
    if (newReceipt.trim()) {
      updateFormData({
        receipts: [...formData.receipts, newReceipt.trim()],
      })
      setNewReceipt("")
    }
  }

  const handleRemoveReceipt = (index: number) => {
    updateFormData({
      receipts: formData.receipts.filter((_, i) => i !== index),
    })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Format schedule preview
  const getSchedulePreview = () => {
    if (!formData.isScheduled || !formData.scheduleDate) return null
    
    const startDate = new Date(formData.scheduleDate)
    const endDate = formData.scheduleEndDate ? new Date(formData.scheduleEndDate) : startDate
    
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

    if (formData.isAllDayEvent) {
      if (formData.scheduleEndDate && formData.scheduleEndDate !== formData.scheduleDate) {
        return `${formatDate(startDate)} - ${formatDate(endDate)} (All Day)`
      }
      return `${formatDate(startDate)} (All Day)`
    }

    return `${formatDate(startDate)} ${formData.startTime || ''} - ${formData.endTime || ''}`
  }

  return (
    <div className="min-h-screen p-4 md:p-2">
      <div className="max-w-8xl mx-auto">
         

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* ==================== LEFT SECTION ==================== */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* CLIENT DETAILS */}
            <CollapsibleSection
              title="Client Details"
              icon={<User size={18} />}
              isExpanded={expandedSections.client}
              onToggle={() => toggleSection('client')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  value={formData.firstName}
                  onChange={value => updateFormData({ firstName: value })}
                   // @ts-ignore
                  error={errors.firstName}
                  placeholder="Enter first name"
                />

                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={value => updateFormData({ lastName: value })}
                  placeholder="Enter last name"
                />

                <Input
                  label="Company Name"
                  value={formData.companyName}
                  onChange={value => updateFormData({ companyName: value })}
                  placeholder="Enter company name"
                   // @ts-ignore
                  icon={<Building size={16} className="text-gray-400" />}
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={value => updateFormData({ email: value })}
                   // @ts-ignore
                  error={errors.email}
                  placeholder="email@example.com"
                  icon={<Mail size={16} className="text-gray-400" />}
                />
              </div>

              {/* MULTIPLE PHONE NUMBERS */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    Phone Numbers *
                  </label>
                  <button
                    type="button"
                    onClick={addPhoneNumber}
                    className="flex items-center gap-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    <Plus size={16} />
                    Add Phone
                  </button>
                </div>

                {errors.phone && (
                  <p className="text-red-500 text-xs mb-2">{errors.phone}</p>
                )}

                <div className="space-y-3">
                  {formData.phoneNumbers.map((phone, index) => (
                    <div 
                      key={phone.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        phone.isPrimary ? 'bg-primary/5 border-primary/30' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {/* Phone Type */}
                      <select
                        value={phone.type}
                        onChange={e => updatePhoneNumber(phone.id, { type: e.target.value })}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none min-w-[100px]"
                      >
                        {PHONE_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        value={phone.number}
                        onChange={e => updatePhoneNumber(phone.id, { 
                          number: e.target.value.replace(/\D/g, '') 
                        })}
                        placeholder="(555) 123-4567"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      />

                      {/* Primary Badge / Set Primary Button */}
                      {phone.isPrimary ? (
                        <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded-full whitespace-nowrap">
                          Primary
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPrimaryPhone(phone.id)}
                          className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-300 transition-colors whitespace-nowrap"
                        >
                          Set Primary
                        </button>
                      )}

                      {/* Remove Button */}
                      {formData.phoneNumbers.length > 1 && (
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
                </div>
              </div>
            </CollapsibleSection>

            {/* SERVICE LOCATION */}
            <CollapsibleSection
              title="Service Location"
              icon={<MapPin size={18} />}
              isExpanded={expandedSections.location}
              onToggle={() => toggleSection('location')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Address *"
                    value={formData.address}
                    onChange={value => updateFormData({ address: value })}
                     // @ts-ignore
                    error={errors.address}
                    placeholder="Street address"
                    icon={<MapPin size={16} className="text-gray-400" />}
                  />
                </div>

                <Input
                  label="Unit/Apt"
                  value={formData.unit}
                  onChange={value => updateFormData({ unit: value })}
                  placeholder="Apt, Suite, Unit"
                />

                <Input
                  label="City *"
                  value={formData.city}
                  onChange={value => updateFormData({ city: value })}
                   // @ts-ignore
                  error={errors.city}
                  placeholder="City"
                />

                <Select
                  label="State *"
                  value={formData.state}
                  onChange={value => updateFormData({ state: value })}
                   // @ts-ignore
                  error={errors.state}
                >
                  <option value="">Select state</option>
                  {STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </Select>

                <Input
                  label="Zip Code"
                  value={formData.zip}
                  onChange={value => updateFormData({ zip: value })}
                  placeholder="12345"
                />
              </div>
            </CollapsibleSection>

            {/* JOB DETAILS */}
            <CollapsibleSection
              title="Job Details"
              icon={<Briefcase size={18} />}
              isExpanded={expandedSections.job}
              onToggle={() => toggleSection('job')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Job Type *"
                  value={formData.jobType}
                  onChange={value => updateFormData({ jobType: value })}
                   // @ts-ignore
                  error={errors.jobType}
                >
                  <option value="">Select job type</option>
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>

                <Select
                  label="Job Source"
                  value={formData.jobSource}
                  onChange={value => updateFormData({ jobSource: value })}
                >
                  <option value="">Select source</option>
                  {LEAD_SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </Select>

                <div className="md:col-span-2">
                  <Textarea
                    label="Job Description"
                    value={formData.jobDescription}
                    onChange={value => updateFormData({ jobDescription: value })}
                     // @ts-ignore
                    placeholder="Describe the job requirements..."
                    rows={4}
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <Tags size={16} className="text-gray-400" />
                    Tags
                  </label>
                  <SelectReact
                    isMulti
                    options={LEAD_TAG_OPTIONS}
                    value={LEAD_TAG_OPTIONS.filter(option =>
                      formData.tags.includes(option.value)
                    )}
                    onChange={selected =>
                      updateFormData({
                        tags: selected ? selected.map(v => v.value) : [],
                      })
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select tags..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#D1D5DB',
                        '&:hover': { borderColor: '#3B82F6' },
                      }),
                      multiValue: (base, state) => {
                        const option = LEAD_TAG_OPTIONS.find(o => o.value === state.data.value)
                        return {
                          ...base,
                          backgroundColor: option?.color + '20' || '#E5E7EB',
                          borderRadius: '9999px',
                        }
                      },
                      multiValueLabel: (base, state) => {
                        const option = LEAD_TAG_OPTIONS.find(o => o.value === state.data.value)
                        return {
                          ...base,
                          color: option?.color || '#374151',
                          fontWeight: 500,
                        }
                      },
                    }}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* CHECKLIST (Collapsed by default) */}
            <CollapsibleSection
              title="Checklist"
              icon={<FileText size={18} />}
              isExpanded={expandedSections.checklist}
              onToggle={() => toggleSection('checklist')}
              badge={`${Object.values({
                toolsCollected: formData.toolsCollected,
                photosDocumented: formData.photosDocumented
              }).filter(Boolean).length}/2`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Preferred Name"
                  value={formData.preferredName}
                  onChange={value => updateFormData({ preferredName: value })}
                />

                <Input
                  label="Product"
                  value={formData.productType}
                  onChange={value => updateFormData({ productType: value })}
                />

                <Input
                  label="Color"
                  value={formData.color}
                  onChange={value => updateFormData({ color: value })}
                />

                <Input
                  label="Number of Rooms"
                  type="number"
                  value={formData.numberOfRooms}
                  onChange={value => updateFormData({ numberOfRooms: value })}
                />

                <Input
                  label="Square Footage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={value => updateFormData({ squareFootage: value })}
                />

                <Input
                  label="Project Delivery Time"
                  value={formData.projectDeliveryTime}
                  onChange={value => updateFormData({ projectDeliveryTime: value })}
                />

                {/* Checkboxes */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="toolsCollected"
                    checked={formData.toolsCollected}
                    onChange={e => updateFormData({ toolsCollected: e.target.checked })}
                    className="h-5 w-5 accent-primary rounded"
                  />
                  <label htmlFor="toolsCollected" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Did you collect all tools?
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="photosDocumented"
                    checked={formData.photosDocumented}
                    onChange={e => updateFormData({ photosDocumented: e.target.checked })}
                    className="h-5 w-5 accent-primary rounded"
                  />
                  <label htmlFor="photosDocumented" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Photos properly documented
                  </label>
                </div>
              </div>
            </CollapsibleSection>

            {/* RECEIPTS (Collapsed by default) */}
            <CollapsibleSection
              title="Upload Receipts"
              icon={<Upload size={18} />}
              isExpanded={expandedSections.receipts}
              onToggle={() => toggleSection('receipts')}
              badge={formData.receipts?.length > 0 ? `${formData.receipts.length}` : undefined}
            >
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <Input
                    label="Receipt URL or File"
                    value={newReceipt}
                    onChange={setNewReceipt}
                    placeholder="Paste URL or file name"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddReceipt}
                  className="mt-6 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90"
                >
                  <Upload size={16} />
                </button>
              </div>

              {formData.receipts && formData.receipts.length > 0 && (
                <div className="space-y-2">
                  {formData.receipts.map((receipt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">{receipt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReceipt(idx)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* NOTES (Collapsed by default) */}
            <CollapsibleSection
              title="Notes"
              icon={<FileText size={18} />}
              isExpanded={expandedSections.notes}
              onToggle={() => toggleSection('notes')}
            >
              <Textarea
                label="Internal Notes"
                value={formData.notes}
                onChange={value => updateFormData({ notes: value })}
                // @ts-ignore
                placeholder="Add internal notes..."
                rows={4}
              />

              <div className="mt-4">
                <Textarea
                  label="Subcontractor Notes"
                  value={formData.subcontractorNotes}
                  onChange={value => updateFormData({ subcontractorNotes: value })}
                   // @ts-ignore
                  placeholder="Notes for subcontractors..."
                  rows={3}
                />
              </div>
            </CollapsibleSection>

          </div>

          {/* ==================== RIGHT SECTION ==================== */}
          <div className="space-y-4">
            
            {/* SCHEDULE */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    Schedule
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isScheduled}
                      onChange={e => updateFormData({ isScheduled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {formData.isScheduled && (
                <div className="p-4 space-y-4">
                  {/* Start Date */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.scheduleDate}
                      onChange={e => updateFormData({ scheduleDate: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    {errors.scheduleDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.scheduleDate}</p>
                    )}
                  </div>

                  {/* Time Selection - Only show if not all day */}
                  {!formData.isAllDayEvent && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          value={formData.startTime}
                          onChange={e => updateFormData({ startTime: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        {errors.startTime && (
                          <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">
                          End Time *
                        </label>
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={e => updateFormData({ endTime: e.target.value })}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        {errors.endTime && (
                          <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* End Date - Show for multi-day events */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.scheduleEndDate}
                      onChange={e => updateFormData({ scheduleEndDate: e.target.value })}
                      min={formData.scheduleDate}
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
                        checked={formData.isAllDayEvent}
                        onChange={e => updateFormData({ isAllDayEvent: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Schedule Preview */}
                  {getSchedulePreview() && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Scheduled for</p>
                          <p className="text-sm font-semibold text-gray-900">{getSchedulePreview()}</p>
                        </div>
                        <button
                          onClick={() => setShowSchedulePreview(true)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* View Schedule Button */}
                  <button
                    onClick={() => setShowSchedulePreview(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors"
                  >
                    <CalendarCheck size={18} />
                    View Schedule
                  </button>
                </div>
              )}

              {!formData.isScheduled && (
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
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Assign Team Members
                </h3>
              </div>

              <div className="p-4 space-y-4">
                <SelectReact
                  isMulti
                  options={TEAM_MEMBERS}
                  value={TEAM_MEMBERS.filter(member =>
                    formData.assignedTeamMembers.includes(member.value)
                  )}
                  onChange={selected =>
                    updateFormData({
                      assignedTeamMembers: selected ? selected.map(v => v.value) : [],
                    })
                  }
                  placeholder="Select team members..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  formatOptionLabel={(option: any) => (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {option.label.split(' ').map((n: string) => n[0]).join('')}
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
                      '&:hover': { borderColor: '#3B82F6' },
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

                {/* Selected Team Members List */}
                {formData.assignedTeamMembers.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Assigned ({formData.assignedTeamMembers.length})</p>
                    {formData.assignedTeamMembers.map(memberId => {
                      const member = TEAM_MEMBERS.find(m => m.value === memberId)
                      if (!member) return null
                      return (
                        <div 
                          key={memberId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {member.label.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{member.label}</p>
                              <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => updateFormData({
                              assignedTeamMembers: formData.assignedTeamMembers.filter(id => id !== memberId)
                            })}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {formData.assignedTeamMembers.length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No team members assigned</p>
                    <p className="text-xs text-gray-400 mt-1">Select from the dropdown above</p>
                  </div>
                )}
              </div>
            </div>

            {/* SALES CONSULTANT */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  Sales Consultant
                </h3>
              </div>
              <div className="p-4">
                <Input
                  label="Rep Name"
                  value={formData.salesConsultantName}
                  onChange={value => updateFormData({ salesConsultantName: value })}
                  placeholder="Enter sales rep name"
                />
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-xl border shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone size={18} className="text-primary" />
                  Call Client
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Mail size={18} className="text-primary" />
                  Send Email
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <CalendarCheck size={18} className="text-primary" />
                  Convert to Job
                </button>
              </div>
            </div>


            <div className="flex items-center justify-end gap-3 mb-5">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* SCHEDULE PREVIEW MODAL */}
      {showSchedulePreview && formData.isScheduled && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSchedulePreview(false)}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Schedule Preview</h3>
              <button 
                onClick={() => setShowSchedulePreview(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar size={28} className="text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{formData.jobType || 'No job type'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium">{getSchedulePreview()}</p>
                  </div>
                </div>

                {formData.assignedTeamMembers.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Team Members</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.assignedTeamMembers.map(id => {
                          const member = TEAM_MEMBERS.find(m => m.value === id)
                          return member ? (
                            <span key={id} className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              {member.label}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm font-medium">
                      {formData.address}{formData.unit ? `, ${formData.unit}` : ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formData.city}, {formData.state} {formData.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button 
                onClick={() => setShowSchedulePreview(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90">
                Edit Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================= COLLAPSIBLE SECTION COMPONENT ================= */

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  badge?: string
}

function CollapsibleSection({ 
  title, 
  icon, 
  children, 
  isExpanded, 
  onToggle,
  badge 
}: CollapsibleSectionProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}