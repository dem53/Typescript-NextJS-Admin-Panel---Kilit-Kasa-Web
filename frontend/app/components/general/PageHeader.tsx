"use client";

import { JSX } from "react";

interface IPageHeaderProps {
    title?: string;
    titleColor?: string;
    subTitle?: string;
    subTitleColor?: string;
    count?: string;
    icon?: JSX.Element;
    backGround?: string | null;
    backGroundColor?: string;
}


export const PageHeader: React.FC<IPageHeaderProps> = ({ title, titleColor, subTitleColor, subTitle, count, icon, backGround, backGroundColor }) => {
    return (
        <section
            style={{
                background: `${backGround ? backGround : null}`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
            }}
            className={`p-2 rounded-sm overflow-hidden relative ${backGroundColor} flex border-hidden shadow-lg items-center justify-center h-45 md:h-50 lg:h-60 border xl:container mx-auto `}>

            <div className="flex flex-col absolute h-full  transform mr-8 right-1  items-start justify-center  gap-1">
                <div className="top-4 drop-shadow-2xl border-2 border-gray-300 bg-white/20 rounded-full p-10 drop-shadow-black lg:top-6 ">
                    {icon}
                </div>
                <div className="hidden md:flex mt-2 mr-2 text-sm font-bold text-white items-center justify-center">
                    <h2>{count}</h2>
                </div>
            </div>

            <div className="w-full  h-full flex flex-row p-0 lg:p-2 items-end justify-between">
                <div className="flex flex-col items-start space-y-1 text-white text-shadow-xs text-shadow-black gap-2 justify-center">
                    <span className={`flex items-center ${titleColor} justify-center`}>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl">{title}</h2>
                    </span>
                    <span className={`flex items-center ${subTitleColor} justify-center`}>
                        <h2 className="text-sm md:text-base lg:text-lg xl:text-xl"> {subTitle} </h2>
                    </span>
                </div>
            </div>
        </section>
    )
}