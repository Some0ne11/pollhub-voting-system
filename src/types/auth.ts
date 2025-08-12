export interface User {
    id: string;
    role: 'admin' | 'user';
    username?: string;
    email?: string;
    name?: string;
}

export interface AdminCredentials {
    username: string;
    password: string;
}

export interface WhitelistUser {
    id?: string;
    email: string;
    name: string;
    department?: string;
}