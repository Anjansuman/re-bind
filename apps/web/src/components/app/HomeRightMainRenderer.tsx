"use client";

import { Boldonse } from "next/font/google";
import Dashboard from "../dashboard/Dashboard";
import { useHomeStore, PAGE } from "@/src/store/home/useHomeStore";
import CreateProperty from "../Property/CreateProperty";
import { useContract } from "@/app/contract";
import { usePropertiesStore } from "@/src/store/contract/usePropertiesStore";
import { useEffect } from "react";
import { PropertyType } from "@/src/types/PropertyType";
import BuyProperty from "../Property/BuyProperty";


const boldonse = Boldonse({
    weight: '400',
    subsets: ['latin'],
});


export default function HomeRightMainRenderer() {

    const { currentPage } = useHomeStore();
    const { contract } = useContract();
    const { setProperties } = usePropertiesStore();

    async function fetchProperties() {
        const propertyAccounts = await contract?.getAllProperties();
        console.log({propertyAccounts});

        if(!propertyAccounts) return;

        const properties: PropertyType[] = propertyAccounts.map((p) => p.account);
        setProperties(properties);
    }

    useEffect(() => {
        if (!contract) return;
        fetchProperties();
    }, [contract]);


    function currentRenderedPage() {
        switch (currentPage) {
            case PAGE.DASHBOARD:
                return <Dashboard />;

            case PAGE.BUY_PROPERTY:
                return <BuyProperty />;

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
        <div className="w-full h-full pt-30 ">
            {currentRenderedPage()}
        </div>
    );
}