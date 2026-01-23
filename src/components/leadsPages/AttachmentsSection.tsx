import { useState } from "react"
import { Upload, X, Download, FileIcon } from "lucide-react"

interface Attachment {
  id: string
  name: string
  size: string
  uploadedAt: string
  uploadedBy: string
  type: string
}

export function AttachmentsSection() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setIsUploading(true)

    // Simulate file upload
    Array.from(files).forEach((file) => {
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedAt: new Date().toLocaleDateString(),
        uploadedBy: "You",
        type: file.type || "file",
      }
      setAttachments([...attachments, newAttachment])
    })

    setTimeout(() => {
      setIsUploading(false)
    }, 500)

    // Reset input
    e.target.value = ""
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id))
  }

  const handleDownloadAttachment = (name: string) => {
    // Simulate download
    console.log(`Downloading ${name}`)
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      {/* Upload Area */}
      <div>
        <label
          htmlFor="file-upload"
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Upload size={40} className="text-gray-400 mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">
            + Upload files
          </p>
          <p className="text-xs text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">
            SVG, PNG, JPG, PDF or DOC (max. 50MB)
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.svg"
          />
        </label>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {attachments.length} {attachments.length === 1 ? "File" : "Files"}
          </h3>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileIcon
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {attachment.size} • Uploaded {attachment.uploadedAt} by{" "}
                      {attachment.uploadedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      handleDownloadAttachment(attachment.name)
                    }
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {attachments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No attachments yet</p>
        </div>
      )}
    </div>
  )
}
