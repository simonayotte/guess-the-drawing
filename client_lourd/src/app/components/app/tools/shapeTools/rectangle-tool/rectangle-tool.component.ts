import { Component, Input, Renderer2 } from '@angular/core';
import { RectangleService } from 'src/app/services/tools/rectangle-service/rectangle.service';
import { Color } from '../../color-picker/color';
import { ShapeToolComponent } from '../shape-tool/shape-tool.component';

@Component({
  selector: 'app-rectangle-tool',
  templateUrl: './rectangle-tool.component.html',
  styleUrls: ['./rectangle-tool.component.scss']
})
export class RectangleToolComponent extends ShapeToolComponent {

  @Input() tool: RectangleToolComponent;

  constructor(private rectangleService: RectangleService) {
    super();
    this.name = 'Rectangle';
  }

  initializeRenderer(renderer: Renderer2): void {
    this.rectangleService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    return this.rectangleService.onMouseDownInElement();
  }

  onMouseDown(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    return this.rectangleService.onMouseDown(event, this, primaryColor, secondaryColor);
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    return this.rectangleService.onMouseUp();
  }

  onShiftDown(event: KeyboardEvent): SVGPathElement {
    return this.rectangleService.onShiftDown();
  }

  onShiftUp(event: KeyboardEvent): SVGPathElement {
    return this.rectangleService.onShiftUp();
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.rectangleService.onMouseMove(event);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.rectangleService.onMouseLeave();
  }

  onMouseEnter(event: MouseEvent): SVGPathElement {
    return this.rectangleService.onMouseEnter();
  }
}
