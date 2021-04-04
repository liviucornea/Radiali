import {UserActions} from '../actions';
import {Action, createReducer, on, createSelector, createFeatureSelector} from '@ngrx/store';
import { User } from '../../shared/models';
import { INITIAL_USER_STATE, UserState } from '../states/userState';



const reduceForUser = createReducer(
  INITIAL_USER_STATE,
  on(UserActions.logInAction, (userState: UserState, action) => {
    const user = new User('GUEST');
    user.isLoggedIn = false;
    user.isLoggingIn = true;
    return Object.assign({...userState}, user);
  }),
  on(UserActions.userSessionStarted, (userState: UserState, action) => {
    return Object.assign({...userState}, action.user);
  }),
  on(UserActions.guestUserLoaded, (userState: UserState, action) => {
    userState = new User('GUEST');
    userState.isLoaded = true;
    return userState;
  })
);

export function userReducer(userState: UserState | undefined, userAction: Action) {
  return reduceForUser(userState, userAction);
}