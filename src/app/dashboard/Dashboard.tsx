import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, Pie, PieChart } from 'recharts'
import { MoreVertical, RefreshCw, Info, Eye } from 'lucide-react'
import CountUp from 'react-countup'

const monthlySalesData = [
  { month: "Jan", revenue: 420 },
  { month: "Feb", revenue: 680 },
  { month: "Mar", revenue: 530 },
  { month: "Apr", revenue: 790 },
  { month: "May", revenue: 610 },
  { month: "Jun", revenue: 880 },
  { month: "July", revenue: 380 },

]

const jobStatusChartData = [
  { name: "Canceled", value: 45, color: "#ef4444" },
  { name: "Open", value: 120, color: "#f97316" },
  { name: "Done", value: 230, color: "#22c55e" },
]


const jobStatusData = [
  { name: 'Canceled', value: 45 },
  { name: 'Open', value: 120 },
  { name: 'Done', value: 230 },
]

const invoiceBarData = [
  { month: "Jan", invoices: 120 },
  { month: "Feb", invoices: 180 },
  { month: "Mar", invoices: 150 },
  { month: "Apr", invoices: 220 },
  { month: "May", invoices: 200 },
  { month: "June", invoices: 220 },
  { month: "July", invoices: 100 },
]



const topJobTypesData = [
  { name: 'Flooring Installation', value: 45 },
  { name: 'Flooring Repair', value: 32 },
  { name: 'Carpet Cleaning', value: 28 },
]

export function Dashboard() {
  return (
    <div className="space-y-3 p-2  min-h-screen">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 uppercase tracking-wider\">
        TWO FACTOR AUTHENTICATION # DASHBOARD
      </div>

      {/* Top Row - Three Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Payouts Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payouts</h3>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <Info size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-3 mb-6">
            <p className="text-gray-600 text-sm">Total balance</p>
            <p className="text-3xl font-bold text-gray-900">$<CountUp end={10239.82} decimals={2} duration={2.0} /></p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-blue-600 text-xs font-semibold uppercase mb-1">Instant Payouts</p>
            <p className="text-gray-700 text-sm">Transferred in minutes for +1%</p>
            <p className="text-gray-600 text-xs mt-2">Not eligible yet</p>
          </div>
          <div className='flex items-center justify-between mt-2 gap-4'>

            <button className="w-full bg-primary hover:bg-[#2c621b] text-white font-semibold py-2 px-2 rounded-lg transition-colors text-sm">
              Learn more
            </button>
            

            <button className="w-full text-white  bg-blue-500 font-semibold py-2 px-2 rounded-lg transition-colors text-sm">
              View all
            </button>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sales</h3>
              {/* <p className="text-xs text-gray-600 mt-1">updated 5:37 AM</p> */}
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <Info size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 text-blue-500 rounded-lg transition">
                <Eye size={18} className="text-blue-500" />
              </button>
            </div>
          </div>

          <div className="mb-4 flex gap-3 flex-wrap">
            <p className="text-gray-600  mb-1">Net: <span className="text-blue-500">$21,102.03</span></p>
            <p className="text-gray-600 font-semibold">Total: <span className="text-black"> $<CountUp end={14539.82} decimals={2} duration={2.0} /></span></p>
          </div>

          {/* <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer> */}


          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySalesData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* <button className="w-full text-blue-600 font-semibold py-2 mt-3 text-sm hover:underline">
            View All
          </button> */}
        </div>

        {/* Today Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Today</h3>
            <div className="flex gap-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={18} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Revenue Section */}
          <div className="space-y-2">
            <div className="rounded-lg bg-gray-50 px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">Sales</span>
              <span className="text-2xl font-bold text-gray-900">$<CountUp end={1739.82} decimals={2} duration={2.0} /></span>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">Collected</span>
              <span className="text-2xl font-bold text-gray-900">$<CountUp end={1239.82} decimals={2} duration={2.0} /></span>
            </div>
          </div>

          <div className="my-5 border-t border-gray-200" />

          {/* Jobs Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-l-4 border-yellow-400 bg-yellow-50/40 px-3 py-2 rounded">
              <span className="text-sm text-gray-700">Jobs Done</span>
              <span className="text-xl font-semibold text-gray-900">2</span>
            </div>

            <div className="flex justify-between items-center border-l-4 border-orange-400  px-3 py-2 rounded">
              <span className="text-sm text-gray-600">Jobs Canceled</span>
              <span className="text-lg font-semibold text-gray-900">2</span>
            </div>

            <div className="flex justify-between items-center border-l-4 border-green-400   px-3 py-2 rounded">
              <span className="text-sm text-gray-600">Jobs Created</span>
              <span className="text-lg font-semibold text-gray-900">1</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row - Three Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Invoices Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <Info size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
          <div className=" flex items-center justify-center text-gray-500">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={invoiceBarData}
                margin={{ top: 30, right: 10, left: 0, bottom: 10 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                {/* Bottom X Axis – Months */}
                <XAxis
                  xAxisId="months"
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                {/* Top X Axis – Invoice Scale */}
                <XAxis
                  xAxisId="invoices"
                  orientation="top"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                {/* ✅ Attach xAxisId here */}
                <Bar
                  xAxisId="months"
                  dataKey="invoices"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>


          </div>
        </div>

        {/* Jobs By Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Jobs By Status</h3>
              <p className="text-xs text-gray-600 mt-1">updated 5:37 AM</p>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <Info size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Canceled
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Open
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Done
            </span>
          </div>


          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={jobStatusChartData}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={6}
                cornerRadius={10}
              // isAnimationActive={isAnimationActive}
              >
                {jobStatusChartData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>


        </div>

        {/* Top Job Types Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Job Types</h3>
              <p className="text-xs text-gray-600 mt-1">updated 5:37 AM</p>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {topJobTypesData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">{item.name}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
