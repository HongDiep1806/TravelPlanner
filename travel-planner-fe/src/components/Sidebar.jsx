import {
  LayoutDashboard,
  MapPinned,
  Backpack,
  Wallet,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (!tripId) return;

    const fetchTrip = async () => {
      try {
        const res = await fetch(`http://localhost:3000/trips/${tripId}`);
        if (!res.ok) throw new Error("Failed to fetch trip");
        const data = await res.json();
        setTrip(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrip();
  }, [tripId]);

  const menus = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: `/trip/${tripId}/dashboard` },
    { title: "Itinerary", icon: <MapPinned size={20} />, path: `/trip/${tripId}/itinerary` },
    { title: "Packing List", icon: <Backpack size={20} />, path: `/trip/${tripId}/packing` },
    { title: "Budget", icon: <Wallet size={20} />, path: `/trip/${tripId}/budget` },
    { title: "Settings", icon: <Settings size={20} />, path: `/trip/${tripId}/settings` },
  ];

  const tripDate = trip?.itinerary?.length
    ? `${trip.itinerary[0].date} - ${trip.itinerary[trip.itinerary.length - 1].date}`
    : "No dates set";

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-[50] h-screen w-[280px] bg-white border-r border-slate-100 shadow-2xl lg:shadow-none flex flex-col transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* SIDEBAR HEADER: Info chuyến đi */}
      <div className="h-16 lg:h-[90px] border-b border-slate-50 flex items-center px-6">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-indigo-100 shadow-lg flex-shrink-0">
            {trip?.tripName?.[0] ?? "?"}
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-slate-800 text-sm lg:text-base truncate">
              {trip?.tripName ?? "Loading..."}
            </h1>
            <p className="text-[10px] lg:text-xs text-slate-400 truncate uppercase font-bold tracking-wider">
              {tripDate}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={() => setSidebarOpen(false)} // Click xong tự đóng Sidebar trên mobile
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm lg:text-base ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* BOTTOM BUTTON: Thoát */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-colors active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Exit Trip</span>
        </button>
      </div>
    </aside>
  );
}