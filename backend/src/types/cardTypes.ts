import { Types, Document } from "mongoose";

export interface ICartItem {
    product: Types.ObjectId,
    quantity: number;
    price: number;
    discount?: number;
    discountedPrice?: number;
}


export interface ICart extends Document {
    userId?: string;
    sessionId?: string;
    items: ICartItem[];
    totalAmount: number;
    totalItems: number;
    createdAt: Date;
    updatedAt: Date;

    getItem(productId: Types.ObjectId): ICartItem;
}


export interface IAddToCartData {
    productId: Types.ObjectId,
    quantity: number;
    price: number;
}


export interface IUpdateToCartData {
    quantity: number;
}
