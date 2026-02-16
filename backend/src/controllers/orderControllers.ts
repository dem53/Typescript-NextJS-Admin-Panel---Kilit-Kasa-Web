import { Request, Response, NextFunction } from "express";
import { ICreateOrder, IUpdateOrder, OrderStatus, PaymentStatus } from "../types/orderTypes";
import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";



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
        }

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

    
        const clearResult = await Cart.findOneAndUpdate(
            {
                $or: [
                    { userId: userId },
                    { sessionId: sessionId }
                ]
            },
            { 
                $set: {
                    items: [], 
                    totalAmount: 0, 
                    totalItems: 0 
                }
            },
            { new: true, runValidators: true }
        );


        if (!clearResult) {
            console.warn("UYARI: Sepet temizlenemedi - sepet bulunamadı!");
        }

        return res.status(201).json({
            success: true,
            message: 'Sipariş başarıyla oluşturuldu!',
            data: newOrder
        });


    } catch (error) {
        console.error("Sipariş oluşturma hatası:", error);
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

        const { customerInfo, paymentType, orderType, paymentStatus, orderStatus } : IUpdateOrder = req.body;


        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Sipariş Numarası bulunamadı!'
            });
        }


        if (!customerInfo || !paymentType || !orderType || !paymentStatus || !orderStatus) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş durumu veya ödeme durumu bulunamadı!'
            });
        }

        const validOrderTypes = ['online', 'shop'];
        const validPaymentTypes = ['cash', 'credit_card'];
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

        if(!validOrderTypes.includes(orderType)){
            return res.status(400).json({
                success: false,
                message: 'Sipariş tipi beklenilen değerde değil!'
            });
        }

        if(!validPaymentTypes.includes(paymentType)){
            return res.status(400).json({
                success: false,
                message: 'Sipariş ödeme tipi beklenilen değerde değil!'
            });
        }


        let customer = customerInfo;

        if(!customer.name || !customer.phone || !customer.email || !customer.city || !customer.district || !customer.deliveryAddress || !customer.surname){
            return res.status(400).json({
                success: false,
                message: 'Sipariş irtibat bilgileri boş bırakılamaz !'
            })
        }

        const updateOrder = await Order.findById(id);

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

            if (orderType){
                updateOrder.orderType = orderType;
            }

            if (paymentType){
                updateOrder.paymentType = paymentType;
            }

            if (customerInfo){
                updateOrder.customerInfo.deliveryAddress = customer.deliveryAddress;
                updateOrder.customerInfo.city = customer.city;
                updateOrder.customerInfo.district = customer.district;
                updateOrder.customerInfo.email = customer.email;
                updateOrder.customerInfo.surname = customer.surname;
                updateOrder.customerInfo.phone = customer.phone;
                updateOrder.customerInfo.phone2 = customer.phone2;
                updateOrder.customerInfo.invoiceAddress = customer.invoiceAddress;
                updateOrder.customerInfo.name = customer.name;
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

        if (!deleteOrder) {
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

    } catch (error: any) {
        console.error('Sipariş silinirken hata meydana geldi!' + error.message);
        return res.status(500).json({
            success: false,
            message: 'Sipariş Silenemedi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}


export const approveOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Onaylanacak sipariş ID bulunamadı!'
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş bulunamadı!'
            });
        }

        if (order.orderStatus === OrderStatus.SUCCESS) {
            return res.status(400).json({
                success: false,
                message: 'Sipariş zaten onaylanmış!'
            });
        }

        if (order.orderStatus === OrderStatus.CANCELLED) {
            return res.status(400).json({
                success: false,
                message: 'İptal edilmiş sipariş onaylanamaz!'
            });
        }

        const orderItems = order.items;

        for (const item of orderItems) {

            const productId = item.product._id;
            const productName = item.product.name;

            const product = await Product.findById(productId).select('_id stock imageUrls name color price');


            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Ürün bulunamadı! ${productName} - ${productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Yetersiz stok: ${productName}. Mevcut: ${product.stock}, İstenen: ${item.quantity}`
                });
            }
        }

   
        for (const item of orderItems) {

            const productId = item.product._id;

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            console.log(`Ürün ${productId} için stok güncellendi. Yeni stok: ${updatedProduct?.stock}`);
        }

        order.orderStatus = OrderStatus.SUCCESS; 
        order.paymentStatus = PaymentStatus.SUCCESS; 
        

        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Sipariş Başarıyla Onaylandı ve Stok Düşüldü!',
            data: order
        });


    } catch (error: any) {
        console.error('Sipariş onaylama hatası:', error);
        return res.status(500).json({
            success: false,
            message: 'Sipariş onaylanırken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}

