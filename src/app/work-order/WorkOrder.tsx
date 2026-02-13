import React, { useState } from 'react'
import WorkOrderTable from './WorkOrderTable'
import { staticWorkOrders } from '../../services/orderdata'
import { Plus } from 'lucide-react'
import { WorkOrderFormModal } from '../../components/customerPages/clientPages/WorkOrderFormModel'


// Mock job items - replace with your actual data
const mockJobItems = [
  {
    id: 1,
    name: "Ceramic Tiles",
    quantity: 10,
    cost: 45.99,
    image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
    color: "#DADADA",
    type: "product",
  },
  {
    id: 2,
    name: "Tile Installation Service",
    quantity: 1,
    cost: 150.00,
    image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg",
    type: "service",
  },
  {
    id: 3,
    name: "Wood Flooring Panels",
    quantity: 25,
    cost: 89.50,
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    color: "#A0522D",
    type: "product",
  },
  {
    id: 4,
    name: "Adhesive & Grout",
    quantity: 5,
    cost: 25.00,
    image: "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg",
    color: "#F5F5F5",
    type: "product",
  },
]

function WorkOrder() {
 
  const [isModalOpen, setIsModalOpen] = useState(false)

  
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDelete = (ids: string[]) => {
    console.log("Delete work orders:", ids)
    
  }

  return (
    <div className='space-y-6 p-4 min-h-screen'>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-sm text-gray-600">
            Manage and track all work orders
          </p>
        </div>

        <div className="flex gap-8">
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold"
          >
            <Plus size={16} />
            Create work order
          </button>
        </div>
      </div>

      <WorkOrderTable 
        workOrders={staticWorkOrders} 
        onDelete={handleDelete}
      />

      
      <WorkOrderFormModal
        isOpen={isModalOpen}
        mode="create"
        onClose={handleCloseModal}
        jobItems={mockJobItems}
      />
    </div>
  )
}

export default WorkOrder