import { create } from "zustand";

type MapPosition = {
  lat: number;
  lng: number;
};

type MapPositionState = {
  position: MapPosition | null;
  setPosition: (pos: MapPosition) => void;
};

export const useMapPositionStore = create<MapPositionState>((set) => ({
  position: null,
  setPosition: (pos) => set({ position: pos }),
}));
