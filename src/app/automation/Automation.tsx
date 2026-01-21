import { Plus, Zap } from "lucide-react"

const mockAutomations = [
  { id: 1, name: "Auto Follow-up", trigger: "Job Completed", action: "Send SMS to customer", status: "Active" },
  { id: 2, name: "Payment Reminder", trigger: "Invoice Overdue 3 days", action: "Send email reminder", status: "Active" },
  { id: 3, name: "Tech Assignment", trigger: "New Job Created", action: "Assign by skill & location", status: "Inactive" },
]

export function Automation() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Automation & Workflows</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          New Workflow
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Zap className="text-blue-600" size={20} />
        <div>
          <p className="font-semibold text-blue-900">Automation Engine</p>
          <p className="text-sm text-blue-700 mt-1">Create custom workflows to automate repetitive tasks and reduce manual work.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Workflow Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Trigger</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAutomations.map((auto) => (
              <tr key={auto.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{auto.name}</td>
                <td className="px-6 py-4 text-gray-600">{auto.trigger}</td>
                <td className="px-6 py-4 text-gray-600">{auto.action}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    auto.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {auto.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
