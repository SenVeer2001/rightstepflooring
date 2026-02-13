type CustomerJobTabKey = "details" | "items" | "payments" | "estimates" | "attachments" | "tasks" | "equipment" | "workOrder" |"purchase"

interface CustomerJobTab {
  key: CustomerJobTabKey
  label: string
  count?: number
}

function CustomerJobTabs({
  activeTab,
  onChange,
}: {
  activeTab: CustomerJobTabKey
  onChange: (tab: CustomerJobTabKey) => void
}) {
  const tabs: CustomerJobTab[] = [
    { key: "details", label: "Details" },
    { key: "items", label: "Items", count: 2 },
    { key: "payments", label: "Payments", count: 0 },
    { key: "estimates", label: "Estimates", count: 1 },
    { key: "attachments", label: "Attachments", count: 0 },
    { key: "tasks", label: "Tasks", count: 0 },
    { key: "equipment", label: "Equipment", count: 0 },
    { key: "purchase", label: "Purchase Order", count: 2 },
    { key: "workOrder", label: "Work Order", count: 2 },

  ]

  return (
    <div className="flex gap-6 overflow-x-auto ml-2 border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`pb-3 text-sm sm:text-[16px] font-semibold border-b-2 transition
            ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {tab.label}
          {typeof tab.count === "number" && (
            <span className="ml-1 text-gray-600">
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default CustomerJobTabs
