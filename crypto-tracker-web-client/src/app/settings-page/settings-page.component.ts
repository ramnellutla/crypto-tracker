import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { Asset } from 'src/model/asset';
import { Settings } from 'src/model/setings';
import { DialogService } from 'src/services/dialog/dialog.service';
import {
  NavigationStatusService,
  TabName,
} from 'src/services/navigation-status/navigation-status.service';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.less'],
})
export class SettingsPageComponent implements OnInit {
  settingsTextPlaceholder = `Enter the crypto in the following json format: \n {\n\t "Symbol1": Amount, \n\t "Symbol2": Amount\n\t.\n\t.\n\t.\n\t.\n}`;
  settingsText: string;
  newAsset: Asset = new Asset();
  currentSettings: Settings = new Settings();
  dataSource = new MatTableDataSource<Asset>();
  displayedColumns = ['symbol', 'amountOwned'];
  userLoggedIn: boolean;

  userLoginObservable: Observable<number>;
  userLoginSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private navigationStatusService: NavigationStatusService,
    private userService: UserService,
    private dialogService: DialogService
  ) {
    this.navigationStatusService.currentActiveTab = TabName.none.toString();
  }

  ngOnInit(): void {
    this.userLoginObservable = this.userService.getUserLoginObservable();

    this.userLoginSubscription = this.userLoginObservable.subscribe(
      (status) => {
        this.userLoggedIn = status === 200;
        if (this.userLoggedIn) {
          this.consumeUserSettings();
          return;
        }
        this.dataSource.data = [];
      }
    );

    if (!this.userService.isLoggedIn()) {
      return;
    }
    this.userLoggedIn = true;
    this.consumeUserSettings();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  consumeUserSettings(): void {
    this.currentSettings = this.userService.user.settings;
    this.dataSource.data = this.currentSettings.assets;
  }

  login(): void {
    this.dialogService.displayLoginDialog();
  }

  submitSettings(): void {
    this.userService.submitUserSettings(this.currentSettings);
  }

  addNewAsset(): void {
    this.currentSettings.assets.push({
      symbol: this.newAsset.symbol,
      amountOwned: this.newAsset.amountOwned,
    });
    this.dataSource.data = this.currentSettings.assets;
    this.newAsset = new Asset();
  }
}
