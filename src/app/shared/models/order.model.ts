import { ShippingModel } from './shipping.model';
import { ShoppingCart } from './shopping-cart';

export class Order {
    id?: string;
    datePlaced: number;
    items: any[];
    amount: number;
    constructor(public userId: string, public shipping: ShippingModel, shoppingCart: ShoppingCart) {
        this.datePlaced = new Date().getTime();
        this.amount = 0;

        shoppingCart.items.forEach(element => {
            this.amount += element.totalPrice;
        });

        this.items = shoppingCart.items.map(i => {
            return {
                product: {
                    title: i.title,
                    imageUrl: i.imageUrl,
                    price: i.price
                },
                quantity: i.quantity,
                totalPrice: i.totalPrice
            }
        })
    }
}