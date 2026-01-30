type ClientTabKey =  "jobs" | "estimates" | "invoices" | "payments" | "addresses" | "custom-fields"

interface ClientTabItem {
  key: ClientTabKey
  label: string
  count?: number
}

interface ClientTabsProps {
  activeTab: ClientTabKey
  onChange: (tab: ClientTabKey) => void
  jobCount?: number
  estimateCount?: number
  invoiceCount?: number
  paymentCount?: number
  addressCount?: number
}

function ClientTabs({
  activeTab,
  onChange,
  jobCount = 0,
  estimateCount = 0,
  invoiceCount = 0,
  paymentCount = 0,
  addressCount = 0,
}: ClientTabsProps) {
  const tabs: ClientTabItem[] = [
    // { key: "details", label: "Details" },
    { key: "jobs", label: "Jobs", count: jobCount },
    { key: "estimates", label: "Estimates", count: estimateCount },
    { key: "invoices", label: "Invoices", count: invoiceCount },
    { key: "payments", label: "Payments", count: paymentCount },
    { key: "addresses", label: "Addresses", count: addressCount },
    { key: "custom-fields", label: "Custom Fields" },
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
                : "border-transparent text-gray-600 hover:text-gray-700"
            }
          `}
        >
          {tab.label}
          {typeof tab.count === "number" && tab.count > 0 && (
            <span className="ml-1 text-gray-600">
              ({tab.count})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default ClientTabs
