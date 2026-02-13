// services/pdfGenerator.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface WorkOrderItem {
  id: string
  name: string
  description?: string
  color?: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  status?: string
}

interface WorkOrderData {
  workOrderId: string
  jobId: string
  jobName: string
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  technician: string
  status: string
  startDate: string
  endDate: string
  items: WorkOrderItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  photos?: { url: string; name: string }[]
}

export class WorkOrderPDFGenerator {
  private doc: jsPDF
  private primaryColor = '#3B82F6' // Your primary color
  private pageWidth: number
  private pageHeight: number
  private margin = 20

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
  }

  generatePDF(data: WorkOrderData): void {
    this.addHeader(data)
    this.addClientInfo(data)
    this.addWorkOrderInfo(data)
    this.addItemsTable(data)
    this.addTotals(data)
    this.addNotes(data)
    this.addFooter()
    
    // Save the PDF
    this.doc.save(`WorkOrder_${data.workOrderId}.pdf`)
  }

  private addHeader(data: WorkOrderData): void {
    // Company Logo/Name
    this.doc.setFillColor(59, 130, 246) // Primary color
    this.doc.rect(0, 0, this.pageWidth, 40, 'F')
    
    // Company Name
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Your Company Name', this.margin, 20)
    
    // Work Order Title
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('WORK ORDER', this.pageWidth - this.margin - 40, 20)
    
    // Work Order Number
    this.doc.setFontSize(10)
    this.doc.text(`#${data.workOrderId}`, this.pageWidth - this.margin - 40, 27)
    
    this.doc.setTextColor(0, 0, 0) // Reset to black
  }

  private addClientInfo(data: WorkOrderData): void {
    let yPos = 55
    
    // Client Section Title
    this.doc.setFillColor(245, 245, 245)
    this.doc.rect(this.margin, yPos - 5, this.pageWidth - (this.margin * 2), 8, 'F')
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('CLIENT INFORMATION', this.margin + 2, yPos)
    
    yPos += 12
    
    // Client Details
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    
    const clientInfo = [
      [`Client:`, data.clientName],
      [`Phone:`, data.clientPhone],
      [`Email:`, data.clientEmail],
      [`Address:`, data.clientAddress]
    ]
    
    clientInfo.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.margin, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(value, this.margin + 25, yPos)
      yPos += 6
    })
  }

  private addWorkOrderInfo(data: WorkOrderData): void {
    let yPos = 105
    
    // Work Order Section Title
    this.doc.setFillColor(245, 245, 245)
    this.doc.rect(this.margin, yPos - 5, this.pageWidth - (this.margin * 2), 8, 'F')
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('WORK ORDER DETAILS', this.margin + 2, yPos)
    
    yPos += 12
    
    // Work Order Details in two columns
    this.doc.setFontSize(10)
    
    const leftColumn = [
      [`Job ID:`, data.jobId],
      [`Job Name:`, data.jobName],
      [`Technician:`, data.technician]
    ]
    
    const rightColumn = [
      [`Status:`, data.status],
      [`Start Date:`, data.startDate],
      [`End Date:`, data.endDate]
    ]
    
    // Left column
    leftColumn.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.margin, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(value, this.margin + 25, yPos)
      yPos += 6
    })
    
    // Right column
    yPos = 117
    rightColumn.forEach(([label, value]) => {
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(label, this.pageWidth / 2, yPos)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(value, this.pageWidth / 2 + 25, yPos)
      yPos += 6
    })
  }

  private addItemsTable(data: WorkOrderData): void {
    const startY = 145
    
    // Items Section Title
    this.doc.setFillColor(245, 245, 245)
    this.doc.rect(this.margin, startY - 5, this.pageWidth - (this.margin * 2), 8, 'F')
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('ITEMS / SERVICES', this.margin + 2, startY)
    
    // Prepare table data
    const tableHeaders = ['#', 'Item/Service', 'Color', 'Qty', 'Unit', 'Unit Price', 'Total']
    const tableData = data.items.map((item, index) => [
      (index + 1).toString(),
      item.name + (item.description ? `\n${item.description}` : ''),
      item.color || '-',
      item.quantity.toString(),
      item.unit,
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.totalPrice.toFixed(2)}`
    ])
    
    // Generate table using autoTable
    autoTable(this.doc, {
      startY: startY + 8,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246], // Primary color
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' }, // #
        1: { cellWidth: 60 }, // Item/Service
        2: { cellWidth: 25, halign: 'center' }, // Color
        3: { cellWidth: 15, halign: 'center' }, // Qty
        4: { cellWidth: 20, halign: 'center' }, // Unit
        5: { cellWidth: 25, halign: 'right' }, // Unit Price
        6: { cellWidth: 25, halign: 'right' } // Total
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { left: this.margin, right: this.margin }
    })
  }

  private addTotals(data: WorkOrderData): void {
    // Get the final Y position after the table
    const finalY = (this.doc as any).lastAutoTable.finalY + 10
    
    const totalsX = this.pageWidth - 80
    let yPos = finalY
    
    // Subtotal
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Subtotal:', totalsX, yPos)
    this.doc.text(`$${data.subtotal.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' })
    
    yPos += 6
    
    // Tax
    this.doc.text('Tax:', totalsX, yPos)
    this.doc.text(`$${data.tax.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' })
    
    yPos += 8
    
    // Total line
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(totalsX - 5, yPos - 4, this.pageWidth - this.margin, yPos - 4)
    
    // Total
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('TOTAL:', totalsX, yPos)
    this.doc.setTextColor(59, 130, 246) // Primary color
    this.doc.text(`$${data.total.toFixed(2)}`, totalsX + 40, yPos, { align: 'right' })
    this.doc.setTextColor(0, 0, 0) // Reset to black
  }

  private addNotes(data: WorkOrderData): void {
    if (!data.notes) return
    
    const finalY = (this.doc as any).lastAutoTable.finalY + 35
    
    // Notes Section
    this.doc.setFillColor(245, 245, 245)
    this.doc.rect(this.margin, finalY - 5, this.pageWidth - (this.margin * 2), 8, 'F')
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('NOTES', this.margin + 2, finalY)
    
    // Notes content
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    const splitNotes = this.doc.splitTextToSize(data.notes, this.pageWidth - (this.margin * 2) - 4)
    this.doc.text(splitNotes, this.margin + 2, finalY + 8)
  }

  private addFooter(): void {
    // Footer
    this.doc.setFontSize(8)
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(
      'Thank you for your business!',
      this.pageWidth / 2,
      this.pageHeight - 15,
      { align: 'center' }
    )
    this.doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      this.pageWidth / 2,
      this.pageHeight - 10,
      { align: 'center' }
    )
  }
}

// Export function for easy use
export const generateWorkOrderPDF = (data: WorkOrderData): void => {
  const generator = new WorkOrderPDFGenerator()
  generator.generatePDF(data)
}