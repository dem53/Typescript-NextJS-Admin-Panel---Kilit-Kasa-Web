import { Request, Response } from "express";
import Cart from "../models/Cart";
import { Types } from "mongoose";
import Product from "../models/Product";


interface IAuthRequest extends Request {
    userId?: string;
    sessionId?: string;
}

const findCart = async (userId?: string, sessionId?: string) => {
    return Cart.findOne({
        $or: [
            ...(userId ? [{ userId }] : []),
            ...(sessionId ? [{ sessionId }] : [])
        ]
    });
};



export const getAllCart = async (req: Request, res: Response) => {

    try {

        const cartData = await Cart.find().populate({
            path: 'items.product',
            select: 'name price isSelling imageUrls',
            model: 'product'
        }).sort({ createdAt: -1 });

        if (!cartData || cartData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Mevcut Sepet Bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tüm sepetler başarıyla getirildi',
            data: cartData
        });

    } catch (error) {
        console.error('Tüm sepetler getirilemedi!' + error);
        return res.status(500).json({
            success: false,
            message: 'Tüm sepetler getirilirken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}


export const getUserCart = async (req: IAuthRequest | any, res: Response) => {
    try {

        const userId = req.user?._id?.toString();
        const sessionId = req.sessionId;

        if (!userId && !sessionId) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı Id veya Misafir ID bulunamadı!'
            })
        }

        let cart;

        if (userId) {
            cart = await Cart.findOne({ userId })
                .populate({
                    path: 'items.product',
                    select: 'name price imageUrls isSelling stock',
                    model: 'product'
                });
        } else if (sessionId) {
            cart = await Cart.findOne({ sessionId })
                .populate({
                    path: 'items.product',
                    select: 'name price imageUrls isSelling stock',
                    model: 'product'
                });
        }

        if (!cart) {
            cart = await Cart.create({
                ...(userId && { userId }),
                ...(sessionId && { sessionId }),
                items: [],
                totalAmount: 0,
                totalItems: 0
            });

            return res.status(200).json({
                success: true,
                message: 'Yeni sepet oluşturuldu',
                data: cart
            });
        }

        console.log("cart: ", cart);

        let cartItems = cart.items;

        let hasChanges : boolean = false;


        const activeItems = cartItems.filter((item: any) => {
            if (!item.product || typeof item.product !== 'object') {
                hasChanges = true;
                return false;
            }

            const product = item.product as any;

            if (product.isSelling === false) {
                hasChanges = true;
                return false;
            }

            if (product.stock <= 0) {
                hasChanges = true;
                return false;
            }

            if (item.quantity > product.stock) {
                item.quantity = product.stock;
                hasChanges = true;
            }

            return true;
        });


        if (hasChanges) {

            cart.items = activeItems;

            cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

            await cart.save();

            return res.status(200).json({
                success: true,
                message: 'Sepetinizde bazı ürünler güncellendi',
                data: cart,
                cartUpdated: true
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Sepet başarıyla getirildi',
            data: cart,
            cartUpdated: false
        });

    } catch (error) {
        console.error('Sepet getirilemedi!' + error);
        return res.status(500).json({
            success: false,
            message: 'Sepet getirilirken hata ile karşılaşıldı',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}


export const addToCart = async (req: IAuthRequest | any, res: Response) => {
    try {

        const userId = req.user?._id?.toString();
        const sessionId = req.sessionId;

        const { productId, quantity = 1 } = req.body;

        console.log("PRODUCT ID : ", productId);
        console.log("QUANTİTY : ", quantity);
        console.log("REQ SESSİON : ", sessionId);

        if (!userId && !sessionId) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı ID veya Misafir ID bulunamadı! Misafir ID gerekli'
            });
        }

        if (!productId) {
            return res.status(404).json({
                success: false,
                message: 'Ürün ID gereklidir!'
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Ürün miktarı 1 dan az veya eşit olamaz!'
            });
        }

        if (!Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz Ürün ID'
            });
        }

        const product = await Product.findById(productId);
        if (!product || product.isSelling === false) {
            return res.status(400).json({
                success: false,
                message: 'Ürün bulunamadı!'
            });
        }

        const filter = userId
            ? { userId }
            : { sessionId };

        const cart = await Cart.findOneAndUpdate(
            filter,
            {
                $setOnInsert: {
                    ...(userId && { userId }),
                    ...(sessionId && { sessionId }),
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                }
            },
            { new: true, upsert: true }
        );

        const existingItem = cart.getItem(new Types.ObjectId(productId));
        const productStock = product.stock;

        const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
        const totalQuantityAfterAdd = currentQuantityInCart + quantity;


        if (totalQuantityAfterAdd > productStock) {
            return res.status(400).json({
                success: false,
                message: `Bu üründen en fazla ${productStock} adet ekleyebilirsiniz. Sepetinizde zaten ${currentQuantityInCart} adet var.`,
            });
        }

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: product._id,
                quantity,
                price: product.price
            } as any);
        }

        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);


        await cart.save();

        return res.status(201).json({
            success: true,
            message: 'Sepete başarıyla eklendi! Sepet güncellendi!',
            data: cart
        });
    } catch (error) {
        console.error('Sepete ürün eklenirken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Sepete ürün eklenirken hata!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};


export const updateCart = async (req: IAuthRequest | any, res: Response) => {
    try {

        const userId = req.user?._id?.toString();
        const sessionId = req.sessionId;

        const { productId } = req.params;

        const { quantity } = req.body;

        if (!userId && !sessionId) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı ID veya Misafir ID Bulunamadı!'
            });
        }

        if (!productId) {
            return res.status(404).json({
                success: false,
                message: 'Ürün ID Bulunamadı!'
            });
        }

        if (!Types.ObjectId.isValid(productId as string)) {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz Ürün ID'
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Ürün miktarı 0 dan az olamaz!'
            });
        }

        let cart = await findCart(userId, sessionId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Sepet bulunamadı!'
            });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Ürün sepette bulunamadı!'
            });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        cart.totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        cart.totalAmount = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.price, 0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Sepet başarıyla güncellendi!',
            data: cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Sepet güncellenirken hata oluştu',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}



