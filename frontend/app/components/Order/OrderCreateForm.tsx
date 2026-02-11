"use client";

import { cartServices } from "@/app/services/cartServices";
import { orderServices } from "@/app/services/orderServices";
import { ICart } from "@/app/types/cartTypes";
import { ICreateOrder, OrderType, PaymentType } from "@/app/types/orderTypes";
import { useEffect, useState } from "react";


interface IOrderCreateFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void
}

interface ICity {
    id: number,
    name: string;
}

interface IDistrict {
    provinceId: number;
    id: number;
    name: string;
}



export const OrderCreateForm: React.FC<IOrderCreateFormProps> = ({ isOpen, onClose, onSuccess }) => {

    if (!isOpen) return null;

    const [createOrderData, setCreateOrderData] = useState<ICreateOrder>({
        customerInfo: {
            name: '',
            surname: '',
            phone: '',
            phone2: '',
            email: '',
            deliveryAddress: '',
            invoiceAddress: '',
            city: '',
            district: ''
        },
        orderType: OrderType.ONLINE,
        paymentType: PaymentType.CASH
    });

    const [cartData, setCartData] = useState<ICart | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>('');

    const [city, setCity] = useState<ICity[]>([]);
    const [district, setDistrict] = useState<IDistrict[]>([]);


    const [addressCheck, setAddressCheck] = useState<boolean>(true);


    const fetchCities = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.turkiyeapi.dev/api/v1/provinces`, {
                headers: {
                    "Content-Type": 'application/json'
                },
                method: "GET"
            });
            if (!response.ok) {
                throw new Error('Şehir verileri çekilemedi!')
            }

            const data = await response.json();
            setCity(data.data);

        } catch (error: any) {
            setError('hata!' + error.message);
        }
    }


    const fetchDistrict = async (): Promise<void> => {

        if (createOrderData.customerInfo.city) {

            setLoading(true);
            try {
                const response = await fetch(`https://api.turkiyeapi.dev/api/v1/districts?province=${createOrderData.customerInfo.city}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error('İlçe verileri çekilemedi!');
                }

                const data = await response.json();
                setDistrict(data.data);

            } catch (error: any) {
                setError('İlçe verileri getirilemedi' + error.message);
            }
        } else {
            setDistrict([]);
        }
    }

    useEffect(() => {
        fetchCities();
    }, []);


    useEffect(() => {
        fetchDistrict();
    }, [createOrderData.customerInfo.city])


    const fetchCart = async () => {
        setLoading(true);
        setMessage("");
        setError(null);
        try {
            const response = await cartServices.getCartSession();
            if (response && response.data) {
                setCartData(response.data);
                setMessage(response.message ? response.message : 'Kullanıcı Sepeti Başarıyla getirildi');
            } else {
                setError(response.error || response.message || 'Kullanıcı sepeti getirilemedi!')
            }
        } catch (error) {
            setError('Kullanıcı sepeti getirilirken hata ile karşılaşıldı!' + error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target;

        if (name.startsWith('customerInfo.')) {
            const field = name.split('.')[1];
            setCreateOrderData(prev => ({
                ...prev,
                customerInfo: {
                    ...prev.customerInfo, [field]: value
                }
            }))
        } else {
            setCreateOrderData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }


    const handleOrderChange = (type: OrderType) => {
        setCreateOrderData(prev => ({
            ...prev,
            orderType: type
        }))
    }


    const handlePaymentChange = (type: PaymentType) => {
        setCreateOrderData(prev => ({
            ...prev,
            paymentType: type
        }))
    }


    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div>
                <h2>Sepetiniz Boş! Sepetinizde ürün bulunmamaktadır!</h2>
            </div>
        )
    }


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');


        if (!cartData || !cartData.items || cartData.items.length === 0) {
            setError('Sepetinizde ürün bulunmamaktadır!');
            return;
        }

        try {

            const orderPayload: ICreateOrder = {
                ...createOrderData,
                customerInfo: {
                    ...createOrderData.customerInfo,
                    invoiceAddress: addressCheck ? createOrderData.customerInfo.deliveryAddress :
                        createOrderData.customerInfo.invoiceAddress
                }
            }

            if (!orderPayload.customerInfo.name ||
                !orderPayload.customerInfo.surname ||
                !orderPayload.customerInfo.email ||
                !orderPayload.customerInfo.phone ||
                !orderPayload.customerInfo.city ||
                !orderPayload.customerInfo.district ||
                !orderPayload.customerInfo.deliveryAddress
            ) {
                setError('Lütfen zorunlu alanları boş bırakmayınız!');
                return;
            }

            const response = await orderServices.createOrder(orderPayload);

            if (response && response.success) {
                setMessage(response.message ? response.message : 'Siparişiniz Başarıyla Oluşturuldu!');
                onClose();
                onSuccess();
            } else {
                setError(response.error || response.message || 'Sipariş Oluşturulamadı!');
            }

        } catch (error) {
            setError('Sipariş oluşturulurken hata meydana geldi! ' + error);
        } finally {
            setLoading(false);
        }

    }


    return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/35 z-50">
            <div className="mx-10 p-5 relative cursor-pointer rounded-lg bg-zinc-200 h-[85vh] w-150 overflow-y-auto">
                <span onClick={onClose} className="absolute top-1 font-extrabold right-2">X</span>

                <div className="w-full mb-6 border-b pb-3 flex items-start">
                    <h2 className="font-bold text-2xl">Siparişi Tamamla!</h2>
                </div>
                <form onSubmit={handleSubmit} className="h-full w-full" method="post">

                    <div className="flex w-full items-center justify-center gap-2">
                        <div className="flex flex-col w-full flex-1 items-center justify-center">
                            <div className="flex flex-col flex-1 w-full items-start gap-1">
                                <label htmlFor="customerInfo.name">Ad</label>
                                <input
                                    type="text"
                                    id="customerInfo.name"
                                    name="customerInfo.name"
                                    value={createOrderData.customerInfo.name}
                                    placeholder="Adınızı Giriniz"
                                    className="p-2 rounded-lg border-2 w-full border-gray-300 "
                                    onChange={handleInputChange}
                                    required
                                    title="Adınız"
                                />
                            </div>
                        </div>



                        <div className="flex flex-col w-full flex-1 items-center justify-center">
                            <div className="flex flex-col flex-1 w-full items-start gap-1">
                                <label htmlFor="customerInfo.surname">Soy Ad</label>
                                <input
                                    type="text"
                                    id="customerInfo.surname"
                                    name="customerInfo.surname"
                                    value={createOrderData.customerInfo.surname}
                                    placeholder="Soy Adınızı Giriniz"
                                    className="p-2 rounded-lg border-2 w-full border-gray-300 "
                                    onChange={handleInputChange}
                                    required
                                    title="Soy Adınız"
                                />
                            </div>
                        </div>
                    </div>





                    <div className="flex mt-6 flex-col w-full items-center gap-4">
                        <div className="border-b pb-2 w-full border-gray-300">
                            <h2 className="font-bold">İLETİŞİM</h2>
                        </div>
                        <div className="flex flex-1 items-center w-full justify-center gap-2">
                            <div className="flex flex-col w-full flex-1 items-center justify-center">
                                <div className="flex flex-col w-full flex-1 items-start gap-1">
                                    <label htmlFor="customerInfo.email">E-Mail Adresi</label>
                                    <input
                                        type="email"
                                        id="customerInfo.email"
                                        name="customerInfo.email"
                                        value={createOrderData.customerInfo.email}
                                        placeholder="E-Mail Adresinizi Giriniz"
                                        className="p-2 rounded-lg w-full border-2 border-gray-300 "
                                        onChange={handleInputChange}
                                        required
                                        title="E-Mail Adresiniz"
                                    />
                                </div>
                            </div>




                            <div className="flex flex-col flex-1 items-center justify-center">
                                <div className="flex flex-col w-full flex-1 items-start gap-1">
                                    <label htmlFor="customerInfo.phone">Telefon</label>
                                    <input
                                        type="text"
                                        id="customerInfo.phone"
                                        name="customerInfo.phone"
                                        value={createOrderData.customerInfo.phone}
                                        placeholder="Telefon Numarası Giriniz"
                                        className="p-2 rounded-lg border-2 w-full border-gray-300 "
                                        onChange={handleInputChange}
                                        maxLength={11}
                                        required
                                        title="Telefon Numarası"
                                    />
                                </div>
                            </div>




                            <div className="flex flex-col flex-1 items-center justify-center">
                                <div className="flex flex-col w-full flex-1 items-start gap-1">
                                    <label htmlFor="customerInfo.phone2">Telefon 2</label>
                                    <input
                                        type="text"
                                        id="customerInfo.phone2"
                                        name="customerInfo.phone2"
                                        maxLength={11}
                                        value={createOrderData.customerInfo.phone2}
                                        placeholder="Alternatif Telefon Numarası"
                                        className="p-2 rounded-lg border-2 w-full border-gray-300 "
                                        onChange={handleInputChange}
                                        title="Alternatif Telefon Numarası"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col flex-1 w-full items-center justify-center">
                            <div className="flex flex-col w-full flex-1 items-start gap-1">
                                <label htmlFor="customerInfo.deliveryAddress">Sipariş Adresi</label>
                                <input
                                    type="text"
                                    id="customerInfo.deliveryAddress"
                                    name="customerInfo.deliveryAddress"
                                    value={createOrderData.customerInfo.deliveryAddress}
                                    placeholder="Adresinizi Giriniz"
                                    className="p-2 rounded-lg border-2 w-full pb-16  border-gray-300 "
                                    onChange={handleInputChange}
                                    required
                                    title="Sipariş Adresiniz"
                                />
                            </div>
                        </div>

                        <div className="flex w-full gap-2">
                            <input
                                id="addressCheck"
                                name="addressCheck"
                                type="checkbox"
                                checked={addressCheck}
                                onChange={(e) => setAddressCheck(e.target.checked)}
                            >
                            </input>
                            <label className="font-semibold underline underline-offset-2" htmlFor="addressCheck" >Fatura Adresim sipariş adresim ile  aynı olsun</label>
                        </div>


                        {!addressCheck && (
                            <div className="flex flex-col flex-1 w-full items-center justify-center">
                                <div className="flex flex-col w-full flex-1 items-start gap-1">
                                    <label htmlFor="customerInfo.invoiceAddress">Fatura Adresi</label>
                                    <input
                                        type="text"
                                        id="customerInfo.invoiceAddress"
                                        name="customerInfo.invoiceAddress"
                                        value={createOrderData.customerInfo.invoiceAddress}
                                        placeholder="Fatura Adresinizi Giriniz"
                                        className="p-2 rounded-lg border-2 w-full pb-16  border-gray-300 "
                                        onChange={handleInputChange}
                                        title="Fatura Adresiniz"
                                    />
                                </div>
                            </div>
                        )}


                        <div className="flex items-center flex-1 justify-center w-full gap-4">
                            <div className="flex flex-col items-start gap-2">
                                <label htmlFor="customerInfo.city">İl</label>
                                <select
                                    name="customerInfo.city"
                                    id="customerInfo.city"
                                    value={createOrderData.customerInfo.city}
                                    onChange={handleInputChange}
                                    required
                                    className="p-2 border-2 border-gray-300"
                                >
                                    <option value="">İl Seçiniz</option>
                                    {city.map((c) => (
                                        <option key={c.id} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>



                            <div className="flex flex-col items-start gap-2">
                                <label htmlFor="customerInfo.district">İlçe</label>
                                <select
                                    name="customerInfo.district"
                                    id="customerInfo.district"
                                    value={createOrderData.customerInfo.district}
                                    onChange={handleInputChange}
                                    required
                                    className="p-2 border-2 w-32 border-gray-300"
                                >

                                    <option value="">İlçe Seçiniz</option>
                                    {district.map((d) => (
                                        <option key={d.id} value={d.name}>
                                            {d.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>



                        <div className="flex flex-col w-full items-start gap-2">
                            <label className="border-b w-full border-b-gray-400 pb-2" htmlFor="orderType">
                                Sipariş Tipi
                            </label>

                            <div className="flex items-center w-full justify-evenly gap-6">
                                <button
                                    type="button"
                                    onClick={() => handleOrderChange(OrderType.ONLINE)}
                                    className={` ${createOrderData.orderType === OrderType.ONLINE ? 'border-blue-500 bg-blue-500 ' : 'border-gray-200 bg-gray-300'} p-5 w-full border rounded-lg cursor-pointer `}
                                >
                                    <div
                                        className={`${createOrderData.orderType === OrderType.ONLINE ? 'bg-blue-500 text-white' : 'bg-gray-300 text-center'} `}
                                    >
                                        <h2>Teslimat</h2>
                                    </div>


                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleOrderChange(OrderType.SHOP)}
                                    className={` ${createOrderData.orderType === OrderType.SHOP ? 'border-orange-500 bg-orange-500' : 'border-gray-200 bg-gray-300'} w-full p-5 border rounded-lg cursor-pointer `}
                                >
                                    <div
                                        className={`${createOrderData.orderType === OrderType.SHOP ? 'bg-orange-500 text-white' : 'bg-gray-300 text-center'}`}
                                    >
                                        <h2>Mağazadan Alım</h2>
                                    </div>


                                </button>
                            </div>

                        </div>




                        <div className="flex flex-col w-full mb-6 items-start gap-2">
                            <label className="border-b w-full border-b-gray-400 pb-2" htmlFor="paymentType">
                                Ödeme Tipi
                            </label>

                            <div className="flex items-center w-full justify-evenly gap-6">
                                <button
                                    type="button"
                                    onClick={() => handlePaymentChange(PaymentType.CASH)}
                                    className={` ${createOrderData.paymentType === PaymentType.CASH ? 'border-blue-500 bg-blue-500 ' : 'border-gray-200 bg-gray-300'} p-5 w-full border rounded-lg cursor-pointer `}
                                >
                                    <div
                                        className={`${createOrderData.paymentType === PaymentType.CASH ? 'bg-blue-500 text-white' : 'bg-gray-300 text-center'} `}
                                    >
                                        <h2>Nakit Ödeme</h2>
                                    </div>


                                </button>

                                <button
                                    type="button"
                                    onClick={() => handlePaymentChange(PaymentType.CREDIT_CARD)}
                                    className={` ${createOrderData.paymentType === PaymentType.CREDIT_CARD ? 'border-orange-500 bg-orange-500' : 'border-gray-200 bg-gray-300'} w-full p-5 border rounded-lg cursor-pointer `}
                                >
                                    <div
                                        className={`${createOrderData.paymentType === PaymentType.CREDIT_CARD ? 'bg-orange-500 text-white' : 'bg-gray-300 text-center'}`}
                                    >
                                        <h2>Banka / Kredi Kartı</h2>
                                    </div>


                                </button>
                            </div>

                        </div>



                    </div>


                    <div className="mb-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-2 py-2 cursor-pointer rounded-lg bg-emerald-500 text-center text-white font-bold "
                        >
                            Siparişi Tamamla
                        </button>
                    </div>

                </form>
            </div>
        </div>

    )
}