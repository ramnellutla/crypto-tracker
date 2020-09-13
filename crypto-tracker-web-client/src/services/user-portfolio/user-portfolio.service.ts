import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PortfolioTable } from 'src/model/portfolio-table';
import { HttpParams, HttpClient } from '@angular/common/http';

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

    const httpOptions = {
      params: httpParamas,
    };

    this.http
      .get(this.userPortfolioUrl, httpOptions)
      .subscribe((portfolioTable: PortfolioTable[]) => {
        this.portfolioTableSubject.next(portfolioTable);
      });
  }
}
