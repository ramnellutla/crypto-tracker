import { NgModule } from '@angular/core';

import { PortfolioComponent } from './portfolio/portfolio.component';
import { RankingComponent } from './ranking/ranking.component';
import { PredictionComponent } from './prediction/prediction.component';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'prediction', component: PredictionComponent },
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
