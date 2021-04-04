import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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

  constructor(public store: Store<AppState>, private fb: FormBuilder,
    private loginSvc: LoginService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.createLoginReactiveForm();
  }

  createLoginReactiveForm(): FormGroup {
    return this.fb.group({
      password: [''],
      role: ['']
    });
  }

  doLogin() {
    const self = this;
    this.isLoading = true;
    const loginInfo = this.loginForm.getRawValue();
    this.loginSubsc = this.loginSvc.getUserLoginInfo(loginInfo).subscribe(usrInfo => {
      if (usrInfo.data.length == 0) {
        this.isLoading = false;
        this.message = "Userul sau/si parola sunt gresite!";
        return;
      }
      const user = usrInfo.data[0] as User;
      user.isLoggedIn = true;
      this.store.dispatch(userSessionStarted({user}));
      setTimeout(()=> {
        self.router.navigateByUrl('/products');
      }, 3000);
      this.message = "Loginare reusita. Vei fi redirectat la lista de produse";
    }, err => {
      this.isLoading = false;
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
