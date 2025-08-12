import React from 'react';
import { Vote, Plus, Shield, LogOut, Users, BarChart3 } from 'lucide-react';
import type { User } from '../types/auth';

interface HeaderProps {
    onCreatePoll: () => void;
    onAdminLogin: () => void;
    onLogout: () => void;
    onManageUsers: () => void;
    onExportResults: () => void;
    totalPolls: number;
    totalVotes: number;
    currentUser: User;
}

export const Header: React.FC<HeaderProps> = ({ 
    onCreatePoll, 
    onAdminLogin, 
    onLogout, 
    onManageUsers,
    onExportResults,
    totalPolls, 
    totalVotes, 
    currentUser 
}) => {
    const isAdmin = currentUser.role === 'admin';

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <Vote className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">PollHub</h1>
                            <p className="text-xs text-gray-600">Democracy in action</p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{totalPolls}</div>
                            <div className="text-xs text-gray-600">Polls</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{totalVotes}</div>
                            <div className="text-xs text-gray-600">Votes</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                <Shield className="w-4 h-4" />
                                Admin
                            </div>
                        )}

                        {isAdmin ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={onCreatePoll}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                                >   
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Create Poll</span>
                                </button>
                                <button
                                    onClick={onManageUsers}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    title="Manage Users"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="hidden lg:inline">Users</span>
                                </button>
                                <button
                                    onClick={onExportResults}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    title="Export Results"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="hidden lg:inline">Export</span>
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                            ): (
                            <button
                                onClick={onAdminLogin}
                                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                            >   
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Admin Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );  
};  