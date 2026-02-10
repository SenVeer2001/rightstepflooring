"use client"

import { X, Search, FileText } from "lucide-react"
import { useState } from "react"

interface CreateEstimateModalProps {
  open: boolean
  onClose: () => void
  onSelectClient: (clientId: string) => void
  onAddNewClient: () => void
}

export default function CreateEstimateModal({
  open,
  onClose,
  onSelectClient,
  onAddNewClient,
}: CreateEstimateModalProps) {
  const [search, setSearch] = useState("")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div className="flex justify-center pt-8">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="text-primary" size={28} />
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center mt-4 px-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Estimate
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Before we proceed, please select a client
          </p>
        </div>

        {/* SEARCH */}
        <div className="px-6 mt-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email or phone"
              className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm
                         focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* MOCK RESULT (replace with real data later) */}
          {search && (
            <div
            //   onClick={() => onSelectClient("client-id-1")}
              className="mt-2 border rounded-lg px-3 py-2 text-sm
                         cursor-pointer hover:bg-gray-50"
            >
              John Smith · john@gmail.com
            </div>
          )}
        </div>

        {/* OR */}
        <div className="flex items-center gap-3 px-6 mt-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ADD NEW CLIENT */}
        <div className="px-6 py-6 text-center">
          <button
            onClick={onAddNewClient}
            className="text-primary font-semibold text-sm hover:underline"
          >
            + Add new client
          </button>
        </div>
      </div>
    </div>
  )
}
