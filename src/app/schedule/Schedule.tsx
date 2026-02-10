"use client"

import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
} from "lucide-react"
import { useState } from "react"

interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  technician: string
  location: string
  status: "scheduled" | "in-progress" | "completed"
}

const scheduleData: ScheduleEvent[] = [
  {
    id: "1",
    title: "Flooring Installation",
    date: "2026-01-10",
    time: "09:00 AM",
    technician: "Mike Johnson",
    location: "123 Main St, Springfield",
    status: "scheduled",
  },
  {
    id: "2",
    title: "Carpet Cleaning",
    date: "2026-01-10",
    time: "02:00 PM",
    technician: "Lisa Brown",
    location: "456 Oak Ave, Chicago",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Flooring Repair",
    date: "2026-01-11",
    time: "10:00 AM",
    technician: "Tom Davis",
    location: "789 Pine Rd, Aurora",
    status: "scheduled",
  },
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const statusStyles: Record<
  "scheduled" | "in-progress" | "completed",
  string
> = {
  scheduled: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-700",
}

export function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 10))
  const [viewType, setViewType] = useState<"month" | "week" | "day">("month")

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const cells = []

    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className="h-28 rounded-lg border border-gray-100 bg-gray-50"
        />
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`

      const dayEvents = scheduleData.filter(e => e.date === dateStr)
      const isToday =
        new Date().toDateString() ===
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ).toDateString()

      cells.push(
        <div
          key={day}
          className={`h-28 rounded-lg border p-2 text-sm transition
            ${isToday
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:bg-gray-50"
            }`}
        >
          <div
            className={`mb-1 text-xs font-semibold ${isToday ? "text-primary" : "text-gray-700"
              }`}
          >
            {day}
          </div>

          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className="rounded bg-primary text-white px-2 py-0.5 text-[11px] truncate"
                title={event.title}
              >
                {event.time}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return cells
  }

  const upcomingEvents = scheduleData.slice(0, 4)

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500">
            Manage and track scheduled jobs
          </p>
        </div>

        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* VIEW SWITCH */}
      <div className="inline-flex rounded-lg border bg-white p-1">
        {["month", "week", "day"].map(type => (
          <button
            key={type}
            onClick={() => setViewType(type as any)}
            className={`px-4 py-2 text-[12px] font-semibold rounded-md transition
              ${viewType === type
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>


      {/* UPCOMING EVENTS */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-900">
          Upcoming Events
        </h3>

        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <div
              key={event.id}
              className="flex items-start justify-between border rounded-lg p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-semibold text-gray-900">{event.title}</p>
                <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {event.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} /> {event.technician}
                  </span>
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold capitalize
    ${statusStyles[event.status]}
  `}
              >
                {event.status.replace("-", " ")}
              </span>

            </div>
          ))}
        </div>
      </div>
      {/* CALENDAR */}
      <div className="bg-white border rounded-xl p-6 space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {monthsOfYear[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm border rounded-lg"
            >
              Today
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 text-xs font-semibold text-gray-500">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {renderCalendarDays()}
        </div>
      </div>


    </div>
  )
}
