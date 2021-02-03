import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DialogService } from '../../../../services/Dialog/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public hide: boolean = true;
  public isLoggingIn: boolean = true;
  public loginText: string = "Se connecter";
  public loginOption: string = "S'inscrire";
  counter: number;

  constructor(public dialogService: DialogService, private continueDrawingService: ContinueDrawingService, private router: Router) {
    this.counter = 0;
  }

  @HostListener('window:keydown.control.o', ['$event']) onCtrlO(event: KeyboardEvent): void {
    event.preventDefault();
    this.openNewDrawingDialogs();
  }

  openNewDrawingDialogs(): void {
    this.dialogService.openNewDrawingDialogs();
  }

  openUserGuideDialog(): void {
    this.dialogService.openUserGuideDialog();
  }
  openGallerie(): void {
    this.dialogService.openGallerie();
  }

  isDrawingInLocalStorage(): boolean {
    return this.continueDrawingService.isDrawingInLocalStorage();
  }

  continueDrawing(): void {
    this.continueDrawingService.open();
  }

  public toggleDisplay() {
    this.isLoggingIn ? this.loginText = "S'inscrire" : this.loginText = "Se connecter";
    this.isLoggingIn ? this.loginOption = "Se connecter" : this.loginOption = "S'inscrire";
    this.isLoggingIn = !this.isLoggingIn;
  }

  public login(username: string, password: string): void {
    this.router.navigate(['/draw']);
  }

  public signup(username: string, email:string, password: string): void {
    
  }

  @HostListener('document:keydown.control.g', ['$event']) onCtrlG(event: KeyboardEvent): void {
    event.preventDefault();
    this.openGallerie();
  }
}
