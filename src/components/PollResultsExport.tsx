import React from 'react';
import { Download, BarChart3, X } from 'lucide-react';
import type { Poll } from '../types/poll';
import { formatDate, calculatePercentage } from '../utils/pollUtils';

interface PollResultsExportProps {
    polls: Poll[];
    onClose: () => void;
}

export const PollResultsExport: React.FC<PollResultsExportProps> = ({ polls, onClose }) => {
    const exportResults = (format: 'csv' | 'json') => {
        const resultsData = polls.map(poll => ({
            id: poll.id,
            title: poll.title,
            description: poll.description,
            createdAt: formatDate(poll.createdAt),
            lastEditedAt: poll.lastEditedAt ? formatDate(poll.lastEditedAt) : null,
            totalVotes: poll.totalVotes,
            isRestricted: poll.isRestricted,
            options: poll.options.map(option => ({
                text: option.text,
                votes: option.votes,
                percentage: calculatePercentage(option.votes, poll.totalVotes)
            })),
            winningOption: poll.options.reduce((winner, option) => 
                option.votes > winner.votes ? option : winner
            ).text,
            editHistory: poll.editHistory.map(edit => ({
                timestamp: formatDate(edit.timestamp),
                changes: edit.changes,
                adminId: edit.adminId
            }))
        }));

        let content: string;
        let filename: string;
        let mimeType: string;

        if (format === 'csv') {
          // Create CSV with poll summary
            const headers = 'Poll ID,Title,Description,Created At,Total Votes,Winning Option,Is Restricted\n';
            const rows = resultsData.map(poll => 
                `"${poll.id}","${poll.title}","${poll.description}","${poll.createdAt}",${poll.totalVotes},"${poll.winningOption}",${poll.isRestricted}`
            ).join('\n');

            // Add detailed options data
            let optionsData = '\n\nDetailed Results:\nPoll ID,Poll Title,Option,Votes,Percentage\n';
            resultsData.forEach(poll => {
                poll.options.forEach(option => {
                    optionsData += `"${poll.id}","${poll.title}","${option.text}",${option.votes},${option.percentage}%\n`;
                });
            });

            content = headers + rows + optionsData;
            filename = `poll-results-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            } else {
            content = JSON.stringify({
                exportDate: new Date().toISOString(),
                totalPolls: polls.length,
                totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
                polls: resultsData
            }, null, 2);
            filename = `poll-results-${new Date().toISOString().split('T')[0]}.json`;
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

    const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Export Poll Results</h2>
                            <p className="text-gray-600">Download comprehensive poll data and analytics</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{polls.length}</div>
                        <div className="text-sm text-blue-700">Total Polls</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{totalVotes}</div>
                        <div className="text-sm text-green-700">Total Votes</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {polls.filter(p => p.isRestricted).length}
                        </div>
                        <div className="text-sm text-purple-700">Restricted Polls</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                onClick={() => exportResults('csv')}
                                className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                            >
                                <Download className="w-6 h-6 text-blue-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Export as CSV</div>
                                    <div className="text-sm text-gray-600">Spreadsheet-friendly format</div>
                                </div>
                            </button>

                            <button
                                onClick={() => exportResults('json')}
                                className="flex items-center justify-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
                            >
                                <Download className="w-6 h-6 text-green-600" />
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Export as JSON</div>
                                    <div className="text-sm text-gray-600">Complete data with metadata</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="font-medium text-gray-900 mb-3">Export Includes:</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <ul className="space-y-2">
                                <li>• Poll titles and descriptions</li>
                                <li>• Creation and edit timestamps</li>
                                <li>• Vote counts and percentages</li>
                                <li>• Winning options</li>
                            </ul>
                            <ul className="space-y-2">
                                <li>• Detailed option breakdowns</li>
                                <li>• Edit history and changes</li>
                                <li>• Restriction status</li>
                                <li>• Complete analytics data</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-medium text-amber-800 mb-2">📊 Data Privacy Note:</h4>
                        <p className="text-sm text-amber-700">
                            Exported data includes poll results and metadata but does not include individual voter identities 
                            to maintain privacy. Only vote counts and percentages are included.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};  