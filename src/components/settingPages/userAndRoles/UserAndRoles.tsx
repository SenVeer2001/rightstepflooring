

import { useState } from "react"

import { ChevronsRight } from "lucide-react"
import RolesPage from "./RolesPage"
import { useNavigate } from "react-router-dom"


type WebsiteTab =
  | "Team_Management"
  | "Roles&Permissions"
 

export default function UserAndRoles() {

    const navigate = useNavigate()
  const [activeSubTab, setActiveSubTab] =
    useState<WebsiteTab>("Roles&Permissions")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

      {/* LEFT SIDEBAR */}
      <div className="lg:col-span-3">
        <div className="bg-white border rounded-xl p-4 space-y-2">
          <SidebarItem
            label="Team Management"
            active={activeSubTab === "Team_Management"}
            onClick={() =>navigate("/team") }
          />
          <SidebarItem
            label="Roles & Permissions"
            active={activeSubTab === "Roles&Permissions"}
            onClick={() => setActiveSubTab("Roles&Permissions")}
          />
        
          
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:col-span-9">
        {activeSubTab === "Roles&Permissions" && <RolesPage />}

        {activeSubTab !== "Roles&Permissions" && (
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
