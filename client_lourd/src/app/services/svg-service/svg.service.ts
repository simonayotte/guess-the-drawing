import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SvgService {
  svgSubject: BehaviorSubject<SVGElement>;

  constructor() {
    this.svgSubject = new BehaviorSubject<SVGElement>(undefined as unknown as SVGElement);
  }
}
