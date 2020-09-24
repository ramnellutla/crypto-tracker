import { Injectable } from '@angular/core';
import { User } from 'src/model/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import moment from 'moment';
import { Settings } from 'src/model/setings';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginUrl = '/api/user/login';
  signupUrl = '/api/user/signup';
  submitSettingsUrl = '/api/user/settings';
  user: User;

  userLoginSubject: Subject<number> = new Subject<number>();
  userSettingsSubject: Subject<Settings> = new Subject<Settings>();

  constructor(private http: HttpClient) {
    if (this.isLoggedIn) {
      this.setUser();
    }
  }

  setUser(): void {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
  }

  login(user: User): void {
    const postData = {
      username: user.username,
      password: user.password,
    };
    this.http.post<any>(this.loginUrl, postData).subscribe(
      (data) => {
        this.setSession(data);
        this.user = {
          username: data.user.username,
          settings: data.user.settings,
          password: '',
        };

        this.userLoginSubject.next(200);
      },
      (error) => {
        this.userLoginSubject.next(error.status);
      }
    );
  }

  signup(username: string, password: string): Observable<User> {
    const postData = {
      username,
      password,
    };
    return this.http.post<User>(this.signupUrl, postData);
  }

  getUserLoginObservable(): Observable<number> {
    return this.userLoginSubject.asObservable();
  }

  logout(): void {
    localStorage.clear();
    this.userLoginSubject.next(201);
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
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  submitUserSettings(settings: Settings): void {
    const putData = {
      settings,
    };

    const httpHeaders = new HttpHeaders().set(
      'bearerToken',
      localStorage.getItem('bearerToken')
    );

    const httpOptions = {
      headers: httpHeaders,
    };

    // subscribe to call
    this.http.put(this.submitSettingsUrl, putData, httpOptions).subscribe(
      (settings: Settings) => {
        this.user.settings = settings;
      },
      (error) => {}
    );
  }

  getAssetAmount(key: string): number {
    return (
      this.user.settings.assets.find((a) => a.symbol === key).amountOwned || 0
    );
  }
}
