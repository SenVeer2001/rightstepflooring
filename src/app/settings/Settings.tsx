
import { useState } from "react"
import {
 
  Settings2,
  BriefcaseBusiness,
  UserRoundCog,
  Phone,
  Workflow,
  Import,
} from "lucide-react"
import WebsiteSettings from "../../components/settingPages/generalSettings/GeneralSettings"
import UserAndRoles from "../../components/settingPages/userAndRoles/UserAndRoles"


type MainTab =
  | "general"
  | "role"
  | "job"
  | "calls"
  | "integration"
  | "import"

 function Settings() {
  const [activeTab, setActiveTab] = useState<MainTab>("general")

  return (
    <div className="p-3 space-y-6">

  
      <h1 className="text-2xl font-semibold  text-gray-900">Settings</h1>

      {/* TOP TABS */}
      <div className="">
        <div className={`flex gap-8 bg-white px-3 py-5 rounded-xl items-center `}>
          <TabButton
            icon={Settings2}
            label="General Settings"
            active={activeTab === "general"}
            onClick={() => setActiveTab("general")}
          />
          <TabButton
            icon={UserRoundCog}
            label="User & Roles"
            active={activeTab === "role"}
            onClick={() => setActiveTab("role")}
          />
          <TabButton
            icon={BriefcaseBusiness}
            label="Job Settings"
            active={activeTab === "job"}
            onClick={() => setActiveTab("job")}
          />
          <TabButton
            icon={Phone}
            label="Calls & Text Settings"
            active={activeTab === "calls"}
            onClick={() => setActiveTab("calls")}
          />
          <TabButton
            icon={Workflow}
            label="Integrations"
            active={activeTab === "integration"}
            onClick={() => setActiveTab("integration")}
          />
          <TabButton
            icon={Import}
            label="Import"
            active={activeTab === "import"}
            onClick={() => setActiveTab("import")}
          />
        </div>

        {/* TAB CONTENT */}
        <div className="p-2">
          {activeTab === "general" && <WebsiteSettings />}
          {activeTab === "role" && <UserAndRoles />}

          {activeTab !== "general" && activeTab !== "role"  && (
            <div className="text-sm text-gray-500">
              Section coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings;

/* TAB BUTTON */
function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-[15px] font-semibold pb-3 border-b-2 transition
        ${
          active
            ? "border-primary text-primary font-medium"
            : "border-transparent text-gray-600 hover:text-gray-900"
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}


