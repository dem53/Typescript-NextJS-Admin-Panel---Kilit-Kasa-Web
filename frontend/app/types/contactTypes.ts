export interface IContact {
    _id: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    message: string;
    status: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}


export interface ICreateContact {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    message: string;
}



export interface IUpdateContact {
    name?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    message?: string;
    status?: boolean;
}



