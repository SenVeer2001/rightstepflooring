import { Plus, Trash2, X } from "lucide-react"
import { useState } from "react"

interface Attachment {
  id: string
  name: string
  size: string
  uploadedDate: string
  type: "image" | "document" | "video"
}

interface AttachmentsTabProps {
  attachments?: Attachment[]
  onAddAttachment?: (file: File) => void
}

export function AttachmentsTab({ attachments = [], onAddAttachment }: AttachmentsTabProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      onAddAttachment?.(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      onAddAttachment?.(files[0])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
      </div>

      {/* Upload Area */}
      <label
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragActive
            ? "border-primary bg-blue-50"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
      >
        <Plus size={32} className="mx-auto text-primary mb-2" />
        <p className="text-gray-900 font-semibold">Drag files here or click to upload</p>
        <p className="text-sm text-gray-600">Support for images, documents, and videos</p>
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,video/*"
        />
      </label>

      {/* Attachments List */}
      {attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">
                      {attachment.name.split(".").pop()?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{attachment.name}</p>
                    <p className="text-xs text-gray-600">{attachment.size} • {attachment.uploadedDate}</p>
                  </div>
                </div>

                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No attachments yet</p>
        </div>
      )}
    </div>
  )
}
