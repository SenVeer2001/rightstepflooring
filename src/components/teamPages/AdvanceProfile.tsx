import { Info } from 'lucide-react'
import React from 'react'

function AdvanceProfile() {
  return (
    <div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* LEFT COLUMN */}
    <div className="space-y-8">

      {/* WORKIZ SYNC EMAIL */}
      <div>
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          Workiz sync email
          <Info size={14} className="text-gray-400" />
        </label>

        <input
          type="email"
          placeholder="Email"
          className="mt-2 w-full rounded-lg border  px-4 py-2.5 text-sm bg-gray-50
                     focus:ring-2 focus:ring-primary focus:bg-white outline-none "
        />
      </div>

      {/* ALLOWED IP ADDRESSES */}
      <div>
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          Allowed IP addresses
          <Info size={14} className="text-gray-400" />
        </label>

        <select
          className="mt-2 w-full rounded-lg border px-4 py-2.5 text-sm bg-gray-50
                     focus:ring-2 focus:ring-primary focus:bg-white"
        >
          <option value="">
            Leave empty if all IPs apply
          </option>
          <option value="office">Office IP</option>
          <option value="warehouse">Warehouse IP</option>
        </select>
      </div>

      {/* PERMISSIONS */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Permissions
        </h3>

        <div className="space-y-3 text-sm text-gray-700">

          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 accent-primary" />
            <span>
              Send text message to all the user’s phone numbers when sending them a job
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 accent-primary" />
            <span>
              Notify user of account-wide incoming messages (app only)
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 accent-primary" />
            <span>
              Notify user of account-wide outgoing messages (app only)
            </span>
          </label>

        </div>
      </div>

    </div>

    {/* RIGHT COLUMN */}
    <div className="space-y-8">

      {/* USER SIGNATURE */}
      <div>
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          User signature
          <Info size={14} className="text-gray-400" />
        </label>

        <textarea
          rows={7}
          placeholder={`Example:
Name / Position
Company name
Phone number
Website (hyperlinked)`}
          className="mt-2 w-full rounded-lg border px-4 py-3 text-sm bg-gray-50
                     focus:ring-2 focus:ring-primary focus:bg-white resize-none"
        />

        {/* SIMPLE EDITOR TOOLBAR (UI ONLY) */}
        <div className="mt-2 flex flex-wrap gap-2 border rounded-lg p-2 bg-gray-50">
          {['B', 'I', 'U', '•', '1.', 'H1', 'H2', 'H3', '🔗', '🖼️'].map(tool => (
            <button
              key={tool}
              type="button"
              className="px-2 py-1 text-xs border rounded-md
                         hover:bg-primary hover:text-white transition"
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

    </div>

  </div>
    </div>
  )
}

export default AdvanceProfile