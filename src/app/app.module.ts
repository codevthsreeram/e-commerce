import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { ShoppingModule } from './shopping/shopping.module';
import { CoreModule } from './core/core.module';
import { AngularFireModule } from '@angular/fire/compat';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductsComponent } from './shopping/components/products/products.component';
import { SignInComponent } from './core/components/sign-in/sign-in.component';
import { RegistrationComponent } from './core/components/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AdminModule,
    ShoppingModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot([
      { path: '', component: ProductsComponent },
      { path: 'login', component: SignInComponent },
      { path: 'register', component: RegistrationComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
