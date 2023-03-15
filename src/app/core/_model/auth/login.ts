export interface Logueo {
    username?: string | null;
    password?: string | null;
}

export interface LogueoResponse {
    id: string;
    accessToken: string;
    refreshToken: string;
}