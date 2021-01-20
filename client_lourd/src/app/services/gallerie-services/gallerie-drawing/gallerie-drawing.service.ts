import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GallerieDrawingService {

  svgStringBS: BehaviorSubject<string>;

  constructor() {
    this.svgStringBS = new BehaviorSubject<string>('');
   }

  setValuesWithSvgString(svgString: string): void {
    this.svgStringBS.next(svgString);
  }
}
