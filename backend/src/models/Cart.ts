import { model, Schema, Types } from "mongoose";
import { ICart, ICartItem } from "../types/cardTypes";

const cartItemSchema = new Schema<ICartItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    discountedPrice: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    }
}, {
    _id: false,
    timestamps: false
});

const cartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false,
        default: null,
        sparse: true
    },
    sessionId: {
        type: String,
        required: false,
        default: null,
        sparse: true,
        trim: true
    },
    items: {
        type: [cartItemSchema],
        default: []
    },
    totalAmount: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    },
    totalItems: {
        type: Number,
        required: false,
        default: 0,
        min: 0
    }
}, {
    _id: true,
    timestamps: true
});


cartSchema.index({ 'items.product': 1 });

cartSchema.index({ userId: 1, sessionId: 1 }, {
    unique: true,
    sparse: true,
    partialFilterExpression: {
        $or: [
            { userId: { $type: 'objectId' } },
            { sessionId: { $type: 'string' } }
        ]
    }
});

cartSchema.pre('save', function (next) {
    if (this.sessionId === null || this.sessionId === undefined || this.sessionId === '') {
        this.sessionId = undefined;
    }
    
    if (this.userId === null || this.userId === undefined) {
        this.userId = undefined;
    }
    
});

cartSchema.methods.getItem = function (productId: Types.ObjectId): ICartItem | undefined {
    return this.items.find((item: ICartItem) =>
        item.product.toString() === productId.toString()
    );
};


const Cart = model<ICart>('Cart', cartSchema);

export default Cart;