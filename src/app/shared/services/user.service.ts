import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  saveUserDetails(userId: any, userDetail: any) {
    this.db.object('/users/' + userId).update({
      displayName: userDetail.displayName,
      email: userDetail.email
    });
  }
  create(userModel: UserModel) {
    return this.db.list('/users').push(userModel);
  }
  getAll(): Observable<UserModel[]> {
    return this.db.list('users').snapshotChanges().pipe(map((changes: any) => {
      return changes.map((c: any) => ({ id: c.payload.key, ...c.payload.val() as UserModel }));
    }));
  }
  getById(userId: any) {
    return this.db.object<UserModel>('/users/' + userId).valueChanges()
      .pipe(map((response: any) => {
        return <UserModel>{
          id: userId,
          firstName: response.firstName ? response.firstName : null,
          email: response.email,
          lastName: response.lastName ? response.lastName : null,
          displayName: response.displayName ? response.displayName : response.email,
          isAdmin: response.isAdmin ? response.isAdmin : false
        }
      }));
  }

  update(userId: any, userDetail: UserModel) {
    return this.db.object('/users/' + userId).update(userDetail);
  }

  delete(productId: any) {
    return this.db.object('/users/' + productId).remove();
  }
}
