"use client";

import { useState, useEffect, useMemo } from "react";
import { IProduct } from "../types/productTypes";
import { productServices } from "../services/productServices";
import Link from "next/link";
import { FiPackage } from "react-icons/fi";


export const AllProductContent = () => {

    const [productData, setProductData] = useState<IProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [message, setMessage] = useState<string>("");


    const fetchProductData = async () => {
        setLoading(true);
        setMessage("");
        setError(null)
        try {
            const response = await productServices.getActiveProduct();
            if (response && response.success && Array.isArray(response.data)) {
                setProductData(response.data);
                setMessage(response.message ? response.message : 'Satışta olan ürünler başarıyla getirildi!');
            } else {
                setError(response.error || response.message || 'Satışta olan ürünler getirilemedi!');
            }
        } catch (error: any) {
            setError('Satışta olan ürünler getirilirken hata ile karşılaşıldı!' + error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, []);

    const filteredProduct = useMemo(() => {

        if (!Array.isArray(productData)) {
            return false || [];
        }

        return productData.filter((product) => {


            if (selectedCategory !== 'all' && product.category !== selectedCategory) {
                return false;
            }

            let matchesProduct = searchTerm === '' ||
                (product?._id?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (product?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (product?.category?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (product?.price?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (product?.color?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (product?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());



            return matchesProduct;

        });


    }, [productData, searchTerm, selectedCategory]);


    const categoryList = ['all', ...Array.from(new Set(productData.map(p => p.category)))];

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
            case 'all': return 'Tümü';
        }
    }

    return (

        <section className="w-full flex flex-col mt-2 items-center mx-2 lg:mx-0 justify-center gap-2">
            <div className="flex w-full flex-col items-start justify-center gap-2 flex-1">
                <input
                    type="search"
                    className="border-2 bg-white cursor-pointer w-full text-base quicksand border-amber-500 rounded-lg py-3 p-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ürün adı, kategorisi, fiyatı, rengi, açıklaması ve ürün site ID'ye göre arama..."
                />


                <div className="flex items-center my-2 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-100 flex-nowrap w-full justify-start gap-4">
                    {categoryList.map((c) => (
                        <button
                            type="button"
                            key={c}
                            onClick={() => setSelectedCategory(c)}
                            className={`px-2 py-1 cursor-pointer rounded-sm text-sm  font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${selectedCategory === c
                                ? `bg-amber-600 text-white shadow-md`
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {categoryText(c)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full flex items-start border-b pb-2 border-gray-300 justify-start pl-2">
                <h2>{filteredProduct.length} ürün mevcut.</h2>
            </div>

            <div className="mt-2 p-0 w-full">
                <div className="grid grid-cols-2 shadow-xl   lg:grid-cols-4 items-center gap-4 lg:gap-12">

                    {filteredProduct && filteredProduct.length > 0 ? (

                        filteredProduct.map((product) => {

                            let productSlugUrl = product.slug ? product.slug : null;

                            return (
                                <Link href={`/urunlerimiz/${productSlugUrl}`}>
                                    <div
                                        key={product._id}
                                        className="relative bg-white border border-gray-300 cursor-pointer rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="group relative shadow-sm hover:bg-black border-gray-300 overflow-hidden">
                                            <img
                                                src={product.imageUrls?.[0]}
                                                alt={product.name}
                                                className="h-full w-full object-cover group-hover:scale-105 transition-transform ease-in-out duration-1000"
                                            />

                                            <div className="absolute inset-0 flex items-center group-hover:bg-black/35 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button className="bg-black text-white px-4 py-2 rounded-md font-semibold shadow-lg cursor-pointer  transition">
                                                    Detaylı Gör
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
                                                {(product.category)}
                                            </p>

                                            <div className="flex items-center justify-between pt-2">
                                                <span className="font-bold raleway tracking-wider text-gray-600">
                                                    {(product.price)}
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
                        })) : filteredProduct.length === 0 && (
                            <div className="col-span-full text-center flex-1  py-16 sm:py-12">
                                <div className="flex items-center flex-col justify-center">
                                    <div className="text-gray-300 text-7xl mb-6"><FiPackage /></div>
                                    <h3 className="text-2xl font-bold text-gray-700 mb-3">
                                        {searchTerm ? "Arama Sonucu Bulunamadı" : "Henüz Ürün Eklenmedi"}
                                    </h3>
                                    <p className="text-gray-500 text-center max-w-md mb-6 px-4">
                                        {searchTerm
                                            && `"${searchTerm}" ile eşleşen ürün bulunamadı. Farklı bir ürün aramayı terimi deneyin.`
                                        }
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                                        >
                                            Aramayı Temizle
                                        </button>
                                    )}
                                </div>

                            </div>
                        )}
                </div>
            </div>
        </section>
    )
}



export default AllProductContent