import { Component, OnInit } from '@angular/core';
import {
  NavigationStatusService,
  TabName,
} from 'src/services/navigation-status/navigation-status.service';
import { GetListingOptions } from 'src/model/get-listing-options';
import { CoinMarketCapService } from 'src/services/coin-market-cap/coin-market-cap.service';

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
}
