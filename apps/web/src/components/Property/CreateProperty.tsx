import { useContract } from "@/app/contract";


export default function CreateProperty() {

    const { contract } = useContract();

    async function handleOnClick() {
        const res = await contract?.createProperty(
            'property_2',
            'p_2',
            'https://www.michaelzingraf.com/storage/images/xOWyG9KJ1jqmMPFgv1KoscsYpkoQ0lCDD2WTi8WE.jpeg',
            20000,
            'Pune',
            'A Lavish villa with swimming pool.'
        )
        console.log({res});
        alert(res);
    }

    return (
        <div className="h-full w-full flex justify-center items-center ">
            <div
                className="bg-black px-4 py-2 rounded-md cursor-pointer "
                onClick={handleOnClick}
            >
                Create Property
            </div>
        </div>
    );
}