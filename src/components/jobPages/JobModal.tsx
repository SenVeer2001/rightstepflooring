import React, { useState } from 'react'
import { X, Edit2, Phone, MessageCircle, Plus, ChevronDown, Edit, Trash2 } from 'lucide-react'
import Select, { components } from 'react-select'
import type { MultiValue, OptionProps } from 'react-select'
import type { StylesConfig } from 'react-select'

/* ================= TAG STYLES & OPTIONS ================= */

type TagOption = {
    value: string
    label: string
}

const TAG_OPTIONS: TagOption[] = [
    { value: "Residential", label: "Residential" },
    { value: "Commercial", label: "Commercial" },
    { value: "Urgent", label: "Urgent" },
    { value: "High Priority", label: "High Priority" },
    { value: "Follow-up", label: "Follow-up" },
]

const tagSelectStyles: StylesConfig<TagOption, true> = {
    control: (base) => ({
        ...base,
        minHeight: "42px",
        borderRadius: "0.5rem",
        borderColor: "#d1d5db",
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        "&:hover": {
            borderColor: "var(--primary-color)",
        },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? "#e8f5e9" : "#ffffff",
        color: "#1f2937",
        "&:hover": {
            backgroundColor: "#f0f0f0",
        },
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: "#e8f5e9",
        borderRadius: "0.375rem",
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "#1f2937",
        fontSize: "14px",
    }),
}

const CheckboxOption = (props: OptionProps<TagOption, true>) => {
    return (
        <components.Option {...props}>
            <div className="flex items-center gap-2">
                <input type="checkbox" checked={props.isSelected} readOnly />
                <span>{props.label}</span>
            </div>
        </components.Option>
    )
}

interface Job {
    id: string
    jobNumber: string
    clientName: string
    companyName: string
    phone: string
    service: string
    technician: string
    status: "submitted" | "in-progress" | "pending" | "unscheduled"
    amount: number
    address: string
    city: string
    state: string
    zip: string
    country: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    tags: string
    jobType: string
    scheduled: string
    techAssigned: boolean
    timeInSchedule: string
    didYouComplete: boolean
    finalWalkthrough: boolean
    totalPrice: number
    projectDescription: string
}

interface JobModalProps {
    job: Job | null
    isOpen: boolean
    onClose: () => void
}

const statusOptions = ["Submitted", "In Progress", "Pending", "Unscheduled"]

const statusMap: Record<string, "submitted" | "in-progress" | "pending" | "unscheduled"> = {
    "Submitted": "submitted",
    "In Progress": "in-progress",
    "Pending": "pending",
    "Unscheduled": "unscheduled"
}

const teamMembers = [
    { id: 1, name: "Lucas Camarota Queiroz", image: "https://via.placeholder.com/40" },
    { id: 2, name: "Daniel Paiva", image: "https://via.placeholder.com/40" },
]

