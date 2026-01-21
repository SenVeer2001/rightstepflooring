import { NavLink, useNavigate } from "react-router-dom"
import {
  Home,
  Calendar,
  MapPin,
  Phone,
  Users,
  FileText,
  DollarSign,
  CreditCard,
  LogOut,
  Plus,
  Sparkles,
  Menu,
  LayoutDashboard,
  CalendarCheck,
  MapPinned,
  SquareGanttChart
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navItems = [

  { name: "Dashboard", path: "/", icon: LayoutDashboard, section: "CRM" },
  { name: "Leads", path: "/leads", icon: Users, section: "CRM" },
  { name: "Estimates", path: "/estimates", icon: FileText, section: "CRM" },
  { name: "Invoices", path: "/invoices", icon: FileText, section: "CRM" },
  { name: "Customers", path: "/customers", icon: Users, section: "CRM" },
  { name: "CRM Calls", path: "/phone", icon: Phone, section: "CRM" },

  // Delivery
  { name: "Jobs", path: "/jobs", icon: Calendar, section: "Delivery" },
  { name: "Schedule", path: "/schedule", icon: CalendarCheck, section: "Delivery" },
  { name: "Map View", path: "/map", icon: MapPinned, section: "Delivery" },
  { name: "Product", path: "/products", icon:SquareGanttChart , section: "Delivery" },
  { name: "Payout", path: "/rsf-pay", icon: CreditCard, section: "Delivery" },

  // Master
  { name: "Staff(Internal)", path: "/staff", icon: CreditCard, section: "Master" },

  // Report
  { name: "Report", path: "/reports", icon: CreditCard, section: "Report" },
]


export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside className="w-[260px] h-screen bg-white flex flex-col sticky top-0 border-r border-gray-200 shadow-sm">
      {/* Header with Logo and Menu */}
      <div className="p-4">
        <div className="flex items-center gap-2 ">
          <Menu size={24} className="text-gray-700" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <img
                src="/images/logo.jpeg"
                height="60px"
                width="60px"
              />
              <div>
                <h1 className="font-bold text-base text-gray-900 leading-tight">Right Step</h1>
                <p className="text-xs text-gray-600 leading-tight">Flooring</p>
              </div>
            </div>
          </div>
        </div>


        {/* <button className="w-full flex items-center justify-center gap-2 border-2 bg-primary  text-white  font-semibold py-2.5 px-4 rounded-xl transition-colors mb-3">
          <Plus size={20} className="bg-secondary text-primary rounded-xl p-0.5 " />
          <span>Create new</span>
        </button>

     
        <button className="w-full flex items-center border border-gray-400 rounded-xl gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50  transition-colors relative">
          <Sparkles size={20} className="text-primary" />
          <span className="font-medium flex-1 text-left">Genius AI</span>
          <span className="ml-auto bg-secondary text-primary text-xs font-semibold px-2.5 py-1 rounded-full">NEW</span>
        </button> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item, index) => {
          const previousItem = navItems[index - 1]
          const isNewSection = previousItem?.section !== item.section

          return (
            <div key={item.name}>
              {/* Section Divider */}
              {isNewSection && (
                <div className="mt-4 mb-2">
                  <div className="mt-2 border-t border-gray-200" />
                </div>
              )}

              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 mt-1 text-sm font-medium rounded-lg transition-all ${isActive
                    ? "bg-[#fcf76d52] text-primary border-r-4 border-secondary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
              </NavLink>
            </div>
          )
        })}
      </nav>


      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-2 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
