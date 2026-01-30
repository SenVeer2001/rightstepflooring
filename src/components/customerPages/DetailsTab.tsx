import { useRef, useState } from "react"
import { Send, Upload, X } from "lucide-react"
import Input from "../ui/Input"
import Select from "../ui/Select"


interface DetailFormData {
  // Client
  firstName: string
  lastName: string
  companyName: string
  phone: string
  mobilePhone: string
  email: string
  address: string

  // Service Location
  unit: string
  city: string
  state: string
  zip: string

  // Job
  jobType: string
  jobSource: string
  jobDescription: string

  // Check List
  preferredName: string
  didCollectTools: boolean
  product: string
  preferredContact: string
  color: string
  desiredStartDate: string
  finalWalkthrough: string
  numberOfRooms: string
  squareFootage: string
  photosDocumented: boolean
  thankYouGift: string
  projectDeliveryTime: string
  salesQualifiers: string

  // Team
  assignTech: string
  techAssigned: string

  // Subcontractor Notes
  subcontractorNotes: string

  // Receipts
  receipts: string[]

  // Sales Consultant
  salesConsultantName: string

  // Schedule
  isScheduled: boolean
}
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Lucas Camarota Queiroz",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: "2",
    name: "Daniel Paiva",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
]

const STATES = ["IL", "IN", "MI", "OH", "WI", "MN", "MO", "IA", "NY", "NC"]

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

const LEAD_SOURCES = [
  "Google",
  "Facebook",
  "Website",
  "Referral",
  "Phone Call",
  "In Person",
  "Other",
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

interface DetailsTabProps {
  customerId: string
  customerData?: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    companyName?: string
  }
}
interface TeamMember {
  id: string
  name: string
  avatar: string
}

