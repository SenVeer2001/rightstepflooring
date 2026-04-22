// PhotosTab.tsx
"use client"

import { useState, useMemo, useRef } from "react"
import {
  Calendar,
  ImageIcon,
  Check,
  Download,
  Trash2,
  Upload,
  X,
  Image as ImageLucide,
  SquareCheck,
  Square,
  User,
  HardHat,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Mail,
  MessageSquare,
  Send,
  LogIn,
  LogOut,
} from "lucide-react"

export interface PhotoData {
  id: string
  url: string
  name: string
  date: string
  time: string
  uploadedBy: string
  source?: string
  status?: string
}

interface TimeNotification {
  id: string
  type: "arriving" | "leaving"
  time: string
  notes: string
  notifyEmail: boolean
  notifySms: boolean
  sentAt: string
  date: string
}

interface DateGroupStatus {
  date: string
  status: "pending" | "approved" | "not_approved" | "mixed"
  approvedDate?: string
  approvedBy?: string
  source: "client" | "subcontractor" | "mixed"
  uploadedBy?: string
}

interface Props {
  onPhotoClick: (data: { photos: PhotoData[]; startIndex: number }) => void
  onStatusChange?: (
    date: string,
    newStatus: "pending" | "approved" | "not_approved"
  ) => void
}

const initialPhotosData: PhotoData[] = [
  {
    id: "1",
    url: "https://images.pexels.com/photos/17303438/pexels-photo-17303438.jpeg",
    name: "Kitchen Before Work",
    date: "2024-01-15",
    time: "09:30 AM",
    uploadedBy: "John Smith",
    source: "client",
    status: "approved",
  },
  {
    id: "2",
    url: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg",
    name: "Kitchen After Repair",
    date: "2024-01-15",
    time: "10:15 AM",
    uploadedBy: "John Smith",
    source: "client",
    status: "approved",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=400",
    name: "Bathroom Inspection",
    date: "2024-01-15",
    time: "02:45 PM",
    uploadedBy: "John Smith",
    source: "client",
    status: "approved",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400",
    name: "Living Room Overview",
    date: "2024-01-14",
    time: "11:00 AM",
    uploadedBy: "Mike Johnson",
    source: "subcontractor",
    status: "pending",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400",
    name: "Flooring Progress",
    date: "2024-01-14",
    time: "03:30 PM",
    uploadedBy: "Mike Johnson",
    source: "subcontractor",
    status: "pending",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400",
    name: "Damage Assessment",
    date: "2024-01-13",
    time: "10:00 AM",
    uploadedBy: "Tom Davis",
    source: "subcontractor",
    status: "not_approved",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    name: "Material Delivery",
    date: "2024-01-13",
    time: "01:15 PM",
    uploadedBy: "Tom Davis",
    source: "subcontractor",
    status: "not_approved",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=400",
    name: "Final Walkthrough",
    date: "2024-01-12",
    time: "04:00 PM",
    uploadedBy: "Sarah Wilson",
    source: "client",
    status: "pending",
  },
]

/* ── helpers ── */
function getStatusConfig(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
        border: "border-green-200",
      }
    case "pending":
      return {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
        border: "border-yellow-200",
      }
    case "not_approved":
      return {
        label: "Not Approved",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: XCircle,
        border: "border-red-200",
      }
    case "mixed":
      return {
        label: "Mixed",
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: AlertCircle,
        border: "border-purple-200",
      }
    default:
      return {
        label: "Unknown",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: AlertCircle,
        border: "border-gray-200",
      }
  }
}

function getSourceConfig(source: string) {
  switch (source) {
    case "client":
      return { label: "Client", bg: "bg-blue-500", text: "text-white", icon: User }
    case "subcontractor":
      return {
        label: "Subcontractor",
        bg: "bg-orange-500",
        text: "text-white",
        icon: HardHat,
      }
    default:
      return { label: "Mixed", bg: "bg-purple-500", text: "text-white", icon: User }
  }
}

