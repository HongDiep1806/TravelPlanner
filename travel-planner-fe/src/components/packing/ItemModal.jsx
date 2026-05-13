import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { PACKING_CATEGORIES, INDIGO } from "./packingConstants";

export function ItemModal({ initial, onClose, onSave, loading }) {
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
                {PACKING_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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
            disabled={loading}
            onClick={() => { if (form.name.trim()) onSave(form); }}
            style={{ backgroundColor: INDIGO }}
            className="flex-1 text-white rounded-xl py-3 text-base font-semibold hover:opacity-90 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {initial ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
