import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IJwtPayload } from "../config/jwtPayload";
import { getJwtSecret } from "../utils/utils";


interface AuthRequest extends Request {
    user?: any;
    sessionId?: string | null;
}



export const authenticateToken = async (req: Request | any, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token bulunamadı! Yetkisiz Erişim!'
            });
        }

        const JWT_SECRET = getJwtSecret() as string;

        const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı Bulunamadı!'
            });
        }

        req.user = user;
        return next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token yetkilendirme Hatası!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}



export const isAdminControl = (req: Request | any, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.isAdmin || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için admin yetkisi gereklidir!!'
            });
        }
        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Sistem yetkilendirme Hatası!!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}


export const isAdminOrManager = (req: Request | any, res: Response, next: NextFunction) => {
    try {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı!'
            });
        }

        const role = req.user?.role;

        if (!role) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı Rolü bulunamadı!'
            });
        }

        const validAdminRoles = ['admin', 'manager'];

        if (!validAdminRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için yetkiniz bulunmamaktadır!'
            });
        }

        return next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Sistem yetkilendirme Hatası!!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}



export const isAdminAndManagerOrPersonel = (req: Request | any, res: Response, next: NextFunction) => {
    try {

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı bulunamadı!'
            });
        }

        const role = req.user?.role;

        if (!role) {
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı Rolü bulunamadı!'
            });
        }

        const validAdminRoles = ['admin', 'manager', 'personel'];

        if (!req.user || !validAdminRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için yetkiniz bulunmamaktadır!'
            });
        }

        return next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Sistem yetkilendirme Hatası!!',
            error: error instanceof Error ? error.message : 'Bilinmeyen Hata!'
        });
    }
}


export const authenticateAndSessionToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.token;
        const sessionId = req.headers['x-session-id'] as string | undefined;

        if (token) {
            const decoded = jwt.verify(token, getJwtSecret()) as IJwtPayload;
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı!'
                });
            }

            req.user = user;
            delete req.sessionId;

            return next();
        }

        if (sessionId) {
            delete req.user;
            req.sessionId = sessionId;
            return next();
        } else {
            return res.status(404).json({
                success: false,
                message: 'Misafir ID Bulunamadı!'
            });
        }

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Yetkilendirme başarısız',
            error: error instanceof Error ? error.message : 'Token hatası'
        });
    }
};


