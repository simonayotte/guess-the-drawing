import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserGuideService } from 'src/app/services/user-guide/user-guide.service';

@Component({
  selector: 'user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent {

  constructor(public userGuideService: UserGuideService, public dialog: MatDialog) {}

  getDescriptionTitle(): string {
    return this.userGuideService.getDescriptionTitle();
  }

  getDescriptionParagraphs(): string[] {
    return this.userGuideService.getDescriptionParagraphs();
  }

  previousDescription(): void {
    this.userGuideService.previous();
  }

  nextDescription(): void {
    this.userGuideService.next();
  }

  isFirstDescription(): boolean {
    return this.userGuideService.isFirstDescription();
  }

  isLastDescription(): boolean {
    return this.userGuideService.isLastDescription();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
