import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavigationComponent } from './navigation/navigation.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { RankingComponent } from './ranking/ranking.component';
import { PredictionComponent } from './prediction/prediction.component';

import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderInfoComponent } from './header-info/header-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PortfolioComponent,
    RankingComponent,
    PredictionComponent,
    HeaderInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatRippleModule,
    MatPaginatorModule,
    MatTableModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
