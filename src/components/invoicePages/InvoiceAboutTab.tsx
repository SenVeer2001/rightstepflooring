import { ChevronDown, Phone, Mail, Plus } from "lucide-react"
import { useState } from "react"

export default function InvoiceAboutTab({ invoice }: { invoice: any }) {
  const [openAddresses, setOpenAddresses] = useState(true)
  const [openContacts, setOpenContacts] = useState(false)
  const [openPayments, setOpenPayments] = useState(false)

  return (
    <div className="space-y-5">

      {/* ================= CONTACT ================= */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">CONTACT</p>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-900">
              {invoice.clientName}
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Phone size={14} />
              (919) 795-0860
            </p>

            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Mail size={14} />
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        <button className="mt-3 text-sm text-primary font-semibold">
          + Add tag
        </button>
      </div>

      {/* ================= ADDRESSES ================= */}
      <div className="border rounded-lg">
        <button
          onClick={() => setOpenAddresses(!openAddresses)}
          className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold"
        >
          <span>Addresses</span>
          <ChevronDown
            size={16}
            className={`transition ${openAddresses ? "rotate-180" : ""}`}
          />
        </button>

        {openAddresses && (
          <div className="px-4 pb-4 text-sm text-gray-600">
            5534 Jessip St,<br />
            Morrisville, North Carolina 27560
          </div>
        )}
      </div>

      {/* ================= ADDITIONAL CONTACTS ================= */}
      <div className="border rounded-lg">
        <button
          onClick={() => setOpenContacts(!openContacts)}
          className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold"
        >
          <span>Additional contacts (0)</span>
          <ChevronDown
            size={16}
            className={`transition ${openContacts ? "rotate-180" : ""}`}
          />
        </button>

        {openContacts && (
          <div className="px-4 pb-4 text-sm text-gray-600 space-y-2">
            <p>No additional contacts</p>

            <button className="flex items-center gap-1 text-primary text-sm font-semibold">
              <Plus size={14} />
              Add contact
            </button>
          </div>
        )}
      </div>

      {/* ================= PAYMENT METHODS ================= */}
      <div className="border rounded-lg">
        <button
          onClick={() => setOpenPayments(!openPayments)}
          className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold"
        >
          <span>Payment methods (1)</span>
          <ChevronDown
            size={16}
            className={`transition ${openPayments ? "rotate-180" : ""}`}
          />
        </button>

        {openPayments && (
          <div className="px-4 pb-4 text-sm text-gray-600">
            Visa •••• 4242
          </div>
        )}
      </div>
    </div>
  )
}
