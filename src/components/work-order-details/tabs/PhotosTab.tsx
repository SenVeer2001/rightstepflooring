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
  ChevronDown,
  AlertCircle
} from "lucide-react"

// Updated interface with source and status
export interface PhotoData {
    id: string;
    url: string;
    name: string;
    date: string;
    time: string;
    uploadedBy: string;
    source?: "upload" | "camera" | "gallery" | string;  // Optional with ?
    status?: "pending" | "approved" | "rejected" | string;  // Optional with ?
}


// Date group status interface
interface DateGroupStatus {
  date: string
  status: 'pending' | 'approved' | 'not_approved' | 'mixed'
  approvedDate?: string
  approvedBy?: string
  source: 'client' | 'subcontractor' | 'mixed'
  uploadedBy?: string
}

interface Props {
  onPhotoClick: (data: { photos: PhotoData[]; startIndex: number }) => void
  onStatusChange?: (date: string, newStatus: 'pending' | 'approved' | 'not_approved') => void
}

// Sample data grouped by date with names, source and status
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
     // @ts-ignore
    approvedDate: "2024-01-15",
    approvedBy: "Admin"
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
     // @ts-ignore
    approvedDate: "2024-01-15",
    approvedBy: "Admin"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=400",
    name: "Bathroom Inspection",
    date: "2024-01-15",
    time: "02:45 PM",
    uploadedBy: "John Smith",
    source: "client",
    status: "approved"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400",
    name: "Living Room Overview",
    date: "2024-01-14",
    time: "11:00 AM",
    uploadedBy: "Mike Johnson",
    source: "subcontractor",
    status: "pending"
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400",
    name: "Flooring Progress",
    date: "2024-01-14",
    time: "03:30 PM",
    uploadedBy: "Mike Johnson",
    source: "subcontractor",
    status: "pending"
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
     // @ts-ignore
    approvedDate: "2024-01-13",
    approvedBy: "Admin"
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    name: "Material Delivery",
    date: "2024-01-13",
    time: "01:15 PM",
    uploadedBy: "Tom Davis",
    source: "subcontractor",
    status: "not_approved"
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=400",
    name: "Final Walkthrough",
    date: "2024-01-12",
    time: "04:00 PM",
    uploadedBy: "Sarah Wilson",
    source: "client",
    status: "pending"
  },
]

