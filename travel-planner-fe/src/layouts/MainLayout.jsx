import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
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
      </div>
    </div>
  );
}