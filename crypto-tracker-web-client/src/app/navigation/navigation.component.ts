import { Component, OnInit } from '@angular/core';
import {
  NavigationStatusService,
  TabName,
} from 'src/services/navigation-status.service';
import { GetListingOptions } from 'src/model/get-listing-options';
import { CoinMarketCapService } from 'src/services/coin-market-cap.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.less'],
})
export class NavigationComponent implements OnInit {
  items: any[];
  portfolio: any;
  rippleColor: 'yellow';
  constructor(
    private navigationStatusService: NavigationStatusService,
    private coinMarketCapService: CoinMarketCapService
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
        imageSource:
          'https://img.icons8.com/plasticine/64/000000/investment-portfolio.png',
      },
      {
        label: 'Ranking',
        routerLink: '/ranking',
        routerLinkActiveOptions: 'active',
        styleClass: 'right-menu-items',
        title: TabName.ranking,
        imageSource:
          'https://img.icons8.com/cotton/64/000000/leaderboard--v1.png',
      },
      {
        label: 'Predictions',
        routerLink: '/prediction',
        routerLinkActiveOptions: 'active',
        styleClass: 'right-menu-items',
        title: TabName.predictions,
        imageSource: 'https://img.icons8.com/nolan/64/future.png',
      },
    ];
  }

  setCurrentActiveTabToHome() {
    this.navigationStatusService.currentActiveTab = TabName.portfolio;
  }

  isActive(tabName: string): boolean {
    return this.navigationStatusService.currentActiveTab.toString() === tabName;
  }
}
