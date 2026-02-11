import { apiCartFetch } from "../api/api"
import { IAddToCartData, ICart, IUpdateToCartData } from "../types/cartTypes"


export const cartServices = {

    getCartSession(){
        return apiCartFetch<ICart>('cart', {
            method: "GET"
        });
    },

    addToCart(data: IAddToCartData){
        return apiCartFetch<ICart>('cart/add', {
            method: "POST",
            body: JSON.stringify(data)
        });
    },


    updateToCart(id: string, data: IUpdateToCartData){
        return apiCartFetch<ICart>(`cart/update/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    },


    removeToCart(id: string){
        return apiCartFetch<ICart>(`cart/remove/${id}`, {
            method: "DELETE",
        });
    },


    clearToCart(){
        return apiCartFetch<ICart>('cart/clear', {
            method: "DELETE"
        });
    },

}