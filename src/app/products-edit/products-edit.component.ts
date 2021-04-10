import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DialogYesNoComponent } from '../dialog-yesno/dialog-yesno.component';
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
  private dialogSubsc: Subscription;
  public productForm: FormGroup;
  public message = '';
  isSaving = false;
  isAddingNew = false;

  constructor(public prodSvc: ProductsService, private route: ActivatedRoute,
    public store: Store<AppState>, private fb: FormBuilder,
    public dialog: MatDialog,
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
      produs_id: new FormControl({value: '', disabled: true, }),
      nume: ['', Validators.required],
      model: ['', Validators.required],
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

  doSave() {
    if (this.isAddingNew) {
      this.createNewProd()
      return;
    }
    this.isSaving = true;
    const prod = this.productForm.getRawValue() as Product;
    this.prodSaveSubsc =this.prodSvc.updateProduct(prod).subscribe(result=>{
      if (result.message) {
          this.message = "Produsul a fost salvat cu success";
      }
      console.log('Product is saved');
      this.isSaving = false;
    }, err => {
      this.message = "Produsul nu poate fi salvat momentan. Incercati mai tirziu";
      this.isSaving = false;
    })
  }

  createNewProd() {
    this.isSaving = true;
    const prod = this.productForm.getRawValue() as Product;
    prod.description = prod.description ? prod.description : ' ';
    prod.dimensiuni = prod.dimensiuni ? prod.dimensiuni: ' ';
    this.prodSaveSubsc =this.prodSvc.createProduct(prod).subscribe(result=>{
      if(result.message) {
          this.message = "Produsul a fost creeat cu success";
      }
      console.log('Product is saved');
      this.isSaving = false;
      this.isAddingNew = false;
    }, err => {
      this.message = "Produsul nu poate fi creeat momentan. Incercati mai tirziu";
      this.isSaving = false;
      this.isAddingNew = false;
    })
  }

  addNew() {
    this.isAddingNew = true;
    let product = new Product('new');
    this.populateForm(product);
  }

  doCallForDelete() {
    const dialogRef = this.dialog.open(DialogYesNoComponent, {
      width: '250px',
      data: {intrebare: 'Confirmi stergerea', raspuns: 'No'}
    });

    this.dialogSubsc = dialogRef.afterClosed().subscribe(dialogResp => {
      if (dialogResp) {
        this.deleteProduct();
      }
  
    });

  }
  deleteProduct() {
    this.isSaving = true;
    this.prodSaveSubsc = this.prodSvc.deleteProduct(this.productId).
    subscribe(data=> {
      this.isSaving = false;
      this.message = "Produsul a fost sters. Veti fi redirectat la lista de produse";
      setTimeout(() => {
        this.router.navigateByUrl('/products');
      }, 5000);
    }, err => {
      this.isSaving = false;
      this.message = "Produsul nu poate fi sters. Incercati mai tirziu";
    })
  }
  ngOnDestroy() {
    if (this.productSubs) {
      this.productSubs.unsubscribe();
    }
    if(this.prodSaveSubsc){
      this.prodSaveSubsc.unsubscribe();
    }
    if(this.dialogSubsc){
      this.dialogSubsc.unsubscribe();
    }
  }

  doCancel() {
    this.router.navigateByUrl('/products');
  }
}


