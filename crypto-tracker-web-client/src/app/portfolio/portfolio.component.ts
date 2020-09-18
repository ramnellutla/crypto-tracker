import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoinMarketCapService } from 'src/services/coin-market-cap/coin-market-cap.service';
import { GetListingOptions } from 'src/model/get-listing-options';
import { UserPortfolioService } from 'src/services/user-portfolio/user-portfolio.service';
import { PortfolioTable } from 'src/model/portfolio-table';
import {
  TabName,
  NavigationStatusService,
} from 'src/services/navigation-status/navigation-status.service';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginPageComponent } from '../login-page/login-page.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less'],
})
export class PortfolioComponent implements OnInit {
  userPortfolioObservable: Observable<PortfolioTable[]>;
  userPortfolioSubscription: Subscription;
  userLoginObservable: Observable<boolean>;
  userLoginSubscription: Subscription;
  userLoggedIn: boolean;

  constructor(
    private userPortfolioService: UserPortfolioService,
    private navigationStatusService: NavigationStatusService,
    private userService: UserService
  ) {
    this.navigationStatusService.currentActiveTab = TabName.portfolio.toString();
  }

  dataSource = new MatTableDataSource<PortfolioTable>();
  displayedColumns = [
    'asset',
    'symbol',
    'amountOwned',
    'value',
    'price',
    'percentChange1h',
    'percentChange24h',
    'percentchange7d',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.userPortfolioObservable = this.userPortfolioService.getUserPortfolioObservable();

    this.userPortfolioSubscription = this.userPortfolioObservable.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );

    this.userLoginObservable = this.userService.getUserLoginObservable();

    this.userLoginSubscription = this.userLoginObservable.subscribe((data) => {
      this.userLoggedIn = data;
      if (this.userLoggedIn) {
        this.userPortfolioService.getUserPortFolio('user1', 'USD');
      }
    });

    if (this.userService.isLoggedIn()) {
      this.userLoggedIn = true;
      this.userPortfolioService.getUserPortFolio('user1', 'USD');
    }
  }

  login(): void {
    this.userService.displayLoginDialog();
  }
}
