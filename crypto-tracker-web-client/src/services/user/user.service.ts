import { Injectable } from '@angular/core';
import { User } from 'src/model/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginUrl = '/api/user/login';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<User> {
    const postData = {
      username: user.username,
      password: user.password,
    };
    return this.http.post<User>(this.loginUrl, postData);
  }
}
