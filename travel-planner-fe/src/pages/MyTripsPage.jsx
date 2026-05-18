import { useState, useEffect } from "react";
import TripCard from "../components/TripCard";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast"; // 1. Import toast

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTrip, setNewTrip] = useState({
    tripName: "",
    budget: "",
  });

  const fetchTrips = async () => {
    try {
      const res = await fetch("http://localhost:3000/trips");
      const data = await res.json();
      const demoImages = [
        "https://images.unsplash.com/photo-1528127269322-539801943592?w=500",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500",
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500",
      ];
      const mappedTrips = data.map((trip, index) => ({
        ...trip,
        title: trip.tripName,
        image: trip.image || demoImages[index % demoImages.length],
        daysLeft: trip.daysLeft || 0,
        progress: trip.progress || 0,
      }));
      setTrips(mappedTrips);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // 2. Cập nhật hàm xử lý tạo Trip với Toast Alert
  const handleCreateTrip = async (e) => {
    e.preventDefault();

    // BƯỚC VALIDATION: Giống bên Itinerary
    if (!newTrip.tripName.trim()) {
      toast.error("Please enter a trip name!"); // Hiện thông báo lỗi
      return; // Dừng lại không fetch API
    }
    
    if (!newTrip.budget || Number(newTrip.budget) <= 0) {
      toast.error("Please enter a valid budget!"); // Hiện thông báo lỗi
      return;
    }

    const payload = {
      tripName: newTrip.tripName,
      budget: Number(newTrip.budget),
    };

    try {
      const res = await fetch("http://localhost:3000/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("New trip created successfully! ✈️"); // Thông báo thành công
        setIsModalOpen(false);
        setNewTrip({ tripName: "", budget: "" });
        fetchTrips(); 
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      toast.error("Failed to connect to server!");
      console.error("Lỗi khi tạo chuyến đi:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 font-medium italic">
        Loading your amazing journeys...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">My Trips</h2>
          <p className="text-slate-400 mt-1">All your amazing journeys in one place.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] text-sm"
        >
          <Plus size={16} />
          <span>Create New Trip</span>
        </button>
      </div>

      {/* Grid Danh sách Trip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>

      {/* --- CREATE TRIP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Create New Trip</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bỏ thuộc tính 'required' của HTML để mình tự xử lý qua Toast cho đẹp */}
            <form onSubmit={handleCreateTrip} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Trip Name</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Vacation in Italy"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={newTrip.tripName}
                  onChange={(e) => setNewTrip({ ...newTrip, tripName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Initial Budget (VND)</label>
                <input
                  type="number"
                  placeholder="e.g. 12,000,000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={newTrip.budget}
                  onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}