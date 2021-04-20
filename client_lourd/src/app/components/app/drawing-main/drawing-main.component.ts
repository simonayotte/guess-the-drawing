import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/Dialog/dialog.service';
import { ScrollService } from 'src/app/services/scroll-Service/scroll.service';

@Component({
  selector: 'app-drawing-main',
  templateUrl: './drawing-main.component.html',
  styleUrls: ['./drawing-main.component.scss']
})
export class DrawingMainComponent {
  @Input() disabled: boolean = false;

  constructor(public dialogService: DialogService, private scrollingService: ScrollService, private router: Router ) {
  }


  onScroll(event: Event): void {
    this.scrollingService.scrollPos.next([(event.target as HTMLDivElement).scrollLeft, (event.target as HTMLDivElement).scrollTop]);
  }

  returnToMenu(): void {
    this.router.navigate(['/menu']);
  }
}
