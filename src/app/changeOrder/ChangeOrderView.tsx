import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Send,
  Upload,
  Trash2,
  Plus,
  Edit2,
  Save,
  Minus,
  Eye
} from 'lucide-react'
import CalculationBreakdownModal from './CalculationBreakdownModal'

interface ChangeItem {
  id: string
  currentItem: string
  itemTitle: string
  description: string
  quantity: number
  scopeOfWork: string
  currentPrice: number
  newPrice: number
  costImpact: number
  timeImpact: number
  type: 'delete' | 'modify' | 'add'
  image?: string
}

interface ChangeOrderData {
  id: string
  orderNumber: string
  projectType: string
  jobNumber: string
  date: string
  owner: string
  ownerAddress: string
  pm: string
  status: 'pending' | 'approved' | 'rejected' | 'draft'
  originalContractValue: number
  items: ChangeItem[]
  ownerApproval?: {
    name: string
    date: string
  }
  contractorApproval?: {
    name: string
    date: string
  }
  attachments: string[]
  notes: string
}

// Static data - matches estimate items
const changeOrderData: ChangeOrderData = {
  id: "1",
  orderNumber: "CO-1134-001",
  projectType: "Residential Renovation",
  jobNumber: "1134",
  date: "2024-01-15",
  owner: "Trang Leminh",
  ownerAddress: "5534 Jessip St, Morrisville, North Carolina 27560",
  pm: "John Manager",
  status: "pending",
  originalContractValue: 5835,
  items: [
    {
      id: "1",
      itemTitle: "Paint Estimate",
      currentItem: "Paint - Labor",
      description: "Paint - Labor\nPatching small holes\nPrep walls / sanding\nPrime all walls\nPaint walls (2 coats)\nPaint baseboard trim",
      quantity: 2000,
      scopeOfWork: "Remove paint labor from scope - Client decided to handle painting internally",
      currentPrice: 2.5,
      newPrice: 0,
      costImpact: -5000,
      timeImpact: -3,
      type: "delete",
      image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg"
    },
    {
      id: "2",
      itemTitle: "Carpet Services",
      currentItem: "Carpet Installation",
      description: "Carpet Installation\nRemove old carpet\nInstall new padding\nInstall carpet",
      quantity: 500,
      scopeOfWork: "Additional 200 sqft added to carpet scope - Extended to include hallway",
      currentPrice: 1.67,
      newPrice: 1.67,
      costImpact: 835,
      timeImpact: 1,
      type: "modify",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
      id: "3",
      itemTitle: "Flooring",
      currentItem: "LVP Installation",
      description: "LVP Installation\nSubfloor preparation\nMoisture barrier\nLVP plank installation",
      quantity: 800,
      scopeOfWork: "New item added - LVP flooring for basement and family room",
      currentPrice: 0,
      newPrice: 2.5,
      costImpact: 2000,
      timeImpact: 2,
      type: "add",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"
    },
  ],
  ownerApproval: undefined,
  contractorApproval: undefined,
  attachments: [],
  notes: ""
}

// Type configuration for badges
const typeConfig = {
  delete: {
    label: 'Remove',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: Minus,
  },
  modify: {
    label: 'Modify',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: Edit2,
  },
  add: {
    label: 'Add',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: Plus,
  },
}

