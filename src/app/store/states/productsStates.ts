import { Product } from "src/app/shared/models";

export interface ProductsState {
    productsLis: Product [];
    loaded: boolean
}

export const INITIAL_PRODUCT_STATE: ProductsState = { productsLis: [],
loaded: false};