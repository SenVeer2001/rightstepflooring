import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react'
import { useState } from 'react'

interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  technician: string
  location: string
  status: 'scheduled' | 'in-progress' | 'completed'
  color: string
}

const scheduleData: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Flooring Installation',
    date: '2026-01-10',
    time: '09:00 AM',
    technician: 'Mike Johnson',
    location: '123 Main St, Springfield',
    status: 'scheduled',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Carpet Cleaning',
    date: '2026-01-10',
    time: '02:00 PM',
    technician: 'Lisa Brown',
    location: '456 Oak Ave, Chicago',
    status: 'in-progress',
    color: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Flooring Repair',
    date: '2026-01-11',
    time: '10:00 AM',
    technician: 'Tom Davis',
    location: '789 Pine Rd, Aurora',
    status: 'scheduled',
    color: 'bg-orange-500',
  },
  {
    id: '4',
    title: 'Tile Restoration',
    date: '2026-01-12',
    time: '11:00 AM',
    technician: 'Mike Johnson',
    location: '654 Maple Dr, Evanston',
    status: 'scheduled',
    color: 'bg-purple-500',
  },
]

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthsOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 10))
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month')

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty days
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50 h-24 rounded-lg border border-gray-200" />
      )
    }

    // Days with events
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayEvents = scheduleData.filter((e) => e.date === dateStr)
      const isToday =
        new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

      days.push(
        <div
          key={`day-${day}`}
          className={`rounded-lg border h-24 p-2 overflow-y-auto cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`text-xs px-2 py-1 rounded text-white font-semibold truncate ${event.color}`}
                title={event.title}
              >
                {event.time}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return days
  }

  const upcomingEvents = scheduleData
    .filter((e) => new Date(e.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6 p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 text-sm mt-1">View and manage job schedules</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-[##2c621b] text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {/* View Type Selector */}
      <div className=" rounded-lg p-4 shadow-sm">
        <div className="flex gap-2">
          {['month', 'week', 'day'].map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} View
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthsOfYear[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-3 mb-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-3">{renderCalendarDays()}</div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-blue-600" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-green-600" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={16} className="text-purple-600" />
                        {event.technician}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      event.status === 'scheduled'
                        ? 'bg-blue-500'
                        : event.status === 'in-progress'
                          ? 'bg-green-500'
                          : 'bg-gray-500'
                    }`}
                  >
                    {event.status.replace('-', ' ').charAt(0).toUpperCase() +
                      event.status.replace('-', ' ').slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  )
}
