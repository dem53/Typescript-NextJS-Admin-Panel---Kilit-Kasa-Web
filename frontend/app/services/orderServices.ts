import { apiAuthFetch, apiCartFetch } from "../api/api";
import { IApiResponse } from "../types/apiResponseType";
import { ICreateOrder, IOrder, IUpdateStatusOrder } from "../types/orderTypes";


export const orderServices = {

    getAllOrder() {
        return apiAuthFetch<IOrder>('all/order', {
            method: "GET"
        });
    },

    createOrder(data: ICreateOrder) {
        return apiCartFetch<IOrder>(`create/order`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    },


    updateOrder(id: string, data: IUpdateStatusOrder){
        return apiAuthFetch<IOrder>(`update/order/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });
    },


}