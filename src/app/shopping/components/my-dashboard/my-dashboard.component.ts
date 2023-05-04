import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

  saleProductData: any[] = [];
  saleUserData: any[] = [];
  public saleProductDataInput: any;
  public loader: boolean = false;
  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    let productOrderItems: any[] = [];
    let userItems: any[] = [];
    this.authService.appUser$.subscribe((response: any) => {
      this.orderService.getOrdersByUser(response.id ? response.id : '')
        .subscribe((response : any) => {
          response.forEach((item: any) => {
            item.items.forEach((element: any) => {
              productOrderItems.push({ name: element.product.title, value: element.totalPrice });
            });
          });
          response.forEach((element: any) => {
            userItems.push({ userId: element.userId, name: element.shipping.name, value: element.amount });
          });
          const calculatedUserItems = userItems.reduce((acc, item) => {
            let accItem = acc.find((ai: any) => ai.userId === item.userId);
            if (accItem) {
              accItem.value += item.value
            } else {
              acc.push(item)
            }
            return acc;
          }, [])

          this.saleUserData = [...calculatedUserItems];

          const calculatedProductOrderItems = productOrderItems.reduce((acc, item) => {
            let accItem = acc.find((ai: any) => ai.name === item.name);
            if (accItem) {
              accItem.value += item.value
            }
            else {
              acc.push(item)
            }
            return acc;
          }, [])

          this.saleProductData = [...calculatedProductOrderItems];
          this.saleProductDataInput = { data: this.saleProductData, multiSeries: false, seriesCount: 1, xAxis: 'name', yAxis: 'value' };
          this.loader = true;
        });
    })
  }
}
