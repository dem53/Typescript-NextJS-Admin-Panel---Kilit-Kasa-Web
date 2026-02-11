"use client";

import userServices from "@/app/services/userServices";
import { IUpdateUser, IUser, IUserRole } from "@/app/types/userType";
import { useState, useEffect } from "react";

interface IUpdateUserForm {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    userData?: Partial<IUser>;
}


export const UpdateUserForm: React.FC<IUpdateUserForm> = ({ isOpen, onClose, onSuccess, id, userData }) => {

    if (!isOpen || !userData) return null;

    useEffect(() => {
        if (isOpen && userData) {
            setUpdateUserData({
                username: userData.username || '',
                email: userData.email || '',
                password: userData.password || '',
                isAdmin: userData.isAdmin || false,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                role: userData.role || IUserRole.CUSTOMER
            });
        }
    }, [isOpen, userData]);

    const [updateUserData, setUpdateUserData] = useState<IUpdateUser>({
        username: '',
        email: '',
        password: '',
        isAdmin: false,
        firstName: '',
        lastName: '',
        role: IUserRole.CUSTOMER
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUpdateUserData({
            ...updateUserData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await userServices.updateUser(id as string, updateUserData);
            if (response.success) {
                setMessage("Kullanıcı başarıyla güncellendi!");
                setUpdateUserData({
                    username: '',
                    email: '',
                    password: '',
                    isAdmin: false,
                    firstName: '',
                    lastName: '',
                    role: IUserRole.CUSTOMER
                });
                onClose();
                onSuccess();
            } else {
                setError(response.message || response.error || 'Kullanıcı güncellenirken hata meydana geldi!');
            }
        } catch (error: any) {
            setError("Kullanıcı güncellenemedi" + error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center z-50 justify-center bg-black/40">
            <div className="p-5 rounded-md bg-white flex relative flex-col items-center justify-center w-100 mx-6">
                <span onClick={onClose} className="absolute cursor-pointer top-0 text-lg font-bold right-2">x</span>
                <form className="w-full space-y-3" onSubmit={handleSubmit} method={'post'}>

                    <div className="flex items-center justify-center w-full gap-4">

                        <div className="flex flex-col flex-1 items-start gap-2">
                            <label htmlFor="firstName">Adı</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={updateUserData.firstName}
                                onChange={handleChange}
                                className="p-2 border-2 border-gray-300 rounded-lg w-full "
                            />
                        </div>


                        <div className="flex flex-col flex-1 items-start gap-2">
                            <label htmlFor="lastName">Soyad</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={updateUserData.lastName}
                                onChange={handleChange}
                                className="p-2 border-2 border-gray-300 rounded-lg w-full "
                            />
                        </div>

                    </div>



                    <div className="flex flex-col items-start gap-2">
                        <label htmlFor="username">Kullanıcı Adı</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={updateUserData.username}
                            onChange={handleChange}
                            className="p-2 border-2 border-gray-300 rounded-lg w-full "
                        />
                    </div>


                    <div className="flex flex-col items-start gap-2">
                        <label htmlFor="email">E-Mail Adresi</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={updateUserData.email}
                            onChange={handleChange}
                            className="p-2 border-2 border-gray-300 rounded-lg w-full "
                        />
                    </div>


                    <div className="flex flex-col items-start gap-2">
                        <label htmlFor="password">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={updateUserData.password}
                            onChange={handleChange}
                            className="p-2 border-2 border-gray-300 rounded-lg w-full "
                        />
                    </div>


                    <div className="flex items-start gap-1 flex-col">
                        <label className="text-sm font-semibold" htmlFor="role">Kullanıcı Rolü</label>
                        <select
                            name="role"
                            id="role"
                            value={updateUserData.role}
                            onChange={handleChange}
                            required
                            className="p-1 border px-2 py-2 border-gray-300 rounded-lg text-sm"
                        >
                            <option value={IUserRole.CUSTOMER}>Müşteri</option>
                            <option value={IUserRole.PERSONEL}>Personel</option>
                            <option value={IUserRole.MANAGER}>Yönetici</option>
                            <option value={IUserRole.ADMIN}>Admin</option>
                        </select>
                    </div>



                    {
                        updateUserData.role === IUserRole.ADMIN && (
                            <div className="flex items-center justify-start my-4 ml-1 gap-2">
                                <label className="font-semibold text-sm" htmlFor="isAdmin">Master Admin <strong className="text-gray-500">?</strong></label>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    id="isAdmin"
                                    className="p-2"
                                    checked={updateUserData.isAdmin}
                                    onChange={(e) => setUpdateUserData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                                />
                            </div>
                        )
                    }

                    <div>
                        <button type="submit" className="w-full cursor-pointer font-semibold hover:bg-emerald-600 duration-500 ease-in-out py-2 px-2 rounded-lg bg-emerald-500 text-white">
                            <h1>Güncelle</h1>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}


export default UpdateUserForm