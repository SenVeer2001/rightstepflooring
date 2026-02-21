// components/Header.tsx
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  HelpCircle,
  Plus,
  Sparkles,
  ChevronDown,
  FileText,
  Calendar,
  Briefcase,
  ClipboardList,
  Settings,
  Bell,
  PhoneCall,
} from "lucide-react"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import DropdownItem from "../ui/DropdownItem"
import NotificationDropdown from "../../app/notifications/NotificationDropdown"
import { mockNotifications, type Notification } from "../../types/notification"



export function Header() {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false)
      }
    }

    if (isCreateMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCreateMenuOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCreateMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsCreateMenuOpen(false)
  }

    // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <header className="h-16 bg-black bg-opacity-10 border-b border-gray-200 flex items-center px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-3 relative">
        {/* Create New Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsCreateMenuOpen((prev) => !prev)}
            data-tooltip-id="header-tooltip"
            // data-tooltip-content="Create New Item"
            className="flex text-sm items-center gap-2 bg-primary text-white font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            <Plus size={20} className="bg-secondary text-primary rounded-xl p-0.5" />
            <span>Create new</span>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isCreateMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="py-1">
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
            </div>
          )}
        </div>

        {/* AI Button */}
        <button 
          data-tooltip-id="header-tooltip"
          data-tooltip-content="AI Assistant"
          className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <Sparkles size={18} className="text-primary" />
          <span>AI</span>
        </button>

        {/* Search */}
        <IconButton 
          tooltip="Search"
          onClick={() => {}}
        >
          <Search size={20} />
        </IconButton>
          <IconButton 
          tooltip="Communication Hub"
          onClick={() => {navigate('/communication-hub')}}
        >
          <PhoneCall size={20} />
        </IconButton>

          <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

         {/* <IconButton 
          tooltip="Notifications"
          onClick={() => navigate("/settings")}
        >
          <Bell size={20} />
        </IconButton> */}

        {/* Settings */}
        <IconButton 
          tooltip="Settings"
          onClick={() => navigate("/settings")}
        >
          <Settings size={20} className="hover:rotate-90 transition duration-200" />
        </IconButton>

        {/* Help */}
        <IconButton 
          tooltip="FAQ"
           onClick={() => navigate("/faq")}
        >
          <HelpCircle size={20} className=""/>
        </IconButton>
      </div>

      {/* Tooltip Component */}
      <Tooltip 
        id="header-tooltip" 
        place="bottom"
        delayShow={300}
        className="!bg-gray-900 !text-white !text-xs !px-2 !py-1.5 !rounded-lg !font-medium"
      />
    </header>
  )
}

// IconButton with Tooltip Support
function IconButton({
  children,
  badge,
  tooltip,
  onClick,
}: {
  children: React.ReactNode
  badge?: string
  tooltip?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      data-tooltip-id="header-tooltip"
      data-tooltip-content={tooltip}
      className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-primary  rounded-lg transition"
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