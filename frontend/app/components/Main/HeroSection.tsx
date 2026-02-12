"use client";

import { useEffect, useState } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";

const HeroSection = () => {

    const banners = [
        {
            id: 1,
            title: "KİLİT MONTAJLARIMIZ",
            title2: "EN HIZLI SERVİS",
            subTitle: "Yeni kurulan şirketimiz ile hizmetinizdeyiz...",
            buttonText: "Keşfet",
            buttonLink: "#",
            image: "/images/hero-1.webp"
        },
        {
            id: 2,
            title: "ELEKTRONİK KİLİT",
            title2: "PARMAK OKUT, KİLİT UNUT!",
            subTitle: "ALT BAŞLIK 2!",
            buttonText: "Detaylar",
            buttonLink: "/urunlerimiz",
            image: "/images/hero-2.jpg"
        },
        {
            id: 3,
            title: "OTELLERE MONTAJ&BAKIM",
            title2: "SERVİSLERİMİZ",
            subTitle: "ALT BAŞLIK 3!",
            buttonText: "Hemen İncele",
            buttonLink: "#",
            image: "/images/banner-3.jpg"
        }
    ];

    const router = useRouter();

    const [active, setActive] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % banners.length)
        }, 5000)

        return () => clearInterval(interval)
    }, []);

    const prevSlider = () => {
        setActive((prev) =>
            prev === 0 ? banners.length - 1 : prev - 1
        )
    }

    const nextSlider = () => {
        setActive((prev) =>
            prev === banners.length - 1 ? 0 : prev + 1
        )
    }

    return (
        <section className="relative w-full h-125 md:h-135 lg:h-145 xl:h-155 2xl:h-[90vh] overflow-hidden">
            {banners.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === active ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >

                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full bg-cover bg-center object-cover"
                    />

                    <div className="absolute inset-0 bg-black/70"></div>

                    <div className="absolute z-30 inset-0 flex items-center justify-between">
                        <button onClick={prevSlider}>
                            <IoIosArrowBack className="text-white cursor-pointer" size={50} />
                        </button>
                        <div className="container flex mb-0 md:mb-24 lg:mb-32 items-center justify-center mx-auto">
                            <div className="text-center  text-shadow-black  text-white text-shadow-lg  px-4 max-w-2xl">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl  2xl:text-7xl font-bold mb-2 animate-fadeUp [animation-delay:0.1s]">
                                    {item.title}
                                </h1>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl  2xl:text-7xl font-bold mb-4 animate-fadeUp [animation-delay:0.25s]">
                                    {item.title2}
                                </h1>

                                <p className="text-lg md:text-xl lg:text-2xl mb-6 mt-10 opacity-60 animate-fadeUp [animation-delay:0.4s]">
                                    {item.subTitle}
                                </p>

                                <a
                                    href={item.buttonLink}
                                    className="inline-block bg-yellow-500 cursor-pointer px-6 py-3 mt-6 text-xs uppercase tracking-wider rounded-sm font-bold text-white animate-fadeUp [animation-delay:0.55s]"
                                >
                                    {item.buttonText}
                                </a>

                            </div>

                        </div>

                        <button onClick={nextSlider}>
                            <IoIosArrowForward className="text-white cursor-pointer" size={50} />
                        </button>


                        <div className="absolute bottom-4 cursor-pointer md:bottom-28 lg:bottom-34 z-30 left-1/2 -translate-x-1/2 flex gap-3 ">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActive(index)}
                                    className={`w-4 h-2 rounded-full cursor-pointer  transition ${index === active ? "bg-yellow-500" : "bg-white/40"}`}
                                />
                            ))}
                        </div>


                        <div className="w-full hidden md:block absolute bottom-0 py-5 z-50 lg:py-8 bg-linear-to-t from-gray-950 to-gray-500/30">
                            <div className="container px-4 mx-auto">
                                <div className="flex items-center justify-between">
                                    <span>
                                        <h2 className="tracking-wider font-semibold text-sm lg:text-lg text-white text-shadow-sm text-shadow-black">Elektronik kilit ve kasa tamirleri için iletişime geçin</h2>
                                    </span>

                                    <span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.push('/iletisim')
                                            }}
                                            className="border-2 rounded-xl cursor-pointer  duration-300 ease-in-out transition-all p-2 hover:bg-yellow-500 bg-yellow-600 border-hidden text-white text-shadow-black text-shadow-sm tracking-wider text-sm px-4 py-2.5 font-extrabold"
                                        >
                                            <h2>İletişime Geç</h2>
                                        </button>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ))}

        </section>
    )
}

export default HeroSection
