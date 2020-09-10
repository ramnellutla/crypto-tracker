import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalMetricsTable } from 'src/model/global-metrics-table';
import { CoinMarketCapService } from 'src/services/coin-market-cap.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.less'],
})
export class PredictionComponent implements OnInit {
  globalMetricsObseravble: Observable<GlobalMetricsTable[]>;
  globalMetricsSubscription: Subscription;
  globalMetricsError = false;
  globalMetricsErrorSubscription: Subscription;
  globalMetricsErrorSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private coinMarketCapService: CoinMarketCapService) {}
  dataSource = new MatTableDataSource<GlobalMetricsTable>();
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
    this.globalMetricsObseravble = this.coinMarketCapService.getGlobalMetricsObservable();
    this.globalMetricsSubscription = this.globalMetricsObseravble.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );

    this.coinMarketCapService.getGlobalMetrics('USD');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
