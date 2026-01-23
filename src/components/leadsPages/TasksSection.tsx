import { useState } from "react"
import { Plus, Check, Clock, AlertCircle, Trash2 } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: "open" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo: string
  createdAt: string
}

export function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    assignedTo: "",
  })

  const handleAddTask = () => {
    if (!formData.title.trim()) return

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      status: "open",
      priority: formData.priority,
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTo,
      createdAt: new Date().toLocaleDateString(),
    }

    setTasks([newTask, ...tasks])
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
    })
    setShowAddTask(false)
  }

  const handleUpdateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴"
      case "medium":
        return "🟡"
      case "low":
        return "🟢"
      default:
        return "⚪"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check size={16} className="text-green-600" />
      case "in_progress":
        return <Clock size={16} className="text-blue-600" />
      case "open":
        return <AlertCircle size={16} className="text-gray-600" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      {/* Add Task Button */}
      <div>
        {!showAddTask && (
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            <Plus size={18} />
            Add New Task
          </button>
        )}

        {/* Add Task Form */}
        {showAddTask && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <textarea
              placeholder="Task description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={formData.priority}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "low" || value === "medium" || value === "high") {
                    setFormData({
                      ...formData,
                      priority: value,
                    })
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                placeholder="Assign to (name)"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                disabled={!formData.title.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
          </h3>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(task.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span className="text-lg">
                        {getPriorityBadge(task.priority)}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      {task.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due: {task.dueDate}
                        </span>
                      )}
                      {task.assignedTo && (
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {task.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  {task.status !== "in_progress" && (
                    <button
                      onClick={() =>
                        handleUpdateTaskStatus(task.id, "in_progress")
                      }
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-xs"
                      title="Mark as in progress"
                    >
                      <Clock size={16} className="text-blue-600" />
                    </button>
                  )}

                  {task.status !== "completed" && (
                    <button
                      onClick={() =>
                        handleUpdateTaskStatus(task.id, "completed")
                      }
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors text-xs"
                      title="Mark as completed"
                    >
                      <Check size={16} className="text-green-600" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-xs"
                    title="Delete task"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-end">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.status === "open"
                    ? "Open"
                    : task.status === "in_progress"
                    ? "In Progress"
                    : "Completed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-xs mt-1">
            Create your first task by clicking "Add New Task"
          </p>
        </div>
      )}
    </div>
  )
}
