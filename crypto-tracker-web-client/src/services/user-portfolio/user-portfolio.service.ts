import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { PortfolioTable } from 'src/model/portfolio-table';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserPortfolioService {
  portfolioTableSubject: Subject<PortfolioTable[]> = new Subject<
    PortfolioTable[]
  >();
  userPortfolioUrl = '/api/getPortfolio';

  constructor(private http: HttpClient) {}

  getUserPortfolioObservable(): Observable<PortfolioTable[]> {
    return this.portfolioTableSubject.asObservable();
  }

  getUserPortFolio(userID: string, convert: string): void {
    const httpParamas = new HttpParams()
      .set('convert', convert)
      .set('userID', userID);

    const httpHeaders = new HttpHeaders().set(
      'bearerToken',
      localStorage.getItem('bearerToken')
    );

    const httpOptions = {
      params: httpParamas,
      headers: httpHeaders,
    };

    this.http
      .get(this.userPortfolioUrl, httpOptions)
      .subscribe((portfolioTable: PortfolioTable[]) => {
        this.portfolioTableSubject.next(portfolioTable);
      });
  }
}
