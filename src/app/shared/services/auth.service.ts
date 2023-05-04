import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly encryptSecretKey = "SREERAM-SECRETKEY";
  user$: Observable<firebase.default.User | null>;
  constructor(private afAuth: AngularFireAuth, private router: Router, private route: ActivatedRoute, private userService: UserService, private toastrService: ToastrService) {
    this.user$ = afAuth.authState;
  }
  loginWithGoogle() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
      .then(response => {
        this.router.navigateByUrl(returnUrl);
      })
      .catch(error => {
      });
  }
  register(userModel: UserModel) {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.afAuth.createUserWithEmailAndPassword(userModel.email, userModel.password)
      .then((result: any) => {
        this.userService.update(result.key, userModel);
        this.toastrService.success('Registration successful...!');
        this.router.navigateByUrl(returnUrl);
      })
      .catch(error => {
        this.toastrService.warning(error.message);
      });
  }
  validate(userModel: UserModel) {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.afAuth.signInWithEmailAndPassword(userModel.email, userModel.password)
      .then(res => {
        this.toastrService.success('Login success...!');
        this.router.navigateByUrl(returnUrl);
      })
      .catch(error => {
        this.toastrService.error(error.message);
      });
  }
  get appUser$(): Observable<UserModel | null> {
    return this.user$
      .pipe(switchMap(fbUser => {
        if (fbUser)
          return this.userService.getById(fbUser.uid);
        else
          return of(null);
      }));
  }
  logOut() {
    this.afAuth.signOut();
  }
}
