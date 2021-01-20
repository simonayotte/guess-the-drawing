import { Injectable, Renderer2 } from '@angular/core';
import { Position } from 'src/app/models/position';
import { DrawingNotStartedError } from '../../../errors/drawing-not-started';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { SelectedElementsService } from '../../selected-elements/selected-elements.service';
import { SelectionMovementService } from '../../selection-movement-service/selection-movement.service';
import { SvgService } from '../../svg-service/svg.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { SelectionManipulationService } from '../selection-manipulation/selection-manipulation.service';

const SVG_INDEX = 0;
const SELECTION_RECTANGLE_INDEX = 1;
const SELECTED_ELEMENT_PATH_INDEX = 2;
const CONTROL_POINTS = 3;
const X = 0;
const Y = 1;
const SELECTION = 0;
const INVERTED_SELECTION = 1;
const SELECTION_MOVEMENT_STARTED = 2;
const MOUSE_HAS_MOVED = 3;
const CP_WIDTH = 5;

@Injectable({
  providedIn: 'root'
})
export class SelectionToolService {
  renderer: Renderer2;
  paths: SVGPathElement[];
  selectedElements: SVGPathElement[];
  invertedSelectionElements: SVGPathElement[];
  eventStarted: [boolean, boolean, boolean, boolean];
  position: [number, number];
  svgElement: SVGElement;
  isInElement: boolean;

