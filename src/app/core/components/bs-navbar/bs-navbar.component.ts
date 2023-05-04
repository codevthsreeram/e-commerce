import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ShoppingCartService } from 'src/app/shared/services/shoppingcart.service';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  appUser: UserModel = new UserModel();
  normaluser: UserModel;
  shoppingCartItemCount: number;
  constructor(public authService: AuthService, private cartService: ShoppingCartService, private router: Router) {
  }
  async ngOnInit() {
    this.authService.appUser$.subscribe((user: any) => { this.appUser = user; });
    let cart$ = await this.cartService.getCart();
    cart$.subscribe(cart => {
      this.shoppingCartItemCount = 0;
      for (let productId in cart.items)
        this.shoppingCartItemCount += cart.items[productId].quantity;
      cart.items
    })
  }
  async logOut() {
    await this.authService.logOut();
    this.router.navigate(['/']);
  }
}
