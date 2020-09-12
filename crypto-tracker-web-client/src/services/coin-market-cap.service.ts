import { Injectable } from '@angular/core';
import { Observable, of, Subject, forkJoin } from 'rxjs';
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
import CurrencyValues from 'src/content/currencyValues.json';

@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  cryptoRankingListTableSubject: Subject<ListingTable[]> = new Subject<
    ListingTable[]
  >();

  globalMetricsTableSubject: Subject<GlobalMetricsTable[]> = new Subject<
    GlobalMetricsTable[]
  >();

  globalMetricsSubject: Subject<GlobalMetrics> = new Subject<GlobalMetrics>();

  globalMetricsUrl = '/api/getGlobalMetrics';
  cryptoListingsUrl = '/api/getListings';
  getListingOption = new GetListingOptions();

  constructor(private http: HttpClient) {}

  getCryptoListingsObservable(): Observable<ListingTable[]> {
    return this.cryptoRankingListTableSubject.asObservable();
  }

  getCryptoList(getListingOption: GetListingOptions): void {
    let httpParams = new HttpParams();

    Object.keys(getListingOption).forEach((key) => {
      httpParams = httpParams.set(key, getListingOption[key]);
    });

    const httpOptions = {
      params: httpParams,
    };

    this.http
      .get(this.cryptoListingsUrl, httpOptions)
      .pipe()
      .subscribe(
        (listings: CryptoListing) => {
          const listingsTable = [];
          listings.data.forEach((item) =>
            listingsTable.push(this.adaptCryptoListingModel(item))
          );

          this.cryptoRankingListTableSubject.next(listingsTable);
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

  getGlobalMetricsTableObservable(): Observable<GlobalMetricsTable[]> {
    return this.globalMetricsTableSubject.asObservable();
  }

  getGlobalMetricsTableData(convert: string): void {
    let httpParams = new HttpParams();
    Object.keys(this.getListingOption).forEach((key) => {
      httpParams = httpParams.set(key, this.getListingOption[key]);
    });
    let httpOptions = {
      params: httpParams,
    };
    let cryptoListings = this.http.get(this.cryptoListingsUrl, httpOptions);

    httpParams = new HttpParams().set('convert', convert);
    httpOptions = {
      params: httpParams,
    };
    const globalMetrics = this.http.get(this.globalMetricsUrl, httpOptions);

    forkJoin([cryptoListings, globalMetrics]).subscribe(
      (results) => {
        const globalMetricsTable = [];
        const listings = results[0] as CryptoListing;
        const globalMetrics = results[1] as GlobalMetrics;

        listings.data.forEach((item) =>
          globalMetricsTable.push(
            this.adaptGlobalMetricsModel(
              item,
              globalMetrics.data.quote.USD.total_market_cap
            )
          )
        );
        this.globalMetricsTableSubject.next(globalMetricsTable);
      },
      (error) => {
        console.log('Error occured', error);
      }
    );
  }

  adaptGlobalMetricsModel(
    data: Datum,
    totalMarketCap: number
  ): GlobalMetricsTable {
    const globalMetricsTable = new GlobalMetricsTable();
    const availableSupply = data.total_supply;

    globalMetricsTable.asset = data.name;
    globalMetricsTable.symbol = data.symbol;
    globalMetricsTable.percentageOfGlobalCap =
      Math.round((data.quote.USD.market_cap / totalMarketCap) * 10000) / 100;
    globalMetricsTable.current = Math.round(data.quote.USD.price * 100) / 100;
    globalMetricsTable.tangibleCurrency =
      Math.round(
        ((CurrencyValues.tangibleCurrency.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.worldsBillionaires =
      Math.round(
        ((CurrencyValues.billionaires.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.gold =
      Math.round(
        ((CurrencyValues.gold.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.stocks =
      Math.round(
        ((CurrencyValues.stocks.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.narrowMoney =
      Math.round(
        ((CurrencyValues.narrowMoney.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.broadMoney =
      Math.round(
        ((CurrencyValues.broadMoney.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.realEstate =
      Math.round(
        ((CurrencyValues.realEstate.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.wealth =
      Math.round(
        ((CurrencyValues.wealth.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    globalMetricsTable.derivatives =
      Math.round(
        ((CurrencyValues.derivatives.currentValue *
          globalMetricsTable.percentageOfGlobalCap) /
          availableSupply) *
          100
      ) / 100;
    return globalMetricsTable;
  }

  getGlobalMetricsObservable(): Observable<GlobalMetrics> {
    return this.globalMetricsSubject.asObservable();
  }

  getGlobalMetricsData(convert: string): void {
    const httpParams = new HttpParams().set('convert', convert);
    const httpOptions = {
      params: httpParams,
    };

    this.http
      .get(this.globalMetricsUrl, httpOptions)
      .subscribe((data: GlobalMetrics) => {
        this.globalMetricsSubject.next(data);
      });
  }
}
