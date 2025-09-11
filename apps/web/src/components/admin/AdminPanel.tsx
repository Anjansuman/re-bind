import { useContract } from "@/app/contract";
import { RxCross2 } from "react-icons/rx";


export default function AdminPanel({ close }: { close: () => void }) {

    const { contract } = useContract();

    async function handleOnInitialize() {
        const res = await contract?.initializePlatform();
        console.log(res);
        alert(res);
    }

    return (
        <div className="absolute top-50 left-1/2 -translate-1/2 p-3 border border-neutral-700 rounded-lg bg-black shadow-md flex flex-col justify-center items-start gap-y-2 ">
            <div className="w-full flex justify-end items-center ">
                <div
                    className="p-0.5 bg-neutral-900 hover:bg-neutral-800 transition-colors flex justify-center items-center rounded-full cursor-pointer"
                    onClick={close}
                >
                    <RxCross2 />
                </div>
            </div>
            <div
                className="flex justify-center items-center px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer "
                onClick={handleOnInitialize}
            >
                Initialize platform
            </div>
            <div className="flex justify-center items-center px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer ">
                Change authority
            </div>
        </div>
    );
}