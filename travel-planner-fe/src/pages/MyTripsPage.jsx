import { useState, useEffect } from "react";
import TripCard from "../components/TripCard";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:3000/trips");
        if (!res.ok) throw new Error("Failed to fetch trips from API");
        const data = await res.json();

        const funnyImages = [
          "https://t3.ftcdn.net/jpg/07/80/95/16/360_F_780951672_cJzVeOxybkHkCkFDIOGUAlcq2ADIHVO7.jpg",
          "https://img.magnific.com/premium-photo/travel-illustration-with-beige-background_123891-34607.jpg",
          "https://m.media-amazon.com/images/I/61owA8oQRNL._AC_UF894,1000_QL80_.jpg",
          "https://t3.ftcdn.net/jpg/05/09/27/46/360_F_509274674_SeWdmsza7cafrIzUZ924JvLuRRSCdxNS.jpg",
          "https://elements-resized.envatousercontent.com/elements-video-cover-images/files/231957405/590_sun_4k.jpg?w=500&cf_fit=cover&q=85&format=auto&s=188fd3b4599eba29da88c393993bd0cfe4206ffb8c881dc9cd296726ce37f1d5",
        ];

        const tripsWithFunnyImages = data.map((trip, index) => ({
          ...trip,
          image: funnyImages[index % funnyImages.length], // random theo index
        }));

        setTrips(tripsWithFunnyImages);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading trips...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">My Trips</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={{
              title: trip.tripName,
              budget: trip.budget,
              image: trip.image,
            }}
          />
        ))}
      </div>
    </div>
  );
}
