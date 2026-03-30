import React from 'react'
import { X } from 'lucide-react'

interface ChangeItem {
  id: string
  currentItem: string
  quantity: number
  currentPrice: number
  newPrice: number
  costImpact: number
  timeImpact: number
  type: 'delete' | 'modify' | 'add'
}

interface CalculationBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  items: ChangeItem[]
  originalContractValue: number
}

export default function CalculationBreakdownModal({ 
  isOpen, 
  onClose, 
  items, 
  originalContractValue 
}: CalculationBreakdownModalProps) {
  
  if (!isOpen) return null

  // Calculations
  const totalCostImpact = items.reduce((sum, item) => sum + item.costImpact, 0)
  const totalTimeImpact = items.reduce((sum, item) => sum + item.timeImpact, 0)
  const newProjectTotal = originalContractValue + totalCostImpact

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[95%] max-w-2xl max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Calculation Breakdown</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[70vh] p-4">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border border-gray-200">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border border-gray-200">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Individual Item Calculations */}
              {items.map((item) => {
                const price = item.type === 'delete' ? item.currentPrice : item.newPrice
                const typeLabel = item.type === 'delete' ? 'Remove' : item.type === 'add' ? 'Add' : 'Modify'
                
                return (
                  <tr key={item.id} className={`${
                    item.type === 'delete' ? 'bg-red-50/30' :
                    item.type === 'add' ? 'bg-green-50/30' :
                    'bg-yellow-50/30'
                  }`}>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mr-2 ${
                        item.type === 'delete' ? 'bg-red-100 text-red-700' :
                        item.type === 'add' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {typeLabel}
                      </span>
                      {item.currentItem}: {item.quantity} × ${price.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-semibold border border-gray-200 ${
                      item.costImpact >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.costImpact >= 0 ? '+' : ''}${item.costImpact.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
              
              {/* Divider */}
              <tr className="bg-gray-100">
                <td colSpan={2} className="px-4 py-1 border border-gray-200"></td>
              </tr>
              
              {/* Total Cost Impact */}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 border border-gray-200">
                  Total Cost Impact
                </td>
                <td className={`px-4 py-3 text-right text-sm font-bold border border-gray-200 ${
                  totalCostImpact >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalCostImpact >= 0 ? '+' : ''}${totalCostImpact.toLocaleString()}
                </td>
              </tr>
              
              {/* Total Time Impact */}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 border border-gray-200">
                  Total Time Impact
                </td>
                <td className={`px-4 py-3 text-right text-sm font-bold border border-gray-200 ${
                  totalTimeImpact > 0 ? 'text-orange-600' : 
                  totalTimeImpact < 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {totalTimeImpact > 0 ? '+' : ''}{totalTimeImpact} Days
                </td>
              </tr>
              
              
              <tr className="bg-gray-200">
                <td colSpan={2} className="px-4 py-1 border border-gray-200"></td>
              </tr>
              
             
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200">
                  Original Contract Value
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900 border border-gray-200">
                  ${originalContractValue.toLocaleString()}
                </td>
              </tr>
              
              
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200">
                  Change Order Amount
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold border border-gray-200 ${
                  totalCostImpact >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalCostImpact >= 0 ? '+' : ''}${totalCostImpact.toLocaleString()}
                </td>
              </tr>
              
        
              <tr className="bg-blue-50">
                <td className="px-4 py-4 text-sm font-bold text-gray-900 border border-gray-200">
                  New Project Total
                </td>
                <td className="px-4 py-4 text-right text-lg font-bold text-blue-600 border border-gray-200">
                  ${newProjectTotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

   
        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}