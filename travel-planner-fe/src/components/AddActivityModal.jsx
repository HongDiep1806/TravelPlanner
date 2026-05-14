import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { API_BASE } from "../config";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  "Transport",
  "Food",
  "Sightseeing",
  "Shopping",
  "Hotel",
  "Other",
];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
const STATUS_OPTIONS = ["Planned", "In Progress", "Done"];

const EMPTY_FORM = {
  title: "",
  location: "",
  date: new Date().toISOString().split("T")[0],
  time: "09:00",
  category: "Sightseeing",
  priority: "Medium",
  status: "Planned",
};

// Handles both create (POST) and edit (PUT) based on activityToEdit prop
const AddActivityModal = ({
  tripId,
  isOpen,
  onClose,
  onRefresh,
  activityToEdit = null,
}) => {
  const isEditMode = Boolean(activityToEdit);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  // Sync form data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(activityToEdit ? { ...activityToEdit } : { ...EMPTY_FORM });
    }
  }, [isOpen, activityToEdit]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isEditMode
      ? `${API_BASE}/itinerary/${tripId}/${activityToEdit.id}`
      : `${API_BASE}/itinerary/${tripId}`;

    try {
      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          activityToEdit
            ? "Activity updated successfully!"
            : "Activity created successfully!",
        );

        onRefresh();
        handleClose();
      } else {
        const msg = await res
          .json()
          .then((d) => d.message)
          .catch(() => `Server error (${res.status})`);
        toast.error(`Failed: ${msg}`);
      }
    } catch {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-[550px] overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-0">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {isEditMode ? "Edit Activity" : "Add New Activity"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Activity Title *
            </label>
            <input
              required
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
              placeholder="e.g. Visit Ba Na Hills"
              {...field("title")}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Location *
            </label>
            <input
              required
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
              placeholder="e.g. Da Nang"
              {...field("location")}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Date *
              </label>
              <input
                type="date"
                required
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold"
                {...field("date")}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Time *
              </label>
              <input
                type="time"
                required
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold"
                {...field("time")}
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Category *
              </label>
              <select
                required
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold"
                {...field("category")}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Priority *
              </label>
              <select
                required
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold"
                {...field("priority")}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Status *
            </label>
            <select
              required
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold"
              {...field("status")}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-10 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Save Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;
