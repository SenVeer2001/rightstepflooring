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
    <div className="min-h-screen p-6">

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

       
        <div className="lg:col-span-1 space-y-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">

          {/* Key Metrics */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">$<CountUp end={1739.82} decimals={2} duration={2.0} /></p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Jobs Done</p>
                <p className="text-2xl font-bold text-green-600"><CountUp end={2} decimals={0} duration={2.0} /></p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Jobs Created</p>
                <p className="text-2xl font-bold text-blue-600"><CountUp end={1} decimals={0} duration={2.0} /></p>
              </div>
            </div>
          </div>

          {/* Top Job Types */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Top Job Types</h3>
                <p className="text-xs text-gray-500 mt-2">Current Period</p>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {topJobTypesData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md font-semibold">{idx + 1}</span>
                    <span className="font-semibold text-gray-900 w-10 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Trend */}
          <div className="">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Sales Trend</h3>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <RefreshCw size={16} className="text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlySalesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#387d22"
                  strokeWidth={2}
                  dot={{ fill: "#fdf76d", r: 4 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============ RIGHT SECTION (2 columns) ============ */}
        <div className="lg:col-span-2 space-y-4   "> 

          {/* <div className="flex justify-between items-start mb-5">
            
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <RefreshCw size={16} className="text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
          </div> */}

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 rounded-lg  ">
            <div className="border border-gray-200 bg-white rounded-lg p-5 text-center hover:shadow-md transition">
              <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">$<CountUp end={14539} decimals={0} duration={2.0} /></p>
            </div>
            <div className="border border-gray-200 bg-white rounded-lg p-5 text-center hover:shadow-md transition">
              <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">Total Jobs</p>
              <p className="text-2xl font-bold text-green-600"><CountUp end={395} decimals={0} duration={2.0} /></p>
            </div>
            <div className="border border-gray-200 bg-white rounded-lg p-5 text-center hover:shadow-md transition">
              <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">Total Invoices</p>
              <p className="text-2xl font-bold text-orange-600"><CountUp end={395} decimals={0} duration={2.0} /></p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Invoices Chart */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Invoices</h3>
                <button className="p-1.5 hover:bg-white rounded-lg transition">
                  <Info size={16} className="text-gray-400" />
                </button>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={invoiceBarData} barSize={16} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="invoices" fill="#387d22" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Jobs By Status */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Jobs Status</h3>
                <button className="p-1.5 hover:bg-white rounded-lg transition">
                  <Info size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-4 flex gap-3 flex-wrap text-xs">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600 font-medium">Canceled</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-600 font-medium">Open</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600 font-medium">Done</span>
                </span>
              </div>

              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={jobStatusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="50%"
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
          </div>

          {/* Sales Overview */}
          <div className=" ">


            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-200 bg-white rounded-lg p-5 text-center hover:shadow-md transition">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">Net Sales</p>
                <p className="text-2xl font-bold text-blue-600">$<CountUp end={21102.03} decimals={2} duration={2.0} /></p>
              </div>
              <div className="border border-gray-200 bg-white rounded-lg p-5 text-center hover:shadow-md transition">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">$<CountUp end={8500} decimals={2} duration={2.0} /></p>
              </div>
              <div className="border border-gray-200 bg-white rounded-lg p-5 text-center hover:shadow-md transition">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">Jobs Created</p>
                <p className="text-2xl font-bold text-orange-600"><CountUp end={37} decimals={0} duration={2.0} /></p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}
