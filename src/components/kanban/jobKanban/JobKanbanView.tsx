import { BaseKanbanBoard } from "../KanbanBoard"
import { jobKanbanColumns } from "./jobKanbanColumns"
import { JobKanbanCard } from "./JobKanbanCard"
import type { Job } from "../types"


export function JobKanbanBoard({
  jobs,
  onJobsUpdate,
}: {
  jobs: Job[]
  onJobsUpdate: (jobs: Job[]) => void
}) {
  const handleStatusChange = (jobId: string, status: string) => {
    const updatedJobs = jobs.map(job =>
      job.id === jobId ? { ...job, status } : job
    )
    onJobsUpdate(updatedJobs)
  }

  return (
    <BaseKanbanBoard
      items={jobs}
      columns={jobKanbanColumns}
      onStatusChange={handleStatusChange}
      renderCard={(job) => <JobKanbanCard job={job} />}
    />
  )
}
