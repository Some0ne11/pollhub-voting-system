import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import type { Poll } from '../types/poll';

interface DeleteConfirmationProps {
    poll: Poll;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ poll, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Delete Poll</h2>
                        <p className="text-gray-600">This action cannot be undone</p>
                    </div>
                </div>
                
                <div className="mb-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-red-800 mb-2">You are about to delete:</h3>
                                <p className="text-sm text-red-700 font-medium">"{poll.title}"</p>
                                <div className="mt-2 text-xs text-red-600">
                                    <p>• {poll.totalVotes} votes will be lost</p>
                                    <p>• {poll.options.length} options will be removed</p>
                                    <p>• This poll will be permanently deleted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >   
                        <Trash2 className="w-4 h-4" />
                        Delete Forever
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >   
                        Cancel
                    </button>
                </div>
            </div>
        </div>  
    );  
};  