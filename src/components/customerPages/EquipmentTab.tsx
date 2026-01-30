import { Plus, Edit, Trash2 } from "lucide-react"

interface Equipment {
  id: number
  photo?: string
  name: string
  modelNumber?: string
  brand?: string
  laborWarranty?: string
  manufacturerWarranty?: string
  serialNumber: string
  installationDate?: string
  locationInProperty?: string
  propertyAddress?: string
}

interface EquipmentTabProps {
  equipment?: Equipment[]
  onAddEquipment?: () => void
  onEditEquipment?: (id: number) => void
  onDeleteEquipment?: (id: number) => void
}

export function EquipmentTab({
  equipment = [],
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
}: EquipmentTabProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-900">Equipment</h3>
        <button
          onClick={onAddEquipment}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-100 font-semibold text-sm transition-colors"
        >
          <Plus size={18} />
          Add new
        </button>
      </div>

      {/* Equipment Table */}
      {equipment.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Photo</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Model #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Labor Warranty</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Manufacturer War...</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Serial #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Installation Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Location in proper...</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Property Address</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {item.photo ? (
                        <img src={item.photo} alt={item.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.modelNumber || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.brand || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.laborWarranty || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.manufacturerWarranty || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{item.serialNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{item.installationDate || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.locationInProperty || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.propertyAddress || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEditEquipment?.(item.id)}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteEquipment?.(item.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-sm">No Records Found</p>
        </div>
      )}
    </div>
  )
}
