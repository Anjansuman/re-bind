"use client";

import { PropertyType } from "@/src/types/PropertyType";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { useContract } from "@/app/contract";

export default function PropertyCard(p: PropertyType) {
    const [buttonAppear, setButtonAppear] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const { contract } = useContract();

    useLayoutEffect(() => {
        if (!buttonRef.current) return;
        gsap.set(buttonRef.current, { opacity: 0, y: 20, pointerEvents: "none" });
        return () => gsap.killTweensOf(buttonRef.current);
    }, []);

    useLayoutEffect(() => {
        if (!buttonRef.current) return;

        gsap.to(buttonRef.current, {
            opacity: buttonAppear ? 1 : 0,
            y: buttonAppear ? 0 : 20,
            duration: 0.28,
            ease: "power2.out",
            onStart: () => {
                if (buttonAppear) {
                    buttonRef.current!.style.pointerEvents = "auto";
                }
            },
            onComplete: () => {
                if (!buttonAppear) {
                    buttonRef.current!.style.pointerEvents = "none";
                }
            },
        });
    }, [buttonAppear]);

    function handleBook() {
        if(!contract) return;

        // change as per need
        contract.BookProperty(p.name, p.owner, new Date(), new Date());
    }

    return (
        <div
            className="h-fit w-fit p-4 bg-black border border-neutral-800 rounded-lg text-neutral-200 flex flex-col gap-y-1.5 select-none relative"
            onMouseEnter={() => setButtonAppear(true)}
            onMouseLeave={() => setButtonAppear(false)}
        >
            <div className="flex justify-start items-center gap-x-1">
                <div>Property Name:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.name}
                </div>
            </div>
            <div className="flex justify-start items-center gap-x-1">
                <div>Location:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.location}
                </div>
            </div>
            <div className="flex justify-start items-center gap-x-1">
                <div>Description:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.description}
                </div>
            </div>
            <div className="flex justify-start items-center gap-x-1">
                <div>Created At:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.createdAt.toString()}
                </div>
            </div>
            <div className="flex justify-start items-center gap-x-1">
                <div>Owner:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.owner.toBase58()}
                </div>
            </div>
            <div className="flex justify-start items-center gap-x-1">
                <div>Total bookings:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.totalBookings.toString()}
                </div>
            </div>
            <div className="flex justify-start items-center gap-x-1">
                <div>Availability:</div>
                <div className="bg-yellow-400/30 border border-yellow-400/70 rounded-lg px-2 py-0.5">
                    {p.isAvailable.toString()}
                </div>
            </div>

            <div
                ref={buttonRef}
                className="absolute bottom-4 right-4 bg-neutral-200 border border-neutral-800 rounded-md px-2 py-1 cursor-pointer text-neutral-800"
                role="button"
                aria-hidden={!buttonAppear}
                onClick={handleBook}
            >
                Book Property
            </div>
        </div>
    );
}


// name, price, location, description, owner, isAvailable, totalBookings