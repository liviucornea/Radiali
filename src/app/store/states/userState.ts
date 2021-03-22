import { User }  from '../../shared/models';

export interface UserState extends User  {
    [propName: string]: any;
}

export const INITIAL_USER_STATE: UserState = new User('GUEST') as UserState;