import { gameModes } from './../../../../models/lobby/gameModes';
import { UserInfoService } from './../../../../services/data/user-info.service';
import { UserIdentity } from './../../../../models/profile/user-identity';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile/user-profile.service';
import { UserStatistics } from 'src/app/models/profile/statistics';
import { UserLoginHistory } from 'src/app/models/profile/login-history';
import { UserGameHistory } from 'src/app/models/profile/game-history';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  public userGameHistoryList : Array<UserGameHistory>
  public userLoginHistoryList : Array<UserLoginHistory>
  public userStatistics : UserStatistics
  public userIdentity : UserIdentity
  public gameModes = gameModes

  constructor(public userProfileService : UserProfileService, public userInfoService : UserInfoService) {
    this.userProfileService.userGameHistoryList.subscribe((userGameHistoryList: Array<UserGameHistory>) => {
      this.userGameHistoryList = userGameHistoryList
    })

    this.userProfileService.userLoginHistoryList.subscribe((userLoginHistoryList : Array<UserLoginHistory>) => {
      this.userLoginHistoryList = userLoginHistoryList 
    })

    this.userProfileService.userStatistics.subscribe((userStatistics: UserStatistics) => {
      this.userStatistics = userStatistics
    }) 

    this.userProfileService.userIdentity.subscribe((userIdentity: UserIdentity) => {
      this.userIdentity = userIdentity
    })
  }

  ngOnInit(): void {

  }

  async ngAfterViewInit() : Promise<void> {
    await this.userProfileService.getUserIdentity();
    await this.userProfileService.getStats();
    await this.userProfileService.getLoginHistory();
    await this.userProfileService.getGameHistory();
  }

  getDateString(text : string) : string {
    text = text.replace('Z', '');
    text = text.replace('T', ' ');
    text = text.substring(0, text.length -4);
    return text;
  }


}
