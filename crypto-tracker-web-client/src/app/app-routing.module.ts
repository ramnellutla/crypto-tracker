import { NgModule } from '@angular/core';

import { PortfolioComponent } from './portfolio/portfolio.component';
import { RankingComponent } from './ranking/ranking.component';
import { PredictionComponent } from './prediction/prediction.component';

import { RouterModule, Routes } from '@angular/router';
import { SignupPageComponent } from './signup-page/signup-page.component';

const routes: Routes = [
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'prediction', component: PredictionComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: '', redirectTo: '/ranking', pathMatch: 'full' },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
