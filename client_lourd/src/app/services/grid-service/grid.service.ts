import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color } from '../../components/app/tools/color-picker/color';
import { PathDrawingService } from '../tools/path-drawing/path-drawing.service';

export const WIDTH_ATTRIBUTE = 'width';
export const HEIGHT_ATTRIBUTE = 'height';
export const MIN_TRANSPARENCY = 0.3;
export const MAX_TRANSPARENCY = 1;
export const DEFAULT_TRANSPARENCY = MAX_TRANSPARENCY;
export const GRID_PIXELS_STEP = 5;
export const DEFAULT_GRID_PIXELS = GRID_PIXELS_STEP;
export const GRID_PIXELS_MIN = GRID_PIXELS_STEP;
export const MAX_GRID_SIZE_FACTOR = 2;
export const DEFAULT_LINE_SIZE = 2;

@Injectable({
  providedIn: 'root'
})
export class GridService {
  lineSize: number;
  color: Color;

  gridWidth: number;
  gridHeight: number;

  gridColorSubject: BehaviorSubject<Color>;
  gridPixelsSubject: BehaviorSubject<number>;
  gridPixelsMaxSubject: BehaviorSubject<number>;
  gridActivationSubject: BehaviorSubject<boolean>;

  constructor(private pathDrawingService: PathDrawingService) {
    this.color = new Color(0, 0, 0, DEFAULT_TRANSPARENCY);
    this.gridColorSubject = new BehaviorSubject<Color>(this.color.clone());
    this.gridPixelsSubject = new BehaviorSubject<number>(DEFAULT_GRID_PIXELS);
    this.gridPixelsMaxSubject = new BehaviorSubject<number>(DEFAULT_GRID_PIXELS);
    this.gridActivationSubject = new BehaviorSubject<boolean>(false);
    this.lineSize = DEFAULT_LINE_SIZE;
    this.updateMaxGridPixelSize();
  }

  updatePatternDimensions(pattern: SVGPatternElement): void {
    this.setElementWidth(pattern, this.gridPixelsSubject.value / this.gridWidth);
    this.setElementHeight(pattern, this.gridPixelsSubject.value / this.gridHeight);
  }

  incrementGridPixels(): void {
    this.setGridPixelSize(this.gridPixelsSubject.value + GRID_PIXELS_STEP);
  }

  decrementGridPixels(): void {
    this.setGridPixelSize(this.gridPixelsSubject.value - GRID_PIXELS_STEP);
  }

  setGridPixelSize(newGridPixelSize: number): void {
    newGridPixelSize = this.getBoundedValue(newGridPixelSize, GRID_PIXELS_MIN, this.gridPixelsMaxSubject.value);
    this.gridPixelsSubject.next(newGridPixelSize);
  }

  setTransparency(newTransparency: number): void {
    this.color.setA(this.getBoundedValue(newTransparency, MIN_TRANSPARENCY, MAX_TRANSPARENCY));
    this.gridColorSubject.next(this.color.clone());
  }

  updateMaxGridPixelSize(): void {
    let newVal = this.gridHeight > this.gridWidth ? this.gridHeight : this.gridWidth;
    newVal /= MAX_GRID_SIZE_FACTOR;
    newVal -= (newVal % GRID_PIXELS_STEP);
    this.gridPixelsMaxSubject.next(newVal);
  }

  setElementWidth(element: Element, width: number): void {
    element.setAttribute(WIDTH_ATTRIBUTE, width.toString());
  }

  setElementHeight(element: Element, height: number): void {
    element.setAttribute(HEIGHT_ATTRIBUTE, height.toString());
  }

  setGridWidth(element: Element, width: number): void {
    this.gridWidth = width;
    this.updateMaxGridPixelSize();
    this.setElementWidth(element, width);
  }

  setGridHeight(element: Element, height: number): void {
    this.gridHeight = height;
    this.updateMaxGridPixelSize();
    this.setElementHeight(element, height);
  }

  setActivation(isActive: boolean): void {
    this.gridActivationSubject.next(isActive);
  }

  getPath(): string {
    let gridBase = this.pathDrawingService.initializePathString(0, this.gridPixelsSubject.value);
    gridBase += this.pathDrawingService.lineCreatorString(this.gridPixelsSubject.value, this.gridPixelsSubject.value);
    gridBase += this.pathDrawingService.lineCreatorString(this.gridPixelsSubject.value, 0);
    return gridBase;
  }

  getBoundedValue(value: number, lowerBound: number, upperBound: number): number {
    if (upperBound >= lowerBound) {
      if (value > upperBound) {
        value = upperBound;
      } else if (value < lowerBound) {
        value = lowerBound;
      }
    }
    return value;
  }
}