  constructor(private pathDrawingService: PathDrawingService, private svgService: SvgService,
              private selectionMovementService: SelectionMovementService, private selectionManipulation: SelectionManipulationService,
              private selectedElementService: SelectedElementsService, private continueDrawingService: ContinueDrawingService) {
    this.eventStarted = [false, false, false, false];
    this.paths = [];
    this.selectedElementService.selectedElements.subscribe( (selectedElements: [SVGPathElement]) => {
      this.selectedElements = selectedElements;
    });
    this.selectedElementService.selectedElements.next([]);
    this.invertedSelectionElements = [];
    this.svgService.svgSubject.subscribe((svg) => { this.svgElement = svg; });
    this.selectionMovementService.initalizeSelectionBoxCallBack(this.createBoundingBoxRectangle.bind(this));
    this.selectionManipulation.initalizeSelectionBoxCallBack(this.createBoundingBoxRectangle.bind(this));
    this.isInElement = false;
  }
  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.selectionMovementService.initializeRenderer(renderer);
  }

  setSelectedElements(paths: SVGPathElement[]): void {
    this.selectedElements = paths;
    this.eventStarted = [false, false, false, false];
    this.autoSaveDrawing();
    if (this.paths[SVG_INDEX]) {
      this.selectedElementService.selectedElements.next(this.selectedElements);
      this.createBoundingBoxRectangle();
    }
  }
  autoSaveDrawing(): void {
    const bufferElements: SVGPathElement[]  = this.selectedElements;
    this.selectedElements = [];
    this.createBoundingBoxRectangle();
    this.continueDrawingService.autoSaveDrawing();
    this.selectedElements = bufferElements;
    this.createBoundingBoxRectangle();
  }
  onMouseDownInElement(event: MouseEvent): SVGPathElement {
    if (this.isOnControlPoint(event)) {
      // Scale the selected elements
    } else if (this.selectedElements !== undefined && this.selectedElements.length > 0 && this.isInSelectedElementBox(event)) {
      this.onMouseClickInBoundingBox(event);
    } else if (!this.eventStarted[INVERTED_SELECTION] && !this.eventStarted[SELECTION_MOVEMENT_STARTED]) {
      this.initializePathArray();
      this.initializeSelection(event);
      this.resetAllSelection();
      const element = this.elementToAdd(event);
      if (element && element !== this.paths[CONTROL_POINTS]) {
        this.selectedElements.push(element);
        this.selectedElementService.selectedElements.next(this.selectedElements);
        this.selectionMovementService.initializeMovement(event, this.selectedElements);
        this.eventStarted = [false, false, true, false];
      }
      this.createBoundingBoxRectangle();
    }
    return this.mergeAllPath();
  }
  private onMouseClickInBoundingBox(event: MouseEvent): void {
    const element = this.elementToAdd(event);
    if (element && !this.elementIsSelected(element)) {
      this.selectedElements = [element];
      this.selectedElementService.selectedElements.next(this.selectedElements);
    }
    this.eventStarted = [false, false, true, false];
    this.selectionMovementService.initializeMovement(event, this.selectedElements);
    this.createBoundingBoxRectangle();
  }
  onRightClickDown(event: MouseEvent): SVGPathElement {
    if (!this.eventStarted[SELECTION] && !this.eventStarted[SELECTION_MOVEMENT_STARTED] && !this.isOnControlPoint(event)) {
      this.invertedSelectionElements = [];
      const elementSelected = this.elementToAdd(event);
      for (const element of this.selectedElements) {
        this.invertedSelectionElements.push(element);
      }
      if (elementSelected) {
        const index = this.selectedElements.indexOf(elementSelected);
        if (index >= 0) {
          this.selectedElements.splice(index, 1);
        } else {
          this.selectedElements.push(elementSelected);
        }
        this.selectedElementService.selectedElements.next(this.selectedElements);
      }
      this.initializePathArray();
      this.eventStarted = [false, true, false, false];
      this.position = [event.offsetX, event.offsetY];
      this.initializeSelectionRectangle();
      this.createBoundingBoxRectangle();
    }
    return this.mergeAllPath();
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    if (this.eventStarted[SELECTION_MOVEMENT_STARTED]) {
      this.selectionMovementService.onMouseUp();
    }
    if ((this.eventStarted[SELECTION]  || this.eventStarted[SELECTION_MOVEMENT_STARTED]) && !this.eventStarted[MOUSE_HAS_MOVED]) {
      const element = this.elementToAdd(event);
      if (element && element !== this.paths[CONTROL_POINTS]) {
        this.selectedElements = [element];
      } else if ( element !== this.paths[CONTROL_POINTS]) {
        this.selectedElements = [];
      }
      this.selectedElementService.selectedElements.next(this.selectedElements);
    }
    this.resetPath();
    if (this.isInElement) {
     this.autoSaveDrawing();
    }
    return this.mergeAllPath();
  }
  onMouseLeave(event: MouseEvent): SVGPathElement {
    this.isInElement = false;
    this.onMouseUp(event);
    return this.mergeAllPath();
  }
  onMouseEnter(event: MouseEvent): SVGPathElement {
    this.isInElement = true;
    return this.mergeAllPath();
  }
  onMouseMove(event: MouseEvent): SVGPathElement {
    this.eventStarted[MOUSE_HAS_MOVED] = true;
    if (this.eventStarted[SELECTION]) {
      this.selectingElements(event);
    } else if (this.eventStarted[INVERTED_SELECTION]) {
      this.invertedSelection(event);
    } else if (this.eventStarted[SELECTION_MOVEMENT_STARTED]) {
      this.selectionMovementService.onMouseMove(event);
      this.createBoundingBoxRectangle();
    }
    if (this.eventHasStarted()) {
      return this.mergeAllPath();
    } else {
      throw new DrawingNotStartedError('Selection has not started yet');
    }
  }
  selectAllElements(): SVGPathElement {
    this.initializePathArray();
    this.pathDrawingService.setBasicAttributes(this.paths[SELECTED_ELEMENT_PATH_INDEX], 1, 'black', 'none');
    this.selectedElements = [];
    const elements: HTMLCollection = this.svgElement.children;
    // tslint:disable-next-line: prefer-for-of --> Can t iterate on this container
    for (let i = 0; i < elements.length; i++) {
      if (!(elements[i] instanceof SVGFilterElement) && (elements[i] !== this.paths[SELECTION_RECTANGLE_INDEX])) {
        this.selectedElements.push(elements[i] as SVGPathElement);
      }
    }
    this.selectedElementService.selectedElements.next(this.selectedElements);
    this.createBoundingBoxRectangle();
    return this.mergeAllPath();
  }
  onArrowsChange(arrowsDown: Map<string, boolean>, event: KeyboardEvent): void {
    if (this.selectedElements.length >= 1) {
      event.preventDefault();
      this.selectionMovementService.onArrowsChange(arrowsDown, this.selectedElements);
    }
  }
  clearSelection(): void {
    this.selectedElements = [];
    this.eventStarted = [false, false, false, false];
    if (this.paths[SVG_INDEX]) {
      this.selectedElementService.selectedElements.next(this.selectedElements);
      this.createBoundingBoxRectangle();
    }
  }
  private elementIsSelected(element: SVGPathElement): boolean {
    for (const selectedElement of this.selectedElements) {
      if (selectedElement === element) {
        return true;
      }
    }
    return false;
  }
  private selectingElements(event: MouseEvent): void {
    this.pathDrawingService.drawRectangle(new Position(this.position[X], this.position[Y]), new Position(
                                          event.offsetX, event.offsetY), this.paths[SELECTION_RECTANGLE_INDEX]);
    this.selectedElements = this.findAllSelectedElements();
    this.selectedElementService.selectedElements.next(this.selectedElements);
    this.createBoundingBoxRectangle();
  }
  private isOnControlPoint(event: MouseEvent): boolean {
    return (event.target === this.paths[CONTROL_POINTS]);
  }
  private isInSelectedElementBox(ev: MouseEvent): boolean {
    return this.isInRectangle(new DOMRect(ev.pageX, ev.pageY, 0, 0), 0, this.paths[SELECTED_ELEMENT_PATH_INDEX].getBoundingClientRect());
  }
  private initializePathArray(): void {
    this.paths = this.paths.length === 0 ? [this.renderer.createElement('svg', 'svg'), this.renderer.createElement('path', 'svg'),
                              this.renderer.createElement('path', 'svg'), this.renderer.createElement('path', 'svg')] : this.paths;
  }
  private eventHasStarted(): boolean {
    return this.eventStarted[SELECTION] || this.eventStarted[INVERTED_SELECTION] || this.eventStarted[SELECTION_MOVEMENT_STARTED];
  }
  private resetAllSelection(): void {
    this.selectedElements = [];
    this.selectedElementService.selectedElements.next(this.selectedElements);
  }
  private elementToAdd(event: MouseEvent): SVGPathElement | null | undefined {
    if (event.target !== null && event.target instanceof SVGPathElement) {
      const element = event.target as SVGPathElement;
      if (element.parentElement === null || element === this.paths[SELECTED_ELEMENT_PATH_INDEX]) {
        return null;
      } else if (element === this.paths[CONTROL_POINTS]) {
        return element;
      }
      return element.parentElement.parentElement instanceof SVGElement ? (element.parentElement as EventTarget) as SVGPathElement : element;
    }
    return null;
  }
  private invertedSelection(event: MouseEvent): void {
    this.pathDrawingService.drawRectangle(new Position(this.position[X], this.position[Y]), new Position(
                                          event.offsetX, event.offsetY), this.paths[SELECTION_RECTANGLE_INDEX]);
    const selectedElements = this.findAllSelectedElements();
    this.selectedElements = [];
    for (const element of this.invertedSelectionElements) {
      this.selectedElements.push(element);
    }
    for (const element of selectedElements) {
      const index = this.invertedSelectionElements.indexOf(element);
      if (index >= 0) {
        this.selectedElements.splice(this.selectedElements.indexOf(element), 1);
      } else {
        this.selectedElements.push(element);
      }
    }
    this.selectedElementService.selectedElements.next(this.selectedElements);
    this.createBoundingBoxRectangle();
  }
  private resetPath(): void {
    if (this.eventStarted[SELECTION] || this.eventStarted[INVERTED_SELECTION] || this.eventStarted[SELECTION_MOVEMENT_STARTED]) {
      this.eventStarted = [false, false, false, false];
      this.createBoundingBoxRectangle();
      this.pathDrawingService.setPathString(this.paths[SELECTION_RECTANGLE_INDEX], '');
    }
  }
  private findAllSelectedElements(): SVGPathElement[] {
    const currentlySelectedElements: SVGPathElement[] = [];
    const elements: HTMLCollection = this.svgElement.children;
    for (let i = 0; i < elements.length - 1; i++) {
      const width = this.getPathWidth(elements[i] as SVGPathElement);
      if (!(elements[i] instanceof SVGFilterElement) &&
            this.isInRectangle((elements[i] as SVGPathElement).getBoundingClientRect(), width)) {
        currentlySelectedElements.push(elements[i] as SVGPathElement);
      }
    }
    return currentlySelectedElements;
  }
  private initializeSelectionRectangle(): void {
    if (this.paths[SELECTION_RECTANGLE_INDEX] === undefined) {
      this.paths[SELECTION_RECTANGLE_INDEX] = this.renderer.createElement('path', 'svg');
    }
    this.pathDrawingService.setPathString(this.paths[SELECTION_RECTANGLE_INDEX],
                                          this.pathDrawingService.initializePathString(this.position[X], this.position[Y]));
    this.pathDrawingService.setPerimeterAttributes(this.paths[SELECTION_RECTANGLE_INDEX]);
    this.pathDrawingService.setBasicAttributes(this.paths[SELECTED_ELEMENT_PATH_INDEX], 1, 'black', 'none');
    this.pathDrawingService.setBasicAttributes(this.paths[CONTROL_POINTS], 1, 'black', 'white');
  }
  private initializeSelection(event: MouseEvent): void {
    this.eventStarted = [true, false, false, false];
    this.position = [event.offsetX, event.offsetY];
    this.initializeSelectionRectangle();
  }
  private isInRectangle(bbox: ClientRect, width: number,
                        pathBox: ClientRect = this.paths[SELECTION_RECTANGLE_INDEX].getBoundingClientRect()): boolean {
    return ((bbox.top >= pathBox.top - width && bbox.top <= (pathBox.bottom + width)) ||
           (bbox.bottom >= pathBox.top - width && (bbox.bottom) <= (pathBox.bottom + width)) ||
           (bbox.top <= pathBox.top - width && (bbox.bottom) >= pathBox.top + width)) &&
           ((bbox.left >= pathBox.left - width && bbox.left <= (pathBox.right + width)) ||
           (bbox.right >= pathBox.left - width && (bbox.right) <= (pathBox.right + width)) ||
           (bbox.left <= pathBox.left - width && (bbox.right) >= pathBox.left + width));
  }
  private getPathWidth(element: SVGPathElement): number {
    const widthString = element.getAttribute('stroke-width');
    return (widthString === null || widthString === undefined ? 0 : +widthString) / 2;
  }
  private createBoundingBoxRectangle(): void {
    let controlPointString = '';
    let selectedElementPathString = '';
    if (this.selectedElements.length > 0) {
      const bbox: ClientRect = this.selectedElements[0].getBoundingClientRect();
      let min = [bbox.left, bbox.top];
      let max = [bbox.right, bbox.bottom];
      for (const element of this.selectedElements) {
        const strokeWidth: number = this.getPathWidth(element);
        const boundingBox: ClientRect = element.getBoundingClientRect();
        min = [this.selectionManipulation.smallestValue(min[X], boundingBox.left - strokeWidth),
               this.selectionManipulation.smallestValue(min[Y], boundingBox.top - strokeWidth)];
        max = [this.selectionManipulation.biggestValue(max[X], boundingBox.right + strokeWidth),
               this.selectionManipulation.biggestValue(max[Y], boundingBox.bottom + strokeWidth)];
      }
      const minPosition = this.selectionManipulation.addOffsetToPosition(min[X], min[Y]);
      const maxPosition = this.selectionManipulation.addOffsetToPosition(max[X], max[Y]);
      selectedElementPathString = this.pathDrawingService.quadrilatorString(minPosition[X], minPosition[Y], maxPosition[X], maxPosition[Y]);
      controlPointString = this.controlPointsPathString(minPosition, maxPosition);
    }
    this.pathDrawingService.setPathString(this.paths[SELECTED_ELEMENT_PATH_INDEX], selectedElementPathString);
    this.pathDrawingService.setPathString(this.paths[CONTROL_POINTS], controlPointString);
  }
  private controlPointsPathString(minPosition: [number, number], maxPosition: [number, number]): string {
    let controlPointsString = this.controlPointString(maxPosition[X], ((minPosition[Y] + maxPosition[Y]) / 2));
    controlPointsString += this.controlPointString(minPosition[X], ((minPosition[Y] + maxPosition[Y]) / 2));
    controlPointsString += this.controlPointString(((minPosition[X] + maxPosition[X]) / 2), minPosition[Y]);
    return controlPointsString + this.controlPointString(((minPosition[X] + maxPosition[X]) / 2), maxPosition[Y]);
  }
  private controlPointString(posX: number, posY: number): string {
    return this.pathDrawingService.quadrilatorString(posX - CP_WIDTH, posY - CP_WIDTH, posX + CP_WIDTH, posY + CP_WIDTH);
  }
  private mergeAllPath(): SVGPathElement {
    this.renderer.appendChild(this.paths[SVG_INDEX], this.paths[SELECTION_RECTANGLE_INDEX]);
    this.renderer.appendChild(this.paths[SVG_INDEX], this.paths[SELECTED_ELEMENT_PATH_INDEX]);
    this.renderer.appendChild(this.paths[SVG_INDEX], this.paths[CONTROL_POINTS]);
    return this.paths[SVG_INDEX];
  }
}
