"use client"

import userServices from "@/app/services/userServices";
import { ICreateUser, IUserRole } from "@/app/types/userType";
import { useState } from "react";

interface ICreateUserForm {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}


export const CreateUserForm: React.FC<ICreateUserForm> = ({ isOpen, onClose, onSuccess }) => {

    if (!isOpen) return null;

    const [createUserData, setCreateUserData] = useState<ICreateUser>({
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
        setCreateUserData({
            ...createUserData,
            [e.target.name]: e.target.value
        });
    }


    const validateForm = (): boolean => {
        if (!createUserData.username.trim()) {
            setError('Kullanıcı adı girilmesi zorunludur!');
            return false;
        }

        if (!createUserData.email.trim()) {
            setError('E-Mail adresi girilmesi zorunludur!');
            return false;
        }

        if (!createUserData.password.trim()) {
            setError('Şifre belirtilmesi zorunludur!');
            return false;
        }

        if (createUserData.password.length < 8) {
            setError('Şifre karakter uzunluğu 8 karakterden az olamaz!');
            return false;
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        if (!validateForm()) {
            setError("Lütfen zorunlu alanları doldurunuz.");
            return false;
        }

        try {
            const response = await userServices.createUser(createUserData);
            if (response.success && response.data) {
                setMessage("Kullanıcı başarıyla oluşturuldu!");
                setCreateUserData({
                    username: '',
                    isAdmin: false,
                    password: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    role: IUserRole.CUSTOMER
                });
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Kullanıcı oluşturulurken hata meydana geldi!');
            }
        } catch (error: any) {
            setError('Kullanıcı oluşturulamadı! Lütfen tekrar deneyiniz!' + error);
        } finally {
            setLoading(false);
        }
    }



    return (

        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/35 z-50">
            <div className="p-5 rounded-lg bg-white flex relative flex-col min-w-md items-center justify-center">
                <span onClick={onClose} className="absolute cursor-pointer top-1 font-extrabold bg-red-500 text-white  px-2 rounded-sm right-1">X</span>
                <div className="flex items-start w-full my-2">
                    <h2 className="font-bold text-2xl border-b pb-2 w-full mb-3"> + Kullanıcı Ekle</h2>
                </div>

                <form className="w-full space-y-4" onSubmit={handleSubmit} method="post">

                    <div className="w-full flex items-center justify-center flex-1 gap-4">
                        <div className="flex flex-col gap-2 flex-1 items-start justify-center">
                            <label className="font-semibold text-sm" htmlFor="firstName">Ad <strong className="text-red-500">*</strong></label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                className="p-2 border w-full border-gray-300 text-sm rounded-lg"
                                placeholder="Ad"
                                value={createUserData.firstName}
                                onChange={handleChange}
                            />
                        </div>



                        <div className="flex flex-col gap-2 flex-1 items-start justify-center">
                            <label className="font-semibold text-sm" htmlFor="lastName">Soyad <strong className="text-red-500">*</strong></label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                className="p-2 border w-full border-gray-300  text-sm rounded-lg"
                                placeholder="Soyad"
                                value={createUserData.lastName}
                                onChange={handleChange}
                            />
                        </div>

                    </div>



                    <div className="flex flex-col gap-2 items-start justify-center">
                        <label className="font-semibold text-sm" htmlFor="username">Kullanıcı Adı <strong className="text-red-500">*</strong></label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="p-2 border w-full border-gray-300 text-sm rounded-lg"
                            placeholder="Kullanıcı adını giriniz."
                            value={createUserData.username}
                            onChange={handleChange}
                        />
                    </div>


                    <div className="flex flex-col gap-2 items-start justify-center">
                        <label className="font-semibold text-sm" htmlFor="email">E-Mail Adresi <strong className="text-red-500">*</strong></label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="p-2 border w-full border-gray-300 text-sm rounded-lg"
                            placeholder="E-Mail adresi giriniz."
                            value={createUserData.email}
                            onChange={handleChange}
                        />
                    </div>


                    <div className="flex flex-col gap-2 items-start justify-center">
                        <label className="font-semibold text-sm" htmlFor="password">Şifre <strong className="text-red-500">*</strong></label>
                        <input
                            type={'password'}
                            name="password"
                            id="password"
                            className="p-2 border w-full border-gray-300 text-sm rounded-lg"
                            placeholder="Şifreyi giriniz."
                            value={createUserData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-start gap-1 flex-col">
                        <label className="text-sm font-semibold" htmlFor="role">Kullanıcı Rolü</label>
                        <select
                            name="role"
                            id="role"
                            value={createUserData.role}
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
                        createUserData.role === IUserRole.ADMIN && (
                            <div className="flex items-center justify-start my-4 ml-1 gap-2">
                                <label className="font-semibold text-sm" htmlFor="isAdmin">Master Admin <strong className="text-gray-500">?</strong></label>
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    id="isAdmin"
                                    className="p-2"
                                    checked={createUserData.isAdmin}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                                />
                            </div>
                        )
                    }


                    <div className="w-full flex items-center justify-center gap-4">

                        <button type="reset" onClick={() => setCreateUserData({
                            username: '',
                            password: '',
                            email: '',
                            isAdmin: false,
                            firstName: '',
                            lastName: '',
                            role: IUserRole.CUSTOMER
                        })} className="py-2 px-2 w-full bg-amber-500 text-white font-bold text-center rounded-md">
                            <h2>Temizle</h2>
                        </button>


                        <button type="submit" className="py-2 px-2 w-full bg-emerald-500 text-white font-bold text-center rounded-md">
                            Oluştur
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )

}



export default CreateUserForm