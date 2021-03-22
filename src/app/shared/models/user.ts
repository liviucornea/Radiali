export class User {
    id: string;
    firstName: string;
    lastName: string;
    isLoggedIn: boolean;
    isLoggingIn: boolean;
    constructor( id: string) {
        this.id = id;
    }
}