import { API_BASE } from "../components/packing/packingConstants";

// ─── Map API fields → UI fields ───────────────────────────────────────────────
// API:  { id, name, category, quantity, requiredStatus, packedStatus }
// UI:   { id, name, category, qty,      required,       packed       }
export function fromApi(item) {
  return {
    id:       item.id,
    name:     item.name,
    category: item.category,
    qty:      item.quantity,
    required: item.requiredStatus,
    packed:   item.packedStatus === "Packed",
  };
}

export function toApi(uiItem) {
  return {
    name:           uiItem.name,
    category:       uiItem.category,
    quantity:       uiItem.qty,
    requiredStatus: uiItem.required,
    packedStatus:   uiItem.packed ? "Packed" : "Not Packed",
  };
}

// ─── API calls ────────────────────────────────────────────────────────────────
export async function fetchPackingList(tripId) {
  const res = await fetch(`${API_BASE}/packing/${tripId}`);
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export async function createItem(tripId, apiBody) {
  const res = await fetch(`${API_BASE}/packing/${tripId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiBody),
  });
  if (!res.ok) throw new Error(`Add failed: ${res.status}`);
  return res.json();
}

export async function updateItem(tripId, id, apiBody) {
  const res = await fetch(`${API_BASE}/packing/${tripId}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apiBody),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}

export async function deleteItem(tripId, id) {
  const res = await fetch(`${API_BASE}/packing/${tripId}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}
