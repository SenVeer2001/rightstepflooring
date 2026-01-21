import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  
  Trash2,
  
  CheckCircle,
  Clock,
  PauseCircle,
  
  PlusCircle,
} from "lucide-react"
import DropdownItem from "../ui/DropdownItem";
import { useNavigate } from "react-router-dom";


/* ===================== TYPES ===================== */

type LeadStatus = "new" | "qualified" | "scheduled" | "delayed"

const STATUS_OPTIONS: { key: LeadStatus; label: string; icon: any }[] = [
  { key: "new", label: "New", icon: Clock },
  { key: "qualified", label: "Qualified", icon: CheckCircle },
  { key: "scheduled", label: "Scheduled", icon: CheckCircle },
  { key: "delayed", label: "Delayed", icon: PauseCircle },
]

/* ===================== COMPONENT ===================== */

function LeadHeader({ leadId }: { leadId: string }) {
  const [status, setStatus] = useState<LeadStatus>("new")
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isActionOpen, setIsActionOpen] = useState(false)

  const statusRef = useRef<HTMLDivElement | null>(null)
  const actionRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  /* ===================== OUTSIDE CLICK ===================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setIsStatusOpen(false)
      }

      if (
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setIsActionOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-xl border p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* LEFT */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Lead #{leadId} – Mike Cousins
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3 flex-wrap items-center">

        {/* STATUS DROPDOWN */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setIsStatusOpen(prev => !prev)}
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-primary
                       flex items-center gap-2"
          >
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            <ChevronDown size={16} />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-30">
              {STATUS_OPTIONS.map(option => (
                <DropdownItem
                  key={option.key}
                  icon={option.icon}
                  label={option.label}
                  onClick={() => {
                    setStatus(option.key)
                    setIsStatusOpen(false)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS DROPDOWN */}
        <div className="relative" ref={actionRef}>
          <button
            onClick={() => setIsActionOpen(prev => !prev)}
            className="px-4 py-2 rounded-lg border text-sm font-semibold
                       border-primary flex items-center gap-2"
          >
            Actions
            <ChevronDown size={16} />
          </button>

          {isActionOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg z-30">
              <DropdownItem
                icon={PlusCircle}
                label="Add Estimate"
                onClick={() => {
                   navigate('/estimates/view')
                  setIsActionOpen(false)
                }}
              />

              {/* <DropdownItem
                icon={Edit}
                label="Edit Lead"
                onClick={() => {
                  console.log("Edit lead")
                  setIsActionOpen(false)
                }}
              /> */}

              <DropdownItem
                icon={Trash2}
                label="Delete Lead"
                onClick={() => {
                  console.log("Delete lead")
                  setIsActionOpen(false)
                }}
              />
            </div>
          )}
        </div>

        
        <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">
          Convert to Job
        </button>
      </div>
    </div>
  )
}

export default LeadHeader
