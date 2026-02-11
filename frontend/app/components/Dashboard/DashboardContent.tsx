"use client";

import { jobServices } from "@/app/services/jobServices";
import { orderServices } from "@/app/services/orderServices";
import { productServices } from "@/app/services/productServices";
import { userServices } from "@/app/services/userServices";
import { IJob } from "@/app/types/jobTypes";
import { IOrder } from "@/app/types/orderTypes";
import { IProduct } from "@/app/types/productTypes";
import { IUser } from "@/app/types/userType";
import { useState, useEffect, useMemo } from "react";
import { FaCreditCard, FaMoneyBill, FaUser, FaUsers, FaUserTie, FaShoppingCart, FaBriefcase, FaChartLine, FaCheckCircle, FaClock, FaTimes, FaTruck, FaBox } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { FaUserGear } from "react-icons/fa6";
import { MdPendingActions, MdCancel, MdError, MdTrendingUp, MdTrendingDown, MdFilterList, MdDashboard } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";


const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue", onClick }: any) => {

    const colorClasses = {
        blue: "from-blue-500 to-blue-600 shadow-blue-200",
        green: "from-green-500 to-green-600 shadow-green-200",
        purple: "from-purple-500 to-purple-600 shadow-purple-200",
        orange: "from-orange-500 to-orange-600 shadow-orange-200",
        red: "from-red-500 to-red-600 shadow-red-200",
        indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200"
    };

    return (
        <div
            onClick={onClick}
            className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} 
                text-white rounded-xl p-6 shadow-lg hover:shadow-xl 
                transition-all duration-300 cursor-pointer hover:scale-105 
                relative overflow-hidden group`}
        >
            <div className="absolute top-0 right-0 opacity-10  transform translate-x-4 -translate-y-4">
                <Icon size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-white text-black bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                        <Icon size={24} />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            {trend === 'up' ? <MdTrendingUp size={18} /> : <MdTrendingDown size={18} />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
                <p className="text-3xl font-bold mb-1">{value}</p>
                {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
            </div>
        </div>
    );
};


const StatusBadge = ({ label, value, icon: Icon, variant = "default" }: any) => {

    const variants = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        success: "bg-green-50 text-green-700 border-green-200",
        failed: "bg-red-50 text-red-700 border-red-200",
        cancelled: "bg-orange-50 text-orange-700 border-orange-200",
        ready: "bg-blue-50 text-blue-700 border-blue-200",
        shipped: "bg-purple-50 text-purple-700 border-purple-200",
        default: "bg-gray-50 text-gray-700 border-gray-200"
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${variants[variant as keyof typeof variants]} hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} />}
                <span className="font-medium text-sm">{label}</span>
            </div>
            <span className="font-bold text-lg">{value}</span>
        </div>
    );
};


const PaymentMethodCard = ({ type, icon: Icon, count, amount, color }: any) => {
    return (
        <div className={`${color} text-white rounded-lg p-4 flex flex-col items-center justify-center 
            shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}>
            <Icon size={32} className="mb-3" />
            <h3 className="text-sm font-semibold mb-2 opacity-90">{type}</h3>
            <div className="text-center flex items-center justify-center gap-1">
                <p className="text-2xl font-bold mb-1">{count}</p>
                <p className="text-xs opacity-90">adet</p>
            </div>
            <div className="mt-3 pt-3 border-t border-white border-opacity-30 w-full text-center">
                <p className="text-lg font-bold">{amount} ₺</p>
            </div>
        </div>
    );
};


