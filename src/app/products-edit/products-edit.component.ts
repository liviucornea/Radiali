import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../products/products.service';
import { Product } from '../shared/models';
import { AppState } from '../store/states/appStates';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss']
})
export class ProductsEditComponent implements OnInit, OnDestroy {

  public product: Product;
  private productId: string;
  private productsObs$ : Observable<any[]>;
  private productSubs: Subscription;
  private prodSaveSubsc: Subscription;
  public productForm: FormGroup;
  public message = '';

  constructor(public prodSvc: ProductsService, private route: ActivatedRoute,
    public store: Store<AppState>, private fb: FormBuilder,
    private router: Router ) { }

  ngOnInit(): void {
    this.productForm = this.createProductReactiveForm();
    this.productsObs$ = this.route.paramMap.pipe(
      switchMap(params => { 
        this.productId =  params.get('productId');
        return this.store.select('products').pipe(map(prodState=> prodState.productsLis));
      })
    );
    this.productSubs = this.productsObs$.subscribe(list => {
      this.product = list.find(prod => prod.produs_id == this.productId);
      this.populateForm(this.product);
    })
  }

  createProductReactiveForm(): FormGroup {
    return this.fb.group({
      produs_id: ['', Validators.required],
      nume: [''],
      model: [''],
      dimensiuni: [''],
      description: ['']
    });
  }

  populateForm(product: Product) {
    this.productForm.get('produs_id').setValue(product.produs_id);
    this.productForm.get('nume').setValue(product.nume);
    this.productForm.get('model').setValue(product.model);
    this.productForm.get('dimensiuni').setValue(product.dimensiuni);
    this.productForm.get('description').setValue(product.description);
  }

  createNewProduct() {
    this.prodSvc.createProduct().subscribe( data => {
      console.log('product is inserted');
      }, error => { console.log(' error', error)});
  }
  doSave() {
    const prod = this.productForm.getRawValue() as Product;
    this.prodSaveSubsc =this.prodSvc.updateProduct(prod).subscribe(result=>{
      if(result.message) {
          this.message = "Produsul a fost salvat cu success";
      }
      console.log('Product is saved');
    }, err =>{
      this.message = "Produsul nu poate fi salvat momentan. Incercati mai tirziu";
    })
  }

  ngOnDestroy () {
    if (this.productSubs) {
      this.productSubs.unsubscribe();
    }
    if(this.prodSaveSubsc){
      this.prodSaveSubsc.unsubscribe();
    }
  }

  doCancel() {
    this.router.navigateByUrl('/products');
  }
}
