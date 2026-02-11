

export enum JobStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    READY = 'ready'
}


export enum JobPaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}


export interface ICustomerInfo {
    fullName: string;
    phone: string;
    phone2: string;
}

export enum JobPaymentType {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card'
}


export interface IJob {
    _id: string;
    jobNumber: string;
    name: string;
    address: string;
    customer: ICustomerInfo,
    adminNote: string;
    personelNote: string;
    city: string;
    district: string;
    price: number;
    jobStatus: JobStatus,
    jobPaymentType: JobPaymentType,
    jobPaymentStatus: JobPaymentStatus,
    createdBy?: string,
    updatedBy?: string,
    createdAt: Date;
    updatedAt: Date;

}



export interface ICreateJob {
    name: string;
    address: string;
    city: string;
    district: string;
    customer: ICustomerInfo;
    price: number;
    jobPaymentType: JobPaymentType,
    adminNote?: string;
}


export interface IUpdateJob {
    price?: number;
    jobStatus?: JobStatus | undefined;
    jobPaymentStatus: JobPaymentStatus | undefined;
    personelNote?: string;
}