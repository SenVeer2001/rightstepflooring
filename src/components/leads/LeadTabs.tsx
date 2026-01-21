type LeadTabKey = "details" | "estimates" | "attachments" | "tasks"

interface LeadTab {
  key: LeadTabKey
  label: string
  count?: number
}

function LeadTabs({
  activeTab,
  onChange,
}: {
  activeTab: LeadTabKey
  onChange: (tab: LeadTabKey) => void
}) {
  const tabs: LeadTab[] = [
    { key: "details", label: "Details" },
    { key: "estimates", label: "Estimates", count: 1 },
    { key: "attachments", label: "Attachments", count: 0 },
    { key: "tasks", label: "Tasks", count: 0 },
  ]

  return (
    <div className="flex gap-6 overflow-x-auto ml-2">
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

export default LeadTabs
