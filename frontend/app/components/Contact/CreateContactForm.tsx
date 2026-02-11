"use client";

import { useState } from "react";
import { ICreateContact } from "@/app/types/contactTypes";
import { contactServices } from "@/app/services/contactServices";
import { validateCharacter, validateNumber } from "@/app/utils/validate";


interface ICreateContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}


export const CreateContactForm: React.FC<ICreateContactFormProps> = ({ isOpen, onClose, onSuccess }) => {

    if (!isOpen) return null;

    const [createContact, setCreateContact] = useState<ICreateContact>({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        message: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        if(name === 'phone'){
            if (!validateNumber(value)){
                setError("Telefon alanına sadece rakam girilebilir!");
                return;
            } else {
                setError("");
            }
        }

        if (name === 'name' || name === 'lastname'){
            if(!validateCharacter(value)){
                setError("Ad-Soyad alanına sadece harf girilebilir!");
                return;
            } else {
                setError("");
            }
        }

        setCreateContact((prev) => ({
            ...prev,
            [name]: value,
        }))
    }


    const validateForm = (): boolean => {

        if (!createContact.email.trim() || !createContact.lastname.trim() || !createContact.message.trim() || !createContact.name.trim() || !createContact.phone.trim()) {
            setError("Lütfen zorunlu alanları doldurunuz!");
            return false;
        }

        if (createContact.message.length < 10) {
            setError("Lütfen minimum 10 karakterden oluşan mesaj gönderiniz!");
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
            setError("Lütfen zorunlu alanları doldurunuz!");
            return false;
        }


        try {
            const response = await contactServices.createContact(createContact);
            console.log("RESPONSE : ", response);
            if (response.success && response.data) {
                setMessage("İletişim form kaydı başarıyla oluşturuldu!");
                setCreateContact({
                    name: '',
                    lastname: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'İletişim form kaydı oluşturulurken hata!');
            }
        } catch (error) {
            setError('İletişim form kaydı oluşturulamadı! Lütfen tekrar deneyiniz!');
        } finally {
            setLoading(false);
        }
    }


    return (

        <div className="flex items-center justify-center fixed top-0 left-0 bottom-0 right-0 z-50 bg-black/35">
            <form onSubmit={handleSubmit} method="POST">
                <div className="min-w-lg bg-zinc-50 p-7 rounded-lg space-y-4 flex flex-col items-center justify-center">

                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={createContact.name}
                        onChange={handleChange}
                        placeholder="Adınız"
                        className="p-2 rounded-lg w-full border-2 border-gray-300"
                        required
                    />


                    <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={createContact.lastname}
                        onChange={handleChange}
                        placeholder="Soy Adınız"
                        className="p-2 rounded-lg w-full border-2 border-gray-300"
                        required
                    />



                    <input
                        type="text"
                        name="phone"
                        maxLength={11}
                        id="phone"
                        value={createContact.phone}
                        onChange={handleChange}
                        placeholder="Telefon"
                        className="p-2 rounded-lg w-full border-2 border-gray-300"
                        required
                    />


                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={createContact.email}
                        onChange={handleChange}
                        placeholder="E-Mail Adresi"
                        className="p-2 rounded-lg w-full border-2 border-gray-300"
                        required
                    />




                    <input
                        type="text"
                        name="message"
                        id="message"
                        value={createContact.message}
                        onChange={handleChange}
                        placeholder="Mesajınız"
                        className="p-2 pb-24 rounded-lg w-full border-2 border-gray-300"
                        required
                    />



                    <button
                        type="submit"
                        className="w-full py-3 px-2 cursor-pointer rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed bg-green-500 text-white text-center font-bold"
                    >
                        { loading ? (
                            <span>Gönderiliyor...</span>
                        ) : (
                            <span>Gönder</span>
                        )}
                    </button>


                    <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 px-2 cursor-pointer bg-gray-500 text-white font-bold text-center font-sans rounded-lg"
                    >
                        <span>Kapat</span>
                    </button>

                </div>

            </form>
        </div>

    )
}


export default CreateContactForm