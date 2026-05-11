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

export default function TripSelectionLayout() {
  return (
    <TripSelectionProvider>
      <InnerLayout />
    </TripSelectionProvider>
  );
}