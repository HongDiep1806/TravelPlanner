import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, MoreVertical, Pencil, Trash2, X, Check, AlertTriangle, AlertCircle, Loader2, SlidersHorizontal } from "lucide-react";
import { useTripSelection } from "../context/TripSelectionContext";
import { API_BASE } from "../config";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────
const INDIGO = "oklch(51.1% 0.262 276.966)";

const CATEGORIES = ["Transport", "Accommodation", "Food", "Activity", "Shopping", "Other"];

const CATEGORY_COLORS = {
  Transport: "#4F46E5",
  Accommodation: "#22C55E",
  Food: "#F97316",
  Activity: "#EF4444",
  Shopping: "#A855F7",
  Other: "#06B6D4",
};

// Map API budget item → frontend shape
const fromApi = (item) => ({
  ...item,
  estimated: item.estimatedCost,
  actual: item.actualCost,
  paid: item.paymentStatus === "Paid",
});

// Map frontend form → API request body
const toApi = (form) => ({
  name: form.name,
  category: form.category,
  estimatedCost: Number(form.estimated || 0),
  actualCost: Number(form.actual || 0),
  paymentStatus: form.paid ? "Paid" : "Unpaid",
});

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return (
    <div className="flex items-center justify-center h-40 text-gray-300 text-sm">No data</div>
  );

  let cumulative = 0;
  const cx = 80, cy = 80, r = 62, stroke = 26;
  const circumference = 2 * Math.PI * r;

  const slices = data.map((d) => {
    const pct = d.value / total;
    const offset = circumference * (1 - pct);
    const rotation = cumulative * 360;
    cumulative += pct;
    return { ...d, pct, offset, rotation };
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${circumference * s.pct} ${circumference * (1 - s.pct)}`}
              strokeDashoffset={circumference * 0.25}
              transform={`rotate(${s.rotation - 90} ${cx} ${cy})`}
              style={{ transition: "all 0.4s ease" }}
            />
          ))}
          <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fill="#9ca3af" fontSize="10" fontWeight="600">TOTAL</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#1f2937" fontSize="13" fontWeight="700">
            {(total / 1000000).toFixed(1)}M
          </text>
        </svg>
      </div>

      <div className="w-full space-y-2.5">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={d.label} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700 truncate">{d.label}</span>
                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 font-medium">{d.value.toLocaleString("vi-VN")}</span>
                    <span className="text-xs text-gray-400">{pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Edit Initial Budget Modal ────────────────────────────────────────────────
function EditBudgetModal({ current, onClose, onSave }) {
  const [value, setValue] = useState(String(current));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Edit Initial Budget</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Initial Budget (VND)
        </label>
        <input
          type="number"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-3 text-base font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={() => { if (Number(value) > 0) { onSave(Number(value)); onClose(); } }}
            style={{ backgroundColor: INDIGO }}
            className="flex-1 text-white rounded-xl py-3 text-base font-semibold hover:opacity-90 transition shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Modal ───────────────────────────────────────────────────────────────
function ItemModal({ initial, onClose, onSave, loading }) {
  const empty = { name: "", category: "Transport", estimated: "", actual: "", paid: false };
  const [form, setForm] = useState(initial ? { ...initial } : empty);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition placeholder-gray-400";
  const selectCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";
  const labelCls = "block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">{initial ? "Edit Budget Item" : "Add Budget Item"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Item Name</label>
            <input className={inputCls} placeholder="e.g. Flight tickets" value={form.name} onChange={(e) => set("name", e.target.value)} autoFocus />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select className={selectCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Estimated (VND)</label>
              <input type="number" className={inputCls} placeholder="0" value={form.estimated} onChange={(e) => set("estimated", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Actual (VND)</label>
              <input
                type="number"
                className={inputCls}
                placeholder="0"
                value={form.actual}
                onChange={(e) => set("actual", e.target.value)}
                onFocus={() => { if (!Number(form.actual)) set("actual", form.estimated); }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("paid", !form.paid)}
              className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${form.paid ? "justify-end bg-green-500" : "justify-start bg-gray-200"}`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm block" />
            </button>
            <span className="text-sm font-semibold text-gray-700">Paid</span>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-3 text-base font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            disabled={loading || !form.name.trim()}
            onClick={() => { if (form.name.trim()) onSave(form); }}
            style={{ backgroundColor: INDIGO }}
            className="flex-1 text-white rounded-xl py-3 text-base font-semibold hover:opacity-90 transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initial ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Action Menu ──────────────────────────────────────────────────────────────
function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right - 144 });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all opacity-60 group-hover:opacity-100"
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 w-36 overflow-hidden"
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Filter Overlay ───────────────────────────────────────────────────────────
const DEFAULT_FILTERS = { category: "All", paid: "All" };

