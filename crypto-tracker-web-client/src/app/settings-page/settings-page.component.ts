import { Component, OnInit } from '@angular/core';
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
  settingsTextPlaceholder = `Enter the crypto in the following json format: \n {\n\t "Ticker1": Amount, \n\t "Ticker2": Amount\n\t.\n\t.\n\t.\n\t.\n}`;
  settingsText: string;
  constructor(
    private navigationStatusService: NavigationStatusService,
    private userService: UserService
  ) {
    this.navigationStatusService.currentActiveTab = TabName.none.toString();
  }

  ngOnInit(): void {}

  submitSettings(): void {
    this.userService.submitUserSettings(this.settingsText);
  }
}
