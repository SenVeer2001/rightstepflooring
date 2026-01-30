import { useState } from "react"
import SelectReact from "react-select"
import { Calendar, Upload, X } from "lucide-react"

import {
  LEAD_SOURCES,
} from "../LeadModal"
import type { LeadFormData } from "../LeadModal"

import Select from "../ui/Select"
import Input from "../ui/Input"
import Textarea from "../ui/Textarea"

const STATES = ["IL", "IN", "MI", "OH", "WI", "MN", "MO", "IA"]

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
  { value: "Hot", label: "Hot" },
  { value: "Urgent", label: "Urgent" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "High Value", label: "High Value" },
  { value: "Low Budget", label: "Low Budget" },
  { value: "Repeat Client", label: "Repeat Client" },
  { value: "VIP", label: "VIP" },
]

const CONTACT_METHODS = [
  "Phone",
  "Email",
  "Text",
  "In Person",
  "Video Call",
]

const FINAL_WALK_THROUGH_OPTIONS = [
  "Required",
  "Not Required",
  "Scheduled",
]

export function LeadForm({
  formData,
  onChange,
  onSubmit,
}: {
  formData: LeadFormData
  onChange: (data: LeadFormData) => void
  onSubmit: () => void
}) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newReceipt, setNewReceipt] = useState("")

  /* ================= VALIDATION ================= */

  const validateLeadForm = () => {
    const newErrors: Record<string, string> = {}

    // CLIENT
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits"
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address"
    }

    // LOCATION
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"

    // JOB
    if (!formData.jobType) newErrors.jobType = "Job type is required"
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required"
    }

    // SCHEDULE
    if (formData.isScheduled) {
      if (!formData.scheduleDate)
        newErrors.scheduleDate = "Schedule date is required"
      if (!formData.startTime)
        newErrors.startTime = "Start time is required"
      if (!formData.endTime)
        newErrors.endTime = "End time is required"
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
      onChange({
        ...formData,
        receipts: [...formData.receipts, newReceipt.trim()],
      })
      setNewReceipt("")
    }
  }

  const handleRemoveReceipt = (index: number) => {
    onChange({
      ...formData,
      receipts: formData.receipts.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-8">

      {/* CLIENT DETAILS */}
      <FormSection title="Client">
        <Input
          label="First Name"
          value={formData.clientName}
          onChange={value =>
            onChange({ ...formData, clientName: value })
          }
        />

        <Input
          label="Last Name"
          value={formData.companyName}
          onChange={value =>
            onChange({ ...formData, companyName: value })
          }
        />

        <Input
          label="Company name"
          value={formData.companyName}
          onChange={value =>
            onChange({ ...formData, companyName: value })
          }
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={value =>
            onChange({
              ...formData,
              phone: value.replace(/\D/g, ""),
            })
          }
        />

        <Input
          label="Mobile Phone"
          value={formData.mobilePhone}
          onChange={value =>
            onChange({
              ...formData,
              mobilePhone: value.replace(/\D/g, ""),
            })
          }
        />

        <Input
          label="Email"
          value={formData.email}
          onChange={value =>
            onChange({ ...formData, email: value })
          }
        />

        <Input
          label="Address"
          value={formData.address}
          onChange={value =>
            onChange({ ...formData, address: value })
          }
        />
      </FormSection>

      {/* SERVICE LOCATION */}
      <FormSection title="Service Location">
        <Input
          label="Unit"
          value={formData.unit}
          onChange={value =>
            onChange({ ...formData, unit: value })
          }
        />

        <Input
          label="City"
          value={formData.city}
          onChange={value =>
            onChange({ ...formData, city: value })
          }
        />

        <Select
          label="State"
          value={formData.state}
          onChange={value =>
            onChange({ ...formData, state: value })
          }
        >
          <option value="">Select state</option>
          {STATES.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>

        <Input
          label="Zip"
          value={formData.zip}
          onChange={value =>
            onChange({ ...formData, zip: value })
          }
        />
      </FormSection>

      {/* SCHEDULE */}
      <div className="bg-gray-50 border rounded-xl p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar size={16} /> Scheduled
          </h3>
          <input
            type="checkbox"
            checked={formData.isScheduled}
            onChange={e =>
              onChange({
                ...formData,
                isScheduled: e.target.checked,
              })
            }
            className="h-5 w-5 accent-primary"
          />
        </div>

        {formData.isScheduled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input
              label="Date"
              type="date"
              value={formData.scheduleDate}
              onChange={value =>
                onChange({ ...formData, scheduleDate: value })
              }
            />
            <Input
              label="Start time"
              type="time"
              value={formData.startTime}
              onChange={value =>
                onChange({ ...formData, startTime: value })
              }
            />
            <Input
              label="End time"
              type="time"
              value={formData.endTime}
              onChange={value =>
                onChange({ ...formData, endTime: value })
              }
            />
          </div>
        )}
      </div>

      {/* JOB DETAILS */}
      <FormSection title="Job">
        <Select
          label="Job type"
          value={formData.jobType}
          onChange={value =>
            onChange({ ...formData, jobType: value })
          }
        >
          <option value="">Select job type</option>
          {JOB_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        <Select
          label="Job source"
          value={formData.jobSource}
          onChange={value =>
            onChange({ ...formData, jobSource: value })
          }
        >
          <option value="">Select source</option>
          {LEAD_SOURCES.map(source => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>

        <Textarea
          label="Description"
          value={formData.jobDescription}
          onChange={value =>
            onChange({ ...formData, jobDescription: value })
          }
        />
      </FormSection>

      {/* TEAM */}
      <FormSection title="Team">
        <Input
          label="Assign A Tech"
          value={formData.assignTech}
          onChange={value =>
            onChange({ ...formData, assignTech: value })
          }
        />

        <Input
          label="Tech Assigned"
          value={formData.techAssigned}
          onChange={value =>
            onChange({ ...formData, techAssigned: value })
          }
        />
      </FormSection>

      {/* CHECK LIST */}
      <FormSection title="Check List">
        <Input
          label="Preferred Name"
          value={formData.preferredName}
          onChange={value =>
            onChange({ ...formData, preferredName: value })
          }
        />

        <div>
          <label className="text-xs font-semibold block mb-2">Did you collect all tools</label>
          <input
            type="checkbox"
            checked={formData.toolsCollected}
            onChange={e =>
              onChange({
                ...formData,
                toolsCollected: e.target.checked,
              })
            }
            className="h-5 w-5 accent-primary"
          />
        </div>

        <Input
          label="Product"
          value={formData.productType}
          onChange={value =>
            onChange({ ...formData, productType: value })
          }
        />

        <Select
          label="Preferred Contact Method"
          value={formData.preferredContactMethod}
          onChange={value =>
            onChange({ ...formData, preferredContactMethod: value })
          }
        >
          <option value="">Select method</option>
          {CONTACT_METHODS.map(method => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>

        <Input
          label="Color"
          value={formData.color}
          onChange={value =>
            onChange({ ...formData, color: value })
          }
        />

        <Input
          label="Desired Project Start Date"
          type="date"
          value={formData.projectStartDate}
          onChange={value =>
            onChange({ ...formData, projectStartDate: value })
          }
        />

        <Select
          label="Final Walk Through"
          value={formData.finalWalkThrough}
          onChange={value =>
            onChange({ ...formData, finalWalkThrough: value })
          }
        >
          <option value="">Select option</option>
          {FINAL_WALK_THROUGH_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <Input
          label="Number of Rooms"
          type="number"
          value={formData.numberOfRooms}
          onChange={value =>
            onChange({ ...formData, numberOfRooms: value })
          }
        />

        <Input
          label="Square Footage"
          type="number"
          value={formData.squareFootage}
          onChange={value =>
            onChange({ ...formData, squareFootage: value })
          }
        />

        <div>
          <label className="text-xs font-semibold block mb-2">Photos Properly documented in Company.Com</label>
          <input
            type="checkbox"
            checked={formData.photosDocumented}
            onChange={e =>
              onChange({
                ...formData,
                photosDocumented: e.target.checked,
              })
            }
            className="h-5 w-5 accent-primary"
          />
        </div>

        <Input
          label="Thank you gift to customer"
          value={formData.thankYouGift}
          onChange={value =>
            onChange({ ...formData, thankYouGift: value })
          }
        />

        <Input
          label="Project Delivery time"
          value={formData.projectDeliveryTime}
          onChange={value =>
            onChange({ ...formData, projectDeliveryTime: value })
          }
        />

        <Select
          label="Sales Qualifiers"
          value={formData.salesQualifiers}
          onChange={value =>
            onChange({ ...formData, salesQualifiers: value })
          }
        >
          <option value="">Select qualifier</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="disqualified">Disqualified</option>
        </Select>
      </FormSection>

      {/* TAGS */}
      <div>
        <label className="text-xs font-semibold mb-1 block">Tags</label>
        <SelectReact
          isMulti
          options={LEAD_TAG_OPTIONS}
          value={LEAD_TAG_OPTIONS.filter(option =>
            formData.tags.includes(option.value)
          )}
          onChange={selected =>
            onChange({
              ...formData,
              tags: selected ? selected.map(v => v.value) : [],
            })
          }
        />
      </div>

      {/* SUBCONTRACTOR NOTES */}
      <Textarea
        label="Subcontractor Notes"
        value={formData.subcontractorNotes}
        onChange={value =>
          onChange({ ...formData, subcontractorNotes: value })
        }
      />

      {/* UPLOAD RECEIPTS */}
      <FormSection title="Upload Receipts Here">
        <div className="md:col-span-2">
          <div className="flex gap-2 mb-4">
            <Input
              label="Receipt URL or File"
              value={newReceipt}
              onChange={setNewReceipt}
            />
            <button
              type="button"
              onClick={handleAddReceipt}
              className="mt-6 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-opacity-90"
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
                  <span className="text-sm text-gray-700">{receipt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReceipt(idx)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FormSection>

      {/* SALES CONSULTANT */}
      <FormSection title="Sales Consultant">
        <Input
          label="Rep Name"
          value={formData.salesConsultantName}
          onChange={value =>
            onChange({ ...formData, salesConsultantName: value })
          }
        />
      </FormSection>

      {/* NOTES */}
      <Textarea
        label="Notes"
        value={formData.notes}
        onChange={value =>
          onChange({ ...formData, notes: value })
        }
      />

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

/* ================= HELPERS ================= */

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )
}


