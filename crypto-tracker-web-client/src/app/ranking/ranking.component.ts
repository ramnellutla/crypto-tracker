import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { CoinMarketCapService } from 'src/services/coin-market-cap/coin-market-cap.service';
import { GetListingOptions } from 'src/model/get-listing-options';
import { ListingTable } from 'src/model/listing-table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import {
  NavigationStatusService,
  TabName,
} from 'src/services/navigation-status/navigation-status.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.less'],
})
export class RankingComponent implements OnInit, AfterViewInit {
  // List of users
  cryptoRankList: any[] = [];
  cryptoRankListObservable: Observable<ListingTable[]>;
  cryptoRankListSubscription: Subscription;
  cryptoRankListError = false;
  cryptoRankListErrorSubscription: Subscription;
  cryptoRankListErrorSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private coinMarketCapService: CoinMarketCapService,
    private navigationStatusService: NavigationStatusService
  ) {
    this.navigationStatusService.currentActiveTab = TabName.ranking.toString();
  }
  dataSource = new MatTableDataSource<ListingTable>();
  displayedColumns = [
    'rank',
    'asset',
    'symbol',
    'price',
    'market_cap',
    'volume',
    '1h',
    '24h',
    '7d',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.cryptoRankListObservable = this.coinMarketCapService.getCryptoListingsObservable();

    this.cryptoRankListSubscription = this.cryptoRankListObservable.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );
    this.coinMarketCapService.getCryptoList(new GetListingOptions());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
