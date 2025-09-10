import { Boldonse } from "next/font/google";
import Dashboard from "../dashboard/Dashboard";


const boldonse = Boldonse({
    weight: '400',
    subsets: ['latin'],
});


export default function HomeRightMainRenderer() {
    return (
        <div className="w-full h-full ">
            <Dashboard />
        </div>
    );
}