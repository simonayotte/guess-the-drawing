import { Component, Input, Renderer2 } from '@angular/core';
import { PaintBrushService } from 'src/app/services/tools/paintbrush-service/paint-brush.service';
import { Color } from '../../color-picker/color';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';

@Component({
  selector: 'app-paint-brush',
  templateUrl: './paint-brush.component.html',
  styleUrls: ['./paint-brush.component.scss']
})
export class PaintBrushComponent extends DrawingToolComponent {

  textures: string[] = ['texture1', 'texture2', 'texture3', 'texture4', 'texture5'];
  @Input() tool: PaintBrushComponent;
  @Input() texture: string;

  constructor(private paintBrushService: PaintBrushService) {
    super();
    this.name = 'Pinceau';
    this.texture = this.textures[0];
   }

   onTextureChange(): void {
     this.tool.texture = this.texture;
   }

   initializeRenderer(renderer: Renderer2): void {
    this.paintBrushService.initializeRenderer(renderer);
  }

  onMouseDownInElement(event: MouseEvent, primaryColor: Color): SVGPathElement {
    return this.paintBrushService.onMouseDownInElement(event, this, primaryColor);
  }

  onMouseUp(event: MouseEvent): SVGPathElement {
    return this.paintBrushService.onMouseUp(event);
  }

  onMouseMove(event: MouseEvent): SVGPathElement {
    return this.paintBrushService.onMouseMove(event);
  }

  onMouseLeave(event: MouseEvent): SVGPathElement {
    return this.paintBrushService.onMouseUp(event);
  }

  onMouseEnter(event: MouseEvent, primaryColor: Color): SVGPathElement {
    return this.paintBrushService.onMouseEnter(event, this, primaryColor);
  }
}
