"use client";

interface IPaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export const Pagination : React.FC<IPaginationProps> = ({totalItems, itemsPerPage, currentPage, setCurrentPage}) => {

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages === 1) return null;

    return (
        <div className="flex justify-start gap-2 mt-4">

            <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              ←
            </button>


            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                key={page} 
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border cursor-pointer rounded ${currentPage === page ? "bg-blue-500 text-white" : "" }`}
                >
                {page} 
                </button>
            ))}


            <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
                ➝
            </button>

        </div>
    )
}


export default Pagination