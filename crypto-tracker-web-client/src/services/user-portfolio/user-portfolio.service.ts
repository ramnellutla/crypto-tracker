import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { PortfolioTable } from 'src/model/portfolio-table';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { CryptoListing, Datum } from 'src/model/crypto-listing';

@Injectable({
  providedIn: 'root',
})
export class UserPortfolioService {
  portfolioTableSubject: Subject<PortfolioTable[]> = new Subject<
    PortfolioTable[]
  >();
  userPortfolioUrl = '/api/getPortfolio';

  constructor(private http: HttpClient, private userService: UserService) {}

  getUserPortfolioObservable(): Observable<PortfolioTable[]> {
    return this.portfolioTableSubject.asObservable();
  }

  getUserPortFolio(): void {
    const userAssets = this.userService.user.settings.assets.map(
      (a) => a.symbol
    );

    if (!userAssets || userAssets.length < 0) {
      return;
    }

    const httpParamas = new HttpParams()
      .set('convert', this.userService.user.settings.currency)
      .set('symbol', userAssets.join(','));

    const httpHeaders = new HttpHeaders().set(
      'bearerToken',
      localStorage.getItem('bearerToken')
    );

    const httpOptions = {
      params: httpParamas,
      headers: httpHeaders,
    };

    this.http.get(this.userPortfolioUrl, httpOptions).subscribe(
      (listings: CryptoListing) => {
        const listingsTable = [];
        Object.keys(listings.data).forEach((item) =>
          listingsTable.push(this.adaptCryptoListingModel(item, listings.data))
        );

        this.portfolioTableSubject.next(listingsTable);
      },
      (error) => {
        console.error('Error occured', error);
      }
    );
  }

  adaptCryptoListingModel(key: string, quote: any): PortfolioTable {
    const data = quote[key];
    const listing = new PortfolioTable();
    listing.asset = data.name;
    listing.symbol = data.symbol;
    listing.amountOwned = this.userService.getAssetAmount(key);
    listing.price = Math.round(data.quote.USD.price * 100) / 100;
    listing.value = Math.round(listing.price * listing.amountOwned * 100) / 100;
    listing.percentChange1h =
      Math.round(data.quote.USD.percent_change_1h * 100) / 100;
    listing.percentChange24h =
      Math.round(data.quote.USD.percent_change_24h * 100) / 100;
    listing.percentchange7d =
      Math.round(data.quote.USD.percent_change_7d * 100) / 100;

    return listing;
  }
}
