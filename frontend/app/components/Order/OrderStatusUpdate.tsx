"use client";

import { useEffect, useState } from "react";
import { orderServices } from "@/app/services/orderServices";
import { IOrder, IUpdateOrder, OrderStatus, OrderType, PaymentStatus, PaymentType } from "@/app/types/orderTypes";
import {
    X,
    Package,
    CreditCard,
    Truck,
    CheckCircle2,
    AlertCircle,
    Clock,
    RefreshCw,
    User,
    MapPin,
    Phone,
    Mail
} from "lucide-react";
import { FaCheck } from "react-icons/fa";

interface IOrderStatusUpdateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    data?: Partial<IOrder>;
}

const statusConfig = {
    [OrderStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Beklemede' },
    [OrderStatus.SUCCESS]: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Onaylandı' },
    [OrderStatus.FAILED]: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Başarısız' },
    [OrderStatus.CANCELLED]: { color: 'bg-gray-100 text-gray-800', icon: X, label: 'İptal' },
    [OrderStatus.READY]: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Hazırlanıyor' },
    [OrderStatus.SHIPPED]: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Teslimatta' },
};

const paymentStatusConfig = {
    [PaymentStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Beklemede' },
    [PaymentStatus.SUCCESS]: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Ödendi' },
    [PaymentStatus.FAILED]: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Ödenmedi' },
    [PaymentStatus.CANCELLED]: { color: 'bg-gray-100 text-gray-800', icon: X, label: 'İptal' },
};

export const OrderStatusUpdate: React.FC<IOrderStatusUpdateProps> = ({
    isOpen,
    onClose,
    onSuccess,
    id,
    data
}) => {
    const [updateOrder, setUpdateOrder] = useState<IUpdateOrder>({
        customerInfo: {
            name: '',
            surname: '',
            email: '',
            phone: '',
            phone2: '',
            invoiceAddress: '',
            deliveryAddress: '',
            city: '',
            district: ''
        },
        orderType: OrderType.ONLINE,
        paymentType: PaymentType.CASH,
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && data && id) {
            setUpdateOrder({
                paymentStatus: data.paymentStatus || PaymentStatus.PENDING,
                orderStatus: data.orderStatus || OrderStatus.PENDING,
                paymentType: data.paymentType || PaymentType.CASH,
                orderType: data.orderType || OrderType.ONLINE,
                customerInfo: {
                    name: data.customerInfo?.name || '',
                    surname: data.customerInfo?.surname || '',
                    email: data.customerInfo?.email || '',
                    phone: data.customerInfo?.phone || '',
                    phone2: data.customerInfo?.phone2 || '',
                    invoiceAddress: data.customerInfo?.invoiceAddress || '',
                    deliveryAddress: data.customerInfo?.deliveryAddress || '',
                    city: data.customerInfo?.city || '',
                    district: data.customerInfo?.district || ''
                }
            });
            setError(null);
            setSuccessMessage(null);
        }
    }, [isOpen, data, id]);

    const handleStatusChange = (field: keyof IUpdateOrder, value: any) => {
        setUpdateOrder(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdateOrder(prev => ({
            ...prev,
            customerInfo: {
                ...prev.customerInfo,
                [name]: value || ''
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (!id) {
                throw new Error('Güncellenecek sipariş ID bulunamadı!');
            }

            const updatedData: IUpdateOrder = {
                ...updateOrder,
                customerInfo: {
                    name: updateOrder.customerInfo?.name || '',
                    surname: updateOrder.customerInfo?.surname || '',
                    email: updateOrder.customerInfo?.email || '',
                    phone: updateOrder.customerInfo?.phone || '',
                    phone2: updateOrder.customerInfo?.phone2 || '',
                    invoiceAddress: updateOrder.customerInfo?.invoiceAddress || '',
                    deliveryAddress: updateOrder.customerInfo?.deliveryAddress || '',
                    city: updateOrder.customerInfo?.city || '',
                    district: updateOrder.customerInfo?.district || ''
                }
            };

            const response = await orderServices.updateOrder(id, updatedData);

            if (response.success && response.data) {
                setSuccessMessage(response.message || 'Sipariş başarıyla güncellendi!');
                setTimeout(() => {
                    onClose();
                    onSuccess();
                }, 1500);
            } else {
                setError(response.error || response.message || 'Sipariş güncellenemedi!');
            }
        } catch (error) {
            setError('Sipariş güncellenirken bir hata oluştu!');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const OrderStatusIcon = statusConfig[updateOrder.orderStatus as OrderStatus]?.icon || Package;
    const PaymentStatusIcon = paymentStatusConfig[updateOrder.paymentStatus as PaymentStatus]?.icon || CreditCard;


    const handleApproveOrder = async () => {
        try {
            const response = await orderServices.approveOrder(id as string);
            if (response && response.success) {
                setSuccessMessage(response.message ? response.message : 'Sipariş onaylanmış, stok durumu güncellenmiştir!');
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Sipariş onaylanamadı! Hata!')
            }
        } catch (error) {
            setError('Sipariş onaylanamadı!')
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all">

                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Sipariş Güncelleme
                                </h2>
                                <p className="text-sm text-gray-500">
                                    # {data?.orderNumber}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">

                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${statusConfig[updateOrder.orderStatus as OrderStatus]?.color}`}>
                                        <OrderStatusIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Güncel Sipariş Durumu</p>
                                        <p className="font-medium text-gray-900">
                                            {statusConfig[updateOrder.orderStatus as OrderStatus]?.label}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${paymentStatusConfig[updateOrder.paymentStatus as PaymentStatus]?.color}`}>
                                        <PaymentStatusIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Güncel Ödeme Durumu</p>
                                        <p className="font-medium text-gray-900">
                                            {paymentStatusConfig[updateOrder.paymentStatus as PaymentStatus]?.label}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Sipariş Durumu
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                    {Object.values(OrderStatus).map((status) => {
                                        const config = statusConfig[status as OrderStatus];
                                        const Icon = config.icon;
                                        const isSelected = updateOrder.orderStatus === status;

                                        return (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleStatusChange("orderStatus", status)}
                                                className={`
                          flex flex-col items-center p-3 rounded-xl border-2 transition-all
                          ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                <div className={`
                          p-2 rounded-lg mb-2 transition-colors
                          ${isSelected ? 'bg-blue-500 text-white' : config.color}
                        `}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className={`
                          text-xs font-medium
                          ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                        `}>
                                                    {config.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Payment Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Ödeme Durumu
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {Object.values(PaymentStatus).map((status) => {
                                        const config = paymentStatusConfig[status as PaymentStatus];
                                        const Icon = config.icon;
                                        const isSelected = updateOrder.paymentStatus === status;

                                        return (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleStatusChange("paymentStatus", status)}
                                                className={`
                          flex items-center justify-center space-x-2 p-3 rounded-xl border-2 transition-all
                          ${isSelected
                                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                <div className={`
                          p-1.5 rounded-lg transition-colors
                          ${isSelected ? 'bg-blue-500 text-white' : config.color}
                        `}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className={`
                          text-sm font-medium
                          ${isSelected ? 'text-blue-700' : 'text-gray-600'}
                        `}>
                                                    {config.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Customer Information */}
                            {updateOrder.customerInfo && (
                                <div className="border-t-2 border-gray-200 pt-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Müşteri Bilgileri
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">Kişisel Bilgiler</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Ad</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={updateOrder.customerInfo.name || ''}
                                                        onChange={handleCustomerInfoChange}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Ad"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Soyad</label>
                                                    <input
                                                        type="text"
                                                        name="surname"
                                                        value={updateOrder.customerInfo.surname || ''}
                                                        onChange={handleCustomerInfoChange}
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Soyad"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={updateOrder.customerInfo.email || ''}
                                                        onChange={handleCustomerInfoChange}
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="E-posta"
                                                    />
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={updateOrder.customerInfo.phone || ''}
                                                        onChange={handleCustomerInfoChange}
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Telefon"
                                                        maxLength={11}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="font-medium">Adres Bilgileri</span>
                                            </div>

                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={updateOrder.customerInfo.city || ''}
                                                    onChange={handleCustomerInfoChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="İl"
                                                />

                                                <input
                                                    type="text"
                                                    name="district"
                                                    value={updateOrder.customerInfo.district || ''}
                                                    onChange={handleCustomerInfoChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="İlçe"
                                                />

                                                <textarea
                                                    name="deliveryAddress"
                                                    value={updateOrder.customerInfo.deliveryAddress || ''}
                                                    onChange={handleCustomerInfoChange}
                                                    rows={3}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Teslimat Adresi"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {successMessage && (
                                <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <p className="text-sm text-green-600">{successMessage}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Güncelleniyor...
                                    </>
                                ) : (
                                    'Siparişi Güncelle'
                                )}
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 rounded-lg gap-2 inline-flex"
                                onClick={() => handleApproveOrder()}
                            >
                                <span className="bg-white opacity rounded-full p-1">
                                    <FaCheck className="text-emerald-500" />
                                </span>
                                <h2 className="font-bold text-white">
                                    Siparişi Onayla
                                </h2>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderStatusUpdate;