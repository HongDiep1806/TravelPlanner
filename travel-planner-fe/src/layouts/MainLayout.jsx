import { Outlet } from "react-router-dom";
import { Menu, LayoutGrid, Plus, Settings, Info } from "lucide-react";
import { useState } from "react";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-white flex font-sans overflow-hidden">
      {" "}
      {/* 1. MOBILE HEADER - Nút Menu nằm bên TRÁI */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center z-40">
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
      {/* 2. SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-[280px]
          bg-white border-r border-slate-100
          px-8 py-10
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO TRONG SIDEBAR */}
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Plus className="text-white w-5 h-5 rotate-45" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Trip Planner Pro
          </h1>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-3">
          <button className="w-full flex items-center gap-4 bg-indigo-50 text-indigo-700 rounded-2xl px-5 py-4 font-bold transition">
            <LayoutGrid size={20} /> My Trips
          </button>
          {/* <button className="w-full flex items-center gap-4 bg-indigo-600 text-white rounded-2xl px-5 py-4 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
            <Plus size={20} /> New Trip
          </button> */}
          <button className="w-full flex items-center gap-4 text-slate-400 rounded-2xl px-5 py-4 font-medium hover:bg-slate-50 transition">
            <Settings size={20} /> Settings
          </button>
          <button className="w-full flex items-center gap-4 text-slate-400 rounded-2xl px-5 py-4 font-medium hover:bg-slate-50 transition">
            <Info size={20} /> About
          </button>

          <div className="pt-10 space-y-2"></div>
        </nav>

        {/* USER FOOTER */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs border-2 border-white shadow-sm">
            TR
          </div>
          <span className="text-sm font-semibold text-slate-500">
            Hello, Traveler!
          </span>
        </div>
      </aside>
      {/* 3. MOBILE OVERLAY - Chạm vào đây để đóng Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* 4. CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 mt-16 lg:mt-0">
        <main className="flex-1 w-full p-8 lg:p-12 pb-24 overflow-y-auto bg-white">
          <Outlet />
          <div className="h-20 w-full clear-both" />
        </main>
      </div>
    </div>
  );
}
