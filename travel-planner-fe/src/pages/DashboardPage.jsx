import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

/* ================= CONSTANTS ================= */
const INDIGO = "#4F46E5";

const CATEGORY_COLORS = {
  Transport: "#4F46E5",
  Accommodation: "#22C55E",
  Food: "#F97316",
  Activity: "#EF4444",
  Shopping: "#A855F7",
  Other: "#06B6D4",
};

/* ================= MOCK DATA DÙNG CHO TRƯỜNG HỢP CHƯA CÓ BACKEND ================= */
const mockItinerary = [
  {
    id: 1,
    date: "Jun 10, 2026",
    title: "Airport Check-in",
  },
  {
    id: 2,
    date: "Jun 10, 2026",
    title: "Hotel Check-in",
  },
  {
    id: 3,
    date: "Jun 11, 2026",
    title: "Ba Na Hills",
  },
  {
    id: 4,
    date: "Jun 11, 2026",
    title: "Night Market",
  },
  {
    id: 5,
    date: "Jun 12, 2026",
    title: "Beach Day",
  },
  {
    id: 6,
    date: "Jun 13, 2026",
    title: "Hoi An Visit",
  },
];

const mockBudgetOverview = [
  {
    category: "Transport",
    percent: 30,
  },
  {
    category: "Accommodation",
    percent: 20,
  },
  {
    category: "Food",
    percent: 20,
  },
  {
    category: "Activity",
    percent: 10,
  },
  {
    category: "Shopping",
    percent: 10,
  },
  {
    category: "Other",
    percent: 8,
  },
];

const mockDashboard = {
  itinerary: {
    total: 20,
    done: 13,
    completedPercent: 65,
    overdueCount: 2,
  },
  packing: {
    total: 20,
    packed: 5,
    completedPercent: 25,
  },
  budget: {
    initial: 12000000,
    used: 8600000,
    usedPercent: 72,
    unpaidItemsCount: 3,
  },
};

/* ================= PAGE ================= */

export default function DashboardPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(mockDashboard);
  const [itinerary, setItinerary] = useState(mockItinerary);
  const [budgetOverview, setBudgetOverview] = useState(mockBudgetOverview);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // fetch dashboard, itinerary, budget, packing, trip info cùng lúc để tối ưu hiệu suất theo api DOCs
      const [
        dashboardRes,
        itineraryRes,
        budgetOverviewRes,
      ] = await Promise.all([
        fetch(`http://localhost:3000/dashboard/${tripId}`),
        fetch(`http://localhost:3000/itinerary/${tripId}`),
        fetch(`http://localhost:3000/dashboard/budget/${tripId}`),
      ]);

      /* ===== DASHBOARD ===== */
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        if (dashboardData) {
          setDashboard(dashboardData);
        }
      }

      /* ===== ITINERARY ===== */
      if (itineraryRes.ok) {
        const itineraryData = await itineraryRes.json();
        if (itineraryData?.length > 0) {
          setItinerary(itineraryData);
        }
      }

      /* ===== BUDGET OVERVIEW ===== */
      if (budgetOverviewRes.ok) {
        const budgetOverviewData = await budgetOverviewRes.json();
        if (budgetOverviewData?.length > 0) {
          setBudgetOverview(budgetOverviewData);
        } else {
          setBudgetOverview([]);
        }
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      /* giữ mock data nếu api lỗi */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchDashboardData();
    }
  }, [tripId]);

  const groupedItinerary = useMemo(() => {
    const grouped = {};

    itinerary?.forEach((item) => {
      const date = item.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    return Object.entries(grouped);
  }, [itinerary]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
        <Loader2
          size={24}
          className="animate-spin"
          style={{ color: INDIGO }}
        />
        <span className="text-base font-medium">Loading dashboard…</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 min-h-full shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {dashboard?.tripName || "Dashboard"}
          </h1>

          <p className="text-base font-semibold text-gray-500 mt-2">
            Here's an overview of your trip.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button
            onClick={fetchDashboardData}
            style={{ backgroundColor: INDIGO }}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:opacity-90 transition shadow-md"
          >
            <RefreshCcw size={17} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 mb-7">
        <StatCard
          title="Itinerary Completed"
          value={`${dashboard?.itinerary?.completedPercent || 0}%`}
          color="text-green-500"
          subtitle={`${dashboard?.itinerary?.done || 0} / ${dashboard?.itinerary?.total || 0} activities`}
        />

        <StatCard
          title="Packing Completed"
          value={`${dashboard?.packing?.completedPercent || 0}%`}
          color="text-yellow-500"
          subtitle={`${dashboard?.packing?.packed || 0} / ${dashboard?.packing?.total || 0} items`}
        />

        <StatCard
          title="Budget Used"
          value={`${dashboard?.budget?.usedPercent || 0}%`}
          color="text-red-500"
          subtitle={`${(dashboard?.budget?.used || 0).toLocaleString()} / ${(dashboard?.budget?.initial || 0).toLocaleString()} VND`}
        />

        <StatCard
          title="Unpaid Items"
          value={dashboard?.budget?.unpaidItemsCount || 0}
          color="text-blue-500"
          subtitle="Budget items"
        />

        <StatCard
          title="Overdue Activities"
          value={dashboard?.itinerary?.overdueCount || 0}
          color="text-red-500"
          subtitle="Activities"
        />
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ITINERARY */}
        <div className="border border-gray-200 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Itinerary by Date
          </h2>

          <div className="space-y-4">
            {groupedItinerary.map(([date, items]) => (
              <div
                key={date}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                    <CalendarDays size={16} className="text-gray-500" />
                  </div>

                  <p className="text-sm font-medium text-gray-700">{date}</p>
                </div>

                <span className="text-sm text-gray-400">
                  {items.length} activities
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("../itinerary")}
            className="mt-7 text-sm font-semibold hover:underline"
            style={{ color: INDIGO }}
          >
            View all
          </button>
        </div>

        {/* BUDGET */}
        <div className="border border-gray-200 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Budget Overview
          </h2>

          <div className="space-y-4">
            {budgetOverview.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        CATEGORY_COLORS[item.category] ?? "#9CA3AF",
                    }}
                  />

                  <p className="text-sm text-gray-700">{item.category}</p>
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  {item.percent}%
                </p>
              </div>
            ))}

            {budgetOverview.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">
                No budget data yet.
              </p>
            )}
          </div>

          <button
            onClick={() => navigate("../budget")}
            className="mt-7 text-sm font-semibold hover:underline"
            style={{ color: INDIGO }}
          >
            View details
          </button>
        </div>

        {/* PACKING */}
        <div className="border border-gray-200 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Packing Progress
          </h2>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg
                className="w-40 h-40 rotate-[-90deg]"
                viewBox="0 0 120 120"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#22C55E"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={326}
                  strokeDashoffset={
                    326 -
                    ((326 * (dashboard?.packing?.completedPercent || 0)) / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">
                  {dashboard?.packing?.completedPercent || 0}%
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-500 mt-4">
              {dashboard?.packing?.packed || 0} / {dashboard?.packing?.total || 0} items packed
            </p>
          </div>

          <button
            onClick={() => navigate("../packing")}
            className="mt-4 text-sm font-semibold hover:underline"
            style={{ color: INDIGO }}
          >
            View packing list
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */
function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="border border-gray-200 rounded-3xl p-5">
      <p className="text-sm font-semibold text-gray-500">{title}</p>

      <h2 className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </h2>

      <p className="text-sm text-gray-400 mt-3">{subtitle}</p>
    </div>
  );
}