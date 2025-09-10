import PuzzleSVG from "@/src/ui/PuzzleSVG";
import { Boldonse } from "next/font/google";


const boldonse = Boldonse({
    weight: '400',
    subsets: ['latin'],
});


export default function Dashboard() {
    return (
        <div className="w-full h-full flex justify-between">
            <div className="h-full flex items-center pl-60">
                <PuzzleSVG />
            </div>
            <div
                className={`${boldonse.className} h-full text-[100px] tracking-wider text-[#e4e4e4] leading-24 flex flex-col justify-center`}
            >
                <span className="outlined-text w-full flex justify-end ">
                    Hashed
                </span>
            </div>
        </div>
    );
}