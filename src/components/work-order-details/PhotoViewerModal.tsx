import { useEffect, useRef, useState } from "react"
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Calendar, Clock, User } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Keyboard, Zoom } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import type { PhotoData } from "./tabs/PhotosTab"

// Import Swiper styles
// @ts-ignore
import "swiper/css"
// @ts-ignore
import "swiper/css/navigation"
// @ts-ignore
import "swiper/css/zoom"

interface Props {
  photos: PhotoData[] | null
  startIndex: number
  onClose: () => void
}

export default function PhotoViewerModal({ photos, startIndex, onClose }: Props) {
  const swiperRef = useRef<SwiperType | null>(null)
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    
    if (photos) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [photos, onClose])

  // Update currentIndex when swiper slides
  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex)
  }

  if (!photos || photos.length === 0) return null

  const currentPhoto = photos[currentIndex]

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle download
  const handleDownload = async () => {
    try {
      const response = await fetch(currentPhoto.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentPhoto.name || 'photo'}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  // Toggle zoom
  const handleZoom = () => {
    if (swiperRef.current) {
      const zoom = swiperRef.current.zoom
      if (isZoomed) {
        zoom.out()
      } else {
        zoom.in()
      }
      setIsZoomed(!isZoomed)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 text-white border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          
          {/* Photo Info */}
          <div className="hidden sm:block">
            <h3 className="text-base font-semibold text-white">
              {currentPhoto.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/70 mt-0.5">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(currentPhoto.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {currentPhoto.time}
              </span>
              {currentPhoto.uploadedBy && (
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  {currentPhoto.uploadedBy}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Photo Counter */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
            {currentIndex + 1} / {photos.length}
          </span>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleZoom}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Photo Info */}
      <div className="sm:hidden px-4 py-2 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white truncate">
          {currentPhoto.name}
        </h3>
        <div className="flex items-center gap-3 text-xs text-white/70 mt-1">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {currentPhoto.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {currentPhoto.time}
          </span>
          {currentPhoto.uploadedBy && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {currentPhoto.uploadedBy}
            </span>
          )}
        </div>
      </div>

      {/* SWIPER CAROUSEL */}
      <div className="flex-1 relative flex items-center justify-center px-4 sm:px-16 mt-2">
        {/* Custom Prev Button */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-2 sm:left-4 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
        >
          <ChevronLeft size={24} className="text-primary sm:w-7 sm:h-7" />
        </button>

        <Swiper
          modules={[Navigation, Keyboard, Zoom]}
          initialSlide={startIndex}
          keyboard={{ enabled: true }}
          zoom={{ maxRatio: 3 }}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          className="w-[50%] max-h-[75vh]"
        >
          {photos.map((photo, index) => (
            <SwiperSlide key={photo.id} className="flex items-center justify-center">
              <div className="swiper-zoom-container flex items-center justify-center h-full">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="max-h-[70vh] sm:max-h-[60vh] max-w-full object-cover rounded-lg shadow-2xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Next Button */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-2 sm:right-4 z-10 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
        >
          <ChevronRight size={24} className="text-primary sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* PHOTO DETAILS CARD */}
      {/* <div className="mx-4 mb-2 sm:mx-auto sm:max-w-xl">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 text-white">
          <h4 className="font-semibold text-sm sm:text-base mb-2">{currentPhoto.name}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-white/60 block">Date</span>
              <span className="font-medium">{formatDate(currentPhoto.date)}</span>
            </div>
            <div>
              <span className="text-white/60 block">Time</span>
              <span className="font-medium">{currentPhoto.time}</span>
            </div>
            {currentPhoto.uploadedBy && (
              <div>
                <span className="text-white/60 block">Uploaded By</span>
                <span className="font-medium">{currentPhoto.uploadedBy}</span>
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* THUMBNAIL STRIP */}
      <div className="p-3 sm:p-4 border-t border-white/10">
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 px-2 py-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => swiperRef.current?.slideTo(index)}
              className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden 
                transition-all duration-200
                ${currentIndex === index 
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-black opacity-100 scale-105' 
                  : 'opacity-50 hover:opacity-80 border-2 border-transparent hover:border-white/30'
                }`}
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}