import { Component } from '@angular/core';
import { ScrollService } from 'src/app/services/scroll-Service/scroll.service';
import { DialogService } from '../../../services/Dialog/dialog.service';

@Component({
  selector: 'app-drawing-main',
  templateUrl: './drawing-main.component.html',
  styleUrls: ['./drawing-main.component.scss']
})
export class DrawingMainComponent {

  constructor(public dialogService: DialogService, private scrollingService: ScrollService ) {
  }


  onScroll(event: Event): void {
    this.scrollingService.scrollPos.next([(event.target as HTMLDivElement).scrollLeft, (event.target as HTMLDivElement).scrollTop]);
  }
}
