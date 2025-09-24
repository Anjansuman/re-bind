"use client";

import { usePropertiesStore } from "@/src/store/contract/usePropertiesStore";
import PropertyCard from "../utility/PropertyCard";

export default function BuyProperty() {

    const { properties } = usePropertiesStore();
    
    return (
        <div className="w-full h-full p-4 overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-wrap gap-3 ">
            {properties.map((p, index) => (
                <PropertyCard
                    key={index}
                    {...p}
                />
            ))}
        </div>
    );
}