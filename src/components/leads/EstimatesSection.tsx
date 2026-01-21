import { MoreVertical, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function EstimatesSection() {
  const navigate  = useNavigate()
  return (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">
          Estimates
        </h3>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border text-sm">
            Load proposal template
          </button>

          <button onClick={()=>{navigate('/estimates/add')}} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-1">
            <Plus size={16} />
            Add Estimate
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Estimate", "Created", "Status", "Total", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 font-semibold text-primary">
                <Link to="/estimates/view">Paint Estimate</Link> / Estimate No. 1179-1
              </td>
              <td className="px-4 py-3">
                Thu Jan 08, 2026 04:35 pm
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3 font-semibold">
                $3,250.00
              </td>
              <td className="px-4 py-3">
                <MoreVertical size={16} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EstimatesSection;
