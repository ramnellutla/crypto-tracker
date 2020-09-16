import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/services/user/user.service';

export interface DialogData {
  name: string;
  username: string;
  password: string;
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
  ngOnInit(): void {}

  onSingupClick(): void {
    this.dialogRef.close();
  }

  login(): void {
    this.userService.login(this.data).subscribe(
      (data) => {
        this.dialogRef.close();
      },
      (error) => {
        this.displayLoginFailed = true;
        if (error.status === 401) {
          this.loginFailedText = 'Invalid credentials. Please try again.';
          return;
        }
        this.loginFailedText = 'Unable to login.';
      }
    );
  }

  isLoginDataInvalid(): boolean {
    return !this.data || !this.data.username || !this.data.password;
  }
}
