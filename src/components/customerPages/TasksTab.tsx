import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react"

interface Task {
  id: number
  title: string
  description: string
  dueDate: string
  assignedTo: string
  completed: boolean
}

interface TasksTabProps {
  tasks?: Task[]
  onAddTask?: () => void
  onToggleTask?: (id: number) => void
  onDeleteTask?: (id: number) => void
}

export function TasksTab({ tasks = [], onAddTask, onToggleTask, onDeleteTask }: TasksTabProps) {
  const defaultTasks: Task[] = [
    {
      id: 1,
      title: "Schedule final walkthrough",
      description: "Complete final inspection of the project",
      dueDate: "2026-02-15",
      assignedTo: "Mike Johnson",
      completed: false,
    },
  ]

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white border border-gray-300 rounded-lg p-4 transition ${
              task.completed ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleTask?.(task.id)}
                className="mt-1 text-primary hover:text-primary/80"
              >
                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>

              <div className="flex-1">
                <h3 className={`font-semibold text-gray-900 ${task.completed ? "line-through" : ""}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{task.assignedTo}</span>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask?.(task.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
