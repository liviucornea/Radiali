import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Product } from '../shared/models';

@Injectable({
    providedIn: 'root'
  })
  export class ProductsService {
    // private baseUrl = this.config.shoppingCart.baseUrl;
    private baseUrl = 'api/produse';
    getShoppingCartStartTime = Date.now();
  
    constructor(private http: HttpClient) {   }

    getProductsList(): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          };
        return this.http.get(this.baseUrl, httpOptions);
    }

    createProduct(): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          };
          const  product = {
            "nume":"KUBOTA", "model": "KX 36","dimensiuni": "200x96x30 ", "description" :"200x96x30 "
          };
        return this.http.post(this.baseUrl, product, httpOptions);
    }
    
    updateProduct(product: Product): Observable<any> {
      const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        };
        const  prod = Object.assign({}, product);
        delete prod.produs_id;
      return this.http.put(this.baseUrl + '/' + product.produs_id , prod, httpOptions);
        }

    }