import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ProductsComponent } from './components/products/products.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { ProductFilterComponent } from './components/products/product-filter/product-filter.component';
import { ShoppingCartSummaryComponent } from './components/shopping-cart-summary/shopping-cart-summary.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ShippingFormComponent } from './components/shipping-form/shipping-form.component';
import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: 'products', component: ProductsComponent },
            { path: 'shopping-cart', component: ShoppingCartComponent },
            { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard] },
            { path: 'order-success/:id', component: OrderSuccessComponent, canActivate: [AuthGuard] },
            { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
            { path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
            { path: 'my/dashboard', component: MyDashboardComponent, canActivate: [AuthGuard] },
        ])
    ],
    declarations: [
        ProductsComponent,
        ShoppingCartComponent,
        CheckOutComponent,
        OrderSuccessComponent,
        MyOrdersComponent,
        ProductFilterComponent,
        ShoppingCartSummaryComponent,
        ShippingFormComponent,
        OrderDetailComponent,
        MyDashboardComponent
    ]
})
export class ShoppingModule { }
