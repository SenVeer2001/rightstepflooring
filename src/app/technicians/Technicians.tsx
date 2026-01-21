import { Plus, MapPin, Clock } from "lucide-react"

const mockTechs = [
  { id: 1, name: "John Doe", skills: "HVAC, Heating", jobs: 12, status: "Active", location: "North District" },
  { id: 2, name: "Jane Smith", skills: "Plumbing, Water", jobs: 8, status: "Active", location: "Central Zone" },
  { id: 3, name: "Mike Johnson", skills: "Electrical", jobs: 15, status: "On Break", location: "East Side" },
]

export function Technicians() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Technicians</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          Add Technician
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockTechs.map((tech) => (
          <div key={tech.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {tech.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{tech.name}</p>
                <p className="text-xs text-gray-500">{tech.skills}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                {tech.location}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                {tech.jobs} jobs completed
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  tech.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {tech.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
