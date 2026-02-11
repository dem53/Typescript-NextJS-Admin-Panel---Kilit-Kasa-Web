export interface ICartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        imageUrls: string[];
    };
    quantity: number;
    price: number;
}


export interface ICart {
    _id: string;
    userId?: string;
    sessionId?: string;
    items: ICartItem[];
    totalAmount: number;
    totalItems: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IAddToCartData {
    productId: string;
    quantity?: number;
}


export interface IUpdateToCartData {
    quantity?: number;
}
