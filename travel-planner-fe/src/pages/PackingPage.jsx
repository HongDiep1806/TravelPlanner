import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, X, Check, Search,
  Shirt, FileText, Zap, Pill, User, MoreHorizontal, Pencil, Trash2,
  SlidersHorizontal,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = ["Clothes", "Documents", "Electronics", "Medicine", "Personal", "Other"];

const CATEGORY_ICON = {
  Clothes:     <Shirt          size={18} />,
  Documents:   <FileText       size={18} />,
  Electronics: <Zap            size={18} />,
  Medicine:    <Pill           size={18} />,
  Personal:    <User           size={18} />,
  Other:       <MoreHorizontal size={18} />,
};

const INITIAL_ITEMS = [
  { id: 1,  name: "Passport / ID card", category: "Documents",    qty: 1, required: "Required", packed: true  },
  { id: 2,  name: "Boarding pass",      category: "Documents",    qty: 2, required: "Required", packed: true  },
  { id: 3,  name: "Travel insurance",   category: "Documents",    qty: 1, required: "Optional", packed: false },
  { id: 4,  name: "T-shirt",            category: "Clothes",      qty: 4, required: "Required", packed: true  },
  { id: 5,  name: "Shorts",             category: "Clothes",      qty: 2, required: "Required", packed: false },
  { id: 6,  name: "Jacket",             category: "Clothes",      qty: 1, required: "Optional", packed: false },
  { id: 7,  name: "Charger",            category: "Electronics",  qty: 2, required: "Required", packed: true  },
  { id: 8,  name: "Power bank",         category: "Electronics",  qty: 1, required: "Optional", packed: true  },
  { id: 9,  name: "Headphones",         category: "Electronics",  qty: 1, required: "Optional", packed: false },
  { id: 10, name: "Paracetamol",        category: "Medicine",     qty: 1, required: "Required", packed: true  },
  { id: 11, name: "Allergy medicine",   category: "Medicine",     qty: 1, required: "Optional", packed: false },
  { id: 12, name: "Sunscreen",          category: "Personal",     qty: 2, required: "Required", packed: true  },
  { id: 13, name: "Toiletry kit",       category: "Personal",     qty: 1, required: "Required", packed: true  },
  { id: 14, name: "Toothbrush",         category: "Personal",     qty: 1, required: "Required", packed: true  },
  { id: 15, name: "Umbrella",           category: "Other",        qty: 1, required: "Optional", packed: false },
  { id: 16, name: "Reusable bag",       category: "Other",        qty: 2, required: "Optional", packed: true  },
  { id: 17, name: "Notebook",           category: "Other",        qty: 1, required: "Optional", packed: false },
  { id: 18, name: "Snacks",             category: "Other",        qty: 3, required: "Optional", packed: true  },
];

const INDIGO = "oklch(51.1% 0.262 276.966)";

