"use client"

import { useMemo, useState } from "react"
import {
  Plus,
  Search,
  ChevronDown,
  Download,
  Trash2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import CreateEstimateModal from "../../components/estimatesModel/CreateEstimateModal"

/* ================= TYPES ================= */

type EstimateStatus =
  |"all"
  | "unsent"
  | "pending"
  | "approved"
  | "declined"
  | "won"
  | "archived"

interface Estimate {
  id: string
  estimateNo: string
  name: string
  client: string
  email: string
  createdAt: string
  amount: number
  status: EstimateStatus
  source: string
  depositDue: number
}

/* ================= MOCK DATA ================= */

const ESTIMATES: Estimate[] = [
  {
    id: "1",
    estimateNo: "1222-1",
    name: "Living Room Flooring",
    client: "Annie Bloom",
    email: "annie@gmail.com",
    createdAt: "Tue Feb 03, 2026 05:31 pm",
    amount: 1594.62,
    status: "pending",
    source: "Lead - 1222",
    depositDue: 0,
  },
  {
    id: "2",
    estimateNo: "1235-2",
    name: "LVP Master Closet",
    client: "Kourtney Robine",
    email: "krob@gmail.com",
    createdAt: "Tue Feb 03, 2026 05:22 pm",
    amount: 5378.41,
    status: "pending",
    source: "Lead - 1235",
    depositDue: 0,
  },
  {
    id: "3",
    estimateNo: "1195-5",
    name: "Bathroom Tile Installation",
    client: "Sherri Holmes",
    email: "sherri@gmail.com",
    createdAt: "Tue Feb 03, 2026 03:32 pm",
    amount: 3024.42,
    status: "approved",
    source: "Lead - 1195",
    depositDue: 250,
  },
  {
    id: "4",
    estimateNo: "1201-3",
    name: "Hardwood Refinishing",
    client: "Michael Carter",
    email: "mcarter@gmail.com",
    createdAt: "Mon Feb 02, 2026 11:15 am",
    amount: 8420.0,
    status: "won",
    source: "Referral",
    depositDue: 1500,
  },
  {
    id: "5",
    estimateNo: "1188-7",
    name: "Kitchen Tile Backsplash",
    client: "Laura Peterson",
    email: "laura.p@gmail.com",
    createdAt: "Sun Feb 01, 2026 04:40 pm",
    amount: 2190.75,
    status: "declined",
    source: "Website",
    depositDue: 0,
  },
  {
    id: "6",
    estimateNo: "1172-4",
    name: "Carpet Replacement – Bedrooms",
    client: "Daniel Wright",
    email: "dwright@gmail.com",
    createdAt: "Sat Jan 31, 2026 02:10 pm",
    amount: 4685.9,
    status: "approved",
    source: "Lead - 1172",
    depositDue: 500,
  },
  {
    id: "7",
    estimateNo: "1160-9",
    name: "Luxury Vinyl Plank – Basement",
    client: "Emily Sanders",
    email: "emily.s@gmail.com",
    createdAt: "Fri Jan 30, 2026 06:05 pm",
    amount: 6120.3,
    status: "unsent",
    source: "Manual",
    depositDue: 0,
  },
  {
    id: "8",
    estimateNo: "1155-6",
    name: "Tile Repair – Entryway",
    client: "Robert King",
    email: "rking@gmail.com",
    createdAt: "Thu Jan 29, 2026 10:55 am",
    amount: 980.0,
    status: "archived",
    source: "Old CRM Import",
    depositDue: 0,
  },
  {
    id: "9",
    estimateNo: "1149-2",
    name: "Staircase Hardwood Upgrade",
    client: "Sophia Martinez",
    email: "smartinez@gmail.com",
    createdAt: "Wed Jan 28, 2026 01:20 pm",
    amount: 7345.6,
    status: "won",
    source: "Referral",
    depositDue: 2000,
  },
  {
    id: "10",
    estimateNo: "1140-1",
    name: "Commercial Office Carpet",
    client: "BluePeak Solutions",
    email: "admin@bluepeak.com",
    createdAt: "Tue Jan 27, 2026 09:30 am",
    amount: 12450.0,
    status: "pending",
    source: "Commercial Lead",
    depositDue: 3000,
  },
]


/* ================= COMPONENT ================= */

const STATUS_OPTIONS: EstimateStatus[] = [
  "all",
  "unsent",
  "pending",
  "approved",
  "declined",
  "won",
  "archived",
]

const STATUS_STYLES: Record<EstimateStatus, string> = {
  all:"text-gray-900",
  unsent: " text-gray-700",
  pending: " text-yellow-800",
  approved: " text-green-700",
  declined: " text-red-700",
  won: " text-blue-700",
  archived: " text-gray-700",
}


export default function EstimatesPage() {
  const navigate = useNavigate()
  const [openEstimateModal, setOpenEstimateModal] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<"all" | EstimateStatus>("all")
  const [selected, setSelected] = useState<string[]>([])
  const [jobDoneEnable, setJobDoneEnable] = useState(false)

  /* ================= COUNTS ================= */

  const statusCounts = useMemo(() => {
    const base = {
      all:ESTIMATES.length,
      unsent: 0,
      pending: 0,
      approved: 0,
      declined: 0,
      won: 0,
      archived: 0,
    }

    ESTIMATES.forEach(e => {
      base[e.status]++
    })

    return base
  }, [])

  /* ================= FILTER ================= */

  const [estimates, setEstimates] = useState<Estimate[]>(ESTIMATES)

  const filteredEstimates = useMemo(() => {
    return estimates.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.client.toLowerCase().includes(search.toLowerCase()) ||
        e.estimateNo.includes(search)

      const matchesStatus =
        statusFilter === "all" || e.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, estimates])


  const handleStatusChange = (id: string, newStatus: EstimateStatus) => {
    setEstimates(prev =>
      prev.map(e =>
        e.id === id ? { ...e, status: newStatus } : e
      )
    )
  }


  const toggleAll = () => {
    setSelected(
      selected.length === filteredEstimates.length
        ? []
        : filteredEstimates.map(e => e.id)
    )
  }

  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }



  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">Estimates</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage estimate Here  
          </p>
        </div>

        <button
          onClick={() => setOpenEstimateModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold">
          <Plus size={16} />
          Add New
        </button>
      </div>


      {/* STATUS TABS */}
      <div className="flex flex-wrap gap-3 ">
        {[
          ["All","all"],
          ["Unsent", "unsent"],
          ["Pending", "pending"],
          ["Approved", "approved"],
          ["Declined", "declined"],
          ["Won", "won"],
          ["Archived", "archived"],
        ].map(([label, key]) => {
          const active = statusFilter === key

          return (
            <button
              key={key}
              onClick={() => setStatusFilter(key as EstimateStatus)}
              className={` flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold
          whitespace-nowrap transition
          ${active
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
            >
              {label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full
                  ${active ? "bg-white/20" : "bg-gray-200 text-gray-700"}
                `}
              >
                {statusCounts[key as EstimateStatus]}
              </span>
            </button>
          )
        })}
      </div>


      <div className="flex flex-wrap items-center  justify-between gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative min-w-[500px]">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search estimates..."
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none"
            />
          </div>


        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm bg-gray-50"
          >
            <option value="all">All statuses</option>
            <option value="unsent">Unsent</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="won">Won</option>
            <option value="archived">Archived</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>


      <div className="flex items-center justify-between gap-4 text-sm bg-gray-50 border rounded-lg p-3">
        <div className="flex gap-4 items-center ">
          <span className="font-semibold">{selected.length} selected</span>

          <button disabled={selected.length < 0} className={` ${selected.length > 0 ? "text-primary" : "text-gray-500"}  font-semibold rounded-md border py-1 px-3`}>Change status</button>
          <button disabled={selected.length < 0} className={` ${selected.length > 0 ? "text-primary" : "text-gray-500"}  font-semibold rounded-md border py-1 px-3`}>Send reminder</button>

          <button disabled={selected.length < 0} className={` ${selected.length > 0 ? "text-red-500" : "text-gray-500"}  font-semibold rounded-md  flex gap-1 items-center border py-1 px-3`}> <Trash2 size={16} /> Delete</button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setJobDoneEnable(!jobDoneEnable)}
            className={`relative w-10 h-5 rounded-full transition
                ${jobDoneEnable ? "bg-primary" : "bg-gray-300"}
              `}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 bg-white rounded-full transition
                  ${jobDoneEnable ? "left-5" : "left-1"}
                `}
            />
          </button>
          <span className="text-xs font-semibold text-gray-700">
            Show estimates after job done
          </span>
        </div>

      </div>



      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selected.length === filteredEstimates.length &&
                    filteredEstimates.length > 0
                  }
                  className="accent-primary"
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-left">Estimate</th>
              <th className="px-4 py-3 text-left">Estimate name</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Deposit due</th>
            </tr>
          </thead>

          <tbody>
            {filteredEstimates.map(e => (
              <tr
                key={e.id}
                className="border-b hover:bg-primary/10 transition"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={() => toggleOne(e.id)}
                    className="accent-primary"
                  />

                </td>

                <td
                  className="px-4 py-3 font-medium text-primary cursor-pointer"
                  onClick={() => navigate(`/estimates/${e.estimateNo}`)}
                >
                  {e.estimateNo}
                </td>

                <td className="px-4 py-3">{e.name}</td>

                <td className="px-4 py-3">
                  <div className="font-medium">{e.client}</div>
                  <div className="text-xs text-gray-500">{e.email}</div>
                </td>

                <td className="px-4 py-3">{e.createdAt}</td>

                <td className="px-4 py-3">
                  ${e.amount.toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={e.status}
                    onChange={(event) =>
                      handleStatusChange(
                        e.id,
                        event.target.value as EstimateStatus
                      )
                    }
                    className={`
      text-xs font-semibold rounded-full px-3 py-1.5
      border outline-none cursor-pointer
      ${STATUS_STYLES[e.status]}
    `}
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>


                <td className="px-4 py-3">{e.source}</td>

                <td className="px-4 py-3">
                  ${e.depositDue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEstimates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No estimates found
          </div>
        )}
      </div>

      <CreateEstimateModal
        open={openEstimateModal}
        onClose={() => setOpenEstimateModal(false)}
        onSelectClient={() => {
          setOpenEstimateModal(false)
        }}
        onAddNewClient={() => {
          setOpenEstimateModal(false)
          navigate(`/client`)

        }}
      />
    </div>
  )
}




