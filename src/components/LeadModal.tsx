

import { useState } from "react"
import Select, { components } from "react-select";
import type { MultiValue, OptionProps } from "react-select";



import { X, Upload, Calendar } from "lucide-react"
import type { StylesConfig } from "react-select"


/* ===================== TAG STYLES ===================== */

const tagSelectStyles: StylesConfig<
  { value: string; label: string },
  true
> = {
  control: base => ({
    ...base,
    minHeight: "42px",
    borderRadius: "0.75rem",
    borderColor: "#d9ead3",
    backgroundColor: "#f9fbf8",
  }),
}

/* ===================== CONSTANTS ===================== */

export const LEAD_STATUSES = ["new", "attempting_to_contact", "initial_contact_made", "qualifying", "scheduling_visit", "scheduled", "delayed", "contacted", "qualified", "proposal-sent", "follow-up", "closed-won", "closed-lost"] as const
export type LeadStatus = typeof LEAD_STATUSES[number]
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> =
  { new: "New", attempting_to_contact: "Attempting to Contact", initial_contact_made: "Initial Contact Made", qualifying: "Qualifying", scheduling_visit: "Scheduling Visit", scheduled: "Scheduled", delayed: "Delayed", contacted: "Contacted", qualified: "Qualified", "proposal-sent": "Proposal Sent", "follow-up": "Follow Up", "closed-won": "Closed Won", "closed-lost": "Closed Lost", }

const STATES = ["IL", "IN", "MI", "OH", "WI", "MN", "MO", "IA"]

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


export const LEAD_SOURCES = ["Google", "Facebook", "Instagram", "Website", "Phone Call", "WhatsApp", "Referral", "Walk-in",]
export const LEAD_TYPES = ["Flooring", "Carpet", "Tile", "Vinyl", "Wood", "Other",]

type TagOption = {
  value: string;
  label: string;
};

const TAG_OPTIONS: TagOption[] = [
  { value: "Hot", label: "Hot" },
  { value: "Urgent", label: "Urgent" },
  { value: "High Value", label: "High Value" },
  { value: "Follow-up", label: "Follow-up" },
];


/* ===================== TYPES ===================== */

export interface LeadFormData {
  /* Client */
  clientName: string
  companyName: string
  phone: string
  phoneExt: string
  mobilePhone: string
  email: string

  /* Location */
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
  startTime: string
  endTime: string

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
  title?:string

}

/* ===================== DEFAULT DATA ===================== */