export const removeFromCart = async (req: IAuthRequest | any, res: Response) => {
    try {

        const userId = req.user?._id?.toString();
        const sessionId = req.sessionId;

        const { productId } = req.params;

        if (!userId && !sessionId) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı ID veya Misafir ID Bulunamadı!'
            });
        }

        if (!productId) {
            return res.status(404).json({
                success: false,
                message: 'Ürün ID bulunamadı!'
            });
        }

        if (!Types.ObjectId.isValid(productId as string)) {
            return res.status(400).json({
                success: false,
                message: 'Ürün ID geçersiz!!'
            });
        }

        let cart = await findCart(userId, sessionId);


        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Sepet bulunamadı!'
            });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        cart.totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity, 0
        );


        cart.totalAmount = cart.items.reduce(
            (sum, item) => sum + item.quantity * item.price, 0
        );


        await cart.save();


        return res.status(200).json({
            success: true,
            message: 'Ürün sepetten başarıyla çıkarıldı',
            data: cart
        });

    } catch (error) {
        console.error('Ürün sepetten çıkarılamadı!' + error);
        return res.status(500).json({
            success: false,
            message: 'Ürün sepetten çıkarılırken hata ile karşılaşıldı',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}




export const clearCart = async (req: IAuthRequest | any, res: Response) => {
    try {

        const userId = req.user?._id?.toString();
        const sessionId = req.sessionId;

        if (!userId && !sessionId) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı ID veya Misafir ID Bulunamadı!'
            });
        }

        let cart = await findCart(userId, sessionId);

        if (!cart) {
            return res.status(404).json({
                sucess: false,
                message: 'Sepet Bulunamadı!'
            });
        }


        cart.items = [];
        cart.totalAmount = 0;
        cart.totalItems = 0;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Sepet Başarıyla Temizlendi!',
            data: cart
        });

    } catch (error) {
        console.error('Sepet temizlenemedi!' + error);
        return res.status(500).json({
            success: false,
            message: 'Sepet temizlenirken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}