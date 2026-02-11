"use client";

import { act, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Package,
    Menu,
    X,
    ChevronRight,
    LogOut
} from "lucide-react";
import Link from "next/link";

import UserContent from "@/app/components/User/UserContent";
import { JSX } from "react/jsx-runtime";
import ContactContent from "@/app/components/Contact/ContactContent";
import ProductContent from "@/app/components/Product/ProductContent";
import OrderContent from "@/app/components/Order/OrderContent";
import { MdHomeRepairService, MdList } from "react-icons/md";
import JobContent from "@/app/components/Job/JobContent";
import { LuClipboardList } from "react-icons/lu";
import DashboardContent from "@/app/components/Dashboard/DashboardContent";
import { useAuth } from "@/app/context/AuthContext";

type AdminModule = "dashboard" | "kullanicilar" | "urunler" | "iletisim" | "siparisler" | "isler";


interface NavItem {
    title: string;
    moduleName: AdminModule;
    icon: JSX.Element;
    color: string;
}

const AdminDashboard = () => {

    const { user, authLoading, auth, loginUser, logOutUser } = useAuth();

    const router = useRouter();
    const [activeModule, setActiveModule] = useState<AdminModule>("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const loggedInUser = await loginUser();
                let admin = loggedInUser?.role?.includes('admin');
                let personel = loggedInUser?.role?.includes('personel');
                let manager = loggedInUser?.role?.includes('manager');
                let customer = loggedInUser?.role?.includes('personel');

                if (!loggedInUser){
                    router.push('/');
                    return;
                }

                if (admin === true || personel === true || manager === true ){
                    router.push('/admin/panel');
                }  else if (customer === true) {
                    router.push('/');
                }

            } catch (error) {
                console.error('Auth token hatası!');
            }
        }

        checkAuth();

    }, [router]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const navBarList: NavItem[] = [
        {
            title: "Genel Bakış",
            moduleName: "dashboard",
            icon: <LayoutDashboard size={20} />,
            color: "text-blue-500"
        },
        {
            title: "Kullanıcılar",
            moduleName: "kullanicilar",
            icon: <Users size={20} />,
            color: "text-red-500"
        },
        {
            title: "Ürünler",
            moduleName: "urunler",
            icon: <Package size={20} />,
            color: "text-purple-500"
        },

        {
            title: "Teknik Servis",
            moduleName: "isler",
            icon: <MdHomeRepairService size={20} />,
            color: "text-blue-500"
        },

        {
            title: "Siparişler",
            moduleName: "siparisler",
            icon: <LuClipboardList size={20} />,
            color: "text-emerald-500"
        },

        {
            title: "İletişimler",
            moduleName: "iletisim",
            icon: <MessageSquare size={20} />,
            color: "text-yellow-500"
        }
    ];

    const modules: Record<AdminModule, JSX.Element> = {
        dashboard: <DashboardContent />,
        kullanicilar: <UserContent />,
        isler: <JobContent />,
        urunler: <ProductContent />,
        siparisler: <OrderContent />,
        iletisim: <ContactContent />,
    };

    const handleModuleChange = (module: AdminModule) => {
        setActiveModule(module);
        if (isMobile) setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b z-40 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X /> : <Menu />}
                    </button>
                    <h1 className="text-lg font-semibold">
                        {navBarList.find(n => n.moduleName === activeModule)?.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm hover:underline">
                        Web Site
                    </Link>
                    <button
                        onClick={logOutUser}
                        className="flex items-center gap-1 text-red-600 text-sm"
                    >
                        <LogOut size={18} />
                        Çıkış
                    </button>
                </div>
            </header>

            <aside
                className={`
                    fixed top-0 left-0 h-screen w-64 bg-gray-800 z-40
                    transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <div className="px-4 py-6">
                    <div className="flex items-center ml-4 gap-3 mb-8">
                        <div>
                            <h2 className="text-white font-bold">Admin Panel</h2>
                            <p className="text-xs text-gray-300">Yönetim Sistemi</p>
                        </div>
                    </div>



                    <nav className="space-y-2">
                        {navBarList.map(item => {

                            if (user?.role === 'personel' && item.moduleName !== 'isler') {
                                return null;
                            }

                            if (user?.role === 'manager' && item.moduleName !== 'dashboard' && item.moduleName !== 'isler' && item.moduleName !== 'siparisler' && item.moduleName !== 'iletisim') {
                                return null;
                            }

                            if (user?.role === 'admin') {
                                return (

                                    <button
                                        key={item.moduleName}
                                        onClick={() => handleModuleChange(item.moduleName)}
                                        className={`
                                    w-full flex items-center justify-between px-4 py-3 rounded-lg
                                    ${activeModule === item.moduleName
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-200 hover:bg-gray-700"
                                            }
                                `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={item.color}>{item.icon}</span>
                                            {item.title}
                                        </div>
                                        {activeModule === item.moduleName && (
                                            <ChevronRight size={16} />
                                        )}
                                    </button>
                                );
                            }

                            return (

                                <button
                                    key={item.moduleName}
                                    onClick={() => handleModuleChange(item.moduleName)}
                                    className={`
                                    w-full flex items-center justify-between px-4 py-3 rounded-lg
                                    ${activeModule === item.moduleName
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-200 hover:bg-gray-700"
                                        }
                                `}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={item.color}>{item.icon}</span>
                                        {item.title}
                                    </div>
                                    {activeModule === item.moduleName && (
                                        <ChevronRight size={16} />
                                    )}
                                </button>
                            );
                        })}
                    </nav>




                </div>
            </aside>

            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <main className={`pt-12 transition-all ${sidebarOpen ? "lg:ml-62" : "lg:ml-0"}`}>
                <div className="p-4 sm:p-6 lg:p-8">
                    {user?.role === 'personel' ? (
                        <div>
                            {modules['isler']}
                        </div>
                    ) : user?.role === 'admin' ? (
                        <div>
                            {modules[activeModule]}
                        </div>
                    ) : user?.role === 'manager' ? (
                        <div>
                            {modules[activeModule]}
                        </div>
                    ) : null}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
