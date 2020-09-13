import { Injectable } from '@angular/core';

export enum TabName {
  portfolio = 'Portfolio',
  ranking = 'Ranking',
  predictions = 'Predictions',
}

@Injectable({
  providedIn: 'root',
})
export class NavigationStatusService {
  currentActiveTab: string = TabName.portfolio.toString();

  constructor() {}
}
