import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models';
import { products } from './productsMock';
import { AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {

  productsList: Product [];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  forProdSearch = '';
  noSearchResult = false;
  constructor() { }

  ngOnInit(): void {
     this.productsList = products;
     this.displayedColumns = ['code', 'model', 'description'];
    this.dataSource = new MatTableDataSource<Product>(this.productsList);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  searchProduct() {
      const searchFor = this.forProdSearch.toUpperCase();
      if (!searchFor) {
        this.dataSource = new MatTableDataSource<Product>(this.productsList);
        this.noSearchResult = false;
        return;
      }
      const foundedProducts = this.productsList.filter(product => {
       return  product.code.toUpperCase().indexOf(searchFor) > -1 ||
       product.model.toUpperCase().indexOf(searchFor) > -1 ||
       product.description.toUpperCase().indexOf(searchFor) > -1
      });
      if (foundedProducts.length > 0) {
        this.noSearchResult = false;
        this.dataSource = new MatTableDataSource<Product>(foundedProducts);
      } else if(this.forProdSearch) {
        this.noSearchResult = true;
        // this.dataSource =  new MatTableDataSource<Product>([]);
      }
  }


}
