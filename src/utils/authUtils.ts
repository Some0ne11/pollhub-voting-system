import type { User, AdminCredentials } from '../types/auth';

// Default admin credentials (in production, this would be handled securely)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

export const getWhitelistedUsers = (): any[] => {
    const whitelist = localStorage.getItem('userWhitelist');
    return whitelist ? JSON.parse(whitelist) : [];
};

export const setWhitelistedUsers = (users: any[]): void => {
    localStorage.setItem('userWhitelist', JSON.stringify(users));
};

export const isUserWhitelisted = (email: string): boolean => {
    const whitelist = getWhitelistedUsers();
    return whitelist.some(user => user.email.toLowerCase() === email.toLowerCase());
};

export const authenticateAdmin = (credentials: AdminCredentials): boolean => {
    return credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password;
};

export const getCurrentUser = (): User => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }

    // Return default user
    const userId = getUserId();
    return {
        id: userId,
        role: 'user'
    };
};

export const setCurrentUser = (user: User): void => {
    localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = (): void => {
    localStorage.removeItem('currentUser');
};

export const getUserId = (): string => {
    let userId = localStorage.getItem('pollUserId');
    if (!userId) {
        userId = Math.random().toString(36).substr(2, 9);
        localStorage.setItem('pollUserId', userId);
    }
    return userId;
};

export const isAdmin = (user: User): boolean => {
    return user.role === 'admin';
};