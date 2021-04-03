import { createAction, props } from "@ngrx/store";
import { Product } from "src/app/shared/models";

export const loadProductsList = createAction(
    '[Products] Load Products List',
    props<{ list: Product[] }>()
  );