const emptyLeadData: LeadFormData = {
  clientName: "",
  companyName: "",
  phone: "",
  phoneExt: "",
  mobilePhone: "",
  email: "",

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
  startTime: "",
  endTime: "",

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

export function LeadModal({ isOpen, onClose, onSubmit,title = 'Add New Lead' }: LeadModalProps) {
  const [leadData, setLeadData] = useState<LeadFormData>(emptyLeadData)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})


  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateLead()) return

    setIsSaving(true)
    await new Promise(res => setTimeout(res, 400))
    onSubmit(leadData)
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

  const validateLead = () => {
    const newErrors: Record<string, string> = {}

    /* CLIENT DETAILS */
    if (!leadData.clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }


    if (!leadData.phone) {
      newErrors.phone = "Phone number is required"
    }
    if (
      leadData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)
    ) {
      newErrors.email = "Invalid email format"
    }


    if (!leadData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!leadData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!leadData.state) {
      newErrors.state = "State is required"
    }


    if (!leadData.jobType.trim()) {
      newErrors.jobType = "Job type is required"
    }

    // if (!leadData.jobDescription.trim()) {
    //   newErrors.jobDescription = "Job description is required"
    // }

    /* SCHEDULE (ONLY IF ENABLED) */
    // if (leadData.isScheduled) {
    //   if (!leadData.scheduleDate) {
    //     newErrors.scheduleDate = "Schedule date is required"
    //   }

    //   if (!leadData.startTime) {
    //     newErrors.startTime = "Start time is required"
    //   }


    //   if (!leadData.endTime) {
    //     newErrors.endTime = "End time is required"
    //   }
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">Create Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">


          <div className="flex flex-col md:flex-row gap-4 justify-between">

            <Section title="Client Details">
              <Input label="Client name" value={leadData.clientName}
                onChange={(v: any) => setLeadData({ ...leadData, clientName: v })}
                error={errors.clientName}
              />
              <Input label="Company name" value={leadData.companyName} onChange={(v: any) => setLeadData({ ...leadData, companyName: v })} />
              <Input
                label="Phone"
                value={leadData.phone}
                onChange={(value: string) => {
                  const onlyNumbers = value.replace(/\D/g, "")
                  setLeadData({ ...leadData, phone: onlyNumbers })

                }}
                error={errors.phone}
              />

              <Input label="Ext" value={leadData.phoneExt} onChange={(v: any) => setLeadData({ ...leadData, phoneExt: v })} />
              <Input label="Email" value={leadData.email} onChange={(v: any) => setLeadData({ ...leadData, email: v })}
                error={errors.email}
              />
              <div>
                <label className="text-xs font-semibold block mb-1">Tags</label>
                <Select<TagOption, true>
                  isMulti
                  className="basic-multi-select"
                  classNamePrefix="react-select"
                  options={TAG_OPTIONS}
                  value={TAG_OPTIONS.filter(tagOption =>
                    leadData.tags.includes(tagOption.value)
                  )}
                  onChange={(selectedTagOptions: MultiValue<TagOption>) => {
                    const selectedTagValues = selectedTagOptions.map(
                      tagOption => tagOption.value
                    );

                    setLeadData({
                      ...leadData,
                      tags: selectedTagValues,
                    });
                  }}
                  components={{ Option: CheckboxOption }}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                />





              </div>
            </Section>


            <Section title="Service Location">
              <Input label="Address" value={leadData.address} onChange={(v: any) => setLeadData({ ...leadData, address: v })}
                error={errors.address}
              />
              <Input label="Unit" value={leadData.unit} onChange={(v: any) => setLeadData({ ...leadData, unit: v })} />
              <Input label="City" value={leadData.city} onChange={(v: any) => setLeadData({ ...leadData, city: v })}
                error={errors.city}
              />

              <SelectField
                label="State"
                value={leadData.state}
                options={STATES}
                onChange={(v: any) => setLeadData({ ...leadData, state: v })}
                error={errors.state}
              />

              <Input label="Zip" value={leadData.zip} onChange={(v: any) => setLeadData({ ...leadData, zip: v })} />
              <Input label="Metro area" value={leadData.metroArea} onChange={(v: any) => setLeadData({ ...leadData, metroArea: v })} />
            </Section>
          </div>

          <div className="flex flex-col md:flex-row gap-2 justify-between ">


            {/* JOB DETAILS */}
            <Section title="Job Details">

              <SelectField
                label="Job type"
                value={leadData.jobType}
                options={JOB_TYPES}
                onChange={(v: any) => setLeadData({ ...leadData, jobType: v })}
                error={errors.jobType}
              />

              <SelectField
                label="Job source"
                value={leadData.jobSource}
                options={LEAD_SOURCES}
                onChange={(v: any) => setLeadData({ ...leadData, jobSource: v })}

              />

              <Textarea
                label="Job description"
                value={leadData.jobDescription}
                onChange={(v: any) =>
                  setLeadData({ ...leadData, jobDescription: v })
                }
              />
            </Section>


            <Section title="Before & After Photos">
              <ImageUpload label="Before photo" image={leadData.beforeImage} onUpload={(e: any) => handleImageUpload(e, "before")} />
              <ImageUpload label="After photo" image={leadData.afterImage} onUpload={(e: any) => handleImageUpload(e, "after")} />
            </Section>


            <div className="border rounded-xl p-5 bg-gray-50 md:min-w-[38%]">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar size={18} /> Scheduled
                </h3>
                <input
                  type="checkbox"
                  checked={leadData.isScheduled}
                  onChange={e => setLeadData({ ...leadData, isScheduled: e.target.checked })}
                  className="accent-primary h-5 w-5"
                />
              </div>

              {leadData.isScheduled && (
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <Input label="Date" type="date" value={leadData.scheduleDate} onChange={(v: any) => setLeadData({ ...leadData, scheduleDate: v })} />
                  <Input label="Start time" type="time" value={leadData.startTime} onChange={(v: any) => setLeadData({ ...leadData, startTime: v })} />
                  <Input label="End time" type="time" value={leadData.endTime} onChange={(v: any) => setLeadData({ ...leadData, endTime: v })} />
                </div>
              )}
            </div>
          </div>
          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-semibold">
              {isSaving ? "Saving..." : "Create Lead"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

/* ===================== SMALL COMPONENTS ===================== */

function Section({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl w-full border p-5">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Input({ label, value, onChange, error, type = "text" }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 text-sm
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}


function Textarea({ label, value, onChange }: any) {
  return (
    <div className="md:col-span-2">
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      />
    </div>
  )
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div className="">
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Select</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function ImageUpload({ label, image, onUpload }: any) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-2">{label}</label>
      <div className="relative h-32 w-32 border-2 border-dashed hover:border-primary rounded-lg flex items-center justify-center bg-gray-50">
        {image ? (
          <img src={image} className="h-full w-full object-cover rounded-lg" />
        ) : (
          <>
            <Upload className="text-primary" />
            <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </>
        )}
      </div>
    </div>
  )
}


const CheckboxOption = (
  props: OptionProps<TagOption, true>
) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={props.isSelected}
          readOnly
        />
        <span>{props.label}</span>
      </div>
    </components.Option>
  );
};

