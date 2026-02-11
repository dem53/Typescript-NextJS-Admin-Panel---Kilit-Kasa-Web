import { apiAuthFetch } from "../api/api"
import { ICreateUser, IUpdateUser, IUser } from "../types/userType"

export const userServices = {

    getMe() {
        return apiAuthFetch<IUser>(`me`, {
            method: "GET",
            credentials: "include",
        });
    },

    getAllUser() {
        return apiAuthFetch<IUser>(`all/user`, {
            method: "GET"
        });
    },

    createUser (data: ICreateUser) {
        return apiAuthFetch<IUser>(`create/user`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    updateUser (id: string, data: IUpdateUser) {
        return apiAuthFetch<IUser>(`update/user/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },

    deleteUser (id: string){
        return apiAuthFetch<IUser>(`delete/user/${id}`, {
            method: "DELETE"
        });
    }
}


export default userServices