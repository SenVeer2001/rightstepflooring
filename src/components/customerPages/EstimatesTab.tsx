import { Plus, FileText, Download, Trash2 } from "lucide-react"

interface Estimate {
  id: number
  number: string
  date: string
  amount: number
  status: "draft" | "sent" | "accepted" | "declined"
}

interface EstimatesTabProps {
  estimates?: Estimate[]
  onAddEstimate?: () => void
}

export function EstimatesTab({ estimates = [], onAddEstimate }: EstimatesTabProps) {
  const statusStyles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Estimates</h2>
        <button
          onClick={onAddEstimate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold"
        >
          <Plus size={18} />
          Create Estimate
        </button>
      </div>

      {/* Estimates List */}
      {estimates.length > 0 ? (
        <div className="space-y-3">
          {estimates.map((estimate) => (
            <div key={estimate.id} className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-primary" />
                  <div>
                    <p className="font-semibold text-gray-900">Estimate #{estimate.number}</p>
                    <p className="text-sm text-gray-600">{estimate.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${estimate.amount.toLocaleString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[estimate.status]}`}>
                      {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 text-primary hover:bg-blue-50 rounded">
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">No estimates created yet</p>
        </div>
      )}
    </div>
  )
}
