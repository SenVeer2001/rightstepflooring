import { Search } from 'lucide-react'

interface ClientAddressesTabProps {
  clientId: string
}

export function ClientAddressesTab({ clientId }: ClientAddressesTabProps) {
  // Mock addresses data
  const addresses = [
    {
      id: "1",
      name: "2225 Charlotte Street",
      street: "2225 Charlotte Street",
      city: "Durham",
      state: "North Carolina",
      zip: "27705",
      jobs: "1",
      total: "2,578.95",
      due: "1289.47",
      pastDue: "1289.47",
    },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">State</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Zip code</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Jobs</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Due</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">past_due</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr
                key={address.id}
                className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{address.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.street}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.city}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.state}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.zip}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.jobs}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{address.total}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.due}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{address.pastDue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addresses.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-600">No addresses found for this client.</p>
        </div>
      )}
    </div>
  )
}
