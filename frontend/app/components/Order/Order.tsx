"use client";

import { useState, useEffect, useMemo, JSX } from "react";
import { IOrder } from "@/app/types/orderTypes";
import { orderServices } from "@/app/services/orderServices";
import { FaCheck, FaShippingFast, FaUserCircle, FaEdit, FaBoxOpen, FaMoneyBillWave, FaCreditCard, FaStore } from "react-icons/fa";
import { formatDate } from "@/app/utils/format";
import OrderStatusUpdate from "./OrderStatusUpdate";
import { MdCancel, MdPending, MdRefresh, MdShoppingCart, MdDateRange, MdPayment } from "react-icons/md";
import Pagination from "../general/Pagination";
import { FcCancel, FcShipped } from "react-icons/fc";
import { GoPackageDependencies } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import { FaSearch, FaReceipt } from "react-icons/fa";
import { BsCalendar3, BsGlobe } from "react-icons/bs";
import { BiSolidPackage } from "react-icons/bi";

export const Order = () => {

    const [orderData, setOrderData] = useState<IOrder[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>("");
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
    const [showOrderDetail, setShowOrderDetail] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState('');

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);

    const [showOrderStatusModal, setShowOrderStatusModal] = useState<boolean>(false);

    const fetchOrderData = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        setMessage("");
        try {
            const response = await orderServices.getAllOrder();
            if (response.success && Array.isArray(response.data)) {
                setOrderData(response.data);
                setMessage(response.message ? response.message : 'Siparişler başarıyla getirildi!');
                setTimeout(() => {
                    setMessage("")
                }, 2000);
            } else {
                setError(response.error || response.message || 'Siparişler getirilemedi!');
                setTimeout(() => {
                    setError(null);
                }, 2000);
            }
        } catch (error) {
            setError('Siparişler getirilirken hata ile karşılaşıldı!' + error);
        } finally {
            setLoading(false);
        }
    }


    const orderTypeStatus = (type: string) => {
        switch (type) {
            case 'shop':
                return 'Mağaza';
            case 'online':
                return 'Online';
            default: return '';
        }
    }

    const paymentTypeStatus = (type: string) => {
        switch (type) {
            case 'cash':
                return 'Nakit';
            case 'credit_card':
                return 'Banka/Kredi';
            default:
                return '';
        }
    }

  

    const orderStatus: Record<string, JSX.Element> = {
        pending: <MdPending className='text-yellow-500' size={25} />,
        cancelled: <MdCancel className='text-red-700' size={25} />,
        failed: <FcCancel className='text-red-500' size={25} />,
        success: <FaCheck className='text-emerald-500' size={20} />,
        ready: <GoPackageDependencies className='text-yellow-600' size={20} />,
        shipped: <TbTruckDelivery className='text-blue-500' size={23} />,
    }


    const paymentStatus: Record<string, JSX.Element> = {
        pending: <MdPending className='text-yellow-500' size={25} />,
        cancelled: <MdCancel className='text-red-700' size={25} />,
        failed: <FcCancel className='text-red-500' size={25} />,
        success: <FaCheck className='text-emerald-500' size={20} />
    }


    useEffect(() => {
        fetchOrderData();
    }, []);


    const handleOrderDetail = (data: IOrder) => {
        setShowOrderDetail(true);
        setSelectedOrder(data)
    }


    const handleOrderUpdateStatus = (data: IOrder) => {
        setShowOrderStatusModal(true);
        setSelectedOrder(data);
        setSelectedOrderID(data._id);
    }


    const filteredOrder = useMemo(() => {

        if (!Array.isArray(orderData)) {
            return [];
        }

        return orderData.filter((order) => {

            if (!order) return false;

            const matchesSearch =
                searchTerm === "" ||
                (order.orderNumber.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (order.customerInfo.name.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (order.customerInfo.surname.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (order.customerInfo.phone.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (order.customerInfo.email.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (order.subTotal.toString()).includes(searchTerm.toLowerCase());

            const matchesOrderStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
            const matchesOrderPaymentStatus = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

            const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);

            const matchesDate =
                (!startDate || orderDate >= new Date(startDate).setHours(0, 0, 0, 0)) &&
                (!endDate || orderDate <= new Date(endDate).setHours(23, 59, 59, 999));


            return matchesSearch && matchesOrderStatus && matchesOrderPaymentStatus && matchesDate;
        });


    }, [orderData, searchTerm, statusFilter, paymentFilter, startDate, endDate]);


    const statusList = ['all', ...Array.from(new Set(orderData.map((order) => order.orderStatus)))];
    const paymentList = ['all', ...Array.from(new Set(orderData.map((order) => order.paymentStatus)))];

    const orderStatusText = (status: string) => {
        switch(status){
            case 'all': 
                return 'Tüm Durumlar';
            case 'pending':
                return 'Beklemede';
            case 'ready':
                return 'Hazırlanan';
            case 'shipped':
                return 'Teslimatta';
            case 'success':
                return 'Onaylandı';
            case 'failed': 
                return 'Reddedildi';
            case 'cancelled':
                return 'İptal Edildi';
        }
    }



    const orderPaymentStatusText = (status: string) => {
        switch(status){
            case 'all': 
                return 'Tüm Durumlar';
            case 'pending':
                return 'Beklemede';
            case 'success':
                return 'Onaylandı';
            case 'failed': 
                return 'Reddedildi';
            case 'cancelled':
                return 'İptal Edildi';
        }
    }

    useEffect(() => {
        if (!startDate) {
            setEndDate('');
            return;
        }

        if (endDate && endDate < startDate) {
            setEndDate(startDate);
        }
    }, [startDate, endDate]);


    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return filteredOrder.slice(startIndex, endIndex);

    }, [filteredOrder, currentPage, itemsPerPage]);

    const getOrderStatusBadge = (status: string) => {
        switch(status) {
            case 'success':
                return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
            case 'failed':
                return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
            case 'cancelled':
                return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
            case 'ready':
                return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
            case 'shipped':
                return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    }


    return (

        <>
            <div className="bg-gray-50 min-h-screen">
                
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-md p-3 mb-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                            <MdShoppingCart className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Sipariş Yönetimi</h1>
                            <p className="text-gray-600 mt-1">Siparişleri görüntüleyin, takip edin ve yönetin</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-700 font-medium">Toplam Sipariş</p>
                                    <p className="text-xl font-bold text-blue-900">{orderData.length} adet</p>
                                </div>
                                <MdShoppingCart className="text-blue-500" size={24} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-700 font-medium">Onaylanan</p>
                                    <p className="text-xl font-bold text-green-900">
                                        {orderData.filter(o => o.orderStatus === 'success').length} adet
                                    </p>
                                </div>
                                <FaCheck className="text-green-500" size={24} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700 font-medium">Bekleyen</p>
                                    <p className="text-xl font-bold text-yellow-900">
                                        {orderData.filter(o => o.orderStatus === 'pending').length} adet
                                    </p>
                                </div>
                                <MdPending className="text-yellow-500" size={24} />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-700 font-medium">Teslimat</p>
                                    <p className="text-xl font-bold text-purple-900">
                                        {orderData.filter(o => o.orderStatus === 'shipped').length} adet
                                    </p>
                                </div>
                                <TbTruckDelivery className="text-purple-500" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-md p-3 mb-4">
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="search"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Sipariş Numarası, Teslimat Bilgisi veya Tutara göre arama..."
                            />
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Sipariş Durumu</label>
                            <select
                                id="statusFilter"
                                name="statusFilter"
                                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {statusList.map((status) => (
                                    <option value={status} key={status}>
                                        {orderStatusText(status)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Ödeme Durumu</label>
                            <select
                                name="paymentFilter"
                                id="paymentFilter"
                                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                {paymentList.map((status) => (
                                    <option value={status} key={status}>
                                        {orderPaymentStatusText(status)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <BsCalendar3 size={14} />
                                Başlangıç
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                max={endDate}
                                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <BsCalendar3 size={14} />
                                Bitiş
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                disabled={!startDate}
                                min={startDate}
                                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 opacity-0">Sıfırla</label>
                            <button
                                type="button"
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setStatusFilter('all');
                                    setPaymentFilter('all');
                                }}
                                className="px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <MdRefresh size={20} />
                                Sıfırla
                            </button>
                        </div>
                    </div>

                    {/* Items per page */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 mt-4 w-fit">
                        <span className="text-gray-700 font-medium text-sm">Sayfa başına:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="border-2 border-gray-300 px-3 py-2 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 font-medium"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-gray-700 font-medium text-sm">sipariş</span>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <FaReceipt size={14} />
                                            Sipariş No
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            <BiSolidPackage size={16} />
                                            Sipariş
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <FaUserCircle size={16} />
                                            Teslimat
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <FaMoneyBillWave size={14} />
                                            Tutar
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <FaStore size={14} />
                                            Tip
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <MdPayment size={16} />
                                            Ödeme
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <MdShoppingCart size={16} />
                                            Durum
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <FaCreditCard size={14} />
                                            Ödeme
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        <div className="flex items-center justify-center gap-2">
                                            <MdDateRange size={16} />
                                            Tarih
                                        </div>
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td className="text-center py-12 bg-gray-50" colSpan={10}>
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                                                <h2 className="font-semibold text-gray-700 text-lg">Siparişler yükleniyor...</h2>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedOrders.length > 0 ? (
                                    paginatedOrders.map((order: IOrder, index: number) => (
                                        <tr 
                                            className="hover:bg-orange-50 transition-colors duration-150" 
                                            key={`${order._id}-${index}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 border border-gray-300 font-bold">
                                                    {order.orderNumber}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 min-w-52">
                                                            <img
                                                                src={`${item.product.imageUrls[0]}`}
                                                                alt={`${item.product.name}`}
                                                                className="w-14 h-14 rounded-lg object-cover shadow-md border-2 border-gray-200"
                                                            />
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-xs font-semibold text-gray-900">
                                                                    {item.product.name} 
                                                                    <span className="text-orange-600 ml-1">(x{item.quantity})</span>
                                                                </span>
                                                                <span className="text-xs text-gray-600">
                                                                    Birim: <span className="font-bold">{item.price} ₺</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button 
                                                    onClick={() => handleOrderDetail(order)}
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                                    title="Müşteri Bilgileri"
                                                >
                                                    <FaUserCircle size={20} />
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {order.items.map((item, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 bg-green-500 px-3 py-1.5 rounded-lg text-white font-bold text-sm shadow-md">
                                                        {item.totalPrice.toFixed(2)} ₺
                                                    </span>
                                                ))}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${
                                                    order.orderType === 'shop' 
                                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                                }`}>
                                                    {order.orderType === 'shop' ? <FaStore size={12} /> : <BsGlobe size={12} />}
                                                    {orderTypeStatus(order.orderType)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${
                                                    order.paymentType === 'cash' 
                                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                                }`}>
                                                    {order.paymentType === 'cash' ? <FaMoneyBillWave size={12} /> : <FaCreditCard size={12} />}
                                                    {paymentTypeStatus(order.paymentType)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md ${getOrderStatusBadge(order.orderStatus)}`}>
                                                        {orderStatusText(order.orderStatus)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center">
                                                    {paymentStatus[order.paymentStatus]}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="text-xs text-gray-600 font-medium">
                                                    {formatDate(order.createdAt)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    type="button"
                                                    disabled={loading}
                                                    onClick={() => handleOrderUpdateStatus(order)}
                                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="text-center py-12 bg-gray-50" colSpan={10}>
                                            <div className="flex flex-col items-center justify-center">
                                                <MdShoppingCart className="text-gray-300 mb-4" size={64} />
                                                <h2 className="font-semibold text-gray-700 text-lg">Mevcut sipariş bulunamadı!</h2>
                                                <p className="text-gray-500 text-sm mt-2">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <Pagination
                                totalItems={filteredOrder.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaUserCircle size={32} />
                                    <h2 className="text-2xl font-bold">Müşteri Bilgileri</h2>
                                </div>
                                <button 
                                    onClick={() => {
                                        setShowOrderDetail(false);
                                        setSelectedOrder(null);
                                    }} 
                                    className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 font-bold text-lg transition-colors duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaUserCircle className="text-orange-500" />
                                    Kişi Bilgileri
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">Ad Soyad:</span>
                                        <span className="text-gray-800">{selectedOrder.customerInfo.name} {selectedOrder.customerInfo.surname}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">E-Mail:</span>
                                        <span className="text-gray-800">{selectedOrder.customerInfo.email}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">Telefon:</span>
                                        <span className="text-gray-800">{selectedOrder.customerInfo.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">Telefon 2:</span>
                                        <span className="text-gray-800">{selectedOrder.customerInfo.phone2}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <TbTruckDelivery className="text-orange-500" size={20} />
                                    Teslimat Bilgileri
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">Teslimat Adresi:</span>
                                        <span className="text-gray-800">{selectedOrder.customerInfo.deliveryAddress}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">Fatura Adresi:</span>
                                        <span className="text-gray-800">{selectedOrder.customerInfo.invoiceAddress}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-gray-600 min-w-32">Konum:</span>
                                        <span className="text-gray-800 uppercase">{selectedOrder.customerInfo.city} / {selectedOrder.customerInfo.district}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {showOrderStatusModal && selectedOrder && selectedOrderID && (
                <OrderStatusUpdate
                    isOpen={showOrderStatusModal}
                    onClose={() => {
                        setShowOrderStatusModal(false);
                        setSelectedOrder(null);
                    }}
                    onSuccess={fetchOrderData}
                    data={selectedOrder}
                    id={selectedOrderID}
                />
            )}
        </>
    )
}

export default Order
