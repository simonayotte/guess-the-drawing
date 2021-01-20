import { Injectable, Renderer2} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EraserCommand } from '../../../components/app/command/eraser-command';
import { MouseOutOfBoundsError } from '../../../errors/mouse-out-of-bounds';
import { Position } from '../../../models/position';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { TranslateReader } from './translate-reader';
const DEAFULT_SIZE = 3;
const RED = 'rgba(255, 0, 0, 1)';
const DARKER_RED = 'rgba(139, 0, 0, 1)';
const PATH = 0;
const COLOR = 1;
const WIDTH = 2;
@Injectable({
  providedIn: 'root'
})
export class EraserService {
  private pointsFromPaths: [SVGPoint, SVGPathElement, number] [] = [];
  private renderer: Renderer2;
  private path: SVGPathElement;
  eraserSize: BehaviorSubject<number>;
  private isErasing: boolean;
  private pathToRemove: SVGPathElement [] = [];
  private mouseIsInDrawing: boolean;
  private lastRedColor: string;
  private redPath: [SVGPathElement, string, string];
  // tslint:disable-next-line: no-any // We disabed this rule since this is a callback function
  private callBackFunctionToRemoveEraser: any;
  private filledPathToCheck: [SVGPathElement, DOMPoint][] = [];
  constructor(private pathDrawingService: PathDrawingService, private commandInvoker: CommandInvokerService,
              private continueDrawingService: ContinueDrawingService) {
    this.eraserSize = new BehaviorSubject(DEAFULT_SIZE);
    this.isErasing = false;
    this.redPath = [this.path, '', '0'];
    this.commandInvoker.defineEraserCallBack(this.refreshTransform.bind(this));
  }
  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }
  onMouseMove(event: MouseEvent): SVGPathElement {
    this.constructEraserPath(event);
    this.handleCollision([event.offsetX, event.offsetY]);
    return this.path;
  }
  addPath(path: SVGPathElement): void {
    const id = path.getAttribute('id');
    if (id !== 'bucketFill') {
      if (path.hasChildNodes()) {
        this.addMultiplePath(path);
      } else {
        this.addSinglePath(path);
      }
      if (path.getAttribute('fill') !== 'none' && this.isFillableForm(id)) {
        this.filledPathToCheck.push([path, TranslateReader.readTransform(path)]);
      }
    }
  }
  private addMultiplePath(g: SVGPathElement): void {
    const array = Array.from(g.children);
    const translate = TranslateReader.readTransform(g);
    for (const elem of array) {
      const path = elem as SVGPathElement;
      const width = path.getAttribute('stroke-width');
      this.addMPoints(path, g, translate);
      for (let i = 0; i < path.getTotalLength(); i++) {
        const point = new DOMPoint(path.getPointAtLength(i).x  + translate.x, path.getPointAtLength(i).y + translate.y);
        this.pointsFromPaths.unshift([point, g, Number(width)]);
      }
     }
  }
  isFillableForm(id: string | null): boolean {
    return (id === 'rectangle' || id === 'ellipse' || id === 'polygone');
  }
  removePath(path: SVGPathElement): void {
    this.pointsFromPaths = this.pointsFromPaths.filter((elementToRemove) => elementToRemove[1] !== path);
    this.filledPathToCheck = this.filledPathToCheck.filter((elementToRemove) => elementToRemove[0] !== path);
  }
  onMouseDownInElement(event: MouseEvent): SVGPathElement {
    this.isErasing = true;
    this.handleCollision([event.offsetX, event.offsetY]);
    return this.path;
  }
  onMouseUp(event: MouseEvent): SVGPathElement {
    if (this.mouseIsInDrawing) {
      this.isErasing = false;
      if (this.pathToRemove.length !== 0) {
        const cmdErase = new EraserCommand(this.pathToRemove);
        this.commandInvoker.execute(cmdErase);
        this.pathToRemove = [];
      }
    } else {
      throw new MouseOutOfBoundsError('The eraser is not in the drawing');
    }
    return this.path;
  }
  onMouseLeave(event: MouseEvent): SVGPathElement {
    this.onMouseUp(event);
    this.callBackFunctionToRemoveEraser(this.path);
    this.continueDrawingService.autoSaveDrawing();
    this.mouseIsInDrawing = false;
    throw new MouseOutOfBoundsError('Eraser is out of bound');
  }
  onMouseEnter(event: MouseEvent): SVGPathElement {
    this.constructEraserPath(event);
    this.mouseIsInDrawing = true;
    return this.path;
  }
  // tslint:disable-next-line: no-any   // We disabled this rule since this is a callback function
  setRemoveCallBack(callBackFunction: any): void {
    this.callBackFunctionToRemoveEraser = callBackFunction;
  }
  private setPathToSelected(pathSelected: SVGPathElement): void {
    const color = pathSelected.getAttribute('stroke');
    const size = pathSelected.getAttribute('stroke-width');
    const newSize = this.determineNewWidthSize(size);
    if (pathSelected !== this.redPath[PATH]  || this.redPath[PATH].getAttribute('stroke') !== this.lastRedColor) {
      if (color !== null && size !== null) {
        if (this.redPath[COLOR] !== '') {
          this.forceRevert();
        }
        this.redPath = [pathSelected, color, size];
      }
      this.lastRedColor = pathSelected.getAttribute('stroke') !== RED ? RED : DARKER_RED;
      pathSelected.setAttribute('stroke', this.lastRedColor);
      pathSelected.setAttribute('stroke-width', newSize);
      if (pathSelected.getAttribute('id') === 'ligne' || pathSelected.getAttribute('id') === 'aerosol' ) {
        pathSelected.setAttribute('fill', this.lastRedColor);
      }
    }
  }
  private determineNewWidthSize(actualSize: string|null): string {
    const THICKNESS_ADDED = 4;
    const actualSizeNumber = Number(actualSize);
    const newSizeNumber = actualSizeNumber + THICKNESS_ADDED;
    return newSizeNumber.toString();
  }
  private forceRevert(): void {
    const pathToRevert = this.redPath[PATH];
    if (this.redPath[COLOR] !== '') {
      const color = this.redPath[COLOR].toString();
      pathToRevert.setAttribute('stroke', color);
      pathToRevert.setAttribute('stroke-width', this.redPath[WIDTH]);
      this.redPath[COLOR] = '';
    }
  }
  private revertSelectedPath(posMouse: [number, number]): void {
    const pathToRevert = this.redPath[PATH];
    if (!this.mouseIsStillInCollision(posMouse, pathToRevert) && this.redPath[COLOR] !== null &&
        !this.checkFilledForm(posMouse, pathToRevert)) {
      const color = this.redPath[COLOR].toString();
      pathToRevert.setAttribute('stroke', color);
      pathToRevert.setAttribute('stroke-width', this.redPath[WIDTH]);
      if (pathToRevert.getAttribute('id') === 'ligne' || pathToRevert.getAttribute('id') === 'aerosol') {
        pathToRevert.setAttribute('fill', color);
      }
    }
  }
  private constructEraserPath(event: MouseEvent): void {
    const halfSize = this.eraserSize.value / 2;
    if (this.pathDoesNotExists()) {
      this.path = this.renderer.createElement('path', 'svg');
    }
    this.pathDrawingService.drawRectangle(new Position(event.offsetX - halfSize, event.offsetY - halfSize),
                                          new Position(event.offsetX + halfSize, event.offsetY + halfSize), this.path);
    this.pathDrawingService.setBasicAttributes(this.path, 1, 'black', 'white');
    this.path.setAttribute('fill', 'white');
  }
  pathDoesNotExists(): boolean {
    return !this.path;
  }
  private mouseIsStillInCollision(poseMouse: [number, number] , path: SVGPathElement): boolean {
    const pointsFromSelectedPath = this.pointsFromPaths.filter((elem) => elem[1] === this.redPath[PATH]);
    for (const point of  pointsFromSelectedPath) {
      if (this.checkIfRadiusIntersect(poseMouse, [point[0], path, point[2]])) { return true; }
    }
    return false;
  }
  private handleCollision(posMouse: [number, number]): SVGPathElement | null {
    let pathFound: SVGPathElement | null = null;
    for (const element of this.pointsFromPaths) {
      if (this.checkIfRadiusIntersect(posMouse, element) || this.checkFilledForm(posMouse, element[1])) {
        if (this.isErasing) {
          pathFound = element[1];
          this.pathToRemove.push(element[1]);
          this.removePath(element[1]);
        }
        this.setPathToSelected(element[1]);
        break;
      }
    }
    if (pathFound === null ) { this.revertSelectedPath(posMouse); }
    return pathFound;
  }
  private checkIfRadiusIntersect(posMouse: [number, number], elem: [SVGPoint, SVGPathElement, number]): boolean {
    const xDiff = posMouse[0] - elem[0].x;
    const yDiff = posMouse[1] - elem[0].y;
    const pointOfContact = this.eraserSize.getValue() / 2 + elem[2] / 2;
    const pyth = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
    return (pyth < pointOfContact);
  }
  private addSinglePath(path: SVGPathElement): void {
    this.addMPoints(path, path, TranslateReader.readTransform(path));
    const translate = TranslateReader.readTransform(path);
    const width = path.getAttribute('stroke-width');
    for (let i = 0; i < path.getTotalLength(); i++) {
      const point = new DOMPoint(path.getPointAtLength(i).x  + translate.x, path.getPointAtLength(i).y + translate.y);
      this.pointsFromPaths.unshift([point, path, Number(width)]);
    }
  }
  private addMPoints(path: SVGPathElement, pathToRefer: SVGPathElement, translate: DOMPoint): void {
    const d = path.getAttribute('d');
    const width = pathToRefer.getAttribute('stroke-width');
    if (d !== null) {
      const array = d.split(' ');
      for (let i = 0; i < array.length; i++) {
        if (array[i] === 'M' || array[i] === 'm') {
          this.pointsFromPaths.
            unshift([new DOMPoint(Number(array[++i].replace(',', '')) + translate.x,
                    Number(array[++i].replace(',', '')) + translate.y), pathToRefer, Number(width)]);
        }
      }
    }
  }
  private checkFilledForm(posMouse: [number, number], path: SVGPathElement): boolean {
    if (this.filledPathToCheck.find((pathFound) => pathFound[0] === path) !== undefined) {
      if (path.getAttribute('id') === 'rectangle') {
        return this.checkIfInsideRectangle(posMouse, path);
      } else if (path.getAttribute('id') === 'ellipse') {
        return this.checkIfInsideEllipse(posMouse, path);
      } else if (path.getAttribute('id') === 'polygone') {
        return this.checkIfInsidePolygone(posMouse, path);
      }
    }
    return false;
  }
  private checkIfInsideRectangle(posMouse: [number, number], path: SVGPathElement): boolean {
    const translate = this.getTranlateOfFilledPath(path);
    let pointControl: string[] = [];
    let d: string | null;
    const pair: [number, number][] = [];
    d = path.getAttribute('d');
    if (d !== null) {
      pointControl = d.split(' ');
      pointControl = pointControl.filter((elem) => elem !== 'M' && elem !== 'L' && elem !== 'Z');
      for (let i = 0; i < pointControl.length; i++) {
        pair.push([Number(pointControl[i]) + translate.x , Number(pointControl[++i]) + translate.y]);
      }
      const maxY = Math.max.apply(Math, pair.map((y) => y[1]));
      const minY = Math.min.apply(Math, pair.map((y) => y[1]));
      const maxX = Math.max.apply(Math, pair.map((x) => x[0]));
      const minX = Math.min.apply(Math, pair.map((x) => x[0]));
      if (posMouse[0] <= maxX && posMouse[0] >= minX && posMouse[1] <= maxY && posMouse[1] >= minY) { return true; }
    }
    return false;
  }
  private getTranlateOfFilledPath(path: SVGPathElement): DOMPoint {
    const translate = this.filledPathToCheck.find((pathfound) => pathfound[0] === path);
    if (translate !== null && translate !== undefined && translate[1] !== undefined) {
      return translate[1];
    }
    return new DOMPoint(0, 0, 0, 0);
  }
  private checkIfInsideEllipse(posMouse: [number, number], path: SVGPathElement): boolean {
    const translate = this.getTranlateOfFilledPath(path);
    let pointControl: string[] = [];
    let d: string | null;
    let xCenter = 0; let yCenter = 0;
    let pairRadiusString = ['', ''];
    let radiusX = 0; let radiusY = 0;
    let ellipseInequality = 0;
    d = path.getAttribute('d');
    if (d !== null) {
      pointControl = d.split(' ');
      pointControl = pointControl.filter((elem) => elem !== 'M' && elem !== 'L' && elem !== 'Z');
      xCenter = Number(pointControl[0]) + translate.x;
      pairRadiusString = pointControl[2].substring(1, pointControl[2].length).split(',');
      radiusX = Math.abs(Number(pairRadiusString[0])); radiusY = Math.abs(Number(pairRadiusString[1]));
      yCenter = Number(pointControl[1]) + radiusY + translate.y;
      ellipseInequality = (Math.pow((posMouse[0] - xCenter) , 2) / Math.pow(radiusX , 2)) +
                          (Math.pow((posMouse[1] - yCenter) , 2) / Math.pow(radiusY , 2));
      if (ellipseInequality <= 1) {return true; }
    }
    return false;
  }
  private checkIfInsidePolygone(posMouse: [number, number], path: SVGPathElement): boolean {
    const translate = this.getTranlateOfFilledPath(path);
    let isInside = false;
    let splitPoint: string[] = [];
    const pairPoint: DOMPoint [] = [];
    const center: [number, number] = [0, 0];
    let d: string | null;
    d = path.getAttribute('d');
    if (d !== null) {
      splitPoint = d.split(' ').filter((elem) => elem !== 'M' && elem !== 'L' && elem !== 'Z');
      for (let i = 0; i < splitPoint.length; i++) {
        pairPoint.push(this.coordsToDomPoint([Number(splitPoint[i]) + translate.x, Number(splitPoint[++i]) + translate.y]));
      }
      const minX = Math.min.apply(Math, pairPoint.map((p) => p.x));
      const maxX  = Math.max.apply(Math, pairPoint.map((p) => p.x));
      const minY =  Math.min.apply(Math, pairPoint.map((p) => p.y));
      const maxY = Math.max.apply(Math, pairPoint.map((p) => p.y));
      center[0] = minX + ((maxX - minX) / 2.0);
      center[1] = minY + ((maxY - minY) / 2.0);
      const centerDom = this.coordsToDomPoint(center);
      for (let i = 0; i < pairPoint.length - 1; i++ ) {
        if (this.checkIfInsideTriangle(posMouse, centerDom, pairPoint[i], pairPoint[i + 1])) {
          isInside = true; break;
        }
      }
      if (this.checkIfInsideTriangle(posMouse, centerDom, pairPoint[pairPoint.length - 1], pairPoint[0])) {
        isInside = true;
      }
    }
    return isInside;
  }
  private checkIfInsideTriangle(posMouse: [number, number], a: DOMPoint, b: DOMPoint, c: DOMPoint): boolean {
    const point = this.coordsToDomPoint(posMouse);
    const areaOfMaintriangle = this.areaTriangle(a, b, c);
    const areaOfSubTriangleABP = this.areaTriangle(point, a, b);
    const areaOfSubTriangleAPC = this.areaTriangle(point, b, c);
    const areaOfSubTrianglePBC = this.areaTriangle(point, a, c);
    const areaOfAllSubTriangle = areaOfSubTriangleABP + areaOfSubTriangleAPC + areaOfSubTrianglePBC;
    if (Math.round(areaOfAllSubTriangle) === Math.round(areaOfMaintriangle)) { return true; }
    return false;
  }
  private coordsToDomPoint(pos: [number, number]): DOMPoint {return new DOMPoint(pos[0], pos[1], 0, 0); }
  private areaTriangle(a: DOMPoint, b: DOMPoint, c: DOMPoint): number {
    return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2.0);
  }
  refreshTransform(paths: SVGPathElement[], translate: [number, number]): void {
    const X = 0; const Y = 1;
    for (const path of paths) {
      for (const elem of this.pointsFromPaths) {
        if (elem[1] === path) {
          const newDomPoint = new DOMPoint(elem[0].x + translate[X], elem[0].y + translate[Y]);
          elem[0] = newDomPoint;
        }
      }
      for (const elem of this.filledPathToCheck) {
        if (elem[0] === path) {
          elem[1] =  new DOMPoint(elem[1].x + translate[X], elem[1].y + translate[Y]);
        }
      }
    }
  }
}
