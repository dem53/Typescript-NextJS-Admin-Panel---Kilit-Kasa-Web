import { model, Schema, Document } from "mongoose";
import { IUser, IUserRole } from "../types/userTypes";

export interface IUserModal extends IUser, Document { }

const UserSchema = new Schema<IUserModal>({

    username: {
        type: String,
        required: true,
        trim: true
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    role: {
        type: String,
        enum: Object.values(IUserRole),
        default: IUserRole.CUSTOMER || 'customer',
        trim: true
    },

    endLoginTime: {
        type: Date,
        default: null,
    }

}, {
    timestamps: true
});

const User = model<IUserModal>('user', UserSchema);

export default User;
