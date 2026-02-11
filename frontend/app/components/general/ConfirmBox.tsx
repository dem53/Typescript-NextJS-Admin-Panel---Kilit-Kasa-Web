"use client";

interface IConfirmBoxProps {
    isOpen: boolean;
    message: string;
    secondMessage?: string;
    onSuccess: () => void;
    onClose: () => void
}

export const ConfirmBox: React.FC<IConfirmBoxProps> = ({
    isOpen, message, secondMessage, onSuccess, onClose
}) => {

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 top-0 z-100 left-0 right-0 bottom-0 flex items-center justify-center bg-black/40">
            <div className="p-5 rounded-md flex bg-white flex-col gap-2 items-center justify-center text-center">
                <div className="flex items-center text-sm justify-center text-center">
                    {message}
                </div>
                {secondMessage ? (
                    <div className="flex text-xs text-yellow-600 font-bold items-center justify-center text-center">
                        {secondMessage}
                    </div>
                ) : null}
                <div className="flex items-center mt-3 text-sm justify-center gap-4">
                    <button className="px-3 py-1 rounded-lg cursor-pointer bg-gray-500 text-white font-bold text-center font-sans" type="button" onClick={onClose}>
                        <h1 className="font-semibold text-center">Hayır</h1>
                    </button>

                    <button className="px-3 py-1 rounded-lg cursor-pointer bg-red-500 text-white font-bold text-center font-sans" type="button" onClick={onSuccess}>
                        <h1 className="font-semibold text-center">Evet</h1>
                    </button>
                </div>
            </div>
        </div>
    )
}


export default ConfirmBox