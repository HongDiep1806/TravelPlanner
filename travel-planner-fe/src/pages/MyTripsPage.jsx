import { useState, useEffect } from "react";
import TripCard from "../components/TripCard";
import { Sun, Settings as SettingsIcon, Plus } from "lucide-react";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:3000/trips");
        const data = await res.json();

        const demoImages = [
          "https://images.unsplash.com/photo-1528127269322-539801943592?w=500",
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500",
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500",
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500",
          "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=500",
        ];

        const tripsWithImages = data.map((trip, index) => ({
          ...trip,
          image: trip.image || demoImages[index % demoImages.length],
          daysLeft: trip.daysLeft || 0,
          progress: trip.progress || 0,
        }));

        setTrips(tripsWithImages);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 font-medium">
        Loading your amazing journeys...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
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
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 text-xs">
            TR
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}

        <div className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col justify-center items-center p-10 bg-white/50 hover:bg-white hover:border-indigo-300 transition-all cursor-pointer group min-h-[350px]">
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
      </div>
    </div>
  );
}
