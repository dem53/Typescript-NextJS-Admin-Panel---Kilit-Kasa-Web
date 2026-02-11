"use client";

import { useEffect, useState } from "react";
import { orderServices } from "@/app/services/orderServices";
import { IOrder, IUpdateStatusOrder, OrderStatus, PaymentStatus } from "@/app/types/orderTypes";


interface IOrderStatusUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    data?: Partial<IOrder>;
}


export const OrderStatusUpdate: React.FC<IOrderStatusUpdateProps> = ({ isOpen, onClose, onSuccess, id, data }) => {

    if (!data || !isOpen) return null;

    const [updateStatusOrder, setUpdateStatusOrder] = useState<IUpdateStatusOrder>({
        orderStatus: OrderStatus.PENDING || OrderStatus,
        paymentStatus: PaymentStatus.PENDING || PaymentStatus,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>("");


    const handleChange = (field: keyof IUpdateStatusOrder, value: any) => {
        setUpdateStatusOrder(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const getOrderStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Beklemede';
            case 'success':
                return 'Onaylandı';
            case 'failed':
                return 'Başarısız';
            case 'cancelled':
                return 'İptal';
            case 'ready':
                return 'Hazırlanıyor';
            case 'shipped':
                return 'Teslimatta';
        }
    }

    const getOrderPaymentText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Beklemede';
            case 'success':
                return 'Ödendi';
            case 'failed':
                return 'Ödenmedi';
            case 'cancelled':
                return 'İptal';
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage("");
        try {

            if (!id) {
                throw new Error('Güncellenecek Sipariş ID bulunamadı!');
            }

            console.log("ID : ", id);

            const data: IUpdateStatusOrder = {
                paymentStatus: updateStatusOrder.paymentStatus,
                orderStatus: updateStatusOrder.orderStatus
            }

            const response = await orderServices.updateOrder(id as string, data);
            if (response.success && response.data) {
                setMessage(response.message ? response.message : 'Sipariş Durumu Başarıyla Güncellendi!');
                setUpdateStatusOrder({
                    paymentStatus: PaymentStatus.PENDING,
                    orderStatus: OrderStatus.PENDING
                });
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Sipariş durumu güncellenemedi!');
            }
        } catch (error) {
            setError('Sipariş durumu güncellenirken hata meydana geldi!' + error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (isOpen && data && id) {
            setUpdateStatusOrder({
                paymentStatus: data.paymentStatus || PaymentStatus.PENDING,
                orderStatus: data.orderStatus || OrderStatus.PENDING,
            });
        }
    }, [isOpen, data, id])

    return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/30">
            <form onSubmit={handleSubmit} method="patch" className="mx-4">
                <div className="p-5 bg-zinc-50 relative flex flex-col w-120 items-start justify-center rounded-lg shadow-lg">
                    <span onClick={onClose} className="absolute top-2 right-2 font-bold">X</span>
                    <div className="border-b border-b-gray-300 pb-2 w-full">
                        <h2 className="font-bold text-lg">Sipariş Durumu Güncelleme</h2>
                    </div>


                    <div className="flex w-full items-center border-b pb-2 justify-start mt-3">
                        <span>Sipariş Durumu</span>
                    </div>

                    <div className="grid grid-cols-4  mt-3 gap-2">
                        {Object.values(OrderStatus).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => handleChange("orderStatus", status)}
                                className={` ${updateStatusOrder.orderStatus === status ? 'bg-blue-500 text-center text-white' : 'bg-gray-400 text-center cursor-pointer text-white'} rounded-lg px-2 py-1 `}
                            >
                                {getOrderStatusText(status)}
                            </button>
                        ))}
                    </div>


                    <div className="flex w-full border-b pb-2 items-center justify-start mt-3">
                        <span>Ödeme Durumu</span>
                    </div>


                    <div className="grid grid-cols-4 gap-2 mt-3">
                        {Object.values(PaymentStatus).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => handleChange("paymentStatus", status)}
                                className={` ${updateStatusOrder.paymentStatus === status ? 'bg-blue-500 text-center text-white' : 'bg-gray-400 text-center text-white'} cursor-pointer rounded-lg px-2 py-1 `}
                            >
                                {getOrderPaymentText(status)}
                            </button>
                        ))}
                    </div>


                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-500 text-white text-center rounded-lg"
                        >
                            Güncelle
                        </button>
                    </div>

                </div>
            </form>
        </div>
    )
}


export default OrderStatusUpdate;