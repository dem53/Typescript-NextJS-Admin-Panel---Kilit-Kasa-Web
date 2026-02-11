import { Response, Request, NextFunction } from "express";
import Contact from "../models/Contact";
import { ICreateContact, IUpdateContact, } from "../types/contactTypes";


export const createContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, lastname, email, phone, message }: ICreateContact = req.body;
        if (!name || !lastname || !email || !phone || !message) {
            return res.status(404).json({
                success: false,
                message: 'Tüm zorunlu alanların doldurulması gereklidir!'
            });
        }

        if (message.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Mesaj uzunluğunuz 10 karakterden fazla olması gereklidir.'
            });
        }

        const createContact = await Contact.create({
            name,
            lastname,
            email,
            phone,
            message
        });

        return res.status(201).json({
            success: true,
            message: 'İletişim formu başarıyla gönderildi!',
            data: {
                name: createContact.name,
                lastname: createContact.lastname,
                email: createContact.email,
                phone: createContact.phone,
                message: createContact.message
            }
        });

    } catch (error) {
        console.error("İletişim formu oluşturulurken hata meydana geldi! " + error);
        return res.status(500).json({
            success: false,
            message: 'İletişim form kaydı oluşturulamadı! Sunucu Hatası!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
}


export const getAllContact = async (req: Request, res: Response) => {
    try {
        const contactData = await Contact.find().sort({
            createdAt: -1
        });

        if (!contactData || contactData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'İletişim form kayıtları bulunamadı! Mevcut Değil !'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'İletişim form kayıtları başarıyla getirildi!',
            data: contactData
        });
    } catch (error) {
        console.error('İletişim form kayıtları getirilirken hata!' + error);
        return res.status(500).json({
            success: false,
            message: 'İletişim form kayıtları getirilirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        });
    }
};


export const updateContact = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Sorgulanacak iletişim form kayıt ID`si bulunamadı!'
            });
        }
        const { name, lastname, email, phone, message, status }: IUpdateContact = req.body;

        const updateContact: Partial<IUpdateContact> = {};

        if (name) updateContact.name = name;
        if (lastname) updateContact.lastname = lastname;
        if (email) updateContact.email = email;
        if (phone) updateContact.phone = phone;
        if (message) updateContact.message = message;

        if (typeof status === 'boolean') {
            updateContact.status = status;
        }

        if (Object.keys(updateContact).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Güncellenecek herhangi bir alan bulunamadı!'
            });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            updateContact,
            {
                new: true,
                runValidators: true
            }
        );

        await updatedContact?.save();

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: 'Güncellenecek iletişim form kaydı bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'İletişim form kaydı başarıyla güncellendi',
            data: updatedContact
        });

    } catch (error) {
        console.error("İletişim form kaydı güncellenirken hata!");
        return res.status(500).json({
            success: false,
            message: 'İletişim form kaydı güncellenirken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        })
    }
};


export const deleteContact = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek iletişim form ID bulunamadı!'
            });
        }

        const deleteContact = await Contact.findByIdAndDelete(id);

        if (!deleteContact) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek iletişim form kaydı bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'İletişim form kaydı başarıyla silindi!',
            data: deleteContact
        });


    } catch (error) {
        console.error("İletişim form kaydı silinirken hata!");
        return res.status(500).json({
            success: false,
            message: 'İletişim form kaydı silinirken hata meydana geldi',
            error: error instanceof Error ? error.message : 'Bilinmeyen Kaynaklı Hata!'
        })
    }
}