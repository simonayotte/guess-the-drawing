import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollPos: BehaviorSubject<[number, number]>;
  constructor() {
    this.scrollPos = new BehaviorSubject([0, 0]);
  }
  updateOffSet(offSetX: number, offSetY: number): void {
    this.scrollPos.next([offSetX, offSetY]);
  }
}
