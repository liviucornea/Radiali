import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models';
//import { products } from '../../assets/produse';
// import { products } from './productsMock';
import { AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { fromEvent, of, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map
} from 'rxjs/operators';

async function fetchProductsJSON() {
  const response = await fetch('../../assets/produse.json');
  const products = await response.json();
  return products;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {

  productsList: Product [] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  forProdSearch = '';
  noSearchResult = false;
  isLoading = true;
  searchSubsc: Subscription;
  constructor() { }

  ngOnInit(): void {
     //this.productsList = products;
     this.displayedColumns = ['produs_id','nume', 'model', 'dimensiuni'];
     this.dataSource = new MatTableDataSource<Product>(this.productsList);

  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    fetchProductsJSON().then(products => {
      this.isLoading = false;
      this.productsList = products;
      this.dataSource = new MatTableDataSource<Product>(this.productsList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    });
    this.searchSubsc = fromEvent(document.getElementById('type-ahead'), 'keyup').pipe(
                        debounceTime(200),
                        map((e: any) => {
                          this.isLoading = true;
                            return e.target.value;
                        } ),
                        distinctUntilChanged()).subscribe(i => this.searchProduct());

  }

  searchProduct() {
      const searchFor = this.forProdSearch.toUpperCase();
      if (!searchFor) {
        this.dataSource = new MatTableDataSource<Product>(this.productsList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.noSearchResult = false;
        return;
      }
      const foundedProducts = this.productsList.filter(product => {
       return  product.produs_id.toUpperCase().indexOf(searchFor) > -1 ||
       product.model.toUpperCase().indexOf(searchFor) > -1 ||
       product.nume.toUpperCase().indexOf(searchFor) > -1 ||
       product.dimensiuni.toUpperCase().indexOf(searchFor) > -1
      });
      if (foundedProducts.length > 0) {
        this.noSearchResult = false;
        this.dataSource = new MatTableDataSource<Product>(foundedProducts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else if(this.forProdSearch) {
        this.noSearchResult = true;
        // this.dataSource =  new MatTableDataSource<Product>([]);
      }
      this.isLoading = false;
  }
  ngOnDestroy() {
    if (this.searchSubsc){
      this.searchSubsc.unsubscribe();
    }

  }

}
