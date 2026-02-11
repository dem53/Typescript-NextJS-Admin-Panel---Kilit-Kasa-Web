import { apiAuthFetch, apiFetch } from "../api/api";
import { ILoginInput, ILoginResponse, IRegisterInput } from "../types/authTypes";
import { IUser } from "../types/userType";


export const authServices = {
    register(data: IRegisterInput){
        return apiFetch<IUser>("kayit", {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    login(data: ILoginInput){
        return apiFetch<ILoginResponse>("giris", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include"
        });
    },
}