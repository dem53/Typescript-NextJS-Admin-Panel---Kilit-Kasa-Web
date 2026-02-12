"use client";

import { JSX } from "react";

interface IInfoBoxProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: JSX.Element;
}


export const InfoBox = ({ isOpen, onClose, title, icon }: IInfoBoxProps) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center">
            <div className="p-5 rounded-lg mx-6  max-w-2xl relative bg-white flex flex-col items-center justify-center gap-3">
                <span onClick={onClose} className="absolute cursor-pointer top-1 right-2 text-gray-500 font-extrabold">X</span>
                <div className="flex items-center mt-2 justify-center gap-2 text-center">
                    <span className="bg-gray-100 rounded-full p-2">
                        {icon}
                    </span>
                    <h2 className="font-sans text-sm min-w-72 font-semibold">
                        {title}
                    </h2>
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        className="px-2 py-1 border border-gray-300 rounded-sm cursor-pointer bg-blue-400 text-sm text-center text-white quicksand hover:bg-blue-500 duration-300 ease-in-out"
                        onClick={onClose}
                    >
                        <h2>Tamam</h2>
                    </button>
                </div>
            </div>
        </div>
    )
}