export function DetailsTab({ customerData }: DetailsTabProps) {
  const [isEditing, setIsEditing] = useState(true)
  const [newReceipt, setNewReceipt] = useState("")
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [notes, setNotes] = useState("")
  const [assignedTech, setAssignedTech] = useState("")

  const [schedule, setSchedule] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  })


  const [formData, setFormData] = useState<DetailFormData>({
    firstName: customerData?.name.split(" ")[0] || "",
    lastName: customerData?.name.split(" ")[1] || "",
    companyName: customerData?.companyName || "",
    phone: customerData?.phone || "",
    mobilePhone: "",
    email: customerData?.email || "",
    address: customerData?.address || "",
    unit: "",
    city: customerData?.city || "",
    state: customerData?.state || "",
    zip: customerData?.zip || "",
    jobType: "",
    jobSource: "",
    jobDescription: "",
    preferredName: "",
    didCollectTools: false,
    product: "",
    preferredContact: "",
    color: "",
    desiredStartDate: "",
    finalWalkthrough: "",
    numberOfRooms: "",
    squareFootage: "",
    photosDocumented: false,
    thankYouGift: "",
    projectDeliveryTime: "",
    salesQualifiers: "",
    assignTech: "",
    techAssigned: "",
    subcontractorNotes: "",
    receipts: [],
    salesConsultantName: "",
    isScheduled: false,
  })

  const handleAddReceipt = () => {
    if (newReceipt.trim()) {
      setFormData({
        ...formData,
        receipts: [...formData.receipts, newReceipt.trim()],
      })
      setNewReceipt("")
    }
  }

  const handleRemoveReceipt = (index: number) => {
    setFormData({
      ...formData,
      receipts: formData.receipts.filter((_, i) => i !== index),
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const remainingSlots = 5 - uploadedFiles.length

    if (remainingSlots <= 0) return

    setUploadedFiles(prev => [...prev, ...files.slice(0, remainingSlots)])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }



  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-3">

      <div className="lg:col-span-2  bg-white p-4 rounded-lg border border-gray-200">


        <div>
          <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Client</h3>
          <div className="grid grid-cols-2 gap-4  ">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={value => setFormData({ ...formData, firstName: value })}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={value => setFormData({ ...formData, lastName: value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 ">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={value => setFormData({ ...formData, companyName: value })}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={value => setFormData({ ...formData, phone: value.replace(/\D/g, "") })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4  mt-4  ">

            <Input
              label="Mobile Phone"
              value={formData.mobilePhone}
              onChange={value => setFormData({ ...formData, mobilePhone: value.replace(/\D/g, "") })}
            />
            <Input
              label="Email"
              value={formData.email}
              onChange={value => setFormData({ ...formData, email: value })}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Address"

              value={formData.address}
              onChange={value => setFormData({ ...formData, address: value })}
            />
          </div>
        </div>


        <div>
          <h3 className="text-[16px] font-semibold text-gray-900 mt-4">Service Location</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Unit"
              value={formData.unit}
              onChange={value => setFormData({ ...formData, unit: value })}
            />
            <Input
              label="City"
              value={formData.city}
              onChange={value => setFormData({ ...formData, city: value })}
            />
            <Select
              label="State"
              value={formData.state}
              onChange={value => setFormData({ ...formData, state: value })}
            >
              <option value="">Select state</option>
              {STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </Select>
            <Input
              label="Zip"
              value={formData.zip}
              onChange={value => setFormData({ ...formData, zip: value })}
            />
          </div>
        </div>

        {/* JOB DETAILS */}
        <div>
          <h3 className="text-[16px] font-semibold text-gray-900 mt-4">Job</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Select
              label="Job Type"
              value={formData.jobType}
              onChange={value => setFormData({ ...formData, jobType: value })}
            >
              <option value="">Select job type</option>
              {JOB_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
            <Select
              label="Job Source"
              value={formData.jobSource}
              onChange={value => setFormData({ ...formData, jobSource: value })}
            >
              <option value="">Select source</option>
              {LEAD_SOURCES.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </Select>
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              value={formData.jobDescription}
              onChange={value => setFormData({ ...formData, jobDescription: value })}
            />
          </div>
        </div>

        {/* CHECK LIST */}
        <div>
          <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Check List</h3>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <Input
              label="Preferred Name"
              value={formData.preferredName}
              onChange={value => setFormData({ ...formData, preferredName: value })}
            />
            <div className="flex items-center gap-3  justify-center">
              <label className="text-xs font-semibold block mb-2 text-gray-700">Did you collect all tools</label>
              <input
                type="checkbox"
                checked={formData.didCollectTools}
                onChange={e => setFormData({ ...formData, didCollectTools: e.target.checked })}
                className="h-5 w-5 accent-green-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Product"
              value={formData.product}
              onChange={value => setFormData({ ...formData, product: value })}
            />
            <Select
              label="Preferred Contact Method"
              value={formData.preferredContact}
              onChange={value => setFormData({ ...formData, preferredContact: value })}
            >
              <option value="">Select method</option>
              {CONTACT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Color"
              value={formData.color}
              onChange={value => setFormData({ ...formData, color: value })}
            />
            <Input
              label="Desired Project Start Date"
              type="date"
              value={formData.desiredStartDate}
              onChange={value => setFormData({ ...formData, desiredStartDate: value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">

            <Select
              label="Final Walk Through"
              value={formData.finalWalkthrough}
              onChange={value => setFormData({ ...formData, finalWalkthrough: value })}
            >
              <option value="">Select option</option>
              {FINAL_WALK_THROUGH_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
            <Input
              label="Number of Rooms"
              type="number"
              value={formData.numberOfRooms}
              onChange={value => setFormData({ ...formData, numberOfRooms: value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">

            <Input
              label="Square Footage"
              type="number"
              value={formData.squareFootage}
              onChange={value => setFormData({ ...formData, squareFootage: value })}
            />
            <div className="mt-4 flex gap-2 items-center justify-center">
              <label className="text-xs font-semibold block mb-2 text-gray-700">Photos Properly documented in Company.Com</label>
              <input
                type="checkbox"
                checked={formData.photosDocumented}
                onChange={e => setFormData({ ...formData, photosDocumented: e.target.checked })}
                className="h-5 w-5 accent-green-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Thank you gift to customer"
              value={formData.thankYouGift}
              onChange={value => setFormData({ ...formData, thankYouGift: value })}
            />
            <Input
              label="Project Delivery Time"
              value={formData.projectDeliveryTime}
              onChange={value => setFormData({ ...formData, projectDeliveryTime: value })}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Select
              label="Sales Qualifiers"
              value={formData.salesQualifiers}
              onChange={value => setFormData({ ...formData, salesQualifiers: value })}
            >
              <option value="">Select qualifier</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
              <option value="disqualified">Disqualified</option>
            </Select>
          </div>
        </div>






        {/* SALES CONSULTANT */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Sales Consultant</h3>
          <Input
            label="Rep Name"
            value={formData.salesConsultantName}
            onChange={value => setFormData({ ...formData, salesConsultantName: value })}
          />
        </div>
      </div>


      <div className="lg:col-span-1">
        <div className="sticky top-4 space-y-4">

          <div className="bg-white border rounded-xl p-6 space-y-6">


            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {scheduleEnabled ? "This job is scheduled" : "This job is unscheduled"}
                </p>
              </div>


              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`relative w-12 h-6 rounded-full transition
        ${scheduleEnabled ? "bg-primary" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition
          ${scheduleEnabled ? "left-6" : "left-1"}`}
                />
              </button>
            </div>


            {scheduleEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={schedule.startDate}
                    onChange={(e) =>
                      setSchedule({ ...schedule, startDate: e.target.value })
                    }
                    className="input"
                  />
                </div>


                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      setSchedule({ ...schedule, startTime: e.target.value })
                    }
                    className="input"
                  />
                </div>


                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    End date
                  </label>
                  <input
                    type="date"
                    value={schedule.endDate}
                    onChange={(e) =>
                      setSchedule({ ...schedule, endDate: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    End time
                  </label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      setSchedule({ ...schedule, endTime: e.target.value })
                    }
                    className="input"
                  />
                </div>
              </div>
            )}
          </div>



          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Job Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.isScheduled ? "Scheduled" : "Unscheduled"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Job Type</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.jobType || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Client</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 space-y-6">

            {/* TEAM SECTION */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Team</h3>

                <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold transition">
                  <Send size={14} />
                  Send
                </button>
              </div>


              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-800">{member.name}</span>
                  </div>
                ))}
              </div>

              {/* ASSIGN TECH */}
              <select
                value={assignedTech}
                onChange={(e) => setAssignedTech(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm bg-gray-50
                     focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Assign a Tech</option>
                <option value="tech-1">Tech 1</option>
                <option value="tech-2">Tech 2</option>
              </select>

              <p className="text-xs text-gray-500 mt-1">
                <span className="font-semibold text-gray-800">18</span> techs can perform{" "}
                <span className="font-semibold">Tile Install</span>
              </p>
            </div>

            {/* SUBCONTRACTOR NOTES */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Subcontractor Notes
              </h3>

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Subcontractor Notes"
                className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50
                     focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* UPLOAD RECEIPTS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Upload Receipts Here
              </h3>

              <div className="flex flex-wrap gap-3">

                {/* ADD FILE BOX */}
                {uploadedFiles.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-14 w-14 border-2 border-dashed rounded-lg
                         flex items-center justify-center
                         bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <Upload className="text-gray-600" />
                  </button>
                )}

                {/* FILE PREVIEWS */}
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative h-14 w-14 rounded-lg border bg-gray-100
                         flex items-center justify-center text-xs text-center px-1"
                  >
                    <span className="truncate">{file.name}</span>

                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                    >
                      <X size={12} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                You can choose up to 5 files
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 lg:col-span-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border text-sm border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-primary text-sm text-white rounded-lg font-semibold  transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>



    </div>
  )
}







function Textarea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold block mb-1 text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none resize-none"
      />
    </div>
  )
}
