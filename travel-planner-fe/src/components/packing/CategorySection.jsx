import { INDIGO, PACKING_CATEGORY_ICON } from "./packingConstants";
import { ItemRow } from "./ItemRow";

export function CategorySection({ category, items, onToggle, onEdit, onRemove }) {
  const packedInCat = items.filter((i) => i.packed).length;
  const pct = items.length ? Math.round((packedInCat / items.length) * 100) : 0;

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-sm"
      style={{ borderColor: "oklch(93% 0.03 274)" }}
    >
      {/* Category header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 gap-2"
        style={{ backgroundColor: "oklch(96% 0.025 274)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0" style={{ color: INDIGO }}>{PACKING_CATEGORY_ICON[category]}</span>
          <span className="text-base font-bold text-gray-800 truncate">{category}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
            style={{ backgroundColor: "oklch(87% 0.065 274.039)", color: "oklch(45.7% 0.24 277.023)" }}
          >
            {packedInCat}/{items.length} packed
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onToggle={onToggle}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
