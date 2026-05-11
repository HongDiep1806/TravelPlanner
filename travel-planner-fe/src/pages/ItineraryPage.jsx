import { useTripSelection } from "../context/TripSelectionContext";
import { useEffect, useState } from "react";

export default function ItineraryPage() {
  const { selectedTripId } = useTripSelection();
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedTripId) return;

    setLoading(true);
    fetch(`http://localhost:3000/itinerary/tripId/${selectedTripId}`)
      .then(res => res.json())
      .then(data => setItinerary(data.itinerary || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedTripId]);

  if (!selectedTripId) return <div className="text-gray-500">Please select a trip first</div>;
  if (loading) return <div className="text-gray-500">Loading itinerary...</div>;

  return (
    <div className="bg-white rounded-3xl p-8 min-h-full shadow-sm">
      <h1 className="text-3xl font-bold mb-4">Itinerary</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>Date</th>
            <th>Activity</th>
            <th>Location</th>
            <th>Time</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {itinerary.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td>{item.date}</td>
              <td>{item.title}</td>
              <td>{item.location}</td>
              <td>{item.time}</td>
              <td>{item.category}</td>
              <td>{item.priority}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}