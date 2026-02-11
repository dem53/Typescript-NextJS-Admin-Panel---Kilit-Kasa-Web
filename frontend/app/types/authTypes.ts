import { IUser } from "../types/userType";

export interface IRegisterInput {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ILoginInput {
    username: string;
    password: string
}


export interface ILoginResponse {
    message: string;
}