import React from 'react';
import type { Poll } from '../types/poll';
import { PollCard } from './PollCard';
import { BarChart3 } from 'lucide-react';

interface PollListProps {
    polls: Poll[];
    onVote: (pollId: string, optionId: string) => void;
    onEdit?: (pollId: string) => void;
    onDelete?: (pollId: string) => void;
    onStatusChange?: (pollId: string, status: 'active' | 'on-hold' | 'closed') => void;
    currentUser: any;
}

export const PollList: React.FC<PollListProps> = ({ polls, onVote, onEdit, onDelete, onStatusChange, currentUser }) => {
    if (polls.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No polls yet</h3>
                <p className="text-gray-500">Create your first poll to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Active Polls</h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {polls.filter(p => p.status === 'active').length} Active
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {polls.filter(p => p.status === 'on-hold').length} On Hold
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            {polls.filter(p => p.status === 'closed').length} Closed
                        </span>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {polls.length} Total
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {polls.map((poll) => (
                    <PollCard
                        key={poll.id}
                        poll={poll}
                        onVote={onVote}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    );
};  