import { Injectable, Renderer2 } from '@angular/core';
import { PencilComponent } from 'src/app/components/app/tools/drawingTools/pencil/pencil.component';
import { DrawCommand } from '../../../components/app/command/draw-command';
import { DrawingNotStartedError } from '../../../errors/drawing-not-started';
import { SelectedColorsService } from '../../color-picker/selected-colors.service';
import { CommandInvokerService } from '../../drawing/command-invoker.service';
import { EraserService } from '../eraser-service/eraser.service';
import { PathDrawingService } from '../path-drawing/path-drawing.service';
import { OtherClientDrawingManager } from '../../clientPathListener/other-client-drawing-manager'

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
              private eraserService: EraserService, private otherClientDrawingManager: OtherClientDrawingManager,
              private selectedColorsService: SelectedColorsService) {
    this.isDrawing = false;
  }

  initializeRenderer(renderer: Renderer2): void {
    if (this.renderer === undefined) {
     this.renderer = renderer;
    }
    this.pathDrawingService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent, pencil: PencilComponent): SVGPathElement {
    this.isDrawing = true;
    this.path = this.renderer.createElement('path', 'svg');
    this.selectedColorsService.updatePreviousColors();
    const color = this.selectedColorsService.primaryColorBS.value;
    this.pathDrawingService.setBasicAttributes(this.path, pencil.size, color.strFormat(),  'none');
    this.renderer.setAttribute(this.path, 'stroke-linecap', 'round');
    this.renderer.setAttribute(this.path, 'stroke-linejoin', 'round');
    this.pathString = this.pathDrawingService.initializePathString(event.offsetX, event.offsetY);
    this.pathString += this.pathDrawingService.lineCreatorString(event.offsetX, event.offsetY);
    this.pathDrawingService.setPathString(this.path, this.pathString);
    this.otherClientDrawingManager.sendFirstPoint(pencil.size, color.strFormat(), [event.offsetX, event.offsetY])
    return this.path;
  }

  onMouseEnter(event: MouseEvent, pencil: PencilComponent): SVGPathElement | null {
    if (event.buttons === LEFT_BUTTON) {
      return this.onMouseDownInElement(event, pencil);
    }

    return null;
  }

  onMouseUp(event: MouseEvent): SVGPathElement | null {
    try{
      this.drawLine(event);
      this.otherClientDrawingManager.sendLastPoint([event.offsetX, event.offsetY], this.path)
    }catch(error) {
      return null;
    }

    this.isDrawing = false;
    const cmd = new DrawCommand(this.path);
    this.commandInvoker.addCommand(cmd);
    this.eraserService.addPath(this.path);
    return this.path;
  }

  onMouseMove(event: MouseEvent): SVGPathElement | null {
    try{
      this.drawLine(event);
      this.otherClientDrawingManager.sendMiddlePoint([event.offsetX, event.offsetY])
    }catch(error) {
      return null;
    }

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
