import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavigationStatusService,
  TabName,
} from 'src/services/navigation-status/navigation-status.service';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LoginPageComponent } from '../login-page/login-page.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less'],
})
export class NavigationComponent implements OnInit {
  items: any[];
  portfolio: any;
  rippleColor: 'yellow';
  userLoggedIn: boolean;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(
    private navigationStatusService: NavigationStatusService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.portfolio = {
      label: 'Portfolio',
      routerLink: '/home',
      routerLinkActiveOptions: 'active',
      styleClass: 'left-menu-items',
      title: 'Portfolio',
    };

    this.items = [
      {
        label: 'Portfolio',
        routerLink: '/portfolio',
        routerLinkActiveOptions: 'active',
        styleClass: 'left-menu-items',
        title: TabName.portfolio,
        imageSource: 'assets/img/Portfolio.png',
      },
      {
        label: 'Ranking',
        routerLink: '/ranking',
        routerLinkActiveOptions: 'active',
        styleClass: 'right-menu-items',
        title: TabName.ranking,
        imageSource: 'assets/img/Ranking.png',
      },
      {
        label: 'Predictions',
        routerLink: '/prediction',
        routerLinkActiveOptions: 'active',
        styleClass: 'right-menu-items',
        title: TabName.predictions,
        imageSource: 'assets/img/Predictions.png',
      },
    ];
  }

  getCurrentTabImage() {
    return (
      'assets/img/' + this.navigationStatusService.currentActiveTab + '.png'
    );
  }

  getCurrentActiveTab() {
    return this.navigationStatusService.currentActiveTab;
  }

  setCurrentActiveTab(tabName: string) {
    this.navigationStatusService.currentActiveTab = tabName;
  }

  isActive(tabName: string): boolean {
    return this.navigationStatusService.currentActiveTab === tabName;
  }

  getLoginLogoutImage(): string {
    return this.userLoggedIn
      ? 'https://img.icons8.com/ios-glyphs/30/000000/logout-rounded-left.png'
      : 'https://img.icons8.com/ios-glyphs/16/48/login-rounded-right.png';
  }

  openLoginLogoutDialog() {
    const dialogRef = this.dialog.open(LoginPageComponent, {
      width: '500px',
      data: { name: 'Login' },
    });
  }
}
