"use client";

import { useState, useEffect } from "react";
import { ICart, ICartItem, IUpdateToCartData } from "../types/cartTypes";
import { cartServices } from "../services/cartServices";
import { FaMinus, FaPlus } from "react-icons/fa";
import { OrderCreateForm } from "../components/Order/OrderCreateForm";


export const CartContent = () => {

    const [cartData, setCartData] = useState<ICart | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [showOrderModal, setShowOrderModal] = useState<boolean>(false);

    const fetchCartData = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await cartServices.getCartSession();
            if (response.success && response.data) {
                setMessage(response.message ? response.message : 'Kullanıcı sepeti başarıyla getirildi');
                setCartData(response.data);
            } else {
                setError(response.error || response.message || 'Kullanıcı sepeti getirilemedi!');
            }
        } catch (error) {
            setError('Kullanıcı sepeti getirilirken hata ile karşılaşıldı!');
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
                fetchCartData();
                setMessage(response.message ? response.message : 'Sepet başarıyla güncellendi');
            } else {
                setError(response.error || response.message || 'Sepet güncellenemedi');
            }
        } catch (error) {
            setError('Sepet güncellenemedi!' + error);
        }

    }



    const handleRemoveCart = async (productId: string) => {
        setLoading(true);
        try {
            const response = await cartServices.removeToCart(productId as string);
            if (response && response.success) {
                fetchCartData();
                setMessage(response.message ? response.message : "Ürün sepetten başarıyla kaldırıldı!");
            } else {
                setError(response.error || response.message || 'Ürün sepetten çıkarılamadı!');
            }
        } catch (error) {
            setError('Ürün sepetten çıkarılamadı!' + error);
        }
    }


    useEffect(() => {
        fetchCartData();
    }, []);



    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div>
                <h2>SEPETİNİZ BOŞ</h2>
            </div>
        )
    }

    if (cartData && cartData?.items && cartData?.items?.length > 0) {
        return (
            <>
            <section className="mt-4 w-full py-4 rounded-lg p-5">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center p-5 rounded-lg border w-full justify-start gap-2">
                        {loading ? (
                            <span>Sepet yükleniyor...</span>
                        ) : cartData ? (
                            <div className="flex flex-col gap-2">

                                <div className="mt-3">
                                    {cartData.items.map((item: ICartItem, index: number) => {

                                        const productId = item.product._id;
                                        const productImageUrls = item.product.imageUrls;
                                        const productName = item.product.name;
                                        const productPrice = item.product.price;
                                        const productQuantity = item.quantity;

                                        return (
                                            <div className="w-full flex items-center justify-between">
                                                <div
                                                    key={`${item.product._id}-${index}`}
                                                    className="flex flex-row items-center justify-center gap-4">
                                                    <div>
                                                        <img
                                                            src={`${productImageUrls[0]}`}
                                                            alt={`${productName}`}
                                                            className="w-20 h-20 rounded-lg"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col items-start gap-1 justify-center">
                                                        <span>
                                                            Ürün Adı: {productName}
                                                        </span>
                                                        <span>
                                                            Ürün Adedi : {productQuantity}
                                                        </span>
                                                        <span>
                                                            Birim Fiyat : {productPrice}
                                                        </span>

                                                    </div>



                                                    {/* Miktar */}
                                                    <div className="flex items-center gap-4 border rounded-lg px-1 py-1 border-gray-500 justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateCart(productId, productQuantity - 1)}
                                                            disabled={loading}
                                                            className="w-3 h-3 flex cursor-pointer items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                        >
                                                            <FaMinus />
                                                        </button>

                                                        <div>
                                                            <span>
                                                                {productQuantity}
                                                            </span>
                                                        </div>


                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateCart(productId, productQuantity + 1)}
                                                            disabled={loading}
                                                            className="w-3 h-3 flex items-center cursor-pointer justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                        >
                                                            <FaPlus className="text-xs" />
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <button
                                                            type="button"
                                                            disabled={loading}
                                                            onClick={() => handleRemoveCart(productId)}
                                                            className="px-2 py-2 rounded-lg bg-red-500 text-white text-sm font-sans text-center hover:bg-red-600 duration-500 ease-in-out disabled:opacity-50"
                                                        >
                                                            Ürünü Kaldır
                                                        </button>
                                                    </div>


                                                </div>
                                            </div>
                                        )
                                    })}


                                </div>

                            </div>
                        ) : (
                            <span>Sepetinizde ürün yok!</span>
                        )}

                    </div>

                </div>

                    <button
                    onClick={() => setShowOrderModal(true)}
                    className="px-2 py-2 rounded-lg bg-emerald-500 text-white font-bold mt-2"
                    type="button"
                    disabled={loading}
                    >
                    Sipariş ver!</button>
            </section>


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