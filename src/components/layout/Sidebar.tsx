import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {

  Calendar,
 
  Phone,
  Users,
  FileText,
 
  CreditCard,
  LogOut,

  Menu,
  LayoutDashboard,
  CalendarCheck,
  MapPinned,
  SquareGanttChart,
  UserPen,
  BarChart3,
  BookOpen,
  Notebook,
  HandCoins,

} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navItems = [

  { name: "Dashboard", path: "/", icon: LayoutDashboard, section: "CRM" },
  { name: "Leads", path: "/leads", icon: Users, section: "CRM" },
  { name: "Estimates", path: "/estimates", icon: FileText, section: "CRM" },
  { name: "Invoices", path: "/invoices", icon: FileText, section: "CRM" },
  { name: "Client", path: "/client", icon: Users, section: "CRM" },
  { name: "CRM Calls", path: "/phone", icon: Phone, section: "CRM" },

  // Delivery
  { name: "Jobs", path: "/jobs", icon: Calendar, section: "Delivery" },
  { name: "Schedule", path: "/schedule", icon: CalendarCheck, section: "Delivery" },
  { name: "Map View", path: "/map", icon: MapPinned, section: "Delivery" },
  { name: "Price Book", path: "/products", icon:Notebook , section: "Delivery" },
  { name: "Payout", path: "/rsf-pay", icon: HandCoins, section: "Delivery" },

  
  { name: "Team", path: "/team", icon:UserPen, section: "Master" },
  { name: "Training Courses", path: "/training/courses", icon: BookOpen, section: "Master" },

  // Report
  { name: "Report", path: "/reports", icon:BarChart3, section: "Report" },
  { name: " Advanced Report", path: "/advanced-report", icon:BarChart3, section: "Report" },

]


export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <aside
      className="h-screen bg-white flex flex-col sticky top-0 border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out"
      style={{
        width: isExpanded ? "240px" : "70px",
      }}
    >
      {/* Header with Logo and Menu */}
      <div className="p-4 flex items-center justify-center border-b border-gray-200">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-1.5 transition-colors flex-shrink-0"
            title="Toggle Sidebar"
          >
            <Menu size={24} />
          </button>
          {/* Logo and Text - Hidden when collapsed */}
          <div
            className="flex-1 overflow-hidden transition-all duration-300"
            style={{
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? "auto" : "none",
            }}
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.jpeg"
                height="40px"
                width="40px"
                className="rounded"
              />
              <div>
                <h1 className="font-bold text-sm text-gray-900 leading-tight whitespace-nowrap">
                  Right Step
                </h1>
                <p className="text-xs text-gray-600 leading-tight whitespace-nowrap">Flooring</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item, index) => {
          const previousItem = navItems[index - 1]
          const isNewSection = previousItem?.section !== item.section

          return (
            <div key={item.name}>
              {/* Section Divider */}
              {isNewSection && (
                <div
                  className="my-3 transition-all duration-300"
                  style={{
                    opacity: isExpanded ? 1 : 0.3,
                  }}
                >
                  <div className="border-t border-gray-200" />
                </div>
              )}

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-3 my-1 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#fcf76d52] text-primary border-r-4 border-secondary font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`
                }
                title={!isExpanded ? item.name : undefined}
              >
                <item.icon size={20} className="flex-shrink-0 " />
                {/* Text label - Hidden when collapsed */}
                <span
                  className="flex-1 overflow-hidden transition-all duration-300"
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    width: isExpanded ? "auto" : "0",
                  }}
                >
                  {item.name}
                </span>
              </NavLink>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 space-y-2 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all whitespace-nowrap"
          title="Logout"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span
            className="flex-1 overflow-hidden transition-all duration-300"
            style={{
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? "auto" : "0",
            }}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}
