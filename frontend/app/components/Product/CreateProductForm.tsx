"use client";

import { productServices } from "@/app/services/productServices";
import { ICreateProduct } from "@/app/types/productTypes";
import { ChangeEvent, useState } from "react";

interface ICreateProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateProductForm: React.FC<ICreateProductFormProps> = ({ isOpen, onClose, onSuccess }) => {

    if (!isOpen) return null;

    const [createProductData, setCreateProductData] = useState<ICreateProduct>({
        name: '',
        description: '',
        title: '',
        subTitle: '',
        imageUrls: [],
        tags: [],
        category: '',
        price: 0,
        color: '',
        stock: 0,
        isSelling: false,
        weight: '',
        properties: [],
        discount: 0
    });

    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [propertyInput, setPropertyInput] = useState("");


    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [message, setMessage] = useState<string | null>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setCreateProductData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    }


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        if (uploadedImages.length + newFiles.length > 5) {
            setError('En fazla 5 resim yükleyebilirsiniz');
            return;
        }

        const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError('Her resim en fazla 5MB olabilir');
            return;
        }

        setUploadedImages(prev => [...prev, ...newFiles]);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const formData = new FormData();
            formData.append('name', createProductData.name);
            formData.append('title', createProductData.title);
            formData.append('subTitle', createProductData.subTitle);
            formData.append('description', createProductData.description);
            formData.append('price', createProductData.price.toString());
            formData.append('discount', createProductData.discount.toString());
            formData.append('stock', createProductData.stock.toString());
            formData.append('weight', createProductData.weight);
            formData.append('isSelling', String(createProductData.isSelling));
            formData.append('tags', createProductData.tags.toString());
            formData.append('category', createProductData.category);
            formData.append('color', createProductData.color);

            createProductData.properties.forEach(props => {
                formData.append('properties', props);
            });


            uploadedImages.forEach((file) => {
                formData.append('images', file);
            });


            const response = await productServices.createProduct(formData);


            if (response.success && response.data) {
                setMessage('Ürün başarıyla oluşturuldu!');
                setCreateProductData({
                    name: '',
                    description: '',
                    price: 0,
                    title: '',
                    subTitle: '',
                    discount: 0,
                    stock: 0,
                    weight: '',
                    isSelling: false,
                    tags: [],
                    category: '',
                    color: '',
                    properties: [],
                    imageUrls: []
                });
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Ürün oluşturulurken hata!!');
            }

        } catch (error) {
            console.error('Ürün oluşturulamadı!');
            setError('Ürün oluşturulurken hata meydana geldi!' + error);
        } finally {
            setLoading(false);
        }
    }


    const handleAddProperty = () => {
        if (propertyInput.trim() === '' || createProductData.properties.length >= 10) return;

        setCreateProductData((prev) => ({
            ...prev,
            properties: [...prev.properties, propertyInput.trim()],
        }));

        setPropertyInput("");
    };


    return (

        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 bg-black/35 z-50 flex items-center justify-center">
            <div className="p-5 rounded-lg bg-zinc-50 mx-6 flex flex-col max-h-[90vh] overflow-y-scroll items-center justify-center max-w-xl">
                <form onSubmit={handleSubmit} className="w-full space-y-4 relative max-h-[80vh]" method="post">

                    <span className="top-0 cursor-pointer absolute font-bold right-0" onClick={onClose}>X</span>

                    <div className="mb-4 border-b pb-2 border-gray-500">
                        <h2 className="font-bold text-2xl">Ürün Ekle</h2>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col flex-1 items-start text-sm justify-center gap-1">
                            <label htmlFor="name">Ürün Adı</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={createProductData.name}
                                onChange={handleChange}
                                placeholder="Ürün Adını giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Adını Giriniz"
                                required
                            />
                        </div>


                        <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                            <label htmlFor="description">Ürün Açıklaması</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={createProductData.description}
                                onChange={handleChange}
                                placeholder="Ürün Açıklaması giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Açıklaması Giriniz"
                                required
                            />
                        </div>
                    </div>


                    <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col flex-1 items-start text-sm justify-center gap-1">
                            <label htmlFor="title">Ürün Başlığı</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={createProductData.title}
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
                                value={createProductData.subTitle}
                                onChange={handleChange}
                                placeholder="Ürün Alt Başlık giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Alt Başlık Giriniz"
                            />
                        </div>
                    </div>


                    <div className="flex items-start justify-center gap-2">

                        <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                            <label htmlFor="category">Ürün Kategorisi</label>
                            <select
                                name="category"
                                id="category"
                                value={createProductData.category}
                                onChange={handleChange}
                                className="border rounded-lg border-gray-300 w-full text-sm px-1 py-2"
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


                        <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                            <label htmlFor="tags">Ürün Etiketi</label>
                            <select
                                name="tags"
                                id="tags"
                                value={createProductData.tags}
                                onChange={handleChange}
                                className="border rounded-lg border-gray-300 w-full text-sm px-1 py-2"
                            >
                                <option className="py-0.5 mt-1" value={""}>Seçiniz</option>
                                <option className="py-0.5 mt-1" value="yeni">Yeni</option>
                                <option className="py-0.5 mt-1" value="cok-satan">Çok Satan</option>
                                <option className="py-0.5 mt-1" value="populer">Popüler</option>
                                <option className="py-0.5 mt-1" value="dayanikli">Dayanıklı</option>
                            </select>

                        </div>

                    </div>



                    <div className="flex items-center justify-center gap-2">
                        <div className="flex flex-col flex-1 items-start text-sm justify-center gap-1">
                            <label htmlFor="price">Ürün Fiyatı</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={createProductData.price}
                                onChange={handleChange}
                                placeholder="Ürün Fiyatını giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Fiyatını Giriniz"
                                required
                            />
                        </div>


                        <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                            <label htmlFor="stock">Ürün Stok Sayısı</label>
                            <input
                                type="text"
                                id="stock"
                                name="stock"
                                value={createProductData.stock}
                                onChange={handleChange}
                                placeholder="Ürün Stok adedini giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün Stok adedini Giriniz"
                                required
                            />
                        </div>



                        <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                            <label htmlFor="discount">Ürün İndirimi</label>
                            <input
                                type="text"
                                id="discount"
                                name="discount"
                                value={createProductData.discount}
                                onChange={handleChange}
                                placeholder="Ürün İndirimi giriniz."
                                className="p-2 rounded-md border-2 border-gray-300 w-full"
                                title="Ürün İndirimi Giriniz"
                                required
                            />
                        </div>

                    </div>




                    <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                        <label htmlFor="color">Ürün Rengi</label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            value={createProductData.color}
                            onChange={handleChange}
                            placeholder="Ürün Rengini giriniz."
                            className="p-2 rounded-md border-2 border-gray-300 w-full"
                            title="Ürün Rengini Giriniz"
                            required
                        />
                    </div>



                    <div className="flex flex-1 flex-col items-start text-sm justify-center gap-1">
                        <label htmlFor="weight">Ürün Ağırlığı</label>
                        <input
                            type="text"
                            id="weight"
                            name="weight"
                            value={createProductData.weight}
                            onChange={handleChange}
                            placeholder="Ürün Ağırlığını giriniz."
                            className="p-2 rounded-md border-2 border-gray-300 w-full"
                            title="Ürün Ağırlığını Giriniz"
                            required
                        />
                    </div>


                    <div className="flex flex-1 flex-row items-center my-4 text-sm justify-start gap-2">
                        <label htmlFor="isSelling">Ürün Satış Durumu</label>
                        <input
                            type="checkbox"
                            id="isSelling"
                            name="isSelling"
                            checked={createProductData.isSelling}
                            onChange={(e) => setCreateProductData((prev) => ({ ...prev, isSelling: e.target.checked }))}
                            className="p-5 rounded-md  border-2 border-gray-300"
                            title="Ürün Satış durumu Giriniz"
                            required
                        />
                    </div>



                    <div className="flex flex-1 flex-col items-start my-4 text-sm justify-center gap-2">
                        <label htmlFor="properties">Ürün Özellikleri</label>
                        <input
                            type="text"
                            value={propertyInput}
                            onChange={(e) => setPropertyInput(e.target.value)}
                            placeholder="Ürün Özelliğini Giriniz."
                            className="p-2 rounded-md  border-2 w-full border-gray-300"
                        />

                        <button
                            type="button"
                            onClick={handleAddProperty}
                            disabled={
                                createProductData.properties.length >= 30 ||
                                !propertyInput.trim()
                            }
                            className="px-4 text-white border-hidden border mt-2 text-sm py-1 cursor-pointer bg-emerald-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Ekle
                        </button>

                        <ul className="mt-2 w-full space-y-1">
                            {createProductData.properties.map((prop, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center  bg-gray-100 p-2 rounded"
                                >
                                    <span> ({index + 1}) {prop}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCreateProductData((prev) => ({
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

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />


                    <button
                        type="submit"
                        className="py-2 px-2 rounded-lg text-sm text-white font-semibold hover:bg-emerald-600 cursor-pointer duration-500 ease-in-out bg-emerald-500 text-center "
                    >
                        <h2>Ürün Ekle</h2>
                    </button>


                </form>
            </div>
        </div>
    )
}


export default CreateProductForm