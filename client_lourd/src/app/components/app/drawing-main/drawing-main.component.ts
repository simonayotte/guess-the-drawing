import { Component, HostListener} from '@angular/core';
import { ScrollService } from 'src/app/services/scroll-Service/scroll.service';
import { DialogDismissService } from '../../../services/Dialog/dialog-dismiss.service';
import { DialogService } from '../../../services/Dialog/dialog.service';

@Component({
  selector: 'app-drawing-main',
  templateUrl: './drawing-main.component.html',
  styleUrls: ['./drawing-main.component.scss']
})
export class DrawingMainComponent {

  constructor(public dialogService: DialogService, private scrollingService: ScrollService,
              private dialogDismissService: DialogDismissService ) {
  }

  @HostListener('window:keydown.control.o', ['$event']) onCtrlO(event: KeyboardEvent): void {
    event.preventDefault();
    this.dialogDismissService.dialogToOpenNext.next('NewDrawing');
    this.dialogService.openNewDrawingDialogs();
  }

  @HostListener('document:keydown.control.g', ['$event']) onCtrlG(event: KeyboardEvent): void {
    event.preventDefault();
    this.dialogDismissService.dialogToOpenNext.next('Gallerie');
    this.dialogService.openGallerie();
  }
  onScroll(event: Event): void {
    this.scrollingService.scrollPos.next([(event.target as HTMLDivElement).scrollLeft, (event.target as HTMLDivElement).scrollTop]);
  }
}
