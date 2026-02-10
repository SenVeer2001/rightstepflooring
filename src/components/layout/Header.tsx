import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  HelpCircle,
  Menu,
  Plus,
  Sparkles,
  ChevronDown,
  FileText,
  Calendar,
  Briefcase,
  ClipboardList,
  Settings,
 
} from "lucide-react"
import DropdownItem from "../ui/DropdownItem"

export function Header() {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsCreateMenuOpen(false)
  }

  return (
    <header className="h-16 bg-black bg-opacity-10 border-b border-gray-200 flex items-center px-6 sticky top-0 z-40 shadow-sm">
      {/* Left
      <button className="lg:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
        <Menu size={22} />
      </button> */}

      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-3 relative">
        {/* Create New Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCreateMenuOpen((prev) => !prev)}
            className="flex text-sm items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            <Plus size={20} className="bg-secondary text-primary rounded-xl p-0.5" />
            <span>Create new</span>
            <ChevronDown size={16} />
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <DropdownItem
                icon={ClipboardList}
                label="Lead"
                onClick={() => handleNavigate("/leads")}
              />

              <DropdownItem
                icon={Briefcase}
                label="Job"
                onClick={() => handleNavigate("/jobs")}
              />

              <DropdownItem
                icon={FileText}
                label="Estimate"
                onClick={() => handleNavigate("/estimates")}
              />

              <DropdownItem
                icon={FileText}
                label="Invoice"
                onClick={() => handleNavigate("/invoices")}
              />

              <DropdownItem
                icon={Calendar}
                label="Event"
                onClick={() => handleNavigate("/events")}
              />
            </div>
          )}
        </div>

        {/* AI Button */}
        <button className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
          <Sparkles size={18} className="text-primary" />
          <span>AI</span>
        </button>

        {/* Search */}
        <IconButton>
          <Search size={20} />
        </IconButton>

        <IconButton onClick={() => navigate("/settings")}>
          <Settings size={20} className="hover:rotate-90 transition duration-200" />
        </IconButton>


        {/* Help */}
        <IconButton>
          <HelpCircle size={20} />
        </IconButton>

        {/* Profile */}
        {/* <button className="w-9 h-9 bg-green-500 text-white rounded-lg flex items-center justify-center font-semibold">
          D
        </button> */}
      </div>
    </header>
  )
}


function IconButton({
  children,
  badge,
  onClick,
}: {
  children: React.ReactNode
  badge?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-lg"
    >
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
      {children}
    </button>
  )
}
