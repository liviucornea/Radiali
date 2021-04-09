import {createAction, props} from '@ngrx/store';
import { User } from '../../shared/models';


export const logInAction = createAction(
  '[User] User logIn'
);


export const guestUserLoaded = createAction(
  '[User] Guest user is loaded'
);

export const userSessionStarted = createAction(
  '[User] User Session Started',
  props<{ user: User }>()
);

export const userImpersonateAccount = createAction(
  '[User] User Impersonate Account',
  props<{ user: User }>()
);

export const logOutAction = createAction(
  '[User] User logOut',
  props<{ user: User }>()
);

export const loggedOutAction = createAction(
  '[User] User loggedOut'
);

export const loginFailure = createAction(
  '[User] User logIn failed',
  props<{ errorMsg: string }>()
);