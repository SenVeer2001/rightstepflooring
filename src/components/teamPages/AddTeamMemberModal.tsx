import { X, ChevronDown } from "lucide-react"
import { useState } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

const ROLE_OPTIONS = ["Admin", "Manager", "Sales Tech", "Tech","Field Manager"]

export function AddTeamMemberModal({ isOpen, onClose, onSave }: Props) {
  const [activeTab, setActiveTab] =
    useState<"user" | "subcontractor">("user")

  const [isRoleOpen, setIsRoleOpen] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    roles: [] as string[],
    callMasking: false,
    fieldTech: "Yes",
    trackLocation: "Yes",
  })

  if (!isOpen) return null

  const toggleRole = (roleName: string) => {
    setFormData((previousData) => ({
      ...previousData,
      roles: previousData.roles.includes(roleName)
        ? previousData.roles.filter((r) => r !== roleName)
        : [...previousData.roles, roleName],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-sm font-semibold">Add team member</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 border-b">
          {["user", "subcontractor"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 text-sm font-semibold transition
                ${activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
              `}
            >
              {tab === "user" ? "User" : "Subcontractor"}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4 text-sm">

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              An invitation will be sent to this email
            </p>
          </div>

          {/* NAME */}
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
          />

          {/* PHONE (react-phone-input-2) */}
          <div>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={(phoneValue) =>
                setFormData({ ...formData, phone: phoneValue })
              }
              inputStyle={{
                width: "100%",
                height: "40px",
                borderRadius: "8px",
                borderColor: "#d1d5db",
                background: "#f9fafb",
              }}
              buttonStyle={{
                borderRadius: "8px 0 0 8px",
              }}
            />
          </div>

          {/* CALL MASKING */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.callMasking}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  callMasking: event.target.checked,
                })
              }
              className="accent-primary"
            />
            Call masking
          </label>

          {/* ROLE DROPDOWN (MULTI SELECT) */}
          <div className="relative">
            <p className="font-semibold mb-1">Roles</p>

            <button
              type="button"
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50
                         flex justify-between items-center"
            >
              <span className="text-gray-700 text-sm">
                {formData.roles.length > 0
                  ? formData.roles.join(", ")
                  : "Select roles"}
              </span>
              <ChevronDown size={16} />
            </button>

            {isRoleOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow">
                {ROLE_OPTIONS.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="accent-primary"
                    />
                    {role}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full justify-between gap-2 ">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-nowrap">Field tech:</span>
            <select
              value={formData.fieldTech}
              onChange={(event) =>
                setFormData({ ...formData, fieldTech: event.target.value })
              }
              className="border rounded-lg px-3 py-2 "
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

        
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-nowrap">Track location:</span>
            <select
              value={formData.trackLocation}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  trackLocation: event.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 bg-gray-50"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          </div>
         
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
          >
            Invite user
          </button>
        </div>
      </div>
    </div>
  )
}
