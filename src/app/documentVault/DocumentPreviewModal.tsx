// components/DocumentPreviewModal.tsx
import { useState, useEffect } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  ZoomIn,
  ZoomOut,
 
  Image as ImageIcon,
  Printer,
  Loader2,
  CheckCircle,
  RotateCw,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

// Types
interface AssociatedImage {
  id: string;
  url: string;
  name: string;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  documentName: string;
  totalPages?: number;
  images?: AssociatedImage[];
}

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  pdfUrl,
  documentName,
  totalPages = 1,
  images = [],
}: DocumentPreviewModalProps) => {
  // PDF States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [pdfZoom, setPdfZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  // Image States
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState<"pdf" | "images">("pdf");

  // Default images if none provided
  const associatedImages: AssociatedImage[] = images.length > 0 ? images : [
    { id: "img-1", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800", name: "Site Photo 1" },
    { id: "img-2", url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800", name: "Floor Plan" },
    { id: "img-3", url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800", name: "Contractor ID" },
    { id: "img-4", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", name: "Project Site" },
    { id: "img-5", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", name: "Building Front" },
  ];


    // PDF Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
    }
  };

  

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePageInputBlur();
    }
  };

  // Image Handlers
  const handleNextImage = () => {
    if (currentImageIndex < associatedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleRotateImage = () => {
    setImageRotation((prev) => (prev + 90) % 360);
  };

  // Zoom Handlers
  const handleZoomIn = () => {
    if (activeTab === "pdf") {
      setPdfZoom((prev) => Math.min(prev + 25, 200));
    } else {
      setImageZoom((prev) => Math.min(prev + 25, 200));
    }
  };

  const handleZoomOut = () => {
    if (activeTab === "pdf") {
      setPdfZoom((prev) => Math.max(prev - 25, 50));
    } else {
      setImageZoom((prev) => Math.max(prev - 25, 50));
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setPageInputValue("1");
      setPdfZoom(100);
      setIsLoading(true);
      setActiveTab("pdf");
      setCurrentImageIndex(0);
      setImageZoom(100);
      setImageRotation(0);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          if (activeTab === "pdf") {
            handleNextPage();
          } else {
            handleNextImage();
          }
          break;
        case "ArrowLeft":
          if (activeTab === "pdf") {
            handlePreviousPage();
          } else {
            handlePreviousImage();
          }
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentPage, totalPages, activeTab, currentImageIndex]);

  if (!isOpen) return null;


  // Current zoom value
  const currentZoom = activeTab === "pdf" ? pdfZoom : imageZoom;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full flex flex-col bg-gray-900">
        
        {/* ==================== HEADER ==================== */}
        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          
          {/* Left: Document Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
              <FileText size={20} className="text-red-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white truncate">{documentName}</h2>
              <p className="text-xs text-gray-400">
                {activeTab === "pdf" ? `PDF • ${totalPages} pages` : `Images • ${associatedImages.length} files`}
              </p>
            </div>
          </div>

          {/* Center: Navigation */}
          {activeTab === "pdf" ? (
            // PDF Page Navigation
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-600 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} className="text-white" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Page</span>
                <input
                  type="text"
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  onBlur={handlePageInputBlur}
                  onKeyDown={handlePageInputKeyDown}
                  className="w-10 px-1 py-0.5 text-sm text-center text-white bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-gray-400">of {totalPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-600 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </div>
          ) : (
            // Image Navigation
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5">
              <button
                onClick={handlePreviousImage}
                disabled={currentImageIndex === 0}
                className="p-1 hover:bg-gray-600 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} className="text-white" />
              </button>

              <span className="text-sm text-white px-2">
                {currentImageIndex + 1} / {associatedImages.length}
              </span>

              <button
                onClick={handleNextImage}
                disabled={currentImageIndex === associatedImages.length - 1}
                className="p-1 hover:bg-gray-600 rounded transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </div>
          )}

          {/* Right: Controls */}
          <div className="flex items-center gap-1">
            {/* Zoom */}
            <div className="flex items-center gap-1 bg-gray-700 rounded-lg px-2 py-1 mr-2">
              <button
                onClick={handleZoomOut}
                disabled={currentZoom <= 50}
                className="p-1 hover:bg-gray-600 rounded transition disabled:opacity-40"
              >
                <ZoomOut size={16} className="text-white" />
              </button>
              <span className="text-xs text-white w-10 text-center">{currentZoom}%</span>
              <button
                onClick={handleZoomIn}
                disabled={currentZoom >= 200}
                className="p-1 hover:bg-gray-600 rounded transition disabled:opacity-40"
              >
                <ZoomIn size={16} className="text-white" />
              </button>
            </div>

            {/* Rotate (Images only) */}
            {activeTab === "images" && (
              <button
                onClick={handleRotateImage}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                data-tooltip-id="preview-tooltip"
                data-tooltip-content="Rotate"
              >
                <RotateCw size={18} className="text-white" />
              </button>
            )}

            <div className="w-px h-5 bg-gray-600 mx-1" />

            
            <a
              href={activeTab === "pdf" ? pdfUrl : associatedImages[currentImageIndex]?.url}
              download
              className="p-2 hover:bg-gray-700 rounded-lg transition"
              data-tooltip-id="preview-tooltip"
              data-tooltip-content="Download"
            >
              <Download size={18} className="text-white" />
            </a>

           
            {activeTab === "pdf" && (
              <button
                onClick={() => window.print()}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
                data-tooltip-id="preview-tooltip"
                data-tooltip-content="Print"
              >
                <Printer size={18} className="text-white" />
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-600 rounded-lg transition ml-2"
              data-tooltip-id="preview-tooltip"
              data-tooltip-content="Close (Esc)"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

       
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex gap-2">
          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "pdf"
                ? "bg-primary text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FileText size={16} />
            PDF
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeTab === "pdf" ? "bg-white/20" : "bg-gray-600"
            }`}>
              {totalPages}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "images"
                ? "bg-primary text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <ImageIcon size={16} />
            Images
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
              activeTab === "images" ? "bg-white/20" : "bg-gray-600"
            }`}>
              {associatedImages.length}
            </span>
          </button>
        </div>

        {/* ==================== CONTENT ==================== */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Viewer Area */}
          <div className="flex-1 bg-gray-900 overflow-auto flex items-center justify-center relative">
            
            {/* PDF Tab */}
            {activeTab === "pdf" && (
              <>
                {/* Loading */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={40} className="text-primary animate-spin" />
                      <p className="text-sm text-gray-400">Loading PDF...</p>
                    </div>
                  </div>
                )}

                {/* PDF Iframe - FULL WIDTH */}
                <div className="w-full h-full p-4">
                  <iframe
                    src={`${pdfUrl}#page=${currentPage}`}
                    className="w-full h-full border-0 rounded-lg bg-white shadow-2xl"
                    title={documentName}
                    onLoad={handleIframeLoad}
                    style={{
                      transform: `scale(${pdfZoom / 100})`,
                      transformOrigin: "center top",
                    }}
                  />
                </div>
              </>
            )}

            {/* Images Tab */}
            {activeTab === "images" && (
              <div className="flex items-center justify-center p-8">
                <img
                  src={associatedImages[currentImageIndex]?.url}
                  alt={associatedImages[currentImageIndex]?.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
                  style={{
                    transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - ONLY FOR IMAGES TAB */}
          {activeTab === "images" && (
            <div className="w-52 bg-gray-800 border-l border-gray-700 flex flex-col flex-shrink-0">
              {/* Sidebar Header */}
              <div className="px-3 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ImageIcon size={14} className="text-gray-400" />
                  Images ({associatedImages.length})
                </h3>
              </div>

              {/* Image Thumbnails */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {associatedImages.map((img, index) => (
                  <div
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:border-primary/50 ${
                      currentImageIndex === index
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-600"
                    }`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-24 object-cover"
                    />

                    {/* Selected Check */}
                    {currentImageIndex === index && (
                      <div className="absolute top-1.5 right-1.5">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      </div>
                    )}

                    {/* Name Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-[10px] text-white truncate font-medium">{img.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== FOOTER ==================== */}
        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between flex-shrink-0">
          {/* Keyboard Shortcuts */}
          <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-500">
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">→</kbd>
            <span>Navigate</span>
            <span className="mx-1">•</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">+</kbd>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">-</kbd>
            <span>Zoom</span>
            <span className="mx-1">•</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">Esc</kbd>
            <span>Close</span>
          </div>

          {/* Current Info */}
          <div className="text-xs text-white bg-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
            {activeTab === "pdf" ? (
              <>
                <FileText size={12} />
                Page {currentPage} of {totalPages}
              </>
            ) : (
              <>
                <ImageIcon size={12} />
                {associatedImages[currentImageIndex]?.name}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <Tooltip
        id="preview-tooltip"
        place="bottom"
        className="!bg-gray-700 !text-white !text-[10px] !px-2 !py-1 !rounded z-[100]"
      />
    </div>
  );
};

export default DocumentPreviewModal;