import { useTripSelection } from "../context/TripSelectionContext";
import { useEffect, useState, useCallback } from "react";
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
  Check,
  Loader2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const INDIGO = "oklch(51.1% 0.262 276.966)";
const CATEGORIES = ["Transport", "Food", "Sightseeing", "Shopping", "Hotel", "Other"];
const STATUS_OPTIONS = ["All", "Planned", "In Progress", "Done"];
const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

const DEFAULT_FILTERS = {
  categories: [],
  status: "All",
  priority: "All",
  date: "",
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Delete Activity?</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            This activity will be permanently removed and cannot be recovered.
          </p>
        </div>
        <div className="flex gap-3 mt-7">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-base font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Activity Modal ────────────────────────────────────────────────
function ActivityModal({ initial, onClose, onSave, loading }) {
  const empty = {
    title: "", location: "", date: "", time: "",
    category: "Sightseeing", priority: "Medium", status: "Planned",
  };
  const [form, setForm] = useState(initial ? { ...initial } : empty);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition placeholder-gray-400";
  const selectCls =
    "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
  const labelCls = "block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initial ? "Edit Activity" : "Add New Activity"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Activity Name</label>
            <input
              className={inputCls}
              placeholder="e.g. Visit Hội An Old Town"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className={labelCls}>Location</label>
            <input
              className={inputCls}
              placeholder="e.g. Hội An, Quảng Nam"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <input type="time" className={inputCls} value={form.time} onChange={(e) => set("time", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select className={selectCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select className={selectCls} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select className={selectCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option>Planned</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-3 text-base font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            disabled={loading || !form.title.trim()}
            onClick={() => { if (form.title.trim()) onSave(form); }}
            style={{ backgroundColor: INDIGO }}
            className="flex-1 text-white rounded-xl py-3 text-base font-semibold hover:opacity-90 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initial ? "Save Changes" : "Add Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Overlay ───────────────────────────────────────────────────────────
function FilterOverlay({ filters, onChange, onApply, onClear, onClose }) {
  const hasActive =
    filters.categories.length > 0 ||
    filters.status !== "All" ||
    filters.priority !== "All" ||
    filters.date !== "";

  const toggleCat = (cat) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const PillGroup = ({ options, value, onSelect }) => (
    <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 w-full">
      {options.map((v) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`flex-1 px-2 py-1.5 rounded-full text-sm font-medium transition-all text-center whitespace-nowrap
            ${value === v ? "bg-white text-indigo-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
          style={value === v ? { boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : {}}
        >
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />
      <div
        className="fixed right-4 sm:right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 w-[calc(100vw-2rem)] sm:w-80 flex flex-col"
        style={{ top: "50%", transform: "translateY(-50%)", maxHeight: "calc(100vh - 80px)" }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <span className="text-base font-bold text-gray-800">Filters</span>
          <div className="flex items-center gap-3">
            {hasActive && (
              <button onClick={onClear} className="text-sm font-semibold" style={{ color: INDIGO }}>
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Category</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const active = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCat(cat)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                      ${active ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className="truncate">{cat}</span>
                    {active && <Check size={12} className="ml-auto flex-shrink-0 text-indigo-500" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Status</p>
            <PillGroup
              options={STATUS_OPTIONS}
              value={filters.status}
              onSelect={(v) => onChange({ ...filters, status: v })}
            />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Priority</p>
            <PillGroup
              options={PRIORITY_OPTIONS}
              value={filters.priority}
              onSelect={(v) => onChange({ ...filters, priority: v })}
            />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Date</p>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => onChange({ ...filters, date: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => { onApply(); onClose(); }}
            style={{ backgroundColor: INDIGO }}
            className="flex-1 text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Style maps ───────────────────────────────────────────────────────────────
const statusStyles = {
  Planned:      "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Done:          "bg-green-50 text-green-700",
};

const priorityStyles = {
  High:   { text: "text-red-600",    bg: "bg-red-50"    },
  Medium: { text: "text-orange-500", bg: "bg-orange-50" },
  Low:    { text: "text-green-600",  bg: "bg-green-50"  },
};

const categoryColors = {
  Transport:   "text-green-600",
  Hotel:       "text-indigo-600",
  Sightseeing: "text-sky-600",
  Food:        "text-rose-600",
  Shopping:    "text-amber-600",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ItineraryPage() {
  const { selectedTripId } = useTripSelection();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [mutating, setMutating]   = useState(false);  // add/edit/delete in progress

  const [search, setSearch]             = useState("");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [openMenuId, setOpenMenuId]     = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showFilter, setShowFilter]     = useState(false);

  // Single source of truth: all filters live here; inline dropdowns + pills are shortcuts into it
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  // ── Fetch itinerary on mount / when trip changes ──────────────────────────
  const fetchItinerary = useCallback(() => {
    if (!selectedTripId) return;
    setLoading(true);
    fetch(`${API_BASE}/itinerary/${selectedTripId}`)
      .then((res) => res.json())
      .then((data) => setItinerary(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTripId]);

  useEffect(() => { fetchItinerary(); }, [fetchItinerary]);

  // ── Filter helpers — all update both applied & pending so overlay stays in sync ──
  const setFilter = (patch) => {
    const next = { ...appliedFilters, ...patch };
    setAppliedFilters(next);
    setPendingFilters(next);
  };

  const quickStatus   = appliedFilters.status;
  const quickPriority = appliedFilters.priority;

  const setQuickStatus   = (v) => setFilter({ status: v });
  const setQuickPriority = (v) => setFilter({ priority: v });

  // Inline dropdown shortcuts
  const setDateFilter     = (v) => setFilter({ date: v });
  const setCategoryFilter = (v) => setFilter({ categories: v === "All" ? [] : [v] });

  // Derived single-value reads for the inline dropdowns (controlled values)
  const dateFilter     = appliedFilters.date;
  const categoryFilter = appliedFilters.categories.length === 1 ? appliedFilters.categories[0] : "All";

  const handleApply = () => setAppliedFilters(pendingFilters);
  const handleClear = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const activeFilterCount =
    (appliedFilters.categories.length > 0 ? 1 : 0) +
    (appliedFilters.status   !== "All" ? 1 : 0) +
    (appliedFilters.priority !== "All" ? 1 : 0) +
    (appliedFilters.date     !== ""    ? 1 : 0);

  // ── API handlers ──────────────────────────────────────────────────────────
  const handleEdit = (itemId) => {
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

  // Delete → DELETE /itinerary/:tripId/:id
  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/itinerary/${selectedTripId}/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        fetchItinerary();
      } else {
        const msg = await res.json().then((d) => d.message).catch(() => `Server error (${res.status})`);
        alert(`Failed to delete activity: ${msg}`);
      }
    } catch {
      alert("Failed to connect to server");
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Add → POST /itinerary/:tripId
  // Edit → PUT /itinerary/:tripId/:id
  const handleSave = async (form) => {
    setMutating(true);
    try {
      const method = activityToEdit ? "PUT" : "POST";
      const url = activityToEdit
        ? `${API_BASE}/itinerary/${selectedTripId}/${activityToEdit.id}`
        : `${API_BASE}/itinerary/${selectedTripId}`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      fetchItinerary();
      setIsModalOpen(false);
      setActivityToEdit(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setMutating(false);
    }
  };

  const handleModalClose = () => { setIsModalOpen(false); setActivityToEdit(null); };

  // ── Early return: no trip selected ───────────────────────────────────────
  if (!selectedTripId)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 m-4">
        <Calendar size={40} className="mb-4 opacity-20" />
        <p className="font-medium text-base text-center px-4">Please select a trip to view itinerary</p>
      </div>
    );

  // ── Derived: apply all active filters (single source: appliedFilters) ──────
  const filteredData = itinerary
    .filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
    .filter((i) => !appliedFilters.date || i.date === appliedFilters.date)
    .filter((i) => appliedFilters.categories.length === 0 || appliedFilters.categories.includes(i.category))
    .filter((i) => appliedFilters.status   === "All" || i.status   === appliedFilters.status)
    .filter((i) => appliedFilters.priority === "All" || i.priority === appliedFilters.priority);

  // An item is overdue if it's not Done and its datetime is in the past
  const isOverdue = (item) => {
    if (item.status === "Done") return false;
    return new Date(`${item.date}T${item.time}`) < new Date();
  };

  // Shared dropdown class for the inline filter row
  const dropdownCls =
    "px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition min-w-[10rem]";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 min-h-full shadow-sm">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Itinerary</h1>
          <p className="text-base font-semibold text-gray-500 mt-2">Manage all your activities and plans.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: INDIGO }}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:opacity-90 transition shadow-md"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Add Activity</span>
          </button>

          <button
            onClick={() => { setPendingFilters(appliedFilters); setShowFilter((v) => !v); }}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold border transition shadow-sm
              ${showFilter || activeFilterCount > 0
                ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:text-indigo-500"
              }`}
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: INDIGO }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── STATUS + PRIORITY PILLS + SEARCH ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status pill group */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {STATUS_OPTIONS.map((tab) => (
              <button
                key={tab}
                onClick={() => setQuickStatus(tab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${quickStatus === tab ? "bg-white text-indigo-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                style={quickStatus === tab ? { boxShadow: "0 1px 2px rgba(0,0,0,0.1)" } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          {/* Priority pill group */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {PRIORITY_OPTIONS.map((tab) => (
              <button
                key={tab}
                onClick={() => setQuickPriority(tab)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${quickPriority === tab ? "bg-white text-indigo-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                style={quickPriority === tab ? { boxShadow: "0 1px 2px rgba(0,0,0,0.1)" } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-66 pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── INLINE FILTER DROPDOWNS ── */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className={`${dropdownCls} w-48`}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${dropdownCls} w-56`}
        >
          <option value="All">All Categories</option>

          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      
      {/* ── LOADING / TABLE ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 size={24} className="animate-spin" style={{ color: INDIGO }} />
          <span className="text-base font-medium">Loading itinerary…</span>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ borderColor: "oklch(0.93 0.03 274)" }}
        >
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group">
              <tr style={{ backgroundColor: "oklch(96% 0.025 274)" }}>
                {["Date", "Activity", "Location", "Time", "Category", "Priority", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[11px] font-bold uppercase tracking-[0.1em] ${h === "" ? "w-10" : ""}`}
                    style={{ color: "oklch(45.7% 0.24 277.023)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y bg-white" style={{ borderColor: "oklch(0.96 0.015 274)" }}>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                    No activities match your filter.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className={`block md:table-row transition-all group border-l-4 ${
                      isOverdue(item)
                        ? "border-red-300 hover:bg-red-50/40"
                        : "border-transparent hover:bg-indigo-50/30"
                    }`}
                  >
                    {/* Date */}
                    <td className="block md:table-cell px-6 py-4 md:py-5 text-sm text-gray-500">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Date</span>
                      <span className="whitespace-nowrap">{item.date}</span>
                    </td>

                    {/* Activity */}
                    <td className="block md:table-cell px-6 py-2 md:py-5">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Activity</span>
                      <span className="text-base font-semibold text-gray-800">{item.title}</span>
                    </td>

                    {/* Location */}
                    <td className="block md:table-cell px-6 py-2 md:py-5 text-sm text-gray-500">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Location</span>
                      <div className="max-w-[200px] truncate md:whitespace-normal">{item.location}</div>
                    </td>

                    {/* Time */}
                    <td className="block md:table-cell px-6 py-2 md:py-5 text-sm text-gray-600 font-medium">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Time</span>
                      {item.time}
                    </td>

                    {/* Category */}
                    <td className={`block md:table-cell px-6 py-2 md:py-5 text-sm font-semibold ${categoryColors[item.category] || "text-gray-600"}`}>
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</span>
                      {item.category}
                    </td>

                    {/* Priority — colored badge with light background */}
                    <td className="block md:table-cell px-6 py-3 md:py-5">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Priority</span>
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap
                        ${priorityStyles[item.priority]?.text || "text-gray-600"}
                        ${priorityStyles[item.priority]?.bg  || "bg-gray-50"}`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="block md:table-cell px-6 py-3 md:py-5">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</span>
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${statusStyles[item.status] || "bg-gray-100 text-gray-600"}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions — dots menu, fades in on row hover */}
                    <td className="block md:table-cell px-3 py-4 md:py-5 text-right w-10">
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
                        className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all opacity-60 group-hover:opacity-100"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── DROPDOWN MENU ── */}
      {openMenuId && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
          <div
            className="fixed z-20 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <button
              onClick={() => handleEdit(openMenuId)}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => handleDelete(openMenuId)}
              className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}

      {/* ── FILTER OVERLAY ── */}
      {showFilter && (
        <FilterOverlay
          filters={pendingFilters}
          onChange={setPendingFilters}
          onApply={handleApply}
          onClear={handleClear}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* ── MODALS ── */}
      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {isModalOpen && (
        <ActivityModal
          initial={activityToEdit}
          onClose={handleModalClose}
          onSave={handleSave}
          loading={mutating}
        />
      )}
    </div>
  );
}