import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import TripSelectionLayout from "./layouts/TripSelectionLayout";

import MyTripsPage from "./pages/MyTripsPage";
import DashboardPage from "./pages/DashboardPage";
import ItineraryPage from "./pages/ItineraryPage";
import PackingPage from "./pages/PackingPage";
import BudgetPage from "./pages/BudgetPage";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 11000,
            borderRadius: "24px",
            padding: "16px 24px",
            fontWeight: "600",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          },
          success: {
            style: { background: "#10b981" }, // xanh lá
            iconTheme: { primary: "#fff", secondary: "#10b981" },
          },
          error: {
            style: { background: "#ef4444" }, // đỏ
            iconTheme: { primary: "#fff", secondary: "#ef4444" },
          },
        }}
      />
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
