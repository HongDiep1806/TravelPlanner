<<<<<<< HEAD
import { Outlet } from "react-router-dom";
import {
  CalendarDays,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
=======
import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TripSelectionProvider, useTripSelection } from "../context/TripSelectionContext";
import Sidebar from "../components/Sidebar";

function InnerLayout() {
  const { tripId } = useParams();
  const { setSelectedTripId } = useTripSelection();

  useEffect(() => {
    if (tripId) setSelectedTripId(tripId);
  }, [tripId]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
>>>>>>> origin/dev

export default function TripSelectionLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#f7f7fb]">
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            lg:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed lg:sticky
            top-0 left-0
            z-50

            h-screen
            w-[250px]

            bg-white
            border-r

            px-5
            py-6

            transition-transform
            duration-300

            shadow-xl
            lg:shadow-none

            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
        >
          {/* MOBILE CLOSE */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="
              lg:hidden
              absolute
              top-4
              right-4
              p-2
              rounded-xl
              hover:bg-gray-100
            "
          >
            <X size={22} />
          </button>

          {/* LOGO */}
          <h1
            className="
              text-xl
              font-bold
              text-indigo-600
              mb-10
            "
          >
            Trip Planner Pro
          </h1>

          {/* NAV */}
          <nav className="space-y-3">
            <button
              className="
                w-full
                bg-indigo-100
                text-indigo-700
                rounded-xl
                px-4
                py-3

                flex
                items-center
                gap-3

                font-medium
                hover:bg-indigo-200
                transition-all
              "
            >
              <CalendarDays size={20} />

              <span>My Trips</span>
            </button>

            <button
              className="
                w-full
                bg-indigo-600
                text-white
                rounded-xl
                px-4
                py-3
                font-medium
                hover:opacity-90
                transition
              "
            >
              + New Trip
            </button>
          </nav>

          {/* FOOTER */}
          <div className="mt-10 space-y-3 text-gray-500">
            <div className="hover:text-indigo-600 cursor-pointer">
              Settings
            </div>

            <div className="hover:text-indigo-600 cursor-pointer">
              About
            </div>
          </div>
        </aside>

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
            className="
              lg:hidden

              sticky
              top-0
              z-30

              h-16

              bg-white/90
              backdrop-blur

              border-b

              flex
              items-center

              px-4
            "
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                p-2
                rounded-xl
                hover:bg-gray-100
                transition
              "
            >
              <Menu size={24} />
            </button>

            <h1 className="ml-3 font-semibold text-gray-800">
              Trip Planner Pro
            </h1>
          </header>

          {/* CONTENT */}
          <main
            className="
              flex-1

              p-4
              sm:p-6
              lg:p-8

              overflow-x-hidden
            "
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
=======
    <TripSelectionProvider>
      <InnerLayout />
    </TripSelectionProvider>
>>>>>>> origin/dev
  );
}