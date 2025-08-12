import React, { useState } from 'react';
import { Edit3, X, Plus, Save } from 'lucide-react';
import type { Poll, EditPollData } from '../types/poll';

interface EditPollProps {
    poll: Poll;
    onUpdatePoll: (pollId: string, data: EditPollData) => void;
    onCancel: () => void;
}

export const EditPoll: React.FC<EditPollProps> = ({ poll, onUpdatePoll, onCancel }) => {
    const [title, setTitle] = useState(poll.title);
    const [description, setDescription] = useState(poll.description);
    const [options, setOptions] = useState(
        poll.options.map(opt => ({ id: opt.id, text: opt.text }))
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const addOption = () => {
        if (options.length < 8) {
            setOptions([...options, { id: '', text: '' }]);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        const validOptions = options.filter(option => option.text.trim());
        if (validOptions.length < 2) {
            newErrors.options = 'At least 2 options are required';
        }

        const uniqueOptions = new Set(validOptions.map(opt => opt.text.trim().toLowerCase()));
        if (uniqueOptions.size !== validOptions.length) {
            newErrors.options = 'All options must be unique';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const validOptions = options.filter(option => option.text.trim());

        onUpdatePoll(poll.id, {
            title: title.trim(),
            description: description.trim(),
            options: validOptions
        });
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                    <Edit3 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Poll</h2>
                    <p className="text-gray-600">Make changes to your poll • Users will be notified of changes</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Poll Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                            errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="What would you like to ask?"
                        maxLength={100}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                            errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Provide more details about your poll..."
                        maxLength={300}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Options * (2-8 options)
                    </label>
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder={`Option ${index + 1}`}
                                        maxLength={80}
                                    />  
                                    {poll.options.find(opt => opt.id === option.id) && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {poll.options.find(opt => opt.id === option.id)?.votes || 0} votes
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >   
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.options && <p className="mt-2 text-sm text-red-600">{errors.options}</p>}
                    
                    {options.length < 8 && (
                        <button
                            type="button"
                            onClick={addOption}
                            className="mt-3 flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >   
                            <Plus className="w-4 h-4" />
                            Add Option
                        </button>
                    )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium text-amber-800 mb-2">⚠️ Important Notes:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Existing votes will be preserved for unchanged options</li>
                        <li>• Users will see a notification about what was changed</li>
                        <li>• Removing options will lose their votes permanently</li>
                    </ul>
                </div>
                
                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >   
                        <Save className="w-4 h-4" />
                        Save Changes
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
    );  
};      