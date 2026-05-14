import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Backpack,
  Wallet,
  RefreshCcw,
  Settings,
  Map,
  ChevronRight,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

/* ================= MOCK DATA DÙNG CHO TRƯỜNG HỢP CHƯA CÓ BACKEND ================= */

const mockTripInfo = {
  tripName: "Da Nang Family Trip",
  startDate: "Jun 10, 2026",
  endDate: "Jun 15, 2026",
};

const mockDashboard = {
  itineraryCompletedPercent: 65,
  packingCompletedPercent: 10,
  budgetUsedPercent: 72,

  completedItineraryItems: 13,
  totalItineraryItems: 20,

  unpaidBudgetItems: 3,
  overdueItineraryItems: 2,

  totalSpent: 8640000,
  totalBudget: 12000000,
};

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

const mockPackingItems = [
  {
    id: 1,
    itemName: "T-Shirt",
    packedStatus: "Packed",
  },
  {
    id: 2,
    itemName: "Shoes",
    packedStatus: "Packed",
  },
  {
    id: 3,
    itemName: "Passport",
    packedStatus: "Packed",
  },
  {
    id: 4,
    itemName: "Sunscreen",
    packedStatus: "Packed",
  },
  {
    id: 5,
    itemName: "Camera",
    packedStatus: "NotPacked",
  },
  {
    id: 6,
    itemName: "Hat",
    packedStatus: "NotPacked",
  },
];

/* ================= PAGE ================= */

export default function DashboardPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(mockDashboard);
  const [itinerary, setItinerary] = useState(mockItinerary);
  const [budgetOverview, setBudgetOverview] = useState(mockBudgetOverview);
  const [packingItems, setPackingItems] =useState(mockPackingItems);
  const [tripInfo, setTripInfo] = useState(mockTripInfo);

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
// fetch dashboard, itinerary, budget, packing, trip info cùng lúc để tối ưu hiệu suất theo api DOCs
      const [
        dashboardRes,
        itineraryRes,
        budgetRes,
        packingRes,
        tripRes,
      ] = await Promise.all([
        fetch(`http://localhost:3000/api/trips/${tripId}/dashboard`),
        fetch(`http://localhost:3000/api/trips/${tripId}/itinerary`),
        fetch(
          `http://localhost:3000/api/trips/${tripId}/budget?groupBy=category`
        ),
        fetch(`http://localhost:3000/api/trips/${tripId}/packing`),
        fetch(`http://localhost:3000/api/trips/${tripId}`),
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

      /* ===== BUDGET ===== */
      if (budgetRes.ok) {
        const budgetData = await budgetRes.json();

        if (budgetData?.length > 0) {
          setBudgetOverview(budgetData);
        }
      }

      /* ===== PACKING ===== */
      if (packingRes.ok) {
        const packingData = await packingRes.json();

        if (packingData?.length > 0) {
          setPackingItems(packingData);
        }
      }

      /* ===== TRIP ===== */
      if (tripRes.ok) {
        const tripData = await tripRes.json();

        if (tripData) {
          setTripInfo(tripData);
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

    itinerary.forEach((item) => {
      const date = item.date;

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(item);
    });

    return Object.entries(grouped);
  }, [itinerary]);

  const totalPacked = packingItems.filter(
    (item) => item.packedStatus === "Packed"
  ).length;

  const packingPercent =
    packingItems.length > 0
      ? Math.round((totalPacked / packingItems.length) * 100)
      : 0;

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f6f7fb] p-5">
      <div className="bg-white rounded-[30px] border border-gray-200 overflow-hidden flex">
        {/* CONTENT */}
        <div className="flex-1 p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                Here’s an overview of your trip.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition"
            >
              <RefreshCcw size={18} />
              Refresh Data
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-5 gap-5 mb-7">
            <StatCard
              title="Itinerary Completed"
              value={`${dashboard.itineraryCompletedPercent}%`}
              color="text-green-500"
              subtitle={`${dashboard.completedItineraryItems} / ${dashboard.totalItineraryItems} activities`}
            />

            <StatCard
              title="Packing Completed"
              value={`${packingPercent}%`}
              color="text-yellow-500"
              subtitle={`${totalPacked} / ${packingItems.length} items`}
            />

            <StatCard
              title="Budget Used"
              value={`${dashboard.budgetUsedPercent}%`}
              color="text-red-500"
              subtitle={`${dashboard.totalSpent?.toLocaleString()} / ${dashboard.totalBudget?.toLocaleString()} VND`}
            />

            <StatCard
              title="Unpaid Items"
              value={dashboard.unpaidBudgetItems}
              color="text-blue-500"
              subtitle="Budget items"
            />

            <StatCard
              title="Overdue Activities"
              value={dashboard.overdueItineraryItems}
              color="text-red-500"
              subtitle="Activities"
            />
          </div>

          {/* BOTTOM */}
          <div className="grid grid-cols-3 gap-6">
            {/* ITINERARY */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Itinerary by Date
              </h2>

              <div className="space-y-5">
                {groupedItinerary.map(([date, items]) => (
                  <div
                    key={date}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                        <CalendarDays size={16} />
                      </div>

                      <div>
                        <p className="font-medium">{date}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      {items.length} activities
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("../itinerary")}
                className="mt-8 text-indigo-600 font-semibold hover:underline"
              >
                View all
              </button>
            </div>

            {/* BUDGET */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-6">
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
                        className={`w-4 h-4 rounded-full ${getBudgetColor(
                          index
                        )}`}
                      />

                      <p className="text-gray-700">
                        {item.category}
                      </p>
                    </div>

                    <p className="font-medium">
                      {item.percent}%
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("../budget")}
                className="mt-8 text-indigo-600 font-semibold hover:underline"
              >
                View details
              </button>
            </div>

            {/* PACKING */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Packing Progress
              </h2>

              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-44 h-44">
                  <svg
                    className="w-44 h-44 rotate-[-90deg]"
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
                      stroke="#4CAF50"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={326}
                      strokeDashoffset={
                        326 - (326 * packingPercent) / 100
                      }
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">
                      {packingPercent}%
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 mt-5">
                  {totalPacked} / {packingItems.length} items packed
                </p>
              </div>

              <button
                onClick={() => navigate("../packing")}
                className="mt-4 text-indigo-600 font-semibold hover:underline"
              >
                View packing list
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */
function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">
      <p className="text-gray-500 font-medium">{title}</p>

      <h2 className={`text-5xl font-bold mt-4 ${color}`}>
        {value}
      </h2>

      <p className="text-gray-500 mt-4">{subtitle}</p>
    </div>
  );
}

function getBudgetColor(index) {
  const colors = [
    "bg-blue-500",
    "bg-yellow-400",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-gray-500",
  ];

  return colors[index % colors.length];
}