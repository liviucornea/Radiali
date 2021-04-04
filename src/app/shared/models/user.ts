export class User {
    user_id: string;
    firstName: string;
    lastName: string;
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    role: string;
    constructor( id: string) {
        this.user_id = id;
    }
}