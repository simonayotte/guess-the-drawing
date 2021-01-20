import { Injectable, Renderer2 } from '@angular/core';
import { DrawCommand } from 'src/app/components/app/command/draw-command';
import { AerosolComponent } from 'src/app/components/app/tools/aerosol-tool/aerosol/aerosol.component';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { DrawingNotStartedError } from '../../../errors/drawing-not-started';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';

const X = 0;
const Y = 1;
const MS_IN_ONE_SECOND = 1000;
const CIRCLE_DIAMETER = 0.5;
const SQUARE = 2;
const NB_OF_CIRCLES_PER_EMISSION = 15;
@Injectable({
  providedIn: 'root'
})
export class AerosolService {

  private renderer: Renderer2;
  private pathContainer: SVGPathElement;
  private circlePath: SVGPathElement;
  private position: [number, number];
  private diameter: number;
  private emissionSpeed: number;
  private interval: number;
  private drawingStarted: boolean;
  constructor(private pathDrawingService: PathDrawingService, private commandInvoker: CommandInvokerService,
              private eraserService: EraserService, private continueDrawingService: ContinueDrawingService) { }

  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
    this.pathDrawingService.initializeRenderer(renderer);
  }
  onMouseDownInElement(event: MouseEvent, primaryColor: Color, aerosolComponent: AerosolComponent): SVGPathElement {
    this.initializeDrawing(aerosolComponent, primaryColor);
    this.updatePosition(event);
    this.startSprayInterval();
    return this.pathContainer;
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    if (this.drawingStarted) {
      this.updatePosition(event);
    } else {
      throw new DrawingNotStartedError('The drawing has not started');
    }
    return this.pathContainer;
  }

  onMouseUp(): SVGPathElement {
    if (this.drawingStarted) {
      this.continueDrawingService.autoSaveDrawing();
      clearInterval(this.interval);
      this.drawingStarted = false;
      this.pathContainer.setAttribute('id', 'aerosol');
      this.eraserService.addPath(this.pathContainer);
      this.commandInvoker.addCommand(new DrawCommand(this.pathContainer));
    } else {
      throw new DrawingNotStartedError('The drawing has not started');
    }
    return this.pathContainer;
  }

  private updatePosition(event: MouseEvent): void {
    this.position = [event.offsetX, event.offsetY];
  }

  private startSprayInterval(): void {
      this.interval = window.setInterval( () => {
        for (let i = 0; i < NB_OF_CIRCLES_PER_EMISSION; i++) {
          this.createPoint();
        }
      }, MS_IN_ONE_SECOND / this.emissionSpeed);
  }
  private initializeDrawing(aerosolComponent: AerosolComponent, primaryColor: Color): void {
    this.diameter = aerosolComponent.diameter;
    this.emissionSpeed = aerosolComponent.emissionPerSecond;
    this.initializePath(primaryColor);
  }

  private createPoint(): void {
    let pathString = this.circlePath.getAttribute('d');
    if (!pathString) {
      pathString = '';
    }
    const randomPosition = this.randomPositionInCircle();
    pathString += 'M ' + randomPosition[X] + ', ' + randomPosition[Y] + ' ';
    pathString += 'L ' + randomPosition[X] + ', ' + randomPosition[Y] + ' ';
    this.renderer.setAttribute(this.circlePath, 'd', pathString);
  }

  private randomPositionInCircle(): [number, number] {
    const positionX = this.randomNumber(this.position[X] - this.diameter, this.position[X] + this.diameter);
    const yMaxValue = Math.sqrt(Math.pow(this.diameter, SQUARE) - Math.pow(this.position[X] - positionX, SQUARE));
    const positionY = this.randomNumber(this.position[Y] - yMaxValue, this.position[Y] + yMaxValue);
    return [positionX, positionY];
  }

  private randomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private initializePath(primaryColor: Color): void {
    this.drawingStarted = true;
    this.pathContainer = this.renderer.createElement('g', 'svg');
    this.circlePath = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(this.pathContainer, 'stroke-linecap', 'round');
    this.renderer.setAttribute(this.pathContainer, 'stroke-linejoin', 'round');
    this.renderer.setAttribute(this.circlePath, 'stroke-width', '1.5');
    this.appendCircleToMainPath(this.circlePath);
    this.pathDrawingService.setBasicAttributes(this.pathContainer, CIRCLE_DIAMETER, primaryColor.strFormat(), primaryColor.strFormat());
  }

  private appendCircleToMainPath(path: SVGPathElement): void {
    this.renderer.appendChild(this.pathContainer, path);
  }
}
