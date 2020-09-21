import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Asset } from 'src/model/asset';
import { Settings } from 'src/model/setings';
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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private navigationStatusService: NavigationStatusService,
    private userService: UserService
  ) {
    this.navigationStatusService.currentActiveTab = TabName.none.toString();
  }

  ngOnInit(): void {
    this.dataSource.data = this.currentSettings.assets;
    setTimeout(() => (this.dataSource.paginator = this.paginator));
  }

  submitSettings(): void {
    this.userService.submitUserSettings(this.currentSettings).subscribe(
      (data) => {},
      (error) => {}
    );
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
