export enum IUserRole {
    CUSTOMER = 'customer',
    PERSONEL = 'personel',
    MANAGER = 'manager',
    ADMIN = 'admin'
}


export interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    isAdmin: boolean;
    role: IUserRole;
    endLoginTime: Date;
    createdAt: Date;
    updatedAt: Date;
}


export interface ICreateUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    isAdmin: boolean;
    role: IUserRole;
}


export interface IUpdateUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
    isAdmin?: boolean;
    role: IUserRole;
}