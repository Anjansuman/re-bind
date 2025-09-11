import { create } from "zustand";


export enum PAGE {
    DASHBOARD = 'DASHBOARD',
    BUY_PROPERTY = 'BUY_PROPERTY',
    BOOKED_PROPERTY = 'BOOKED_PROPERTY',
    OWNED_PROPERTY = 'OWNED_PROPERTY',
    CREATE_PROPERTY = 'CREATE_PROPERTY',
}

interface HomeStore {
    currentPage: PAGE;
    updatePage: (page: PAGE) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
    currentPage: PAGE.DASHBOARD,
    updatePage: (page: PAGE) => set({ currentPage: page }),
}));