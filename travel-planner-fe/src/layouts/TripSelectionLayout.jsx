import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TripSelectionProvider, useTripSelection } from "../context/TripSelectionContext";
import Sidebar from "../components/Sidebar";
import { Menu, X, Plus } from "lucide-react";

function InnerLayout() {
  const { tripId } = useParams();
  const { setSelectedTripId } = useTripSelection();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (tripId) setSelectedTripId(tripId);
  }, [tripId]);

  return (
    // 1. Root vẫn là h-screen và nền xám nhạt #F8FAFC
    <div className="h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* MOBILE HEADER - Đã đồng bộ 100% Logo & Text */}
        <header className="lg:hidden flex-shrink-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center z-40">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors mr-2"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Plus className="text-white w-4 h-4 rotate-45" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">
              Trip Planner Pro
            </span>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        {/* KHÔNG để bg-white ở đây để lộ nền xám của cha, tạo thành cái viền ngoài khung */}
        <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Nội dung Dashboard/Itinerary của bạn sẽ nằm trong này */}
            <Outlet />
            
            {/* Khoảng đệm dưới cùng để không bị khuất khi scroll */}
            <div className="h-20 w-full" />
          </div>
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