export default function ChangeOrderView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [data] = useState<ChangeOrderData>(changeOrderData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculations
  const totalCostImpact = data.items.reduce((sum, item) => sum + item.costImpact, 0)
  const totalTimeImpact = data.items.reduce((sum, item) => sum + item.timeImpact, 0)
  const newProjectTotal = data.originalContractValue + totalCostImpact

  return (
    <div className="p-4 md:p-4">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-700 mb-6">Right Step Flooring - Change Order</h1>

      {/* 1. Project Header Section */}
      <section className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Project Header</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-1/3">Field</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Project Type</td>
                <td className="px-4 py-3 text-sm text-gray-900">{data.projectType}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Job #</td>
                <td className="px-4 py-3 text-sm text-gray-900">{data.jobNumber}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Date</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(data.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Owner</td>
                <td className="px-4 py-3 text-sm text-gray-900">{data.owner}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Owner Property Address</td>
                <td className="px-4 py-3 text-sm text-gray-900">{data.ownerAddress}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">PM</td>
                <td className="px-4 py-3 text-sm text-gray-900">{data.pm}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Original Contract Value</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">${data.originalContractValue.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Change Order Log Section */}
      <section className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Change Order Log</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-200">Current Item / New item</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border  text-nowrap border-gray-200">Action Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border border-gray-200">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase border border-gray-200">Description / Scope of Work</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border border-gray-200">Cost Impact ($)</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase border border-gray-200">Time Impact (Days)</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => {
                  const isDeleted = item.type === 'delete'
                  const isAdded = item.type === 'add'
                  const isModified = item.type === 'modify'

                  const config = typeConfig[item.type]
                  const TypeIcon = config.icon

                  const deletedCellStyle = isDeleted ? { position: 'relative' as const } : {}

                  const RedLine = () => (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: '50%',
                        height: '2px',
                        backgroundColor: '#ef4444',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                      }}
                    />
                  )

                  return (
                    <tr
                      key={item.id}
                      className={
                        isDeleted ? 'bg-red-50/50' :
                        isAdded ? 'bg-green-50/50' :
                        isModified ? 'bg-yellow-50/50' : ''
                      }
                    >
                      {/* Current Item - Full Details */}
                      <td
                        className={`px-4 py-3 border border-gray-200 min-w-[220px] ${isDeleted ? 'opacity-70' : ''}`}
                        style={deletedCellStyle}
                      >
                        {isDeleted && <RedLine />}
                        <div className="flex items-start gap-3">
                          {/* Image */}
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt="" 
                              className="w-14 h-14 rounded-md object-cover flex-shrink-0 mt-0.5"
                            />
                          )}
                          <div>
                            {/* Title */}
                            <span className={`text-xs font-bold text-gray-800 block ${isDeleted ? 'line-through' : ''}`}>
                              {item.itemTitle}
                            </span>
                            {/* Description - Multi Line */}
                            <p className={`text-xs text-gray-600 whitespace-pre-wrap mt-1 ${isDeleted ? 'line-through' : ''}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td
                        className="px-4 py-3 text-center border border-gray-200"
                        style={deletedCellStyle}
                      >
                        {isDeleted && <RedLine />}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                          <TypeIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td
                        className={`px-4 py-3 text-center border border-gray-200 ${isDeleted ? 'opacity-70' : ''}`}
                        style={deletedCellStyle}
                      >
                        {isDeleted && <RedLine />}
                        <span className="text-sm text-gray-900">{item.quantity.toLocaleString()}</span>
                      </td>

                      {/* Scope of Work */}
                      <td
                        className={`px-4 py-3 border border-gray-200 ${isDeleted ? 'opacity-70' : ''}`}
                        style={deletedCellStyle}
                      >
                        {isDeleted && <RedLine />}
                        <span className="text-sm text-gray-700">{item.scopeOfWork}</span>
                      </td>
                      <td>
                        {isDeleted && <RedLine />}
                        <span className='text-prhetty bg-primary border-primary/50  '></span>
                      </td>

                      {/* Cost Impact */}
                      <td
                        className="px-4 py-3 text-center border border-gray-200"
                        style={deletedCellStyle}
                      >
                        {isDeleted && <RedLine />}
                        <span className={`text-sm font-semibold ${item.costImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.costImpact >= 0 ? '+' : ''}${item.costImpact.toLocaleString()}
                        </span>
                      </td>

                      {/* Time Impact */}
                      <td
                        className="px-4 py-3 text-center border border-gray-200"
                        style={deletedCellStyle}
                      >
                        {isDeleted && <RedLine />}
                        <span className={`text-sm font-semibold ${
                          item.timeImpact > 0 ? 'text-orange-600' :
                          item.timeImpact < 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {item.timeImpact > 0 ? '+' : ''}{item.timeImpact}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Pending CO Summary Section */}
      <section className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Pending CO Summary</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border border-gray-200">Original Contract $</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border border-gray-200">Change Amount $</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border border-gray-200">New Project Total $</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border border-gray-200">Cumulative Days Added</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4 text-center border border-gray-200">
                  <span className="text-lg font-bold text-gray-900">${data.originalContractValue.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4 text-center border border-gray-200">
                  <span className={`text-lg font-bold ${totalCostImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalCostImpact >= 0 ? '+' : ''}${totalCostImpact.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-4 text-center border border-gray-200">
                  <span className="text-lg font-bold text-blue-600">${newProjectTotal.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4 text-center border border-gray-200">
                  <span className={`text-lg font-bold ${
                    totalTimeImpact > 0 ? 'text-orange-600' :
                    totalTimeImpact < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {totalTimeImpact > 0 ? '+' : ''}{totalTimeImpact}
                  </span>
                </td>
                <td className="px-4 py-4 text-center border border-gray-200">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 hover:bg-green-700 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Supporting Documents */}
      <section className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Supporting drawings / site photos</h2>
        <div className="bg-white rounded-lg border p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Drop files here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
          </div>
          {data.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {data.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{file}</span>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Owner Approval */}
      <section className="mb-6">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Owner Approval & Payment Request</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">Date of Approval</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4 border border-gray-200">
                  <span className="text-sm font-medium italic text-gray-700">Owner / Rep</span>
                </td>
                <td className="px-4 py-4 border border-gray-200">
                  <span className="text-sm text-gray-400">{data.ownerApproval?.name || ''}</span>
                </td>
                <td className="px-4 py-4 border border-gray-200">
                  <span className="text-sm text-gray-400">{data.ownerApproval?.date || ''}</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 border border-gray-200">
                  <span className="text-sm font-medium italic text-gray-700">Contractor PM</span>
                </td>
                <td className="px-4 py-4 border border-gray-200">
                  <span className="text-sm text-gray-400">{data.contractorApproval?.name || ''}</span>
                </td>
                <td className="px-4 py-4 border border-gray-200">
                  <span className="text-sm text-gray-400">{data.contractorApproval?.date || ''}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 py-4">
        <button
          onClick={() => navigate('/change-orders')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        {/* <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Draft
        </button> */}
        <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center gap-2">
          <Send className="w-4 h-4" />
          Approve
        </button>
      </div>

      {/* Modal */}
      <CalculationBreakdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={data.items}
        originalContractValue={data.originalContractValue}
      />
    </div>
  )
}