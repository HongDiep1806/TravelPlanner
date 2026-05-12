import { useNavigate } from "react-router-dom";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  const startDate = new Date(Math.min(...trip.itinerary.map(item => new Date(item.date))));
  const endDate = new Date(Math.max(...trip.itinerary.map(item => new Date(item.date))));

  const today = new Date();
  const diffTime = startDate - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const displayDaysLeft = daysLeft > 0 ? daysLeft : 0;

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}/dashboard`)}
      className="bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition overflow-hidden"
    >
      {/* Hình cover */}
      <img src={trip.image} alt={trip.tripName} className="h-48 w-full object-cover" />

      <div className="p-5 space-y-2">
        {/* Tên trip */}
        <h2 className="font-bold text-lg">{trip.tripName}</h2>

        {/* StartDate – EndDate */}
        <p className="text-gray-500 text-sm">
          {formatDate(startDate)} – {formatDate(endDate)}
        </p>

        {/* Days left */}
        <p className="text-gray-500 text-sm">{displayDaysLeft} days left</p>
      </div>
    </div>
  );
}