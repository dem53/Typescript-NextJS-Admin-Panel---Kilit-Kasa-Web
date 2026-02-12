import { apiAuthFetch, apiFetch } from "../api/api";
import { IProduct } from "../types/productTypes";


export const productServices = {

    getAllProduct() {
        return apiAuthFetch<IProduct>(`all/product`, {
            method: "GET"
        });
    },

    getBySlugProduct(slug: string){
        return apiFetch<IProduct>(`product/${slug}`, {
            method: "GET"
        });
    },


    getActiveProduct() {
        return apiFetch<IProduct>('active/product', {
            method: "GET"
        });
    },


    getSoftDeletedProduct() {
        return apiAuthFetch<IProduct>('softDelete/product', {
            method: "GET"
        });
    },


    async createProduct(formData: FormData) {

        const response = await fetch(`http://localhost:8000/api/create/product`, {
            method: "POST",
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage: string = 'Ürün Eklenemedi';
            try {
                const errorJSON = JSON.parse(errorText);
                errorMessage = errorJSON || errorMessage;
            } catch (e) {
                errorMessage = errorText;
            }
            throw new Error(errorMessage || errorText);
        }

        return response.json();

    },



    async updateProduct(id: string, formData: FormData) {
     
        const response = await fetch(`http://localhost:8000/api/update/product/${id}`, {
            method: "PUT",
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            console.error('Ürün güncellenemedi!');
            let errorText = await response.text();
            let errorMessage: string = 'Ürün güncellenirken hata!'
            try {
                console.log(errorMessage);
                console.log(errorText);
            } catch (error: any) {
                console.log('Bilinemeyen kaynaklı hata!', error);
            }
            throw new Error(errorMessage || errorText);
        }

        return response.json();
    },


    softDeleteProduct (id: string) {
        return apiAuthFetch<IProduct>(`softDelete/product/${id}`, {
            method: "PATCH"
        });
    },


    restoreProduct (id: string) {
        return apiAuthFetch<IProduct>(`restore/product/${id}`, {
            method: "PATCH"
        });
    },


    hardDeleteProduct (id: string) {
        return apiAuthFetch<IProduct>(`delete/product/${id}`, {
            method: "DELETE"
        });
    },


}