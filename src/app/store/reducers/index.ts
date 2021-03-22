import { ActionReducer, ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "../states/appStates";
import { userReducer } from "./userReducer";
import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../../environments/environment';

export const reducersMap: ActionReducerMap<AppState> = {
    router: fromRouter.routerReducer,
    user: userReducer
 }

 export function logger(
    reducer: ActionReducer<AppState>
  ): ActionReducer<AppState> {
    return (state: AppState, action: any): AppState => {
      // uncomment line bellow if you want to have in console all state changes
     // console.log('state -> action', state, action);
      return reducer(state, action);
    };
  }

  export const metaReducers: MetaReducer<AppState>[] = !environment.production
    ? [logger]
    : [];