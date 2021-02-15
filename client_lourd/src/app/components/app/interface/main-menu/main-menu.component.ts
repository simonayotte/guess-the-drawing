import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login/login.service';
import { BasicDialogComponent } from '../basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {

  constructor(private loginService: LoginService, private dialog: MatDialog) { }

  public async SignOutClick(): Promise<void> {
    await this.loginService.signOut().catch(err =>
      this.dialog.open(BasicDialogComponent, { data: {err}}));
  }
}
