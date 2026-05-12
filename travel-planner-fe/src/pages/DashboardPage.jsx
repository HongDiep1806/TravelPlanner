import { useTripSelection } from "../context/TripSelectionContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    if (!tripId) return;

    fetch(`http://localhost:3000/trips/${tripId}`)
      .then(res => res.json())
      .then(data => setTripData(data))
      .catch(console.error);
  }, [tripId]);

  if (!tripData) return <div>Loading trip data...</div>;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm min-h-full">
      <h1 className="text-3xl font-bold mb-4">{tripData.tripName}</h1>
      <p>Budget: {tripData.budget.toLocaleString()} VND</p>
    </div>
  );
}