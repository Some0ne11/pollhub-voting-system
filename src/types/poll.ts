export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    id: string;
    title: string;
    description: string;
    options: PollOption[];
    createdAt: Date;
    totalVotes: number;
    votedUsers: string[];
    lastEditedAt?: Date;
    editHistory: EditRecord[];
    allowedUsers?: string[];    // Array of allowed user emails
    isRestricted: boolean;      // Whether this poll is restricted to whitelist
    status: 'active' | 'on-hold' | 'closed';
}

export interface CreatePollData {
    title: string;
    description: string;
    options: string[];
    isRestricted?: boolean;
}

export interface EditPollData {
    title: string;
    description: string;
    options: { id: string; text: string }[];
}

export interface EditRecord {
    timestamp: Date;
    changes: string[];
    adminId: string;
}