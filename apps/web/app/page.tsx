import Navbar from "@/src/components/Navbar/Navbar";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import HomeRightMainRenderer from "@/src/components/app/HomeRightMainRenderer";

export default function Home() {
    return (
        <div className="h-screen w-full bg-neutral-900 text-neutral-200 ">
            <Navbar />
            <div className="w-full h-full flex justify-between items-center ">
                <Sidebar />
                <HomeRightMainRenderer />
            </div>
        </div>
    );
}
