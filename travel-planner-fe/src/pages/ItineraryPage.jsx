import { useTripSelection } from "../context/TripSelectionContext";
import { useEffect, useState } from "react";

export default function ItineraryPage() {
  const { selectedTripId } = useTripSelection();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!selectedTripId) return;

    setLoading(true);
    fetch(`http://localhost:3000/itinerary/${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => setItinerary(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTripId]);

  if (!selectedTripId)
    return <div className="text-gray-500">Please select a trip first</div>;
  if (loading) return <div className="text-gray-500">Loading itinerary...</div>;

  // filter theo tab và search
  const filteredData = itinerary
    .filter((item) => filter === "All" || item.status === filter)
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  const statusColors = {
    Planned:
      "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium",
    "In Progress":
      "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium",
    Done: "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium",
  };

  const priorityColors = {
    High: "text-red-600 font-semibold",
    Medium: "text-orange-500 font-semibold",
    Low: "text-green-500 font-semibold",
  };

  const categoryColors = {
    Transport: "text-green-500",
    Hotel: "text-indigo-500",
    Sightseeing: "text-blue-500",
    Food: "text-red-500",
    Shopping: "text-yellow-500",
  };

  return (
    <div className="bg-white rounded-3xl p-8 min-h-full shadow-sm">
      {/* Header + Add Activity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Itinerary</h1>
        <div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            + Add Activity
          </button>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {["All", "Planned", "In Progress", "Done"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === tab
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search activities..."
          className="ml-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Activity
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Location
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Time
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Category
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Priority
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 text-sm">{item.date}</td>
                <td className="px-4 py-4 text-sm font-medium">{item.title}</td>
                <td className="px-4 py-4 text-sm">{item.location}</td>
                <td className="px-4 py-4 text-sm">{item.time}</td>
                <td
                  className={`px-4 py-4 text-sm ${categoryColors[item.category]}`}
                >
                  {item.category}
                </td>
                <td
                  className={`px-4 py-4 text-sm ${priorityColors[item.priority]}`}
                >
                  {item.priority}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
