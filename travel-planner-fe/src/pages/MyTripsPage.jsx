import { useState, useEffect } from "react";
import TripCard from "../components/TripCard";

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await fetch("http://localhost:3000/trips");
      const data = await res.json();

      const funnyImages = [
        "https://t3.ftcdn.net/jpg/07/80/95/16/360_F_780951672_cJzVeOxybkHkCkFDIOGUAlcq2ADIHVO7.jpg",
        "https://img.magnific.com/premium-photo/travel-illustration-with-beige-background_123891-34607.jpg",
        "https://m.media-amazon.com/images/I/61owA8oQRNL._AC_UF894,1000_QL80_.jpg",
        "https://t3.ftcdn.net/jpg/05/09/27/46/360_F_509274674_SeWdmsza7cafrIzUZ924JvLuRRSCdxNS.jpg",
        "https://elements-resized.envatousercontent.com/elements-video-cover-images/files/231957405/590_sun_4k.jpg?w=500&cf_fit=cover&q=85&format=auto&s=188fd3b4599eba29da88c393993bd0cfe4206ffb8c881dc9cd296726ce37f1d5",
      ];

      const tripsWithImages = data.map((trip, index) => ({
        ...trip,
        image: funnyImages[index % funnyImages.length],
      }));

      setTrips(tripsWithImages);
      setLoading(false);
    };
    fetchTrips();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading trips...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-8">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}