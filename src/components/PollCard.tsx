import React from 'react';
import type { Poll } from '../types/poll';
import { Users, Calendar, BarChart3, Edit3, Trash2, History, AlertCircle, Lock, Play, Pause, StopCircle } from 'lucide-react';
import { formatDate, calculatePercentage } from '../utils/pollUtils';
import type { User } from '../types/auth';

interface PollCardProps {
    poll: Poll;
    onVote: (pollId: string, optionId: string) => void;
    onEdit?: (pollId: string) => void;
    onDelete?: (pollId: string) => void;
    onStatusChange?: (pollId: string, status: 'active' | 'on-hold' | 'closed') => void;
    currentUser: User;
    showResults?: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({ 
    poll, 
    onVote, 
    onEdit, 
    onDelete, 
    onStatusChange,
    currentUser, 
    showResults = false 
}) => {
    const hasVoted = poll.votedUsers.includes(currentUser.id);
    const displayResults = showResults || hasVoted;
    const isAdmin = currentUser.role === 'admin';
    const hasBeenEdited = poll.editHistory && poll.editHistory.length > 0;

    const handleVote = (optionId: string) => {
      // Don't allow voting if poll is not active
        if (poll.status !== 'active') {
            return;
        }

        // Check if poll is restricted and user email verification is needed
        if (poll.isRestricted && !currentUser.email) {
          onVote(poll.id, optionId); // This will trigger email prompt in parent
            return;
        }

        if (!hasVoted && !poll.votedUsers.includes(currentUser.id)) {
            onVote(poll.id, optionId);
        }
    };

    const getWinningOption = () => {
        return poll.options.reduce((winner, option) => 
            option.votes > winner.votes ? option : winner
        );
    };

    const winningOption = getWinningOption();

    const getStatusIcon = () => {
        switch (poll.status) {
            case 'active':
                return <Play className="w-4 h-4 text-green-600" />;
            case 'on-hold':
                return <Pause className="w-4 h-4 text-yellow-600" />;
            case 'closed':
            return <StopCircle className="w-4 h-4 text-red-600" />;
        }
    };

    const getStatusColor = () => {
        switch (poll.status) {
            case 'active':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'on-hold':
                return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'closed':
            return 'text-red-700 bg-red-50 border-red-200';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6">
                {isAdmin && (
                    <div className="flex justify-end gap-2 mb-4">
                        <div className="flex items-center gap-1 mr-2">
                            <select
                                value={poll.status}
                                onChange={(e) => onStatusChange?.(poll.id, e.target.value as 'active' | 'on-hold' | 'closed')}
                                className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="active">Active</option>
                                <option value="on-hold">On Hold</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <button
                            onClick={() => onEdit?.(poll.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit poll"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete?.(poll.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete poll"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
                
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.title}</h3>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
                            {getStatusIcon()}
                            <span className="capitalize">{poll.status === 'on-hold' ? 'On Hold' : poll.status}</span>
                        </div>
                        {poll.isRestricted && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                                <Lock className="w-3 h-3" />
                                <span>Restricted</span>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{poll.description}</p>
                </div>

                {hasBeenEdited && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <History className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-800">
                                    Poll Updated {formatDate(poll.lastEditedAt!)}
                                </p>
                                <div className="mt-1 text-xs text-blue-700">
                                    <p className="font-medium">Recent changes:</p>
                                    <ul className="mt-1 space-y-0.5">
                                        {poll.editHistory[poll.editHistory.length - 1].changes.slice(0, 3).map((change, index) => (
                                            <li key={index}>• {change}</li>
                                        ))}
                                        {poll.editHistory[poll.editHistory.length - 1].changes.length > 3 && (
                                            <li>• And {poll.editHistory[poll.editHistory.length - 1].changes.length - 3} more changes...</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{poll.totalVotes} votes</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(poll.createdAt)}</span>
                    </div>
                    {displayResults && (
                        <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>Results</span>
                        </div>
                    )}
                </div>
                
                <div className="space-y-3">
                    {poll.options.map((option) => {
                        const percentage = calculatePercentage(option.votes, poll.totalVotes);
                        const isWinning = displayResults && option.id === winningOption.id && poll.totalVotes > 0;

                    return (
                        <div
                            key={option.id}
                            className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                                displayResults
                                    ? isWinning
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                    : hasVoted || poll.status !== 'active'
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transform hover:scale-[1.01]'
                            }`}
                            onClick={() => !displayResults && poll.status === 'active' && handleVote(option.id)}
                        >
                            {displayResults && (
                                <div
                                    className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                                        isWinning ? 'bg-green-200' : 'bg-blue-200'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            )}

                            <div className="relative p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            displayResults
                                                ? isWinning
                                                    ? 'border-green-500 bg-green-500'
                                                    : 'border-gray-400 bg-gray-400'
                                                : 'border-blue-500'
                                        }`}
                                    >
                                        {displayResults && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                    <span className={`font-medium ${isWinning ? 'text-green-800' : 'text-gray-900'}`}>
                                        {option.text}
                                    </span>
                                </div>

                                {displayResults && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-600">{option.votes} votes</span>
                                        <span className={`text-sm font-bold ${isWinning ? 'text-green-700' : 'text-gray-700'}`}>
                                            {percentage}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                </div>

                {hasVoted && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <p className="text-sm text-green-700 font-medium">You have already voted in this poll</p>
                        </div>
                    </div>
                )}
                
                {!hasVoted && !displayResults && poll.status === 'active' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-700 font-medium">
                                {poll.isRestricted 
                                    ? 'This poll is restricted to authorized users only'
                                    : 'You can vote once in this poll'
                                }
                            </p>
                        </div>
                    </div>
                )}
                
                {poll.status === 'on-hold' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Pause className="w-4 h-4 text-yellow-600" />
                            <p className="text-sm text-yellow-700 font-medium">This poll is currently on hold</p>
                        </div>
                    </div>
                )}
                
                {poll.status === 'closed' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <StopCircle className="w-4 h-4 text-red-600" />
                            <p className="text-sm text-red-700 font-medium">This poll has been closed</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );  
};