const UserRoleCard = ({ role, icon: Icon, count, color }: any) => {
    return (
        <div className={`${color} rounded-lg p-4 flex items-center gap-4 
            shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}>
            <div className="bg-white text-black bg-opacity-20 p-3 rounded-lg">
                <Icon size={28} />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-medium opacity-90 mb-1">{role}</h3>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs opacity-80">kullanıcı</p>
            </div>
        </div>
    );
};



export const DashboardContent = () => {

    const [orderData, setOrderData] = useState<IOrder[]>([]);
    const [jobData, setJobData] = useState<IJob[]>([]);
    const [userData, setUserData] = useState<IUser[]>([]);
    const [productData, setProductData] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);


    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [dateFilterType, setDateFilterType] = useState<string>('today');

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 30000);
        return () => clearInterval(interval);
    }, []);



    const filterByDate = <T extends { createdAt?: string | Date }>(data: T[]): T[] => {

        if (dateFilterType === 'all') return data;

        return data.filter(item => {

            if (!item.createdAt) return false;

            const itemDate = new Date(item.createdAt);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            switch (dateFilterType) {
                case 'today':
                    const todayEnd = new Date(today);
                    todayEnd.setHours(23, 59, 59, 999);
                    return itemDate >= today && itemDate <= todayEnd;

                case 'week':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - 7);
                    return itemDate >= weekStart;

                case 'month':
                    const monthStart = new Date(today);
                    monthStart.setDate(today.getDate() - 30);
                    return itemDate >= monthStart;

                case 'custom':
                    if (!startDate || !endDate) return true;
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    return itemDate >= start && itemDate <= end;

                default:
                    return true;
            }
        });
    };


    const handleQuickFilter = (type: string) => {
        setDateFilterType(type);
        if (type !== 'custom') {
            setStartDate('');
            setEndDate('');
        }
    };


    const handleResetFilter = () => {
        setDateFilterType('all');
        setStartDate('');
        setEndDate('');
    };

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const results = await Promise.allSettled([
                orderServices.getAllOrder(),
                jobServices.getAllJob(),
                userServices.getAllUser(),
                productServices.getAllProduct()
            ]);

            const [orderRes, jobRes, userRes, productRes] = results;

            if (orderRes.status === 'fulfilled' && orderRes.value.success) {
                setOrderData(Array.isArray(orderRes.value.data) ? orderRes.value.data : []);
            }
            if (jobRes.status === 'fulfilled' && jobRes.value.success) {
                setJobData(Array.isArray(jobRes.value.data) ? jobRes.value.data : []);
            }
            if (userRes.status === 'fulfilled' && userRes.value.success) {
                setUserData(Array.isArray(userRes.value.data) ? userRes.value.data : []);
            }
            if (productRes.status === 'fulfilled' && productRes.value.success) {
                setProductData(Array.isArray(productRes.value.data) ? productRes.value.data : []);
            }
        } catch (error: any) {
            setError('Beklenmeyen bir hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {

        const filteredOrders = filterByDate(orderData);
        const filteredJobs = filterByDate(jobData);
        const filteredUsers = filterByDate(userData);

        return {

            totalOrders: filteredOrders.length,
            pendingOrderStatus: filteredOrders.filter((order) => order.orderStatus?.includes('pending')).length,
            successOrderStatus: filteredOrders.filter((order) => order.orderStatus?.includes('success')).length,
            failedOrderStatus: filteredOrders.filter((order) => order.orderStatus?.includes('failed')).length,
            cancelledOrderStatus: filteredOrders.filter((order) => order.orderStatus?.includes('cancelled')).length,
            readyOrderStatus: filteredOrders.filter((order) => order.orderStatus?.includes('ready')).length,
            shippedOrderStatus: filteredOrders.filter((order) => order.orderStatus?.includes('shipped')).length,

            cashOrderPayment: filteredOrders.filter((order) => order.paymentType?.includes('cash')).length,
            creditOrderPayment: filteredOrders.filter((order) => order.paymentType?.includes('credit_card')).length,

            totalPaymentPrice: filteredOrders
                .filter((order) => order.subTotal)
                .reduce((total, order) => total + order.subTotal, 0),
            successPaymentPrice: filteredOrders
                .filter((order) => order.paymentStatus?.includes('success'))
                .reduce((total, order) => total + order.subTotal, 0),
            pendingPaymentPrice: filteredOrders
                .filter((order) => order.paymentStatus?.includes('pending'))
                .reduce((total, order) => total + order.subTotal, 0),

            successOrderPaymentCashPrice: filteredOrders
                .filter((order) => order.paymentType?.includes('cash') && order.paymentStatus?.includes('success'))
                .reduce((total, order) => total + order.subTotal, 0),
            successOrderPaymentCreditPrice: filteredOrders
                .filter((order) => order.paymentType?.includes('credit_card') && order.paymentStatus?.includes('success'))
                .reduce((total, order) => total + order.subTotal, 0),

            totalJobs: filteredJobs.length,
            pendingJobStatus: filteredJobs.filter((job) => job.jobStatus?.includes('pending')).length,
            successJobStatus: filteredJobs.filter((job) => job.jobStatus?.includes('success')).length,
            failedJobStatus: filteredJobs.filter((job) => job.jobStatus?.includes('failed')).length,
            cancelledJobStatus: filteredJobs.filter((job) => job.jobStatus?.includes('cancelled')).length,
            readyJobStatus: filteredJobs.filter((job) => job.jobStatus?.includes('ready')).length,

            totalJobPrice: filteredJobs
                .filter((job) => job.price)
                .reduce((total, job) => total + job.price, 0),
            pendingJobPaymentPrice: filteredJobs
                .filter((job) => job.jobPaymentStatus?.includes('pending'))
                .reduce((total, job) => total + job.price, 0),
            successJobPaymentPrice: filteredJobs
                .filter((job) => job.jobPaymentStatus?.includes('success'))
                .reduce((total, job) => total + job.price, 0),

            successJobPaymentCashPrice: filteredJobs
                .filter((job) => job.jobPaymentType?.includes('cash') && job.jobPaymentStatus?.includes('success'))
                .reduce((total, job) => total + job.price, 0),
            successJobPaymentCreditPrice: filteredJobs
                .filter((job) => job.jobPaymentType?.includes('credit_card') && job.jobPaymentStatus?.includes('success'))
                .reduce((total, job) => total + job.price, 0),

            cashJobPaymentType: filteredJobs.filter((job) => job.jobPaymentType?.includes('cash')).length,
            creditJobPaymentType: filteredJobs.filter((job) => job.jobPaymentType?.includes('credit_card')).length,

            totalUsers: filteredUsers.length,
            adminUser: filteredUsers.filter((user) => user.role?.includes('admin') && user.isAdmin === true).length,
            managerUser: filteredUsers.filter((user) => user.role?.includes('manager')).length,
            personelUser: filteredUsers.filter((user) => user.role?.includes('personel')).length,
            customerUser: filteredUsers.filter((user) => user.role?.includes('customer')).length,
        };

    }, [orderData, jobData, userData, productData, dateFilterType, startDate, endDate]);

    if (loading && orderData.length === 0 || jobData.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Veriler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (

        <section className="w-full bg-gray-50 min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-gray-300 to-gray-600 p-3 rounded-xl shadow-lg">
                    <MdDashboard className="text-white" size={32} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Genel Bakış ve Rapor Yönetimi</h1>
                    <p className="text-gray-600 mt-1">(Tüm veriler 30 saniyede bir güncellenir.)</p>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-md p-3 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <MdFilterList className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Tarih Filtresi</h2>
                            <p className="text-sm text-gray-500">Verileri tarih aralığına göre filtreleyin</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleQuickFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${dateFilterType === 'all'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tümü
                        </button>
                        <button
                            onClick={() => handleQuickFilter('today')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${dateFilterType === 'today'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Bugün
                        </button>
                        <button
                            onClick={() => handleQuickFilter('week')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${dateFilterType === 'week'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Son 7 Gün
                        </button>
                        <button
                            onClick={() => handleQuickFilter('month')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${dateFilterType === 'month'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Son 30 Gün
                        </button>
                        <button
                            onClick={() => handleQuickFilter('custom')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${dateFilterType === 'custom'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <BsCalendar3 size={14} />
                            Özel Tarih
                        </button>
                    </div>
                </div>


                {dateFilterType === 'custom' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    disabled={!startDate}
                                    min={startDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border disabled:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleResetFilter}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
                            >
                                Sıfırla
                            </button>
                        </div>
                    </div>
                )}

                {dateFilterType !== 'all' && (
                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Aktif Filtre:</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {dateFilterType === 'today' && 'Bugün'}
                            {dateFilterType === 'week' && 'Son 7 Gün'}
                            {dateFilterType === 'month' && 'Son 30 Gün'}
                            {dateFilterType === 'custom' && startDate && endDate &&
                                `${new Date(startDate).toLocaleDateString('tr-TR')} - ${new Date(endDate).toLocaleDateString('tr-TR')}`}
                        </span>
                    </div>
                )}
            </div>

            <div className="my-6 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-sm opacity-90 mb-2">Aktif Siparişler</p>
                        <p className="text-3xl font-bold">
                            {stats.pendingOrderStatus + stats.readyOrderStatus + stats.shippedOrderStatus} adet
                        </p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90 mb-2">Aktif İşler</p>
                        <p className="text-3xl font-bold">
                            {stats.pendingJobStatus + stats.readyJobStatus} adet
                        </p>
                    </div>

                    <div>
                        <p className="text-sm opacity-90 mb-2">Toplam İşlem Hacmi</p>
                        <p className="text-3xl text-green-300 font-bold">
                            {(stats.successPaymentPrice + stats.successJobPaymentPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Toplam Sipariş"
                    value={stats.totalOrders}
                    subtitle="Tüm zamanlar"
                    icon={FaShoppingCart}
                    color="blue"
                    trend="up"
                    trendValue="+12%"
                />
                <MetricCard
                    title="Sipariş Geliri"
                    value={`₺${stats.successPaymentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                    subtitle="Onaylanan ödemeler"
                    icon={FaChartLine}
                    color="green"
                    trend="up"
                    trendValue="+8%"
                />
                <MetricCard
                    title="Toplam İş"
                    value={stats.successJobStatus + stats.pendingJobStatus + stats.readyJobStatus}
                    subtitle="Aktif ve tamamlanan"
                    icon={FaBriefcase}
                    color="purple"
                    trend="up"
                    trendValue="+5%"
                />
                <MetricCard
                    title="İş Geliri"
                    value={`₺${stats.successJobPaymentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                    subtitle="Onaylanan ödemeler"
                    icon={FaChartLine}
                    color="indigo"
                    trend="up"
                    trendValue="+15%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <FaBox className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Sipariş Durumları</h2>
                            <p className="text-sm text-gray-500">Anlık sipariş takibi</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <StatusBadge
                            label="Bekleyen Siparişler"
                            value={stats.pendingOrderStatus}
                            icon={MdPendingActions}
                            variant="pending"
                        />
                        <StatusBadge
                            label="Onaylanan Siparişler"
                            value={stats.successOrderStatus}
                            icon={FaCheckCircle}
                            variant="success"
                        />
                        <StatusBadge
                            label="Hazırlanan Siparişler"
                            value={stats.readyOrderStatus}
                            icon={FaClock}
                            variant="ready"
                        />
                        <StatusBadge
                            label="Teslimat Sürecinde"
                            value={stats.shippedOrderStatus}
                            icon={FaTruck}
                            variant="shipped"
                        />
                        <StatusBadge
                            label="İptal Edilen"
                            value={stats.cancelledOrderStatus}
                            icon={MdCancel}
                            variant="cancelled"
                        />
                        <StatusBadge
                            label="Reddedilen"
                            value={stats.failedOrderStatus}
                            icon={MdError}
                            variant="failed"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <FaMoneyBill className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Sipariş Ödemeleri</h2>
                            <p className="text-sm text-gray-500">Satış Gelirleri</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 mb-6">
                        <p className="text-sm text-green-700 font-medium mb-2">Toplam Gelir</p>
                        <p className="text-4xl font-bold text-green-800">
                            {stats.successPaymentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                            Bekleyen: ₺{stats.pendingPaymentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PaymentMethodCard
                            type="Nakit"
                            icon={FaMoneyBill}
                            count={stats.cashOrderPayment}
                            amount={stats.successOrderPaymentCashPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                        <PaymentMethodCard
                            type="Kredi Kartı"
                            icon={FaCreditCard}
                            count={stats.creditOrderPayment}
                            amount={stats.successOrderPaymentCreditPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FaBriefcase className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">İş Durumları</h2>
                            <p className="text-sm text-gray-500">Proje takibi</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <StatusBadge
                            label="Bekleyen İşler"
                            value={stats.pendingJobStatus}
                            icon={MdPendingActions}
                            variant="pending"
                        />
                        <StatusBadge
                            label="Onaylanan İşler"
                            value={stats.successJobStatus}
                            icon={FaCheckCircle}
                            variant="success"
                        />
                        <StatusBadge
                            label="Devam Eden İşler"
                            value={stats.readyJobStatus}
                            icon={FaClock}
                            variant="ready"
                        />
                        <StatusBadge
                            label="İptal Edilen"
                            value={stats.cancelledJobStatus}
                            icon={MdCancel}
                            variant="cancelled"
                        />
                        <StatusBadge
                            label="Reddedilen"
                            value={stats.failedJobStatus}
                            icon={MdError}
                            variant="failed"
                        />
                    </div>
                </div>


                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <FaChartLine className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">İş Ödemeleri</h2>
                            <p className="text-sm text-gray-500">Teknik Servis & Proje Gelirleri</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 mb-6">
                        <p className="text-sm text-indigo-700 font-medium mb-2">Toplam Gelir</p>
                        <p className="text-4xl font-bold text-indigo-800">
                            {stats.successJobPaymentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </p>
                        <p className="text-sm text-indigo-800 mt-2">
                            Bekleyen: ₺{stats.pendingJobPaymentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <PaymentMethodCard
                            type="Nakit"
                            icon={FaMoneyBill}
                            count={stats.cashJobPaymentType}
                            amount={stats.successJobPaymentCashPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            color="bg-gradient-to-br from-green-500 to-green-600"
                        />
                        <PaymentMethodCard
                            type="Kredi Kartı"
                            icon={FaCreditCard}
                            count={stats.creditJobPaymentType}
                            amount={stats.successJobPaymentCreditPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            color="bg-gradient-to-br from-blue-500 to-blue-600"
                        />
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 p-3 rounded-lg">
                        <FaUsers className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Kullanıcı Yönetimi</h2>
                        <p className="text-sm text-gray-500">Sistem kullanıcıları ve rolleri</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 mb-6">
                    <p className="text-sm text-gray-700 font-medium mb-2">Toplam Kullanıcı</p>
                    <p className="text-4xl font-bold text-gray-800">{stats.totalUsers}</p>
                    <p className="text-sm text-gray-600 mt-2">Kayıtlı kullanıcı</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <UserRoleCard
                        role="Admin"
                        icon={RiAdminFill}
                        count={stats.adminUser}
                        color="bg-gradient-to-br from-red-500 to-red-600 text-white"
                    />
                    <UserRoleCard
                        role="Yönetici"
                        icon={FaUserTie}
                        count={stats.managerUser}
                        color="bg-gradient-to-br from-green-500 to-green-600 text-white"
                    />
                    <UserRoleCard
                        role="Personel"
                        icon={FaUserGear}
                        count={stats.personelUser}
                        color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    />
                    <UserRoleCard
                        role="Müşteri"
                        icon={FaUser}
                        count={stats.customerUser}
                        color="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                    />
                </div>
            </div>


        </section>
    );
};

export default DashboardContent;
