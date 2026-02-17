// ScheduleModal.tsx
import { useState, useEffect, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

// ===================== TYPES =====================
interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teamMemberIds: string[]) => void; // ✅ Changed to return array of IDs
  scheduleDate: string;
  startTime: string;
  endTime: string;
  jobTitle: string;
  selectedTeamMembers?: string[];
  teamMembers?: TeamMember[];
}

// ===================== DEFAULT DATA =====================
const defaultTeamMembers: TeamMember[] = [
  { id: '1', name: 'Anthony Mcleod', role: 'Technician', color: '#3B82F6' },
  { id: '2', name: 'Tristate Floors', role: 'Technician', color: '#10B981' },
  { id: '3', name: 'Mauricio Perez', role: 'Technician', color: '#F59E0B' },
  { id: '4', name: 'Saira Tehmin', role: 'Admin', color: '#8B5CF6' },
  { id: '5', name: 'Daniel Paiva', role: 'Manager', color: '#EF4444' },
  { id: '6', name: 'John Smith', role: 'Installer', color: '#EC4899' },
];

const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM

// ===================== HELPER FUNCTIONS =====================
const formatHour = (hour: number) => {
  if (hour === 12) return '12 PM';
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00'); // ✅ Fix timezone issue
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || Math.floor(day / 10) === 1) ? 0 : day % 10];

  return `${dayName}, ${month} ${day}${suffix}, ${year}`;
};

const formatTime12 = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const min = minutes || '00';
  if (hour === 0) return `12:${min} AM`;
  if (hour === 12) return `12:${min} PM`;
  return hour > 12 ? `${hour - 12}:${min} PM` : `${hour}:${min} AM`;
};

const timeToHour = (time: string) => {
  if (!time) return 0;
  const [hours] = time.split(':');
  return parseInt(hours);
};

