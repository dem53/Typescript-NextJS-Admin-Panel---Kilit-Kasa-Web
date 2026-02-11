import { model, Schema, Model } from "mongoose";
import { ICustomerInfo, IOrder, IOrderItem, OrderStatus, OrderType, PaymentStatus, PaymentType } from "../types/orderTypes";


const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        _id: {
            type: String, required: true
        },
        name: {
            type: String, required: true
        },
        imageUrls: [{
            type: String, required: true
        }],
        price: {
            type: Number, required: true
        },
        color: {
            type: String, required: true
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        trim: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
        trim: true
    }
}, {
    _id: false,
    timestamps: false
});


const CustomerInfo = new Schema<ICustomerInfo>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        maxLength: 11,
        minLength: 11,
        trim: true
    },
    phone2: {
        type: String,
        required: true,
        maxLength: 11,
        minLength: 11,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },

    deliveryAddress: {
        type: String,
        required: true,
        trim: true
    },

    invoiceAddress: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    district: {
        type: String,
        required: true,
        trim: true
    }
}, {
    _id: false,
    timestamps: false
});


const OrderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        trim: true
    },

    sessionId: {
        type: String,
        required: false,
        trim: true
    },

    items: [OrderItemSchema],
    customerInfo: CustomerInfo,
    orderType: {
        type: String,
        enum: Object.values(OrderType),
        required: true
    },
    paymentType: {
        type: String,
        enum: Object.values(PaymentType),
        required: true,
    },
    orderStatus: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING || 'pending'
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    subTotal: {
        type: Number,
        required: true,
        trim: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        required: false,
        trim: true
    },
    discountTotal: {
        type: Number,
        default: 0,
        min: 0,
        trim: true,
        required: false
    }

}, {
    _id: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ sesionId: 1 });
OrderSchema.index({ userId: 1 });


interface IOrderModal extends Model<IOrder> {
    generateOrderNumber(): Promise<string>;
}


OrderSchema.statics.generateOrderNumber = async function (): Promise<string> {

    const prefix = "ORD";
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let orderNumber;
    let isUnique = false;

    while (!isUnique) {
        
        let randomPart = "";

        for (let i = 0; i < 9; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomPart += characters.charAt(randomIndex);
        }

        orderNumber = `${prefix}${randomPart}`

        const existingOrder = await this.findOne({ orderNumber });
        if (!existingOrder) {
            isUnique = true;
        }
    }

    return orderNumber as string
}


const Order = model<IOrder, IOrderModal>('order', OrderSchema);


export default Order;