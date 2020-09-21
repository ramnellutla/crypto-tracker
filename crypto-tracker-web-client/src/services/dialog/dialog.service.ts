import { Injectable } from '@angular/core';
import { LoginPageComponent } from 'src/app/login-page/login-page.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  displayLoginDialog(): any {
    return this.dialog.open(LoginPageComponent, {
      width: '500px',
      data: { name: 'Login' },
    });
  }
}
