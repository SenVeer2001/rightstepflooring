"use client"

import { useState } from "react"
import { STAFF_STATUS_LABELS } from "../types/staffTypes"
import { ImageIcon, X } from "lucide-react"

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

interface FormErrors {
  name?: string
  phone?: string
  field?: string
  type?: string
  area?: string
}

export function StaffModal({ isOpen, onClose, onSubmit }: StaffModalProps) {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    field: "",
    type: "",
    skills: "",
    area: "",
    status: "active",
    imageFile: null as File | null,
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  if (!isOpen) return null

  /* ===================== VALIDATION ===================== */

  const validateForm = () => {
    const errors: FormErrors = {}

    if (!formValues.name.trim()) {
      errors.name = "Name is required"
    }

    if (!/^\d{10}$/.test(formValues.phone)) {
      errors.phone = "Phone must be 10 digits"
    }

    if (!formValues.field.trim()) {
      errors.field = "Field is required"
    }

    if (!formValues.type.trim()) {
      errors.type = "Type is required"
    }

    if (!formValues.area.trim()) {
      errors.area = "Area is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

 /* ===================== IMAGE HANDLERS ===================== */

const handleImageUpload = (selectedFile: File | null) => {
  if (!selectedFile) return

  // Validate file size (5MB)
  if (selectedFile.size > 5 * 1024 * 1024) {
    alert("Image size must be less than 5MB")
    return
  }

  setFormValues({ ...formValues, imageFile: selectedFile })

  const previewUrl = URL.createObjectURL(selectedFile)
  setImagePreview(previewUrl)
}

const handleRemoveImage = () => {
  if (imagePreview) {
    URL.revokeObjectURL(imagePreview)
  }

  setFormValues({ ...formValues, imageFile: null })
  setImagePreview(null)
}

  const handleSubmit = () => {
    if (!validateForm()) return

    onSubmit({
      ...formValues,
      skills: formValues.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    })
  }

  /* ===================== INPUT CLASS ===================== */

  const inputClass =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">Add Staff</h2>

        {/* Image Upload */}
<div className="flex items-center gap-4">
  <div className="relative w-24 h-24 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
    {imagePreview ? (
      <>
        <img
          src={imagePreview}
          alt="Staff"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
          title="Remove image"
        >
          <X size={14} className="text-red-600" />
        </button>
      </>
    ) : (
      <ImageIcon className="text-gray-400" />
    )}
  </div>

  <div className="space-y-1">
    <p className="text-sm font-semibold text-gray-900">
      Staff Image
    </p>
    <p className="text-xs text-gray-500">
      JPG, PNG up to 5MB
    </p>

    <label className="inline-block mt-2">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) =>
          handleImageUpload(event.target.files?.[0] || null)
        }
      />
      <span className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-100">
        Upload Image
      </span>
    </label>
  </div>
</div>


        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <input
              placeholder="Name"
              className={inputClass}
              value={formValues.name}
              onChange={(event) =>
                setFormValues({ ...formValues, name: event.target.value })
              }
            />
            {formErrors.name && (
              <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              placeholder="Phone"
              maxLength={10}
              className={inputClass}
              value={formValues.phone}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  phone: event.target.value.replace(/\D/g, ""),
                })
              }
            />
            {formErrors.phone && (
              <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
            )}
          </div>

          {/* Field */}
          <div>
            <input
              placeholder="Field"
              className={inputClass}
              value={formValues.field}
              onChange={(event) =>
                setFormValues({ ...formValues, field: event.target.value })
              }
            />
            {formErrors.field && (
              <p className="text-xs text-red-600 mt-1">{formErrors.field}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <input
              placeholder="Type (Full-time / Contract)"
              className={inputClass}
              value={formValues.type}
              onChange={(event) =>
                setFormValues({ ...formValues, type: event.target.value })
              }
            />
            {formErrors.type && (
              <p className="text-xs text-red-600 mt-1">{formErrors.type}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <input
              placeholder="Skills (comma separated)"
              className={inputClass}
              value={formValues.skills}
              onChange={(event) =>
                setFormValues({ ...formValues, skills: event.target.value })
              }
            />
          </div>

          {/* Area */}
          <div>
            <input
              placeholder="Area"
              className={inputClass}
              value={formValues.area}
              onChange={(event) =>
                setFormValues({ ...formValues, area: event.target.value })
              }
            />
            {formErrors.area && (
              <p className="text-xs text-red-600 mt-1">{formErrors.area}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <select
              className={inputClass}
              value={formValues.status}
              onChange={(event) =>
                setFormValues({ ...formValues, status: event.target.value })
              }
            >
              {Object.entries(STAFF_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
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
            Save Staff
          </button>
        </div>
      </div>
    </div>
  )
}