// ===================== COMPONENT =====================
export function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  scheduleDate,
  startTime,
  endTime,
  jobTitle,
  selectedTeamMembers: initialSelected = [],
  teamMembers = defaultTeamMembers,
}: ScheduleModalProps) {

  // ===================== STATE =====================
  const [activeTab, setActiveTab] = useState<'timeline' | 'availability'>('timeline');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // ===================== EFFECTS =====================
  useEffect(() => {
    if (isOpen) {
      setSelectedMembers(initialSelected);
      if (scheduleDate) {
        setCurrentDate(new Date(scheduleDate + 'T00:00:00'));
      }
    }
  }, [isOpen, initialSelected, scheduleDate]);

  // ===================== COMPUTED VALUES =====================
  const jobStartHour = useMemo(() => timeToHour(startTime), [startTime]);
  const jobEndHour = useMemo(() => timeToHour(endTime), [endTime]);
  const hasSchedule = scheduleDate && startTime && endTime;

  // ===================== HANDLERS =====================
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const goToPreviousDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleSave = () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one team member');
      return;
    }
    onSave(selectedMembers); // ✅ Just pass array of IDs
  };

  // ===================== RENDER =====================
  if (!isOpen) return null;

  const displayDate = scheduleDate ? formatDate(scheduleDate) : formatDate(currentDate.toISOString().split('T')[0]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ==================== HEADER ==================== */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Schedule</h2>
            <button
              onClick={goToToday}
              className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousDay}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextDay}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <span className="font-semibold text-gray-700">{displayDate}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'timeline'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'availability'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Availability
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ==================== CONTENT ==================== */}
        <div className="flex-1 flex overflow-hidden">

          {/* ==================== LEFT SIDEBAR ==================== */}
          <div className="w-64 border-r flex flex-col bg-gray-50/50">
            {/* Unassigned Header */}
            <div className="h-[52px] border-b flex items-center justify-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Unassigned
              </span>
            </div>

            {/* Team Members List */}
            <div className="flex-1 overflow-y-auto">
              {teamMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center gap-3 p-4 border-b cursor-pointer transition-all ${isSelected
                      ? 'bg-primary/10 border-l-4 border-l-primary'
                      : 'hover:bg-white border-l-4 border-l-transparent'
                      }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                    </div>

                    {/* Checkbox */}
                    {isSelected && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Count */}
            {selectedMembers.length > 0 && (
              <div className="p-3 bg-primary/10 border-t">
                <p className="text-xs font-semibold text-primary text-center">
                  {selectedMembers.length} team member(s) selected
                </p>
              </div>
            )}
          </div>

          {/* ==================== CALENDAR GRID ==================== */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'timeline' ? (
              <div className="min-w-[1000px]">
                {/* Time Header */}
                <div className="flex border-b sticky top-0 bg-white z-10">
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="flex-1 min-w-[70px] py-4 text-center border-r text-xs font-bold text-gray-500"
                    >
                      {formatHour(hour)}
                    </div>
                  ))}
                </div>

                {/* Grid Rows */}
                <div className="relative">
                  {/* Unassigned Row with Job */}
                  <div className="flex border-b h-[52px] bg-gray-50/50">
                    {HOURS.map((hour, index) => (
                      <div key={hour} className="flex-1 min-w-[70px] border-r relative">
                        {/* Show job block at start time */}
                        {hasSchedule && hour === jobStartHour && (
                          <div
                            className="absolute top-1 bottom-1 left-1 bg-primary rounded-lg p-2 shadow-lg z-20 flex flex-col justify-center"
                            style={{
                              width: `calc(${(jobEndHour - jobStartHour) * 100}% - 8px)`,
                            }}
                          >
                            <p className="text-white text-xs font-bold truncate">
                            
                            </p>
                            <p className="text-white/90 text-[10px]">
                              {formatTime12(startTime)} - {formatTime12(endTime)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Team Member Rows */}
                  {teamMembers.map((member) => {
                    const isSelected = selectedMembers.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        className={`flex border-b h-14 transition-colors ${isSelected ? 'bg-primary/5' : ''
                          }`}
                      >
                        {HOURS.map((hour) => (
                          <div
                            key={hour}
                            onClick={() => toggleMember(member.id)}
                            className={`flex-1 min-w-[70px] border-r cursor-pointer transition-colors relative ${isSelected
                              ? 'hover:bg-primary/10'
                              : 'hover:bg-gray-100'
                              }`}
                          >
                            {/* Show assigned job for selected members */}
                            {isSelected && hasSchedule && hour === jobStartHour && (
                              <div
                                className="absolute top-1 bottom-1 left-1 rounded-lg p-2 shadow-sm z-10 flex flex-col justify-center"
                                style={{
                                  width: `calc(${(jobEndHour - jobStartHour) * 100}% - 8px)`,
                                  backgroundColor: member.color,
                                }}
                              >
                                <p className="text-white text-xs font-bold truncate">
                                  {jobTitle || 'New Job'}
                                </p>
                                <p className="text-white/90 text-[10px]">
                                  {formatTime12(startTime)} - {formatTime12(endTime)}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ==================== AVAILABILITY VIEW ==================== */
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => {
                    const isSelected = selectedMembers.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => toggleMember(member.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: member.color }}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* Availability Info */}
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-gray-500">Available</span>
                          <span className="font-semibold text-green-600">All Day</span>
                        </div>

                        {/* Show assigned job if selected */}
                        {isSelected && hasSchedule && (
                          <div
                            className="p-2 rounded-lg text-white text-xs"
                            style={{ backgroundColor: member.color }}
                          >
                            <p className="font-bold truncate">{jobTitle || 'New Job'}</p>
                            <p className="opacity-90">
                              {formatTime12(startTime)} - {formatTime12(endTime)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== FOOTER ==================== */}
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <p className="text-sm text-gray-500">
            {selectedMembers.length > 0 ? (
              <span className="flex items-center gap-2">
                <Check size={16} className="text-primary" />
                <span>
                  <strong>{selectedMembers.length}</strong> team member(s) ready to assign
                </span>
              </span>
            ) : (
              <span className="italic">Select team members to assign to this job</span>
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={selectedMembers.length === 0}
              className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasSchedule
                ? `Assign to ${formatTime12(startTime)} - ${formatTime12(endTime)}`
                : 'Assign Team'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}