import { useRef, useEffect } from "react";
import { X, Check } from "lucide-react";
import { PACKING_CATEGORIES, PACKING_CATEGORY_ICON, INDIGO } from "./packingConstants";

function PillGroup({ options, value, onSelect }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5 w-full">
      {options.map(({ value: v, label }) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`flex-1 px-2 py-1.5 rounded-full text-sm font-medium transition-all text-center whitespace-nowrap
            ${value === v
              ? "bg-white text-indigo-600 font-semibold"
              : "text-gray-500 hover:text-gray-700"
            }`}
          style={value === v ? { boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : {}}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function FilterOverlay({ filters, onChange, onApply, onClear, onClose }) {
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
      <div className="fixed inset-0 z-30 bg-black/10" onClick={onClose} />
      <div
        ref={ref}
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
          {/* Category */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Category</p>
            <div className="grid grid-cols-2 gap-2">
              {PACKING_CATEGORIES.map((cat) => {
                const active = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCat(cat)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                      ${active ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span className={`flex-shrink-0 ${active ? "text-indigo-500" : "text-gray-400"}`}>
                      {PACKING_CATEGORY_ICON[cat]}
                    </span>
                    <span className="truncate">{cat}</span>
                    {active && <Check size={12} className="ml-auto flex-shrink-0 text-indigo-500" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Packed Status */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Packed Status</p>
            <PillGroup
              options={[
                { value: "all",      label: "All"        },
                { value: "packed",   label: "Packed"     },
                { value: "unpacked", label: "Not Packed" },
              ]}
              value={filters.status}
              onSelect={(v) => onChange({ ...filters, status: v })}
            />
          </div>

          {/* Priority */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Priority</p>
            <PillGroup
              options={[
                { value: "all",      label: "All"      },
                { value: "Required", label: "Required" },
                { value: "Optional", label: "Optional" },
              ]}
              value={filters.required}
              onSelect={(v) => onChange({ ...filters, required: v })}
            />
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2.5">Quantity</p>
            <div className="flex items-center gap-2">
              <input
                type="number" min={1} placeholder="Min"
                value={filters.qtyMin}
                onChange={(e) => onChange({ ...filters, qtyMin: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
              <span className="text-gray-400 text-sm">–</span>
              <input
                type="number" min={1} placeholder="Max"
                value={filters.qtyMax}
                onChange={(e) => onChange({ ...filters, qtyMax: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>
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
