import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  userDetail = new UserModel();
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  async register() {
    await this.authService.register(this.userDetail);
  }
}
