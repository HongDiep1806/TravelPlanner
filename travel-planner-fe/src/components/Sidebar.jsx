import {
  LayoutDashboard,
  MapPinned,
  Backpack,
  Wallet,
  Settings,
  ArrowLeft,
} from "lucide-react";

import {
  NavLink,
  useParams,
  useNavigate,
} from "react-router-dom";

export default function Sidebar() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  // Tạm thời mock dữ liệu, sau lấy từ file JSON
  const trip = {
    id: tripId,
    title: "Da Nang Family Trip",
    date: "Jun 10 - Jun 15, 2026",
  };

  // const trip = tripsData.find(
  //   (item) => item.id === Number(tripId)
  // );


  const menus = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: `/trip/${tripId}/dashboard`,
    },

    {
      title: "Itinerary",
      icon: <MapPinned size={20} />,
      path: `/trip/${tripId}/itinerary`,
    },

    {
      title: "Packing List",
      icon: <Backpack size={20} />,
      path: `/trip/${tripId}/packing`,
    },

    {
      title: "Budget",
      icon: <Wallet size={20} />,
      path: `/trip/${tripId}/budget`,
    },

    {
      title: "Settings",
      icon: <Settings size={20} />,
      path: `/trip/${tripId}/settings`,
    },
  ];

  return (
    <aside
      className="
        w-[270px]
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        shadow-sm
      "
    >
      {/* ================= HEADER ================= */}
      <div
        className="
          h-[90px]
          border-b
          border-gray-100
          flex
          items-center
          px-6
        "
      >
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div
            className="
              w-12 h-12 rounded-2xl
              bg-gradient-to-r
              from-indigo-500
              to-purple-500
              text-white
              flex items-center justify-center
              font-bold text-lg
              shadow-lg
            "
          >
            D
          </div>

          {/* Trip Info */}
          <div>
            <h1 className="font-bold text-gray-800 text-[16px]">
              {trip.title}
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {trip.date}
            </p>
          </div>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <div className="flex-1 p-4 space-y-2">
        {menus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              transition-all
              duration-300
              font-medium
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }
              `
            }
          >
            {item.icon}

            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => navigate("/")}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            py-3
            rounded-2xl
            bg-gray-100
            hover:bg-gray-200
            text-gray-700
            font-medium
            transition-all
            duration-300
          "
        >
          <ArrowLeft size={18} />

          <span>Back to My Trips</span>
        </button>
      </div>
    </aside>
  );
}