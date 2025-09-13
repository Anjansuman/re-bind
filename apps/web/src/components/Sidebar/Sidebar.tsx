"use client";

import { MdSell, MdPerson } from "react-icons/md";
import { FaHouseChimney } from "react-icons/fa6";
import { PAGE, useHomeStore } from "@/src/store/home/useHomeStore";



export default function Sidebar() {

    const { updatePage } = useHomeStore();

    return (
        <div className="h-full w-[25rem] bg-black border-r border-neutral-700 rounded-r-xl flex flex-col justify-center items-start px-6 py-2 gap-y-3 ">
            <div
                className="w-full flex justify-start items-center px-4 py-2 gap-x-2 hover:bg-neutral-900 transition-colors rounded-md cursor-pointer "
                onClick={() => updatePage(PAGE.OWNED_PROPERTY)}
            >
                <MdPerson size={25} />
                <div>
                    Booked Property
                </div>
            </div>
            <div
                className="w-full flex justify-start items-center px-4 py-2 gap-x-2 hover:bg-neutral-900 transition-colors rounded-md cursor-pointer "
                onClick={() => updatePage(PAGE.OWNED_PROPERTY)}
            >
                <MdPerson size={25} />
                <div>
                    Owned Property
                </div>
            </div>
            <div
                className="w-full flex justify-start items-center px-4 py-2 gap-x-2 hover:bg-neutral-900 transition-colors rounded-md cursor-pointer "
                onClick={() => updatePage(PAGE.BUY_PROPERTY)}
            >
                <MdSell size={25} />
                <div>
                    Buy a new Property
                </div>
            </div>
            <div
                className="w-full flex justify-start items-center px-4 py-2 gap-x-2 hover:bg-neutral-900 transition-colors rounded-md cursor-pointer "
                onClick={() => updatePage(PAGE.CREATE_PROPERTY)}
            >
                <FaHouseChimney size={25} />
                <div>
                    List a new Property
                </div>
            </div>
        </div>
    );
}