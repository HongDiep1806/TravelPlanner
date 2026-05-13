import { Pencil, Trash2 } from "lucide-react";
import { INDIGO } from "./packingConstants";
import { PackCheckbox } from "./PackCheckbox";

export function ItemRow({ item, onToggle, onEdit, onRemove }) {
  return (
    <div className="group border-t border-gray-50 first:border-t-0 hover:bg-indigo-50/30 transition-colors">

      {/* Desktop */}
      <div
        className="hidden sm:grid items-center gap-4 px-5 py-4"
        style={{ gridTemplateColumns: "1.25rem 1fr 3rem 7rem 7rem 5rem" }}
      >
        <PackCheckbox checked={item.packed} onChange={() => onToggle(item.id)} />
        <span className={`text-base font-medium transition-colors truncate ${item.packed ? "text-gray-400 line-through" : "text-gray-700"}`}>
          {item.name}
        </span>
        <span className="text-base text-gray-500 text-center">{item.qty}</span>
        <span className="text-base text-gray-400 text-center">{item.required}</span>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg text-center transition-colors
          ${item.packed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
          {item.packed ? "Packed" : "Not Packed"}
        </span>
        <div className="flex items-center gap-1 justify-end opacity-30 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(item)} className="p-2 rounded-lg hover:bg-indigo-100 transition" title="Edit">
            <Pencil size={15} style={{ color: INDIGO }} />
          </button>
          <button onClick={() => onRemove(item.id)} className="p-2 rounded-lg hover:bg-red-100 transition" title="Delete">
            <Trash2 size={15} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex items-center gap-3 px-4 py-3.5">
        <PackCheckbox checked={item.packed} onChange={() => onToggle(item.id)} />
        <div className="flex-1 min-w-0">
          <span className={`block text-sm font-medium transition-colors truncate ${item.packed ? "text-gray-400 line-through" : "text-gray-700"}`}>
            {item.name}
          </span>
          <span className="text-xs text-gray-400 mt-0.5 block">Qty {item.qty} · {item.required}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${item.packed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
          {item.packed ? "✓" : "–"}
        </span>
        <div className="flex items-center gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-indigo-100 transition">
            <Pencil size={14} style={{ color: INDIGO }} />
          </button>
          <button onClick={() => onRemove(item.id)} className="p-1.5 rounded-lg hover:bg-red-100 transition">
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>

    </div>
  );
}
