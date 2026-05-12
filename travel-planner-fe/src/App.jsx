import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import TripSelectionLayout from "./layouts/TripSelectionLayout";

import MyTripsPage from "./pages/MyTripsPage";
import DashboardPage from "./pages/DashboardPage";
import ItineraryPage from "./pages/ItineraryPage";
import PackingPage from "./pages/PackingPage";
import BudgetPage from "./pages/BudgetPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* MainLayout cho MyTripsPage */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MyTripsPage />} />
        </Route>

        {/* TripSelectionLayout cho trip đã chọn */}
        <Route path="/trip/:tripId/*" element={<TripSelectionLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="itinerary" element={<ItineraryPage />} />
          <Route path="packing" element={<PackingPage />} />
          <Route path="budget" element={<BudgetPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
