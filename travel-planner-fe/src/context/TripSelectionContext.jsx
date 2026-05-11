import { createContext, useContext, useState } from "react";

const TripSelectionContext = createContext();

export function TripSelectionProvider({ children }) {
  const [selectedTripId, setSelectedTripId] = useState(null);

  return (
    <TripSelectionContext.Provider value={{ selectedTripId, setSelectedTripId }}>
      {children}
    </TripSelectionContext.Provider>
  );
}

export function useTripSelection() {
  return useContext(TripSelectionContext);
}