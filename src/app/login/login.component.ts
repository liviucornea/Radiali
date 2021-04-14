import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User } from '../shared/models';
import { userSessionStarted } from '../store/actions/userActions';
import { AppState } from '../store/states/appStates';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public loginForm: FormGroup;
  isLoading = false;
  loginSubsc: Subscription;
  message = '';
  public language = 'ro';
  formHasErrors = false;
  public size: 'compact' | 'normal' = 'normal';
  public readonly siteKey="6LcsoKkaAAAAAGOU4sNPuzNuMmtU9blfDifE6HvD";
  constructor(public store: Store<AppState>, private fb: FormBuilder,
    private translate: TranslateService,
    private loginSvc: LoginService,
    private cdr: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {
    this.language = this.translate.currentLang;
    this.loginForm = this.createLoginReactiveForm();
    this.cdr.detectChanges();
    
  }

  createLoginReactiveForm(): FormGroup {
    return this.fb.group({
      password: ['', Validators.required],
      role: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  doLogin() {
    const self = this;
    self.isLoading = true;
    self.formHasErrors = false;
    if (self.loginForm.invalid) {
      this.message = "Introduceti datele de autentificare!";
      this.isLoading = false;
      self.formHasErrors = true;
      return;
    }
    const loginInfo = this.loginForm.getRawValue();
    this.loginSubsc = this.loginSvc.getUserLoginInfo(loginInfo).subscribe(usrInfo => {
      if (usrInfo.data.length == 0) {
        this.isLoading = false;
        self.formHasErrors = true;
        this.message = "Userul sau/si parola sunt gresite!";
        return;
      }
      const user = usrInfo.data[0] as User;
      user.isLoggedIn = true;
      this.store.dispatch(userSessionStarted({user}));
      setTimeout(()=> {
        self.router.navigateByUrl('/products');
      }, 1000);
      this.message = "Loginare reusita. Vei fi redirectat la lista de produse";
    }, err => {
      this.isLoading = false;
      self.formHasErrors = true;
      this.message = "Erroare de loginare!";
    });
   }

  doCancel() {
    this.router.navigateByUrl('/home');
  }
  ngOnDestroy() {
    if (this.loginSubsc) {
      this.loginSubsc.unsubscribe();
    }
  }
}
