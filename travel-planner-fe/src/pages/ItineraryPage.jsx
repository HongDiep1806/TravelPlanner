import { useTripSelection } from "../context/TripSelectionContext";
import { useEffect, useState, useCallback } from "react";
import AddActivityModal from "../components/AddActivityModal";
import { API_BASE } from "../config";
import {
  Search,
  Plus,
  MoreVertical,
  Calendar,
  X,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

const INDIGO = "oklch(51.1% 0.262 276.966)";

function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[28px] shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-black text-slate-800">Delete Activity?</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            This activity will be permanently removed and cannot be recovered.
          </p>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const { selectedTripId } = useTripSelection();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchItinerary = useCallback(() => {
    if (!selectedTripId) return;
    setLoading(true);
    fetch(`${API_BASE}/itinerary/${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => setItinerary(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTripId]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  const handleEdit = (itemId) => {
    // Guard: find by numeric ID to ensure type consistency
    const item = itinerary.find((i) => i.id === Number(itemId));
    if (!item) return;
    setActivityToEdit(item);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  const handleDelete = (itemId) => {
    setOpenMenuId(null);
    setDeleteTargetId(Number(itemId));
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/itinerary/${selectedTripId}/${deleteTargetId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        fetchItinerary();
      } else {
        // Safe parse: server may return non-JSON on unexpected errors
        const msg = await res.json().then((d) => d.message).catch(() => `Server error (${res.status})`);
        alert(`Failed to delete activity: ${msg}`);
      }
    } catch {
      alert("Failed to connect to server");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActivityToEdit(null);
  };

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
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => !dateFilter || i.date === dateFilter)
    .filter((i) => categoryFilter === "All" || i.category === categoryFilter)
    .filter((i) => priorityFilter === "All" || i.priority === priorityFilter);

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

  const isOverdue = (item) => {
    if (item.status === "Done") return false;
    return new Date(`${item.date}T${item.time}`) < new Date();
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 w-full lg:w-fit overflow-x-auto no-scrollbar">
            {["All", "Planned", "In Progress", "Done"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-base font-medium transition-all ${
                  filter === tab
                    ? "bg-white text-indigo-600 font-semibold shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
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

        {/* FILTER ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="All">All Categories</option>
            <option value="Transport">Transport</option>
            <option value="Food">Food</option>
            <option value="Sightseeing">Sightseeing</option>
            <option value="Shopping">Shopping</option>
            <option value="Hotel">Hotel</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-8 border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group bg-gray-50/80">
            <tr>
              {["Date", "Activity", "Location", "Time", "Category", "Priority", "Status", ""].map((h) => (
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
                className={`block md:table-row transition-all group border-l-4 ${
                  isOverdue(item)
                    ? "bg-red-50/40 border-red-400 hover:bg-red-50"
                    : "hover:bg-indigo-50/20 border-transparent"
                }`}
              >
                {/* Date */}
                <td className="block md:table-cell px-6 py-4 md:py-6 text-[15px] text-gray-500 font-medium">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Date</span>
                  <span className="whitespace-nowrap">{item.date}</span>
                </td>

                {/* Activity Title */}
                <td className="block md:table-cell px-6 py-2 md:py-6">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Activity</span>
                  <span className="text-[17px] md:text-[16px] font-bold text-gray-800 leading-tight">
                    {item.title}
                  </span>
                </td>

                {/* Location */}
                <td className="block md:table-cell px-6 py-2 md:py-6 text-[15px] text-gray-400">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Location</span>
                  <div className="max-w-[200px] truncate md:whitespace-normal">{item.location}</div>
                </td>

                {/* Time */}
                <td className="block md:table-cell px-6 py-2 md:py-6 text-[15px] text-gray-600 font-semibold">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Time</span>
                  {item.time}
                </td>

                {/* Category */}
                <td className={`block md:table-cell px-6 py-2 md:py-6 text-[15px] font-bold ${categoryColors[item.category] || "text-gray-500"}`}>
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</span>
                  {item.category}
                </td>

                {/* Priority */}
                <td className="block md:table-cell px-6 py-3 md:py-6">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Priority</span>
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 min-w-[60px] rounded-md text-[10px] font-black uppercase tracking-tighter border ${priorityStyles[item.priority] || "bg-gray-50 text-gray-400 border-gray-100"}`}>
                    {item.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="block md:table-cell px-6 py-3 md:py-6">
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</span>
                  <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border shadow-sm ${statusStyles[item.status] || "bg-gray-50 text-gray-400 border-gray-200"}`}>
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="block md:table-cell px-6 py-4 md:py-6 text-right">
                  <button
                    onClick={(e) => {
                      if (openMenuId === item.id) {
                        setOpenMenuId(null);
                      } else {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
                        setOpenMenuId(Number(item.id));
                      }
                    }}
                    className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dropdown menu — rendered outside overflow-hidden table to avoid clipping */}
      {openMenuId && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div
            className="fixed z-20 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <button
              onClick={() => handleEdit(openMenuId)}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => handleDelete(openMenuId)}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}

      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <AddActivityModal
        tripId={selectedTripId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onRefresh={fetchItinerary}
        activityToEdit={activityToEdit}
      />
    </div>
  );
}
