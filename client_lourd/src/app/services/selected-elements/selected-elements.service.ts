import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedElementsService {

  selectedElements: BehaviorSubject<SVGPathElement[]>;
  constructor() {
    this.selectedElements = new BehaviorSubject([]);
  }

  updateSelectedElements(selectedElements: SVGPathElement[]): void {
    this.selectedElements.next(selectedElements);
  }
}
