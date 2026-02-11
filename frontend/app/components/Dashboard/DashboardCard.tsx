"use client";

interface IDashboardCardProps {
    width: string,
    title: string;
    children: React.ReactNode
}


export const DashboardCard: React.FC<IDashboardCardProps> = ({ width, title, children }) => {
    return (
        <div className={`rounded-xl border cursor-pointer flex flex-col ${width} border-gray-200 bg-white shadow-sm hover:shadow-md transition`}>
            <div className="border-b px-2 py-2 border-gray-400 font-semibold text-sm">
                {title}
            </div>
            <div className="p-3 space-y-2">
                {children}
            </div>
        </div>
    )
}

export default DashboardCard