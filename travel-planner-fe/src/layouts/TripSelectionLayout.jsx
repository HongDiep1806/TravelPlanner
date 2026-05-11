import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { TripSelectionProvider } from "../context/TripSelectionContext";
import Sidebar from "../components/Sidebar";

export default function TripSelectionLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TripSelectionProvider>
      <div className="flex min-h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </TripSelectionProvider>
  );
}