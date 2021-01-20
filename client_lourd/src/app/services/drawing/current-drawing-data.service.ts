import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentDrawingDataService {
  stackPath: SVGPathElement [] = [];
  addPathToDrawing(newPath: SVGPathElement): void {
    this.stackPath.push(newPath);
  }
  drawingIsEmpty(): boolean {
    return this.stackPath.length === 0;
  }
  clearStack(): void {
    this.stackPath = [];
  }
}
