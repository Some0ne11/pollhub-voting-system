import React, { useState } from 'react';
import { Upload, Download, Users, FileText, X, Check, AlertCircle } from 'lucide-react';
import { getWhitelistedUsers, setWhitelistedUsers } from '../utils/authUtils';

interface UserWhitelistManagerProps {
    onClose: () => void;
}

export const UserWhitelistManager: React.FC<UserWhitelistManagerProps> = ({ onClose }) => {
    const [whitelistedUsers, setWhitelistedUsersState] = useState(getWhitelistedUsers());
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [uploadMessage, setUploadMessage] = useState('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                let users: any[] = [];
                
                if (file.name.endsWith('.csv')) {
                    // Parse CSV
                    const lines = content.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const user: any = {};

                        headers.forEach((header, index) => {
                            if (values[index]) {
                                user[header] = values[index];
                            }
                        });

                        if (user.email) {
                            users.push(user);
                        }
                    }
                } else if (file.name.endsWith('.json')) {
                    // Parse JSON
                    users = JSON.parse(content);
                }

                if (users.length > 0 && users.every(user => user.email)) {
                    setWhitelistedUsers(users);
                    setWhitelistedUsersState(users);
                    setUploadStatus('success');
                    setUploadMessage(`Successfully imported ${users.length} users`);
                } else {
                    throw new Error('Invalid file format or missing email fields');
                }
            }catch (error) {
                setUploadStatus('error');
                setUploadMessage('Error parsing file. Please check the format.');
            }
        };

        reader.readAsText(file);
    };

    const downloadTemplate = (format: 'csv' | 'json') => {
        const templateData = [
            { email: 'john.doe@company.com', name: 'John Doe', department: 'Engineering' },
            { email: 'jane.smith@company.com', name: 'Jane Smith', department: 'Marketing' },
            { email: 'bob.wilson@company.com', name: 'Bob Wilson', department: 'Sales' }
        ];

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'csv') {
            const headers = 'email,name,department\n';
            const rows = templateData.map(user => `${user.email},${user.name},${user.department}`).join('\n');
            content = headers + rows;
            filename = 'user-template.csv';
            mimeType = 'text/csv';
        } else {
            content = JSON.stringify(templateData, null, 2);
            filename = 'user-template.json';
            mimeType = 'application/json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearWhitelist = () => {
        setWhitelistedUsers([]);
        setWhitelistedUsersState([]);
        setUploadStatus('idle');
        setUploadMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">User Whitelist Manager</h2>
                            <p className="text-gray-600">Control who can vote in restricted polls</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {uploadStatus !== 'idle' && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        uploadStatus === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center gap-2">
                            {uploadStatus === 'success' ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            <p className="font-medium">{uploadMessage}</p>
                        </div>
                    </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload User List</h3>

                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-3">Upload CSV or JSON file with user list</p>
                                <input
                                    type="file"
                                    accept=".csv,.json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Choose File
                                </label>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => downloadTemplate('csv')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >   
                                    <Download className="w-4 h-4" />
                                    CSV Template
                                </button>
                                <button
                                    onClick={() => downloadTemplate('json')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    JSON Template
                                </button>
                            </div>

                            {whitelistedUsers.length > 0 && (
                                <button
                                    onClick={clearWhitelist}
                                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >   
                                    Clear Whitelist
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Current Whitelist ({whitelistedUsers.length} users)
                            </h3>
                        </div>
                            
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                            {whitelistedUsers.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No users in whitelist</p>
                            ) : (
                                <div className="space-y-2">
                                    {whitelistedUsers.map((user, index) => (
                                        <div key={index} className="bg-white p-3 rounded-lg border">
                                            <div className="font-medium text-gray-900">{user.name || 'Unknown'}</div>
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                            {user.department && (
                                                <div className="text-xs text-gray-500">{user.department}</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}  
                        </div>
                    </div>
                </div>
                    
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">File Format Requirements:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• CSV: Must have 'email' column (required), 'name' and 'department' are optional</li>
                        <li>• JSON: Array of objects with 'email' field (required)</li>
                        <li>• Email addresses must be valid and unique</li>
                        <li>• Maximum 1000 users per file</li>
                    </ul>
                </div>
            </div>
        </div>
    );  
};  