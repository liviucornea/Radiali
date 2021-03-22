import { UserState } from "./userState";
import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from "../reducers/utils";

export interface AppStateBase {
    user: UserState 
}

export interface AppState extends AppStateBase {
    // reducer interfaces
    router: fromRouter.RouterReducerState<RouterStateUrl>;
  }