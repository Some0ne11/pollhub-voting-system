import { useState } from "react";
import type { CreatePollData } from "../types/poll";
import { Plus, Vote, X } from "lucide-react";

interface CreatePollProps {
    onCreatePoll: (data: CreatePollData) => void;
    onCancel: () => void;
}

export const CreatePoll: React.FC<CreatePollProps> = ({ onCreatePoll, onCancel }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const addOption = () => {
        if (options.length < 8) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) {
            newErrors.title = "Title is required.";
        }
        if (!description.trim()) {
            newErrors.description = "Description is required.";
        }

        const validOptions = options.filter(opt => opt.trim());
        if (validOptions.length < 2) {
            newErrors.options = "At least two options are required.";
        }

        const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
        if (uniqueOptions.size !== validOptions.length) {
            newErrors.options = "Options must be unique.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const validOptions = options.filter(opt => opt.trim());

        onCreatePoll({
            title: title.trim(),
            description: description.trim(),
            options: validOptions
        });
    };

    return(
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Vote className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Poll</h2>
                    <p className="text-gray-600">Gather opinions and make decisions together • One vote per person</p>
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="What would you like to ask?"
                        maxLength={100}
                    >
                    </input>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Poll Description *
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Provide more details about your poll..."
                        maxLength={300}
                    >
                    </textarea>
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
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder={`Option ${index + 1}`}
                                        maxLength={80}
                                    />
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
                            className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Option
                        </button>
                    )}
                </div>

                <div className="flex gap-3 pt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Create Poll
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