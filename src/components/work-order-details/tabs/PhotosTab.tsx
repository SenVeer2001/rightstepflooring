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
  Square
} from "lucide-react"

// Updated interface with name
export interface PhotoData {
  id: string
  url: string
  name: string
  date: string
  time: string
  uploadedBy?: string
}

interface Props {
  onPhotoClick: (data: { photos: PhotoData[]; startIndex: number }) => void
}

// Sample data grouped by date with names
const photosData: PhotoData[] = [
  { 
    id: "1", 
    url: "https://images.pexels.com/photos/17303438/pexels-photo-17303438.jpeg", 
    name: "Kitchen Before Work",
    date: "2024-01-15", 
    time: "09:30 AM",
    uploadedBy: "John Smith"
  },
  { 
    id: "2", 
    url: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg", 
    name: "Kitchen After Repair",
    date: "2024-01-15", 
    time: "10:15 AM",
    uploadedBy: "John Smith"
  },
  { 
    id: "3", 
    url: "https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=400", 
    name: "Bathroom Inspection",
    date: "2024-01-15", 
    time: "02:45 PM",
    uploadedBy: "Mike Johnson"
  },
  { 
    id: "4", 
    url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400", 
    name: "Living Room Overview",
    date: "2024-01-14", 
    time: "11:00 AM",
    uploadedBy: "Sarah Wilson"
  },
  { 
    id: "5", 
    url: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=400", 
    name: "Flooring Progress",
    date: "2024-01-14", 
    time: "03:30 PM",
    uploadedBy: "Sarah Wilson"
  },
  { 
    id: "6", 
    url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400", 
    name: "Damage Assessment",
    date: "2024-01-13", 
    time: "10:00 AM",
    uploadedBy: "John Smith"
  },
  { 
    id: "7", 
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400", 
    name: "Material Delivery",
    date: "2024-01-13", 
    time: "01:15 PM",
    uploadedBy: "Mike Johnson"
  },
  { 
    id: "8", 
    url: "https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=400", 
    name: "Final Walkthrough",
    date: "2024-01-13", 
    time: "04:00 PM",
    uploadedBy: "John Smith"
  },
]

export default function PhotosTab({ onPhotoClick }: Props) {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Group photos by date
  const photosByDate = useMemo(() => {
    const grouped: Record<string, PhotoData[]> = {}
    photosData.forEach(photo => {
      if (!grouped[photo.date]) {
        grouped[photo.date] = []
      }
      grouped[photo.date].push(photo)
    })
    // Sort dates in descending order (newest first)
    const sortedKeys = Object.keys(grouped).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    )
    const sortedGrouped: Record<string, PhotoData[]> = {}
    sortedKeys.forEach(key => {
      sortedGrouped[key] = grouped[key]
    })
    return sortedGrouped
  }, [])

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

  // Handle photo click for modal - now passes full photo data
  const handlePhotoClick = (photo: PhotoData) => {
    const index = photosData.findIndex(p => p.id === photo.id)
    onPhotoClick({ photos: photosData, startIndex: index >= 0 ? index : 0 })
  }

  // Select all photos
  const handleSelectAll = () => {
    if (selectedPhotos.size === photosData.length) {
      setSelectedPhotos(new Set())
      setSelectedDates(new Set())
    } else {
      setSelectedPhotos(new Set(photosData.map(p => p.id)))
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

  const isAllSelected = selectedPhotos.size === photosData.length
  const hasSelection = selectedPhotos.size > 0

  return (
    <div className="space-y-4">
      {/* HEADER WITH UPLOAD & ACTIONS */}
      <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left - Title & Upload */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ImageIcon className="text-primary" size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">Photos</h2>
              <p className="text-xs text-gray-500">{photosData.length} uploaded</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {hasSelection && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {selectedPhotos.size} selected
                </span>
              )}

              <button
                onClick={handleSelectAll}
                className={`flex items-center gap-1.5 px-1 py-1 rounded-md text-xs font-medium transition-all
                ${isAllSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {isAllSelected ? <SquareCheck size={20} /> : <Square size={20} />}
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

          <button
            onClick={() => setShowUploadModal(true)}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            <Upload size={14} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* PHOTOS GROUPED BY DATE */}
      <div className="space-y-4">
        {Object.entries(photosByDate).map(([date, photos]) => {
          const isDateSelected = selectedDates.has(date)
          const someSelected = photos.some(p => selectedPhotos.has(p.id))

          return (
            <div key={date} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* DATE HEADER */}
              <div
                className={`flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 border-b cursor-pointer transition-all
                  ${isDateSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                onClick={() => handleDateToggle(date)}
              >
                <div className="flex items-center gap-2.5">
                  {/* Custom Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
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

                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{formatDate(date)}</span>
                  </div>
                </div>

                <span className="text-xs text-gray-500 bg-primary/10 px-2 py-0.5 rounded-full">
                  {photos.length} photos
                </span>
              </div>

              {/* PHOTOS GRID - Responsive */}
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

                        {/* Checkbox */}
                        <div
                          className="absolute top-2 left-2 z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePhotoToggle(photo.id, date)
                          }}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                              transition-all shadow-sm
                              ${isSelected
                                ? 'bg-primary border-primary'
                                : 'bg-white/90 border-white group-hover:border-primary'
                              }`}
                          >
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>
                        </div>

                        {/* Photo Info - Name & Time */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-6">
                          {/* <p className="text-white text-xs font-medium truncate" title={photo.name}>
                            {photo.name}
                          </p> */}
                          <div className="flex flex-col items-start justify-start ">
                            <span className="text-white text-[10px] font-medium">
                              {photo.time}
                            </span>
                             {photo.uploadedBy && (
                              <span className="text-white text-[10px] truncate max-w-[90%]">
                                by {photo.uploadedBy}
                              </span>
                            )}
                           
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
      {photosData.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="text-gray-400" size={32} />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">No photos yet</h3>
          <p className="text-gray-500 text-sm mb-4">Upload photos to document this work order</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all"
          >
            Upload Photos
          </button>
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
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Upload Photos</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
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
    </div>
  )
}