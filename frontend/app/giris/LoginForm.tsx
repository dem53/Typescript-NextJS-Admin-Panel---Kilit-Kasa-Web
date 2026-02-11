"use client";

import { useState } from "react";
import { ILoginInput } from "../types/authTypes";
import { authServices } from "../services/authServices";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export const LoginForm = () => {

    const router = useRouter();

    const [loginForm, setLoginForm] = useState<ILoginInput>({
        username: '',
        password: ''
    });

    const { loginUser, user, auth } = useAuth();
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value
        });
    }


    const validateForm = (): boolean => {

        if (!loginForm.username.trim()) {
            setError("Kullanıcı alanı girilmesi zorunludur!");
            return false;
        }

        if (!loginForm.password.trim()) {
            setError("Şifre alanı girilmesi zorunludur!");
            return false;
        }

        if (loginForm.password.trim().length < 8) {
            setError("Şifreniz 8 karakterden az olamaz. Lütfen kontrol ediniz.");
            return false;
        }

        return true;
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await authServices.login(loginForm);

            if (!response.success) {
                setError(response.message || "Giriş başarısız");
                return;
            }

            const loggedInUser = await loginUser();

            if (!loggedInUser) {
                setError("Kullanıcı bilgileri alınamadı");
                return;
            }

            setMessage("Giriş Başarılı!");

            if (loggedInUser?.role === 'customer') {
                router.push('/');
            } else {
                router.push('/admin/panel');
            }


        } catch (err: any) {
            setError(err?.response?.data?.message || "Giriş yapılamadı");
        } finally {
            setLoading(false);
        }
    };



    if (!auth) return (
        <>
            <div className="w-96 lg:min-w-lg border-2 border-gray-200 backdrop-blur-2xl bg-transparent rounded-lg p-5">

                <form onSubmit={handleSubmit} className="space-y-6" method="post">

                    <div className="mb-8 flex items-center justify-center py-3">
                        <h2 className="font-bold text-white text-shadow-lg text-shadow-black text-2xl lg:text-3xl">Yönetici Girişi</h2>
                    </div>

                    <div className="flex items-start text-white flex-col gap-2">
                        <label htmlFor="username">Kullanıcı Adı</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Kullanıcı Adı"
                            className="p-2 rounded-lg border  focus:outline-0 cursor-pointer w-full"
                            value={loginForm.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex items-start mt-4 relative text-white flex-col gap-2">
                        <label className="text-sm" htmlFor="password">Şifre</label>
                        <div className="relative flex w-full flex-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Şifrenizi Giriniz"
                                className="p-2 rounded-lg border relative focus:outline-0 cursor-pointer  w-full"
                                value={loginForm.password}
                                onChange={handleChange}
                                required
                            ></input>

                            <span className="absolute right-2 top-3">
                                {
                                    showPassword ? (
                                        <FaEyeSlash className="cursor-pointer" onClick={() => setShowPassword(false)} />
                                    ) : (
                                        <FaEye className="cursor-pointer" onClick={() => setShowPassword(true)} />
                                    )
                                }
                            </span>
                        </div>


                    </div>

                    {error ? (
                        <span className="h-12 text-red-500 font-bold">{error}</span>
                    ) : null}



                    <div className="w-full">
                        <button
                            type="submit"
                            className="p-2 bg-emerald-500 cursor-pointer rounded-lg w-full py-3 font-bold text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>Giriş Yapılıyor...</span>
                            ) :
                                <span>Giriş Yap</span>
                            }
                        </button>
                    </div>


                </form>

            </div>

            {message ? (
                <div className="fixed inset-0 top-0 left-0 right-0 bottom-0">
                    <div className="absolute bottom-4 right-4">
                        <div className="bg-emerald-500 rounded-lg p-5 flex items-center justify-center text-center">
                            <h2 className="text-center text-white font-sans font-semibold">
                                {message}
                            </h2>
                        </div>
                    </div>
                </div>
            ) : null}

        </>
    )
}


export default LoginForm