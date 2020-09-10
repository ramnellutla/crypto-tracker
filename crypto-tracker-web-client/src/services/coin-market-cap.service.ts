import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';
import { CryptoListing, Datum } from 'src/model/crypto-listing';
import { GetListingOptions } from 'src/model/get-listing-options';
import { ListingTable } from 'src/model/listing-table';
import { GlobalMetrics } from 'src/model/global-metrics';
import { GlobalMetricsTable } from 'src/model/global-metrics-table';

@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  cryptoRankingListSubject: Subject<ListingTable[]> = new Subject<
    ListingTable[]
  >();

  globalMetricsSubject: Subject<GlobalMetricsTable[]> = new Subject<
    GlobalMetricsTable[]
  >();

  constructor(private http: HttpClient) {}

  getCryptoListingsObservable(): Observable<ListingTable[]> {
    return this.cryptoRankingListSubject.asObservable();
  }

  getCryptoList(getListingOption: GetListingOptions): void {
    const cryptoListingsUrl = '/api/getListings';

    let httpParams = new HttpParams();

    Object.keys(getListingOption).forEach((key) => {
      httpParams = httpParams.set(key, getListingOption[key]);
    });

    const httpOptions = {
      params: httpParams,
    };

    this.http
      .get(cryptoListingsUrl, httpOptions)
      .pipe()
      .subscribe(
        (listings: CryptoListing) => {
          const ret = [];
          listings.data.forEach((item) =>
            ret.push(this.adaptCryptoListingModel(item))
          );

          this.cryptoRankingListSubject.next(ret);
        },
        (error) => {
          console.log('Error occured', error);
        }
      );
  }

  adaptCryptoListingModel(data: Datum): ListingTable {
    const listing = new ListingTable();
    listing.rank = data.cmc_rank;
    listing.asset = data.name;
    listing.symbol = data.symbol;
    listing.price = data.quote.USD.price;
    listing.marketCap = data.quote.USD.market_cap;
    listing.volume24h = data.quote.USD.volume_24h;
    listing.percentChange1h =
      Math.round(data.quote.USD.percent_change_1h * 100) / 100;
    listing.percentChange24h =
      Math.round(data.quote.USD.percent_change_24h * 100) / 100;
    listing.percentchange7d =
      Math.round(data.quote.USD.percent_change_7d * 100) / 100;

    return listing;
  }

  getGlobalMetricsObservable(): Observable<GlobalMetricsTable[]> {
    return this.globalMetricsSubject.asObservable();
  }

  getGlobalMetrics(convert: string): void {
    const globalMetricsUrl = '/api/getGlobalMetrics';
    const httpParams = new HttpParams().set('convert', convert);
    const httpOptions = {
      params: httpParams,
    };
    this.http
      .get(globalMetricsUrl, httpOptions)
      .pipe()
      .subscribe(
        (metrics: GlobalMetrics) => {
          const globalMetricsTableData = this.adaptGlobalMetricsModel(metrics);
          this.globalMetricsSubject.next(globalMetricsTableData);
        },
        (error) => {
          console.log('Error occured', error);
        }
      );
  }
  adaptGlobalMetricsModel(metrics: GlobalMetrics): GlobalMetricsTable[] {
    const metricTable: GlobalMetricsTable[] = [];
    return metricTable;
  }
}
