import { Outlet } from "react-router-dom";
<<<<<<< HEAD
import { Menu } from "lucide-react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
=======
import { Menu, LayoutGrid, Plus, Settings, Info } from "lucide-react";
import { useState } from "react";
>>>>>>> origin/dev

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#f5f7fb]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* RIGHT SIDE */}
        <div
          className="
            flex-1
            flex
            flex-col
            min-w-0
          "
        >
          {/* MOBILE TOPBAR */}
          <header
            className="lg:hidden sticky top-0 z-30 h-16 bg-white/90 backdrop-blur border-b
              flex items-center px-4"
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className=" p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <Menu size={24} />
            </button>

            <h1 className="ml-3 font-semibold text-gray-800">
              Travel Planner
            </h1>
          </header>

          {/* CONTENT */}
          <main
            className="
              flex-1
              w-full
              overflow-x-hidden
              p-3
              sm:p-4
              md:p-5
              lg:p-6
            "
          >
            <div
              className="
                w-full
                max-w-full
              "
            >
              <Outlet />
            </div>
          </main>
        </div>
=======
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* SIDEBAR */}
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
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl">
             <Plus className="text-white w-5 h-5 rotate-45" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Trip Planner Pro</h1>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-3">
          <button className="w-full flex items-center gap-4 bg-indigo-50 text-indigo-700 rounded-2xl px-5 py-4 font-bold transition">
            <LayoutGrid size={20} /> My Trips
          </button>
          <button className="w-full flex items-center gap-4 bg-indigo-600 text-white rounded-2xl px-5 py-4 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
            <Plus size={20} /> New Trip
          </button>

          <div className="pt-10 space-y-2">
            <button className="w-full flex items-center gap-4 text-slate-400 rounded-2xl px-5 py-4 font-medium hover:bg-slate-50 transition">
              <Settings size={20} /> Settings
            </button>
            <button className="w-full flex items-center gap-4 text-slate-400 rounded-2xl px-5 py-4 font-medium hover:bg-slate-50 transition">
              <Info size={20} /> About
            </button>
          </div>
        </nav>

        {/* USER FOOTER (Của Sidebar) */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs border-2 border-white shadow-sm">TR</div>
           <span className="text-sm font-semibold text-slate-500">Hello, Traveler!</span>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 w-full p-8 lg:p-12 overflow-y-auto">
          <Outlet />
        </main>
>>>>>>> origin/dev
      </div>
    </div>
  );
}