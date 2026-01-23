import { ChevronDown, Info, Upload, X } from 'lucide-react'
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Select from '../ui/Select'

function Profilepage() {
    const [formData, setFormData] = useState({
        profileImage: null,
        bio: 'Experienced technician ready to assist with your needs. Committed to delivering reliable service and ensuring customer satisfaction.',
        trackLocation: true,
        callMasking: false,
        twoFA: true,
        userType: 'Subcontractor',
        name: 'Anthony McLeod',
        email: 'anthonycleod1963@gmail.com',
        homeAddress: '123 Main Street, Suite 100',
        countryCode: '+1',
        phone: '(811) 228-0926',
        additionalPhones: [] as string[],
        role: 'Select',
        assignToJobs: true,
        laborCost: 0,
        jobTypes: 'Leave empty if all skills apply',
        serviceAreas: 'Service areas',
        scheduleColor: '#22c55e',
        notes: '',
    })

    const [additionalPhoneInput, setAdditionalPhoneInput] = useState('')
    const [showAdditionalPhoneInput, setShowAdditionalPhoneInput] = useState(false)
    const [additionalPhoneValue, setAdditionalPhoneValue] = useState('')
    const [role, setRole] = useState("Tech")
    const [jobType, setJobType] = useState("")
    const [serviceArea, setServiceArea] = useState("")



    return (
        <div className=" px-4 lg:px-6 py-6">
            {/* <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">User Settings</h1>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg transition">
                    Save
                </button>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT CARD */}
                <div className="bg-white border rounded-2xl p-6 space-y-6 shadow-sm">

                    {/* PROFILE IMAGE */}
                    <div className="flex items-center gap-5">
                        <div className="relative h-28 w-28 rounded-full border-2 border-dashed border-primary bg-primary/10 flex items-center justify-center">
                            <span className="text-xs text-center text-gray-600 font-medium">
                                Upload<br />Image
                            </span>
                            <button className="absolute -bottom-1 -right-1 bg-primary p-2 rounded-full shadow hover:bg-primary transition">
                                <Upload size={14} className="text-white" />
                            </button>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Profile picture <span className="text-xs text-gray-500 font-normal">(Public)</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Max 25MB of image files can be uploaded
                            </p>
                        </div>
                    </div>

                    {/* BIO */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                            Short bio <Info size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-normal">Public</span>
                        </label>
                        <textarea
                            rows={4}
                            value={formData.bio}
                            onChange={(e) =>
                                setFormData({ ...formData, bio: e.target.value })
                            }
                            className={inputBase}
                            placeholder="Experienced technician ready to assist…"
                        />
                    </div>

                    {/* TRACK LOCATION */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            checked={formData.trackLocation}
                            onChange={(e) => setFormData({ ...formData, trackLocation: e.target.checked })}
                            className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer"
                        />
                        <label className="text-sm text-gray-700 flex items-center gap-1 cursor-pointer">
                            Track location <Info size={14} className="text-gray-400" />
                        </label>
                    </div>

                    {/* USER DETAILS SECTION */}
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-semibold text-gray-900">User details</h3>

                        {/* USER TYPE DROPDOWN */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">User type</label>
                            <select
                                value={formData.userType}
                                onChange={(e) =>
                                    setFormData({ ...formData, userType: e.target.value })
                                }
                                className={inputBase + ' appearance-none'}
                            >
                                <option>Subcontractor</option>
                                <option>Employee</option>
                                <option>Manager</option>
                                <option>Admin</option>
                            </select>
                        </div>

                        {/* NAME INPUT */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={inputBase}
                                placeholder="Full name"
                            />
                        </div>

                        {/* EMAIL INPUT */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={inputBase}
                                placeholder="Email address"
                            />
                        </div>

                        {/* HOME ADDRESS */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Home address</label>
                            <input
                                type="text"
                                value={formData.homeAddress}
                                onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                                className={inputBase}
                                placeholder="Street address"
                            />
                        </div>

                        {/* PHONE SECTION */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Phone
                            </label>

                            <PhoneInput
                                country="us"                 // 🇺🇸 default
                                value={additionalPhoneValue}
                                onChange={(phone) => setAdditionalPhoneValue(phone)}
                                enableSearch
                                countryCodeEditable={false}
                                containerClass="!w-full"
                                inputClass="
    !w-full
    !border
    !rounded-lg
    !py-2.5
    !text-sm
    !bg-gray-50
    focus:!ring-2
    focus:!ring-primary
  "
                                buttonClass="
    !border
    !border-gray-300
    !rounded-l-lg
    !bg-white
  "
                                dropdownClass="!text-sm"
                            />

                        </div>


                        {/* ADDITIONAL PHONE NUMBERS */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Additional phone numbers
                            </label>

                            {/* ADD BUTTON */}
                            {!showAdditionalPhoneInput && (
                                <button
                                    onClick={() => setShowAdditionalPhoneInput(true)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
                                >
                                    + Add phone
                                </button>
                            )}

                            {/* PHONE INPUT */}
                            {showAdditionalPhoneInput && (
                                <div className="mt-3 space-y-2">
                                    <PhoneInput
                                        country="us"               // 🇺🇸 default USA
                                        value={additionalPhoneValue}
                                        onChange={(phone) => setAdditionalPhoneValue(phone)}
                                        enableSearch
                                        containerClass="!w-full"
                                        inputClass="
                                                    !w-full
                                                    !border
                                                    !rounded-lg
                                                    !py-2.5
                                                    !pl-14
                                                    !text-sm
                                                    !bg-gray-50
                                                    focus:!ring-2
                                                    focus:!ring-primary
                                                    "
                                        buttonClass="!border !border-gray-300 !rounded-l-lg"
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                if (!additionalPhoneValue) return

                                                setFormData({
                                                    ...formData,
                                                    additionalPhones: [
                                                        ...formData.additionalPhones,
                                                        additionalPhoneValue,
                                                    ],
                                                })

                                                setAdditionalPhoneValue('')
                                                setShowAdditionalPhoneInput(false)
                                            }}
                                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => {
                                                setAdditionalPhoneValue('')
                                                setShowAdditionalPhoneInput(false)
                                            }}
                                            className="px-4 py-2 border rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}


                            {formData.additionalPhones.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {formData.additionalPhones.map((phone, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-700">{phone}</span>

                                            <button
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        additionalPhones: formData.additionalPhones.filter(
                                                            (_, i) => i !== idx
                                                        ),
                                                    })
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* CALL MASKING */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                checked={formData.callMasking}
                                onChange={(e) => setFormData({ ...formData, callMasking: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                            />
                            <label className="text-sm text-gray-700 cursor-pointer flex items-center gap-1">
                                Call masking <Info size={14} className="text-gray-400" />
                            </label>
                        </div>

                        {/* TWO-FACTOR AUTHENTICATION */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.twoFA}
                                onChange={(e) => setFormData({ ...formData, twoFA: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary"
                            />
                            <label className="text-sm text-gray-700 cursor-pointer">
                                Two-factor authentication
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="bg-white border rounded-2xl p-6 space-y-6 shadow-sm">

                    {/* ROLES AND PERMISSIONS */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-semibold text-gray-900">Roles and permissions</label>
                            <Info size={16} className="text-gray-400 cursor-help" />
                        </div>

                        <Select
                            label="Role"
                            value={role}
                            onChange={setRole}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Estimator">Estimator</option>
                            <option value="Tech">Tech</option>
                        </Select>
                        <label className="flex items-center gap-2 mt-4 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.assignToJobs}
                                onChange={(e) => setFormData({ ...formData, assignToJobs: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className="text-gray-700">Assign to jobs</span>
                        </label>

                        <a href="#" className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block">
                            Customize roles and permissions <span className="text-blue-500">→</span>
                        </a>
                    </div>

                    {/* LABOR COST PER HOUR */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-1 mb-2">
                            Labor cost per hour <Info size={14} className="text-gray-400" />
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={formData.laborCost}
                                onChange={(e) => setFormData({ ...formData, laborCost: parseFloat(e.target.value) })}
                                className={inputBase}
                                min={0}
                                placeholder="00:00"
                            />
                            <div className="flex items-center justify-center px-4 border rounded-lg bg-gray-50 font-semibold text-gray-700 min-w-12">
                                $
                            </div>
                        </div>
                    </div>

                    {/* JOB TYPES */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Job types</label>
                        <label className="text-xs text-gray-500 mb-2 block">User skills</label>
                        <Select
                            label="Job type"
                            value={jobType}
                            onChange={setJobType}
                        >
                            <option value="">All job types</option>
                            <option value="painting">Painting</option>
                            <option value="flooring">Flooring</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">Removing a skill may affect online booking availability</p>
                    </div>

                    {/* SERVICE AREAS */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Service areas</label>
                        <Select
                            label="Service area"
                            value={serviceArea}
                            onChange={setServiceArea}
                        >
                            <option value="">All service areas</option>
                            <option value="north">North Zone</option>
                            <option value="south">South Zone</option>
                            <option value="east">East Zone</option>
                            <option value="west">West Zone</option>
                        </Select>
                    </div>

                    {/* SCHEDULE COLOR */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 mb-3 block">Schedule color</label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                '#84e5d1', '#60a5fa', '#6366f1', '#14b8a6',
                                '#84cc16', '#eab308', '#f97316', '#ef4444',
                                '#ec4899', '#a78bfa', '#000000', '#64748b',
                                '#f4d03f', '#f5b041', '#e59866', '#ec7063',
                                '#af7ac5', '#85c1e2', '#76d7c4', '#b5ead7',
                                '#c7ceea', '#ffd89b',
                            ].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setFormData({ ...formData, scheduleColor: color })}
                                    className={`h-8 w-8 rounded-full border-2 transition hover:scale-110
                    ${formData.scheduleColor === color ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400' : 'border-transparent'}
                  `}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* NOTES */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Notes</label>
                        <textarea
                            rows={4}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className={inputBase}
                            placeholder="Add information that other admins need to see"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profilepage

/* INPUT BASE */
const inputBase =
    'w-full border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
