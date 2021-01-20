import { Injectable, Renderer2 } from '@angular/core';
import { PencilComponent } from 'src/app/components/app/tools/drawingTools/pencil/pencil.component';
import { DrawCommand } from '../../../components/app/command/draw-command';
import { Color } from '../../../components/app/tools/color-picker/color';
import { DrawingNotStartedError } from '../../../errors/drawing-not-started';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';

const LEFT_BUTTON = 1;

@Injectable({
  providedIn: 'root'
})
export class PencilService {

  renderer: Renderer2;
  isDrawing: boolean;
  pathString: string;
  path: SVGPathElement;

  constructor(private pathDrawingService: PathDrawingService, private commandInvoker: CommandInvokerService,
              private eraserService: EraserService, private continueDrawingService: ContinueDrawingService) {
    this.isDrawing = false;
  }

  initializeRenderer(renderer: Renderer2): void {
    if (this.renderer === undefined) {
     this.renderer = renderer;
    }
    this.pathDrawingService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent, pencil: PencilComponent, primaryColor: Color): SVGPathElement {
    this.isDrawing = true;
    this.path = this.renderer.createElement('path', 'svg');
    this.pathDrawingService.setBasicAttributes(this.path, pencil.size, primaryColor.strFormat(),  'none');
    this.renderer.setAttribute(this.path, 'stroke-linecap', 'round');
    this.renderer.setAttribute(this.path, 'stroke-linejoin', 'round');
    this.pathString = this.pathDrawingService.initializePathString(event.offsetX, event.offsetY);
    this.pathString += this.pathDrawingService.lineCreatorString(event.offsetX, event.offsetY);
    this.pathDrawingService.setPathString(this.path, this.pathString);
    return this.path;
  }

  onMouseEnter(event: MouseEvent, pencil: PencilComponent, primaryColor: Color): SVGPathElement {
    if (event.buttons === LEFT_BUTTON) {
      return this.onMouseDownInElement(event, pencil, primaryColor);
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    this.drawLine(event);
    this.continueDrawingService.autoSaveDrawing();
    this.isDrawing = false;
    const cmd = new DrawCommand(this.path);
    this.commandInvoker.addCommand(cmd);
    this.eraserService.addPath(this.path);
    return this.path;
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    this.drawLine(event);
    return this.path;
  }

  private drawLine(event: MouseEvent): void {
    if (this.isDrawing) {
      this.pathString += this.pathDrawingService.lineCreatorString(event.offsetX, event.offsetY);
      this.pathDrawingService.setPathString(this.path, this.pathString);
    } else {
      throw new DrawingNotStartedError('The drawing has not started yet');
    }
  }
}