export default function PhotosTab({ onPhotoClick, onStatusChange }: Props) {
  const [photosData, setPhotosData] = useState<PhotoData[]>(initialPhotosData)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<'all' | 'client' | 'subcontractor'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'not_approved'>('all')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showDateStatusPopup, setShowDateStatusPopup] = useState(false)
  const [selectedDateForStatus, setSelectedDateForStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter photos
  const filteredPhotos = useMemo(() => {
    return photosData.filter(photo => {
      const matchesSource = sourceFilter === 'all' || photo.source === sourceFilter
      const matchesStatus = statusFilter === 'all' || photo.status === statusFilter
      return matchesSource && matchesStatus
    })
  }, [photosData, sourceFilter, statusFilter])

  // Group photos by date
  const photosByDate = useMemo(() => {
    const grouped: Record<string, PhotoData[]> = {}
    filteredPhotos.forEach(photo => {
      if (!grouped[photo.date]) {
        grouped[photo.date] = []
      }
      grouped[photo.date].push(photo)
    })
    const sortedKeys = Object.keys(grouped).sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    )
    const sortedGrouped: Record<string, PhotoData[]> = {}
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key]
    })
    return sortedGrouped
  }, [filteredPhotos])

  // Get date group status
  const getDateGroupStatus = (date: string): DateGroupStatus => {
    const photos = photosByDate[date] || []
    if (photos.length === 0) {
      return { date, status: 'pending', source: 'mixed' }
    }

    const statuses = new Set(photos.map(p => p.status))
    const sources = new Set(photos.map(p => p.source))
    const uploaders = new Set(photos.map(p => p.uploadedBy))

    let status: 'pending' | 'approved' | 'not_approved' | 'mixed' = 'pending'
    if (statuses.size === 1) {
      status = Array.from(statuses)[0] as 'pending' | 'approved' | 'not_approved'
    } else {
      status = 'mixed'
    }

    const source: 'client' | 'subcontractor' | 'mixed' =
      sources.size === 1 ? Array.from(sources)[0] as 'client' | 'subcontractor' : 'mixed'

    const uploadedBy = uploaders.size === 1 ? Array.from(uploaders)[0] : 'Multiple users'

    const approvedPhoto = photos.find(p => p.status === 'approved')

    return {
      date,
      status,
      source,
      uploadedBy,
      // @ts-ignore
      approvedDate: approvedPhoto?.approvedDate,
       // @ts-ignore
      approvedBy: approvedPhoto?.approvedBy
    }
  }

  // Stats
  const stats = useMemo(() => {
    return {
      total: photosData.length,
      client: photosData.filter(p => p.source === 'client').length,
      subcontractor: photosData.filter(p => p.source === 'subcontractor').length,
      pending: photosData.filter(p => p.status === 'pending').length,
      approved: photosData.filter(p => p.status === 'approved').length,
      notApproved: photosData.filter(p => p.status === 'not_approved').length,
    }
  }, [photosData])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Handle date-level status change
  const handleDateStatusChange = (date: string, newStatus: 'pending' | 'approved' | 'not_approved') => {
    setPhotosData(prev => prev.map(photo => {
      if (photo.date === date) {
        return {
          ...photo,
          status: newStatus,
          approvedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : undefined,
          approvedBy: newStatus === 'approved' ? 'Current User' : undefined
        }
      }
      return photo
    }))

    setShowDateStatusPopup(false)
    setSelectedDateForStatus(null)

    // Call parent callback if provided
    if (onStatusChange) {
      onStatusChange(date, newStatus)
    }

    console.log(`All photos for ${date} changed to ${newStatus}`)
  }

  // Handle date checkbox toggle
  const handleDateToggle = (date: string) => {
    const newSelectedDates = new Set(selectedDates)
    const newSelectedPhotos = new Set(selectedPhotos)

    const photosForDate = photosByDate[date] || []

    if (selectedDates.has(date)) {
      newSelectedDates.delete(date)
      photosForDate.forEach(photo => newSelectedPhotos.delete(photo.id))
    } else {
      newSelectedDates.add(date)
      photosForDate.forEach(photo => newSelectedPhotos.add(photo.id))
    }

    setSelectedDates(newSelectedDates)
    setSelectedPhotos(newSelectedPhotos)
  }

  // Handle individual photo toggle
  const handlePhotoToggle = (photoId: string, date: string) => {
    const newSelectedPhotos = new Set(selectedPhotos)
    const newSelectedDates = new Set(selectedDates)

    if (newSelectedPhotos.has(photoId)) {
      newSelectedPhotos.delete(photoId)
    } else {
      newSelectedPhotos.add(photoId)
    }

    const photosForDate = photosByDate[date] || []
    const allSelected = photosForDate.every(photo => newSelectedPhotos.has(photo.id))

    if (allSelected) {
      newSelectedDates.add(date)
    } else {
      newSelectedDates.delete(date)
    }

    setSelectedPhotos(newSelectedPhotos)
    setSelectedDates(newSelectedDates)
  }

  // Handle photo click for modal
  const handlePhotoClick = (photo: PhotoData) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    onPhotoClick({ photos: filteredPhotos, startIndex: index >= 0 ? index : 0 })
  }

  // Select all photos
  const handleSelectAll = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set())
      setSelectedDates(new Set())
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)))
      setSelectedDates(new Set(Object.keys(photosByDate)))
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setUploadFiles(prev => [...prev, ...files])
  }

  // Handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadFiles(prev => [...prev, ...files])
  }

  // Remove file from upload list
  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Get status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, border: 'border-green-200' }
      case 'pending':
        return { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, border: 'border-yellow-200' }
      case 'not_approved':
        return { label: 'Not Approved', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, border: 'border-red-200' }
      case 'mixed':
        return { label: 'Mixed Status', bg: 'bg-purple-100', text: 'text-purple-700', icon: AlertCircle, border: 'border-purple-200' }
      default:
        return { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle, border: 'border-gray-200' }
    }
  }

  // Get source config
  const getSourceConfig = (source: string) => {
    switch (source) {
      case 'client':
        return { label: 'Client', bg: 'bg-blue-500', text: 'text-white', icon: User }
      case 'subcontractor':
        return { label: 'Subcontractor', bg: 'bg-orange-500', text: 'text-white', icon: HardHat }
      case 'mixed':
        return { label: 'Mixed', bg: 'bg-purple-500', text: 'text-white', icon: User }
      default:
        return { label: 'Unknown', bg: 'bg-gray-500', text: 'text-white', icon: User }
    }
  }

  const isAllSelected = selectedPhotos.size === filteredPhotos.length && filteredPhotos.length > 0
  const hasSelection = selectedPhotos.size > 0

  // Date Status Popup Component
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
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Update Date Status</h3>
              <button
                onClick={() => setShowDateStatusPopup(false)}
                className="p-1 hover:bg-white/10 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Date Info */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-primary" />
                  <h4 className="font-semibold text-gray-900">{formatDate(selectedDateForStatus)}</h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${sourceConfig.bg} ${sourceConfig.text}`}>
                    <sourceConfig.icon size={10} />
                    {sourceConfig.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${currentStatus.bg} ${currentStatus.text}`}>
                    <currentStatus.icon size={10} />
                    {currentStatus.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {photos.length} photo{photos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {dateGroup.uploadedBy && (
              <p className="text-xs text-gray-600 mt-2">
                Uploaded by: <span className="font-medium">{dateGroup.uploadedBy}</span>
              </p>
            )}
          </div>

          {/* Photo Grid Preview */}
          <div className="p-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Photos in this group:</p>
            <div className="grid grid-cols-6 gap-2 mb-4 max-h-32 overflow-y-auto">
              {photos.slice(0, 12).map(photo => (
                <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {photos.length > 12 && (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">+{photos.length - 12}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Change Options */}
          <div className="px-4 pb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Change Status for All Photos:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDateStatusChange(selectedDateForStatus, 'pending')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all
                  ${dateGroup.status === 'pending'
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50'
                  }`}
              >
                <Clock size={20} className="text-yellow-600" />
                <span className="text-xs font-medium text-gray-700">Pending</span>
              </button>

              <button
                onClick={() => handleDateStatusChange(selectedDateForStatus, 'approved')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all
                  ${dateGroup.status === 'approved'
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
              >
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-xs font-medium text-gray-700">Approved</span>
              </button>

              <button
                onClick={() => handleDateStatusChange(selectedDateForStatus, 'not_approved')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all
                  ${dateGroup.status === 'not_approved'
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                  }`}
              >
                <XCircle size={20} className="text-red-600" />
                <span className="text-xs font-medium text-gray-700">Not Approved</span>
              </button>
            </div>
          </div>

          {/* Approval Info */}
          {dateGroup.status === 'approved' && dateGroup.approvedDate && (
            <div className="px-4 pb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-700">
                  <span className="font-medium">Approved on:</span> {dateGroup.approvedDate}
                  {dateGroup.approvedBy && <span> by {dateGroup.approvedBy}</span>}
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
            <button
              onClick={() => setShowDateStatusPopup(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition"
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
      {/* HEADER WITH STATS & FILTERS */}
      <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4">
        {/* Top Row - Title & Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ImageIcon className="text-primary" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">Photos</h2>
              <p className="text-xs text-gray-500">{filteredPhotos.length} of {photosData.length} photos</p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            <Upload size={14} />
            <span>Upload</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
          <div className="bg-gray-50 rounded-lg p-2.5 border">
            <p className="text-[10px] text-gray-500 font-medium">Total</p>
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
            <p className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
              <User size={10} /> Client
            </p>
            <p className="text-lg font-bold text-blue-700">{stats.client}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2.5 border border-orange-100">
            <p className="text-[10px] text-orange-600 font-medium flex items-center gap-1">
              <HardHat size={10} /> Subcontractor
            </p>
            <p className="text-lg font-bold text-orange-700">{stats.subcontractor}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2.5 border border-yellow-100">
            <p className="text-[10px] text-yellow-600 font-medium flex items-center gap-1">
              <Clock size={10} /> Pending
            </p>
            <p className="text-lg font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
            <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
              <CheckCircle size={10} /> Approved
            </p>
            <p className="text-lg font-bold text-green-700">{stats.approved}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
            <p className="text-[10px] text-red-600 font-medium flex items-center gap-1">
              <XCircle size={10} /> Not Approved
            </p>
            <p className="text-lg font-bold text-red-700">{stats.notApproved}</p>
          </div>
        </div>

        {/* Filters & Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Source Filter */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {[
                { value: 'all', label: 'All', icon: null },
                { value: 'client', label: 'Client', icon: User },
                { value: 'subcontractor', label: 'Sub', icon: HardHat },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSourceFilter(item.value as any)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition
                    ${sourceFilter === item.value
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {item.icon && <item.icon size={12} />}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              {[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'not_approved', label: 'Not Approved' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setStatusFilter(item.value as any)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap
                    ${statusFilter === item.value
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

         
          <div className="flex items-center gap-2 flex-wrap">
            {hasSelection && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                {selectedPhotos.size} selected
              </span>
            )}

            <button
              onClick={handleSelectAll}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all
                ${isAllSelected
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {isAllSelected ? <SquareCheck size={14} /> : <Square size={14} />}
              <span className="hidden xs:inline">{isAllSelected ? 'Deselect' : 'Select All'}</span>
            </button>

            {hasSelection && (
              <>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-all">
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all">
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      
      <div className="space-y-4">
        {Object.entries(photosByDate).map(([date, photos]) => {
          const isDateSelected = selectedDates.has(date)
          const someSelected = photos.some(p => selectedPhotos.has(p.id))
          const dateGroup = getDateGroupStatus(date)
          const statusConfig = getStatusConfig(dateGroup.status)
          const sourceConfig = getSourceConfig(dateGroup.source)

          return (
            <div key={date} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* DATE HEADER */}
              <div className={`flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b transition-all
                  ${isDateSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2.5 flex-1">
                  {/* Checkbox */}
                  <div
                    onClick={() => handleDateToggle(date)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 cursor-pointer
                      ${isDateSelected
                        ? 'bg-primary border-primary'
                        : someSelected
                          ? 'bg-primary/30 border-primary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                  >
                    {(isDateSelected || someSelected) && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>

                  {/* Date Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{formatDate(date)}</span>
                      </div>

                      {/* Source Badge */}
                      <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${sourceConfig.bg} ${sourceConfig.text}`}>
                        <sourceConfig.icon size={10} />
                        {sourceConfig.label}
                      </span>

                      {/* Status Badge - Clickable */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDateForStatus(date)
                          setShowDateStatusPopup(true)
                        }}
                        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium transition hover:opacity-80 ${statusConfig.bg} ${statusConfig.text}`}
                      >
                        <statusConfig.icon size={10} />
                        {statusConfig.label}
                      </button>

                      {/* Photo count */}
                      <span className="text-xs text-gray-500 bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {photos.length}
                      </span>
                    </div>

                    {/* Uploader info */}
                    {dateGroup.uploadedBy && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        by {dateGroup.uploadedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* PHOTOS GRID */}
              <div className="p-2 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {photos.map(photo => {
                    const isSelected = selectedPhotos.has(photo.id)

                    return (
                      <div
                        key={photo.id}
                        className={`group relative rounded-xl overflow-hidden cursor-pointer
                          transition-all duration-200 bg-gray-100
                          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:shadow-lg'}`}
                      >
                        {/* Photo Container */}
                        <div className="aspect-square">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                            onClick={() => handlePhotoClick(photo)}
                          />
                        </div>

                        {/* Overlay on hover */}
                        <div
                          className={`absolute inset-0 transition-all pointer-events-none
                            ${isSelected
                              ? 'bg-primary/20'
                              : 'bg-black/0 group-hover:bg-black/10'
                            }`}
                        />

                        {/* Checkbox - Top Left */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePhotoToggle(photo.id, date)
                          }}
                          className="absolute top-2 left-2 z-10"
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                              transition-all shadow-sm cursor-pointer
                              ${isSelected
                                ? 'bg-primary border-primary'
                                : 'bg-white/90 border-white group-hover:border-primary'
                              }`}
                          >
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>
                        </div>

                        {/* Photo Info - Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-6">
                          <div className="flex flex-col items-start justify-start">
                            <span className="text-white text-[10px] font-medium">
                              {photo.time}
                            </span>
                          </div>
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

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">
            {photosData.length === 0 ? 'No photos yet' : 'No photos match filters'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {photosData.length === 0
              ? 'Upload photos to document this work order'
              : 'Try adjusting your filters to see more photos'
            }
          </p>
          {photosData.length === 0 && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all"
            >
              Upload Photos
            </button>
          )}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Upload Photos</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              {/* Source Selection */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 mb-2 block">Upload As:</label>
                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 border-2 border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                    <User size={14} />
                    Client Side
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-50 border-2 border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition">
                    <HardHat size={14} />
                    Subcontractor Side
                  </button>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all
                  ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                  }`}
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
                  className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
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

              {/* Selected Files Preview */}
              {uploadFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    {uploadFiles.length} file(s) selected
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                    {uploadFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadFiles([])
                }}
                className="px-4 py-2 text-gray-600 text-xs font-medium hover:bg-gray-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                disabled={uploadFiles.length === 0}
                className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload {uploadFiles.length > 0 && `(${uploadFiles.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Status Popup */}
      <DateStatusPopup />

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  )
}