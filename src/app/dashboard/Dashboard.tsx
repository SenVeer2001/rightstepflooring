import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import { MoreVertical, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import CountUp from "react-countup"

const monthlySalesData = [
  { month: "Jan", revenue: 420 },
  { month: "Feb", revenue: 680 },
  { month: "Mar", revenue: 530 },
  { month: "Apr", revenue: 790 },
  { month: "May", revenue: 610 },
  { month: "Jun", revenue: 880 },
  { month: "Jul", revenue: 380 },
]

const jobStatusChartData = [
  { name: "Canceled", value: 45, color: "#F87171" },
  { name: "Open", value: 120, color: "#FBBF24" },
  { name: "Done", value: 230, color: "#34D399" },
]

const invoiceBarData = [
  { month: "Jan", invoices: 120 },
  { month: "Feb", invoices: 180 },
  { month: "Mar", invoices: 150 },
  { month: "Apr", invoices: 220 },
  { month: "May", invoices: 200 },
  { month: "Jun", invoices: 220 },
  { month: "Jul", invoices: 100 },
]

const topJobTypesData = [
  { name: "Flooring Installation", value: 45, count: 197 },
  { name: "Flooring Repair", value: 32, count: 269 },
  { name: "Carpet Cleaning", value: 28, count: 245 },
  { name: "Tile Installation", value: 22, count: 150 },
  { name: "Hardwood Refinishing", value: 18, count: 120 },
]

const departmentData = [
  { name: "Installation", value: 820, total: 1233 },
  { name: "Repair", value: 354, total: 1233 },
  { name: "Cleaning", value: 59, total: 1233 },
]

const recentActivities = [
  {
    id: "J_780",
    type: "Flooring Installation",
    date: "9 May, 2023",
    satisfaction: 3.2,
    amount: 2686,
    status: "Done",
  },
  {
    id: "J_45",
    type: "Carpet Cleaning",
    date: "8 May, 2023",
    satisfaction: 2.4,
    amount: 2293,
    status: "Open",
  },
  {
    id: "J_896",
    type: "Tile Installation",
    date: "7 May, 2023",
    satisfaction: 2.6,
    amount: 2800,
    status: "Done",
  },
]

const glassCard =
  "rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"

export function Dashboard() {
  return (
    <div
      className="min-h-screen p-4 md:p-2 text-gray-800"

    >
      <div className="max-w-[1600px] mx-auto space-y-6">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-700 tracking-tight">
              Dashboard
            </h1>
            {/* <p className="text-sm text-gray-600 mt-1">27 May, 2023 to 8 May, 2023</p> */}
          </div>
        </header>


        <div className="grid grid-cols-2 gap-3 ">

          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 ">
              <OverviewCard
                title="REVENUE RATE"
                value="16.1%"
                subtitle="Total Revenue"
                amount={14539}
                trend="up"
              />
              <OverviewCard
                title="TOTAL JOBS"
                value="237"
                subtitle="Current Jobs"
                amount={395}
                trend="up"
              />
              <OverviewCard
                title="CURRENT EMPLOYEES"
                value="1,233"
                subtitle="Active"
                trend="down"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
             


               <div className={`${glassCard} p-6`}>
                <SectionHeader title="DEPARTMENT" />
                <div className="space-y-6 mt-6">
                  {departmentData.map((dept, idx) => (
                    <DepartmentCircle
                      key={dept.name}
                      name={dept.name}
                      value={dept.value}
                      total={dept.total}
                      color={idx === 0 ? "#fdf76d" : idx === 1 ? "#fbbf24" : "#fb923c"}
                    />
                  ))}
                </div>
              </div>

              <div className={`${glassCard} p-6`}>
                <SectionHeader title="JOB ROLE" subtitle="Top 5" />
                <div className="space-y-3 mt-4">
                  {topJobTypesData.map((job, idx) => (
                    <JobRoleRow
                      key={job.name}
                      rank={idx + 1}
                      name={job.name}
                      count={job.count}
                      isHighlight={idx < 2}
                    />
                  ))}
                </div>
              </div>

             






            </div>




          </div>
          <div className="">
            <div className="grid grid-cols-2 gap-2">
              <div className={`${glassCard} p-6`}>
                <SectionHeader title="TODAY OVERVIEW" />
                <div className="space-y-4 mt-5">
                  <MetricRow label="Today's Sales" value={1739.82} prefix="$" />
                  <MetricRow label="Jobs Done" value={2} />
                  <MetricRow label="Jobs Created" value={1} />
                </div>

              </div>

              <div className={`${glassCard} p-6`}>
                <SectionHeader title="JOB STATUS" />
                <div className="h-[240px] mt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobStatusChartData}
                        dataKey="value"
                        innerRadius="55%"
                        outerRadius="75%"
                        paddingAngle={4}
                      >
                        {jobStatusChartData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {jobStatusChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>

             <div className={`${glassCard} p-6 mt-3`}>
                <div className="flex justify-between items-center mb-4">
                  <SectionHeader title="REVENUE TREND" />
                  <div className="flex gap-2">
                    <PeriodButton active>1M</PeriodButton>
                    <PeriodButton>3M</PeriodButton>
                    <PeriodButton>6M</PeriodButton>
                    <PeriodButton>1Y</PeriodButton>
                  </div>
                </div>
                <div className="h-[280px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid
                        stroke="rgba(0,0,0,0.05)"
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(253, 247, 109, 0.1)" }}
                        contentStyle={{
                          background: "rgba(255,255,255,0.95)",
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#387d22" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

          </div>

        </div>





      </div>
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xs font-bold text-gray-700 tracking-wider">{title}</h3>
      {subtitle && (
        <span className="text-xs text-gray-500 font-medium">{subtitle}</span>
      )}
    </div>
  )
}

function OverviewCard({
  title,
  value,
  subtitle,
  amount,
  trend,
}: {
  title: string
  value: string
  subtitle: string
  amount?: number
  trend?: "up" | "down"
}) {
  return (
    <div className={`${glassCard} p-3`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {trend && (
              <span
                className={`flex items-center text-sm ${trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {trend === "up" ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
              </span>
            )}
          </div>
        </div>
        <div
          className="w-5 h-5 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(253, 247, 109, 0.7)" }}
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>
      {amount !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">{subtitle}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {typeof amount === "number" ? (
              <CountUp end={amount} />
            ) : (
              amount
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function DepartmentCircle({
  name,
  value,
  total,
  color,
}: {
  name: string
  value: number
  total: number
  color: string
}) {
  const percentage = Math.round((value / total) * 100)

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-16 h-16">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{name}</p>
        <p className="text-xs text-gray-600">{value}</p>
      </div>
    </div>
  )
}

function JobRoleRow({
  rank,
  name,
  count,
  isHighlight,
}: {
  rank: number
  name: string
  count: number
  isHighlight: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isHighlight
          ? "bg-[#fdf76d] text-gray-900"
          : "bg-gray-700 text-white"
          }`}
      >
        {rank}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{name}</p>
      </div>
      <div
        className={`px-3 py-1 rounded-lg text-xs font-bold ${isHighlight
          ? "bg-[#fdf76d] text-gray-900"
          : "bg-gray-700 text-white"
          }`}
      >
        {count}
      </div>
    </div>
  )
}

function MetricRow({
  label,
  value,
  prefix,
}: {
  label: string
  value: number
  prefix?: string
}) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-2xl font-bold text-gray-900">
        {prefix}
        <CountUp end={value} decimals={prefix ? 2 : 0} />
      </span>
    </div>
  )
}

function RecentActivityCard({ activity }: { activity: typeof recentActivities[0] }) {
  return (
    <div className="p-4 rounded-xl bg-white/50 border border-white/60 hover:bg-white/70 transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs font-bold text-gray-900">{activity.id}</p>
          <p className="text-xs text-gray-600">{activity.type}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-[10px] font-bold ${activity.status === "Done"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
            }`}
        >
          {activity.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Date</p>
          <p className="font-semibold text-gray-900">{activity.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-semibold text-gray-900">${activity.amount}</p>
        </div>
      </div>
    </div>
  )
}

function PeriodButton({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${active
        ? "bg-gray-800 text-white"
        : "bg-white/50 text-gray-700 hover:bg-white/70"
        }`}
    >
      {children}
    </button>
  )
}
