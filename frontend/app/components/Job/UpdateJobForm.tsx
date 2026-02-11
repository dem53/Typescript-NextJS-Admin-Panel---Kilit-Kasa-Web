"use client";

import { jobServices } from "@/app/services/jobServices";
import { IJob, IUpdateJob, JobPaymentStatus, JobStatus } from "@/app/types/jobTypes";
import { useEffect, useState } from "react";

interface IUpdateJobFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    data?: Partial<IJob>
}


export const UpdateJobForm: React.FC<IUpdateJobFormProps> = ({ isOpen, onClose, onSuccess, id, data }) => {

    if (!data || !isOpen) return null;

    const [updateJobData, setUpdateJobData] = useState<IUpdateJob>({
        price: 5000,
        jobStatus: JobStatus.SUCCESS,
        jobPaymentStatus: JobPaymentStatus.SUCCESS,
        personelNote: 'İşlem yapıldı! ödeme alındı!'
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (data && isOpen && id) {
            setUpdateJobData({
                price: data.price ?? 0,
                jobStatus: data.jobStatus ?? JobStatus.PENDING,
                jobPaymentStatus: data.jobPaymentStatus ?? JobPaymentStatus.PENDING,
                personelNote: data.personelNote ?? ''
            });
        }
    }, [isOpen, data, id]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setUpdateJobData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage("");


        try {

            if (!id) {
                setError('ID Bulunamadı!');
                setLoading(false);
                return;
            }

            const data: IUpdateJob = {
                price: updateJobData.price,
                jobStatus: updateJobData.jobStatus,
                jobPaymentStatus: updateJobData.jobPaymentStatus,
                personelNote: updateJobData.personelNote
            }


            const response = await jobServices.updateJob(data, id as string);

            if (!response || !response.success) {
                throw new Error('Güncelleme yapılamadı');
            }

            if (response && response.success) {
                console.log("RESPONSE : ", response);
                setMessage(response.message ? response.message : 'İş form kaydı başarıyla güncellendi');
                setUpdateJobData({
                    price: 0,
                    jobStatus: JobStatus.PENDING || 'pending',
                    jobPaymentStatus: JobPaymentStatus.PENDING || 'pending',
                    personelNote: ''
                });
                onClose();
                onSuccess();
            } else {
                setError(
                    response.error ||
                    response.message ||
                    'İş form kaydı güncellenemedi!'
                );
            }
        } catch (error: any) {
            setError('İş form kaydı güncellenirken hata meydana geldi!' + error.message);
        } finally {
            setLoading(false);
        }
    }


    return (


        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/35">
            <div className="p-5 rounded-lg w-100 bg-white flex relative flex-col items-center justify-center">

                <span onClick={onClose} className="cursor-pointer font-bold absolute top-2 right-2">X</span>
                <form onSubmit={handleSubmit} className="w-full h-full space-y-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Fiyat</label>
                        <input
                            type="number"
                            name="price"
                            value={updateJobData.price}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-sm"
                            min={0}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">İş Durumu</label>
                        <select
                            name="jobStatus"
                            value={updateJobData.jobStatus}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-sm"
                        >
                            <option value={JobStatus.PENDING}>Beklemede</option>
                            <option value={JobStatus.READY}>Hazır</option>
                            <option value={JobStatus.SUCCESS}>Tamamlandı</option>
                            <option value={JobStatus.FAILED}>Başarısız</option>
                            <option value={JobStatus.CANCELLED}>İptal</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Ödeme Durumu</label>
                        <select
                            name="jobPaymentStatus"
                            value={updateJobData.jobPaymentStatus}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-sm"
                        >
                            <option value={JobPaymentStatus.PENDING}>Beklemede</option>
                            <option value={JobPaymentStatus.SUCCESS}>Ödendi</option>
                            <option value={JobPaymentStatus.FAILED}>Ödenmedi</option>
                            <option value={JobPaymentStatus.CANCELLED}>İptal</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Personel Notu</label>
                        <textarea
                            name="personelNote"
                            value={updateJobData.personelNote}
                            onChange={handleChange}
                            className="border rounded-lg p-2 text-sm min-h-20"
                            placeholder="Yapılan işlem hakkında not..."
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    {message && (
                        <p className="text-green-600 text-sm">{message}</p>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 mt-2 bg-green-600 text-white font-semibold rounded-lg disabled:opacity-60"
                    >
                        {loading ? 'Güncelleniyor...' : 'Güncelle'}
                    </button>

                </form>

            </div>
        </div>
    )
}


export default UpdateJobForm;