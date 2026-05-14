import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Plus, Search, X, SlidersHorizontal, Loader2 } from "lucide-react";

import {
  INDIGO,
  PACKING_CATEGORIES,
  DEFAULT_FILTERS,
  STATUS_PILLS,
  PRIORITY_PILLS,
} from "../components/packing/packingConstants";
import { usePackingItems } from "../hooks/usePackingItems";
import { FilterOverlay } from "../components/packing/FilterOverlay";
import { ItemModal } from "../components/packing/ItemModal";
import { CategorySection } from "../components/packing/CategorySection";
import { ProgressBar } from "../components/packing/ProgressBar";
import toast from "react-hot-toast";

export default function PackingPage() {
  const { tripId } = useParams();
  const { items, loading, apiError, mutating, toggle, remove, add, save } =
    usePackingItems(tripId);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [pendingFilters, setPendingFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  // ── Quick pills ───────────────────────────────────────────────────────────
  const setQuickStatus = (v) => {
    const next = { ...appliedFilters, status: v };
    setAppliedFilters(next);
    setPendingFilters(next);
  };
  const setQuickPriority = (v) => {
    const next = { ...appliedFilters, required: v };
    setAppliedFilters(next);
    setPendingFilters(next);
  };

  const handleApply = () => setAppliedFilters(pendingFilters);
  const handleClear = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (appliedFilters.categories.length) n++;
    if (appliedFilters.status !== "all") n++;
    if (appliedFilters.required !== "all") n++;
    if (appliedFilters.qtyMin !== "" || appliedFilters.qtyMax !== "") n++;
    return n;
  }, [appliedFilters]);

  // ── Derived list ──────────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      items.filter((i) => {
        if (
          appliedFilters.categories.length &&
          !appliedFilters.categories.includes(i.category)
        )
          return false;
        if (appliedFilters.status === "packed" && !i.packed) return false;
        if (appliedFilters.status === "unpacked" && i.packed) return false;
        if (
          appliedFilters.required !== "all" &&
          i.required !== appliedFilters.required
        )
          return false;
        if (
          appliedFilters.qtyMin !== "" &&
          i.qty < Number(appliedFilters.qtyMin)
        )
          return false;
        if (
          appliedFilters.qtyMax !== "" &&
          i.qty > Number(appliedFilters.qtyMax)
        )
          return false;
        if (search && !i.name.toLowerCase().includes(search.toLowerCase()))
          return false;
        return true;
      }),
    [items, appliedFilters, search],
  );

  const grouped = useMemo(() => {
    const map = {};
    PACKING_CATEGORIES.forEach((cat) => {
      // ← duyệt theo CATEGORIES trước
      const catItems = filtered.filter((i) => i.category === cat);
      if (catItems.length > 0) map[cat] = catItems;
    });
    return map;
  }, [filtered]);

  const packedCount = items.filter((i) => i.packed).length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = async (form) => {
    const ok = await add(form);
    if (ok) {
      setShowModal(false);
      toast.success("Item added successfully!");
    } else {
      toast.error("Failed to add item.");
    }
  };

  const handleSave = async (form) => {
    const ok = await save(editItem.id, form);
    if (ok) {
      setEditItem(null);
      toast.success("Item updated successfully!");
    } else {
      toast.error("Failed to update item.");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 min-h-full shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Packing List</h1>
          <p className="text-base font-semibold text-gray-500 mt-2">
            Manage items you need to bring.
          </p>
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
            onClick={() => {
              setPendingFilters(appliedFilters);
              setShowFilter((v) => !v);
            }}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold border transition shadow-sm
              ${
                showFilter || activeFilterCount > 0
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

      {/* Quick pill groups + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {STATUS_PILLS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setQuickStatus(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${
                    appliedFilters.status === value
                      ? "bg-white text-indigo-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                style={
                  appliedFilters.status === value
                    ? { boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-5 bg-gray-200" />

          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-0.5">
            {PRIORITY_PILLS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setQuickPriority(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${
                    appliedFilters.required === value
                      ? "bg-white text-indigo-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                style={
                  appliedFilters.required === value
                    ? { boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }
                    : {}
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative sm:ml-auto">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-66 pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar packed={packedCount} total={items.length} />

      {/* Loading / Error / List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2
            size={24}
            className="animate-spin"
            style={{ color: INDIGO }}
          />
          <span className="text-base font-medium">Loading packing list…</span>
        </div>
      ) : apiError ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
          <p className="text-base font-semibold">Failed to load data</p>
          <p className="text-sm text-gray-400">{apiError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold border border-red-200 text-red-400 hover:bg-red-50 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-base">
              No items match your filter.
            </div>
          ) : (
            Object.entries(grouped).map(([category, catItems]) => (
              <CategorySection
                key={category}
                category={category}
                items={catItems}
                onToggle={toggle}
                onEdit={setEditItem}
                onRemove={async (id) => {
                  const ok = await remove(id);
                  if (ok) toast.success("Item deleted successfully!");
                  else toast.error("Failed to delete item.");
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Filter overlay */}
      {showFilter && (
        <FilterOverlay
          filters={pendingFilters}
          onChange={setPendingFilters}
          onApply={handleApply}
          onClear={handleClear}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* Modals */}
      {showModal && (
        <ItemModal
          onClose={() => setShowModal(false)}
          onSave={handleAdd}
          loading={mutating}
        />
      )}
      {editItem && (
        <ItemModal
          initial={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSave}
          loading={mutating}
        />
      )}
    </div>
  );
}
