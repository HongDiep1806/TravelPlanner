import React, { useState } from "react";
import { X } from "lucide-react";

const AddActivityModal = ({ tripId, isOpen, onClose, onRefresh }) => {
  const initialForm = {
    title: "",
    location: "",
    date: "",
    time: "",
    category: "Sightseeing", 
    priority: "Medium",
    status: "Planned",
  };

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  
  const today = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(initialForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/itinerary/${tripId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        onRefresh();
        handleClose(); 
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

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
            Add New Activity
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Activity Title *</label>
            <input
              required
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
              placeholder="e.g. Visit Marble Mountains"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Location *</label>
            <input
              required
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
              placeholder="e.g. Da Nang"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date *</label>
              <input
                type="date"
                required
                min={today} 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Time *</label>
              <input
                type="time"
                required
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-slate-800 font-bold"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category *</label>
              <select
                required
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Food">Food</option>
                <option value="Sightseeing">Sightseeing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority *</label>
              <select
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status *</label>
            <select
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 text-slate-800 font-bold"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
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
              {loading ? "Saving..." : "Save Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityModal;