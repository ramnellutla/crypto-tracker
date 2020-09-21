import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Settings } from 'src/model/setings';
import { UserService } from 'src/services/user/user.service';

export interface DialogData {
  name: string;
  username: string;
  password: string;
  settings: Settings;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<LoginPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService
  ) {}
  displayLoginFailed = false;
  loginFailedText = '';
  hidePassword = true;

  userLoginObservable: Observable<number>;
  userLoginSubscription: Subscription;

  ngOnInit(): void {
    this.userLoginObservable = this.userService.getUserLoginObservable();

    this.userLoginSubscription = this.userLoginObservable.subscribe(
      (status) => {
        if (status !== 200) {
          this.displayLoginFailed = true;
        }

        switch (status) {
          case 200:
            this.dialogRef.close();
            break;
          case 401:
            this.loginFailedText = 'Invalid credentials. Please try again.';
            break;
          case 404:
            this.loginFailedText = 'Username not found';
            break;
          default:
            this.loginFailedText = 'Unable to login.';
        }
      }
    );
  }

  onSingupClick(): void {
    this.dialogRef.close();
  }

  login(): void {
    this.userService.login(this.data);
  }

  isLoginDataInvalid(): boolean {
    return !this.data || !this.data.username || !this.data.password;
  }
}
