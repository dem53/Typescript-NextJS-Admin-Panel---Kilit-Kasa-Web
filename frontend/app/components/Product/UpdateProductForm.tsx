"use client";

import { useState, useEffect } from "react";
import { IUpdateProduct, IProduct } from "@/app/types/productTypes";
import { productServices } from "@/app/services/productServices";


interface IUpdateProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    id?: string;
    data?: Partial<IProduct>;
}


export const UpdateProductForm: React.FC<IUpdateProductFormProps> = ({ isOpen, onClose, onSuccess, id, data }) => {

    if (!data || !isOpen) return null;


    useEffect(() => {
        if (data && isOpen) {
            setUpdateProductData({
                name: data.name || '',
                description: data.description || '',
                title: data.title || '',
                subTitle: data.subTitle || '',
                tags: data.tags || [],
                category: data.category || '',
                color: data.color || '',
                stock: data.stock || 0,
                price: data.price || 0,
                isSelling: data.isSelling || false,
                weight: data.weight || '',
                properties: data.properties || [],
                discount: data.discount || 0
            });
            setExistingImages(data.imageUrls || []);
        }
    }, [data, isOpen]);

    const [updateProductData, setUpdateProductData] = useState<IUpdateProduct & { properties: string[] }>({
        name: '',
        description: '',
        title: '',
        subTitle: '',
        imageUrls: [],
        tags: [],
        category: '',
        color: '',
        stock: 0,
        price: 0,
        isSelling: false,
        weight: '',
        properties: [],
        discount: 0,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");

    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [propertyInput, setPropertyInput] = useState("");

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        setUpdateProductData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        setUploadedImages(prev => [...prev, ...newFiles]);
    }

    const handleRemoveExistingImage = (index: number) => {

        const imageToRemove = existingImages[index];

        setExistingImages(prev => prev.filter((_, i) => i !== index));

        setDeletedImages(prev => [...prev, imageToRemove]);
    };


    const handleAddProperty = () => {
        if (propertyInput.trim() === '' || updateProductData.properties.length >= 30)
            return;

        setUpdateProductData((prev) => ({
            ...prev,
            properties: [...prev.properties, propertyInput.trim()]
        }));

        setPropertyInput("");
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const formData = new FormData();
            formData.append('name', updateProductData.name || '');
            formData.append('description', updateProductData.description || '');
            formData.append('title', updateProductData.title || '');
            formData.append('subTitle', updateProductData.subTitle || '');
            formData.append('category', updateProductData.category || '');
            formData.append('color', updateProductData.color || '');
            formData.append('stock', String(updateProductData.stock) || '');
            formData.append('price', String(updateProductData.price) || '');
            formData.append('weight', updateProductData.weight || '');
            formData.append('discount', String(updateProductData.discount) || '');
            formData.append('isSelling', String(updateProductData.isSelling) || '');

            updateProductData.tags?.forEach(tag => {
                formData.append('tags', tag.toLowerCase().trim());
            });

            updateProductData.properties?.forEach(props => {
                formData.append('properties', (props.toLowerCase().trim()));
            })

            uploadedImages?.forEach(file => {
                formData.append('images', file);
            });

            deletedImages.forEach((img) => {
                formData.append('deleteImages', img);
            });

            const response = await productServices.updateProduct(id as string, formData);

            if (response.success && response) {
                setMessage(response.message ? response.message : 'Ürün başarıyla güncellendi');
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Ürün güncellenemedi!');
            }

        } catch (error: any) {
            setError('Ürün güncellenirken hata meydana geldi!' + error);
            console.error('Ürün güncellenirken hata meydana geldi!');
        } finally {
            setLoading(false);
        }
    }



    return (

        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/35 z-40">
            <div className="min-w-xl p-5 max-h-[90vh] overflow-y-scroll relative rounded-lg bg-zinc-50">

                <span onClick={onClose} className="absolute cursor-pointer top-2 right-4 font-bold">X</span>

                <div className="border-b pb-2 mb-4">
                    <h2 className="font-bold text-xl">Ürün Güncelle</h2>
                </div>

                <form className="w-full max-h-[80vh]" onSubmit={handleSubmit}>
                    <div className="flex  items-center  justify-center gap-2">
                        <div className="flex flex-col flex-1 items-start justify-center gap-1">
                            <label htmlFor="name">Ürün Adı</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder={updateProductData.name ? updateProductData.name : 'Ürün Adı Giriniz.'}
                                className="p-2 rounded-lg w-full border border-gray-300"
                                value={updateProductData.name}
                                onChange={handleChange}
                                title={'Ürün Adı Giriniz.'}
                            />
                        </div>



                        <div className="flex flex-col flex-1 items-start justify-center gap-1">
                            <label htmlFor="description">Ürün Açıklaması</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                placeholder={updateProductData.description ? updateProductData.description : 'Ürün Adı Giriniz.'}
                                className="p-2 rounded-lg w-full border border-gray-300"
                                value={updateProductData.description}
                                onChange={handleChange}
                                title={'Ürün Açıklaması Giriniz.'}
                            />
                        </div>
                    </div>


                    <div className="flex items-center justify-center mt-3 gap-2">
                        <div className="flex flex-col flex-1 items-start text-sm justify-center gap-1">
                            <label htmlFor="title">Ürün Başlığı</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={updateProductData.title}
                                onChange={handleChange}
                                placeholder="Ürün Başlığı giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Başlığı Giriniz"
                            />
                        </div>


                        <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                            <label htmlFor="subTitle">Ürün Alt Başlığı</label>
                            <input
                                type="text"
                                id="subTitle"
                                name="subTitle"
                                value={updateProductData.subTitle}
                                onChange={handleChange}
                                placeholder="Ürün Alt Başlık giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Alt Başlık Giriniz"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="flex flex-1 flex-col items-start justify-center gap-1">
                            <label htmlFor="category">Ürün Kategorisi</label>
                            <select
                                name="category"
                                id="category"
                                value={updateProductData.category}
                                onChange={handleChange}
                                className="border w-full rounded-lg border-gray-300 p-1"
                            >
                                <option value="">Seçiniz</option>
                                <option value="kilit">Mekanik Kilit</option>
                                <option value="elektronik-kilit">Elektronik Kilit</option>
                                <option value="otel-elektronik-kilit">Otel Elektronik Kilit</option>
                                <option value="kasa">Kasa</option>
                                <option value="kapi">Kapı</option>
                                <option value="aksesuar">Aksesuar</option>
                            </select>
                        </div>


                        <div className="flex flex-1 flex-col items-start justify-center gap-1">
                            <label htmlFor="tags">Ürün Etiketi</label>
                            <select
                                name="tags"
                                id="tags"
                                value={updateProductData.tags}
                                onChange={handleChange}
                                className="border rounded-lg w-full border-gray-300 p-1"
                            >
                                <option value="yeni">Yeni</option>
                                <option value="cok-satan">Çok Satan</option>
                                <option value="populer">Popüler</option>
                                <option value="dayanikli">Dayanıklı</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center mt-4 justify-center gap-2">

                        <div className="flex items-start flex-col justify-center gap-1">
                            <label htmlFor="price">Ürün Fiyatı</label>
                            <input
                                type="text"
                                name="price"
                                id="price"
                                value={updateProductData.price}
                                onChange={handleChange}
                                className="p-2 rounded-lg w-full border border-gray-300"
                            />
                        </div>


                        <div className="flex items-start flex-col justify-center gap-1">
                            <label htmlFor="stock">Ürün Stok</label>
                            <input
                                type="text"
                                name="stock"
                                id="stock"
                                value={updateProductData.stock}
                                onChange={handleChange}
                                className="p-2 rounded-lg w-full border border-gray-300"
                            />
                        </div>


                        <div className="flex items-start flex-col justify-center gap-1">
                            <label htmlFor="discount">Ürün İndirimi</label>
                            <input
                                type="text"
                                name="discount"
                                id="discount"
                                value={updateProductData.discount}
                                onChange={handleChange}
                                className="p-2 rounded-lg w-full border border-gray-300"
                            />
                        </div>

                    </div>


                    <div className="flex items-center justify-center mt-4 gap-2">
                        <div className="flex items-start flex-col flex-1 justify-center gap-1">
                            <label htmlFor="color">Ürün Rengi</label>
                            <input
                                type="text"
                                name="color"
                                id="color"
                                value={updateProductData.color}
                                onChange={handleChange}
                                className="p-2 rounded-lg w-full border border-gray-300"
                            />
                        </div>



                        <div className="flex items-start flex-col flex-1 justify-center gap-1">
                            <label htmlFor="weight">Ürün Ağırlığı</label>
                            <input
                                type="text"
                                name="weight"
                                id="weight"
                                value={updateProductData.weight}
                                onChange={handleChange}
                                className="p-2 rounded-lg w-full border border-gray-300"
                            />
                        </div>
                    </div>


                    <div className="flex mt-2 items-center justify-start gap-2">
                        <label htmlFor="isSelling">Satış Durumu</label>
                        <input
                            type="checkbox"
                            id="isSelling"
                            name="isSelling"
                            checked={updateProductData.isSelling}
                            onChange={(e) => setUpdateProductData((prev) => ({ ...prev, isSelling: e.target.checked }))}
                        />
                    </div>


                    <div className="flex items-start flex-col mt-4 flex-1 justify-center gap-1">
                        <label htmlFor="properties">Ürün Özellikleri</label>
                        <input
                            type="text"
                            value={propertyInput}
                            onChange={(e) => setPropertyInput(e.target.value)}
                            className="p-2 rounded-lg w-full border border-gray-300"
                        />

                        <button
                            type="button"
                            disabled={!propertyInput.trim() || updateProductData.properties.length >= 30}
                            onClick={handleAddProperty}
                            className="px-4 text-white border-hidden border mt-2 text-sm py-1 cursor-pointer bg-emerald-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Ekle
                        </button>



                        <ul className="mt-2 w-full space-y-1">
                            {updateProductData.properties.map((prop, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center  bg-gray-100 p-2 rounded"
                                >
                                    <span> ({index + 1}) {prop}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUpdateProductData((prev) => ({
                                                ...prev,
                                                properties: prev.properties.filter((_, i) => i !== index),
                                            }))
                                        }
                                        className="text-red-500 text-xs"
                                    >
                                        Sil
                                    </button>
                                </li>
                            ))}
                        </ul>

                    </div>


                    {existingImages.length > 0 && (
                        <div className='my-3 mb-4'>
                            <div className='text-sm font-medium text-gray-700 mb-2'>Mevcut Resimler:</div>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {existingImages.map((imageUrl, index) => (
                                    <div key={index} className='relative'>
                                        <img
                                            src={imageUrl}
                                            alt={`Existing ${index + 1}`}
                                            className='w-14 h-14 object-cover rounded border'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                                            title='Resmi kaldır'
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="mt-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="p-5 border-2 border-blue-500 rounded-lg cursor-pointer"
                            title="Resim yüklemek için seçiniz"
                            multiple
                        />
                    </div>



                    <div className="w-full mt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 px-4 text-center text-white bg-blue-500 rounded-lg"
                        >
                            <h2>Güncelle</h2>
                        </button>
                    </div>

                </form>


            </div>
        </div>
    )
}



export default UpdateProductForm