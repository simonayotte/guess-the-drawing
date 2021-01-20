import { Component, Input, Renderer2 } from '@angular/core';
import { EllipseService } from 'src/app/services/tools/ellipse/ellipse.service';
import { Color } from '../../../color-picker/color';
import { ShapeToolComponent } from '../../shape-tool/shape-tool.component';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.css']
})
export class EllipseComponent extends ShapeToolComponent {

  @Input() tool: EllipseComponent;

  constructor(private ellipseService: EllipseService) {
    super();
    this.name = 'Ellipse';
  }

  initializeRenderer(renderer: Renderer2): void {
    this.ellipseService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    return this.ellipseService.onMouseDownInElement();
  }

  onMouseDown(event: MouseEvent, primaryColor: Color, secondaryColor: Color): SVGPathElement {
    return this.ellipseService.onMouseDown(event, this, primaryColor, secondaryColor);
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    return this.ellipseService.onMouseUp();
  }

  onShiftDown(event: KeyboardEvent): SVGPathElement {
    return this.ellipseService.onShiftDown();
  }

  onShiftUp(event: KeyboardEvent): SVGPathElement {
    return this.ellipseService.onShiftUp();
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.ellipseService.onMouseMove(event);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.ellipseService.onMouseLeave();
  }

  onMouseEnter(event: MouseEvent): SVGPathElement {
    return this.ellipseService.onMouseEnter();
  }
}
