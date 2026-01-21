import { FileText, RefreshCw } from "lucide-react"

const historyData = [
  {
    title: "Job ID: 492 updated",
    subtitle: "Status: In progress",
    date: "Jan 8, 2026 • 2:48 PM • Daniel Paiva",
    icon: RefreshCw,
  },
  {
    title: "Invoice ID: 589 created",
    subtitle: "",
    date: "Jan 8, 2026 • 1:52 PM • Daniel Paiva",
    icon: FileText,
  },
]

export default function InvoiceHistoryTab() {
  return (
    <div className="space-y-4">
      <select className="w-full border rounded-lg px-3 py-2 text-sm">
        <option>All</option>
      </select>

      <div className="space-y-6">
        {historyData.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <item.icon size={16} className="text-primary" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
