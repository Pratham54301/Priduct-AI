
export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'User' | 'Admin';
    status: 'Active' | 'Inactive';
    joined: string; // ISO date string
}

export interface Payment {
    id: string;
    userId: string;
    userEmail: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    date: string; // ISO date string
}

export interface Schedule {
    id: string;
    title: string;
    date: string; // ISO date string
    time: string; // HH:MM
    type: 'Crypto' | 'Stock' | 'Currency';
    description?: string;
    status: 'Upcoming' | 'Live' | 'Completed';
}

export interface LeaderboardEntry {
    id: string;
    rank: number;
    name: string;
    score: number;
    accuracy: string;
    trades: number;
}
