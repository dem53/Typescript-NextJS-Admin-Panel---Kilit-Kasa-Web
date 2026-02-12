import { Response, Request, NextFunction } from "express";
import User from "../models/User";
import { ICreateUser, IUpdateUser } from "../types/userTypes";
import bcrypt from "bcryptjs";


export const getMe = (req: Request | any, res: any) => {
    try {

        const reqUserControl = req.user;

        if (!reqUserControl){
            return res.status(401).json({
                success: false,
                message: 'Giriş yapmış kullanıcı bulunamadı! Yetkisiz Erişim!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Kullanıcı bilgileri başarıyla getirildi',
            data: {
                id: req.user?._id,
                isAdmin: req.user?.isAdmin,
                role: req.user?.role,
                username: req.user?.username,
                firstName: req.user?.firstName
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Kullanıcı bilgileri getirilirken hata!',
            error: error instanceof Error ? error.message : 'Bilinmeyen kaynaklı hata!'
        });
    }
}


export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userData = await User.find().sort({
            createdAt: -1
        }).select('-password');

        if (!userData || userData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı verileri bulunamadı! Mevcut Değil.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Kullanıcı verileri başarıyla getirildi!',
            data: userData
        });

    } catch (error) {
        console.error('Kullanıcı verileri getirilemedi! API Hatası!');
        return res.status(500).json({
            success: false,
            messasge: 'Kullanıcı verileri getirilirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!!'
        });
    }
};


export const createUser = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, username, password, isAdmin = false, role }: ICreateUser = req.body;

        if (!firstName || !lastName || !email || !username || !password || !role ) {
            return res.status(404).json({
                success: false,
                message: 'Tüm zorunlu alanların doldurulması gereklidir!'
            });
        }

        if (typeof isAdmin !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Admin belirteçi ${boolean} tipinde olmalıdır!'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Şifre karakter uzunluğu 8 karakterden az olamaz!'
            });
        }

        const validRoles = ['admin', 'personel', 'manager', 'customer'];

        if (!validRoles.includes(role)){
            return res.status(400).json({
                success: false,
                message: 'Kullancı rolü beklenilen değerde değil!'
            })
        }

        const passwordHashed = await bcrypt.hash(password, 12);

        let userRole = 'customer';

        const createUser = await User.create({
            firstName,
            lastName,
            email,
            username,
            isAdmin,
            password: passwordHashed,
            role: userRole
        });

        return res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu!',
            data: createUser
        });

    } catch (error) {
        console.error('Kullanıcı oluşturulurken hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Kullanıcı oluşturulurken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}


export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Güncellenecek kullanıcı ID bulunamadı!"
            });
        }

        const { firstName, lastName, role, username, email, password, isAdmin }: IUpdateUser = req.body;

        const updateData: Partial<IUpdateUser & { password: string }> = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (role) updateData.role = role;

        if (typeof isAdmin === "boolean") {
            updateData.isAdmin = isAdmin;
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Şifre en az 8 karakter olmalıdır!"
                });
            }
            updateData.password = await bcrypt.hash(password, 12);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Güncellenecek herhangi bir alan bulunamadı!"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Güncellenecek kullanıcı bulunamadı!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Kullanıcı başarıyla güncellendi!",
            data: updatedUser
        });

    } catch (error) {
        console.error("Kullanıcı güncellenirken hata:", error);
        return res.status(500).json({
            success: false,
            message: "Kullanıcı güncellenirken hata meydana geldi!",
            error: error instanceof Error ? error.message : "Bilinmeyen Hata!"
        });
    }
};




export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek bir kullanıcı ID bulunamadı!'
            });
        }

        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({
                success: false,
                message: 'Silinecek bir kullanıcı bulunamadı!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Kullanıcı başarıyla silindi!',
            data: deleteUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Kullanıcı silinirken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}