import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  userDetail = new UserModel();
  constructor(private auth: AuthService, private router: Router) {

  }
  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }
  login() {
    this.auth.validate(this.userDetail);
  }
}
