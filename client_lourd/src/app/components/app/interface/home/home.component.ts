import { Component, HostListener } from '@angular/core';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DialogService } from '../../../../services/Dialog/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  counter: number;

  constructor(public dialogService: DialogService, private continueDrawingService: ContinueDrawingService) {
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

  @HostListener('document:keydown.control.g', ['$event']) onCtrlG(event: KeyboardEvent): void {
    event.preventDefault();
    this.openGallerie();
  }
}
