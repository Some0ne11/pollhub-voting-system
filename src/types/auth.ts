export interface User {
    id: string;
    role: 'admin' | 'user';
    username?: string;
}

export interface AdminCredentials {
    username: string;
    password: string;
}