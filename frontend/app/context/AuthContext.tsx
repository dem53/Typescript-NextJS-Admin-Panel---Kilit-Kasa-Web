"use client";

import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import userServices from "../services/userServices";
import { IUser } from "../types/userType";
import { cartServices } from "../services/cartServices";

interface IAuthContext {
    user: IUser | null;
    auth: boolean;
    authLoading: boolean;
    cartLength: number;
    loginUser: () => Promise<IUser | null>;
    logOutUser: () => void;
    updateCartLength: () => Promise<void>;
}


const AuthContext = createContext<IAuthContext | null>(null);

interface IAuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {

    const router = useRouter();

    const [user, setUser] = useState<IUser | null>(null);
    const [auth, setAuth] = useState<boolean>(false);
    const [cartLength, setCartLength] = useState<number>(0);
    const [authLoading, setAuthLoading] = useState(true);
    const [err, setErr] = useState<null | string>(null);

    const fetchUser = async (): Promise<IUser | null> => {
        setAuthLoading(true);
        try {
            const res = await userServices.getMe();
            if (res.success && res.data) {
                setAuth(true);
                setUser(res.data);
                return res.data;
            } else {
                setErr(res.message || res.error || 'Kullanıcı bilgileri alınamadı!');
                setUser(null);
                setAuth(false);
                return null;
            }
        } catch (error: any) {
            console.error("AuthContext fetchUser error:", error);
            setAuth(false);
            setUser(null);
            return null;
        } finally {
            setAuthLoading(false);
        }
    }

    const logOutUser = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/cikis", {
                method: "POST",
                credentials: "include"
            });

            const data = await res.json();

            if (data.success) {
                setUser(null);
                setAuth(false);
                router.replace('/');
            } else {
                console.error("Logout başarısız:", data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const fetchCartLength = async () => {
        try {
            const res = await cartServices.getCartSession();
            if (res.status && res.data) {
                setCartLength(res.data.totalItems);
            } else {
                setErr(res.message || res.error || 'Sepet sayısı getirilemedi!');
            }
        } catch (error) {
            console.error('Sepet verisi getirilemedi!');
        }
    }

    useEffect(() => {
        fetchUser();
        fetchCartLength();
    }, []);

    return (
        <AuthContext.Provider value={{ user, auth, cartLength, authLoading, loginUser: fetchUser, logOutUser: logOutUser, updateCartLength: fetchCartLength }}>
            {children}
        </AuthContext.Provider>
    )
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("Auth context bulunamadı!");
    return context;
}


