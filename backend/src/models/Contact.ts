import { model, Schema, Document } from "mongoose";
import { IContact } from "../types/contactTypes";


export interface IContactModal extends IContact, Document {}


const ContactSchema = new Schema<IContactModal>({
    name: {type: String, trim: true, required: true},
    lastname: {type: String, trim: true, required: true},
    email: {type: String, trim: true, required: true},
    phone: {type: String, trim: true, required: true, maxLength: 11},
    message: {type: String, required: true, trim: true, minLength: 10},
    status: {type: Boolean,trim: true,default: false}
}, {
    timestamps: true
});


const Contact = model<IContactModal>('contact', ContactSchema);

export default Contact
