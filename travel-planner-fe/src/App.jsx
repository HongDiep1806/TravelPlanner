import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import TripSelectionLayout from "./layouts/TripSelectionLayout";
import MainLayout from "./layouts/MainLayout";

import MyTripsPage from "./pages/MyTripsPage";
import DashboardPage from "./pages/DashboardPage";
import ItineraryPage from "./pages/ItineraryPage";
import PackingPage from "./pages/PackingPage";
import BudgetPage from "./pages/BudgetPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* TRIP SELECTION */}
        <Route element={<TripSelectionLayout />}>
          <Route path="/" element={<MyTripsPage />} />
        </Route>

        {/* MAIN LAYOUT */}
        <Route
          path="/trip/:tripId"
          element={<MainLayout />}
        >
          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="itinerary"
            element={<ItineraryPage />}
          />

          <Route
            path="packing"
            element={<PackingPage />}
          />

          <Route
            path="budget"
            element={<BudgetPage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}