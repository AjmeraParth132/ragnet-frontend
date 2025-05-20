export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Organization {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface Source {
    id: string;
    name: string;
    type: string;
    config: {
        github?: { url: string };
        discord?: { guild_id: string };
    };
    last_sync_at: string;
    created_at: string;
}