import { Request, Response, NextFunction } from "express";
import { ILogin, IRegister } from "../types/authTypes";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { IUserRole } from "../types/userTypes";



export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { firstName, lastName, email, username, password }: IRegister = req.body;

        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(404).json({
                success: false,
                message: 'Zorunlu alanların doldurulması gereklidir!'
            })
        }

        if (typeof email !== 'string' || email.trim() === '') {
            return res.status(400).json({
                sucess: false,
                message: 'Email tip değeri boş veya yanlış!'
            });
        }

        if (typeof username !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı adı tip değeri yanlış!'
            });
        }

        if (password.length < 8) {
            return res.status(404).json({
                success: false,
                message: "Parolanız 8 karakterden az olamaz"
            });
        }

        const user = await User.findOne({
            $or: [{ username, email }]
        });

        if (user) {
            return res.status(404).json({
                success: false,
                message: user.username ? "Bu Kullanıcı Adı zaten kayıtlı" :
                    "Bu email adresi zaten kayıtlı!"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        let userRole = IUserRole.CUSTOMER;

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            username,
            password: passwordHash,
            isAdmin: false,
            role: userRole,
            endLoginTime: new Date(),
        });


        const payload = {
            id: newUser?._id,
            isAdmin: newUser?.isAdmin,
            role: newUser?.role,
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            {
                expiresIn: '12h'
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 1000 * 60 * 60 * 12,
            path: "/"
        });


        return res.status(200).json({
            success: true,
            message: 'Kayıt Başarılı',
            data: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Kayıt olunurken hata meydana geldi!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { username, password }: ILogin = req.body;

        if (!username || !password) {
            return res.status(404).json({
                success: false,
                message: 'Lütfen zorunlu alanları doldurunuz!'
            });
        }

        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı adı veya şifre beklenilen tip formatında değil!'
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Böyle bir emaile kayıtlı kullanıcı bulunamadı!'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Şifreniz yanlış! Lütfen tekrar deneyiniz!'
            });
        }


        const userID = user?._id;

        if (!userID) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcıya ait ID bulunamadı!'
            });
        }


        await User.findByIdAndUpdate(userID, {
            endLoginTime: new Date(),
        }, {
            timestamps: false
        });

        const payload = {
            id: user?._id,
            isAdmin: user?.isAdmin,
            role: user?.role,
        }

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET as string, {
            expiresIn: '12h'
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 1000 * 60 * 60 * 12,
            path: "/"
        });


        return res.status(200).json({
            success: true,
            message: 'Giriş Başarılı'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Giriş Hatası! Lütfen tekrar deneyiniz!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
};


export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            expires: new Date(0),
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: 'Başarıyla Çıkış Yapıldı!'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Çıkış yapılırken bir hata oluştu.",
            error: error instanceof Error ? error.message : "Bilinmeyen hata"
        });
    }
}