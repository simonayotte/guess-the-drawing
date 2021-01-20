import { Injectable, Renderer2 } from '@angular/core';
import { Color } from 'src/app/components/app/tools/color-picker/color';
import { ContinueDrawingService } from '../../continue-drawing/continue-drawing.service';

const SHAPE = 'shape';
const DRAWING_PATH = 'drawingPath';
const G_ELEMENT = 'gElement';

@Injectable({
  providedIn: 'root'
})
export class ColorApplicatorService {

  private renderer: Renderer2;

  constructor(private continueDrawingService: ContinueDrawingService) {}
  initializeRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }

  onMouseDownInElement(event: MouseEvent, color: Color): void {
    if (event.target) {
      const typeOfTarget = this.findTypeOfTarget(event);
      switch (typeOfTarget) {
        case SHAPE: {
          this.changeShapeColor(event.target as SVGPathElement, color, 'fill');
          break;
        }
        case DRAWING_PATH : {
          this.changePathMainColor(event.target as SVGPathElement, color);
          break;
        }
        case G_ELEMENT : {
          const parentElement = (event.target as SVGGElement).parentElement as EventTarget;
          if (parentElement) {
            this.changeGElementColor(parentElement as SVGGElement, color);
          }
          break;
        }
      }
    }
    this.continueDrawingService.autoSaveDrawing();
  }

  onRightMouseDownInElement(event: MouseEvent, color: Color): void {
    if (event.target) {
      const typeOfTarget = this.findTypeOfTarget(event);
      if (typeOfTarget === SHAPE) {
        this.changeShapeColor(event.target as SVGPathElement, color, 'stroke');
      }
    }
    this.continueDrawingService.autoSaveDrawing();
  }

  private changeGElementColor(container: SVGGElement, color: Color): void {
    this.renderer.setAttribute(container, 'stroke', color.strFormat());
    this.renderer.setAttribute(container, 'fill', color.strFormat());
  }

  private changePathMainColor(path: SVGPathElement, color: Color): void {
    this.renderer.setAttribute(path, 'stroke', color.strFormat());
  }

  private changeShapeColor(path: SVGPathElement, color: Color, colorType: string): void {
    const oldColor = path.getAttribute(colorType);
    if (oldColor !== 'none') {
      this.renderer.setAttribute(path, colorType, color.strFormat());
    }
  }

  private findTypeOfTarget(event: MouseEvent): string {
    let typeOfTarget = 'svg';
    const target = event.target;
    const targetParent = (event.target as SVGPathElement).parentElement;
    if (targetParent instanceof SVGGElement) {
      typeOfTarget = G_ELEMENT;
    } else if (target instanceof SVGPathElement) {
      const id = target.getAttribute('id');
      // All shapes have an id, so if an id exists, its a shape and not a pencil/paintbrush path
      typeOfTarget = id ? SHAPE : DRAWING_PATH;
    }
    return typeOfTarget;
  }
}
