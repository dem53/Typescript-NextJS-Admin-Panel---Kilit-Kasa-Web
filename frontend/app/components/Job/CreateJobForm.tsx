"use client";

import { jobServices } from "@/app/services/jobServices";
import { ICreateJob, JobPaymentType } from "@/app/types/jobTypes";
import { useState } from "react";

interface ICreateJobFormProps {
    isOpen: boolean;
    onClose: () => void,
    onSuccess: () => void,
}


export const CreateJobForm: React.FC<ICreateJobFormProps> = ({ isOpen, onClose, onSuccess }) => {


    if (!isOpen) return null;

    const [createJob, setCreateJob] = useState<ICreateJob>({
        name: '',
        address: '',
        city: '',
        district: '',
        customer: {
            fullName: '',
            phone: '',
            phone2: '',
        },
        price: 0,
        jobPaymentType: JobPaymentType.CASH,
        adminNote: '',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('customer')) {
            const field = name.split('.')[1];
            setCreateJob(prev => ({
                ...prev,
                customer: {
                    ...prev.customer, [field]: value
                }
            }));
        } else {
            setCreateJob((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleReset = () => {
        setCreateJob({
            name: '',
            address: '',
            city: '',
            district: '',
            customer: {
                fullName: '',
                phone: '',
                phone2: '',
            },
            price: 0,
            jobPaymentType: JobPaymentType.CREDIT_CARD,
            adminNote: '',
        })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage("");

        try {
            const response = await jobServices.createJob(createJob);
            if (response && response.success) {
                setMessage(response.message ? response.message : 'İş tanımı başarıyla oluşturuldu');
                handleReset();
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'İş tanımı oluşturulurken hata meydana geldi!');
            }
        } catch (error: any) {
            setError('İş tanımı oluşturulurken hata meydana geldi!' + error.message);
            console.error('İş tanımı oluşturulamadı!' + error.message);
        } finally {
            setLoading(false);
        }
    }


    const cityDistrict: Record<string, string[]> = {
        Antalya: ['Muratpasa', 'Kepez', 'Kemer', 'Alanya'],
        Burdur: ['Burdur1', 'Burdur2'],
        Isparta: ['Merkez', 'Eğirdir'],
        Denizli: ['Merkez', 'Pamukkale'],
        Mersin: ['Merkez', 'Tarsus'],
    }

    return (

        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/35 z-50">
            <div className="p-5 rounded-lg w-130 mx-6 bg-white shadow-xl relative flex flex-col items-center justify-center">
                <span onClick={onClose} className="absolute top-2 right-2 cursor-pointer font-bold">X</span>
                <form onSubmit={handleSubmit} method="post" className="w-full space-y-4 h-full">

                    <div className="flex items-start text-sm flex-col gap-1">
                        <label htmlFor="name">İş Tanımı <strong className="text-red-500">*</strong></label>
                        <input
                            type="text"
                            className="border-2 p-2 text-sm  w-full rounded-lg border-gray-300 "
                            value={createJob.name}
                            onChange={handleChange}
                            required
                            placeholder="İş Tanımını Giriniz"
                            name="name"
                            id="name"
                            title="İş Tanımı"
                        />
                    </div>

                    <div className="flex items-start text-sm flex-col gap-1">
                        <label htmlFor="name">İş Adresi <strong className="text-red-500">*</strong></label>
                        <input
                            type="text"
                            className="border-2 p-2 text-sm w-full rounded-lg border-gray-300 "
                            value={createJob.address}
                            onChange={handleChange}
                            placeholder="Yapılacak İş Adresi Giriniz"
                            name="address"
                            id="address"
                            title="İş Adres Tanımı"
                            required
                        />
                    </div>


                    <div className="my-2 flex flex-row items-center gap-2 justify-start">


                        <div className="flex items-start text-sm flex-col gap-1">
                            <label htmlFor="city">İl <strong className="text-red-500">*</strong></label>
                            <select
                                name="city"
                                id="city"
                                disabled={!createJob.address || createJob.address.length < 10}
                                value={createJob.city}
                                required
                                className="border rounded-lg disabled:cursor-not-allowed cursor-pointer disabled:opacity-50 border-gray-300 p-2 text-sm"
                                onChange={handleChange}>
                                <option value="">İl Seçiniz</option>
                                <option value="Antalya">Antalya</option>
                                <option value="Burdur">Burdur</option>
                                <option value="Isparta">Isparta</option>
                                <option value="Denizli">Denizli</option>
                                <option value="Mersin">Mersin</option>
                            </select>
                        </div>




                        <div className="flex items-start text-sm flex-col gap-1">
                            <label htmlFor="district">İlçe <strong className="text-red-500">*</strong></label>
                            <select
                                disabled={!createJob.city}
                                name="district"
                                id="district"
                                value={createJob.district}
                                required
                                className="border rounded-lg disabled:cursor-not-allowed cursor-pointer disabled:opacity-50  border-gray-300 p-2 text-sm"
                                onChange={handleChange}>
                                <option value="">İlçe Seçiniz </option>
                                {createJob.city &&
                                    cityDistrict[createJob.city]?.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                    </div>


                    <div className="flex flex-col text-sm mt-4 items-start gap-1">
                        <label htmlFor="customer.fullName">İrtibat Ad Soyad <strong className="text-red-500">*</strong></label>
                        <input
                            name="customer.fullName"
                            id="customer.fullName"
                            value={createJob.customer.fullName}
                            onChange={handleChange}
                            placeholder="İrtibat Ad Soyad"
                            className="border-2 p-2 text-sm w-full rounded-lg border-gray-300"
                            required
                            title={'İrtibat Ad Soyad'}
                        />
                    </div>


                    <div className="flex items-center justify-center mt-2 flex-1 gap-4 w-full">
                        <div className="flex flex-col items-start text-sm flex-1 gap-1">
                            <label htmlFor="customer.phone">İrtibat Tel <strong className="text-red-500">*</strong> </label>
                            <input
                                name="customer.phone"
                                id="customer.phone"
                                value={createJob.customer.phone}
                                onChange={handleChange}
                                placeholder="Telefon Numarası"
                                className="border-2 p-2 text-sm w-full rounded-lg border-gray-300"
                                required
                                maxLength={11}
                                title={'Telefon Numarası'}
                            />
                        </div>


                        <div className="flex flex-col items-start text-sm flex-1 gap-1">
                            <label htmlFor="customer.phone2">İrtibat Tel 2 (?)</label>
                            <input
                                name="customer.phone2"
                                id="customer.phone2"
                                value={createJob.customer.phone2}
                                onChange={handleChange}
                                maxLength={11}
                                placeholder="Alternatif Tel Numarası"
                                className="border-2 p-2 text-sm w-full rounded-lg border-gray-300"
                                title={'Alternatif Telefon Numarası'}
                            />
                        </div>
                    </div>


                    <div className="flex items-start flex-col gap-1">
                        <label htmlFor="price">İş Tutarı <strong className="text-red-500">*</strong></label>
                        <input type="text"
                            value={createJob.price}
                            onChange={handleChange}
                            name="price"
                            id="price"
                            className="border-2 w-24 p-2 text-sm rounded-lg border-gray-300"
                            required
                            min={0}
                        />
                    </div>


                    <div className="flex items-start text-sm flex-col gap-1">
                        <label htmlFor="jobPaymentType">Ödeme Tipi <strong className="text-red-500">*</strong></label>
                        <select
                            name="jobPaymentType"
                            id="jobPaymentType"
                            disabled={!createJob.price || createJob.price <= 0}
                            value={createJob.jobPaymentType}
                            onChange={handleChange}
                            className="p-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border-2 border-gray-300 "
                            required
                        >
                            <option value="credit_card">Banka/Kredi Kartı</option>
                            <option value="cash">Nakit Ödeme</option>
                        </select>
                    </div>


                    <div className="flex items-start text-sm flex-col gap-1">
                        <label htmlFor="adminNote">Admin/Yönetici Notu (?)</label>
                        <input type="text" 
                        name="adminNote"
                        id="adminNote"
                        value={createJob.adminNote}
                        onChange={handleChange}
                        className="border-2 pb-16 pt-2 pl-2 w-full rounded-lg border-gray-300"
                        placeholder="İş ile ilgili özel not girebilirsiniz."
                        />
                    </div>

                    <button
                        type="submit"
                        className="py-2 px-2 rounded-lg bg-green-600 text-center text-sm text-white font-semibold"
                        disabled={loading}
                    >
                        İş Oluştur
                    </button>

                </form>
            </div>
        </div>
    )
}


export default CreateJobForm;