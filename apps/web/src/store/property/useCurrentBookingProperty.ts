import { create } from "zustand";


interface CurrentBookingProperty {
    currentProperty: string | null,
    setCurrentProperty: (propertyName: string | null) => void;
}

export const useCurrentBookingPropertyStore = create<CurrentBookingProperty>((set) => ({
    currentProperty: null,
    setCurrentProperty: (propertyName: string | null) => set({ currentProperty: propertyName }),
}));