import { PropertyType } from "@/src/types/PropertyType";
import { create } from "zustand";

interface PropertiesStore {
    properties: PropertyType[];
    setProperties: (properties: PropertyType[]) => void;
    updateProperties: (properties: PropertyType[]) => void;
}

export const usePropertiesStore = create<PropertiesStore>((set) => ({
    properties: [],
    setProperties: (properties: PropertyType[]) => set({ properties: properties }),
    updateProperties: (properties: PropertyType[]) => set((state) => ({
        properties: [...state.properties, ...properties],
    })),
}));