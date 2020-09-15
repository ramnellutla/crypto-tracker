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
  ngOnInit(): void {}

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
