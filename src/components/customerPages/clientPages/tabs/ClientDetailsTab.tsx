import { Edit2 } from 'lucide-react'

interface ClientData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  companyName?: string
}

interface ClientDetailsTabProps {
  clientData: ClientData
}

export function ClientDetailsTab({ clientData }: ClientDetailsTabProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Client Details</h2>
        {/* <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Edit2 size={16} />
          Edit
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Client Name
            </label>
            <p className="text-sm font-medium text-gray-900">{clientData.name}</p>
          </div>

          {/* Company */}
          {clientData.companyName && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Company Name
              </label>
              <p className="text-sm font-medium text-gray-900">{clientData.companyName}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Email
            </label>
            <a
              href={`mailto:${clientData.email}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {clientData.email}
            </a>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Phone
            </label>
            <a
              href={`tel:${clientData.phone}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {clientData.phone}
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Street Address
            </label>
            <p className="text-sm font-medium text-gray-900">{clientData.address}</p>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              City
            </label>
            <p className="text-sm font-medium text-gray-900">{clientData.city}</p>
          </div>

          {/* State and Zip */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                State
              </label>
              <p className="text-sm font-medium text-gray-900">{clientData.state}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Zip Code
              </label>
              <p className="text-sm font-medium text-gray-900">{clientData.zip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Client Since</p>
            <p className="text-sm font-medium text-gray-900 mt-2">January 2024</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Jobs</p>
            <p className="text-sm font-medium text-gray-900 mt-2">12</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Last Activity</p>
            <p className="text-sm font-medium text-gray-900 mt-2">2 days ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
