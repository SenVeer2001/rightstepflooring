

import { useState } from "react"
import { X } from "lucide-react"

export default function AddRoleModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (name: string) => void
}) {
  const [roleName, setRoleName] = useState("")

  if (!open) return null

  const handleSave = () => {
    if (!roleName.trim()) return
    onSave(roleName.trim())
    setRoleName("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add New Role</h2>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">
              Role name
            </label>
            <input
              value={roleName}
              onChange={e => setRoleName(e.target.value)}
              placeholder="e.g. Installer, Supervisor"
              className="w-full border outline-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-full text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold"
          >
            Save Role
          </button>
        </div>
      </div>
    </div>
  )
}
