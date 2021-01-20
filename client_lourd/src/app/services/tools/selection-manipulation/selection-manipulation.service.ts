import { Injectable, Renderer2 } from '@angular/core';
import { ScrollService } from '../../scroll-Service/scroll.service';

const TOOLBAR_OFFSET = 120;
const X = 0;
const Y = 1;

@Injectable({
  providedIn: 'root'
})
export class SelectionManipulationService {

  private scrollingOffset: [number, number];
  private renderer: Renderer2;
  private selectionBoxCallBack: () => void;

  constructor(private scrollService: ScrollService) {
    this.scrollService.scrollPos.subscribe( (offset: [number, number]) => {
      this.scrollingOffset = offset;
    });
  }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }

  updateRotation(element: SVGPathElement): void {
    let transformString = element.getAttribute('transform');
    let rotationAngle = element.getAttribute('rotationAngle');
    rotationAngle = rotationAngle ? rotationAngle : '0';
    transformString = transformString ? transformString : '';
    transformString = this.deleteLastRotate(transformString);
    this.renderer.setAttribute(element, 'transform', transformString);
    const position =  this.getCenterPositionOfElement(element);
    const rotationString = 'rotate (' + rotationAngle + ',' + position[X] + ',' + position[Y] + ') ';
    this.renderer.setAttribute(element, 'transform', rotationString + transformString);
    this.selectionBoxCallBack();
  }

  deleteLastRotate(transformString: string): string {
    const index = transformString.lastIndexOf('rotate');
    if (index >= 0) {
      transformString = transformString.substring(transformString.indexOf(') ') + 2, transformString.length);
    }
    return transformString;
  }

  initalizeSelectionBoxCallBack(callback: () => void): void {
    this.selectionBoxCallBack = callback;
  }

  getCenterPositionOfElement(element: SVGPathElement): [number, number] {
    const bbox = element.getBoundingClientRect();
    return [(bbox.left + bbox.right) / 2  - TOOLBAR_OFFSET  + this.scrollingOffset[X],
            (bbox.top + bbox.bottom) / 2  + this.scrollingOffset[Y]];
  }

  getCenterPositionOfAllElements(selectedElements: SVGPathElement[]): [number, number] {
    const bbox = selectedElements[0].getBoundingClientRect();
    let left = bbox.left;
    let right = bbox.right;
    let top = bbox.top;
    let bottom = bbox.bottom;
    for (const element of selectedElements) {
      const boundingBox: ClientRect = element.getBoundingClientRect();
      left = this.smallestValue(left, boundingBox.left);
      top = this.smallestValue(top, boundingBox.top);
      right = this.biggestValue(right, boundingBox.right);
      bottom = this.biggestValue(bottom, boundingBox.bottom);
    }
    return [(left + right) / 2 + this.scrollingOffset[X] - TOOLBAR_OFFSET, (top + bottom) / 2 + this.scrollingOffset[Y]];
  }

  biggestValue(currentValue: number, maxValue: number): number {
    return currentValue > maxValue ? currentValue : maxValue;
  }

  smallestValue(currentValue: number, maxValue: number): number {
    return currentValue < maxValue ? currentValue : maxValue;
  }

  addOffsetToPosition(xValue: number, yValue: number): [number, number] {
    return [xValue - TOOLBAR_OFFSET + this.scrollingOffset[X], yValue + this.scrollingOffset[Y]];
  }
}
