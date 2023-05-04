import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ShoppingCartService } from './shoppingcart.service';
import { SortColumn, SortDirection } from './sortable.directive';
import { Order } from '../models/order.model';

interface SearchResult {
  orderList: Order[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(orders: Order[], column: SortColumn, direction: string): Order[] {
  if (direction === '' || column === '') {
    return orders;
  } else {
    return [...orders].sort((a: any, b: any) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(order: Order, term: string, pipe: PipeTransform) {
  return order.shipping.name.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(order.amount).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _orders$ = new BehaviorSubject<Order[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  orderList: Order[];
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };


  constructor(private db: AngularFireDatabase,
    private shoppingCartService: ShoppingCartService,
    private pipe: DecimalPipe,
    private toastrService: ToastrService,
    private authService: AuthService,
    private activeRoute: Router
  ) {
    this.loadOrders();
  }
  loadOrders() {
    let activeRoute = this.activeRoute.url;
    if (activeRoute.startsWith('/my/orders')) {
      this.authService.appUser$.subscribe(user => {
        if (user) {
          this.getOrdersByUser(user.id ? user.id : '')
            .subscribe(
              response => {
                this.orderList = response as Order[];
                this._search$.pipe(
                  tap(() => this._loading$.next(true)),
                  debounceTime(200),
                  switchMap(() => this._search()),
                  delay(200),
                  tap(() => this._loading$.next(false))
                ).subscribe(result => {
                  this._orders$.next(result.orderList);
                  this._total$.next(result.total);
                });
                this._search$.next();
              });
        }
      });
    }
    else {
      this.getOrders()
        .subscribe(
          response => {
            this.orderList = response as Order[];
            this._search$.pipe(
              tap(() => this._loading$.next(true)),
              debounceTime(200),
              switchMap(() => this._search()),
              delay(200),
              tap(() => this._loading$.next(false))
            ).subscribe(result => {
              this._orders$.next(result.orderList);
              this._total$.next(result.total);
            });
            this._search$.next();
          });
    }
  }
  get orders$() { return this._orders$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let orders = sort(this.orderList, sortColumn, sortDirection);

    // 2. filter
    orders = orders.filter(products => matches(products, searchTerm, this.pipe));
    const total = orders.length;

    // 3. paginate
    orders = orders.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ orderList: orders, total });
  }
  async placeOrder(order: any) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    this.toastrService.success('Order placed successfully...!')
    return result;
  }

  getOrders() {
    return this.db.list('orders').snapshotChanges()
      .pipe(map((changes: any) => {
        return changes.map((c: any) => ({ id: c.payload.key, ...c.payload.val() as Order }));
      }));
  }
  getById(orderId: any) {
    return this.db.object('/orders/' + orderId).valueChanges()
      .pipe(map((response: any) => {
        return <Order>{
          id: orderId,
          datePlaced: response.datePlaced,
          items: response.items,
          shipping: response.shipping,
          amount: response.amount
        }
      }));
  }
  getOrdersByUser(userId: string) {
    return this.db.list('orders', ref => ref.orderByChild('userId').equalTo(userId)).snapshotChanges()
      .pipe(map((response: any) => {
        return response.map((c: any) => ({ id: c.payload.key, ...c.payload.val() as Order }));
      }));
  }
}
