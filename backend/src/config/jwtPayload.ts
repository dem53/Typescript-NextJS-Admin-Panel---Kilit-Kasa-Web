export interface IJwtPayload {
    id?: string;
    role?: 'admin' | 'manager' | 'personel' | 'customer',
    isAdmin?: boolean;
}