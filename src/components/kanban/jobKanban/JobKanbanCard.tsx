import type { Job } from "../types"

export function JobKanbanCard({ job }: { job: Job }) {
  return (
    <div className="p-4 bg-white rounded-lg  border shadow-sm hover:shadow-md">
      <h3 className="font-semibold text-sm text-primary">
        Job #{job.jobNumber}
      </h3>
      <p className="text-sm">{job.clientName}</p>
      <p className="text-xs text-gray-500">{job.jobType}</p>
      <p className="mt-2 text-xs font-semibold">
        ${(job.totalPrice ?? 0).toLocaleString()}
      </p>
    </div>
  )
}
