export interface IProduct {
    _id: string;
    name: string;
    description: string;
    title: string;
    subTitle: string;
    slug: string;
    imageUrls: string[];
    tags: string[];
    category: string;
    price: number;
    isSelling: boolean;
    isDeleted: boolean;
    weight: string;
    color: string;
    stock: number;
    properties: string[];
    discount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}


export interface ICreateProduct {
    name: string;
    description: string;
    title: string;
    subTitle: string;
    imageUrls: string[];
    tags: string[];
    category: string;
    price: number;
    color: string;
    stock: number;
    isSelling: boolean;
    weight: string;
    properties: string[];
    discount: number;
}


export interface IUpdateProduct {
    name?: string;
    description?: string;
    title?: string;
    subTitle?: string;
    imageUrls?: string[];
    tags?: string[];
    category?: string;
    color?: string;
    stock?: number;
    price?: number;
    isSelling?: boolean;
    weight?: string;
    properties?: string[];
    discount?: number;
}