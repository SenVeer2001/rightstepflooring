export default function CompanySettings() {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-6">

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Company Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide the company information below
        </p>
      </div>

      {/* COMPANY INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Company Name" />
        <Input label="Company Email Address" />
        <Input label="Phone Number" />
        <Input label="Fax" />
        <Input label="Website" />
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function Input({ label }: { label: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-700 mb-1 block">
        {label}
      </label>
      <input
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
      />
    </div>
  )
}
