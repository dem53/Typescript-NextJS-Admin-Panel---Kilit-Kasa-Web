export enum OrderType {
   ONLINE = 'online',
   SHOP = 'shop'
}

export enum OrderStatus {
   PENDING = 'pending',
   SUCCESS = 'success',
   FAILED = 'failed',
   CANCELLED = 'cancelled',
   READY = 'ready',
   SHIPPED = 'shipped'
}


export enum PaymentType {
   CREDIT_CARD = 'credit_card',
   CASH = 'cash'
}


export enum PaymentStatus {
   PENDING = 'pending',
   SUCCESS = 'success',
   FAILED = 'failed',
   CANCELLED = 'cancelled'
}


export interface IOrderItem {
   product: {
      _id: string,
      name: string,
      imageUrls: string[],
      price: number,
      color: string,
   },

   quantity: number;
   price: number;
   totalPrice: number;
}


export interface ICustomerInfo {
   name: string;
   surname: string;
   phone: string;
   phone2?: string;
   email: string;
   deliveryAddress: string;
   invoiceAddress?: string;
   city: string;
   district: string;
}


export interface IOrder {
   _id: string,
   userId?: string,
   sessionId?: string,
   orderNumber: string,
   items: IOrderItem[],
   customerInfo: ICustomerInfo,

   subTotal: number;
   discount?: number;
   discountTotal?: number;

   createdAt: Date,
   updatedAt: Date,

   orderType: OrderType,
   orderStatus: OrderStatus,
   paymentType: PaymentType,
   paymentStatus: PaymentStatus,

}


export interface ICreateOrder {
   customerInfo: ICustomerInfo,
   paymentType: PaymentType,
   orderType: OrderType
}



export interface IUpdateStatusOrder {
   paymentStatus?: PaymentStatus | undefined;
   orderStatus?: OrderStatus | undefined;
}