"use client";

import { useState, useEffect } from "react";
import { IContact, IUpdateContact } from "@/app/types/contactTypes";
import { contactServices } from "@/app/services/contactServices";

interface IUpdateContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    data?: Partial<IContact>;
}


export const UpdateContactForm: React.FC<IUpdateContactFormProps> = ({
    isOpen, onClose, onSuccess, id, data
}) => {

    if (!isOpen || !data) return null;

    const [updateContactData, setUpdateContactData] = useState<IUpdateContact>({
        name: '',
        lastname: '',
        message: '',
        phone: '',
        email: '',
        status: false
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");

    useEffect(() => {
        if (isOpen && data) {
            setUpdateContactData({
                name: data.name || '',
                lastname: data.lastname || '',
                message: data.message || '',
                phone: data.phone || '',
                email: data.email || '',
                status: data.status || false
            });
        }
    }, [isOpen, data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateContactData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await contactServices.updateContact(id as string, updateContactData);
            if (response.success && response.data) {
                setMessage("İletişim formu başarıyla güncellendi!");
                onClose();
                onSuccess();
            } else {
                setError(response.message || response.error || 'İletişim form kaydı güncellenirken hata!');
            }
        } catch (error) {
            setError("İletişim form kaydı güncellenemedi! Lütfen tekrar deneyiniz.")
        } finally {
            setLoading(false);
        }
    }


    return (

        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black/35 z-50 flex items-center justify-center">
            <div className="p-5 bg-zinc-200 max-w-lg rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="w-full relative" method="post">

                    <span onClick={onClose} className="absolute -top-4 -right-2 font-bold cursor-pointer">X</span>

                    <div className="flex w-full border-b-2 pb-2 border-gray-400">
                        <h2 className="font-bold font-serif">İletişim formu güncelleme</h2>
                    </div>

                    <div className="flex items-center w-full justify-center gap-2">
                        <div className="flex flex-col flex-1 text-sm mt-4 items-start justify-center gap-1">
                            <label htmlFor="name">Ad</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={updateContactData.name}
                                onChange={handleChange}
                                placeholder={updateContactData.name ? updateContactData.name : 'Ad'}
                                className="p-2 border-2 border-gray-300 w-full cursor-pointer rounded-lg"
                                title="İletişim kaydı gönderici Adı"
                            />
                        </div>

                        <div className="flex flex-col flex-1 text-sm mt-4 items-start justify-center gap-1">
                            <label htmlFor="lastname">Soyad</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={updateContactData.lastname}
                                onChange={handleChange}
                                placeholder={updateContactData.lastname ? updateContactData.lastname : 'Soyad'}
                                className="p-2 border-2 border-gray-300 w-full cursor-pointer rounded-lg"
                                title="İletişim kaydı gönderici Adı"
                            />
                        </div>
                    </div>


                    <div className="flex flex-col flex-1 text-sm mt-4 items-start justify-center gap-1">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={updateContactData.email}
                            onChange={handleChange}
                            placeholder={updateContactData.email ? updateContactData.email : 'E-Mail Adresi'}
                            className="p-2 border-2 border-gray-300 w-full cursor-pointer rounded-lg"
                            title="İletişim kaydı gönderici Adı"
                        />
                    </div>



                    <div className="flex flex-col flex-1 text-sm mt-4 items-start justify-center gap-1">
                        <label htmlFor="phone">Telefon</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={updateContactData.phone}
                            onChange={handleChange}
                            placeholder={updateContactData.phone ? updateContactData.phone : 'Telefon'}
                            className="p-2 border-2 border-gray-300 w-full cursor-pointer rounded-lg"
                            title="İletişim kaydı gönderici Adı"
                        />
                    </div>





                    <div className="flex flex-col flex-1 text-sm mt-4 items-start justify-center gap-1">
                        <label htmlFor="message">Mesaj</label>
                        <input
                            type="text"
                            id="message"
                            name="message"
                            value={updateContactData.message}
                            onChange={handleChange}
                            placeholder={updateContactData.message ? updateContactData.message : 'Mesaj'}
                            className="p-2 pb-24 border-2 border-gray-300 w-full cursor-pointer rounded-lg"
                            title="İletişim kaydı gönderici Adı"
                        />
                    </div>



                    <div className="flex flex-row items-center justify-start mt-2 text-sm font-bold gap-2">
                        <label htmlFor="status">Okundu</label>
                        <input
                            type="checkbox"
                            name="status"
                            id="status"
                            checked={updateContactData.status}
                            onChange={(e) => setUpdateContactData((prev) => ({ ...prev, status: e.target.checked }))}
                        />
                    </div>


                    <div className="w-full mt-2 cursor-pointer">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed ease-in-out duration-500 transition-all
                         rounded-lg text-center text-white border py-2 px-4"
                        >
                            {loading ? (
                                <span><h2>Güncelleniyor...</h2></span>
                            ) :
                                <span><h2>Güncelle</h2></span>
                            }

                        </button>
                    </div>


                </form>
            </div>
        </div>
    )
}


export default UpdateContactForm