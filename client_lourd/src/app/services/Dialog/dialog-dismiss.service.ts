import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogDismissService {
  dismissChanges: BehaviorSubject<boolean>;
  dialogToOpenNext: BehaviorSubject<string>;

  constructor() {
    this.dismissChanges = new BehaviorSubject<boolean>(false);
    this.dialogToOpenNext = new BehaviorSubject<string>('');
   }

  dismissDecision(decision: boolean): void {
    this.dismissChanges.next(decision);
  }
}
