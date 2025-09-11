import { PropertyType } from "@/src/types/PropertyType";
import { create } from "zustand";

interface PropertiesStore {
    properties: PropertyType[];
    updateProperties: (properties: PropertyType[]) => void;
}

export const usePropertiesStore = create<PropertiesStore>((set) => ({
    properties: [],
    updateProperties: (properties: PropertyType[]) => set((state) => ({
        properties: [...state.properties, ...properties],
    })),
}));