import { UserState } from "./userState";
import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from "../reducers/utils";
import { ProductsState } from "./productsStates";

export interface AppStateBase {
    user: UserState,
    products: ProductsState
}

export interface AppState extends AppStateBase {
    // reducer interfaces
    router: fromRouter.RouterReducerState<RouterStateUrl>;
  }