"use client"

import { useState } from "react";
import { IRegisterInput } from "../types/authTypes";
import { authServices } from "../services/authServices";
import { useRouter } from "next/navigation";


const RegisterForm = () => {

    const router = useRouter();

    const [registerData, setRegisterData] = useState<IRegisterInput>({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [successMessage, setSuccessMessage] = useState<string>("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    }


    const validateForm = (): boolean => {

        if (!registerData.email.trim()) {
            setError("E-Mail Adresi Zorunludur!");
            return false;
        }

        if (!registerData.username.trim()) {
            setError("Kullanıcı adı Zorunludur!");
            return false;
        }

        if (!registerData.password.trim()) {
            setError("Şifre belirlemek Zorunludur!");
            return false;
        }

        if (registerData.password.length < 8 || registerData.password.length > 15) {
            setError("Şifreniz 8-15 karakter uzunluğunda olmalıdır!");
            return false;
        }
        return true;

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        validateForm();

        try {
            const response = await authServices.register(registerData);
            console.log("RES : ", response);
            if (response.success && response.data) {
                console.log("Kayıt Başarılı");
                console.log("RESPONSE DATA: ", response.data);
                setSuccessMessage("Kayıt Başarılı Oldu! Hoşgeldiniz!");
                setRegisterData({
                    username: '',
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: ''
                });
                const timer = setTimeout(() => {
                    router.push('/giris')
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                console.log("Kayıt Başarısız!")
                setError("Kayıt Başarısız Oldu!")
            }
        } catch (error: any) {
            setError("Kayıt işlemi başarısız oldu");
        } finally {
            setLoading(false);
            setSuccessMessage("");
            setError("");
        }
    }

    if (error) {
        return (
            <div>

            </div>
        )
    }


    return (
        <div>
            <div className="border min-w-md border-gray-300 rounded-lg p-5 bg-zinc-200">
                <form onSubmit={handleSubmit} className="cursor-pointer" method="post">
                    <div className="w-full flex flex-col items-center justify-center gap-4">

                        <div className="my-4 w-full text-center bg-emerald-200 py-6 border-dashed border-2">
                            <h1 className="font-extrabold text-3xl">
                                Kayıt Ol
                            </h1>
                        </div>


                        <div className="flex items-center justify-center flex-1 w-full gap-4">
                            <div className="flex items-start w-full flex-col gap-2">
                                <label className="font-bold" htmlFor="firstName">Ad</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={registerData.firstName}
                                    onChange={handleChange}
                                    className="border-2 w-full rounded-lg border-gray-300 text-sm px-4 p-3"
                                    placeholder="Adınız"
                                    required
                                />
                            </div>


                            <div className="flex items-start w-full flex-col gap-2">
                                <label className="font-bold" htmlFor="lastName">Soyad</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={registerData.lastName}
                                    onChange={handleChange}
                                    className="border-2 w-full rounded-lg border-gray-300 text-sm px-4 p-3"
                                    placeholder="Soyadınız"
                                    required
                                />
                            </div>
                        </div>


                        <div className="flex items-start w-full flex-col gap-2">
                            <label className="font-bold" htmlFor="email">E-Mail Adresi</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={registerData.email}
                                onChange={handleChange}
                                className="border-2 w-full rounded-lg border-gray-300 text-sm px-4 p-3"
                                placeholder="E-Mail Adresinizi Giriniz."
                                required
                            />
                        </div>

                        <div className="flex items-start w-full flex-col gap-2">
                            <label className="font-bold" htmlFor="username">Kullanıcı Adı</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={registerData.username}
                                onChange={handleChange}
                                className="border-2 rounded-lg w-full border-gray-300 text-sm px-4 p-3"
                                placeholder="Kullanıcı Adınızı Giriniz."
                                required
                            />
                        </div>

                        <div className="flex w-full items-start flex-col gap-2">
                            <label className="font-bold" htmlFor="password">Şifreniz</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={registerData.password}
                                onChange={handleChange}
                                className="border-2 rounded-lg w-full border-gray-300 text-sm px-4 p-3"
                                placeholder="Şifrenizi Giriniz."
                                required
                                maxLength={15}
                                minLength={8}
                            />
                        </div>


                        {successMessage ? (
                            <div className="p-2">
                                <p className="text-emerald-500">
                                    {successMessage}
                                </p>
                            </div>

                        ) : null}

                        <div className="flex w-full items-center  justify-center gap-6">
                            <button onClick={() => {
                                setRegisterData({
                                    username: '',
                                    email: '',
                                    password: '',
                                    firstName: '',
                                    lastName: ''
                                });
                            }} className="p-2 rounded-lg w-full cursor-pointer border bg-yellow-500  text-white text-shadow-black text-shadow-sm font-bold px-4 border-hidden" type="reset">
                                Temizle
                            </button>


                            <button type="submit" disabled={loading} className="p-2 w-full cursor-pointer rounded-lg border border-hidden bg-emerald-500 text-shadow-black text-shadow-sm text-white font-bold px-4">
                                {
                                    loading ? (
                                        <div>
                                            Kayıt Olunuyor...
                                        </div>
                                    ) : <div>
                                        Kayıt Ol
                                    </div>
                                }
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}


export default RegisterForm