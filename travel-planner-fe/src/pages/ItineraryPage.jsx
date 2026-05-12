import { useTripSelection } from "../context/TripSelectionContext";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Filter, MoreVertical, Calendar, X } from "lucide-react";

// ─── MODAL COMPONENT (NHÉT VÀO ĐÂY) ──────────────────────────────────────────
const AddActivityModal = ({ tripId, isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    category: 'Sightseeing', // Mặc định
    priority: 'Medium',
    status: 'Planned',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/itinerary/${tripId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onRefresh(); // Refresh danh sách sau khi add
        onClose();   // Đóng modal
        setFormData({ title: '', location: '', date: '', time: '', category: 'Sightseeing', priority: 'Medium', status: 'Planned' });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-[550px] overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-8 pb-0">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add New Activity</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Title *</label>
            <input required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300" 
              placeholder="e.g. Visit Marble Mountains" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location *</label>
            <input required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all" 
              placeholder="e.g. Da Nang" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date *</label>
              <input type="date" required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold" 
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Time *</label>
              <input type="time" required className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold" 
                value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category *</label>
              <select required className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold" 
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Transport">Transport</option>
                <option value="Hotel">Hotel</option>
                <option value="Food">Food</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority *</label>
              <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold" 
                value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-10 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50">
              {loading ? "Saving..." : "Save Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const { selectedTripId } = useTripSelection();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tách hàm fetch ra để dùng lại sau khi add activity
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

  if (!selectedTripId) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-3xl shadow-sm border border-dashed border-slate-200">
      <Calendar size={48} className="mb-4 opacity-20" />
      <p className="font-medium">Please select a trip to view itinerary</p>
    </div>
  );

  if (loading && itinerary.length === 0) return <div className="p-8 text-slate-500 animate-pulse">Loading itinerary...</div>;

  const filteredData = itinerary
    .filter((item) => filter === "All" || item.status === filter)
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));

  const statusStyles = {
    Planned: "bg-slate-100 text-slate-600 border-slate-200",
    "In Progress": "bg-blue-50 text-blue-600 border-blue-100",
    Done: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  const priorityStyles = {
    High: "bg-red-50 text-red-600",
    Medium: "bg-orange-50 text-orange-600",
    Low: "bg-emerald-50 text-emerald-600",
  };

  const categoryColors = {
    Transport: "text-emerald-500",
    Hotel: "text-indigo-500",
    Sightseeing: "text-sky-500",
    Food: "text-rose-500",
    Shopping: "text-amber-500",
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Itinerary</h1>
          <p className="text-slate-500 mt-1">Manage all your activities and plans.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> Add Activity
          </button>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-2 rounded-2xl">
        <div className="flex items-center gap-1 p-1 bg-slate-100/50 rounded-xl w-fit">
          {["All", "Planned", "In Progress", "Done"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 text-sm text-slate-600 font-medium whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-5"><span className="text-sm font-bold text-slate-800">{item.title}</span></td>
                  <td className="px-6 py-5 text-sm text-slate-500">{item.location}</td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-mono">{item.time}</td>
                  <td className={`px-6 py-5 text-sm font-bold ${categoryColors[item.category]}`}>{item.category}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-tight ${priorityStyles[item.priority]}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL COMPONENT */}
      <AddActivityModal 
        tripId={selectedTripId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchItinerary}
      />
    </div>
  );
}