export function JobModal({ job, isOpen, onClose }: JobModalProps) {
    const [activeTab, setActiveTab] = useState("details")
    const [status, setStatus] = useState(job?.status || "submitted")
    const [showStatusDropdown, setShowStatusDropdown] = useState(false)

    // Notes section state
    const [expandedSections, setExpandedSections] = useState({
        notes: true,
        finance: true,
    })
    const [noteContent, setNoteContent] = useState("")
    const [notes, setNotes] = useState<string[]>([])
    const [showNoteSave, setShowNoteSave] = useState(false)

    // Finance section state
    const [financeData, setFinanceData] = useState({
        total: job?.totalPrice || 2878.95,
        due: (job?.totalPrice || 2878.95) / 2,
        techCost: 0,
        companyCost: 1400,
        paymentAmount: 0,
        paymentType: "Payment Type",
    })

    // Custom Fields state
    const [customFields, setCustomFields] = useState({
        preferredName: "",
        didCollectTools: "",
        product: "",
        preferredContact: "",
        color: "",
        desiredStartDate: "",
        finalWalkthrough: "",
        numRooms: "",
        projectDeliveryTime: "",
        salesQualifiers: "",
        subcontractorNotes: "",
        salesConsultant: "",
        uploadedReceipts: [] as { id: string; file: File; preview: string }[],
    })

    // Items state
    const [items, setItems] = useState<Array<{ id: number; description: string; quantity: number; price: number }>>([
        { id: 1, description: "Tile Installation", quantity: 1, price: 2000 },
        { id: 2, description: "Labor", quantity: 8, price: 100 },
    ])

    // Tags state
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const toggleSection = (section: "notes" | "finance") => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handleSaveNote = () => {
        if (noteContent.trim()) {
            setNotes([...notes, noteContent])
            setNoteContent("")
            setShowNoteSave(false)
        }
    }

    if (!isOpen || !job) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-30">
                    <h2 className="text-xl font-bold">Job ID: {job.jobNumber}</h2>
                    <div className="flex gap-2">
                        {/* <button className="p-2 hover:bg-gray-100 rounded">
              <Edit2 size={20} />
            </button> */}
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-8 px-6 pt-6 border-b sticky top-16 bg-white z-20">
                    {["Details", "Custom fields", "Items"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
                            className={`pb-3 text-sm font-medium transition ${activeTab === tab.toLowerCase().replace(" ", "")
                                ? "text-gray-900 border-b-2 border-primary"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="p-6">

                    {activeTab === "details" && (
                        <div className="space-y-6">

                            {/* SECTION 1: ID SECTION */}
                            <div>
                                <label className="text-sm f text-gray-600 ">Status</label>
                                <div className="relative mt-2">
                                    <button
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 w-full text-left font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                    {showStatusDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-primary rounded-lg shadow-lg z-30">
                                            {statusOptions.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setStatus(statusMap[option])
                                                        setShowStatusDropdown(false)
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 hover:bg-primary/10 first:rounded-t-lg last:rounded-b-lg text-sm transition"
                                                >
                                                    <div className="flex items-center gap-2 ">
                                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                        {option}
                                                    </div>

                                                </button>
                                            ))}
                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* CLIENT */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 ">Client</label>
                                <div className="mt-3">
                                    <div className="flex text-sm items-center gap-3">
                                        <div>
                                            <h3 className="font-semibold text-sm text-gray-900">{job.clientName}</h3>
                                            <p className="text-sm text-gray-600">{job.address}, {job.city}, {job.state} {job.zip}</p>
                                        </div>
                                        <div className="flex gap-2 ml-auto">
                                            <button className="p-2 text-primary hover:bg-blue-50 rounded">
                                                <Phone size={20} />
                                            </button>
                                            <button className="p-2 text-primary hover:bg-blue-50 rounded">
                                                <MessageCircle size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* JOB TYPE */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 ">Job Type</label>
                                <p className="text-sm font-semibold text-gray-900 mt-2">{job.jobType}</p>
                            </div>

                            {/* TAGS */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 ">Tags</label>
                                <div className="mt-3">
                                    <Select<TagOption, true>
                                        isMulti
                                        className="basic-multi-select"
                                        classNamePrefix="react-select"
                                        options={TAG_OPTIONS}
                                        value={TAG_OPTIONS.filter(tagOption =>
                                            selectedTags.includes(tagOption.value)
                                        )}
                                        onChange={(selectedTagOptions: MultiValue<TagOption>) => {
                                            const selectedTagValues = selectedTagOptions.map(
                                                tagOption => tagOption.value
                                            )
                                            setSelectedTags(selectedTagValues)
                                        }}
                                        components={{ Option: CheckboxOption }}
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        styles={tagSelectStyles}
                                    />
                                </div>
                            </div>

                            {/* SCHEDULE JOB */}
                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Schedule job</h3>
                                        <p className="text-sm text-gray-600">{job.scheduled === "Unscheduled" ? "This job is unscheduled" : job.scheduled}</p>
                                    </div>
                                    {/* <button className="p-2 hover:bg-gray-100 rounded">
                                        <Edit2 size={20} />
                                    </button> */}
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-5 rounded accent-primary" />
                                    </label>
                                </div>
                            </div>

                            {/* TEAM */}
                            <div className="border-t pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Team</h3>
                                <div className="space-y-3">
                                    {teamMembers.map(member => (
                                        <div key={member.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-10 h-10 rounded-full bg-gray-300"
                                                />
                                                <span className="font-medium text-sm text-gray-900">{member.name}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                                                    <Trash2 size={15} />
                                                </button>
                                                <button className="p-2 text-primary hover:bg-blue-50 rounded">
                                                    ➜
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 2: NOTES */}
                            <div className="border-t pt-6">
                                <div className="flex text-sm justify-between items-center mb-4">
                                    <button
                                        onClick={() => toggleSection("notes")}
                                        className="flex items-center gap-2 text-[15px] font-semibold text-gray-900 hover:text-primary transition"
                                    >
                                        <ChevronDown
                                            size={15}
                                            className={`transition-transform ${expandedSections.notes ? "rotate-0" : "-rotate-90"}`}
                                        />
                                        Notes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNoteSave(true)
                                            setExpandedSections(prev => ({ ...prev, notes: true }))
                                        }}
                                        className="p-2 text-primary hover:bg-blue-50 rounded"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                {expandedSections.notes && (
                                    <div className="space-y-4">
                                        {showNoteSave && (
                                            <div className="space-y-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                                                <textarea
                                                    value={noteContent}
                                                    onChange={(e) => setNoteContent(e.target.value)}
                                                    placeholder="Add note..."
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                                    rows={6}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setShowNoteSave(false)
                                                            setNoteContent("")
                                                        }}
                                                        className="px-6 py-1.5 text-sm text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveNote}
                                                        className="px-6 py-1.5 text-sm bg-primary text-white font-semibold rounded-md hover:bg-primary/90"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {notes.length > 0 && (
                                            <div className="space-y-2">
                                                {notes.map((note, idx) => (
                                                    <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                        <p className="text-gray-700">{note}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {notes.length === 0 && !showNoteSave && (
                                            <p className="text-gray-500 text-sm">No notes added yet</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* SECTION 3: FINANCE */}
                            <div className="border-t pt-6">
                                <button
                                    onClick={() => toggleSection("finance")}
                                    className="flex items-center text-[15px] gap-2 text-lg font-semibold text-gray-900 hover:text-primary transition mb-4"
                                >
                                    <ChevronDown
                                        size={15}
                                        className={`transition-transform ${expandedSections.finance ? "rotate-0" : "-rotate-90"}`}
                                    />
                                    Finance
                                </button>

                                {expandedSections.finance && (
                                    <div className="space-y-6">
                                        {/* Finance subsection */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-600 ">Finance</label>
                                            <div className="grid grid-cols-2 items-center gap-3">
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Total</label>
                                                    <div className='relative w-full'>
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                            $
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={financeData.total}
                                                            onChange={(e) => setFinanceData({ ...financeData, total: parseFloat(e.target.value) })}
                                                            placeholder="Total"
                                                            min={0}
                                                            className="w-full pl-7 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Due</label>
                                                    <div className='relative w-full'>
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                            $
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={financeData.due}
                                                            onChange={(e) => setFinanceData({ ...financeData, due: parseFloat(e.target.value) })}
                                                            placeholder="Due"
                                                            min={0}
                                                            className="w-full pl-7 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Tech Cost</label>
                                                    <div className='relative w-full'>
                                                        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                            $
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={financeData.techCost}
                                                            onChange={(e) => setFinanceData({ ...financeData, techCost: parseFloat(e.target.value) })}
                                                            placeholder="Tech Cost"
                                                            min={0}
                                                            className="w-full pl-7 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-600 block mb-1">Company Cost</label>
                                                    <div className='relative w-full'>
                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                            $
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={financeData.companyCost}
                                                            onChange={(e) => setFinanceData({ ...financeData, companyCost: parseFloat(e.target.value) })}
                                                            placeholder="Company Cost"
                                                            min={0}
                                                            className="w-full pl-7 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment subsection */}
                                        <div className="space-y-3 pt-4 border-t">
                                            <label className="text-sm font-semibold text-gray-600">Payment</label>
                                            <div className='flex gap-3'>
                                                <div className='relative w-full' >
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={financeData.paymentAmount}
                                                        onChange={(e) => setFinanceData({ ...financeData, paymentAmount: parseFloat(e.target.value) })}
                                                        min={0}
                                                        placeholder="Amount"
                                                        className="w-full pl-7 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                                    />
                                                </div>
                                                <select
                                                    value={financeData.paymentType}
                                                    onChange={(e) => setFinanceData({ ...financeData, paymentType: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                                >
                                                    <option>Payment Type</option>
                                                    <option>Credit Card</option>
                                                    <option>Bank Transfer</option>
                                                    <option>Check</option>
                                                    <option>Cash</option>
                                                </select>

                                            </div>
                                            <button className="mt-3 text-primary font-semibold hover:underline flex items-center gap-1 text-sm">
                                                <Plus size={16} /> Add payment
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {activeTab === "customfields" && (
                        <div className="space-y-6">

                            {/* CHECK LIST SECTION */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Check List</h3>
                                <div className="space-y-3">
                                    {/* Preferred Name */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Preferred Name</label>
                                        <input
                                            type="text"
                                            placeholder="preferred name"
                                            value={customFields.preferredName}
                                            onChange={(e) => setCustomFields({ ...customFields, preferredName: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        />
                                    </div>

                                    {/* Did you collect all tools */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Did you collect all tools</label>
                                        <select
                                            value={customFields.didCollectTools}
                                            onChange={(e) => setCustomFields({ ...customFields, didCollectTools: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        >
                                            <option value="">Select did you collect all tools</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                            <option value="partial">Partial</option>
                                        </select>
                                    </div>

                                    {/* Product */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Product</label>
                                        <input
                                            type="text"
                                            placeholder="product"
                                            value={customFields.product}
                                            onChange={(e) => setCustomFields({ ...customFields, product: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        />
                                    </div>

                                    {/* Preferred Contact Method */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Preferred Contact Method</label>
                                        <select
                                            value={customFields.preferredContact}
                                            onChange={(e) => setCustomFields({ ...customFields, preferredContact: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        >
                                            <option value="">Select preferred contact method</option>
                                            <option value="phone">Phone</option>
                                            <option value="email">Email</option>
                                            <option value="sms">SMS</option>
                                            <option value="whatsapp">WhatsApp</option>
                                        </select>
                                    </div>

                                    {/* Color */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Color</label>
                                        <input
                                            type="text"
                                            placeholder="color"
                                            value={customFields.color}
                                            onChange={(e) => setCustomFields({ ...customFields, color: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        />
                                    </div>

                                    {/* Desired Project Start Date */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Desired Project Start Date</label>
                                        <input
                                            type="date"
                                            value={customFields.desiredStartDate}
                                            onChange={(e) => setCustomFields({ ...customFields, desiredStartDate: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        />
                                    </div>

                                    {/* Final Walk Through */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Final Walk Through</label>
                                        <select
                                            value={customFields.finalWalkthrough}
                                            onChange={(e) => setCustomFields({ ...customFields, finalWalkthrough: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        >
                                            <option value="">Select final walk through</option>
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="scheduled">Scheduled</option>
                                        </select>
                                    </div>

                                    {/* Number of Rooms */}
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 block mb-1 uppercase">Number of Rooms</label>
                                        <input
                                            type="number"
                                            placeholder="number of rooms"
                                            value={customFields.numRooms}
                                            onChange={(e) => setCustomFields({ ...customFields, numRooms: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* PROJECT DELIVERY TIME */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 block mb-2 uppercase">Project Delivery Time</label>
                                <input
                                    type="text"
                                    placeholder="project delivery time"
                                    value={customFields.projectDeliveryTime}
                                    onChange={(e) => setCustomFields({ ...customFields, projectDeliveryTime: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                />
                            </div>

                            {/* SALES QUALIFIERS */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 block mb-2 uppercase">Sales Qualifiers</label>
                                <select
                                    value={customFields.salesQualifiers}
                                    onChange={(e) => setCustomFields({ ...customFields, salesQualifiers: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                >
                                    <option value="">Select sales qualifiers</option>
                                    <option value="hot">Hot Lead</option>
                                    <option value="warm">Warm Lead</option>
                                    <option value="cold">Cold Lead</option>
                                </select>
                            </div>

                            {/* SUBCONTRACTOR NOTES */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 block mb-2 uppercase">Subcontractor Notes</label>
                                <textarea
                                    placeholder="subcontractor notes"
                                    value={customFields.subcontractorNotes}
                                    onChange={(e) => setCustomFields({ ...customFields, subcontractorNotes: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition resize-none"
                                    rows={4}
                                />
                            </div>

                            {/* UPLOAD RECEIPTS */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 block mb-2 uppercase">Upload Receipts</label>

                                {/* Uploaded Images Grid */}
                                {customFields.uploadedReceipts.length > 0 && (
                                    <div className="mb-4 grid grid-cols-2 gap-4">
                                        {customFields.uploadedReceipts.map((receipt) => (
                                            <div key={receipt.id} className="relative group">
                                                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={receipt.preview}
                                                        alt="Receipt"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => setCustomFields({
                                                            ...customFields,
                                                            uploadedReceipts: customFields.uploadedReceipts.filter(r => r.id !== receipt.id)
                                                        })}
                                                        className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add More Button */}
                                        {customFields.uploadedReceipts.length < 5 && (
                                            <label className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition cursor-pointer flex items-center justify-center group">
                                                <span className="text-primary font-semibold text-2xl">+</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file && customFields.uploadedReceipts.length < 5) {
                                                            const reader = new FileReader()
                                                            reader.onload = (event) => {
                                                                setCustomFields({
                                                                    ...customFields,
                                                                    uploadedReceipts: [
                                                                        ...customFields.uploadedReceipts,
                                                                        {
                                                                            id: Date.now().toString(),
                                                                            file: file,
                                                                            preview: event.target?.result as string
                                                                        }
                                                                    ]
                                                                })
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Initial Upload Area */}
                                {customFields.uploadedReceipts.length === 0 && (
                                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary hover:bg-opacity-5 transition cursor-pointer">
                                        <span className="text-primary font-semibold text-2xl">+</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const reader = new FileReader()
                                                    reader.onload = (event) => {
                                                        setCustomFields({
                                                            ...customFields,
                                                            uploadedReceipts: [{
                                                                id: Date.now().toString(),
                                                                file: file,
                                                                preview: event.target?.result as string
                                                            }]
                                                        })
                                                    }
                                                    reader.readAsDataURL(file)
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                                <p className="text-sm text-gray-500 mt-2">You can upload up to 5 images</p>
                            </div>

                            {/* SALES CONSULTANT */}
                            <div className="border-t pt-6">
                                <label className="text-sm font-semibold text-gray-600 block mb-2 uppercase">Sales Consultant</label>
                                <select
                                    value={customFields.salesConsultant}
                                    onChange={(e) => setCustomFields({ ...customFields, salesConsultant: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none hover:border-primary transition"
                                >
                                    <option value="">Select rep name</option>
                                    <option value="john">John Smith</option>
                                    <option value="jane">Jane Doe</option>
                                    <option value="mike">Mike Johnson</option>
                                </select>
                            </div>

                        </div>
                    )}

                    {activeTab === "items" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">Job Items</h3>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold">
                                    <Plus size={18} />
                                    Add Item
                                </button>
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No items added yet</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 border-b">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold">Description</th>
                                                <th className="px-4 py-3 text-right font-semibold">Quantity</th>
                                                <th className="px-4 py-3 text-right font-semibold">Price</th>
                                                <th className="px-4 py-3 text-right font-semibold">Total</th>
                                                <th className="px-4 py-3 text-center font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => (
                                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3">{item.description}</td>
                                                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right">${item.price.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-right font-semibold">${(item.quantity * item.price).toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button className="p-1.5 text-primary hover:bg-blue-50 rounded">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setItems(items.filter(i => i.id !== item.id))}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* TOTAL SECTION */}
                            {items.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                                    <div className="flex justify-end gap-8">
                                        <div>
                                            <p className="text-gray-600 text-sm">Subtotal:</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                ${items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}

export default JobModal
