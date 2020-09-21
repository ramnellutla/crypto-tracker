import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DialogService } from 'src/services/dialog/dialog.service';
import {
  NavigationStatusService,
  TabName,
} from 'src/services/navigation-status/navigation-status.service';
import { UserService } from 'src/services/user/user.service';
export interface SignupData {
  name: string;
  username: string;
  password: string;
}

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.less'],
})
export class SignupPageComponent implements OnInit {
  data: SignupData = { name: '', username: '', password: '' };
  hidePassword = true;
  confirmPassword: string;
  hideSignupPage = false;
  userLoginObservable: Observable<number>;
  userLoginSubscription: Subscription;
  userLoggedIn: boolean;
  errorBanner = '';

  constructor(
    private navigationStatusService: NavigationStatusService,
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.navigationStatusService.currentActiveTab = TabName.none.toString();
  }

  ngOnInit(): void {
    this.userLoginObservable = this.userService.getUserLoginObservable();

    this.userLoginSubscription = this.userLoginObservable.subscribe(
      (status) => {
        this.userLoggedIn = status === 200;
        this.router.navigateByUrl('/portfolio');
      }
    );

    if (this.userService.isLoggedIn()) {
      this.userLoggedIn = true;
      this.hideSignupPage = true;
    }

    this.clearData();
  }

  onSignup(): void {
    this.userService.signup(this.data.username, this.data.password).subscribe(
      (data) => {
        this.hideSignupPage = true;
        this.dialogService.displayLoginDialog();
        this.errorBanner = 'Signup successful';
      },
      (error) => {
        if (error.status === 409) {
          console.error('Error signing up the user', error);
          this.errorBanner = '*Username already exists. Please try another.';
          return;
        }
        this.errorBanner = '*unable to create user';
      }
    );
  }

  confirmPasswordEntered(): void {
    if (
      this.data.password &&
      this.confirmPassword &&
      this.data.password !== this.confirmPassword
    ) {
      this.errorBanner = '*password and confirm password did not mismatch';
      return;
    }
    this.errorBanner = '';
  }

  logout(): void {
    this.userService.logout();
  }

  login(): void {
    this.clearData();
    const dialog = this.dialogService.displayLoginDialog();
    this.hideSignupPage = true;

    dialog.afterClosed().subscribe((result) => {
      this.hideSignupPage = false;
    });
  }

  clearData(): void {
    this.data.name = '';
    this.data.username = '';
    this.data.password = '';
    this.confirmPassword = '';
  }
}
