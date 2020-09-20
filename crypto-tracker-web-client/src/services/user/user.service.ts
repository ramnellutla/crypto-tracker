import { Injectable } from '@angular/core';
import { User } from 'src/model/user';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { LoginPageComponent } from 'src/app/login-page/login-page.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginUrl = '/api/user/login';
  signupUrl = '/api/user/signup';
  submitSettingsUrl = '/api/user/setings';

  userLoginSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  login(user: User): Observable<User> {
    const postData = {
      username: user.username,
      password: user.password,
    };
    return this.http.post<User>(this.loginUrl, postData);
  }

  displayLoginDialog(): any {
    return this.dialog.open(LoginPageComponent, {
      width: '500px',
      data: { name: 'Login' },
    });
  }

  signup(username: string, password: string): Observable<User> {
    const postData = {
      username,
      password,
    };
    return this.http.post<User>(this.signupUrl, postData);
  }

  getUserLoginObservable(): Observable<boolean> {
    return this.userLoginSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('expires_at');
    console.log(localStorage);
    this.userLoginSubject.next(false);
  }

  isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): moment.Moment {
    const expiresAt = localStorage.getItem('expires_at');
    return moment(expiresAt);
  }

  setSession(data): void {
    localStorage.setItem('bearerToken', data.bearerToken);
    localStorage.setItem('expires_at', data.expiry);
    this.userLoginSubject.next(true);
  }

  submitUserSettings(settings: string): Observable<any> {
    const putData = {
      settings,
    };
    return this.http.put(this.submitSettingsUrl, putData);
  }
}
