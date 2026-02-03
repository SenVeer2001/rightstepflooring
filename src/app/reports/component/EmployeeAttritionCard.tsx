import React from "react"
import type { EmployeeAttritionRecord } from "../mockData"

interface EmployeeAttritionCardProps {
  employee: EmployeeAttritionRecord
  className?: string
}

export function EmployeeAttritionCard({ employee, className = "" }: EmployeeAttritionCardProps) {
  return (
    <div className={`bg-gradient-to-r from-orange-50 to-white rounded-lg p-4 border border-orange-100 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {employee.empId}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900">{employee.name}</h4>
          <p className="text-xs text-gray-600 mt-1">{employee.role}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-600">Attrition Date</p>
          <p className="text-sm font-semibold text-gray-900">{employee.attritionDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-orange-100">
        <div>
          <p className="text-xs text-gray-600">Avg. Score</p>
          <p className="text-sm font-bold text-gray-900">{employee.score}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Performance</p>
          <p className="text-sm font-bold text-gray-900">3</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Salary Hike</p>
          <p className="text-sm font-bold text-gray-900">13%</p>
        </div>
      </div>
    </div>
  )
}
