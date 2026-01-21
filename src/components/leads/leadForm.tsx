import { useState } from "react"
import SelectReact from "react-select"
import { Calendar, Upload, X } from "lucide-react"

import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_SOURCES,
} from "../LeadModal"
import type { LeadFormData } from "../LeadModal"

import Select from "../ui/Select"
import Input from "../ui/Input"

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

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl border p-6 space-y-8">

      {/* CLIENT DETAILS */}
      <FormSection title="Client Details">
        <Input
          label="Client name"
          value={formData.clientName}
          // @ts-ignore
          error={errors.clientName}
          onChange={value =>
            onChange({ ...formData, clientName: value })
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
          // @ts-ignore
          error={errors.phone}
          onChange={value =>
            onChange({
              ...formData,
              phone: value.replace(/\D/g, ""),
            })
          }
        />

        <Input
          label="Email"
          value={formData.email}
          // @ts-ignore
          error={errors.email}
          onChange={value =>
            onChange({ ...formData, email: value })
          }
        />
      </FormSection>

      {/* SERVICE LOCATION */}
      <FormSection title="Service Location">
        <Input
          label="Address"
          value={formData.address}
           // @ts-ignore
          error={errors.address}
          onChange={value =>
            onChange({ ...formData, address: value })
          }
        />

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
          // @ts-ignore
          error={errors.city}
          onChange={value =>
            onChange({ ...formData, city: value })
          }
        />

        <Select
          label="State"
          value={formData.state}
           // @ts-ignore
          error={errors.state}
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
               // @ts-ignore
              error={errors.scheduleDate}
              onChange={value =>
                onChange({ ...formData, scheduleDate: value })
              }
            />
            <Input
              label="Start time"
              type="time"
              value={formData.startTime}
               // @ts-ignore
              error={errors.startTime}
              onChange={value =>
                onChange({ ...formData, startTime: value })
              }
            />
            <Input
              label="End time"
              type="time"
              value={formData.endTime}
               // @ts-ignore
              error={errors.endTime}
              onChange={value =>
                onChange({ ...formData, endTime: value })
              }
            />
          </div>
        )}
      </div>

      {/* JOB DETAILS */}
      <FormSection title="Job Details">
        <Select
          label="Job type"
          value={formData.jobType}
           // @ts-ignore
          error={errors.jobType}
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
           // @ts-ignore
          value={formData.source}
          onChange={value =>
             // @ts-ignore
            onChange({ ...formData, source: value })
          }
        >
          {LEAD_SOURCES.map(source => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </Select>

        <Textarea
          label="Job description"
          value={formData.jobDescription}
          error={errors.jobDescription}
           // @ts-ignore
          onChange={value =>
            onChange({ ...formData, jobDescription: value })
          }
        />
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

      {/* NOTES */}
      <Textarea
        label="Notes"
        value={formData.notes}
         // @ts-ignore
        onChange={value =>
          onChange({ ...formData, notes: value })
        }
      />

      {/* ACTIONS */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary text-white rounded-lg font-semibold"
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

function Textarea({ label, value, onChange, error }: any) {
  return (
    <div className="md:col-span-2">
      <label className="text-xs font-semibold block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
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
