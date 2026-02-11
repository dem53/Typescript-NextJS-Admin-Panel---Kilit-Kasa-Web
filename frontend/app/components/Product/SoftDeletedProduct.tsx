"use client";

import { productServices } from "@/app/services/productServices";
import { IProduct } from "@/app/types/productTypes";
import { formatDate, getTurkishLira } from "@/app/utils/format";
import { useEffect, useState } from "react";
import ConfirmBox from "../general/ConfirmBox";

interface ISoftDeletedProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const SoftDeletedProduct: React.FC<ISoftDeletedProductProps> = ({ isOpen, onClose, onSuccess }) => {

    if (!isOpen) return null;

    const [softDeleteData, setSoftDeleteData] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");

    const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>("");

    useEffect(() => {
        fetchSoftDeleteData();
    }, []);

    const fetchSoftDeleteData = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await productServices.getSoftDeletedProduct();
            if (response.success && Array.isArray(response.data)) {
                setSoftDeleteData(response.data);
                setMessage(response.message ? response.message : 'Silinenler başarıyla getirildi!');
                setError("");
            } else {
                setError(response.error || response.message || 'Silinenler getirilemedi!');
            }
        } catch (error: any) {
            setError('Silinenler getirilirken hata!' + error);
        } finally {
            setLoading(false);
        }
    }


    const handleRestore = (id: string) => {
        setShowRestoreModal(true);
        setSelectedProductId(id);
    };


    const handleDelete = (id: string) => {
        setShowDeleteModal(true);
        setSelectedProductId(id);
    }


    const restoreProduct = async () => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await productServices.restoreProduct(selectedProductId as string);
            if (response.success) {
                setMessage(response.message ? response.message : 'Ürün başarıyla restore edildi!');
                setSelectedProductId("");
                setShowRestoreModal(false);
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Ürün restore edilirken hata!');
            }
        } catch (error) {
            setError('Ürün restore edilemedi! Lütfen tekrar deneyiniz!');
        } finally {
            setLoading(false);
        }
    }


    const deleteProduct = async () : Promise<void> => {
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await productServices.hardDeleteProduct(selectedProductId as string);
            if (response.success){
                setMessage(response.message ? response.message : 'Ürün başarıyla kalıcı olarak silindi!');
                setSelectedProductId("");
                setShowDeleteModal(false);
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Ürün kalıcı olarak silinemedi!');
            }
        } catch (error : any){
            setError('Ürün kalıcı olarak silinirken hata ile karşılaşıldı!' + error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <>

            <div
                className="flex items-center justify-center fixed inset-0 top-0 left-0 bottom-0 right-0 bg-black/35 z-50"
            >

                <div className="p-5 min-w-xl bg-red-100 relative mx-4 rounded-lg flex flex-col items-center justify-center">

                    <span onClick={onClose} className="absolute top-2 right-3 font-bold">X</span>

                    <div className="my-4 flex w-full border-b border-gray-700 pb-2 items-start justify-start">
                        <h2 className="font-bold text-xl">Silinen Ürünler</h2>
                    </div>

                    <div className="overflow-x-auto relative rounded-lg">
                        <table className="min-w-full overflow-x-scroll divide-y divide-gray-200">
                            <thead className="py-2 bg-gray-600 text-center text-white font-sans">
                                <th className="px-4 py-2 whitespace-nowrap text-center">
                                    <h2>ID</h2>
                                </th>

                                <th className="px-4 py-2 whitespace-nowrap text-center">
                                    <h2>ÜRÜN</h2>
                                </th>

                                <th className="px-4 py-2 whitespace-nowrap text-center">
                                    <h2>FİYAT</h2>
                                </th>

                                <th className="px-4 py-2 whitespace-nowrap text-center">
                                    <h2>OLUŞTURMA</h2>
                                </th>

                                <th className="px-4 py-2 whitespace-nowrap text-center">
                                    <h2>GÜNCELLENME</h2>
                                </th>

                                <th className="px-4 py-2 whitespace-nowrap text-center">
                                    <h2>İŞLEM</h2>
                                </th>
                            </thead>


                            <tbody>

                                {loading ? (
                                    <tr>
                                        <td className="py-8 bg-white text-center" colSpan={6}>
                                            <h2>Silinen ürünler yükleniyor...</h2>
                                        </td>
                                    </tr>
                                ) : softDeleteData.length > 0 ? (
                                    softDeleteData.map((product) => (
                                        <tr className="w-full bg-gray-100 cursor-pointer border-b text-sm border-gray-300 py-3" key={product._id}>
                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <h2> {product._id.slice(5, 15)} </h2>
                                            </td>

                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <span className="flex items-center justify-center gap-2">
                                                    <img
                                                        src={product.imageUrls[0]}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg"
                                                    />

                                                    <h2>{product.name}</h2>
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <h2> {getTurkishLira(product.price)} </h2>
                                            </td>

                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <h2> {formatDate(product.createdAt)} </h2>
                                            </td>

                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <h2> {formatDate(product.updatedAt)} </h2>
                                            </td>

                                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                                <span className="flex gap-2">

                                                    <button
                                                        type="button"
                                                        className="px-2 py-1 text-center text-white text-sm bg-blue-500 rounded-lg font-sans font-semibold"
                                                        onClick={() => handleRestore(product._id)}
                                                    >
                                                        {loading ? (
                                                            <span>
                                                                <h2 className="text-sm bg-emerald-500 text-white px-2 py-1 text-center font-sans font-semibold">Ediliyor...</h2>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <h2>Restore</h2>
                                                            </span>
                                                        )}

                                                    </button>



                                                    <button
                                                        type="button"
                                                        className="px-2 py-1 text-center text-white text-sm bg-red-500 cursor-pointer rounded-lg font-sans font-semibold"
                                                        onClick={() => handleDelete(product._id)}
                                                    >

                                                        {loading ? (
                                                            <span>
                                                                <h2 className="text-sm bg-red-500 text-white px-2 py-1 text-center font-sans font-semibold">Siliniyor...</h2>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <h2>Sil</h2>
                                                            </span>
                                                        )}

                                                    </button>


                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : !softDeleteData || softDeleteData.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 bg-white text-center">
                                            <h2>Silinen ürün bulunamadı!</h2>
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>


            {showRestoreModal && selectedProductId && (
                <ConfirmBox
                    isOpen={showRestoreModal}
                    onClose={() => setShowRestoreModal(false)}
                    message={'Ürünü restore etmek istediğinize emin misiniz ? '}
                    onSuccess={restoreProduct}
                />
            )}

            {showDeleteModal && selectedProductId && (
                <ConfirmBox 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                message={'Ürünü kalıcı olarak silmek istediğinize emin misiniz ?'}
                onSuccess={deleteProduct}
                />
            )}



        </>
    )
}


export default SoftDeletedProduct