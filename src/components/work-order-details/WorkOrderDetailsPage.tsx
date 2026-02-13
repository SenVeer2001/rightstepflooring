import { useState } from "react"
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react"
import WorkOrderLeftPanel from "./WorkOrderLeftPanel"
import WorkOrderRightPanel from "./WorkOrderRightPanel"
import PhotoViewerModal from "./PhotoViewerModal"
import { useNavigate } from "react-router-dom"
import { generateWorkOrderPDF } from "../../services/pdfGenerator"

export default function WorkOrderDetailsPage() {
  const navigate = useNavigate()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<{
    images: string[]
    startIndex: number
  } | null>(null)

  // Sample work order data - Replace with actual data from your state/API
  const workOrderData = {
    workOrderId: "WO-2024-001",
    jobId: "JOB-480",
    jobName: "Kitchen Renovation",
    clientName: "John Smith",
    clientPhone: "+1 (555) 123-4567",
    clientEmail: "john.smith@email.com",
    clientAddress: "123 Main Street, New York, NY 10001",
    technician: "Mike Johnson",
    status: "In Progress",
    startDate: "Jan 15, 2024",
    endDate: "Jan 20, 2024",
    items: [
      {
        id: "1",
        name: "Kitchen Cabinet Installation",
        description: "Install upper and lower cabinets",
        color: "White Oak",
        quantity: 12,
        unit: "units",
        unitPrice: 250.00,
        totalPrice: 3000.00
      },
      {
        id: "2",
        name: "Granite Countertop",
        description: "Cut and install granite countertop",
        color: "Black Galaxy",
        quantity: 25,
        unit: "sq ft",
        unitPrice: 85.00,
        totalPrice: 2125.00
      },
      {
        id: "3",
        name: "Backsplash Tile Installation",
        description: "Subway tile backsplash",
        color: "White",
        quantity: 30,
        unit: "sq ft",
        unitPrice: 45.00,
        totalPrice: 1350.00
      },
      {
        id: "4",
        name: "Plumbing Work",
        description: "Install new sink and faucet",
        color: "-",
        quantity: 1,
        unit: "job",
        unitPrice: 650.00,
        totalPrice: 650.00
      },
      {
        id: "5",
        name: "Electrical Work",
        description: "Install under-cabinet lighting",
        color: "-",
        quantity: 8,
        unit: "lights",
        unitPrice: 75.00,
        totalPrice: 600.00
      }
    ],
    subtotal: 7725.00,
    tax: 618.00,
    total: 8343.00,
    notes: "Customer requested additional electrical outlets. All work to be completed by end of week. Please ensure proper cleanup after installation."
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Simulate delay for PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate PDF
      generateWorkOrderPDF(workOrderData)
      
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* TOP HEADER WITH BACK BUTTON */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
        >
          <ArrowLeft 
            size={20} 
            className="text-gray-600 group-hover:text-primary transition-colors" 
          />
        </button>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Work Order Details</h1>
          <p className="text-sm text-gray-500">
            {workOrderData.jobId} • {workOrderData.workOrderId} • {workOrderData.jobName}
          </p>
        </div>

        <div className="flex items-center gap-3">
         

          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText size={18} />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-3 thin-scrollbar">
          <WorkOrderLeftPanel />
        </div>

        {/* RIGHT FIXED/STICKY */}
        <div className="w-[380px] border-l bg-white overflow-y-auto">
          <div className="sticky top-0">
            <WorkOrderRightPanel />
          </div>
        </div>
      </div>

      {/* PHOTO MODAL */}
      <PhotoViewerModal
      // @ts-ignore
        images={selectedPhoto?.images || null}
        startIndex={selectedPhoto?.startIndex || 0}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  )
}