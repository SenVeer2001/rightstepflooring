

import { useState } from "react"
import CompanySettings from "./CompanySettings"
import { ChevronsRight, MoveRightIcon } from "lucide-react"

type WebsiteTab =
  | "Service_Plans_Manager"
  | "Automation_Center"
  | "Documents"
  | "Schedule_Settings"
  | "Lead_Status"
  | "Numbering"
  |"Security Center"

export default function WebsiteSettings() {
  const [activeSubTab, setActiveSubTab] =
    useState<WebsiteTab>("Service_Plans_Manager")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

      {/* LEFT SIDEBAR */}
      <div className="lg:col-span-3">
        <div className="bg-white border rounded-xl p-4 space-y-2">
          <SidebarItem
            label="Service Plans Manager"
            active={activeSubTab === "Service_Plans_Manager"}
            onClick={() => setActiveSubTab("Service_Plans_Manager")}
          />
          <SidebarItem
            label="Automation Center"
            active={activeSubTab === "Automation_Center"}
            onClick={() => setActiveSubTab("Automation_Center")}
          />
          <SidebarItem
            label=" Documents "
            active={activeSubTab === "Documents"}
            onClick={() => setActiveSubTab("Documents")}
          />
          <SidebarItem
            label="Schedule Settings"
            active={activeSubTab === "Schedule_Settings"}
            onClick={() => setActiveSubTab("Schedule_Settings")}
          />
          <SidebarItem
            label="Lead Status"
            active={activeSubTab === "Lead_Status"}
            onClick={() => setActiveSubTab("Lead_Status")}
          />
          <SidebarItem
            label="Numbering"
            active={activeSubTab === "Numbering"}
            onClick={() => setActiveSubTab("Numbering")}
          />
           <SidebarItem
            label="Security Center"
            active={activeSubTab === "Security Center"}
            onClick={() => setActiveSubTab("Security Center")}
          />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:col-span-9">
        {activeSubTab === "Service_Plans_Manager" && <CompanySettings />}

        {activeSubTab !== "Service_Plans_Manager" && (
          <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
            This section will be added next
          </div>
        )}
      </div>
    </div>
  )
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-semibold
        ${
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {label}
      <span> <ChevronsRight size={18}/> </span>
    </button>
  )
}