export default function PhotosTab({ onPhotoClick, onStatusChange }: Props) {
  const [photosData, setPhotosData] = useState<PhotoData[]>(initialPhotosData)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<"all" | "client" | "subcontractor">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "not_approved">("all")
  const [showDateStatusPopup, setShowDateStatusPopup] = useState(false)
  const [selectedDateForStatus, setSelectedDateForStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── Notify popup state ── */
  const [showNotifyPopup, setShowNotifyPopup] = useState(false)
  const [notifyType, setNotifyType] = useState<"arriving" | "leaving">("arriving")
  const [notifyTime, setNotifyTime] = useState("")
  const [notifyNotes, setNotifyNotes] = useState("")
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(true)
  const [notifications, setNotifications] = useState<TimeNotification[]>([])
  const [notifySent, setNotifySent] = useState(false)

  /* ── filtered & grouped ── */
  const filteredPhotos = useMemo(() => {
    return photosData.filter((p) => {
      const ms = sourceFilter === "all" || p.source === sourceFilter
      const mv = statusFilter === "all" || p.status === statusFilter
      return ms && mv
    })
  }, [photosData, sourceFilter, statusFilter])

  const photosByDate = useMemo(() => {
    const g: Record<string, PhotoData[]> = {}
    filteredPhotos.forEach((p) => {
      if (!g[p.date]) g[p.date] = []
      g[p.date].push(p)
    })
    return Object.fromEntries(
      Object.entries(g).sort(
        ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
      )
    )
  }, [filteredPhotos])

  /* ── stats ── */
  const stats = useMemo(() => ({
    total: photosData.length,
    client: photosData.filter((p) => p.source === "client").length,
    subcontractor: photosData.filter((p) => p.source === "subcontractor").length,
    pending: photosData.filter((p) => p.status === "pending").length,
    approved: photosData.filter((p) => p.status === "approved").length,
    notApproved: photosData.filter((p) => p.status === "not_approved").length,
  }), [photosData])

  /* ── date group status ── */
  const getDateGroupStatus = (date: string): DateGroupStatus => {
    const photos = photosByDate[date] || []
    const statuses = new Set(photos.map((p) => p.status))
    const sources = new Set(photos.map((p) => p.source))
    const uploaders = new Set(photos.map((p) => p.uploadedBy))

    const status: any =
      statuses.size === 1 ? Array.from(statuses)[0] : "mixed"
    const source: any =
      sources.size === 1 ? Array.from(sources)[0] : "mixed"

    return {
      date,
      status,
      source,
      uploadedBy:
        uploaders.size === 1 ? Array.from(uploaders)[0] : "Multiple users",
    }
  }

  /* ── format date ── */
  const formatDate = (ds: string) => {
    const d = new Date(ds)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return "Today"
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  /* ── handlers ── */
  const handleDateStatusChange = (
    date: string,
    ns: "pending" | "approved" | "not_approved"
  ) => {
    setPhotosData((prev) =>
      prev.map((p) => (p.date === date ? { ...p, status: ns } : p))
    )
    setShowDateStatusPopup(false)
    setSelectedDateForStatus(null)
    onStatusChange?.(date, ns)
  }

  const handleDateToggle = (date: string) => {
    const nd = new Set(selectedDates)
    const np = new Set(selectedPhotos)
    const photos = photosByDate[date] || []
    if (nd.has(date)) {
      nd.delete(date)
      photos.forEach((p) => np.delete(p.id))
    } else {
      nd.add(date)
      photos.forEach((p) => np.add(p.id))
    }
    setSelectedDates(nd)
    setSelectedPhotos(np)
  }

  const handlePhotoToggle = (photoId: string, date: string) => {
    const np = new Set(selectedPhotos)
    const nd = new Set(selectedDates)
    np.has(photoId) ? np.delete(photoId) : np.add(photoId)
    const all = (photosByDate[date] || []).every((p) => np.has(p.id))
    all ? nd.add(date) : nd.delete(date)
    setSelectedPhotos(np)
    setSelectedDates(nd)
  }

  const handlePhotoClick = (photo: PhotoData) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id)
    onPhotoClick({ photos: filteredPhotos, startIndex: idx >= 0 ? idx : 0 })
  }

  const handleSelectAll = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set())
      setSelectedDates(new Set())
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map((p) => p.id)))
      setSelectedDates(new Set(Object.keys(photosByDate)))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    )
    setUploadFiles((prev) => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFiles((prev) => [...prev, ...Array.from(e.target.files || [])])
  }

  /* ── Send notify ── */
  const handleSendNotify = () => {
    if (!notifyTime) return
    const now = new Date()
    const newN: TimeNotification = {
      id: `TN-${Date.now()}`,
      type: notifyType,
      time: notifyTime,
      notes: notifyNotes,
      notifyEmail,
      notifySms,
      sentAt: now.toISOString(),
      date: now.toISOString().split("T")[0],
    }
    setNotifications((prev) => [newN, ...prev])
    setNotifySent(true)
    setTimeout(() => {
      setShowNotifyPopup(false)
      setNotifySent(false)
      setNotifyTime("")
      setNotifyNotes("")
      setNotifyEmail(true)
      setNotifySms(true)
      setNotifyType("arriving")
    }, 1200)
  }

  const isAllSelected =
    selectedPhotos.size === filteredPhotos.length && filteredPhotos.length > 0
  const hasSelection = selectedPhotos.size > 0

  
  const NotifyPopup = () => {
    if (!showNotifyPopup) return null
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowNotifyPopup(false)}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={17} className="text-white" />
              <h3 className="text-sm font-bold text-white">Notify Customer</h3>
            </div>
            <button
              onClick={() => setShowNotifyPopup(false)}
              className="p-1 hover:bg-white/20 rounded-lg text-white transition"
            >
              <X size={17} />
            </button>
          </div>

          {notifySent ? (
            /* ── Success state ── */
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={30} className="text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Notification Sent!</p>
              <p className="text-xs text-gray-500">Customer has been notified.</p>
            </div>
          ) : (
            <>
              {/* Body */}
              <div className="p-5 space-y-4">

                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Update Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* <button
                      onClick={() => setNotifyType("arriving")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl
                                  border-2 text-sm font-semibold transition
                        ${notifyType === "arriving"
                          ? "bg-green-50 border-green-400 text-green-700"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                    >
                      <LogIn size={15} /> Arriving
                    </button> */}
                    {/* <button
                      onClick={() => setNotifyType("leaving")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl
                                  border-2 text-sm font-semibold transition
                        ${notifyType === "leaving"
                          ? "bg-orange-50 border-orange-400 text-orange-700"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                    >
                      <LogOut size={15} /> Leaving
                    </button> */}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={notifyTime}
                    onChange={(e) => setNotifyTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                               focus:ring-2 focus:ring-primary/20 focus:border-primary
                               focus:outline-none"
                  />
                </div>

              
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                    Notes{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={notifyNotes}
                    onChange={(e) => setNotifyNotes(e.target.value)}
                    placeholder="Any message for the customer..."
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                               focus:ring-2 focus:ring-primary/20 focus:border-primary
                               focus:outline-none resize-none"
                  />
                </div>

                {/* Notify via */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Notify Via
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotifyEmail(!notifyEmail)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl
                                  border-2 text-xs font-medium transition
                        ${notifyEmail
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                    >
                      <Mail size={13} /> Email
                      {notifyEmail && (
                        <CheckCircle size={12} className="text-blue-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setNotifySms(!notifySms)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl
                                  border-2 text-xs font-medium transition
                        ${notifySms
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                    >
                      <MessageSquare size={13} /> SMS
                      {notifySms && (
                        <CheckCircle size={12} className="text-purple-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t bg-gray-50 flex items-center justify-between">
                <button
                  onClick={() => setShowNotifyPopup(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-200
                             rounded-lg transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotify}
                  disabled={!notifyTime}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white
                             text-sm font-semibold rounded-xl hover:bg-primary/90 transition
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={13} />
                  Send & Notify
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  
  const DateStatusPopup = () => {
    if (!showDateStatusPopup || !selectedDateForStatus) return null
    const dateGroup = getDateGroupStatus(selectedDateForStatus)
    const photos = photosByDate[selectedDateForStatus] || []
    const currentStatus = getStatusConfig(dateGroup.status)
    const sourceConfig = getSourceConfig(dateGroup.source)

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowDateStatusPopup(false)}
      >
        <div
          className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-primary px-4 py-3 text-white flex items-center justify-between">
            <h3 className="text-sm font-semibold">Update Date Status</h3>
            <button
              onClick={() => setShowDateStatusPopup(false)}
              className="p-1 hover:bg-white/10 rounded-full transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="text-primary" />
              <h4 className="font-semibold text-gray-900">
                {formatDate(selectedDateForStatus)}
              </h4>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded
                            text-[10px] font-medium ${sourceConfig.bg} ${sourceConfig.text}`}
              >
                <sourceConfig.icon size={10} /> {sourceConfig.label}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded
                            text-[10px] font-medium ${currentStatus.bg} ${currentStatus.text}`}
              >
                <currentStatus.icon size={10} /> {currentStatus.label}
              </span>
              <span className="text-xs text-gray-500">{photos.length} photo(s)</span>
            </div>
            {dateGroup.uploadedBy && (
              <p className="text-xs text-gray-600 mt-2">
                Uploaded by:{" "}
                <span className="font-medium">{dateGroup.uploadedBy}</span>
              </p>
            )}
          </div>

          <div className="p-4">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Photos in this group:
            </p>
            <div className="grid grid-cols-6 gap-2 mb-4 max-h-32 overflow-y-auto">
              {photos.slice(0, 12).map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {photos.length > 12 && (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{photos.length - 12}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 pb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Change Status for All Photos:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { s: "pending", icon: Clock, color: "yellow" },
                  { s: "approved", icon: CheckCircle, color: "green" },
                  { s: "not_approved", icon: XCircle, color: "red" },
                ] as const
              ).map(({ s, icon: Icon, color }) => (
                <button
                  key={s}
                  onClick={() =>
                    handleDateStatusChange(
                      selectedDateForStatus,
                      s as "pending" | "approved" | "not_approved"
                    )
                  }
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all
                    ${dateGroup.status === s
                      ? `border-${color}-400 bg-${color}-50`
                      : `border-gray-200 hover:border-${color}-300`}`}
                >
                  <Icon size={20} className={`text-${color}-600`} />
                  <span className="text-xs font-medium text-gray-700 capitalize">
                    {s === "not_approved" ? "Not Approved" : s}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
            <button
              onClick={() => setShowDateStatusPopup(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600
                         hover:bg-gray-200 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-4">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ImageIcon className="text-primary" size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">Photos</h2>
              <p className="text-xs text-gray-500">
                {filteredPhotos.length} of {photosData.length} photos
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white
                       text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            <Upload size={14} /> Upload
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          {[
            { label: "Total", val: stats.total, cls: "bg-gray-50 border", txt: "text-gray-900" },
            { label: "Client", val: stats.client, cls: "bg-blue-50 border border-blue-100", txt: "text-blue-700", icon: User, icl: "text-blue-600" },
            { label: "Subcontractor", val: stats.subcontractor, cls: "bg-orange-50 border border-orange-100", txt: "text-orange-700", icon: HardHat, icl: "text-orange-600" },
            { label: "Pending", val: stats.pending, cls: "bg-yellow-50 border border-yellow-100", txt: "text-yellow-700", icon: Clock, icl: "text-yellow-600" },
            { label: "Approved", val: stats.approved, cls: "bg-green-50 border border-green-100", txt: "text-green-700", icon: CheckCircle, icl: "text-green-600" },
            { label: "Not Approved", val: stats.notApproved, cls: "bg-red-50 border border-red-100", txt: "text-red-700", icon: XCircle, icl: "text-red-600" },
          ].map(({ label, val, cls, txt, icon: Icon, icl }) => (
            <div key={label} className={`rounded-lg p-2.5 ${cls}`}>
              <p className={`text-[10px] font-medium flex items-center gap-1 ${icl ?? "text-gray-500"}`}>
                {Icon && <Icon size={10} />} {label}
              </p>
              <p className={`text-lg font-bold ${txt}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {[
                { value: "all", label: "All", icon: null },
                { value: "client", label: "Client", icon: User },
                { value: "subcontractor", label: "Sub", icon: HardHat },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSourceFilter(item.value as any)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium
                              rounded-md transition
                    ${sourceFilter === item.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"}`}
                >
                  {item.icon && <item.icon size={12} />}
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {[
                { value: "all", label: "All Status" },
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "not_approved", label: "Not Approved" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setStatusFilter(item.value as any)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap
                    ${statusFilter === item.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasSelection && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {selectedPhotos.size} selected
              </span>
            )}
            <button
              onClick={handleSelectAll}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs
                          font-medium transition-all
                ${isAllSelected
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {isAllSelected ? <SquareCheck size={14} /> : <Square size={14} />}
              {isAllSelected ? "Deselect" : "Select All"}
            </button>
            {hasSelection && (
              <>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50
                                   text-blue-600 rounded-lg text-xs font-medium
                                   hover:bg-blue-100 transition-all">
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50
                                   text-red-600 rounded-lg text-xs font-medium
                                   hover:bg-red-100 transition-all">
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── PHOTO GROUPS ── */}
      <div className="space-y-4">
        {Object.entries(photosByDate).map(([date, photos]) => {
          const isDateSelected = selectedDates.has(date)
          const someSelected = photos.some((p) => selectedPhotos.has(p.id))
          const dateGroup = getDateGroupStatus(date)
          const statusConfig = getStatusConfig(dateGroup.status)
          const sourceConfig = getSourceConfig(dateGroup.source)
          const isSubcontractor = dateGroup.source === "subcontractor"

          return (
            <div
              key={date}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              {/* Date header */}
              <div
                className={`flex items-center justify-between px-3 py-2.5 sm:px-4
                            sm:py-3 border-b transition-all
                  ${isDateSelected ? "bg-primary/5" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-2.5 flex-1">
                  {/* Checkbox */}
                  <div
                    onClick={() => handleDateToggle(date)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                transition-all flex-shrink-0 cursor-pointer
                      ${isDateSelected
                        ? "bg-primary border-primary"
                        : someSelected
                          ? "bg-primary/30 border-primary"
                          : "border-gray-300 hover:border-primary"}`}
                  >
                    {(isDateSelected || someSelected) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>

                  {/* Date info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900">
                          {formatDate(date)}
                        </span>
                      </div>

                      <span
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                    text-[10px] font-medium ${sourceConfig.bg} ${sourceConfig.text}`}
                      >
                        <sourceConfig.icon size={10} />
                        {sourceConfig.label}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDateForStatus(date)
                          setShowDateStatusPopup(true)
                        }}
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                    text-[10px] font-medium transition hover:opacity-80
                                    ${statusConfig.bg} ${statusConfig.text}`}
                      >
                        <statusConfig.icon size={10} />
                        {statusConfig.label}
                      </button>

                      <span className="text-xs text-gray-500 bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {photos.length}
                      </span>
                    </div>

                    {dateGroup.uploadedBy && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        by {dateGroup.uploadedBy}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Notify button (only for subcontractor groups) ── */}
                {isSubcontractor && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowNotifyPopup(true)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500
                               hover:bg-orange-600 text-white text-xs font-semibold
                               rounded-lg transition shadow-sm flex-shrink-0 ml-2"
                  >
                    <Bell size={13} />
                    Notify
                  </button>
                )}
              </div>

              {/* Photos grid */}
              <div className="p-2 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                                lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {photos.map((photo) => {
                    const isSelected = selectedPhotos.has(photo.id)
                    return (
                      <div
                        key={photo.id}
                        className={`group relative rounded-xl overflow-hidden cursor-pointer
                                    transition-all duration-200 bg-gray-100
                          ${isSelected
                            ? "ring-2 ring-primary ring-offset-2"
                            : "hover:shadow-lg"}`}
                      >
                        <div className="aspect-square">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                            onClick={() => handlePhotoClick(photo)}
                          />
                        </div>

                        <div
                          className={`absolute inset-0 transition-all pointer-events-none
                            ${isSelected
                              ? "bg-primary/20"
                              : "bg-black/0 group-hover:bg-black/10"}`}
                        />

                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePhotoToggle(photo.id, date)
                          }}
                          className="absolute top-2 left-2 z-10"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center
                                        justify-center transition-all shadow-sm cursor-pointer
                              ${isSelected
                                ? "bg-primary border-primary"
                                : "bg-white/90 border-white group-hover:border-primary"}`}
                          >
                            {isSelected && (
                              <Check size={10} className="text-white" />
                            )}
                          </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t
                                        from-black/70 via-black/40 to-transparent p-2 pt-6">
                          <span className="text-white text-[10px] font-medium">
                            {photo.time}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredPhotos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">
            {photosData.length === 0
              ? "No photos yet"
              : "No photos match filters"}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {photosData.length === 0
              ? "Upload photos to document this work order"
              : "Try adjusting your filters"}
          </p>
          {photosData.length === 0 && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-primary text-white text-sm font-medium
                         rounded-lg hover:bg-primary/90 transition-all"
            >
              Upload Photos
            </button>
          )}
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Upload Photos
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Upload As:
                </label>
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5
                                     bg-blue-50 border-2 border-blue-200 text-blue-700
                                     rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                    <User size={14} /> Client Side
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5
                                     bg-gray-50 border-2 border-gray-200 text-gray-600
                                     rounded-lg text-xs font-medium hover:bg-gray-100 transition">
                    <HardHat size={14} /> Subcontractor Side
                  </button>
                </div>
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageLucide className="text-primary" size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Drag & drop photos here</p>
                <p className="text-xs text-gray-400 mb-3">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-white text-xs font-medium
                             rounded-lg hover:bg-primary/90 transition-all"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {uploadFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    {uploadFiles.length} file(s) selected
                  </p>
                  <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() =>
                            setUploadFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white
                                     rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-2">
              <button
                onClick={() => { setShowUploadModal(false); setUploadFiles([]) }}
                className="px-4 py-2 text-gray-600 text-xs font-medium
                           hover:bg-gray-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                disabled={uploadFiles.length === 0}
                className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg
                           hover:bg-primary/90 transition-all disabled:opacity-50
                           disabled:cursor-not-allowed"
              >
                Upload {uploadFiles.length > 0 && `(${uploadFiles.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      <NotifyPopup />
      <DateStatusPopup />
    </div>
  )
}