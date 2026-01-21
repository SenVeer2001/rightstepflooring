import { useParams } from "react-router-dom"
import { useState } from "react"

import LeadHeader from "./LeadHeader"
import LeadTabs from "./LeadTabs"
import EstimatesSection from "./EstimatesSection"


import type { LeadFormData } from "../../components/LeadModal"
import { LeadForm } from "./leadForm"

/* ===================== TYPES ===================== */

type LeadTabKey = "details" | "estimates" | "attachments" | "tasks"

/* ===================== COMPONENT ===================== */

export function LeadDetails() {
  const { leadId } = useParams<{ leadId: string }>()

  const [activeTab, setActiveTab] = useState<LeadTabKey>("estimates")

  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    // @ts-ignore
    name: "Mike Cousins",
    phone: "(555) 123-4567",
    email: "mike@email.com",
    address: "123 Oak Street",
    city: "Chicago",
    state: "IL",
    status: "new",
    source: "Google",
    type: "Flooring",
    tags: ["High Value"],
    notes: "",
  })

  const handleSaveLeadDetails = () => {
    console.log("Updated Lead:", leadFormData)
    // 🔗 API call later
  }

  
  return (
    <div className="p-4 space-y-6 min-h-screen">
    
      <LeadHeader leadId={leadId || ""} />

     
      <LeadTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

     
      {activeTab === "details" && (
        <LeadForm
          formData={leadFormData}
          onChange={setLeadFormData}
          onSubmit={handleSaveLeadDetails}
        />
      )}

      {activeTab === "estimates" && (
        <EstimatesSection />
      )}

      {activeTab === "attachments" && (
        <div className="bg-white rounded-xl border p-6 text-gray-500">
          No attachments yet
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="bg-white rounded-xl border p-6 text-gray-500">
          No tasks yet
        </div>
      )}
    </div>
  )
}
