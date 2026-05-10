import { Outlet } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function TripSelectionLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f7fb]">
      {/* Sidebar */}
      <aside className="w-[250px] bg-white border-r px-5 py-6">
        <h1 className="text-xl font-bold text-indigo-600 mb-10">
          Trip Planner Pro
        </h1>

        <nav className="space-y-3">
          <button
            className="w-full bg-indigo-100 text-indigo-700 rounded-xl px-4 py-3
              flex items-center gap-3 font-medium hover:bg-indigo-200 transition-all">
            <CalendarDays size={20} />
            <span>My Trips</span>
          </button>

          <button className="w-full bg-indigo-600 text-white rounded-xl px-4 py-3">
            + New Trip
          </button>
        </nav>

        <div className="mt-10 space-y-3 text-gray-500">
          <div>Settings</div>
          <div>About</div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}