import { Injectable } from '@angular/core';
import { User } from 'src/model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginUrl = '/api/user/login';

  constructor(private http: HttpClient) {}

  login(user: User) {
    const postData = {
      userName: user.username,
      password: user.password,
    };
    this.http.post<User>(this.loginUrl, postData).subscribe((data) => {});

    console.log(user.username, user.password);
  }
}
