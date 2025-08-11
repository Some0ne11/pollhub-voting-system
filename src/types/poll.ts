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
}

export interface CreatePollData {
    title: string;
    description: string;
    options: string[];
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