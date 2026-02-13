// WorkOrderRightPanel.tsx
"use client"

import { useState } from "react"
import { User, FileText, ClipboardList, Users, Plus, X, Check, Phone, Mail } from "lucide-react"

const availableMembers = [
  { id: "1", name: "Mike Johnson", role: "Contractor", avatar: "MJ" },
  { id: "2", name: "Lisa Smith", role: "Electrician", avatar: "LS" },
  { id: "3", name: "Tom Wilson", role: "Plumber", avatar: "TW" },
  { id: "4", name: "Sarah Davis", role: "Painter", avatar: "SD" },
  { id: "5", name: "John Brown", role: "Carpenter", avatar: "JB" },
  { id: "6", name: "Emily Clark", role: "Designer", avatar: "EC" },
]

export default function WorkOrderRightPanel() {
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>(["1", "2", "3"])
  const [tempSelectedMembers, setTempSelectedMembers] = useState<string[]>([])

  const openTeamModal = () => {
    setTempSelectedMembers([...selectedMembers])
    setShowTeamModal(true)
  }

  const handleMemberToggle = (memberId: string) => {
    setTempSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    )
  }

  const handleSaveTeam = () => {
    setSelectedMembers(tempSelectedMembers)
    setShowTeamModal(false)
  }

  const assignedTeam = availableMembers.filter(m => selectedMembers.includes(m.id))

  return (
    <>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pb-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Details</h2>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            Contact
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              MB
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">Michelle Booke</p>
              <p className="text-xs text-gray-500 truncate">michelle@email.com</p>
              <p className="text-xs text-gray-500">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-blue-600" />
              </div>
              Team
              <span className="text-xs text-gray-400 font-normal">({assignedTeam.length})</span>
            </h3>
            <button
              onClick={openTeamModal}
              className="flex items-center gap-1 text-primary text-xs font-medium hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {assignedTeam.slice(0, 3).map(member => (
              <div key={member.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {member.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
            {assignedTeam.length > 3 && (
              <button 
                onClick={openTeamModal}
                className="w-full text-xs text-primary font-medium py-2 hover:bg-primary/5 rounded-lg transition-colors"
              >
                +{assignedTeam.length - 3} more members
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-green-600" />
            </div>
            Description
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Flooring installation and finishing work for master bedroom. Includes removal of old flooring and subfloor preparation.
          </p>
        </div>

        {/* Tasks */}
        <div className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClipboardList size={16} className="text-purple-600" />
              </div>
              Tasks
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
              2/4 done
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }} />
          </div>

          <div className="space-y-2">
            {[
              { text: "Remove old flooring", done: true },
              { text: "Prepare subfloor", done: true },
              { text: "Install underlayment", done: false },
              { text: "Lay hardwood planks", done: false },
            ].map((task, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors
                  ${task.done ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${task.done ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-primary'}`}
                >
                  {task.done && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-primary text-sm font-medium hover:border-primary hover:bg-primary/5 transition-all">
            + Add Task
          </button>
        </div>
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setShowTeamModal(false)}
        >
          <div 
            className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl shadow-2xl max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold text-gray-900">Select Team Members</h3>
              <button 
                onClick={() => setShowTeamModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-2">
                {availableMembers.map(member => {
                  const isSelected = tempSelectedMembers.includes(member.id)
                  return (
                    <div
                      key={member.id}
                      onClick={() => handleMemberToggle(member.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                        ${isSelected 
                          ? 'bg-primary/10 border-2 border-primary' 
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0
                        ${isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                        ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 sm:rounded-b-xl flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {tempSelectedMembers.length} member{tempSelectedMembers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowTeamModal(false)} 
                  className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveTeam} 
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}