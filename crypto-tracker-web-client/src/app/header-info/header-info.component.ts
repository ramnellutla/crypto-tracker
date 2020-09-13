import { Component, OnInit } from '@angular/core';
import { CoinMarketCapService } from 'src/services/coin-market-cap/coin-market-cap.service';
import { Observable, Subscription } from 'rxjs';
import { GlobalMetrics } from 'src/model/global-metrics';

@Component({
  selector: 'app-header-info',
  templateUrl: './header-info.component.html',
  styleUrls: ['./header-info.component.less'],
})
export class HeaderInfoComponent implements OnInit {
  globalMetricsObseravble: Observable<GlobalMetrics>;
  globalMetricsSubscription: Subscription;
  constructor(private coinMarketCapService: CoinMarketCapService) {}
  cryptoCurrencies: number;
  activeExchanges: number;
  markets: number;
  marketCap: number;

  ngOnInit(): void {
    this.globalMetricsObseravble = this.coinMarketCapService.getGlobalMetricsObservable();
    this.globalMetricsSubscription = this.globalMetricsObseravble.subscribe(
      (data) => {
        this.cryptoCurrencies = data.data.active_cryptocurrencies;
        this.activeExchanges = data.data.active_exchanges;
        this.marketCap = data.data.quote.USD.total_market_cap;
      }
    );
    this.coinMarketCapService.getGlobalMetricsData('USD');
  }
}
