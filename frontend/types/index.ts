export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    gender?: string;
    country: string;
    isVerified: boolean;
}

export interface AuthState {
    user: User | null // Utilisateur connecté
    token: string | null // Token jwt
    loading: boolean // Etat de chargement
    error: string | null // Message d'erreur éventuel
}

export enum AuthActions {
    REGISTER_REQUEST = "auth/registerRequest",
    REGISTER_SUCCESS = "auth/registerSuccess",
    REGISTER_FAILURE = "aurh/registerFaiulure",

    LOGIN_REQUEST = "auth/loginRequest",
    LOGIN_SUCCESS = "auth/loginSuccess",
    LOGIN_FAILURE = "auth/loginFailure",

    LOGOUT = "auth/logout"
}