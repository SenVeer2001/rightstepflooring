// components/ticket/TicketStats.tsx (Alternative Version)
import { useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
 
} from "recharts";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PauseCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Ticket
} from "lucide-react";
import type { Ticket as TicketType } from "../../data/ticketData";

interface TicketStatsProps {
  tickets: TicketType[];
}


const STATUS_COLORS = {
  "Open": "#4D2FB2",        
  "In Progress": "#FDE68A", 
  "Resolved": "#48A111",    
  "Closed": "#E2E8F0",      
  "On Hold": "#f5a962",    
};

const PRIORITY_COLORS = {
  "Low": "#BBF7D0",         // Soft Green
  "Normal": "#0C7779",      // Soft Blue
  "High": "#C8AAAA",        // Soft Orange
  "Urgent": "#F5E7C6",      // Soft Red
};

// ===================== CUSTOM TOOLTIP =====================
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.payload.color }}
          />
          <p className="text-sm font-bold text-gray-900">{data.name}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">{data.value}</p>
        <p className="text-xs text-gray-500">
          {((data.value / data.payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

// ===================== PIE CHART CARD =====================
interface ChartCardProps {
  title: string;
  subtitle: string;
  data: { name: string; value: number; color: string }[];
  icon: React.ReactNode;
}

function ChartCard({ title, subtitle, data, icon }: ChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Chart & Legend */}
      <div className="p-6">
        <div className="flex items-center gap-8">
          {/* Pie Chart */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {dataWithTotal.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-75 transition-opacity cursor-pointer drop-shadow-sm"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {data.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
              return (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">
                      {item.value}
                    </span>
                    <span className="text-xs text-gray-400 w-10 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== STATS CARD =====================
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  change?: number;
}

function StatsCard({ title, value, icon, bgColor, iconColor, borderColor, change }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-2xl border-2 ${borderColor} p-5 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            change >= 0 
              ? "text-emerald-700 bg-emerald-50" 
              : "text-rose-700 bg-rose-50"
          }`}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1 font-medium">{title}</p>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
export default function TicketStats({ tickets }: TicketStatsProps) {

  const stats = useMemo(() => {
    const statusCounts: Record<string, number> = {
      "Open": 0,
      "In Progress": 0,
      "Resolved": 0,
      "Closed": 0,
      "On Hold": 0,
    };

    const priorityCounts: Record<string, number> = {
      "Low": 0,
      "Normal": 0,
      "High": 0,
      "Urgent": 0,
    };

    tickets.forEach(ticket => {
      if (statusCounts[ticket.status] !== undefined) {
        statusCounts[ticket.status]++;
      }
      if (priorityCounts[ticket.priority] !== undefined) {
        priorityCounts[ticket.priority]++;
      }
    });

    return { statusCounts, priorityCounts };
  }, [tickets]);

  const statusData = Object.entries(stats.statusCounts)
    .map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || "#E2E8F0",
    }));

  const priorityData = Object.entries(stats.priorityCounts)
    .map(([name, value]) => ({
      name,
      value,
      color: PRIORITY_COLORS[name as keyof typeof PRIORITY_COLORS] || "#E2E8F0",
    }));

  return (
    <div className="space-y-6">

      {/* Quick Stats Cards */}
      {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Tickets"
          value={tickets.length}
          icon={<Ticket size={24} />}
          bgColor="bg-violet-50"
          iconColor="text-violet-500"
          borderColor="border-violet-100"
        />
        <StatsCard
          title="Open"
          value={stats.statusCounts["Open"]}
          icon={<AlertCircle size={24} />}
          bgColor="bg-indigo-50"
          iconColor="text-indigo-500"
          borderColor="border-indigo-100"
          change={12}
        />
        <StatsCard
          title="In Progress"
          value={stats.statusCounts["In Progress"]}
          icon={<Loader2 size={24} />}
          bgColor="bg-amber-50"
          iconColor="text-amber-500"
          borderColor="border-amber-100"
        />
        <StatsCard
          title="Resolved"
          value={stats.statusCounts["Resolved"]}
          icon={<CheckCircle2 size={24} />}
          bgColor="bg-emerald-50"
          iconColor="text-emerald-500"
          borderColor="border-emerald-100"
          change={8}
        />
        <StatsCard
          title="On Hold"
          value={stats.statusCounts["On Hold"]}
          icon={<PauseCircle size={24} />}
          bgColor="bg-rose-50"
          iconColor="text-rose-400"
          borderColor="border-rose-100"
          change={-5}
        />
      </div> */}

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Status Distribution"
          subtitle="Current ticket status overview"
          data={statusData}
          icon={<Clock size={22} className="text-primary" />}
        />
        <ChartCard
          title="Priority Distribution"
          subtitle="Tickets by priority level"
          data={priorityData}
          icon={<AlertCircle size={22} className="text-primary" />}
        />
      </div>
    </div>
  );
}