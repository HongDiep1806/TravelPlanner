import TripCard from "../components/TripCard";

export default function MyTripsPage() {
  // Tạm thời mock dữ liệu, sau lấy từ file JSON
  const trips = [
    {
      id: 1,
      title: "Da Nang Family Trip",
      date: "Jun 10 - Jun 15, 2026",
      daysLeft: 4,
      progress: 60,
      image:
        "https://images.unsplash.com/photo-1528127269322-539801943592",
    },

    {
      id: 2,
      title: "Tokyo Adventure",
      date: "Jul 05 - Jul 12, 2026",
      daysLeft: 27,
      progress: 20,
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    },

    {
      id: 3,
      title: "Bali Relaxing Escape",
      date: "Aug 18 - Aug 25, 2026",
      daysLeft: 71,
      progress: 0,
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            My Trips
          </h1>

          <p className="text-gray-500 mt-2">
            All your amazing journeys in one place.
          </p>
        </div>

        <button
          className="
            px-6 py-3 rounded-2xl
            bg-gradient-to-r from-indigo-500 to-purple-500
            text-white font-semibold
            shadow-lg shadow-indigo-200
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-300
          "
        >
          + Create Trip
        </button>
      </div>

      {/* Trip Grid */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        "
      >
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
          />
        ))}
      </div>
    </div>
  );
}