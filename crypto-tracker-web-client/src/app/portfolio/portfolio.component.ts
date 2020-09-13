import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoinMarketCapService } from 'src/services/coin-market-cap/coin-market-cap.service';
import { GetListingOptions } from 'src/model/get-listing-options';
import { UserPortfolioService } from 'src/services/user-portfolio/user-portfolio.service';
import { PortfolioTable } from 'src/model/portfolio-table';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less'],
})
export class PortfolioComponent implements OnInit {
  userPortfolioObservable: any;
  userPortfolioSubscription: any;
  constructor(
    private coinMarketCapService: CoinMarketCapService,
    private userPortfolioService: UserPortfolioService
  ) {}

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

    this.userPortfolioService.getUserPortFolio('user1', 'USD');
  }
}
