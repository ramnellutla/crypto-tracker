import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalMetricsTable } from 'src/model/global-metrics-table';
import { CoinMarketCapService } from 'src/services/coin-market-cap.service';
import { Observable, Subscription, Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import CurrencyValues from 'src/content/currencyValues.json';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.less'],
})
export class PredictionComponent implements OnInit {
  globalMetricsTableObseravble: Observable<GlobalMetricsTable[]>;
  globalMetricsTableSubscription: Subscription;
  globalMetricsError = false;
  globalMetricsErrorSubscription: Subscription;
  globalMetricsErrorSubject: Subject<boolean> = new Subject<boolean>();
  currencyValues: any;

  constructor(private coinMarketCapService: CoinMarketCapService) {
    this.currencyValues = CurrencyValues;
  }
  dataSource = new MatTableDataSource<GlobalMetricsTable>();
  displayedColumns = [
    'asset',
    'symbol',
    'percentageOfGlobalCap',
    'current',
    'tangibleCurrency',
    /*     'worldsBillionaires',
     */ 'gold',
    'stocks',
    'narrowMoney',
    'broadMoney',
    'realEstate',
    'wealth',
    'derivatives',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.globalMetricsTableObseravble = this.coinMarketCapService.getGlobalMetricsTableObservable();
    this.globalMetricsTableSubscription = this.globalMetricsTableObseravble.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );
    this.coinMarketCapService.getGlobalMetricsTableData('USD');
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
