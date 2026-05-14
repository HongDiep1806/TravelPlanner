import { useState, useEffect } from "react";
import {
  fromApi, toApi,
  fetchPackingList, createItem, updateItem, deleteItem,
} from "../services/packingApi";

export function usePackingItems(tripId) {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [apiError, setApiError] = useState(null);
  const [mutating, setMutating] = useState(false);

  // ── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setApiError(null);

    fetchPackingList(tripId)
      .then((data) => {
        if (!cancelled) {
          setItems(data.map(fromApi));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setApiError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [tripId]);

  // ── Toggle packed ─────────────────────────────────────────────────────────
  const toggle = async (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setItems((prev) => prev.map((i) => i.id === id ? { ...i, packed: !i.packed } : i));

    try {
      await updateItem(tripId, id, toApi({ ...item, packed: !item.packed }));
    } catch (err) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, packed: item.packed } : i));
      alert(`Error: ${err.message}`);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const remove = async (id) => {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      await deleteItem(tripId, id);
      return true;
    } catch (err) {
      setItems(snapshot);
      return false;
    }
  };

  // ── Add ───────────────────────────────────────────────────────────────────
  const add = async (form) => {
    setMutating(true);
    try {
      const json = await createItem(tripId, toApi(form));
      setItems((prev) => [...prev, fromApi(json.data)]);
      return true;
    } catch (err) {
      alert(`Error: ${err.message}`);
      return false;
    } finally {
      setMutating(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const save = async (id, form) => {
    setMutating(true);
    try {
      const updated = await updateItem(tripId, id, toApi(form));
      setItems((prev) => prev.map((i) => i.id === id ? fromApi(updated) : i));
      return true;
    } catch (err) {
      alert(`Error: ${err.message}`);
      return false;
    } finally {
      setMutating(false);
    }
  };

  return { items, loading, apiError, mutating, toggle, remove, add, save };
}