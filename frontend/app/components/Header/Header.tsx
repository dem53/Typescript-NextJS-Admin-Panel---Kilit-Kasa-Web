"use client";

import { useEffect, useState } from "react";
import HeaderLogo from "./Logo";
import NavBar from "./NavBar";
import SearchAndCart from "./UserSearchAndCart";
import SideBar from "./SideBar";
import { FaInstagram, FaPhone, FaWhatsapp } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const Header = () => {

    const [showTopHeaderInfo, setShowTopHeaderInfo] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setShowTopHeaderInfo(true);
            } else {
                setShowTopHeaderInfo(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <>
            <div className={`
          fixed top-0 left-0 w-full z-30
          bg-linear-to-r from-amber-800 to-amber-600 text-white text-xs raleway
          transition-all duration-300 ease-linear
          ${showTopHeaderInfo ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}
        `}
            >
                <div className="w-full xl:container mx-auto py-2 flex items-center justify-between px-4">
                    <span className="tracking-wide flex items-center justify-center gap-2">
                        <span className="border p-0.5 border-hidden rounded-lg">
                            <FaInstagram size={15} />
                        </span>

                        <span className="border p-0.5 border-hidden rounded-lg">
                            <FaWhatsapp size={15} />
                        </span>
                    </span>
                    <div className="flex items-center justify-center gap-4">
                        <span className="tracking-wide flex items-center quicksand justify-center gap-2"><FaPhone />0534 992 99 12</span>
                        <span className="tracking-wide hidden lg:flex items-center quicksand justify-center gap-2"><FaMessage /> info@asguardkilitsistemleri.com</span>
                    </div>

                </div>
            </div>


            <header className={`fixed left-0 w-full z-50 bg-zinc-50/95 backdrop-blur-md border-b border-zinc-200 transition-all duration-300 ease-in-out ${showTopHeaderInfo ? "top-8" : "top-0"}`}>
                <div className="xl:container mx-auto px-4 py-5 flex items-center justify-between">

                    <div className="flex lg:hidden">
                        <SideBar />
                    </div>

                    <div className="flex items-center justify-center">
                        <HeaderLogo />
                    </div>


                    <div className="flex items-center gap-6">
                        <NavBar />
                        <SearchAndCart />
                    </div>
                </div>
            </header>

            {/* HEADER OFFSET */}
            <div className="h-24" />
        </>
    );
};

export default Header;
