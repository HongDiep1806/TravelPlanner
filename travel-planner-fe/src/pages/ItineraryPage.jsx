import { useTripSelection } from "../context/TripSelectionContext";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  X,
  SlidersHorizontal,
} from "lucide-react";

// Màu chủ đạo đồng bộ với Packing Page
const INDIGO = "oklch(51.1% 0.262 276.966)";

// ─── MODAL COMPONENT (CHỈ CHỈNH SIZE & FONT) ───────────────────────────────────
const AddActivityModal = ({ tripId, isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    category: "Sightseeing",
    priority: "Medium",
    status: "Planned",
  });
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/itinerary/${tripId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onRefresh();
        onClose();
        setFormData({
          title: "",
          location: "",
          date: "",
          time: "",
          category: "Sightseeing",
          priority: "Medium",
          status: "Planned",
        });
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-7 pb-0">
          <h2 className="text-xl font-bold text-gray-800">Add New Activity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
              Activity Title *
            </label>
            <input
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              placeholder="e.g. Visit Marble Mountains"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
              Location *
            </label>
            <input
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              placeholder="e.g. Da Nang"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Date *
              </label>
              <input
                type="date"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Time *
              </label>
              <input
                type="time"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-600 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: INDIGO }}
              className="flex-1 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── ITINERARY PAGE (GIỮ NGUYÊN LOGIC TABLE - CHỈ SỬA TYPOGRAPHY) ──────────────
export default function ItineraryPage() {
  const { selectedTripId } = useTripSelection();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItinerary = useCallback(() => {
    if (!selectedTripId) return;
    setLoading(true);
    fetch(`http://localhost:3000/itinerary/${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => setItinerary(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTripId]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  if (!selectedTripId)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 m-4">
        <Calendar size={48} className="mb-4 opacity-20" />
        <p className="font-semibold text-lg text-center px-4">
          Please select a trip to view itinerary
        </p>
      </div>
    );

  const filteredData = itinerary
    .filter((i) => filter === "All" || i.status === filter)
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  const statusStyles = {
    Planned: "bg-gray-100 text-gray-600 border-gray-200",
    "In Progress": "bg-blue-50 text-blue-600 border-blue-100",
    Done: "bg-green-50 text-green-600 border-green-100",
  };
  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-orange-50 text-orange-600",
    Low: "bg-green-50 text-green-600",
  };
  const categoryColors = {
    Transport: "text-green-500",
    Hotel: "text-indigo-500",
    Sightseeing: "text-sky-500",
    Food: "text-rose-500",
    Shopping: "text-amber-500",
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 space-y-8 shadow-sm">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Itinerary</h1>
          <p className="text-base font-semibold text-gray-500 mt-2">
            Manage all your activities and plans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: INDIGO }}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-base font-semibold hover:opacity-90 transition-all shadow-md"
          >
            <Plus size={17} /> Add Activity
          </button>
          <button className="p-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition sm:hidden">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Tabs - Kiểu Pill giống Packing */}
        <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 w-full lg:w-fit overflow-x-auto no-scrollbar">
          {["All", "Planned", "In Progress", "Done"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-base font-medium transition-all ${filter === tab ? "bg-white text-indigo-600 font-semibold shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative group w-full lg:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            size={17}
          />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          />
        </div>
      </div>

      {/* TABLE - GIỮ NGUYÊN CẤU TRÚC MOBILE RESPONSIVE CỦA BẠN */}
      {/* TABLE - FIX TRIỆT ĐỂ LỖI HIỂN THỊ (NHƯ TRONG ẢNH IMAGE_EEA9F8.PNG) */}
      <div className="mt-8 border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group bg-gray-50/80">
            <tr>
              {[
                "Date",
                "Activity",
                "Location",
                "Time",
                "Category",
                "Priority",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="block md:table-row hover:bg-indigo-50/20 transition-all group"
              >
                {/* Date */}
                <td className="block md:table-cell px-6 py-4 md:py-6 text-[15px] text-gray-500 font-medium">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Date
                  </span>
                  <span className="whitespace-nowrap">{item.date}</span>
                </td>

                {/* Activity Title */}
                <td className="block md:table-cell px-6 py-2 md:py-6">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Activity
                  </span>
                  <span className="text-[17px] md:text-[16px] font-bold text-gray-800 leading-tight">
                    {item.title}
                  </span>
                </td>

                {/* Location */}
                <td className="block md:table-cell px-6 py-2 md:py-6 text-[15px] text-gray-400">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Location
                  </span>
                  <div className="max-w-[200px] truncate md:whitespace-normal">
                    {item.location}
                  </div>
                </td>

                {/* Time */}
                <td className="block md:table-cell px-6 py-2 md:py-6 text-[15px] text-gray-600 font-semibold">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Time
                  </span>
                  {item.time}
                </td>

                {/* Category */}
                <td
                  className={`block md:table-cell px-6 py-2 md:py-6 text-[15px] font-bold ${categoryColors[item.category] || "text-gray-500"}`}
                >
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Category
                  </span>
                  {item.category}
                </td>

                {/* Priority - Fix padding và font cực nhỏ cho sang */}
                <td className="block md:table-cell px-6 py-3 md:py-6">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Priority
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-2 py-0.5 min-w-[60px] rounded-md text-[10px] font-black uppercase tracking-tighter border ${priorityStyles[item.priority] || "bg-gray-50 text-gray-400 border-gray-100"}`}
                  >
                    {item.priority}
                  </span>
                </td>

                {/* Status - Fix lỗi vỡ dòng (In Progress) */}
                <td className="block md:table-cell px-6 py-3 md:py-6">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    Status
                  </span>
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border shadow-sm ${statusStyles[item.status] || "bg-gray-50 text-gray-400 border-gray-200"}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="block md:table-cell px-6 py-4 md:py-6 text-right">
                  <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddActivityModal
        tripId={selectedTripId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchItinerary}
      />
    </div>
  );
}
