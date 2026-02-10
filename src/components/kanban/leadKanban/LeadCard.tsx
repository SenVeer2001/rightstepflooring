import { Phone, Mail, MapPin } from 'lucide-react'
import type { Lead } from '../../../types/lead'

export type { Lead }


interface LeadCardProps {
  lead: Lead
  
}

export function LeadCard({ lead }: LeadCardProps) {
  return (
    <div className="p-4 bg-white hover:bg-primary/30 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">{lead.name}</h3>

      {/* Contact Info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-600 group">
          <Phone size={14} className="flex-shrink-0" />
          <a href={`tel:${lead.phone}`} className="truncate hover:text-blue-600">
            {lead.phone}
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail size={14} className="flex-shrink-0" />
          <a href={`mailto:${lead.email}`} className="truncate hover:text-blue-600">
            {lead.email}
          </a>
        </div>
      </div>

      {/* Source/Service */}
      {(lead.source || lead.service) && (
        <div className="mb-2 pb-2 border-b border-gray-100">
          {lead.source && (
            <p className="text-xs text-gray-600 truncate">
              <span className="font-semibold">Source:</span> {lead.source}
            </p>
          )}
          {lead.service && (
            <p className="text-xs text-gray-600 truncate">
              <span className="font-semibold">Service:</span> {lead.service}
            </p>
          )}
        </div>
      )}

      {/* Location */}
      {lead.city && (
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">
            {lead.city}, {lead.state}
          </span>
        </div>
      )}

      {/* Budget */}
      {lead.budget && lead.budget > 0 && (
        <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
          <p className="text-xs font-semibold text-green-800">
            Budget: ${lead.budget.toLocaleString()}
          </p>
        </div>
      )}

      {/* Metadata */}
      <div className="mt-2 text-xs text-gray-500">
        {lead.createdAt && <p>Added: {new Date(lead.createdAt).toLocaleDateString()}</p>}
      </div>
    </div>
  )
}
