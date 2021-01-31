import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDismissService } from '../../../../services/Dialog/dialog-dismiss.service';

@Component({
  selector: 'app-dialog-dismiss-drawing',
  templateUrl: './dialog-dismiss-drawing.component.html',
  styleUrls: ['./dialog-dismiss-drawing.component.scss']
})
export class DialogDismissDrawingComponent {
  constructor(public dialogDismissService: DialogDismissService, public dialog: MatDialog) {}

  dismissDecision(decision: boolean): void {
    this.dialogDismissService.dismissDecision(decision);
  }
}
