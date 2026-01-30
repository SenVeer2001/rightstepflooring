

import { useState } from "react"
import { X } from "lucide-react"

/* ===================== PROPS ===================== */

interface AddJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  title: string
}
// hello
// sdfghjkl
interface FormErrors {
  clientName?: string
  phone?: string
  jobType?: string
  endDate?: string
}

/* ===================== STATIC OPTIONS ===================== */

const cityOptions = ["New York", "Los Angeles", "Chicago", "Houston"]
const stateOptions = ["NY", "CA", "IL", "TX"]
const teamMemberOptions = ["Mike Johnson", "Lisa Brown", "Tom Davis", "Emma Wilson"]

/* ===================== COMPONENT ===================== */

export function AddJobModal({
  isOpen,
  onClose,
  onSubmit,
  title,
}: AddJobModalProps) {
  const [formValues, setFormValues] = useState({
    clientName: "",
    companyName: "",
    phone: "",
    email: "",

    jobType: "",
    jobDescription: "",
    jobSource: "",

    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",

    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",

    allDay: false,
    teamMembers: [] as string[],
    selectedTeamMember: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  if (!isOpen) return null

  /* ===================== VALIDATION ===================== */

  const validateForm = () => {
    const errors: FormErrors = {}

    if (!formValues.clientName.trim()) {
      errors.clientName = "Client name is required"
    }

    if (!/^\d{10}$/.test(formValues.phone)) {
      errors.phone = "Phone must be 10 digits"
    }

    if (!formValues.jobType.trim()) {
      errors.jobType = "Job type is required"
    }

    if (!formValues.allDay) {
      const start = new Date(`${formValues.startDate} ${formValues.startTime}`)
      const end = new Date(`${formValues.endDate} ${formValues.endTime}`)

      if (end <= start) {
        errors.endDate = "End date must be greater than start date"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /* ===================== TEAM MEMBER HANDLERS ===================== */

  const handleAddTeamMember = () => {
    if (
      formValues.selectedTeamMember &&
      !formValues.teamMembers.includes(formValues.selectedTeamMember)
    ) {
      setFormValues({
        ...formValues,
        teamMembers: [...formValues.teamMembers, formValues.selectedTeamMember],
        selectedTeamMember: "",
      })
    }
  }

  const handleRemoveTeamMember = (member: string) => {
    setFormValues({
      ...formValues,
      teamMembers: formValues.teamMembers.filter(
        (teamMember) => teamMember !== member
      ),
    })
  }

  /* ===================== SUBMIT ===================== */

  const handleSubmit = () => {
    if (!validateForm()) return
    onSubmit(formValues)
    onClose()
  }

  /* ===================== STYLES ===================== */

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"

  const disabledClass =
    "bg-gray-100 cursor-not-allowed opacity-70"

  const sectionClass =
    "bg-white border border-gray-200 rounded-xl p-5 space-y-4"

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-gray-50 w-full max-w-6xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
          {/* CLIENT DETAILS */}
          <div className={sectionClass}>
            <h3 className="font-semibold text-[17px]">Client Details</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                placeholder="Client name"
                className={inputClass}
                value={formValues.clientName}
                onChange={(e) =>
                  setFormValues({ ...formValues, clientName: e.target.value })
                }
              />
              <input
                placeholder="Company name"
                className={inputClass}
                value={formValues.companyName}
                onChange={(e) =>
                  setFormValues({ ...formValues, companyName: e.target.value })
                }
              />
              <input
                placeholder="Phone"
                maxLength={10}
                className={inputClass}
                value={formValues.phone}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
              <input
                placeholder="Email"
                className={inputClass}
                value={formValues.email}
                onChange={(e) =>
                  setFormValues({ ...formValues, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* SERVICE LOCATION */}
          <div className={sectionClass}>
            <h3 className="font-semibold text-[17px]">Service Location</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                placeholder="Address"
                className={inputClass}
                value={formValues.address}
                onChange={(e) =>
                  setFormValues({ ...formValues, address: e.target.value })
                }
              />

              <select
                className={inputClass}
                value={formValues.city}
                onChange={(e) =>
                  setFormValues({ ...formValues, city: e.target.value })
                }
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                className={inputClass}
                value={formValues.state}
                onChange={(e) =>
                  setFormValues({ ...formValues, state: e.target.value })
                }
              >
                <option value="">Select State</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <input
                placeholder="Zip"
                className={inputClass}
                value={formValues.zip}
                onChange={(e) =>
                  setFormValues({ ...formValues, zip: e.target.value })
                }
              />
            </div>
          </div>

          {/* JOB DETAILS */}
          <div className={sectionClass}>
            <h3 className="font-semibold text-[17px]">Job Details</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                placeholder="Job type"
                className={inputClass}
                value={formValues.jobType}
                onChange={(e) =>
                  setFormValues({ ...formValues, jobType: e.target.value })
                }
              />
              <input
                placeholder="Job source"
                className={inputClass}
                value={formValues.jobSource}
                onChange={(e) =>
                  setFormValues({ ...formValues, jobSource: e.target.value })
                }
              />
              <textarea
                placeholder="Job description"
                className={`${inputClass} md:col-span-3`}
                rows={3}
                value={formValues.jobDescription}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    jobDescription: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* SCHEDULE */}
          <div className={sectionClass}>
            <h3 className="font-semibold text-[17px]">Schedule</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="date"
                disabled={formValues.allDay}
                className={`${inputClass} ${
                  formValues.allDay ? disabledClass : ""
                }`}
                value={formValues.startDate}
                onChange={(e) =>
                  setFormValues({ ...formValues, startDate: e.target.value })
                }
              />
              <input
                type="time"
                disabled={formValues.allDay}
                className={`${inputClass} ${
                  formValues.allDay ? disabledClass : ""
                }`}
                value={formValues.startTime}
                onChange={(e) =>
                  setFormValues({ ...formValues, startTime: e.target.value })
                }
              />
              <input
                type="date"
                disabled={formValues.allDay}
                className={`${inputClass} ${
                  formValues.allDay ? disabledClass : ""
                }`}
                value={formValues.endDate}
                onChange={(e) =>
                  setFormValues({ ...formValues, endDate: e.target.value })
                }
              />
              <input
                type="time"
                disabled={formValues.allDay}
                className={`${inputClass} ${
                  formValues.allDay ? disabledClass : ""
                }`}
                value={formValues.endTime}
                onChange={(e) =>
                  setFormValues({ ...formValues, endTime: e.target.value })
                }
              />
            </div>

            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={formValues.allDay}
                onChange={(e) =>
                  setFormValues({ ...formValues, allDay: e.target.checked })
                }
              />
              All day event
            </label>

            {formErrors.endDate && (
              <p className="text-xs text-red-600">{formErrors.endDate}</p>
            )}
          </div>

          {/* ASSIGN TEAM */}
          <div className={sectionClass}>
            <h3 className="font-semibold text-[17px]">Assign Team Members</h3>

            <div className="flex gap-2">
              <select
                className={inputClass}
                value={formValues.selectedTeamMember}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    selectedTeamMember: e.target.value,
                  })
                }
              >
                <option value="">Select team member</option>
                {teamMemberOptions.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddTeamMember}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formValues.teamMembers.map((member) => (
                <span
                  key={member}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {member}
                  <button onClick={() => handleRemoveTeamMember(member)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-primary text-white rounded-lg font-semibold"
          >
            Save Job
          </button>
        </div>
      </div>
    </div>
  )
}
