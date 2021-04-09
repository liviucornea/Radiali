import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product, User } from '../shared/models';
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
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { AppState } from '../store/states/appStates';
import { Store } from '@ngrx/store';
import { loadProductsList, loadProductsListError } from '../store/actions/productsActions';

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
  prodSubsc: Subscription;
  storeSubsc: Subscription;
  userSubs: Subscription;
  user: User;
  constructor(public prodSvc: ProductsService,
    public store: Store<AppState>,
    public router: Router) { }

  ngOnInit(): void {
     //this.productsList = products;
     this.displayedColumns = ['produs_id','nume', 'model', 'dimensiuni'];
     this.prodSubsc = this.prodSvc.getProductsList().subscribe( list => {
      this.store.dispatch(loadProductsList({list: list.data}));
      // console.log('lis of products is', list);
    }, err => {
      this.store.dispatch(loadProductsListError());
    });
     this.storeSubsc = this.store.select('products').subscribe(
      data => {
          if (!data.loaded){
            return;
          }
          this.isLoading = false;
          this.productsList = data.productsLis;
          this.dataSource = new MatTableDataSource<Product>(this.productsList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
      this.userSubs = this.store.select('user').subscribe( usr => this.user = usr);
  }
  
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // fetchProductsJSON().then(products => {
    //   this.isLoading = false;
    //   this.productsList = products;
    //   this.dataSource = new MatTableDataSource<Product>(this.productsList);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
      
    // });

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
       return  product.produs_id.toString().toUpperCase().indexOf(searchFor) > -1 ||
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
    if (this.storeSubsc) {
      this.storeSubsc.unsubscribe();
    }
    if( this.prodSubsc){
      this.prodSubsc.unsubscribe();
    }
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }

  }
  navigateToEditProduct( productId: string) {
    if (this.user.isLoggedIn) {
      this.router.navigateByUrl("/edit-product/" + productId);
    } else {
     // this.router.navigateByUrl("/notFound" );
    }
    
  }
}