// ─── Filter Overlay ───────────────────────────────────────────────────────────
function FilterOverlay({ filters, onChange, onApply, onClear, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggleCat = (cat) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const hasActive =
    filters.categories.length > 0 ||
    filters.status !== "all" ||
    filters.required !== "all" ||
    filters.qtyMin !== "" ||
    filters.qtyMax !== "";

  return (
    <>
      {/* dim backdrop */}
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />

      {/* panel */}
      <div
        ref={ref}
        className="fixed right-4 sm:right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 w-[calc(100vw-2rem)] sm:w-72 flex flex-col"
        style={{ top: "50%", transform: "translateY(-50%)", maxHeight: "calc(100vh - 80px)" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <span className="text-base font-bold text-gray-800">Filters</span>
          <div className="flex items-center gap-3">
            {hasActive && (
              <button
                onClick={onClear}
                className="text-sm font-semibold"
                style={{ color: INDIGO }}
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          
          {/* Category */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Category</p>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => {
                const active = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCat(cat)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                      ${active ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className={active ? "text-indigo-500" : "text-gray-400"}>
                      {CATEGORY_ICON[cat]}
                    </span>
                    {cat}
                    {active && (
                      <Check size={13} className="ml-auto text-indigo-500" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Packed Status</p>
            <div className="flex flex-col gap-1.5">
              {[
                { value: "all",    label: "All" },
                { value: "packed", label: "Packed" },
                { value: "unpacked", label: "Not Packed" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...filters, status: value })}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${filters.status === value ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {label}
                  {filters.status === value && <Check size={13} strokeWidth={3} className="text-indigo-500" />}
                </button>
              ))}
            </div>
          </div>

           {/* Required */}
           <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Priority</p>
            <div className="flex flex-col gap-1.5">
              {[
                { value: "all",      label: "All" },
                { value: "Required", label: "Required" },
                { value: "Optional", label: "Optional" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onChange({ ...filters, required: value })}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all
                    ${filters.required === value ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {label}
                  {filters.required === value && <Check size={13} strokeWidth={3} className="text-indigo-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity range */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Quantity</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                placeholder="Min"
                value={filters.qtyMin}
                onChange={(e) => onChange({ ...filters, qtyMin: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
              <span className="text-gray-400 text-sm">–</span>
              <input
                type="number"
                min={1}
                placeholder="Max"
                value={filters.qtyMax}
                onChange={(e) => onChange({ ...filters, qtyMax: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>
          </div>
        </div>

        {/* footer */}
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

// ─── Modal ────────────────────────────────────────────────────────────────────
function ItemModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial
      ? { name: initial.name, category: initial.category, qty: initial.qty, required: initial.required, packed: initial.packed }
      : { name: "", category: "Clothes", qty: 1, required: "Required", packed: false }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">{initial ? "Edit Item" : "Add New Item"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Item Name</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              placeholder="e.g. Passport"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Quantity</label>
              <input
                type="number" min={1}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={form.qty}
                onChange={(e) => set("qty", Math.max(1, Number(e.target.value)))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Required</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={form.required}
                onChange={(e) => set("required", e.target.value)}
              >
                <option>Required</option>
                <option>Optional</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                value={form.packed ? "Packed" : "Not Packed"}
                onChange={(e) => set("packed", e.target.value === "Packed")}
              >
                <option>Not Packed</option>
                <option>Packed</option>
              </select>
            </div>
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
            onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }}
            style={{ backgroundColor: INDIGO }}
            className="flex-1 text-white rounded-xl py-3 text-base font-semibold hover:opacity-90 transition shadow-md"
          >
            {initial ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
function PackCheckbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      style={checked ? { backgroundColor: INDIGO, borderColor: INDIGO } : {}}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
        ${!checked ? "border-gray-300 hover:border-indigo-400 bg-white" : ""}`}
    >
      {checked && <Check size={11} className="text-white" strokeWidth={3} />}
    </button>
  );
}

// ─── Default filter state ─────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  categories: [],
  status: "all",
  required: "all",
  qtyMin: "",
  qtyMax: "",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PackingPage() {
  const [items, setItems]             = useState(INITIAL_ITEMS);
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editItem, setEditItem]       = useState(null);
  const [showFilter, setShowFilter]   = useState(false);

  // quick pill groups — independent filters
  const [quickStatus,   setQuickStatus]   = useState("all"); // "all" | "packed" | "unpacked"
  const [quickPriority, setQuickPriority] = useState("all"); // "all" | "required" | "optional"

  // detailed filter state (applied when user clicks Apply)
  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  const handleApply = () => setAppliedFilters(pendingFilters);
  const handleClear = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  // count active advanced filters
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (appliedFilters.categories.length) n++;
    if (appliedFilters.status !== "all") n++;
    if (appliedFilters.required !== "all") n++;
    if (appliedFilters.qtyMin !== "" || appliedFilters.qtyMax !== "") n++;
    return n;
  }, [appliedFilters]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => items.filter((i) => {
    // quick pill groups
    if (quickStatus   === "packed"   && !i.packed)               return false;
    if (quickStatus   === "unpacked" &&  i.packed)               return false;
    if (quickPriority === "required" && i.required !== "Required") return false;
    if (quickPriority === "optional" && i.required !== "Optional") return false;

    // advanced filters
    if (appliedFilters.categories.length && !appliedFilters.categories.includes(i.category)) return false;
    if (appliedFilters.status === "packed"   && !i.packed)  return false;
    if (appliedFilters.status === "unpacked" &&  i.packed)  return false;
    if (appliedFilters.required !== "all" && i.required !== appliedFilters.required) return false;
    if (appliedFilters.qtyMin !== "" && i.qty < Number(appliedFilters.qtyMin)) return false;
    if (appliedFilters.qtyMax !== "" && i.qty > Number(appliedFilters.qtyMax)) return false;

    // search
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, quickStatus, quickPriority, appliedFilters, search]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((item) => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [filtered]);

  const packedCount = items.filter((i) => i.packed).length;
  const total       = items.length;
  const pct         = total ? Math.round((packedCount / total) * 100) : 0;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggle = (id) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, packed: !i.packed } : i));
  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const add    = (form) => setItems((prev) => [...prev, { ...form, id: Date.now() }]);
  const save   = (form) => {
    setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...form, id: i.id } : i));
    setEditItem(null);
  };

  const STATUS_PILLS   = [
    { value: "all",      label: "All"       },
    { value: "packed",   label: "Packed"    },
    { value: "unpacked", label: "Not Packed"},
  ];
  const PRIORITY_PILLS = [
    { value: "all",      label: "All"      },
    { value: "required", label: "Required" },
    { value: "optional", label: "Optional" },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 min-h-full shadow-sm">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Packing List</h1>
          <p className="text-base font-semibold text-gray-500 mt-2">Manage items you need to bring.</p>
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

          {/* Filter button */}
          <button
            onClick={() => {
              setPendingFilters(appliedFilters);
              setShowFilter((v) => !v);
            }}
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

      {/* ── QUICK PILL GROUPS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-8 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status group */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {STATUS_PILLS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setQuickStatus(value)}
                className={`px-5 py-2 rounded-full text-base font-medium transition-all
                  ${quickStatus === value
                    ? "bg-white text-indigo-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                style={quickStatus === value ? { boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : {}}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Divider — hidden on mobile */}
          <div className="hidden sm:block w-px h-6 bg-gray-200" />

          {/* Priority group */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {PRIORITY_PILLS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setQuickPriority(value)}
                className={`px-5 py-2 rounded-full text-base font-medium transition-all
                  ${quickPriority === value
                    ? "bg-white text-indigo-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                style={quickPriority === value ? { boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search — full width on mobile, auto on desktop */}
        <div className="relative sm:ml-auto">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 pl-11 pr-9 py-2.5 border border-gray-200 rounded-xl text-base text-gray-700 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── PROGRESS ── */}
      {/* FIX 1: Stack vertically on mobile so text is always left-aligned and never wraps awkwardly */}
      <div className="bg-gray-50 rounded-2xl px-6 py-5 mb-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-1">
          <span className="text-base font-bold text-gray-700">Packing Progress</span>
          {/* On mobile: left-aligned below the label */}
          <span className="text-sm sm:text-base text-gray-500">
            <span className="font-bold text-green-600">{packedCount}</span>
            {" / "}{total} items packed
            <span className="ml-1.5 text-gray-400">({pct}%)</span>
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3.5 overflow-hidden">
          <div
            className="h-3.5 rounded-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ── GROUPED LIST ── */}
      <div className="space-y-8">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-base">No items match your filter.</div>
        ) : (
          Object.entries(grouped).map(([category, catItems]) => {
            const packedInCat = catItems.filter((i) => i.packed).length;
            return (
              <div
                key={category}
                className="rounded-2xl border overflow-hidden shadow-sm"
                style={{ borderColor: "oklch(93% 0.03 274)" }}
              >
                {/* Category header */}
                {/* FIX 2: Badge uses whitespace-nowrap so "2/3 packed" never line-breaks */}
                <div
                  className="flex items-center justify-between px-5 py-3.5 gap-2"
                  style={{ backgroundColor: "oklch(96% 0.025 274)" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0" style={{ color: INDIGO }}>{CATEGORY_ICON[category]}</span>
                    <span className="text-base font-bold text-gray-800 truncate">{category}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
                      style={{ backgroundColor: "oklch(87% 0.065 274.039)", color: "oklch(45.7% 0.24 277.023)" }}
                    >
                      {packedInCat}/{catItems.length} packed
                    </span>
                  </div>
                  {/* Mini progress bar: desktop only */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
                        style={{ width: `${catItems.length ? (packedInCat / catItems.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {catItems.length ? Math.round((packedInCat / catItems.length) * 100) : 0}%
                    </span>
                  </div>
                </div>

                {/* Item rows */}
                <div className="bg-white">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="group border-t border-gray-50 first:border-t-0 hover:bg-indigo-50/30 transition-colors"
                    >
                      {/* Desktop layout */}
                      <div
                        className="hidden sm:grid items-center gap-4 px-5 py-4"
                        style={{ gridTemplateColumns: "1.25rem 1fr 3rem 7rem 7rem 5rem" }}
                      >
                        <PackCheckbox checked={item.packed} onChange={() => toggle(item.id)} />
                        <span className={`text-base font-medium transition-colors truncate
                          ${item.packed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                          {item.name}
                        </span>
                        <span className="text-base text-gray-500 text-center">{item.qty}</span>
                        <span className="text-base text-gray-400 text-center">{item.required}</span>
                        <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg text-center transition-colors
                          ${item.packed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                          {item.packed ? "Packed" : "Not Packed"}
                        </span>
                        <div className="flex items-center gap-1 justify-end opacity-30 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditItem(item)} className="p-2 rounded-lg hover:bg-indigo-100 transition" title="Edit">
                            <Pencil size={15} style={{ color: INDIGO }} />
                          </button>
                          <button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-red-100 transition" title="Delete">
                            <Trash2 size={15} className="text-red-400" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="sm:hidden flex items-center gap-3 px-4 py-3.5">
                        <PackCheckbox checked={item.packed} onChange={() => toggle(item.id)} />
                        <div className="flex-1 min-w-0">
                          <span className={`block text-sm font-medium transition-colors truncate
                            ${item.packed ? "text-gray-400 line-through" : "text-gray-700"}`}>
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5 block">
                            Qty {item.qty} · {item.required}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0
                          ${item.packed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                          {item.packed ? "✓" : "–"}
                        </span>
                        <div className="flex items-center gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => setEditItem(item)} className="p-1.5 rounded-lg hover:bg-indigo-100 transition">
                            <Pencil size={14} style={{ color: INDIGO }} />
                          </button>
                          <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg hover:bg-red-100 transition">
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

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
      {showModal && <ItemModal onClose={() => setShowModal(false)} onSave={add} />}
      {editItem  && <ItemModal initial={editItem} onClose={() => setEditItem(null)} onSave={save} />}
    </div>
  );
}