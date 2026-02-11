"use client";

import { productServices } from "@/app/services/productServices";
import { IProduct } from "@/app/types/productTypes";
import { getTurkishLira } from "@/app/utils/format";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductCard = () => {

    const [productData, setProductData] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");


    const fetchProductData = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await productServices.getActiveProduct();
            if (response && response.success && Array.isArray(response.data)) {
                setProductData(response.data);
                setMessage('Aktif ürünler başarıyla getirildi!');
            } else {
                setError(response.message || response.error || 'Aktif ürünler getirilemedi!');
            }
        } catch (error) {
            setError('Aktif ürünler getirilirken hata ile karşılaşıldı' + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, []);


    const categoryText = (status: string) => {
        switch (status) {
            case 'kilit':
                return 'Kilit';
            case 'kasa':
                return 'Kasa';
            case 'aksesuar':
                return 'Aksesuar';
            case 'elektronik-kilit':
                return 'Elektronik Kilit';
            case 'otel-elektronik-kilit':
                return 'Otel Elektronik Kilit';
            case 'kapi':
                return 'Kapı';
        }
    }

    return (

        <div className="grid grid-cols-2 lg:grid-cols-4 mx-3 gap-6">

            {productData && productData.length > 0 ? (

                productData.map((product, index) => {

                    let productSlugUrl = product.slug ? product.slug : null;

                    return (
                        <Link key={`${product._id}-${index}`} href={`/urunlerimiz/${productSlugUrl}`}>
                            <div
                                className="relative bg-white cursor-pointer border-hidden rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="relative shadow-sm hover:bg-black group border-gray-300 overflow-hidden">
                                    <img
                                        src={product.imageUrls?.[0]}
                                        alt={product.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover group-hover:scale-125 transition-transform ease-linear duration-300"
                                    />

                                    <div className="absolute inset-0 flex items-center group-hover:bg-black/35 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="bg-white text-black px-4 py-2 rounded-md font-semibold shadow-lg cursor-pointer hover:bg-black hover:text-white transition">
                                            İncele
                                        </button>
                                    </div>


                                    {product.tags && (
                                        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-md">
                                            {product.tags}
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col bg-white items-center justify-center space-y-1">
                                    <h3 className="font-semibold text-base text-center quicksand lg:text-lg line-clamp-2">
                                        {product.name}
                                    </h3>

                                    <h3 className="font-semibold text-sm mt-2 my-2 text-gray-500 line-clamp-2">
                                        {product.description}
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Renk: {product.color}
                                    </p>

                                    <p className="text-xs my-2 text-gray-500 font-extrabold">
                                        {categoryText(product.category)}
                                    </p>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="font-bold raleway tracking-wider text-gray-600">
                                            {getTurkishLira(product.price)}
                                        </span>

                                        {product.discount > 0 && (
                                            <span className="text-xs ml-2 text-red-500">
                                                (%{product.discount} indirimli)
                                            </span>
                                        )}
                                    </div>


                                </div>
                            </div>
                        </Link>
                    )
                })) : productData.length === 0 || !productData && (
                    <div>
                        <h2>Mevcut Ürün Bulunamadı!</h2>
                    </div>
                )}
        </div>

    )
}


export default ProductCard