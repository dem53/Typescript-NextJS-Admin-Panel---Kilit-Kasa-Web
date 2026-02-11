import { apiAuthFetch, apiFetch } from "../api/api";
import { IContact, ICreateContact, IUpdateContact } from "../types/contactTypes";


export const contactServices = {

    getAllContact () {
        return apiAuthFetch<IContact>(`all/contact`, {
            method: "GET"
        });
    },

    createContact (data: ICreateContact) {
        return apiFetch<IContact>(`create/contact`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },

    updateContact (id: string, data: IUpdateContact) {
        return apiAuthFetch<IContact>(`update/contact/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    },

    deleteContact (id: string) {
        return apiAuthFetch<IContact>(`delete/contact/${id}`, {
            method: "DELETE"
        });
    },

}