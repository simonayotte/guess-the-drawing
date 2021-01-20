import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContinueDrawingService } from '../continue-drawing/continue-drawing.service';

@Injectable({
  providedIn: 'root'
})
export class DialogDismissService {
  dismissChanges: BehaviorSubject<boolean>;
  dialogToOpenNext: BehaviorSubject<string>;

  constructor(private continueDrawingService: ContinueDrawingService) {
    this.dismissChanges = new BehaviorSubject<boolean>(false);
    this.dialogToOpenNext = new BehaviorSubject<string>('');
   }

  dismissDecision(decision: boolean): void {
    if (decision) {
      this.continueDrawingService.clear();
      this.continueDrawingService.open();
    }
    this.dismissChanges.next(decision);
  }
}
