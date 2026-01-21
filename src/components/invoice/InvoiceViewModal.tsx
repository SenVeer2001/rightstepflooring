import { X, ExternalLink } from "lucide-react"
import { useState } from "react"
import InvoiceHistoryTab from "./InvoiceHistoryTab"
import InvoiceNotesTab from "./InvoiceNotesTab"
import InvoiceAboutTab from "./InvoiceAboutTab"

interface InvoiceViewModalProps {
  invoice: any
  onClose: () => void
}

export default function InvoiceViewModal({
  invoice,
  onClose,
}: InvoiceViewModalProps) {
  const [activeTab, setActiveTab] = useState<"about" | "history" | "notes">(
    "about"
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            {invoice.clientName}
          </h2>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ExternalLink size={18} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b">
          {[
            { id: "about", label: "About" },
            { id: "history", label: "History" },
            { id: "notes", label: "Notes" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-semibold transition
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-800"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "about" && <InvoiceAboutTab invoice={invoice} />}
          {activeTab === "history" && <InvoiceHistoryTab />}
          {activeTab === "notes" && <InvoiceNotesTab />}
        </div>
      </div>
    </div>
  )
}
