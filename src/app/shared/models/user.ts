export class User {
    user_id: string;
    firstName: string;
    lastName: string;
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    user_token?: string;
    role: string;
    constructor( id: string) {
        this.user_id = id;
    }
}