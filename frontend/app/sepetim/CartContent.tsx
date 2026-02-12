"use client";

import { useState, useEffect } from "react";
import { ICart, ICartItem, IUpdateToCartData } from "../types/cartTypes";
import { cartServices } from "../services/cartServices";
import { FaInfo, FaMinus, FaPlus, FaShoppingCart, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { OrderCreateForm } from "../components/Order/OrderCreateForm";
import { useRouter } from "next/navigation";
import { MdOutlineMoodBad } from "react-icons/md";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { InfoBox } from "../components/general/InfoBox";


export const CartContent = () => {

    const router = useRouter();
    const { updateCartLength } = useAuth();

    const [cartData, setCartData] = useState<ICart | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
    const [showInfoBox, setShowInfoBox] = useState<boolean>(false);
    const [infoBoxType, setInfoBoxType] = useState<'warning' | 'error' | 'info'>('info');


    useEffect(() => {
        fetchCartData();
        const interval = setInterval(() => {
            fetchCartData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);


    const fetchCartData = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        setShowInfoBox(false);
        try {
            const response = await cartServices.getCartSession();

            if (response.success && response.data) {
                setCartData(response.data);
                setShowInfoBox(false);

                if (response.cartUpdated) {
                    setShowInfoBox(true);
                    setInfoBoxType('warning');
                    setMessage('Sepetinizde bazı ürünler artık mevcut değil, stokta kalmadı veya miktarı güncellendi.');
                }

                updateCartLength();

            } else {
                setError(response.error || response.message || 'Kullanıcı sepeti getirilemedi!');
                setInfoBoxType('error');
                setShowInfoBox(true);
            }
        } catch (error) {
            setError('Kullanıcı sepeti getirilirken hata ile karşılaşıldı!');
            setInfoBoxType('error');
            setShowInfoBox(true);
        } finally {
            setLoading(false);
        }
    }


    const handleUpdateCart = async (productId: string, newQuantity: number) => {

        if (newQuantity < 1) {
            await handleRemoveCart(productId);
            return;
        }

        try {
            const data: IUpdateToCartData = {
                quantity: newQuantity
            }

            const response = await cartServices.updateToCart(productId as string, data);

            if (response.success && response) {
                updateCartLength();
                await fetchCartData();
            } else {
                setInfoBoxType('error');
                setError(response.error || response.message || 'Sepet güncellenemedi');
                setShowInfoBox(true);

                setTimeout(() => {
                    setShowInfoBox(false);
                }, 4000);
            }
        } catch (error) {
            setInfoBoxType('error');
            setError('Sepet güncellenemedi!' + error);
            setShowInfoBox(true);
        }
    }



    const handleRemoveCart = async (productId: string) => {
        setLoading(true);
        try {
            const response = await cartServices.removeToCart(productId as string);

            if (response && response.success) {
                updateCartLength();
                await fetchCartData();

            } else {
                setInfoBoxType('error');
                setError(response.error || response.message || 'Ürün sepetten çıkarılamadı!');
                setShowInfoBox(true);
            }
        } catch (error) {
            setInfoBoxType('error');
            setError('Ürün sepetten çıkarılamadı!' + error);
            setShowInfoBox(true);
        }
    }


    const handleClearCart = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await cartServices.clearToCart();

            if (response && response.success) {
                updateCartLength();
                await fetchCartData();
            } else {
                setInfoBoxType('error');
                setError(response.error || response.message || 'Sepet temizlenemedi!');
                setShowInfoBox(true);
            }
        } catch (error) {
            setInfoBoxType('error');
            setError('Sepet temizlenemedi!' + error);
            setShowInfoBox(true);
        }
    }


    const getInfoIcon = () => {
        switch (infoBoxType) {
            case 'warning':
                return <FaExclamationTriangle className="text-yellow-500" size={30} />;
            case 'error':
                return <FaExclamationTriangle className="text-red-500" size={30} />;
            case 'info':
            default:
                return <FaInfo className="text-blue-500" size={30} />;
        }
    };

    <>

        {showInfoBox && (
            <InfoBox
                title={error || message || ''}
                isOpen={showInfoBox}
                onClose={() => {
                    setShowInfoBox(false);
                    setError(null);
                    setMessage(null);
                }}
                icon={getInfoIcon()}
            />
        )}
    </>


    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <>
                <div className="w-full shadow-lg border-gray-300 flex items-center justify-center h-[50vh] col-span-full">
                    <div className="flex items-center justify-center flex-col gap-4">
                        <span> <MdOutlineMoodBad className="text-gray-500" size={70} /> </span>
                        <span className="flex items-center justify-center font-bold gap-2"> <h2>Sepetinizde Ürün Bulunmuyor.</h2> </span>
                        <span><h2 className="font-semibold text-gray-500">Ürünlerimizi incelemek ve sepete ürün eklemek için;</h2></span>
                        <span className="flex items-center justify-center mt-4">
                            <button
                                type="button"
                                className="w-72 py-4 rounded-md text-white px-4 bg-blue-400 cursor-pointer hover:bg-blue-500 duration-500 ease-in-out transition-all text-sm text-center font-sans font-semibold"
                                onClick={() => {
                                    router.push('/urunlerimiz')
                                }}
                            >
                                Ürünleri İncele
                            </button>
                        </span>
                        <span className="flex items-center justify-center text-center">
                            <h2 className="text-sm text-gray-500 font-light">veya</h2>
                        </span>
                        <span className="mt-1 flex items-center justify-center text-center">
                            <Link href="/">
                                <h2 className="font-bold underline underline-offset-4">Anasayfaya Dön</h2>
                            </Link>
                        </span>
                    </div>
                </div>

                {showInfoBox && (
                    <InfoBox
                        title={error || message || ''}
                        isOpen={showInfoBox}
                        onClose={() => {
                            setShowInfoBox(false);
                            setError(null);
                            setMessage(null);
                        }}
                        icon={getInfoIcon()}
                    />
                )}
            </>
        )
    }

    if (cartData && cartData?.items && cartData?.items?.length > 0) {
        return (
            <>
                <div className="w-full lg:container mx-auto mb-16 px-0 py-4">


                    {error && (
                        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-300 text-red-800 flex items-center gap-3">
                            <FaExclamationTriangle className="text-red-500" size={24} />
                            <div className="flex-1">
                                <p className="font-semibold">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Ürün Listesi */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <div className="flex justify-between border-b pb-2 border-gray-400 items-center mb-8">
                                    <h2 className="text-xl font-semibold montserrat text-gray-800">
                                        Sepetim ({cartData.totalItems} {cartData.totalItems === 1 ? 'ürün' : 'ürün'})
                                    </h2>
                                    <button
                                        disabled={loading}
                                        className="text-red-500 hover:text-red-700 cursor-pointer text-xs md:text-sm flex items-center gap-2 disabled:opacity-50"
                                        onClick={handleClearCart}
                                    >
                                        <FaTrash /> Sepeti Temizle
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {cartData.items.map((item: ICartItem, index: number) => {
                                        const product = item.product;
                                        const productName = product.name;
                                        const productPrice = item.price || product.price;
                                        const productImageUrl = product.imageUrls && product.imageUrls[0]
                                            ? product.imageUrls[0]
                                            : null;
                                        const quantity = item.quantity;
                                        const totalPrice = productPrice * quantity;

                                        return (
                                            <div key={`${product._id}-${index}`} className="flex flex-row gap-4 pb-6 border-b border-b-gray-300 last:border-b-0">
                                                <div className="flex shrink-0">
                                                    <div className="relative w-14 h-14 lg:w-20 drop-shadow-xs drop-shadow-black lg:h-20 rounded-lg overflow-hidden bg-gray-100">
                                                        {productImageUrl ? (
                                                            <img
                                                                src={productImageUrl}
                                                                alt={productName}
                                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <FaShoppingCart className="text-3xl" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex flex-row md:justify-between md:items-start gap-2">
                                                        <div className="flex-grow">
                                                            <div className="text-base md:text-lg font-stretch-125% font-semibold text-gray-800 hover:text-blue-600 transition block mb-1">
                                                                {productName}
                                                            </div>
                                                            <div className="space-y-1 text-xs md:text-sm mt-2">
                                                                <p className="text-gray-600">
                                                                    Birim Fiyat: <span className="font-semibold">{productPrice.toFixed(2)} ₺</span>
                                                                </p>
                                                            </div>

                                                            <div className="space-y-1 text-xs md:text-sm mt-2">
                                                                <p className="text-gray-600">
                                                                    Toplam Adet: <span className="font-semibold"> {quantity} adet</span>
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-lg md:text-xl xl:text-2xl font-bold text-gray-800">
                                                                {totalPrice.toFixed(2)} ₺
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                                                        <div className="flex items-center border rounded-lg border-gray-300 px-1 py-1 gap-1">
                                                            <button
                                                                onClick={() => handleUpdateCart(product._id, quantity - 1)}
                                                                disabled={loading}
                                                                className="w-5 h-5 flex cursor-pointer items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                            >
                                                                <FaMinus className="text-xs" />
                                                            </button>

                                                            <span className="px-2">
                                                                {quantity}
                                                            </span>

                                                            <button
                                                                onClick={() => handleUpdateCart(product._id, quantity + 1)}
                                                                disabled={loading}
                                                                className="w-5 h-5 flex items-center cursor-pointer justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                            >
                                                                <FaPlus className="text-xs" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => handleRemoveCart(product._id)}
                                                            disabled={loading}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer text-xs md:text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                        >
                                                            Kaldır
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 text-gray-800 mb-6">Sipariş Özeti</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Toplam Ürünler</span>
                                        <span>{cartData.totalItems} adet</span>
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Ara Toplam</span>
                                        <span>{cartData.totalAmount.toFixed(2)} ₺</span>
                                    </div>

                                    <div className="border-t pt-4 border-t-gray-300 mt-4">
                                        <div className="flex justify-between text-lg font-bold text-gray-800">
                                            <span>Genel Toplam</span>
                                            <span className="text-black">{cartData.totalAmount.toFixed(2)} ₺</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">(Fiyatlara KDV dahildir)</p>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-green-500 text-white py-3 rounded-lg cursor-pointer hover:bg-green-600 transition text-lg font-semibold mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!cartData.items || cartData.items.length === 0 || loading}
                                    onClick={() => {
                                        setShowOrderModal(true);
                                    }}
                                >
                                    Siparişi Tamamla
                                </button>

                                <button
                                    className="w-full bg-blue-400 font-bold cursor-pointer hover:bg-blue-500 duration-500 transition-all py-3 rounded-lg text-white text-center"
                                    onClick={() => {
                                        router.push('/urunlerimiz')
                                    }}
                                >
                                    <h2>Alışverişe Devam Et</h2>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showOrderModal && (
                    <OrderCreateForm
                        isOpen={showOrderModal}
                        onClose={() => setShowOrderModal(false)}
                        onSuccess={() => console.log("Sipariş oluşturuldu!!")}
                    />
                )}

            </>
        )
    }
}

export default CartContent