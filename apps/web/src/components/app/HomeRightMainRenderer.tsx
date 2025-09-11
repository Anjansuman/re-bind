"use client";

import { Boldonse } from "next/font/google";
import Dashboard from "../dashboard/Dashboard";
import { useHomeStore, PAGE } from "@/src/store/home/useHomeStore";
import CreateProperty from "../Property/CreateProperty";


const boldonse = Boldonse({
    weight: '400',
    subsets: ['latin'],
});


export default function HomeRightMainRenderer() {

    const { currentPage } = useHomeStore();

    function currentRenderedPage() {
        switch(currentPage) {
            case PAGE.DASHBOARD:
                return <Dashboard />;

            case PAGE.BUY_PROPERTY:
                return <div></div>;

            case PAGE.BOOKED_PROPERTY:
                return <div></div>;

            case PAGE.OWNED_PROPERTY:
                return <div></div>;

            case PAGE.CREATE_PROPERTY:
                return <CreateProperty />;

            default:
                return <Dashboard />
        }
    }

    return (
        <div className="w-full h-full ">
            {currentRenderedPage()}
        </div>
    );
}