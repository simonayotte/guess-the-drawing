import { Injectable, Renderer2 } from '@angular/core';
import { LineToolComponent } from 'src/app/components/app/tools/line-tool/line-tool.component';
import { DrawCommand } from '../../../components/app/command/draw-command';
import { Color } from '../../../components/app/tools/color-picker/color';
import { DrawingNotStartedError } from '../../../errors/drawing-not-started';
import { PathStringIsNullError } from '../../../errors/path-string-is-null';
import { PathManipulation } from '../../../models/path-manipulation';
import { Position } from '../../../models/position';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';

const MERGE_WITH_END_LIMIT = 10;
const ANGLE_0 = 0;
const ANGLE_45 = 45;
const ANGLE_MINUS_45 = -45;
const ANGLE_90 = 90;
const ANGLE_MINUS_90 = -90;
const ANGLE_135 = 135;
const ANGLE_MINUS_135 = -135;
const ANGLE_180 = 180;
const FILL_COLOR = 'none';
const FILL = 'fill';
const POINTER_EVENTS = 'pointer-events';
const SVG = 'svg';
const PATH = 'path';
const NO_STRING = '';
const VISIBLE_PAINTED = 'visiblePainted';
const STROKE_LINEJOIN = 'stroke-linejoin';
const ARCS = 'arcs';
const BEVEL = 'bevel';
const PATH_STRING = 'd';
const L_CARACTER = 'L';
const CLOSE_LINE_STRING = ' Z';
const ONE_POINT = 1;
const TWO_POINTS = 2;
const THREE_POINTS = 3;

enum svgElement {
  path = 0,
  pathLine = 1,
  pathCircle = 2,
}

@Injectable({
  providedIn: 'root'
})
export class LineService {

  private renderer: Renderer2;
  private pathManipulation: PathManipulation = new PathManipulation();
  private pathContainer: SVGPathElement[];
  private isDrawing: boolean;
  private isInElement: boolean;
  private isShiftPressed: boolean;
  private inMouvement: boolean;

