import { Component, Input, Renderer2 } from '@angular/core';
import { PencilService } from 'src/app/services/tools/pencil-service/pencil.service';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss']
})
export class PencilComponent extends DrawingToolComponent {
  @Input() tool: PencilComponent;

   renderer: Renderer2;
  constructor(private pencilService: PencilService, ) {
    super();
    this.name = 'Crayon';
  }

  initializeRenderer(renderer: Renderer2): void {
    this.pencilService.initializeRenderer(renderer);
  }

  onMouseEnter(event: MouseEvent): SVGPathElement | null {
    return this.pencilService.onMouseEnter(event, this);
  }

  onMouseDownInElement(event: MouseEvent): SVGPathElement {
    return this.pencilService.onMouseDownInElement(event, this);
  }

  onMouseUp(event: MouseEvent): SVGPathElement | null {
    return this.pencilService.onMouseUp(event);
  }

  onMouseMove(event: MouseEvent): SVGPathElement | null {
    return this.pencilService.onMouseMove(event);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement | null {
    return this.pencilService.onMouseUp(event);
  }
}
