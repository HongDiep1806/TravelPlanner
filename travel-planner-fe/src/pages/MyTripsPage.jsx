import { useState, useEffect } from "react";
import TripCard from "../components/TripCard";
import { Sun, Settings as SettingsIcon, Plus, X } from "lucide-react";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State quản lý form tạo mới
  const [newTrip, setNewTrip] = useState({
    tripName: "",
    budget: "",
  });

  // Hàm lấy danh sách trips
  const fetchTrips = async () => {
    try {
      const res = await fetch("http://localhost:3000/trips");
      console.log("trips: ", res);
      const data = await res.json();

      const demoImages = [
        "https://images.unsplash.com/photo-1528127269322-539801943592?w=500",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500",
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500",
        "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=500",
      ];

      // Map dữ liệu từ API (tripName) sang prop mà TripCard yêu cầu (thường là title)
      const mappedTrips = data.map((trip, index) => ({
        ...trip,
        title: trip.tripName, // Đồng bộ key tripName từ API
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

  // Hàm xử lý gửi dữ liệu lên API
  const handleCreateTrip = async (e) => {
    e.preventDefault();

    const payload = {
      tripName: newTrip.tripName,
      budget: Number(newTrip.budget),
    };

    try {
      const res = await fetch("http://localhost:3000/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewTrip({ tripName: "", budget: "" });
        fetchTrips(); // Tải lại danh sách sau khi thêm thành công
      } else {
        const err = await res.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
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
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
            My Trips
          </h2>
          <p className="text-slate-400 mt-1">
            All your amazing journeys in one place.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-slate-100 rounded-full p-1 shadow-sm">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Sun size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <SettingsIcon size={18} />
            </button>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 text-xs uppercase">
            TR
          </div>
        </div>
      </div>

      {/* Grid Danh sách Trip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col justify-center items-center p-10 bg-white/50 hover:bg-white hover:border-indigo-300 transition-all cursor-pointer group min-h-[350px]"
        >
          <div className="bg-slate-50 group-hover:bg-indigo-50 p-4 rounded-full mb-4 transition-colors">
            <Plus
              className="text-slate-300 group-hover:text-indigo-600"
              size={30}
            />
          </div>
          <span className="text-indigo-600 font-bold text-lg">
            + Create New Trip
          </span>
          <span className="text-sm text-slate-400 mt-2 text-center px-4">
            Start planning your next adventure
          </span>
        </div>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}

        {/* Nút Create New Trip (Dạng Card rỗng) */}
      </div>

      {/* --- CREATE TRIP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-50">
              <h3 className="text-xl font-bold text-slate-900">
                Create New Trip
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTrip} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Trip Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Summer Vacation in Italy"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={newTrip.tripName}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, tripName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Initial Budget (VND)
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 12,000,000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={newTrip.budget}
                  onChange={(e) =>
                    setNewTrip({ ...newTrip, budget: e.target.value })
                  }
                />
              </div>

              {/* Form Actions */}
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
