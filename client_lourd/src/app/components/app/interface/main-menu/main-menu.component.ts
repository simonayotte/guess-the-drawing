import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  constructor(private loginService: LoginService) { }

  public async SignOutClick(): Promise<void> {
    await this.loginService.signOut();
  }
}
