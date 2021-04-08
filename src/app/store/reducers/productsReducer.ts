import { INITIAL_PRODUCT_STATE, ProductsState } from "../states/productsStates";
import {Action, createReducer, on, createSelector, createFeatureSelector} from '@ngrx/store';
import {ProductsActions} from '../actions';

const reduceForProducts = createReducer(
    INITIAL_PRODUCT_STATE,
    on(ProductsActions.loadProductsList, (productsState: ProductsState, action) => {
      
      return Object.assign({...productsState,
        loaded: true,
        productsLis: action.list});
    }),
    on(ProductsActions.loadProductsListError, (productsState: ProductsState, action) => {
      
      return Object.assign({...productsState,
        loaded: true});
    })
  );
  
  export function productsReducer(productsState: ProductsState | undefined, productsAction: Action) {
    return reduceForProducts(productsState, productsAction);
  }


