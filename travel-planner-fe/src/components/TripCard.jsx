import { useNavigate } from "react-router-dom";

export default function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trip/${trip.id}/dashboard`)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <img
        src={trip.image}
        alt={trip.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <h2 className="font-bold text-lg">
          {trip.title}
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          {trip.date}
        </p>

        <p className="text-sm mt-3 mb-2">
          {trip.daysLeft} days left
        </p>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{
              width: `${trip.progress}%`,
            }}
          />
        </div>

        <div className="text-right text-sm mt-2">
          {trip.progress}%
        </div>
      </div>
    </div>
  );
}