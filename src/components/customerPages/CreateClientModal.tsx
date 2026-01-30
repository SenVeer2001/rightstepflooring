import { X, Upload } from "lucide-react"
import { useState } from "react"
import Input from "../ui/Input"
import Select from "../ui/Select"

interface Props {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => void
}

export function CreateClientModal({ isOpen, onClose, onSave }: Props) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        phone: "",
        phoneExt: "",
        secondaryPhone: "",
        secondaryExt: "",
        email: "",
        adSource: "",
        allowBilling: false,
        taxExempt: false,

        address: "",
        unit: "",
        city: "",
        region: "",
        postalCode: "",
        country: "United States",

        customerType: "",
        clientRating: "",
        vipClient: "",
        jobRating: "",

        surveys: [] as File[],
    })

    if (!isOpen) return null

    /* ===================== FILE UPLOAD ===================== */
    const handleSurveyUpload = (files: FileList | null) => {
        if (!files) return
        const newFiles = Array.from(files).slice(0, 5 - formData.surveys.length)
        setFormData(prev => ({
            ...prev,
            surveys: [...prev.surveys, ...newFiles],
        }))
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl overflow-hidden">

                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Add new client</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* BODY */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">

                    {/* LEFT COLUMN */}
                    <div className="space-y-6">

                        {/* CLIENT DETAILS */}
                        <Section title="Client Details ">
                            <TwoCol>
                                <Input label="First Name" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} />
                                <Input label="Last Name" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} />
                            </TwoCol>

                            <Input label="Company Name" value={formData.companyName} onChange={v => setFormData({ ...formData, companyName: v })} />

                            <h4 className="text-sm font-semibold text-gray-700 mt-3">Contact Information</h4>

                            <TwoCol>
                                <Input label="Phone Number" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                                <Input label="Ext" value={formData.phoneExt} onChange={v => setFormData({ ...formData, phoneExt: v })} />
                            </TwoCol>

                            <TwoCol>
                                <Input label="Secondary Phone" value={formData.secondaryPhone} onChange={v => setFormData({ ...formData, secondaryPhone: v })} />
                                <Input label="Ext" value={formData.secondaryExt} onChange={v => setFormData({ ...formData, secondaryExt: v })} />
                            </TwoCol>

                            <Input label="Email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} />

                            <Select
                                label="Ad Source"
                                value={formData.adSource}
                                onChange={v => setFormData({ ...formData, adSource: v })}
                            >
                                <option value="">Select Ad Source</option>
                                <option>Google</option>
                                <option>Facebook</option>
                                <option>Referral</option>
                            </Select>

                            <Toggle
                                label="Allow Billing"
                                checked={formData.allowBilling}
                                 // @ts-ignore
                                onChange={v => setFormData({ ...formData, allowBilling: v })}
                            />

                            <Toggle
                                label="Tax Exempt"
                                checked={formData.taxExempt}
                                // @ts-ignore
                                onChange={v => setFormData({ ...formData, taxExempt: v })}
                            />
                        </Section>

                        {/* CUSTOMER TYPE */}
                        <Section title="Customer Type">
                            <Select
                                label="Business Type"
                                value={formData.customerType}
                                onChange={v => setFormData({ ...formData, customerType: v })}
                            >
                                <option value="">Select type</option>
                                <option>Residential</option>
                                <option>Commercial</option>
                            </Select>
                        </Section>

                        {/* JOB RATING */}
                        <Section title="Job Rating">
                            <Select
                                label="Rate the job"
                                value={formData.jobRating}
                                onChange={v => setFormData({ ...formData, jobRating: v })}
                            >
                                <option value="">Rate the job</option>
                                <option>⭐</option>
                                <option>⭐⭐</option>
                                <option>⭐⭐⭐</option>
                                <option>⭐⭐⭐⭐</option>
                                <option>⭐⭐⭐⭐⭐</option>
                            </Select>
                        </Section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">

                        {/* CLIENT ADDRESS */}
                        <Section title="Client Address">
                            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 mb-4">
                                Map preview (Google Maps)
                            </div>

                            <TwoCol>
                                <Input label="Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} />
                                <Input label="Unit" value={formData.unit} onChange={v => setFormData({ ...formData, unit: v })} />
                            </TwoCol>

                            <TwoCol>
                                <Input label="City" value={formData.city} onChange={v => setFormData({ ...formData, city: v })} />
                                <Input label="Region" value={formData.region} onChange={v => setFormData({ ...formData, region: v })} />
                            </TwoCol>

                            <TwoCol>
                                <Input label="Postal Code" value={formData.postalCode} onChange={v => setFormData({ ...formData, postalCode: v })} />
                                <Select
                                    label="Country"
                                    value={formData.country}
                                    onChange={v => setFormData({ ...formData, country: v })}
                                >
                                    <option>United States</option>
                                    <option>Canada</option>
                                </Select>
                            </TwoCol>
                        </Section>

                        {/* CLIENT RATING */}
                        <Section title="Client Rating">
                            <Select label="Rate experience with Client" value={formData.clientRating} onChange={v => setFormData({ ...formData, clientRating: v })}>
                                <option value="">Select rating</option>
                                <option>Excellent</option>
                                <option>Good</option>
                                <option>Average</option>
                                <option>Poor</option>
                            </Select>

                            <Select label="VIP Client" value={formData.vipClient} onChange={v => setFormData({ ...formData, vipClient: v })}>
                                <option value="">VIP Client</option>
                                <option>Yes</option>
                                <option>No</option>
                            </Select>
                        </Section>

                        {/* CUSTOMER SURVEY */}
                        <Section title="Customer Survey">
                            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <Upload size={18} className="text-gray-500" />
                                <span className="text-xs text-gray-500 mt-1">
                                    Upload Customer Survey (max 5 files)
                                </span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={e => handleSurveyUpload(e.target.files)}
                                />
                            </label>

                            {formData.surveys.length > 0 && (
                                <ul className="mt-3 space-y-1 text-xs">
                                    {formData.surveys.map((file, i) => (
                                        <li key={i} className="text-gray-700 truncate">
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Section>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border rounded-lg text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ===================== SMALL UI HELPERS ===================== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold mb-4">{title}</h3>
            {children}
        </div>
    )
}

function TwoCol({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-2 gap-4">{children}</div>
}



function Toggle({ label, checked, onChange }: any) {
    return (
        <label className="flex items-center justify-between text-sm mt-3">
            <span>{label}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="accent-primary w-5 h-5"
            />
        </label>
    )
}
