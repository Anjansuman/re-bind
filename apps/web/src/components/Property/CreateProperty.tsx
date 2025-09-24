"use client";

import { useState, FormEvent } from "react";
import { useContract } from "@/app/contract";

export default function CreateProperty() {
    const { contract } = useContract();

    const [formData, setFormData] = useState<{
        name: string;
        symbol: string;
        uri: string;
        price: string;
        location: string;
        description: string;
    }>({
        name: "",
        symbol: "",
        uri: "",
        price: "",
        location: "",
        description: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!contract) return alert("Contract not initialized");

        try {
            const res = await contract.createProperty(
                formData.name,
                formData.symbol,
                formData.uri,
                Number(formData.price),
                formData.location,
                formData.description
            );
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="h-full w-full flex justify-center items-center bg-neutral-900 text-white p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-neutral-800 rounded-2xl shadow-lg w-full max-w-md p-6 space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center">Create Property</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Property Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />

                <input
                    type="text"
                    name="symbol"
                    placeholder="Symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />

                <input
                    type="text"
                    name="uri"
                    placeholder="Image URI"
                    value={formData.uri}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="w-full p-2 rounded-md bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />

                <button
                    type="submit"
                    className="w-full py-2 bg-black hover:bg-neutral-900 rounded-md font-semibold transition"
                >
                    Create
                </button>
            </form>
        </div>
    );
}
