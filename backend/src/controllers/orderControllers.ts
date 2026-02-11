import { Request, Response, NextFunction } from "express";
import { ICreateOrder, IUpdateStatusOrder, OrderStatus, PaymentStatus } from "../types/orderTypes";
import Cart from "../models/Cart";
import Order from "../models/Order";
import { Types } from "mongoose";



export const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orderData = await Order.find().sort({ createdAt: -1 });

        if (!orderData || orderData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Siparişler bulunamadı! Sipariş mevcut değil!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Siparişler başarıyla getirildi',
            data: orderData
        });


    } catch (error) {
        console.error('Sepetler getirilemedi!' + error);
        return res.status(500).json({
            success: false,
            message: 'Siparişler getirilirken hata ile karşılaşıldı',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        })
    }
}


export const createOrder = async (req: Request | any, res: Response, next: NextFunction) => {
    try {

        const userId = req.user?._id;
        const sessionId = req.sessionId;

        const { customerInfo, paymentType, orderType }: ICreateOrder = req.body;

        if (!userId && !sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı veya Misafir ID bulunamadı!'
            });
        };

        if (!customerInfo) {
            return res.status(404).json({
                success: false,
                message: 'Adres bilgisinin girilmesi zorunludur!'
            });
        }

        const validPayment = ['credit_card', 'cash'];
        const validOrder = ['online', 'shop'];
        if (!validPayment.includes(paymentType)) {
            return res.status(400).json({
                success: false,
                message: 'Ödeme yöntemi geçersiz'
            });
        }

        if (!validOrder.includes(orderType)) {
            return res.status(400).json({
                success: false,
                message: 'Sipariş tipi geçersiz'
            });
        }

        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId }).
                populate({
                    path: 'items.product',
                    select: 'name price imageUrls color _id',
                    model: 'product'
                });
        } else if (sessionId) {
            cart = await Cart.findOne({ sessionId }).
                populate({
                    path: 'items.product',
                    select: 'name price imageUrls color _id',
                    model: 'product'
                });
        }


        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Sepetiniz BOŞ! Sepette ürün bulunamadı!'
            });
        }

        const orderNumber = await Order.generateOrderNumber();

        const orderItems = cart.items.map((item: any) => {

            let productData;

            if (item.product) {
                productData = item.product;
            } else {
                throw new Error('Sepette geçersiz ürün mevcut!');
            }

            const productId = productData._id ? productData._id.toString() : '';
            const productName = productData.name;
            const productImageUrls = Array.isArray(productData.imageUrls) ? productData.imageUrls : [];
            const productPrice = productData.price;
            const productColor = productData.color;

            const quantity = item.quantity || 1;
            const price = productPrice;
            const totalPrice = price * quantity;


            return {
                product: {
                    _id: productId,
                    name: productName,
                    imageUrls: productImageUrls,
                    price: productPrice,
                    color: productColor
                },
                quantity: quantity,
                price: price,
                totalPrice: totalPrice
            };
        });

        const subTotal = cart.totalAmount || orderItems.reduce((sum, item) =>
            sum + item.totalPrice, 0
        );

        let paymentStatus = PaymentStatus.PENDING;
        let orderStatus = OrderStatus.PENDING;

        const newOrder = new Order({
            orderNumber: orderNumber,
            userId: userId,
            sessionId: sessionId,
            items: orderItems,
            customerInfo,
            subTotal: subTotal,
            orderStatus: orderStatus,
            paymentStatus: paymentStatus,
            orderType,
            paymentType,
        });

        await newOrder.save();

        await Cart.findOneAndUpdate(
            {
                $or: [
                    { userId, sessionId }
                ]
            },
            { items: [], totalAmount: 0, totalItems: 0 }
        );

        return res.status(201).json({
            success: true,
            message: 'Sipariş başarıyla oluşturuldu!',
            data: newOrder
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Sipariş oluşturulurken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen kaynaklı Hata!'
        })
    }
}



export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        console.log("ORDER ID : ", req.params);

        const { paymentStatus, orderStatus }: IUpdateStatusOrder = req.body;


        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Sipariş Numarası bulunamadı!'
            });
        }


        if (!paymentStatus || !orderStatus) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş durumu veya ödeme durumu bulunamadı!'
            });
        }


        const validOrderStatus = ['pending', 'success', 'failed', 'cancelled', 'ready', 'shipped'];
        const validPaymentStatus = ['pending', 'success', 'failed', 'cancelled'];

        if (!validOrderStatus.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Sipariş durumu beklenilen değerde değil!'
            });
        }

        if (!validPaymentStatus.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Ödeme durumu beklenilen değerde değil!'
            });
        }


        const updateOrder = await Order.findById(id);

        console.log("UPDATE ORDER :" , updateOrder);

        if (!updateOrder) {
            return res.status(404).json({
                success: false,
                message: 'Güncellenecek sipariş bulunamadı!'
            });
        }

        if (updateOrder) {

            if (paymentStatus) {
                updateOrder.paymentStatus = paymentStatus;
            }

            if (orderStatus) {
                updateOrder.orderStatus = orderStatus;
            }

            await updateOrder.save();
        }


        return res.status(200).json({
            success: true,
            message: 'Sipariş durumu başarıyla güncellendi',
            data: updateOrder
        });

    } catch (error) {
        console.error('Sipariş durumu güncellenirken hata!' + error);
        return res.status(500).json({
            success: false,
            message: 'Sipariş durumu güncellenirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen kaynaklı Hata!'
        });
    }
}



export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek sipariş ID Bulunamadı!'
            });
        }

        const deleteOrder = await Order.findByIdAndDelete(id);
        
        if (!deleteOrder){
            return res.status(404).json({
                success: false,
                message: 'Silinecek Sipariş Bulunamadı!!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Sipariş Başarıyla Silindi!',
            data: deleteOrder
        });

    } catch (error : any) {
        console.error('Sipariş silinirken hata meydana geldi!' + error.message);
        return res.status(500).json({
            success: false,
            message: 'Sipariş Silenemedi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}
