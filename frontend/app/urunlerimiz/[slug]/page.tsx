"use client";

import Header from "@/app/components/Header/Header";
import { cartServices } from "@/app/services/cartServices";
import { productServices } from "@/app/services/productServices";
import { IAddToCartData } from "@/app/types/cartTypes";
import { IProduct } from "@/app/types/productTypes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export const ProductDetail = () => {

    const params = useParams();
    const productSlug = params.slug as string;

    const { updateCartLength } = useAuth();
    const [productDetails, setProductDetails] = useState<IProduct | null>(null);
    const [cartDataLength, setCartDataLength] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);
    const [addCartLoading, setAddCartLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [message, setMessage] = useState<string>("");


    useEffect(() => {
        const fetchProductDetails = async () => {

            setLoading(true);
            setMessage("");
            setError(null);

            try {

                if (!productSlug || productSlug.trim() === '') {
                    setError('Ürün bulunamadı. Geçersiz ürün adresi.')
                    setLoading(false);
                    return
                }
                const response = await productServices.getBySlugProduct(productSlug);

                if (response && response.success && response.data) {
                    const productData = response.data;
                    setMessage(response.message ? response.message : 'Ürünün detayları başarılı şekilde alındı!');
                    setProductDetails(productData);
                    document.title = `${productData.name}`
                } else {
                    setError(response.error || response.message || 'Ürünün detayları çekilemedi başarısız oldu!')
                }
            } catch (error: any) {
                setError('Ürünün detayları çekilemedi!' + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProductDetails();

    }, [productSlug]);




    const categoryText = (status: string) => {
        switch (status) {
            case 'kapi':
                return 'Kapı';
            case 'kilit':
                return 'Kilit';
            case 'aksesuar':
                return 'Aksesuar';
            case 'elektronik-kilit':
                return 'Elektronik Kilit';
            case 'otel-elektronik-kilit':
                return 'Otel Elektronik Kilit';
            case 'kasa':
                return 'Kasa';
        }
    }


    const handleAddToCart = async (id: string) => {

        setAddCartLoading(true);
        setError(null);
        setMessage("");

        if (!id) {
            setError('Sepete eklenecek ürün ID Bulunamadı!');
            setAddCartLoading(false);
            return false;
        }

        try {

            const data: IAddToCartData = {
                productId: id,
                quantity: 1
            }

            if (!data) {
                setError('Data verisi bulunamadı!');
                return false;
            }

            const response = await cartServices.addToCart(data);
            if (response && response.success) {
                setCartDataLength(prev => prev + 1);
                updateCartLength();
                setMessage(response.message ? response.message : 'Ürün sepete başarıyla eklendi!');
            } else {
                setError(response.message || response.error || 'Ürün sepete eklenemedi!');
            }

        } catch (error: any) {
            setError('Ürün sepete eklenirken hata meydana geldi!' + error.message);
        } finally {
            setAddCartLoading(false);
        }
    }


    useEffect(() => {
        const fetchCartLength = async () => {
            setLoading(false);
            setError(null);
            setMessage("");
            try {
                const response = await cartServices.getCartSession();
                if (response.success && response.data) {
                    setCartDataLength(response.data.totalItems);
                    setMessage(response.message ? response.message : 'Sepet sayısı başarıyla getirildi');
                } else {
                    setError(response.error || response.message || 'Sepet sayısı alınamadı!');
                }
            } catch (error: any) {
                setError('Sepet sayısı alınırken hata meydana geldi' + error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchCartLength();
    }, []);




    return (
        <div className="min-h-screen flex flex-col w-full">
            <div>
                <Header />
            </div>

            <section className="bg-gray-100 min-h-screen">
                <div className=" mt-8 px-0 lg:px-5 xl:container mx-auto">
                    {/* List Menü */}
                    <div className="flex border-b bg-white rounded-lg py-3 px-3 lg:px-0 pb-2 w-full border-gray-300 items-center justify-start">
                        <ul className="flex gap-1 text-[11px] px-2 md:text-[12px] text-yellow-700 lg:text-[13px] font-medium items-center justify-center">
                            <li className="px-1">
                                <Link href={'/'}>
                                    <h2>Anasayfa</h2>
                                </Link>
                            </li>
                            <span>/</span>
                            <li className="px-1 ">
                                <Link href={'/urunlerimiz'}>
                                    <h2>Ürünler</h2>
                                </Link>
                            </li>
                            <span>/</span>
                            <li className="px-1">
                                <Link href={`/urunlerimiz/${productSlug}`}>
                                    <h2>{productDetails?.name}</h2>
                                </Link>
                            </li>
                        </ul>
                    </div>


                    {/* Ürün Detay */}
                    <div className="grid mt-2 md:grid-cols-2 gap-0 lg:gap-4 items-start">

                        <div className="flex flex-col gap-4 mx-2">
                            <div className="relative flex-1 cursor-pointer aspect-square rounded-xl overflow-hidden bg-white shadow">
                                <img
                                    src={productDetails?.imageUrls?.[0]}
                                    alt={productDetails?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex cursor-pointer flex-col mb-4 gap-2">
                                {productDetails?.imageUrls?.slice(0, 4).map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="thumb"
                                        className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-black"
                                    />
                                ))}
                            </div>
                        </div>


                        <div className="space-y-4 mx-3 bg-zinc-50 rounded-lg p-5 shadow-lg lg:mx-0">
                            <div className="flex items-start justify-center flex-col gap-2 space-y-2">

                                <div className="mt-1">
                                    <span className="p-1 border rounded-lg bg-blue-500 border-hidden text-sm text-center px-3 py-1.5 text-white">
                                        {categoryText(productDetails?.category as string)}
                                    </span>
                                </div>

                                <div className="text-lg mt-2 flex items-center justify-center gap-2 lg:text-xl font-bold quicksand">
                                    <h2 className="text-gray-500">Ürün Site ID:</h2>
                                    <h2 className="font-sans font-bold">{productDetails?._id.slice(5, 15)}</h2>
                                </div>

                                <div className="text-xl mt-0 flex items-center justify-center gap-2 lg:text-2xl font-bold quicksand">
                                    <h2 className="text-gray-500">Ürün Adı:</h2>
                                    <h2>{productDetails?.name}</h2>
                                </div>

                                <div className="text-lg flex items-center justify-center gap-2 lg:text-xl font-bold quicksand">
                                    <h2 className="text-gray-500">Renk:</h2>
                                    <h2>{productDetails?.color}</h2>
                                </div>

                                <div className="text-lg flex items-center justify-center gap-2 lg:text-xl font-bold quicksand">
                                    <h2 className="text-gray-500">Ağırlık:</h2>
                                    <h2>{productDetails?.weight}</h2>
                                </div>

                                <div className="text-lg flex items-center justify-center gap-2 lg:text-xl font-bold quicksand">
                                    <h2 className="text-gray-500">Fiyat:</h2>
                                    <h2>{productDetails?.price.toFixed(2)} ₺</h2>
                                </div>


                                <div className="border-t border-b border-b-gray-400 border-t-gray-400 flex items-start w-full py-6 flex-col justify-center gap-4">
                                    <div className="flex items-center justify-center">
                                        <h2 className="font-bold text-gray-500 text-lg lg:text-xl">Ürün Açıklaması</h2>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <h2>{productDetails?.description} </h2>
                                    </div>
                                </div>


                                <div className="flex items-start w-full py-2 flex-col justify-center gap-4">
                                    <div className="flex items-center justify-center">
                                        <h2 className="font-bold text-gray-500 text-lg lg:text-xl">Etiketler</h2>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <h2>{productDetails?.tags} </h2>
                                    </div>
                                </div>


                                <div className="flex items-center flex-col gap-4 w-full justify-center">

                                    <button
                                        type="button"
                                        disabled={addCartLoading}
                                        className="w-full text-white hover:bg-black/85 hover:duration-500 ease-in-out bg-black font-bold cursor-pointer  py-3 px-4 border-2 border-black text-center rounded-md"
                                        onClick={() => handleAddToCart(productDetails?._id as string)}
                                    >
                                        Sepete Ekle
                                    </button>


                                    <div className="p-5 w-full flex flex-col gap-3 rounded-lg bg-gray-100 shadow-lg">
                                        <span className="text-sm">
                                            {cartDataLength > 0 ?
                                                <span>
                                                    Sepetinizde {cartDataLength} ürün bulunuyor.
                                                </span> :
                                                <span>
                                                    Sepetinizde mevcut ürün bulunmuyor.
                                                </span>
                                            }
                                        </span>
                                        <Link href={'/sepetim'}>
                                            <h2 className="font-bold text-yellow-600">Sepeti Görüntüle</h2>
                                        </Link>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductDetail;