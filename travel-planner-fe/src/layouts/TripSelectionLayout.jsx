import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TripSelectionProvider, useTripSelection } from "../context/TripSelectionContext";
import Sidebar from "../components/Sidebar";
import { Menu, X } from "lucide-react";

function InnerLayout() {
  const { tripId } = useParams();
  const { setSelectedTripId } = useTripSelection();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (tripId) setSelectedTripId(tripId);
  }, [tripId]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* OVERLAY: Lớp phủ mờ khi mở Sidebar trên mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[40] lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR: Luôn nằm trên cùng (z-50) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* MOBILE HEADER: Chứa nút Menu/X để điều khiển Sidebar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-slate-100 sticky top-0 z-[45]">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95"
          >
            {sidebarOpen ? (
              <X size={22} className="text-slate-600" />
            ) : (
              <Menu size={22} className="text-slate-600" />
            )}
          </button>
          
          <div className="font-bold text-indigo-600 text-lg italic tracking-tight">Trip Planner Pro</div>
          
          {/* Spacer giúp Logo nằm chính giữa */}
          <div className="w-10" /> 
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function TripSelectionLayout() {
  return (
    <TripSelectionProvider>
      <InnerLayout />
    </TripSelectionProvider>
  );
}