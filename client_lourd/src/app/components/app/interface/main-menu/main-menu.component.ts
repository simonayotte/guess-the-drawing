import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';

const LEADERBORAD = 'leaderboard';
const PAIR_MOT_IMAGE = 'pairMotImage';
const PROFILE = 'profile';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  showLeaderboard = false;
  showPairMotImage = false;
  showLobby = true;
  showBackArrow = false;
  showComponentButton = true;
  showProfile = false;


  constructor(private loginService: LoginService, private router: Router) { }

  public async SignOutClick(): Promise<void> {
    await this.loginService.signOut();
  }

  public startGame(): void {
    this.router.navigate(['/draw']);
  }

  // montre component voulu
  public changeComponent(component: string){
    switch(component) {
      case LEADERBORAD: {
        this.showLeaderboard = true;
        break;
      }
      case PAIR_MOT_IMAGE: {
        this.showPairMotImage = true;
        break;
      }
      case PROFILE: {
        this.showProfile = true;
        break;
      }
   }
   this.showLobby = false;
   this.showComponentButton = false;
   this.showBackArrow = true;
  }

  // revient aux component inital
  public resetCompenentView(){
    this.showLeaderboard = false;
    this.showPairMotImage = false;
    this.showProfile = false;
    this.showLobby = true;
    this.showBackArrow = false;
    this.showComponentButton = true;
  }

  public openGuide(): void {
    this.router.navigate(['/guide']);
  }

}
