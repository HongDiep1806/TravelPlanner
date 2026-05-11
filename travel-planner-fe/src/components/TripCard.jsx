import { useNavigate } from "react-router-dom";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}/dashboard`)}
      className="bg-white rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition"
    >
      <img src={trip.image} alt={trip.tripName} className="h-48 w-full object-cover" />
      <div className="p-5">
        <h2 className="font-bold text-lg">{trip.tripName}</h2>
        <p className="text-gray-500 text-sm mt-1">{trip.daysLeft} days left</p>
      </div>
    </div>
  );
}