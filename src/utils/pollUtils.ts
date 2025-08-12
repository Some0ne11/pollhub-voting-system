import type { Poll, PollOption, CreatePollData, EditPollData, EditRecord } from '../types/poll';

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const createPoll = (data: CreatePollData, allowedUsers?: string[]): Poll => {
    const options: PollOption[] = data.options.map(text => ({
        id: generateId(),
        text,
        votes: 0
    }));

    return {
        id: generateId(),
        title: data.title,
        description: data.description,
        options,
        createdAt: new Date(),
        totalVotes: 0,
        votedUsers: [],
        editHistory: [],
        isRestricted: data.isRestricted || false,
        allowedUsers: data.isRestricted ? allowedUsers : undefined,
        status: 'active'
    };
};

export const updatePoll = (poll: Poll, data: EditPollData, adminId: string): Poll => {
    const changes: string[] = [];
    
    // Track title changes
    if (poll.title !== data.title) {
        changes.push(`Title changed from "${poll.title}" to "${data.title}"`);
    }

    // Track description changes
    if (poll.description !== data.description) {
        changes.push(`Description updated`);
    }

    // Track option changes
    const oldOptions = poll.options.map(opt => opt.text);
    const newOptions = data.options.map(opt => opt.text);

    // Find added options
    const addedOptions = newOptions.filter(text => !oldOptions.includes(text));
    addedOptions.forEach(option => {
        changes.push(`Added option: "${option}"`);
    });

    // Find removed options
    const removedOptions = oldOptions.filter(text => !newOptions.includes(text));
    removedOptions.forEach(option => {
        changes.push(`Removed option: "${option}"`);
    });

    // Find modified options
    poll.options.forEach(oldOption => {
        const newOption = data.options.find(opt => opt.id === oldOption.id);
        if (newOption && newOption.text !== oldOption.text) {
            changes.push(`Changed option from "${oldOption.text}" to "${newOption.text}"`);
        }
    });

    // Create updated options array, preserving votes for existing options
    const updatedOptions: PollOption[] = data.options.map(optionData => {
        const existingOption = poll.options.find(opt => opt.id === optionData.id);
        return {
            id: optionData.id || generateId(),
            text: optionData.text,
            votes: existingOption ? existingOption.votes : 0
        };
    });

    // Create edit record
    const editRecord: EditRecord = {
        timestamp: new Date(),
        changes,
        adminId
    };

    return {
        ...poll,
        title: data.title,
        description: data.description,
        options: updatedOptions,
        lastEditedAt: new Date(),
        editHistory: [...poll.editHistory, editRecord]
    };
};

export const calculatePercentage = (votes: number, totalVotes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
};

export const getUserId = (): string => {
    let userId = localStorage.getItem('pollUserId');
    if (!userId) {
        userId = generateId();
        localStorage.setItem('pollUserId', userId);
    }
    return userId;
};

export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};