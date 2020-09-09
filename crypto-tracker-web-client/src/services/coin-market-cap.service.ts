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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  private cryptoRankingList: CryptoListing;
  cryptoRankingListSubject: Subject<ListingTable[]> = new Subject<
    ListingTable[]
  >();

  constructor(private http: HttpClient) {}

  getCryptoRankListObservable(): Observable<any[]> {
    return this.cryptoRankingListSubject.asObservable();
  }

  getCryptoList(getListingOption: GetListingOptions): void {
    const crytptoUrl = '/api/getlistings';

    let httpParams = new HttpParams();

    Object.keys(getListingOption).forEach((key) => {
      httpParams = httpParams.set(key, getListingOption[key]);
    });

    const httpOptions = {
      params: httpParams,
    };

    this.http
      .get(crytptoUrl, httpOptions)
      .pipe()
      .subscribe(
        (listings: CryptoListing) => {
          console.log('Data obtained', listings);
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
}
