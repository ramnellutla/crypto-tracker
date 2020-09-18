import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { Observable, Subscription } from 'rxjs';
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
  userLoginObservable: Observable<boolean>;
  userLoginSubscription: Subscription;
  userLoggedIn: boolean;

  constructor(
    private navigationStatusService: NavigationStatusService,
    private userService: UserService,
    private router: Router
  ) {
    this.navigationStatusService.currentActiveTab = TabName.none.toString();
  }

  ngOnInit(): void {
    this.userLoginObservable = this.userService.getUserLoginObservable();

    this.userLoginSubscription = this.userLoginObservable.subscribe((data) => {
      this.userLoggedIn = data;
      this.router.navigateByUrl('/portfolio');
    });

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
        this.userService.displayLoginDialog();
      },
      (error) => {
        console.error('Error signing up the user', error);
      }
    );
  }

  logout(): void {
    this.userService.logout();
  }

  login(): void {
    this.clearData();
    const dialog = this.userService.displayLoginDialog();
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
