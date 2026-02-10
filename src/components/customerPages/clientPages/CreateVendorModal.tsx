"use client"

import { X, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import type { Vendor } from "../../../types/vendor"

interface CreateVendorModalProps {
  open: boolean
  onClose: () => void
  onSave: (vendor: Vendor) => void
}

export function CreateVendorModal({
  open,
  onClose,
  onSave,
}: CreateVendorModalProps) {
  const [form, setForm] = useState<Vendor>({
    id: crypto.randomUUID(),
    name: "",
    paymentTerms: "COD",
    addresses: [
      { address: "", city: "", state: "", zip: "" },
    ],
    phones: [{ phone: "", ext: "" }],
    emails: [{ email: "" }],
  })

  if (!open) return null

  /* ================= HELPERS ================= */

  const updateField = (key: keyof Vendor, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  /* ================= ADDRESS ================= */

  const updateAddress = (index: number, key: string, value: string) => {
    const updated = [...form.addresses]
    updated[index] = { ...updated[index], [key]: value }
    updateField("addresses", updated)
  }

  /* ================= PHONE ================= */

  const updatePhone = (index: number, key: string, value: string) => {
    const updated = [...form.phones]
    updated[index] = { ...updated[index], [key]: value }
    updateField("phones", updated)
  }

  

  const updateEmail = (index: number, value: string) => {
    const updated = [...form.emails]
    updated[index] = { email: value }
    updateField("emails", updated)
  }

  return (
    <div className="fixed inset-0 z-[60]  flex justify-end bg-black/40">
      <div className="w-full max-w-md  bg-white h-full shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create vendor</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">

          {/* VENDOR NAME */}
          <input
            placeholder="Vendor name"
            value={form.name}
            onChange={e => updateField("name", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {/* ADDRESSES */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Addresses</p>

            {form.addresses.map((addr, index) => (
              <div key={index} className="space-y-2 border rounded-lg p-3">
                <input
                  placeholder="Address"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={addr.address}
                  onChange={e => updateAddress(index, "address", e.target.value)}
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="City"
                    className="border rounded px-3 py-2 text-sm"
                    value={addr.city}
                    onChange={e => updateAddress(index, "city", e.target.value)}
                  />
                  <input
                    placeholder="State"
                    className="border rounded px-3 py-2 text-sm"
                    value={addr.state}
                    onChange={e => updateAddress(index, "state", e.target.value)}
                  />
                  <input
                    placeholder="Zip code"
                    className="border rounded px-3 py-2 text-sm"
                    value={addr.zip}
                    onChange={e => updateAddress(index, "zip", e.target.value)}
                  />
                </div>

                {form.addresses.length > 1 && (
                  <button
                    onClick={() =>
                      updateField(
                        "addresses",
                        form.addresses.filter((_, i) => i !== index)
                      )
                    }
                    className="text-xs text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() =>
                updateField("addresses", [
                  ...form.addresses,
                  { address: "", city: "", state: "", zip: "" },
                ])
              }
              className="text-sm text-primary flex items-center gap-1"
            >
              <Plus size={14} /> Add address
            </button>
          </div>

          {/* CONTACT DETAILS */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Contact details</p>

            {/* PHONES */}
            {form.phones.map((p, index) => (
              <div key={index} className="grid grid-cols-3 gap-2">
                <input
                  placeholder="Phone number"
                  className="col-span-2 border rounded px-3 py-2 text-sm"
                  value={p.phone}
                  onChange={e => updatePhone(index, "phone", e.target.value)}
                />
                <input
                  placeholder="EXT"
                  className="border rounded px-3 py-2 text-sm"
                  value={p.ext}
                  onChange={e => updatePhone(index, "ext", e.target.value)}
                />
              </div>
            ))}

            <button
              onClick={() =>
                updateField("phones", [...form.phones, { phone: "", ext: "" }])
              }
              className="text-sm text-primary flex items-center gap-1"
            >
              <Plus size={14} /> Add phone
            </button>

            {/* EMAILS */}
            {form.emails.map((e, index) => (
              <input
                key={index}
                placeholder="Vendor email"
                className="w-full border rounded px-3 py-2 text-sm"
                value={e.email}
                onChange={ev => updateEmail(index, ev.target.value)}
              />
            ))}

            <button
              onClick={() =>
                updateField("emails", [...form.emails, { email: "" }])
              }
              className="text-sm text-primary flex items-center gap-1"
            >
              <Plus size={14} /> Add email
            </button>
          </div>

          {/* PAYMENT TERMS */}
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.paymentTerms}
            onChange={e => updateField("paymentTerms", e.target.value)}
          >
            <option value="COD">COD (cash on delivery)</option>
            <option value="NET_15">Net 15</option>
            <option value="NET_30">Net 30</option>
          </select>

          <textarea
            placeholder="Notes"
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm resize-none"
            onChange={e => updateField("notes", e.target.value)}
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(form)
              onClose()
            }}
            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold"
          >
            Create vendor
          </button>
        </div>
      </div>
    </div>
  )
}
