import { useState } from 'react'
import { Plus } from 'lucide-react'

interface ClientCustomFieldsTabProps {
  clientId: string
}

export function ClientCustomFieldsTab({ clientId }: ClientCustomFieldsTabProps) {
  const [formData, setFormData] = useState({
    customerType: '',
    clientRatingExperience: '',
    vipClient: '',
    jobRating: '',
    rateSubcontractor: '',
    subcontractor: '',
    notes: '',
    dateProjectCompleted: '',
    inCollections: '',
    projectStartDate: '',
    projectEndDate: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => file.name)
      if (uploadedFiles.length + newFiles.length <= 5) {
        setUploadedFiles(prev => [...prev, ...newFiles])
      }
    }
  }

  const handleSave = () => {
    console.log('Saving custom fields:', formData, uploadedFiles)
    // API call would go here
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Left Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="space-y-6">
          {/* Customer Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Customer Type</label>
            <select
              name="customerType"
              value={formData.customerType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              <option value="">Business Type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          {/* Customer Survey */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Customer Survey</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <button
                onClick={() => document.getElementById('survey-upload')?.click()}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors mb-2"
              >
                <Plus size={20} className="text-gray-600" />
              </button>
              <input
                id="survey-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <p className="text-xs text-gray-600">Upload Customer survey</p>
              <p className="text-xs text-gray-500 mt-1">You can choose up to 5 files</p>
              {uploadedFiles.length > 0 && (
                <div className="mt-3 text-left">
                  {uploadedFiles.map((file, index) => (
                    <p key={index} className="text-xs text-gray-700 truncate">{file}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="space-y-6">
          {/* Client Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Client Rating</label>
            <select
              name="clientRatingExperience"
              value={formData.clientRatingExperience}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              <option value="">Rate experience with Client</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* VIP Client */}
          <div>
            <select
              name="vipClient"
              value={formData.vipClient}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              <option value="">VIP Client</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Subcontractor Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Subcontractor Rating</label>
            <select
              name="rateSubcontractor"
              value={formData.rateSubcontractor}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              <option value="">Rate Subcontractor</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* Subcontractor */}
          <div>
            <select
              name="subcontractor"
              value={formData.subcontractor}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              <option value="">Subcontractor</option>
              <option value="sub1">Subcontractor 1</option>
              <option value="sub2">Subcontractor 2</option>
              <option value="sub3">Subcontractor 3</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter notes..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          {/* Job Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Job Rating</label>
            <select
              name="jobRating"
              value={formData.jobRating}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            >
              <option value="">Rate the job</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="poor">Poor</option>
            </select>
          </div>
          

        
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Extra Info</label>
          
            <div className="mb-3">
              <input
                type="date"
                name="dateProjectCompleted"
                value={formData.dateProjectCompleted}
                onChange={handleInputChange}
                placeholder="Date Project Completed"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

       
            <div className="mb-3">
              <select
                name="inCollections"
                value={formData.inCollections}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
              >
                <option value="">In Collections</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

        
            <div className="mb-3">
              <input
                type="date"
                name="projectStartDate"
                value={formData.projectStartDate}
                onChange={handleInputChange}
                placeholder="Project Start Date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            
            <div>
              <input
                type="date"
                name="projectEndDate"
                value={formData.projectEndDate}
                onChange={handleInputChange}
                placeholder="Project End Date"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="px-8 py-2.5 bg-primary  text-white font-semibold rounded-full transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
