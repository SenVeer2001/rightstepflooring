import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Download } from "lucide-react"
import { StatCard } from "./component/StatCard"
import { ChartCard } from "./component/ChartCard"
import { SectionTitle } from "./component/SectionTitle"
import { EmployeeAttritionCard } from "./component/EmployeeAttritionCard"
import {
  overviewStats,
  departmentData,
  jobRolesData,
  genderData,
  ageGroupData,
  educationData,
  attritionTrendData,
  surveyScoresData,
  recentAttritionRecords,
} from "./mockData"

/* ---------------- GLASS THEME ---------------- */

const glassMain =
  "rounded-3xl bg-white/55 backdrop-blur-2xl border border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.12)]"

const glassCard =
  "rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30"

const glassSoft =
  "rounded-xl bg-white/30 backdrop-blur-lg border border-white/30"

/* ---------------- COMPONENT ---------------- */

export function AdvancedReport() {
  const [viewFilter, setViewFilter] = React.useState("all")

  return (
    <div className="min-h-screen p-4">
      <div className={` space-y-5`}>

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              HR Attrition Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              27 May 2021 to 8 May 2022
            </p>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                checked={viewFilter === "retention"}
                onChange={() => setViewFilter("retention")}
              />
              Retention
            </label>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                checked={viewFilter === "attrition"}
                onChange={() => setViewFilter("attrition")}
              />
              Attrition
            </label>

            <button className="ml-auto px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold">
              <Download size={16} className="inline mr-2" />
              Export
            </button>
          </div>
        </header>

        {/* OVERVIEW STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overviewStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* TWO COLUMN GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="rounded-2xl p-4 bg-white/80 backdrop-blur-xl border border-white/30">

           <div >
              <SectionTitle title="Recent Attrition" />
              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentAttritionRecords.map((employee) => (
                  <div key={employee.empId} className={glassSoft}>
                    <EmployeeAttritionCard employee={employee} />
                  </div>
                ))}
              </div>
            </div>
            <div className=" flex mt-10" >
              <div className="min-w-[300px]">
                <SectionTitle title="Department" />
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        innerRadius={60}
                        outerRadius={85}
                        dataKey="value"
                      >
                        {departmentData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="mt-4 space-y-2">
                    {departmentData.map((d) => (
                      <div
                        key={d.name}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">{d.name}</span>
                        <span className="font-semibold text-gray-900">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="min-w-[300px]">
                 <ChartCard title="Age Group">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis />
                      <YAxis />
                      <Bar dataKey="count" fill="#F5A962" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

            </div>

             <div>
                {/* <SectionTitle
                  title="Demographics"
                  description="Click data point(s) to filter dashboard."
                /> */}

               

              </div>

            {/* Job Role */}
            <div >
              <SectionTitle title="Job Role" description="Top 5" />
              <div className="p-6 space-y-3">
                {jobRolesData.map((role) => (
                  <div
                    key={role.role}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-900">
                      {role.role}
                    </span>
                    <span className="font-bold text-gray-900">
                      {role.attrition}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Survey Score */}
            
          </div>

          {/* RIGHT COLUMN */}
          <div className="rounded-2xl p-4 bg-white/80 backdrop-blur-xl border border-white/30">

            {/* Demographics */}
            <div >
              <SectionTitle
                title="Demographics"
                description="Click data point(s) to filter dashboard."
              />
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               

               <ChartCard title="Gender">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        innerRadius={50}
                        outerRadius={75}
                        dataKey="value"
                      >
                        {genderData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Education">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={educationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="degree" type="category" width={100} />
                      <Bar dataKey="count" fill="#F5A962" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            {/* Attrition Trend */}
            <div >
              <SectionTitle
                title="Attrition Trend"
                description="85.5% vs previous month"
              />
              <div className="p-6">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={attritionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="attrition" fill="#F5A962" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-4">
              <SectionTitle title="Survey Score" />
              <div className="p-3 overflow-x-auto bg-white/70 rounded-md ">
                <table className="w-full text-sm  ">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Category</th>
                      <th className="text-center">Score 1</th>
                      <th className="text-center">Score 2</th>
                      <th className="text-center">Score 3</th>
                      <th className="text-center">Score 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveyScoresData.map((row, i) => (
                      <tr key={i} className="">
                        <td className="py-2">{row.category}</td>
                        {[row.score1, row.score2, row.score3, row.score4].map(
                          (v, j) => (
                            <td
                              key={j}
                              className="text-center font-semibold"
                            >
                              {v}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-xs text-gray-600 text-center pt-4 border-t">
          © HR Analytics Dashboard
        </footer>

      </div>
    </div>
  )
}
