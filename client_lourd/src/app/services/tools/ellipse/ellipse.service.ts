import { Injectable, Renderer2 } from '@angular/core';
import { DrawCommand } from 'src/app/components/app/command/draw-command';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { EllipseComponent } from 'src/app/components/app/tools/shapeTools/ellipse/ellipse/ellipse.component';
import { Position } from 'src/app/models/position';
import { DrawingNotStartedError } from '../../../errors/drawing-not-started';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseService {

  private renderer: Renderer2;
  private isDrawing: boolean;
  private isInElement: boolean;
  private circleIsActivated: boolean;
  private path: SVGPathElement;
  private shapePath: SVGPathElement;
  private perimeterPath: SVGPathElement;
  private initialPosition: Position;
  private currentPosition: Position;
  private exitWhileDrawing: boolean;

  constructor(private pathDrawingService: PathDrawingService, private commandInvoker: CommandInvokerService,
              private eraserService: EraserService, private continueDrawingService: ContinueDrawingService) {
    this.isDrawing = false;
    this.circleIsActivated = false;
    this.isInElement = false;
    this.exitWhileDrawing = false;
    this.initialPosition = new Position(0, 0);
    this.currentPosition = new Position(0, 0);
   }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.pathDrawingService.initializeRenderer(renderer);
  }

  private mergePaths(): void {
    this.renderer.appendChild(this.path, this.shapePath);
    this.renderer.appendChild(this.path, this.perimeterPath);
  }

  private initializeShapePath(event: MouseEvent, ellipse: EllipseComponent, primaryColor: Color, secondaryColor: Color): void {
    const fillColor = (ellipse.shapeType === 'Contour') ? 'none' : primaryColor.strFormat();
    const lineSize = (ellipse.shapeType === 'Plein') ? 0 : ellipse.lineSize;

    this.shapePath = this.renderer.createElement('path', 'svg');
    this.pathDrawingService.setBasicAttributes(this.shapePath, lineSize, secondaryColor.strFormat(), fillColor);
    this.pathDrawingService.setPathString(this.shapePath, this.pathDrawingService.initializePathString(event.offsetX, event.offsetY));
  }

  private initializePerimeterPath(event: MouseEvent): void {
    this.perimeterPath = this.renderer.createElement('path', 'svg');
    this.pathDrawingService.setPerimeterAttributes(this.perimeterPath);
    this.pathDrawingService.setPathString(this.perimeterPath, this.pathDrawingService.initializePathString(event.offsetX, event.offsetY));
  }

  onMouseDownInElement(): SVGPathElement {
    this.isInElement = true;
    return this.path;
  }

  onMouseDown(event: MouseEvent, ellipse: EllipseComponent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    if (this.isInElement) {
      this.initialPosition.setX(event.offsetX);
      this.initialPosition.setY(event.offsetY);
      this.isDrawing = true;

      this.initializeShapePath(event, ellipse, primaryColor, secondaryColor);
      this.initializePerimeterPath(event);
      this.path = this.renderer.createElement('svg', 'svg');
      this.mergePaths();
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.path;
  }

  onMouseUp(): SVGPathElement {
    if (this.isInElement || this.exitWhileDrawing) {
      this.exitWhileDrawing = false;
      this.isDrawing = false;
      this.pathDrawingService.setPathString(this.perimeterPath, '');
      this.continueDrawingService.autoSaveDrawing();
      this.commandInvoker.addCommand(new DrawCommand(this.shapePath));
      this.shapePath.setAttribute('id', 'ellipse');
      this.eraserService.addPath(this.shapePath);
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    return this.shapePath;
  }

  onShiftDown(): SVGPathElement {
    this.circleIsActivated = true;
    if (this.isDrawing) {
      this.shapePath = this.drawShape(this.shapePath);
      this.perimeterPath = this.drawShape(this.perimeterPath);
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    this.mergePaths();
    return this.path;
  }

  onShiftUp(): SVGPathElement {
    this.circleIsActivated = false;
    if (this.isDrawing) {
      this.shapePath = this.drawShape(this.shapePath);
      this.perimeterPath = this.drawShape(this.perimeterPath);
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    this.mergePaths();
    return this.path;
  }

  private drawShape(path: SVGPathElement): SVGPathElement {
    if (this.circleIsActivated) {
      return (path === this.shapePath) ?  this.pathDrawingService.drawCircle(this.initialPosition, this.currentPosition, path) :
                                          this.pathDrawingService.drawRectangle(this.initialPosition, this.currentPosition, path);
    } else {
      return (path === this.shapePath) ?  this.pathDrawingService.drawEllipse(this.initialPosition, this.currentPosition, path) :
                                          this.pathDrawingService.drawRectangle(this.initialPosition, this.currentPosition, path);
    }
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    this.currentPosition.setX(event.offsetX);
    this.currentPosition.setY(event.offsetY);

    if (this.isDrawing) {
      this.shapePath = this.drawShape(this.shapePath);
      this.perimeterPath = this.drawShape(this.perimeterPath);
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    this.mergePaths();
    return this.path;
  }

  onMouseLeave(): SVGPathElement {
    this.isInElement = false;

    if (!this.isDrawing) {
      throw new DrawingNotStartedError('The drawing has not started yet');
    } else {
      this.exitWhileDrawing = true;
    }
    this.mergePaths();
    return this.path;
  }

  onMouseEnter(): SVGPathElement {
    this.isInElement = true;

    if (!this.isDrawing) {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
    this.mergePaths();
    return this.path;
  }
}
