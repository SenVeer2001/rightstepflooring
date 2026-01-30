import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

interface CustomerJobHeaderProps {
  customerName: string
  customerId: string
  jobNumber?: string
  clientPhone?: string
}

function CustomerJobHeader({ customerName, customerId, jobNumber, clientPhone }: CustomerJobHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
        title="Go back"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{customerName}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {jobNumber && `Job ID: ${jobNumber} • `}
          Customer ID: {customerId}
          {clientPhone && ` • ${clientPhone}`}
        </p>
      </div>
    </div>
  )
}

export default CustomerJobHeader
