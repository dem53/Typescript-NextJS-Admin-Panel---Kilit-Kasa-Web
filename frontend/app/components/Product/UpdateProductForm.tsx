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

    const [updateProductData, setUpdateProductData] = useState<IUpdateProduct>({
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

    useEffect(() => {
        if (data && isOpen) {
            setUpdateProductData({
                name: data.name || '',
                description: data.description || '',
                title: data.title || '',
                subTitle: data.subTitle || '',
                imageUrls: data.imageUrls || [],
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
            setDeletedImages([]);
            setUploadedImages([]);
            setPropertyInput("");
        }
    }, [data, isOpen]);

    if (!data || !isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        setUpdateProductData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    }

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value && !updateProductData.tags.includes(value)) {
            setUpdateProductData((prev) => ({
                ...prev,
                tags: [...prev.tags, value]
            }));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setUpdateProductData((prev) => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setUploadedImages(prev => [...prev, ...newFiles]);
    }

    const handleRemoveUploadedImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

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

            updateProductData.tags.forEach(tag => {
                formData.append('tags', tag.toLowerCase().trim());
            });

            updateProductData.properties.forEach(props => {
                formData.append('properties', props.toLowerCase().trim());
            });

            uploadedImages.forEach(file => {
                formData.append('images', file);
            });

            deletedImages.forEach((img) => {
                formData.append('deleteImages', img);
            });

            const response = await productServices.updateProduct(id as string, formData);


            if (response.success && response) {
                setMessage(response.message ? response.message : 'Ürün başarıyla güncellendi');
                onSuccess();
                onClose();
            } else {
                setError(response.error || response.message || 'Ürün güncellenemedi!');
            }

        } catch (error: any) {
            setError('Ürün güncellenirken hata meydana geldi! ' + error);
            console.error('Ürün güncellenirken hata meydana geldi!', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/35 z-40">
            <div className="min-w-xl p-5 max-h-[90vh] overflow-y-scroll relative rounded-lg bg-zinc-50">

                <span onClick={onClose} className="absolute cursor-pointer top-2 right-4 font-bold text-xl hover:text-red-500">×</span>

                <div className="border-b pb-2 mb-4">
                    <h2 className="font-bold text-xl">Ürün Güncelle</h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {message}
                    </div>
                )}

                <form className="w-full max-h-[80vh]" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col flex-1 items-start justify-center gap-1">
                            <label htmlFor="name">Ürün Adı</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Ürün Adı Giriniz."
                                className="p-2 rounded-lg w-full border border-gray-300"
                                value={updateProductData.name}
                                onChange={handleChange}
                                title="Ürün Adı Giriniz."
                            />
                        </div>

                        <div className="flex flex-col flex-1 items-start justify-center gap-1">
                            <label htmlFor="description">Ürün Açıklaması</label>
                            <input
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Ürün Açıklaması Giriniz."
                                className="p-2 rounded-lg w-full border border-gray-300"
                                value={updateProductData.description}
                                onChange={handleChange}
                                title="Ürün Açıklaması Giriniz."
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
                                className="border w-full rounded-lg border-gray-300 p-2"
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
                            <label htmlFor="tags">Ürün Etiketi Ekle</label>
                            <select
                                id="tags"
                                onChange={handleTagChange}
                                value=""
                                className="border rounded-lg w-full border-gray-300 p-2"
                            >
                                <option value="">Etiket Seç</option>
                                <option value="yeni">Yeni</option>
                                <option value="cok-satan">Çok Satan</option>
                                <option value="populer">Popüler</option>
                                <option value="dayanikli">Dayanıklı</option>
                            </select>
                            
                            {/* Seçili Etiketler */}
                            {updateProductData?.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 w-full">
                                    {updateProductData?.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="text-red-500 hover:text-red-700 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center mt-4 justify-center gap-2">
                        <div className="flex items-start flex-col justify-center gap-1">
                            <label htmlFor="price">Ürün Fiyatı</label>
                            <input
                                type="number"
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
                                type="number"
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
                                type="number"
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
                        <label htmlFor="properties">
                            Ürün Özellikleri ({updateProductData.properties.length}/30)
                        </label>
                        <input
                            type="text"
                            value={propertyInput}
                            onChange={(e) => setPropertyInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddProperty();
                                }
                            }}
                            placeholder="Özellik girin ve Enter'a basın"
                            className="p-2 rounded-lg w-full border border-gray-300"
                        />

                        <button
                            type="button"
                            disabled={!propertyInput.trim() || updateProductData.properties.length >= 30}
                            onClick={handleAddProperty}
                            className="px-4 text-white border-hidden border mt-2 text-sm py-1 cursor-pointer bg-emerald-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600"
                        >
                            Ekle {updateProductData.properties.length >= 30 && "(Maksimum)"}
                        </button>

                        <ul className="mt-2 w-full space-y-1">
                            {updateProductData.properties.map((prop, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                >
                                    <span>({index + 1}) {prop}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUpdateProductData((prev) => ({
                                                ...prev,
                                                properties: prev.properties.filter((_, i) => i !== index),
                                            }))
                                        }
                                        className="text-red-500 text-xs hover:text-red-700"
                                    >
                                        Sil
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {existingImages.length > 0 && (
                        <div className='my-3 mb-4'>
                            <div className='text-sm font-medium text-gray-700 mb-2'>
                                Mevcut Resimler ({existingImages.length}):
                            </div>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {existingImages.map((imageUrl, index) => (
                                    <div key={index} className='relative'>
                                        <img
                                            src={imageUrl}
                                            alt={`Existing ${index + 1}`}
                                            className='w-20 h-20 object-cover rounded border'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                                            title='Resmi kaldır'
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {uploadedImages.length > 0 && (
                        <div className='my-3'>
                            <div className='text-sm font-medium text-gray-700 mb-2'>
                                Yeni Yüklenen Resimler ({uploadedImages.length}):
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {uploadedImages.map((file, index) => (
                                    <div key={index} className='relative'>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New ${index + 1}`}
                                            className='w-20 h-20 object-cover rounded border'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveUploadedImage(index)}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600'
                                            title='Resmi kaldır'
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yeni Resim Ekle
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="p-2 border-2 border-blue-500 rounded-lg cursor-pointer w-full"
                            title="Resim yüklemek için seçiniz"
                            multiple
                        />
                    </div>

                    <div className="w-full mt-6">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 px-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Güncelleniyor...' : 'Güncelle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProductForm