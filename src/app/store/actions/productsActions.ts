import { createAction, props } from "@ngrx/store";
import { Product } from "src/app/shared/models";

export const loadProductsList = createAction(
    '[Products] Load Products List',
    props<{ list: Product[] }>()
  );

  export const loadProductsListError = createAction(
    '[Products] Error Load Products List' 
  );
  export const unLoadProductsList = createAction(
    '[Products] UnLoad Products List' 
  );