function FilterOverlay({ filters, onChange, onClear, onClose }) {
  const hasActive = filters.category !== "All" || filters.paid !== "All";

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />
      <div
        className="fixed right-4 sm:right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 w-[calc(100vw-2rem)] sm:w-72 flex flex-col"
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
              {["All", ...CATEGORIES].map((cat) => {
                const active = filters.category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onChange({ ...filters, category: cat })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${active ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {cat !== "All" && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                    )}
                    <span className="truncate">{cat}</span>
                    {active && <Check size={12} className="ml-auto flex-shrink-0 text-indigo-500" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Payment Status</p>
            <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
              {["All", "Paid", "Unpaid"].map((v) => (
                <button
                  key={v}
                  onClick={() => onChange({ ...filters, paid: v })}
                  className={`flex-1 px-2 py-1.5 rounded-full text-sm font-medium transition-all text-center
                    ${filters.paid === v ? "bg-white text-indigo-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
                  style={filters.paid === v ? { boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : {}}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            style={{ backgroundColor: INDIGO }}
            className="w-full text-white rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Budget Progress Panel ────────────────────────────────────────────────────
function BudgetProgressPanel({ totalActual, totalEstimated, initialBudget }) {
  const actualPct = initialBudget > 0 ? (totalActual / initialBudget) * 100 : 0;
  const estimatedPct = initialBudget > 0 ? (totalEstimated / initialBudget) * 100 : 0;
  const difference = totalActual - totalEstimated;
  const diffPct = totalEstimated > 0 ? (Math.abs(difference) / totalEstimated) * 100 : 0;

  const actualBarColor = actualPct >= 100 ? "#EF4444" : actualPct >= 80 ? "#F97316" : "#22C55E";
  const actualBadge = actualPct >= 100
    ? { label: "Over budget", cls: "text-red-600 bg-red-50" }
    : actualPct >= 80
    ? { label: "Warning", cls: "text-orange-600 bg-orange-50" }
    : { label: "On track", cls: "text-green-600 bg-green-50" };

  const isUnder = difference <= 0;

  return (
    <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget progress & difference</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Progress bars */}
        <div className="px-5 py-4 space-y-4">
          {/* Actual vs budget */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500">Actual vs budget</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: actualBarColor }}>
                  {Math.min(actualPct, 100).toFixed(1)}%
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${actualBadge.cls}`}>
                  {actualBadge.label}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(actualPct, 100)}%`, backgroundColor: actualBarColor }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">{totalActual.toLocaleString("vi-VN")}</span>
              <span className="text-[10px] text-gray-400">/ {initialBudget.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>

          {/* Estimated vs budget */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500">Estimated vs budget</span>
              <span className="text-xs font-bold text-indigo-500">{Math.min(estimatedPct, 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 bg-indigo-400"
                style={{ width: `${Math.min(estimatedPct, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-400">{totalEstimated.toLocaleString("vi-VN")}</span>
              <span className="text-[10px] text-gray-400">/ {initialBudget.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>
        </div>

        {/* Difference */}
        <div className="px-5 py-4 flex flex-col justify-center gap-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Actual vs estimated</span>
          <span className={`text-2xl font-bold tabular-nums leading-tight ${isUnder ? "text-green-600" : "text-red-500"}`}>
            {isUnder ? "−" : "+"}{Math.abs(difference).toLocaleString("vi-VN")}
          </span>
          <span className="text-xs text-gray-400">VND</span>
          <span className={`mt-1 inline-flex self-start text-[10px] font-bold px-2 py-0.5 rounded-md ${isUnder ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
            {isUnder ? "↓" : "↑"} {diffPct.toFixed(1)}% {isUnder ? "under estimate" : "over estimate"}
          </span>
          <p className={`text-xs mt-1 leading-relaxed ${isUnder ? "text-green-700" : "text-red-600"}`}>
            {isUnder
              ? "Spending under estimate. Room available."
              : "Spending over estimate. Review expenses."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BudgetPage() {
  const { selectedTripId } = useTripSelection();
  const [items, setItems] = useState([]);
  const [initialBudget, setInitialBudget] = useState(0);
  const [tripName, setTripName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showEditBudget, setShowEditBudget] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    if (!selectedTripId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, tripRes] = await Promise.all([
          fetch(`${API_BASE}/budget-items/${selectedTripId}`),
          fetch(`${API_BASE}/trips/${selectedTripId}`),
        ]);
        const [itemsData, tripData] = await Promise.all([itemsRes.json(), tripRes.json()]);
        setItems(itemsData.map(fromApi));
        setInitialBudget(tripData.budget);
        setTripName(tripData.tripName);
      } catch {
        toast.error("Failed to load budget data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTripId]);

  const totalEstimated = useMemo(() => items.reduce((s, i) => s + Number(i.estimated || 0), 0), [items]);
  const totalActual = useMemo(() => items.filter((i) => i.paid).reduce((s, i) => s + Number(i.actual || 0), 0), [items]);
  const remaining = initialBudget - totalActual;
  const budgetPct = initialBudget > 0 ? (totalActual / initialBudget) * 100 : 0;

  const chartData = useMemo(() => {
    const map = {};
    items.forEach((i) => {
      map[i.category] = (map[i.category] || 0) + Number(i.estimated || 0);
    });
    return CATEGORIES.filter((c) => map[c] > 0).map((c) => ({
      label: c,
      value: map[c],
      color: CATEGORY_COLORS[c],
    }));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((i) => filters.category === "All" || i.category === filters.category)
      .filter((i) => {
        if (filters.paid === "Paid") return i.paid;
        if (filters.paid === "Unpaid") return !i.paid;
        return true;
      });
  }, [items, filters]);

  const activeFilterCount = (filters.category !== "All" ? 1 : 0) + (filters.paid !== "All" ? 1 : 0);

  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/budget-items/${selectedTripId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toApi(form)),
      });
      if (!res.ok) throw new Error();
      const { data } = await res.json();
      setItems((prev) => [...prev, fromApi(data)]);
      setShowModal(false);
      toast.success("Budget item added");
    } catch {
      toast.error("Failed to add budget item");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/budget-items/${selectedTripId}/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toApi(form)),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === editItem.id ? fromApi(updated) : i)));
      setEditItem(null);
      toast.success("Budget item updated");
    } catch {
      toast.error("Failed to update budget item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/budget-items/${selectedTripId}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Budget item deleted");
    } catch {
      toast.error("Failed to delete budget item");
    }
  };

  const handleSaveBudget = async (newBudget) => {
    try {
      const res = await fetch(`${API_BASE}/trips/${selectedTripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripName, budget: newBudget }),
      });
      if (!res.ok) throw new Error();
      setInitialBudget(newBudget);
      toast.success("Budget updated");
    } catch {
      toast.error("Failed to update budget");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 min-h-full shadow-sm">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Budget</h1>
          <p className="text-base font-semibold text-gray-500 mt-2">Track and manage your travel expenses.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: INDIGO }}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:opacity-90 transition shadow-md"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">Add Item</span>
          </button>

          <button
            onClick={() => setShowFilter((v) => !v)}
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

      {/* ── BUDGET ALERT BANNER ── */}
      {budgetPct >= 100 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-600">Over budget!</p>
            <p className="text-sm text-red-500 mt-0.5">
              Your actual spending ({budgetPct.toFixed(1)}% of budget) has exceeded the initial budget of{" "}
              <span className="font-semibold">{initialBudget.toLocaleString("vi-VN")} VND</span>. Review your expenses immediately.
            </p>
          </div>
        </div>
      )}
      {budgetPct >= 80 && budgetPct < 100 && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-6">
          <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-orange-600">Budget warning</p>
            <p className="text-sm text-orange-500 mt-0.5">
              You've used <span className="font-semibold">{budgetPct.toFixed(1)}%</span> of your budget.{" "}
              Only <span className="font-semibold">{remaining.toLocaleString("vi-VN")} VND</span> remaining — spend carefully.
            </p>
          </div>
        </div>
      )}

      {/* ── ROW 1: 4 SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Initial Budget — editable */}
        <div
          className="border border-gray-100 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition group"
          onClick={() => setShowEditBudget(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400 font-medium">Initial budget</p>
            <Pencil size={12} className="text-gray-300 group-hover:text-indigo-400 transition" />
          </div>
          <p className="text-2xl font-bold text-gray-800 leading-tight tabular-nums">
            {initialBudget.toLocaleString("vi-VN")}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">VND</p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-2">Total estimated</p>
          <p className="text-2xl font-bold text-gray-800 leading-tight tabular-nums">
            {totalEstimated.toLocaleString("vi-VN")}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">VND</p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-2">Total actual</p>
          <p className={`text-2xl font-bold leading-tight tabular-nums ${budgetPct >= 100 ? "text-red-500" : budgetPct >= 80 ? "text-orange-500" : "text-gray-800"}`}>
            {totalActual.toLocaleString("vi-VN")}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">VND</p>
        </div>

        <div className="border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-400 font-medium mb-2">Remaining</p>
          <p className={`text-2xl font-bold leading-tight tabular-nums ${remaining >= 0 ? "text-green-600" : "text-red-500"}`}>
            {remaining >= 0 ? "" : "-"}{Math.abs(remaining).toLocaleString("vi-VN")}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">VND</p>
        </div>
      </div>

      {/* ── ROW 2: PROGRESS + DIFFERENCE ── */}
      <div className="mt-4">
        <BudgetProgressPanel
          totalActual={totalActual}
          totalEstimated={totalEstimated}
          initialBudget={initialBudget}
        />
      </div>

      {/* ── TWO CARDS: CHART + TABLE ── */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 items-start">

        {/* Budget by Category Card */}
        <div className="border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-800 mb-5">Budget by Category</h2>
          <DonutChart data={chartData} />
        </div>

        {/* Budget Items Card */}
        <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {activeFilterCount > 0 && (
            <div className="px-6 pt-4 pb-2">
              <p className="text-xs text-gray-400">
                Showing {filteredItems.length} of {items.length} items
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr style={{ backgroundColor: "oklch(96% 0.025 274)" }}>
                  {["Item", "Category", "Estimated", "Actual", "Payment", ""].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] ${h === "" ? "w-10" : ""}`}
                      style={{ color: "oklch(45.7% 0.24 277.023)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y bg-white" style={{ borderColor: "oklch(0.96 0.015 274)" }}>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                      No budget items match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const diff = item.actual - item.estimated;
                    return (
                      <tr key={item.id} className="transition-all group hover:bg-indigo-50/30">
                        <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap text-sm">{item.name}</td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[item.category] }} />
                            {item.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap tabular-nums">
                          {item.estimated.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap tabular-nums">
                          <span className={diff > 0 ? "text-red-500" : diff < 0 ? "text-green-600" : "text-gray-700"}>
                            {item.actual.toLocaleString("vi-VN")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${item.paid ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
                            {item.paid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <ActionMenu
                            onEdit={() => setEditItem(item)}
                            onDelete={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── FILTER OVERLAY ── */}
      {showFilter && (
        <FilterOverlay
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* ── MODALS ── */}
      {showEditBudget && (
        <EditBudgetModal
          current={initialBudget}
          onClose={() => setShowEditBudget(false)}
          onSave={handleSaveBudget}
        />
      )}
      {showModal && (
        <ItemModal onClose={() => setShowModal(false)} onSave={handleAdd} loading={saving} />
      )}
      {editItem && (
        <ItemModal initial={editItem} onClose={() => setEditItem(null)} onSave={handleSave} loading={saving} />
      )}
    </div>
  );
}