import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Filter, Calendar } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import {
  Briefcase,
  BarChart3,
  FileText,
  Receipt,
  Package,
  PhoneCall,
  Wrench,
  DollarSign,
  TrendingUp,
  ClipboardList,
  CalendarClock,
  Percent,
  CheckSquare,
} from "lucide-react"

const monthlyRevenueData = [
  { month: 'Jan', revenue: 32000, expenses: 24000, profit: 8000 },
  { month: 'Feb', revenue: 38000, expenses: 28000, profit: 10000 },
  { month: 'Mar', revenue: 42000, expenses: 30000, profit: 12000 },
  { month: 'Apr', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'May', revenue: 51000, expenses: 35000, profit: 16000 },
  { month: 'Jun', revenue: 55000, expenses: 38000, profit: 17000 },
]

const jobTypeData = [
  { name: 'Flooring Installation', value: 35 },
  { name: 'Carpet Cleaning', value: 25 },
  { name: 'Flooring Repair', value: 20 },
  { name: 'Tile Restoration', value: 15 },
  { name: 'Other', value: 5 },
]

const jobStatusData = [
  { month: 'Jan', completed: 45, pending: 12, canceled: 3 },
  { month: 'Feb', completed: 52, pending: 15, canceled: 2 },
  { month: 'Mar', completed: 58, pending: 18, canceled: 4 },
  { month: 'Apr', completed: 62, pending: 16, canceled: 3 },
  { month: 'May', completed: 68, pending: 19, canceled: 2 },
  { month: 'Jun', completed: 75, pending: 21, canceled: 1 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']


interface ReportItem {
  title: string
  description: string
  icon: React.ElementType
  route: string
}

/* ===================== REPORT DATA ===================== */

const reportSections: {
  sectionTitle: string
  reports: ReportItem[]
}[] = [
  {
    sectionTitle: "Operations",
    reports: [
      {
        title: "Jobs",
        description: "Detailed job performance and status",
        icon: Briefcase,
        route: "/reports/jobs",
      },
      {
        title: "Job Statistics",
        description: "Completion rates and trends",
        icon: BarChart3,
        route: "/reports/job-statistics",
      },
      {
        title: "Equipment",
        description: "Equipment usage and availability",
        icon: Wrench,
        route: "/reports/equipment",
      },
      {
        title: "Call Tracking",
        description: "Inbound and outbound call analysis",
        icon: PhoneCall,
        route: "/reports/call-tracking",
      },
    ],
  },
  {
    sectionTitle: "Sales & Clients",
    reports: [
      {
        title: "Sales",
        description: "Revenue and sales performance",
        icon: TrendingUp,
        route: "/reports/sales",
      },
      {
        title: "Leads Report",
        description: "Lead sources and conversion",
        icon: ClipboardList,
        route: "/reports/leads",
      },
      {
        title: "Estimates",
        description: "Estimate creation and approvals",
        icon: FileText,
        route: "/reports/estimates",
      },
      {
        title: "Website Requests",
        description: "Online inquiries and requests",
        icon: Package,
        route: "/reports/website-requests",
      },
    ],
  },
  {
    sectionTitle: "Finance",
    reports: [
      {
        title: "Invoices",
        description: "Issued and paid invoices",
        icon: Receipt,
        route: "/reports/invoices",
      },
      {
        title: "Payments",
        description: "Payment history and methods",
        icon: DollarSign,
        route: "/reports/payments",
      },
      {
        title: "Aging Invoices",
        description: "Overdue invoice tracking",
        icon: CalendarClock,
        route: "/reports/aging-invoices",
      },
      {
        title: "Tax",
        description: "Tax summary and calculations",
        icon: Percent,
        route: "/reports/tax",
      },
    ],
  },
  {
    sectionTitle: "Productivity",
    reports: [
      {
        title: "Timesheets",
        description: "Employee work hours",
        icon: CalendarClock,
        route: "/reports/timesheets",
      },
      {
        title: "Tasks",
        description: "Task completion and assignments",
        icon: CheckSquare,
        route: "/reports/tasks",
      },
    ],
  },
]

export function Reports() {
    const navigate = useNavigate()
  return (
    <div className="space-y-6 p-4  min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 text-sm mt-1">View detailed insights and performance metrics</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
        <div className="flex gap-4 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={20} className="text-gray-600" />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="text-gray-600" />
            Filters
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$263,000</p>
          <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$187,000</p>
          <p className="text-xs text-green-600 mt-1">-8% vs last month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Net Profit</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">$76,000</p>
          <p className="text-xs text-green-600 mt-1">+18% vs last month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <p className="text-gray-600 text-sm">Total Jobs</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">360</p>
          <p className="text-xs text-green-600 mt-1">+15% vs last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue & Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Job Status Chart */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={jobStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="canceled" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Job Type Distribution */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {jobTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Margin */}
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Month</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Expenses</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Profit</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Margin</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRevenueData.map((row) => (
                <tr key={row.month} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.month}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-semibold">${row.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-semibold">${row.expenses.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold">${row.profit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-semibold">
                    {((row.profit / row.revenue) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sections */}
      {reportSections.map((section) => (
        <div key={section.sectionTitle} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {section.sectionTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {section.reports.map((report) => (
              <button
                key={report.title}
                onClick={() => navigate(report.route)}
                className="group bg-white border border-gray-300 rounded-xl p-5 text-left hover:shadow-md transition-all hover:border-primary"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <report.icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary">
                      {report.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {report.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}



      
    </div>
  )
}