  constructor(private pathDrawingService: PathDrawingService, private commandInvoker: CommandInvokerService,
              private eraserService: EraserService, private continueDrawingService: ContinueDrawingService ) {
    this.isDrawing = false;
    this.isInElement = false;
    this.isShiftPressed = false;
    this.inMouvement = false;
  }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.pathDrawingService.initializeRenderer(renderer);
  }

  onMouseDownInElement(): SVGPathElement {
    this.isInElement = true;
    if (!this.isDrawing) {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.pathContainer[svgElement.path];
  }

  onMouseDown(event: MouseEvent, lineToolComponent: LineToolComponent, primaryColor: Color): SVGPathElement {
    if (this.isInElement) {
      if (!this.isDrawing) {
        this.initializeDrawing(event, lineToolComponent, primaryColor);
      } else {
        if (this.isShiftPressed) {
          this.angleLine(lineToolComponent, event);
        } else {
          this.drawWithPastPath(event.offsetX, event.offsetY, ONE_POINT, ONE_POINT, lineToolComponent);
        }
        this.inMouvement = false;
      }
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.pathContainer[svgElement.path];
  }

  onMouseMove(event: MouseEvent, lineToolComponent: LineToolComponent): SVGPathElement {
    if (this.isDrawing) {
      if (!this.inMouvement) {
        this.inMouvement = true;
        this.drawWithCurrentPath(event.offsetX, event.offsetY, lineToolComponent);
      } else {
        if (this.isShiftPressed) {
          this.angleLine(lineToolComponent, event);
        } else {
          this.drawWithPastPath(event.offsetX, event.offsetY, ONE_POINT, ONE_POINT, lineToolComponent);
        }
      }
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.pathContainer[svgElement.path];
  }

  onDoubleClick(event: MouseEvent, lineToolComponent: LineToolComponent): SVGPathElement {
    if (this.isDrawing) {
      this.isDrawing = false;
      if (this.closeLoop(event)) {
        this.drawCloseLoop(event.offsetX, event.offsetY, lineToolComponent);
      }
      this.drawWithPastPath(event.offsetX, event.offsetY, TWO_POINTS, THREE_POINTS, lineToolComponent);
    }
    this.inMouvement = false;
    this.setFinalePathAttributs();
    this.pathContainer[svgElement.path].setAttribute('id', 'ligne');
    this.continueDrawingService.autoSaveDrawing();
    this.commandInvoker.addCommand(new DrawCommand(this.pathContainer[svgElement.path]));
    this.eraserService.addPath(this.pathContainer[svgElement.path]);
    return this.pathContainer[svgElement.path];
  }

  onBackspaceDown(event: KeyboardEvent, lineToolComponent: LineToolComponent): SVGPathElement {
    if (this.isDrawing && this.ifLastPoint()) {
      const currentPosition =
        this.pathManipulation.getCurrentPosition(this.verifyPathString(this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)));
      this.drawWithPastPath(currentPosition.getX(), currentPosition.getY(), TWO_POINTS, TWO_POINTS, lineToolComponent);
    }
    return this.pathContainer[svgElement.path];
  }

  onEscapeClick(event: KeyboardEvent): SVGPathElement {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.inMouvement = false;
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathCircle], NO_STRING);
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathLine], NO_STRING);
      this.mergePaths();
      this.setFinalePathAttributs();
    }
    this.continueDrawingService.autoSaveDrawing();
    return this.pathContainer[svgElement.path];
  }

  onShiftDown(event: KeyboardEvent, lineToolComponent: LineToolComponent): SVGPathElement {
    this.isShiftPressed = true;
    this.angleLine(lineToolComponent);
    return this.pathContainer[svgElement.path];
  }

  onShiftUp(event: KeyboardEvent): SVGPathElement {
    this.isShiftPressed = false;
    return this.pathContainer[svgElement.path];
  }

  onMouseEnter(event: MouseEvent): SVGPathElement {
    this.isInElement = true;
    if (!this.isDrawing) {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.pathContainer[svgElement.path];
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    this.isInElement = false;
    if (!this.isDrawing) {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.pathContainer[svgElement.path];
  }

  private initializePath(event: MouseEvent, lineToolComponent: LineToolComponent, primaryColor: Color): void {
    this.pathContainer[svgElement.pathLine] = this.renderer.createElement(PATH, SVG);
    this.renderer.setAttribute(this.pathContainer[svgElement.pathLine], POINTER_EVENTS, FILL_COLOR);
    this.renderer.setAttribute(this.pathContainer[svgElement.pathLine], 'stroke-width', lineToolComponent.size.toString());
    this.renderer.setAttribute(this.pathContainer[svgElement.pathLine], FILL, 'none');
    this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathLine],
      this.pathDrawingService.initializePathString(event.offsetX, event.offsetY));
    if (!lineToolComponent.hasJunctionPoints) {
      this.renderer.setAttribute(this.pathContainer[svgElement.pathLine], STROKE_LINEJOIN, ARCS);
    } else {
      this.renderer.setAttribute(this.pathContainer[svgElement.pathLine], STROKE_LINEJOIN, BEVEL);
    }
  }

  private initializeCirclePath(event: MouseEvent, lineToolComponent: LineToolComponent, primaryColor: Color): void {
    this.pathContainer[svgElement.pathCircle] = this.renderer.createElement(PATH, SVG);
    this.renderer.setAttribute(this.pathContainer[svgElement.pathCircle], POINTER_EVENTS, FILL_COLOR);
    if (lineToolComponent.hasJunctionPoints) {
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathCircle],
      this.pathDrawingService.initializePathCircleString(event.offsetX, event.offsetY));
      this.renderer.setAttribute(this.pathContainer[svgElement.pathCircle], 'stroke-width', lineToolComponent.junctionDiameter.toString());
      this.renderer.setAttribute(this.pathContainer[svgElement.pathCircle], 'stroke-linecap', 'round');
      this.renderer.setAttribute(this.pathContainer[svgElement.pathCircle], 'stroke-linejoin', 'round');
    } else {
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathCircle], NO_STRING);
    }
  }

  private initializeDrawing(event: MouseEvent, lineToolComponent: LineToolComponent, primaryColor: Color): void {
    this.isDrawing = true;
    this.pathContainer = [];
    this.pathContainer[svgElement.path] = this.renderer.createElement('g', SVG);
    this.renderer.setAttribute(this.pathContainer[svgElement.path], 'id', 'line');
    this.renderer.setAttribute(this.pathContainer[svgElement.path], 'stroke', primaryColor.strFormat());
    this.renderer.setAttribute(this.pathContainer[svgElement.path], 'fill', primaryColor.strFormat());
    this.renderer.setAttribute(this.pathContainer[svgElement.path], 'stroke-width', lineToolComponent.size.toString());
    if (lineToolComponent.hasJunctionPoints && lineToolComponent.size < lineToolComponent.junctionDiameter) {
      this.renderer.setAttribute(this.pathContainer[svgElement.path], 'stroke-width', lineToolComponent.junctionDiameter.toString());
    }
    this.initializePath(event, lineToolComponent, primaryColor);
    this.initializeCirclePath(event, lineToolComponent, primaryColor);
    this.mergePaths();
  }

  private mergePaths(): void {
    this.renderer.appendChild(this.pathContainer[svgElement.path], this.pathContainer[svgElement.pathLine]);
    this.renderer.appendChild(this.pathContainer[svgElement.path], this.pathContainer[svgElement.pathCircle]);
  }

  private drawLine(pastString: string, positionX: number, positionY: number): void {
    if (this.isDrawing) {
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathLine],
        pastString + this.pathDrawingService.lineCreatorString(positionX, positionY));
    }
  }
  private drawCircle(pastString: string, positionX: number, positionY: number, lineToolComponent: LineToolComponent): void {
    if (this.isDrawing) {
      const pathString = 'M ' + positionX + ', ' + positionY + ' L ' + positionX + ', ' + positionY + ' ';
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathCircle],  pastString + pathString);
    }
  }
  private drawWithCurrentPath(positionX: number, positionY: number, lineToolComponent: LineToolComponent): void {
    this.drawLine(this.verifyPathString(this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)), positionX, positionY);
    if (lineToolComponent.hasJunctionPoints) {
      this.drawCircle(this.verifyPathString(this.pathContainer[svgElement.pathCircle].getAttribute(PATH_STRING)),
        positionX, positionY, lineToolComponent);
    }
  }
  private drawWithPastPath(positionX: number, positionY: number, pointsDeletedLine: number, pointsDeletedCircle: number,
                           lineToolComponent: LineToolComponent): void {
    this.drawLine(this.pathManipulation.deleteLastPosition(this.verifyPathString(
      this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)), pointsDeletedLine), positionX, positionY);
    if (lineToolComponent.hasJunctionPoints) {
      let path = this.pathContainer[svgElement.pathCircle].getAttribute('d');
      if (path) {
        for (let i = 0; i < pointsDeletedCircle; i++) {
          path = path.substring(0, path.lastIndexOf('M'));
        }
      } else {
        path = '';
      }
      this.drawCircle(path, positionX, positionY, lineToolComponent);
    }
  }
  private drawCloseLoop(positionX: number, positionY: number, lineToolComponent: LineToolComponent): void {
    this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathLine],
      this.pathManipulation.deleteLastPosition(this.verifyPathString(this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)),
        ONE_POINT) + CLOSE_LINE_STRING);
    if (lineToolComponent.hasJunctionPoints) {
      this.pathDrawingService.setPathString(this.pathContainer[svgElement.pathCircle],
        this.pathManipulation.deleteLastPosition(this.verifyPathString(
          this.pathContainer[svgElement.pathCircle].getAttribute(PATH_STRING)), ONE_POINT));
    }
  }
  private setFinalePathAttributs(): void {
    this.renderer.setAttribute(this.pathContainer[svgElement.pathCircle], POINTER_EVENTS, VISIBLE_PAINTED);
    this.renderer.setAttribute(this.pathContainer[svgElement.pathLine], POINTER_EVENTS, VISIBLE_PAINTED);
  }
  private ifLastPoint(): boolean {
    return this.verifyPathString(this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)).search(L_CARACTER) !==
      this.verifyPathString(this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)).lastIndexOf(L_CARACTER);
  }
  private closeLoop(event: MouseEvent): boolean {
    const firstPosition = this.pathManipulation.getFirstPosition(this.verifyPathString(
      this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)));
    const validX = event.offsetX - firstPosition.getX() > -MERGE_WITH_END_LIMIT &&
                   event.offsetX - firstPosition.getX() < MERGE_WITH_END_LIMIT;
    const validY = event.offsetY - firstPosition.getY() > -MERGE_WITH_END_LIMIT &&
                   event.offsetY - firstPosition.getY() < MERGE_WITH_END_LIMIT;
    return (validX && validY);
  }
  private getCurrentPosition(event?: MouseEvent): Position {
    if (event === undefined) {
      return this.pathManipulation.getCurrentPosition(this.verifyPathString(
        this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)));
    } else {
      return new Position(event.offsetX, event.offsetY);
    }
  }
  private getdifferenceBetweenPoints(event?: MouseEvent): Position {
    const currentPosition = this.getCurrentPosition(event);
    const pastPosition = this.pathManipulation.getPastPosition(this.verifyPathString(
      this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)));
    return new Position(currentPosition.getX() - pastPosition.getX(), pastPosition.getY() - currentPosition.getY());
  }
  private mesureAngle(event?: MouseEvent): number {
    const difference = this.getdifferenceBetweenPoints(event);
    const radAngle = Math.atan2(difference.getY(), difference.getX());
    return Math.round( radAngle * ANGLE_180 / Math.PI / ANGLE_45) * ANGLE_45;
  }
  private getMouvement(angle: number, event?: MouseEvent): Position {
    const difference = this.getdifferenceBetweenPoints(event);
    const moveX = Math.abs(angle) === ANGLE_90 ? ANGLE_0 : difference.getX();
    let moveY;
    // tslint:disable-next-line: prefer-switch // It is nicer than doing a big switch case
    if (angle === ANGLE_135 || angle === ANGLE_MINUS_45) {
      moveY = difference.getX();
    } else if (angle === ANGLE_MINUS_135 || angle === ANGLE_45) {
      moveY = -difference.getX();
    } else if (angle === ANGLE_90 || angle === ANGLE_MINUS_90) {
      moveY = -difference.getY();
    } else {
      moveY = ANGLE_0;
    }
    return new Position(moveX, moveY);
  }
  private angleLine(lineToolComponent: LineToolComponent, event?: MouseEvent): void {
    const angle = this.mesureAngle(event);
    const mouvement = this.getMouvement(angle, event);

    const pastPosition = this.pathManipulation.getPastPosition(this.verifyPathString(
      this.pathContainer[svgElement.pathLine].getAttribute(PATH_STRING)));

    this.drawWithPastPath(pastPosition.getX() + mouvement.getX(), pastPosition.getY() + mouvement.getY(),
    ONE_POINT, ONE_POINT, lineToolComponent);
  }
  private verifyPathString(pathString: string | null): string {
    if (pathString !== null) {
      return pathString;
    } else {
      throw new PathStringIsNullError('Got a null, but expect a string');
    }
  }
}
