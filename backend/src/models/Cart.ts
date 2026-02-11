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
        trim: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    discount: {
        type: Number,
        required: false,
        trim: true,
        min: 0,
        default: 0
    },
    discountedPrice: {
        type: Number,
        required: false,
        trim: true,
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
        unique: true,
        trim: true,
        sparse: true
    },
    sessionId: {
        type: String,
        required: false,
        sparse: true,
        trim: true,
        lowercase: true
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        required: false,
        trim: true,
        default: 0,
        min: 0
    },
    totalItems: {
        type: Number,
        required: false,
        trim: true,
        default: 0,
        min: 0
    }
}, {
    _id: true,
    timestamps: true
});


cartSchema.index({ 'items.product': 1 });

cartSchema.index(
    { userId: 1 },
    { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } }
);

cartSchema.index(
  { sessionId: 1 },
  { unique: true, partialFilterExpression: { sessionId: { $exists: true, $ne: null } } }
);

cartSchema.pre('save', function () {
    if (this.sessionId === null || this.sessionId === undefined || this.sessionId === '') {
        delete this.sessionId;
    }
});

cartSchema.methods.getItem = function ( productId: Types.ObjectId): ICartItem | undefined {
    return this.items.find((item: ICartItem) =>
        item.product.toString() === productId.toString()
    );
};


const Cart = model<ICart>('Cart', cartSchema);

export default Cart;
