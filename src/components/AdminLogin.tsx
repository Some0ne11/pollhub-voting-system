import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import type { AdminCredentials } from '../types/auth';

interface AdminLoginProps {
    onLogin: (credentials: AdminCredentials) => void;
    onCancel: () => void;
    error?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel, error }) => {
    const [credentials, setCredentials] = useState<AdminCredentials>({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(credentials);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                        <p className="text-gray-600">Enter admin credentials to create polls</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Enter admin username"
                            required
                        />
                    </div>
                
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="Enter admin password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >   
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <div className="flex items-start gap-2">
                            <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-700">
                                <p className="font-medium">Demo Credentials:</p>
                                <p>Username: <code className="bg-blue-100 px-1 rounded">admin</code></p>
                                <p>Password: <code className="bg-blue-100 px-1 rounded">admin123</code></p>
                            </div>
                        </div>
                    </div>
                
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Login as Admin
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >   
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};