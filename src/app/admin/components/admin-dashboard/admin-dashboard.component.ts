import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public saleProductDataInput: any;
  public loader: boolean = false;
  saleProductData: any[] = [];
  saleUserData: any[] = [];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    let productOrderItems: any[] = [];
    let userItems: any[] = [];
    this.orderService.getOrders()
      .subscribe(response => {
        //Forming the product data
        response.forEach((item: any) => {
          item.items.forEach((element: any) => {
            productOrderItems.push({ name: element.product.title, value: element.totalPrice });
          });
        });

        response.forEach((element: any) => {
          userItems.push({ userId: element.userId, name: element.shipping.name, value: element.amount });
        });

        const calculatedUserItems = userItems.reduce((acc, item) => {

          let accItem = acc.find((ai: any) => ai.userId === item.userId)

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
  }
}