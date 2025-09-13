"use client";

import { PropertyType } from "@/src/types/PropertyType";
import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useContract } from "@/app/contract";
import { cn } from "@/src/lib/utils";
import { useCurrentBookingPropertyStore } from "@/src/store/property/useCurrentBookingProperty";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

export default function PropertyCard(p: PropertyType) {
    const [buttonAppear, setButtonAppear] = useState<boolean>(false);
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const { contract } = useContract();
    const { currentProperty, setCurrentProperty } = useCurrentBookingPropertyStore();
    const [date, setDate] = useState<Date | undefined>(new Date());

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
        if (!contract) return;

        // change as per need
        contract.BookProperty(p.name, p.owner, new Date(), new Date());
    }

    return (
        <div
            className={cn(
                "h-fit w-fit p-4 bg-black border border-neutral-800 rounded-lg text-neutral-200 flex select-none relative",
                currentProperty ? 'z-20' : '',
            )}
            onMouseEnter={() => setButtonAppear(true)}
            onMouseLeave={() => setButtonAppear(false)}
        >
            {/* info about property */}
            <div className="flex flex-col gap-y-1.5 ">
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
                    className={cn(
                        "absolute bottom-4 bg-neutral-200 border border-neutral-800 rounded-md px-2 py-1 cursor-pointer text-neutral-800",
                        currentProperty ? 'left-4' : 'right-4',
                    )}
                    role="button"
                    aria-hidden={!buttonAppear}
                    onClick={() => setCurrentProperty(p.name)}
                >
                    Book Property
                </div>
            </div>

            {currentProperty === p.name && (
                <CalendarRangeDemo />
            )}

        </div>
    );
}

function CalendarRangeDemo() {
    const [date, setDate] = useState<DateRange | undefined>();

    const today = new Date();

    function handleSelect(selected: DateRange | undefined) {
        if (!selected) return;

        const { from, to } = selected;


        if ((from && from < today ) || (from && to && to < from)) return;

        setDate(selected);
    }

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-neutral-950 text-neutral-100 rounded-xl">
            <Calendar
                mode="range"
                selected={date}
                onSelect={handleSelect}
                disabled={(day) => day < today}
                className="rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-100"
            />

            {date?.from && date?.to ? (
                <div className="flex flex-col gap-y-1 text-sm ">
                    <div>
                        check-in: <span className="text-neutral-200/60 ">{date.from.toDateString()}</span>
                    </div>
                    <div>
                        check-out: <span className="text-neutral-200/60 ">{date.to.toDateString()}</span>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-neutral-500">Pick a date range</p>
            )}
        </div>
    );
}


// name, price, location, description, owner, isAvailable, totalBookings